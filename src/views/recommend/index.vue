  <template>
    <div>
      <div class="course-recommend">
        <!-- 页面标题 -->
        <h1 class="title">热门类别课程推荐</h1>

        <!-- 筛选栏（简单版） -->
        <div class="filter-bar">
          <select v-model="selectedCategory">
            <option value="">全部分类</option>
            <option v-for="cat in learning_goal_keys" :key="cat" :value="cat">
              <dict-tag :options="learning_goal" :value="cat" />
            </option>
          </select>
        </div>

        <!-- 课程列表 -->
        <div class="course-list">
          <div class="course-card" v-for="course in filteredCourses" :key="course.id"
            @click="$router.push({ path: '/course/detail', query: { id: course.id } })">
            <image-preview :src="course.avator" class="crouse-cover" />
            <div class="course-info">
              <h2 class="course-title">{{ course.name }}</h2>
              <p class="course-desc">{{ course.info }}</p>
              <div class="course-meta">
                <span>
                  学习风格:<dict-tag :options="learning_style" :value="course.learningStyle" />
                </span>
                <span>
                  学习目标:
                  <dict-tag :options="learning_goal" :value="course.learningGoal" />
                </span>
              </div>
              <div class="course-price">
                {{ course.price > 0 ? '￥' + course.price : '免费' }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="course-recommend">
        <!-- 页面标题 -->
        <h1 class="title">热门风格课程推荐</h1>

        <!-- 筛选栏（简单版） -->
        <div class="filter-bar">
          <select v-model="selectedType">
            <option value="">全部风格</option>
            <option v-for="cat in learning_style_keys" :key="cat" :value="cat">
              <dict-tag :options="learning_style" :value="cat" />
            </option>
          </select>
        </div>

        <!-- 课程列表 -->
        <div class="course-list">
          <div class="course-card" v-for="course in filteredCourses_" :key="course.id"
            @click="$router.push({ path: '/course/detail', query: { id: course.id } })">
            <image-preview :src="course.avator" class="crouse-cover" />
            <div class="course-info">
              <h2 class="course-title">{{ course.name }}</h2>
              <p class="course-desc">{{ course.info }}</p>
              <div class="course-meta">
                <span>
                  学习风格:<dict-tag :options="learning_style" :value="course.learningStyle" />
                </span>
                <span>
                  学习目标:
                  <dict-tag :options="learning_goal" :value="course.learningGoal" />
                </span>
              </div>
              <div class="course-price">
                {{ course.price > 0 ? '￥' + course.price : '免费' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </template>

<script setup>
import { ref, computed } from 'vue';
import { listCourse } from '@/api/course/course';
const { proxy } = getCurrentInstance();
const { learning_style, learning_goal } = proxy.useDict('learning_style', 'learning_goal');
// console.log("dict", learning_style, learning_goal);


const learning_style_keys = ref(["0","1"]);

const learning_goal_keys = ref(["0","1","2"]);




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

/** 查询课程管理列表 */
function getList() {
  listCourse(queryParams.value).then(response => {
    // console.log(response);
    courseList.value = response.rows;
  });
}


const selectedCategory = ref('');
const courseList = ref([]);


const filteredCourses = computed(() => {
  console.log(selectedCategory.value);
  if (!selectedCategory.value) return courseList.value;
  return courseList.value.filter(

    (course) => {
      // console.log(course.learningGoal, selectedCategory.value,course.learningGoal == selectedCategory.value);
      return course.learningGoal == selectedCategory.value
    }
  );
});

const selectedType = ref('');
const filteredCourses_ = computed(() => {
  console.log(selectedType.value);
  if (!selectedType.value) return courseList.value;
  return courseList.value.filter(
    (course) => {
      // console.log(course.learningStyle, selectedType.value,course.learningStyle == selectedType.value);
      return course.learningStyle == selectedType.value
    }
  );
});

getList();
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