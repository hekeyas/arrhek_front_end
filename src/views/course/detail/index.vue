<template>
    <div class="app-container">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>课程详情</span>
            </div>
            <el-form :model="course" label-width="100px" class="course-detail-form">
                <el-form-item label="课程编码">
                    <dict-tag :options="learning_goal" :value="course.learningGoal"/>
                </el-form-item>
                <el-form-item label="价格">
                    <span>{{ course.price }} 元</span>
                </el-form-item>
                <el-form-item label="教学风格">
                    <dict-tag :options="learning_style" :value="course.learningStyle"/>
                </el-form-item>
                <el-form-item label="课程介绍">
                    <span>{{ course.info }}</span>
                </el-form-item>
                <el-form-item label="创建时间">
                    <span>{{ parseTime(course.createTime, '{y}-{m}-{d}') }}</span>
                </el-form-item>
                <el-form-item label="更新时间">
                    <span>{{ parseTime(course.updateTime, '{y}-{m}-{d}') }}</span>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup>
const { proxy } = getCurrentInstance();
import { ref, onMounted } from "vue";
import { getCourse } from "@/api/course/course";
const { learning_style, learning_goal } = proxy.useDict('learning_style', 'sys_user_sex', 'learning_goal');
import { parseTime } from "@/utils/ruoyi";

const course = ref({
    code: "",
    name: "",
    learningGoal: "",
    price: 0,
    learningStyle: "",
    info: "",
    createTime: "",
    updateTime: ""
});


const courseId = "1"; // 示例课程ID，可根据实际需求动态传入

onMounted(() => {
    fetchCourseDetail();
});

function fetchCourseDetail() {
    getCourse(courseId).then((response) => {
        course.value = response.data;
    });
}
</script>

<style scoped>
.course-detail-form {
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.course-detail-form .el-form-item {
    margin-bottom: 20px;
}
</style>