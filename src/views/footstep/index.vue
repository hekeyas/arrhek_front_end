<template>
  <div class="app-container">
    <el-card class="header-card" shadow="hover">
      <div class="statistics">
        <div class="stat-item">
          <div class="stat-value">{{ statistics.totalCourses }}</div>
          <div class="stat-label">学习课程数</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ statistics.totalHours }}</div>
          <div class="stat-label">总学习时长(小时)</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ statistics.completedCourses }}</div>
          <div class="stat-label">已完成课程</div>
        </div>
      </div>
    </el-card>

    <!-- 学习时间线 -->
    <el-card class="timeline-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>学习足迹</span>
          <!-- <el-radio-group v-model="timelineType" size="small">
            <el-radio-button label="week">周</el-radio-button>
            <el-radio-button label="month">月</el-radio-button>
            <el-radio-button label="year">年</el-radio-button>
          </el-radio-group> -->
        </div>
      </template>
      
      <el-timeline>
        <el-timeline-item
          v-for="course in learningHistory"
          :key="course.id"
          :timestamp="course.startTime"
          :type="getTimelineItemType(course.status)"
        >
          <el-card class="timeline-item-card">
            <template #header>
              <div class="timeline-item-header">
                <span>{{ course.name }}</span>
                <el-tag :type="getStatusType(course.status)">{{ course.status }}</el-tag>
              </div>
            </template>
            <div class="timeline-item-content">
              <div class="course-info">
                <el-icon><Clock /></el-icon>
                <span>学习时长：{{ course.duration }}小时</span>
              </div>
              <div class="course-info">
                <el-icon><Collection /></el-icon>
                <span>课程分类：{{ course.category }}</span>
              </div>
              <div class="progress-info">
                <span>学习进度</span>
                <el-progress 
                  :percentage="course.progress"
                  :status="getProgressStatus(course.progress)"
                />
              </div>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Clock, Collection } from '@element-plus/icons-vue'

// 统计数据
const statistics = ref({
  totalCourses: 12,
  totalHours: 168,
  completedCourses: 8
})

// 时间线类型
const timelineType = ref('month')

// 学习历史数据
const learningHistory = ref([
  {
    id: 1,
    name: 'Vue3 实战教程',
    startTime: '2025-05-01',
    duration: 24,
    category: '前端开发',
    status: '已完成',
    progress: 100
  },
  {
    id: 2,
    name: 'JavaSE基础',
    startTime: '2025-05-15',
    duration: 36,
    category: '后端开发',
    status: '学习中',
    progress: 60
  },
  {
    id: 3,
    name: '微服务架构实践',
    startTime: '2025-05-01',
    duration: 48,
    category: '系统架构',
    status: '未开始',
    progress: 0
  }
])

// 获取时间线项目类型
const getTimelineItemType = (status) => {
  switch (status) {
    case '已完成':
      return 'success'
    case '学习中':
      return 'warning'
    default:
      return 'info'
  }
}

// 获取状态标签类型
const getStatusType = (status) => {
  switch (status) {
    case '已完成':
      return 'success'
    case '学习中':
      return 'warning'
    default:
      return 'info'
  }
}

// 获取进度条状态
const getProgressStatus = (progress) => {
  if (progress === 100) return 'success'
  if (progress > 60) return 'warning'
  return ''
}
</script>

<style scoped>
.app-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.header-card {
  margin-bottom: 20px;
}

.statistics {
  display: flex;
  justify-content: space-around;
  padding: 20px 0;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #606266;
}

.timeline-card {
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timeline-item-card {
  margin-bottom: 10px;
}

.timeline-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timeline-item-content {
  padding: 10px 0;
}

.course-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: #606266;
}

.progress-info {
  margin-top: 15px;
}

.progress-info span {
  display: block;
  margin-bottom: 5px;
  color: #606266;
}

:deep(.el-timeline-item__node) {
  background-color: transparent;
}

:deep(.el-timeline-item__node--success) {
  background-color: #67C23A;
}

:deep(.el-timeline-item__node--warning) {
  background-color: #E6A23C;
}

:deep(.el-card) {
  transition: all 0.3s;
}

:deep(.el-card:hover) {
  transform: translateY(-2px);
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}
</style>