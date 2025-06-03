<template>
  <div class="app-container">
    <el-card class="profile-header" shadow="hover">
      <div class="user-info">
        <el-avatar :size="80" :src="userInfo.avatar" />
        <div class="info-content">
          <h2>{{ userInfo.nickname }}</h2>
          <div class="tags">
            <el-tag v-if="userInfo.level" type="success">Level {{ userInfo.level }}</el-tag>
            <el-tag v-if="userInfo.learningDays" type="warning">已坚持学习 {{ userInfo.learningDays }} 天</el-tag>
          </div>
        </div>
      </div>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px;">
      <!-- 学习偏好 -->
      <el-col :span="8">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>学习偏好分析</span>
              <el-tooltip content="基于用户的课程选择和学习行为分析">
                <el-icon><InfoFilled /></el-icon>
              </el-tooltip>
            </div>
          </template>
          <div ref="preferenceChartRef" class="chart-container"></div>
        </el-card>
      </el-col>

      <!-- 知识分布 -->
      <el-col :span="8">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>知识领域分布</span>
              <el-tooltip content="用户已掌握的知识领域分布">
                <el-icon><InfoFilled /></el-icon>
              </el-tooltip>
            </div>
          </template>
          <div ref="knowledgeChartRef" class="chart-container"></div>
        </el-card>
      </el-col>

      <!-- 学习时间分布 -->
      <el-col :span="8">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>学习时间分布</span>
              <el-tooltip content="一天中的学习时间分布情况">
                <el-icon><InfoFilled /></el-icon>
              </el-tooltip>
            </div>
          </template>
          <div ref="timeDistributionChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 能力雷达图 -->
    <el-card class="chart-card" shadow="hover" style="margin-top: 20px;">
      <template #header>
        <div class="card-header">
          <span>综合能力评估</span>
          <el-tooltip content="多维度能力评估">
            <el-icon><InfoFilled /></el-icon>
          </el-tooltip>
        </div>
      </template>
      <div ref="skillRadarChartRef" style="height: 400px;"></div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import { InfoFilled } from '@element-plus/icons-vue';

// 用户基本信息
const userInfo = ref({
  nickname: '张三',
  avatar: 'https://example.com/avatar.jpg',
  level: 3,
  learningDays: 120
});

// 图表引用
const preferenceChartRef = ref(null);
const knowledgeChartRef = ref(null);
const timeDistributionChartRef = ref(null);
const skillRadarChartRef = ref(null);

// 图表实例数组
let charts = [];

// 模拟数据
const preferenceData = [
  { value: 40, name: '视频学习' },
  { value: 30, name: '实战练习' },
  { value: 20, name: '文档阅读' },
  { value: 10, name: '在线讨论' }
];

const knowledgeData = [
  { value: 35, name: '前端开发' },
  { value: 25, name: '后端开发' },
  { value: 20, name: '数据库' },
  { value: 15, name: '运维部署' },
  { value: 5, name: '项目管理' }
];

const timeDistributionData = [
  { hour: '9:00', value: 30 },
  { hour: '12:00', value: 15 },
  { hour: '15:00', value: 45 },
  { hour: '18:00', value: 25 },
  { hour: '21:00', value: 35 }
];

const skillData = {
  titles: ['编程能力', '学习能力', '沟通能力', '问题解决', '团队协作', '创新思维'],
  values: [85, 90, 75, 80, 85, 70]
};

function initCharts() {
  // 清除旧的图表实例
  charts.forEach(chart => chart.dispose());
  charts = [];

  // 初始化学习偏好饼图
  const preferenceChart = echarts.init(preferenceChartRef.value);
  charts.push(preferenceChart);
  preferenceChart.setOption({
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [{
      type: 'pie',
      radius: '50%',
      data: preferenceData,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  });

  // 初始化知识分布图
  const knowledgeChart = echarts.init(knowledgeChartRef.value);
  charts.push(knowledgeChart);
  knowledgeChart.setOption({
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      label: { show: false },
      labelLine: { show: false },
      data: knowledgeData
    }]
  });

  // 初始化时间分布图
  const timeDistributionChart = echarts.init(timeDistributionChartRef.value);
  charts.push(timeDistributionChart);
  timeDistributionChart.setOption({
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: timeDistributionData.map(item => item.hour)
    },
    yAxis: { type: 'value' },
    series: [{
      data: timeDistributionData.map(item => item.value),
      type: 'line',
      smooth: true,
      areaStyle: {}
    }]
  });

  // 初始化能力雷达图
  const skillRadarChart = echarts.init(skillRadarChartRef.value);
  charts.push(skillRadarChart);
  skillRadarChart.setOption({
    radar: {
      indicator: skillData.titles.map(title => ({ name: title, max: 100 }))
    },
    series: [{
      type: 'radar',
      data: [{
        value: skillData.values,
        name: '能力评估',
        areaStyle: {
          color: 'rgba(64,158,255,0.2)'
        },
        lineStyle: {
          color: '#409EFF'
        }
      }]
    }]
  });
}

// 监听窗口大小变化
function handleResize() {
  charts.forEach(chart => chart.resize());
}

onMounted(() => {
  initCharts();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  charts.forEach(chart => chart.dispose());
});
</script>

<style scoped>
.app-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.profile-header {
  margin-bottom: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.info-content {
  h2 {
    margin: 0 0 10px 0;
    font-size: 24px;
    color: #303133;
  }
}

.tags {
  display: flex;
  gap: 10px;
}

.chart-card {
  height: 100%;
  transition: all 0.3s ease;
}

.chart-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}

.chart-container {
  height: 300px;
}

:deep(.el-card__header) {
  padding: 15px 20px;
  border-bottom: 1px solid #ebeef5;
}
</style>