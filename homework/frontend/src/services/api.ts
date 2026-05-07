import axios, { AxiosError, type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import type { User, LoginCredentials, RegisterData, Assignment, Submission, QAQuestion } from '@/types'

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000
})

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Handle 401 - try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refreshTokenValue = localStorage.getItem('refreshToken')

      if (refreshTokenValue) {
        try {
          const response = await authApi.refreshToken(refreshTokenValue)
          localStorage.setItem('token', response.access_token)

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${response.access_token}`
          }
          return apiClient(originalRequest)
        } catch (refreshError) {
          localStorage.removeItem('token')
          localStorage.removeItem('refreshToken')
          window.location.href = '/login'
          return Promise.reject(refreshError)
        }
      }
    }

    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  async login(credentials: LoginCredentials) {
    const response = await apiClient.post('/auth/login', {
      student_id: credentials.username,
      password: credentials.password
    })
    return response.data
  },

  async register(data: RegisterData) {
    const response = await apiClient.post('/auth/register', data)
    return response.data
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get('/auth/me')
    return response.data
  },

  async refreshToken(refreshToken: string) {
    const response = await apiClient.post('/auth/refresh', { refresh_token: refreshToken })
    return response.data
  },

  async logout() {
    const response = await apiClient.post('/auth/logout')
    return response.data
  }
}

// Assignments API
export const assignmentsApi = {
  async getAll() {
    const response = await apiClient.get('/assignments/')
    return response.data
  },

  async getById(id: string) {
    const response = await apiClient.get(`/assignments/${id}`)
    return response.data
  },

  async create(data: Partial<Assignment>) {
    const response = await apiClient.post('/assignments/', data)
    return response.data
  },

  async update(id: string, data: Partial<Assignment>) {
    const response = await apiClient.put(`/assignments/${id}`, data)
    return response.data
  },

  async delete(id: string) {
    const response = await apiClient.delete(`/assignments/${id}`)
    return response.data
  }
}

// Submissions API
export const submissionsApi = {
  async getStudentSubmissions() {
    const response = await apiClient.get('/submissions/my-submissions')
    return response.data
  },

  async getByAssignment(assignmentId: string) {
    const response = await apiClient.get(`/submissions/assignment/${assignmentId}`)
    return response.data
  },

  async create(assignmentId: string, files: File[]) {
    const formData = new FormData()
    formData.append('assignment_id', assignmentId)
    files.forEach(file => {
      formData.append('files', file)
    })

    const response = await apiClient.post('/submissions/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  }
}

// QA API
export const qaApi = {
  async askQuestion(question: string, category?: string) {
    const response = await apiClient.post('/qa/ask', { question, category })
    return response.data
  },

  async getQuestions(): Promise<QAQuestion[]> {
    const response = await apiClient.get('/qa/questions')
    return response.data
  },

  async getKnowledgeBase(category?: string) {
    const response = await apiClient.get('/knowledge-base/', {
      params: { category }
    })
    return response.data
  }
}

// Analysis API
export const analysisApi = {
  async analyzeCode(code: string, language: string) {
    const response = await apiClient.post('/analysis/code', { code, language })
    return response.data
  },

  async checkPlagiarism(submissionId: string) {
    const response = await apiClient.post(`/analysis/plagiarism/${submissionId}`)
    return response.data
  },

  async analyzeReport(file: File) {
    const formData = new FormData()
    formData.append('file', file)

    const response = await apiClient.post('/analysis/report', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  }
}

// Grading API
export const gradingApi = {
  async getPendingSubmissions() {
    const response = await apiClient.get('/grading/pending')
    return response.data
  },

  async gradeSubmission(submissionId: string, feedback: string, grade?: number) {
    const response = await apiClient.post(`/grading/${submissionId}`, {
      feedback,
      grade
    })
    return response.data
  },

  async autoGrade(submissionId: string) {
    const response = await apiClient.post(`/grading/${submissionId}/auto`)
    return response.data
  }
}

// Task Queue API (for RabbitMQ integration)
export const tasksApi = {
  async getTaskStatus(taskId: string) {
    const response = await apiClient.get(`/tasks/status/${taskId}`)
    return response.data
  },

  async submitBatchTask(type: string, data: any) {
    const response = await apiClient.post('/tasks/batch', { type, data })
    return response.data
  }
}

export default apiClient
