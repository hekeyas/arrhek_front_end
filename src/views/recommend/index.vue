<template>
    <div class="course-recommend">
      <!-- 页面标题 -->
      <h1 class="title">热门推荐课程</h1>
  
      <!-- 筛选栏（简单版） -->
      <div class="filter-bar">
        <select v-model="selectedCategory">
          <option value="">全部分类</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>
  
      <!-- 课程列表 -->
      <div class="course-list">
        <div
          class="course-card"
          v-for="course in filteredCourses"
          :key="course.id"
        >
          <img :src="course.cover" alt="封面图" class="course-cover" />
          <div class="course-info">
            <h2 class="course-title">{{ course.title }}</h2>
            <p class="course-desc">{{ course.description }}</p>
            <div class="course-meta">
              <span>{{ course.students }}人学习</span>
              <span>评分 {{ course.rating }}</span>
            </div>
            <div class="course-price">
              {{ course.price > 0 ? '￥' + course.price : '免费' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'CourseRecommend',
    data() {
      return {
        selectedCategory: '',
        categories: ['前端开发', '后端开发', '人工智能', '产品设计'],
        courses: [
          {
            id: 1,
            title: 'Vue3 入门到实战',
            description: '零基础掌握 Vue3 开发技能',
            cover: 'https://via.placeholder.com/300x180.png?text=Vue3',
            students: 1200,
            rating: 4.8,
            price: 199,
            category: '前端开发'
          },
          {
            id: 2,
            title: 'Spring Boot 核心教程',
            description: '快速上手企业级后端开发',
            cover: 'https://via.placeholder.com/300x180.png?text=SpringBoot',
            students: 850,
            rating: 4.5,
            price: 299,
            category: '后端开发'
          },
          {
            id: 3,
            title: 'AI入门与实战',
            description: '人工智能基础到项目实践',
            cover: 'https://via.placeholder.com/300x180.png?text=AI',
            students: 500,
            rating: 4.7,
            price: 0,
            category: '人工智能'
          }
        ]
      };
    },
    computed: {
      filteredCourses() {
        if (!this.selectedCategory) return this.courses;
        return this.courses.filter(
          (course) => course.category === this.selectedCategory
        );
      }
    }
  };
  </script>
  
  <style scoped>
  .course-recommend {
    padding: 20px;
  }
  .title {
    font-size: 24px;
    margin-bottom: 20px;
  }
  .filter-bar {
    margin-bottom: 20px;
  }
  .course-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
  .course-card {
    width: 300px;
    border: 1px solid #eee;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.3s;
  }
  .course-card:hover {
    transform: scale(1.05);
  }
  .course-cover {
    width: 100%;
    height: 180px;
    object-fit: cover;
  }
  .course-info {
    padding: 10px;
  }
  .course-title {
    font-size: 18px;
    margin: 5px 0;
  }
  .course-desc {
    font-size: 14px;
    color: #666;
  }
  .course-meta {
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
    font-size: 12px;
    color: #999;
  }
  .course-price {
    font-size: 16px;
    color: #ff5722;
    font-weight: bold;
  }
  </style>
  