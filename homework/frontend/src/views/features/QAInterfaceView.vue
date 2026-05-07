<script setup lang="ts">
// QAInterface for teachers - similar to SmartQA but with more features
import { ref } from 'vue'
import { qaApi } from '@/services/api'
import { useToastStore } from '@/stores/toast'

const toast = useToastStore()
const question = ref('')
const answer = ref('')
const loading = ref(false)

const handleAsk = async () => {
  if (!question.value.trim()) {
    toast.warning('请输入问题')
    return
  }

  loading.value = true
  try {
    const response = await qaApi.askQuestion(question.value)
    answer.value = response.answer
  } catch (error: any) {
    toast.error(error.response?.data?.detail || '获取答案失败')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="qa-interface">
    <h2>智能问答 (教师版)</h2>

    <el-card>
      <el-form label-position="top">
        <el-form-item label="问题">
          <el-input
            v-model="question"
            type="textarea"
            rows="4"
            placeholder="请输入问题..."
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleAsk">
            获取答案
          </el-button>
        </el-form-item>
      </el-form>

      <div v-if="answer" class="answer-section">
        <el-divider />
        <h4>AI 回答</h4>
        <div class="answer-content">{{ answer }}</div>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.qa-interface {
  padding: 20px;
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
