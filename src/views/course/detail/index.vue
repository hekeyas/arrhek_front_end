<template>
    <div class="app-container">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>课程详情</span>
            </div>
            <el-row>
                <el-col :span="16">
                    <el-form :model="course" label-width="100px" class="course-detail-form">
                        <el-form-item label="课程编码">
                            <dict-tag :options="learning_goal" :value="course.learningGoal" />
                        </el-form-item>
                        <el-form-item label="价格">
                            <span>{{ course.price }} 元</span>
                        </el-form-item>
                        <el-form-item label="教学风格">
                            <dict-tag :options="learning_style" :value="course.learningStyle" />
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
                </el-col>
                <el-col :span="8" style="text-align: center;">
                    <image-preview :src="course.avator"
                        style="max-height: 350px; height: 100%; object-fit: contain; border-radius: 8px;" />
                </el-col>
            </el-row>
        </el-card>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>课程评论</span>
            </div>
            <el-table :data="comments" style="width: 100%">
                <el-table-column prop="userName" label="评论人" width="180"></el-table-column>
                <el-table-column prop="content" label="内容"></el-table-column>
                <el-table-column prop="rating" label="评分" width="180">
                    <template #default="scope">
                        <el-rate v-model="scope.row.rating" disabled show-score
                            :colors="['#F56C6C', '#E6A23C', '#67C23A']" />
                    </template>
                </el-table-column>

                <el-table-column prop="createTime" label="评论时间" width="180"></el-table-column>
            </el-table>
        </el-card>

        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>撰写评论</span>
            </div>
            <el-form :model="personal_comments" label-width="100px" class="course-detail-form">
                <el-form-item label="评论人">
                    <el-input type="textarea" disabled v-model="userStore.name"></el-input>
                </el-form-item>
                <el-form-item label="评论内容">
                    <el-input type="textarea" v-model="personal_comments.content"></el-input>
                </el-form-item>
                <el-form-item label="评分">
                    <el-rate v-model="personal_comments.rating" show-score
                        :colors="['#F56C6C', '#E6A23C', '#67C23A']"></el-rate>
                </el-form-item>
                <el-form-item>
                    <el-button @click="handleAdd" type="primary">提交评论</el-button>
                </el-form-item>
            </el-form>
        </el-card>

    </div>
</template>

<script setup>
import { avatarProps, ElMessage } from "element-plus";
const { proxy } = getCurrentInstance();
import { ref, onMounted } from "vue";
import { getCourse } from "@/api/course/course";
const { learning_style, learning_goal } = proxy.useDict('learning_style', 'sys_user_sex', 'learning_goal');
import { parseTime } from "@/utils/ruoyi";
import { getCurrentInstance } from "vue";
import { addComment, listComment } from "@/api/comment/comment";
import useUserStore from "@/store/modules/user";
import { useRoute } from "vue-router";

const userStore = useUserStore();


const comments = ref([
    {
        "userName": "张三",
        "content": "课程不错难度适中",
        "rating": 1,
        "createTime": "2025-04-23 10:00:00"
    },
    {
        "userName": "李四",
        "content": "课程不错，老师声音好听",
        "rating": 5,
        "createTime": "2025-04-22 15:30:00"
    }
]);

const personal_comments = ref({
    content: "",
    rating: 0
});


const course = ref({
    code: "",
    name: "",
    learningGoal: "",
    price: 0,
    learningStyle: "",
    info: "",
    createTime: "",
    updateTime: "",
    avator: "",
});




const courseId = useRoute().query.id; // 示例课程ID，可根据实际需求动态传入

onMounted(() => {
    fetchCourseDetail();
    listComment({ courseId: courseId }).then(response => {
        comments.value = response.rows;
    });
});

function fetchCourseDetail() {
    getCourse(courseId).then((response) => {
        console.log(response);
        course.value = response.data;
    });
}

function handleAdd() {
    if (!personal_comments.value.content || personal_comments.value.rating === 0) {
        ElMessage.error("请填写完整的评论内容和评分！");
        return;
    }

    const commentData = {
        courseId: courseId,
        userName: userStore.name, // 从 userStore 获取用户名
        userId: userStore.id, // 从 userStore 获取用户ID
        content: personal_comments.value.content,
        rating: personal_comments.value.rating
    };

    addComment(commentData).then((response) => {
        if (response.code === 200) {
            ElMessage.success("评论提交成功！");
            // 清空评论表单
            personal_comments.value.content = "";
            personal_comments.value.rating = 0;
            // 刷新评论列表
            comments.value.push({
                userName: userStore.name,
                content: commentData.content,
                rating: commentData.rating,
                createTime: new Date().toISOString()
            });
        } else {
            ElMessage.error(response.msg || "评论提交失败！");
        }
    }).catch((error) => {
        ElMessage.error("评论提交失败，请稍后重试！");
        console.error(error);
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