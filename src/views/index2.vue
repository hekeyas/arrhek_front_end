<template>
  <div class="app-container">
    <h1 class="title">学习数据分析仪表盘</h1>
    
    <!-- 第一行 -->
    <el-row :gutter="20">
      <el-col :span="8">
        <div class="chart-box">
          <div ref="completionChartRef" style="height: 300px;"></div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="chart-box">
          <div ref="studyTimeChartRef" style="height: 300px;"></div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="chart-box">
          <div ref="contentTypeChartRef" style="height: 300px;"></div>
        </div>
      </el-col>
    </el-row>
    
    <!-- 第二行 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="chart-box">
          <div ref="knowledgeChartRef" style="height: 300px;"></div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="chart-box">
          <div ref="ratingChartRef" style="height: 300px;"></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script setup>
import * as echarts from 'echarts';
import { ref, onMounted, onUnmounted } from 'vue';

// 图表引用
const completionChartRef = ref(null);
const studyTimeChartRef = ref(null);
const contentTypeChartRef = ref(null);
const knowledgeChartRef = ref(null);
const ratingChartRef = ref(null);

// 图表实例数组
let charts = [];

// 模拟数据
const completionRate = ref(85);
const studyTimeData = ref([
  { date: '周一', hours: 2.5 },
  { date: '周二', hours: 3.0 },
  { date: '周三', hours: 2.0 },
  { date: '周四', hours: 4.5 },
  { date: '周五', hours: 3.5 },
  { date: '周六', hours: 5.0 },
  { date: '周日', hours: 4.0 },
]);
const contentTypeData = ref([
  { name: '视频课程', value: 40 },
  { name: '在线练习', value: 25 },
  { name: '文档阅读', value: 20 },
  { name: '实战项目', value: 15 },
]);
const knowledgeData = ref([
  { name: 'Java基础', score: 85 },
  { name: '数据结构', score: 75 },
  { name: '算法', score: 65 },
  { name: '框架使用', score: 80 },
  { name: '项目实践', score: 90 },
]);

// 初始化图表
function initCharts() {
  // 清除旧的图表实例
  charts.forEach(chart => chart.dispose());
  charts = [];
  
  // 1. 初始化完成率仪表盘
  const completionChart = echarts.init(completionChartRef.value);
  charts.push(completionChart);
  completionChart.setOption({
    title: { text: '学习计划完成情况' },
    series: [{
      type: 'gauge',
      detail: { 
        formatter: '{value}%',
        fontSize: 20
      },
      data: [{ value: completionRate.value, name: '完成率' }],
      axisLine: {
        lineStyle: {
          color: [[0.3, '#FF6E76'], [0.7, '#FDDD60'], [1, '#7CFFB2']]
        }
      }
    }]
  });

  // 2. 初始化每日学习时长折线图
  const studyTimeChart = echarts.init(studyTimeChartRef.value);
  charts.push(studyTimeChart);
  studyTimeChart.setOption({
    title: { text: '每日学习时长' },
    tooltip: { trigger: 'axis' },
    xAxis: { 
      type: 'category',
      data: studyTimeData.value.map(item => item.date)
    },
    yAxis: { 
      type: 'value',
      name: '小时'
    },
    series: [{
      type: 'line',
      smooth: true,
      data: studyTimeData.value.map(item => item.hours),
      areaStyle: {},
      itemStyle: {
        color: '#91CC75'
      }
    }]
  });

  // 3. 初始化学习内容类型饼图
  const contentTypeChart = echarts.init(contentTypeChartRef.value);
  charts.push(contentTypeChart);
  contentTypeChart.setOption({
    title: { text: '学习内容类型占比' },
    tooltip: { trigger: 'item' },
    series: [{
      type: 'pie',
      radius: '60%',
      data: contentTypeData.value,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  });

  // 4. 初始化知识点掌握雷达图
  const knowledgeChart = echarts.init(knowledgeChartRef.value);
  charts.push(knowledgeChart);
  knowledgeChart.setOption({
    title: { text: '知识点掌握情况' },
    radar: {
      indicator: knowledgeData.value.map(item => ({
        name: item.name,
        max: 100
      }))
    },
    series: [{
      type: 'radar',
      data: [{
        value: knowledgeData.value.map(item => item.score),
        name: '掌握程度',
        areaStyle: {}
      }]
    }]
  });

  // 5. 初始化课程评分条形图
  const ratingChart = echarts.init(ratingChartRef.value);
  charts.push(ratingChart);
  ratingChart.setOption({
    title: { text: '课程评分分布' },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'value', max: 100 },
    yAxis: { 
      type: 'category',
      data: knowledgeData.value.map(item => item.name)
    },
    series: [{
      type: 'bar',
      data: knowledgeData.value.map(item => item.score),
      label: {
        show: true,
        position: 'right'
      }
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
}

.title {
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
  color: #303133;
}

.chart-box {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  margin-bottom: 20px;
  transition: all 0.3s;
}

.chart-box:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}
</style>