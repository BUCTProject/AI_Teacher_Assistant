<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { assignmentsApi } from '@/services/api'
import { useToastStore } from '@/stores/toast'
import type { Assignment } from '@/types'

const toast = useToastStore()
const assignments = ref<Assignment[]>([])
const loading = ref(true)
const dialogVisible = ref(false)

const form = ref({
  title: '',
  description: '',
  due_date: ''
})

onMounted(async () => {
  await loadAssignments()
})

const loadAssignments = async () => {
  loading.value = true
  try {
    assignments.value = await assignmentsApi.getAll()
  } finally {
    loading.value = false
  }
}

const handleCreate = async () => {
  try {
    await assignmentsApi.create(form.value)
    toast.success('作业创建成功')
    dialogVisible.value = false
    await loadAssignments()
    form.value = { title: '', description: '', due_date: '' }
  } catch (error: any) {
    toast.error(error.response?.data?.detail || '创建失败')
  }
}

const handleDelete = async (id: string) => {
  try {
    await assignmentsApi.delete(id)
    toast.success('作业删除成功')
    await loadAssignments()
  } catch (error: any) {
    toast.error(error.response?.data?.detail || '删除失败')
  }
}
</script>

<template>
  <div class="manage-assignments">
    <div class="header">
      <h2>作业管理</h2>
      <el-button type="primary" @click="dialogVisible = true">
        <el-icon><Plus /></el-icon>
        创建作业
      </el-button>
    </div>

    <el-card v-loading="loading">
      <el-table :data="assignments" style="width: 100%">
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="description" label="描述" show-overflow-tooltip />
        <el-table-column prop="due_date" label="截止日期">
          <template #default="{ row }">
            {{ new Date(row.due_date).toLocaleDateString() }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button type="danger" size="small" @click="handleDelete(row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" title="创建作业" width="500px">
      <el-form :model="form" label-position="top">
        <el-form-item label="标题">
          <el-input v-model="form.title" placeholder="请输入作业标题" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" rows="3" placeholder="请输入作业描述" />
        </el-form-item>
        <el-form-item label="截止日期">
          <el-date-picker v-model="form.due_date" type="datetime" placeholder="选择截止日期" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreate">创建</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.manage-assignments {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
</style>
