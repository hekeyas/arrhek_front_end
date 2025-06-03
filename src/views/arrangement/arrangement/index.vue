<template>
    <div class="app-container">
        <h1 class="title">学习规划</h1>

        <!-- 课程选择 -->
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px">
                    <el-form-item label="课程分类" prop="learningGoal">
                        <el-select v-model="queryParams.learningGoal" placeholder="请选择课程分类" clearable>
                            <el-option v-for="dict in learning_goal" :key="dict.value" :label="dict.label"
                                :value="dict.value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="课程名称" prop="name">
                        <el-input v-model="queryParams.name" placeholder="请输入课程名称" clearable
                            @keyup.enter="handleQuery" />
                    </el-form-item>
                    <el-form-item label="教学风格" prop="learningStyle">
                        <el-select v-model="queryParams.learningStyle" placeholder="请选择教学风格" clearable>
                            <el-option v-for="dict in learning_style" :key="dict.value" :label="dict.label"
                                :value="dict.value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
                        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>

            <!-- 表格容器 -->
            <div class="table-container">
                <el-table :data="courseList" border style="width: 100%">
                    <el-table-column prop="name" label="课程名称" width="500"></el-table-column>
                    <el-table-column prop="learningStyle" label="风格" width="400">
                        <template #default="scope">
                            <dict-tag :options="learning_style" :value="scope.row.learningStyle" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="learningGoal" label="类别" width="300">
                        <template #default="scope">
                            <dict-tag :options="learning_goal" :value="scope.row.learningGoal" />
                        </template>
                    </el-table-column>
                </el-table>
                <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
                    v-model:limit="queryParams.pageSize" @pagination="getList" />
            </div>
        </el-card>
        <h2 class="title">课程安排</h2>
        <!-- 时间安排 -->
        <el-card class="box-card" style="margin-top: 20px;">

            <el-form :model="schedule" label-width="120px">
                <el-form-item label="选择课程">
                    <el-select v-model="schedule.courseId" placeholder="请选择课程">
                        <el-option v-for="course in filteredCourses" :key="course.id" :label="course.name"
                            :value="course.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="开始日期">
                    <el-date-picker v-model="schedule.startDate" type="date" placeholder="选择开始日期"
                        :disabled-date="disabledStartDate" />
                </el-form-item>
                <el-form-item label="持续时间（天）">
                    <el-input-number v-model="schedule.durationDays" :min="1" :max="100" placeholder="输入天数" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addSchedule">添加到规划</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <!-- 学习规划 -->
        <h2 class="title">学习规划列表</h2>
        <el-card class="box-card" style="margin-top: 20px;">
            <el-table :data="scheduleList" border style="width: 100%">
                <el-table-column prop="courseName" label="课程题目" width="200"></el-table-column>
                <el-table-column prop="startDate" label="开始日期" width="450"></el-table-column>
                <el-table-column prop="durationDays" label="持续时间（天）" width="450"></el-table-column>
                <el-table-column label="操作" width="150">
                    <template #default="scope">
                        <el-button type="danger" @click="removeSchedule(scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-button type="primary" @click="handleSubmit()" style="margin-top: 20px;">保存规划</el-button>
        </el-card>

    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import dayjs from "dayjs";
import { listCourse } from "@/api/course/course";
import {addPlan}from "@/api/plan/plan";
import { el } from "element-plus/es/locales.mjs";
import useUserStore from "@/store/modules/user";
import { addDetail } from "@/api/arrangement/detail";
import {ElMessage} from "element-plus";
const userStore = useUserStore();

console.log(userStore.id);
// 模拟课程数据
const courseList = ref([]);
const data = reactive({
    form: {},
    queryParams: {
        pageNum: 1,
        pageSize: 10,
        code: null,
        learningGoal: null,
        name: null,
        price: null,
        learningStyle: null,
        info: null,
    },
    rules: {
        code: [
            { required: true, message: "课程编码不能为空", trigger: "blur" }
        ],
        learningGoal: [
            { required: true, message: "课程分类不能为空", trigger: "change" }
        ],
        name: [
            { required: true, message: "课程名称不能为空", trigger: "blur" }
        ],
        price: [
            { required: true, message: "价格不能为空", trigger: "blur" }
        ],
        learningStyle: [
            { required: true, message: "教学风格不能为空", trigger: "change" }
        ],
    }
});
const { queryParams, form, rules } = toRefs(data);




/** 搜索按钮操作 */
function handleQuery() {
    queryParams.value.pageNum = 1;
    getList();
}

/** 重置按钮操作 */
function resetQuery() {
    proxy.resetForm("queryRef");
    handleQuery();
}

/** 查询课程管理列表 */
function getList() {
    listCourse(queryParams.value).then(response => {
        // console.log(response);
        courseList.value = response.rows;
    });
}

const total = computed(() => {
    return courseList.value.length;
});

// 字典数据
const { proxy } = getCurrentInstance();
const { learning_style, learning_goal } = proxy.useDict("learning_style", "learning_goal");



// 学习规划表单
const schedule = ref({
    courseId: null,
    startDate: null, // 开始日期
    durationDays: null, // 持续时间（天）
});

// 学习规划列表
const scheduleList = ref([]);

// 过滤掉已经安排的课程
const filteredCourses = computed(() => {
    return courseList.value.filter(
        (course) => !scheduleList.value.some((item) => item.courseName === course.name)
    );
});

// 禁用开始日期
function disabledStartDate(date) {
    const today = dayjs().startOf("day");
    const latestEndDate = getLatestEndDate();
    return date < today || (latestEndDate && date < latestEndDate);
}

// 获取规划中最晚的课程结束时间
function getLatestEndDate() {
    if (scheduleList.value.length === 0) return null;
    const latest = scheduleList.value.reduce((latest, item) => {
        const endDate = dayjs(item.startDate).add(item.duration, "day");
        return endDate.isAfter(latest) ? endDate : latest;
    }, dayjs(0)); // 初始值为最早时间
    return latest.startOf("day");
}

// 添加到学习规划
function addSchedule() {
    const selectedCourse = courseList.value.find(
        (course) => course.id === schedule.value.courseId
    );

    if (!selectedCourse) {
        return; // 如果未选择课程，直接返回
    }

    // 添加到学习规划
    scheduleList.value.push({
        courseId: schedule.value.courseId,
        courseName: selectedCourse.name,
        startDate: schedule.value.startDate,
        durationDays: schedule.value.durationDays,
    });

    // 清空表单
    schedule.value.courseId = null;
    schedule.value.startDate = null;
    schedule.value.duration = null;
}

// 删除学习规划
function removeSchedule(index) {
    scheduleList.value.splice(index, 1);
}

// 处理课程选择
function handleSelectionChange(selected) {
    selectedCourses.value = selected;
    console.log("Selected Courses:", selectedCourses.value);
}

function handleSubmit() {
    console.log(scheduleList.value);
    addPlan({
        userId: userStore.id,
        learningScheduleDetailList: scheduleList.value,
    }).then(response => {
        if (response.code === 200) {
            // 提交成功
            ElMessage.success("学习规划保存成功");
            // 清空学习规划列表
            scheduleList.value = [];
        } else {
            // 提交失败
            ElMessage.error("学习规划保存失败");
        }
    })
}
getList();
</script>

<style scoped>
.app-container {
    padding: 20px;
}

.title {
    font-size: 24px;
    margin-bottom: 20px;
}

.box-card {
    margin-bottom: 20px;
}

.table-container {
    width: 100%;
    display: flex;
    justify-content: center;
    /* 水平居中 */
    align-items: center;
    /* 垂直居中 */
    flex-direction: column;
    /* 让内容垂直排列 */
}
</style>