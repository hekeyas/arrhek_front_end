<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="具体日期" prop="date">
        <el-date-picker clearable
          v-model="queryParams.date"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择具体日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['plan:plan:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['plan:plan:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['plan:plan:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['plan:plan:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="planList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="具体日期" align="center" prop="date" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.date, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学习状态" align="center" prop="status" />
      <el-table-column label="学习内容或备注" align="center" prop="content" />
      <el-table-column label="创建时间" align="center" prop="createdAt" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createdAt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" prop="updatedAt" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.updatedAt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" style="width: 80px; text-align: center;" @click="$router.push({ path: '/arrangement/detail', query: { planId: scope.row.id } })" v-hasPermi="['plan:plan:edit']">修改</el-button>
          <br/>
          <el-button link type="primary" icon="Delete" style="width: 80px; text-align: center;" @click="handleDelete(scope.row)" v-hasPermi="['plan:plan:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改学习规划安排对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="planRef" :model="form" :rules="rules" label-width="80px">
        <el-divider content-position="center">学习规划安排详情信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="Plus" @click="handleAddLearningScheduleDetail">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="Delete" @click="handleDeleteLearningScheduleDetail">删除</el-button>
          </el-col>
        </el-row>
        <el-table :data="learningScheduleDetailList" :row-class-name="rowLearningScheduleDetailIndex" @selection-change="handleLearningScheduleDetailSelectionChange" ref="learningScheduleDetail">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="课程ID" prop="courseId" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.courseId" placeholder="请输入课程ID" />
            </template>
          </el-table-column>
          <el-table-column label="开始日期" prop="startDate" width="240">
            <template #default="scope">
              <el-date-picker clearable
                v-model="scope.row.startDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择开始日期">
              </el-date-picker>
            </template>
          </el-table-column>
          <el-table-column label="持续时间" prop="durationDays" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.durationDays" placeholder="请输入持续时间" />
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createdAt" width="240">
            <template #default="scope">
              <el-date-picker clearable
                v-model="scope.row.createdAt"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择创建时间">
              </el-date-picker>
            </template>
          </el-table-column>
          <el-table-column label="更新时间" prop="updatedAt" width="240">
            <template #default="scope">
              <el-date-picker clearable
                v-model="scope.row.updatedAt"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择更新时间">
              </el-date-picker>
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="status" width="150">
            <template #default="scope">
              <el-select v-model="scope.row.status" placeholder="请选择状态">
                <el-option label="请选择字典生成" value="" />
              </el-select>
            </template>
          </el-table-column>
        </el-table>
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

<script setup name="Plan">
import { listPlan, getPlan, delPlan, addPlan, updatePlan } from "@/api/plan/plan";
import useUserStore from "@/store/modules/user";
import { ref } from "vue";


const userStore = useUserStore();

const { proxy } = getCurrentInstance();

const planList = ref([]);
const learningScheduleDetailList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const checkedLearningScheduleDetail = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

// console.log(userStore.userId);
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    date: null,
    status: null,
    content: null,
    userId:userStore.id,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询学习规划安排列表 */
function getList() {
  loading.value = true;
  console.log(userStore.id);
  listPlan(queryParams.value).then(response => {
    planList.value = response.rows;
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
    date: null,
    status: null,
    content: null,
    createdAt: null,
    updatedAt: null
  };
  learningScheduleDetailList.value = [];
  proxy.resetForm("planRef");
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
  title.value = "添加学习规划安排";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getPlan(_id).then(response => {
    form.value = response.data;
    learningScheduleDetailList.value = response.data.learningScheduleDetailList;
    open.value = true;
    title.value = "修改学习规划安排";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["planRef"].validate(valid => {
    if (valid) {
      form.value.learningScheduleDetailList = learningScheduleDetailList.value;
      if (form.value.id != null) {
        updatePlan(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addPlan(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除学习规划安排编号为"' + _ids + '"的数据项？').then(function() {
    return delPlan(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 学习规划安排详情序号 */
function rowLearningScheduleDetailIndex({ row, rowIndex }) {
  row.index = rowIndex + 1;
}

/** 学习规划安排详情添加按钮操作 */
function handleAddLearningScheduleDetail() {
  let obj = {};
  obj.courseId = "";
  obj.startDate = "";
  obj.durationDays = "";
  obj.createdAt = "";
  obj.updatedAt = "";
  obj.status = "";
  learningScheduleDetailList.value.push(obj);
}

/** 学习规划安排详情删除按钮操作 */
function handleDeleteLearningScheduleDetail() {
  if (checkedLearningScheduleDetail.value.length == 0) {
    proxy.$modal.msgError("请先选择要删除的学习规划安排详情数据");
  } else {
    const learningScheduleDetails = learningScheduleDetailList.value;
    const checkedLearningScheduleDetails = checkedLearningScheduleDetail.value;
    learningScheduleDetailList.value = learningScheduleDetails.filter(function(item) {
      return checkedLearningScheduleDetails.indexOf(item.index) == -1
    });
  }
}

/** 复选框选中数据 */
function handleLearningScheduleDetailSelectionChange(selection) {
  checkedLearningScheduleDetail.value = selection.map(item => item.index)
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('plan/plan/export', {
    ...queryParams.value
  }, `plan_${new Date().getTime()}.xlsx`)
}

getList();
</script>
