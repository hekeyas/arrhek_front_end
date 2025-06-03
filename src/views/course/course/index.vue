<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="课程编码" prop="code">
        <el-input v-model="queryParams.code" placeholder="请输入课程编码" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="课程分类" prop="learningGoal">
        <el-select v-model="queryParams.learningGoal" placeholder="请选择课程分类" clearable>
          <el-option v-for="dict in learning_goal" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="课程名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入课程名称" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-input v-model="queryParams.price" placeholder="请输入价格" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="教学风格" prop="learningStyle">
        <el-select v-model="queryParams.learningStyle" placeholder="请选择教学风格" clearable>
          <el-option v-for="dict in learning_style" :key="dict.value" :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="课程介绍" prop="info">
        <el-input v-model="queryParams.info" placeholder="请输入课程介绍" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['course:course:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
          v-hasPermi="['course:course:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['course:course:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Download" @click="handleExport"
          v-hasPermi="['course:course:export']">导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="courseList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="课程id" align="center" prop="id" />
      <el-table-column label="课程编码" align="center" prop="code" />
      <el-table-column label="课程分类" align="center" prop="learningGoal">
        <template #default="scope">
          <dict-tag :options="learning_goal" :value="scope.row.learningGoal" />
        </template>
      </el-table-column>
      <el-table-column label="课程名称" align="center" prop="name" />
      <el-table-column label="价格" align="center" prop="price" />
      <el-table-column label="教学风格" align="center" prop="learningStyle">
        <template #default="scope">
          <dict-tag :options="learning_style" :value="scope.row.learningStyle" />
        </template>
      </el-table-column>
      <el-table-column label="课程介绍" align="center" prop="info" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" prop="updateTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="课程图片" align="center" prop="avator" width="100">
        <template #default="scope">
          <image-preview :src="scope.row.avator" :width="50" :height="50" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" style="width: 80px; text-align: center;"
            @click="handleUpdate(scope.row)" v-hasPermi="['course:course:edit']">修改</el-button>
          <br />
          <el-button link type="primary" icon="Delete" style="width: 80px; text-align: center;"
            @click="handleDelete(scope.row)" v-hasPermi="['course:course:remove']">删除</el-button>
          <br />
          <el-button link type="primary" icon="View" style="width: 80px; text-align: center;"
            @click="$router.push({ path: '/course/detail', query: { id: scope.row.id } })">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改课程管理对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="courseRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="课程编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入课程编码" />
        </el-form-item>
        <el-form-item label="课程分类" prop="learningGoal">
          <el-select v-model="form.learningGoal" placeholder="请选择课程分类">
            <el-option v-for="dict in learning_goal" :key="dict.value" :label="dict.label"
              :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入课程名称" />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="form.price" placeholder="请输入价格" />
        </el-form-item>
        <el-form-item label="教学风格" prop="learningStyle">
          <el-select v-model="form.learningStyle" placeholder="请选择教学风格">
            <el-option v-for="dict in learning_style" :key="dict.value" :label="dict.label"
              :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程介绍" prop="info">
          <el-input v-model="form.info" placeholder="请输入课程介绍" />
        </el-form-item>
        <el-form-item label="课程图片" prop="avator">
          <image-upload v-model="form.avator" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Course">
import { listCourse, getCourse, delCourse, addCourse, updateCourse } from "@/api/course/course";

const { proxy } = getCurrentInstance();
const { learning_style, learning_goal } = proxy.useDict('learning_style', 'learning_goal');

const courseList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

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
  loading.value = true;
  listCourse(queryParams.value).then(response => {
    console.log(response);
    courseList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    code: null,
    learningGoal: null,
    name: null,
    price: null,
    learningStyle: null,
    info: null,
    createTime: null,
    updateTime: null,
    avator: null
  };
  proxy.resetForm("courseRef");
}

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

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加课程管理";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getCourse(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改课程管理";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["courseRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateCourse(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addCourse(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除课程管理编号为"' + _ids + '"的数据项？').then(function () {
    return delCourse(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => { });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('course/course/export', {
    ...queryParams.value
  }, `course_${new Date().getTime()}.xlsx`)
}

getList();
</script>
