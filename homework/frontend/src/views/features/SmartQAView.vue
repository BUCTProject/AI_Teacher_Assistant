<script setup lang="ts">
import { ref } from 'vue'
import { qaApi } from '@/services/api'
import { useToastStore } from '@/stores/toast'

const toast = useToastStore()
const question = ref('')
const answer = ref('')
const loading = ref(false)
const category = ref('')

const categories = [
  { label: '通用', value: 'general' },
  { label: '编程', value: 'programming' },
  { label: '作业', value: 'assignment' }
]

const handleAsk = async () => {
  if (!question.value.trim()) {
    toast.warning('请输入问题')
    return
  }

  loading.value = true
  try {
    const response = await qaApi.askQuestion(question.value, category.value)
    answer.value = response.answer
  } catch (error: any) {
    toast.error(error.response?.data?.detail || '获取答案失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="smart-qa">
    <h2>智能答疑</h2>

    <el-card>
      <el-form label-position="top">
        <el-form-item label="问题类别">
          <el-select v-model="category" placeholder="选择类别" clearable>
            <el-option
              v-for="cat in categories"
              :key="cat.value"
              :label="cat.label"
              :value="cat.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="您的问题">
          <el-input
            v-model="question"
            type="textarea"
            rows="4"
            placeholder="请输入您的问题..."
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleAsk">
            <el-icon><ChatLineRound /></el-icon>
            提问
          </el-button>
        </el-form-item>
      </el-form>

      <div v-if="answer" class="answer-section">
        <el-divider />
        <h4>回答</h4>
        <div class="answer-content">{{ answer }}</div>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.smart-qa {
  padding: 20px;
}

h2 {
  margin-bottom: 20px;
}

.answer-section {
  margin-top: 20px;
}

.answer-content {
  background: #f5f7fa;
  padding: 16px;
  border-radius: 4px;
  line-height: 1.6;
}
</style>
