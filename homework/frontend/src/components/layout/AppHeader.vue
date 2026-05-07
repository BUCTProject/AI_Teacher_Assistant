<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const userRole = computed(() => authStore.userRole)
const userName = computed(() => authStore.userName)

const activeMenu = computed(() => {
  const path = route.path
  if (path.startsWith('/code-analysis')) return 'code-analysis'
  if (path.startsWith('/qa')) return 'qa'
  if (path.startsWith('/plagiarism')) return 'plagiarism'
  if (path.startsWith('/report-analysis')) return 'report-analysis'
  if (path.startsWith('/teacher')) return 'teacher'
  if (path.startsWith('/grading')) return 'grading'
  if (path.startsWith('/manage-assignments')) return 'manage-assignments'
  if (path.startsWith('/question-queue')) return 'question-queue'
  return 'dashboard'
})

const isStudent = computed(() => userRole.value === 'student')
const isTeacher = computed(() => userRole.value === 'teacher' || userRole.value === 'admin')

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const handleMenuSelect = (index: string) => {
  const routeMap: Record<string, string> = {
    'dashboard': '/dashboard',
    'grades': '/grades',
    'teacher': '/teacher',
    'manage-assignments': '/manage-assignments',
    'grading': '/grading',
    'question-queue': '/question-queue',
    'code-analysis': '/code-analysis',
    'qa': '/qa',
    'plagiarism': '/plagiarism',
    'report-analysis': '/report-analysis',
  }
  const path = routeMap[index]
  if (path) {
    router.push(path)
  }
}
</script>

<template>
  <el-header class="app-header">
    <div class="header-left">
      <div class="logo" @click="router.push('/')">
        <el-icon><School /></el-icon>
        <span>AI Teaching Assistant</span>
      </div>

      <el-menu
        :default-active="activeMenu"
        class="header-menu"
        mode="horizontal"
        :ellipsis="false"
        @select="handleMenuSelect"
      >
        <!-- Student Navigation -->
        <template v-if="isStudent">
          <el-menu-item index="dashboard">
            <el-icon><HomeFilled /></el-icon>
            <span>Dashboard</span>
          </el-menu-item>
          <el-menu-item index="grades">
            <el-icon><Trophy /></el-icon>
            <span>成绩</span>
          </el-menu-item>
        </template>

        <!-- Teacher Navigation -->
        <template v-if="isTeacher">
          <el-menu-item index="teacher">
            <el-icon><HomeFilled /></el-icon>
            <span>Dashboard</span>
          </el-menu-item>
          <el-menu-item index="manage-assignments">
            <el-icon><Document /></el-icon>
            <span>作业管理</span>
          </el-menu-item>
          <el-menu-item index="grading">
            <el-icon><EditPen /></el-icon>
            <span>批改作业</span>
          </el-menu-item>
          <el-menu-item index="question-queue">
            <el-icon><ChatDotRound /></el-icon>
            <span>问题队列</span>
          </el-menu-item>

          <el-sub-menu index="features">
            <template #title>
              <el-icon><Tools /></el-icon>
              <span>高级功能</span>
            </template>
            <el-menu-item index="code-analysis">
              <el-icon><Monitor /></el-icon>
              <span>代码分析</span>
            </el-menu-item>
            <el-menu-item index="qa">
              <el-icon><ChatLineRound /></el-icon>
              <span>智能问答</span>
            </el-menu-item>
            <el-menu-item index="plagiarism">
              <el-icon><Search /></el-icon>
              <span>抄袭检测</span>
            </el-menu-item>
            <el-menu-item index="report-analysis">
              <el-icon><DocumentChecked /></el-icon>
              <span>报告分析</span>
            </el-menu-item>
          </el-sub-menu>
        </template>

        <!-- Common Features -->
        <el-menu-item index="smart-qa">
          <el-icon><ChatLineRound /></el-icon>
          <span>智能答疑</span>
        </el-menu-item>
        <el-menu-item index="knowledge-base">
          <el-icon><Reading /></el-icon>
          <span>知识库</span>
        </el-menu-item>
      </el-menu>
    </div>

    <div class="header-right">
      <el-dropdown>
        <span class="user-info">
          <el-icon><UserFilled /></el-icon>
          <span>{{ userName }}</span>
          <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="router.push('/account')">
              <el-icon><Setting /></el-icon>
              账号设置
            </el-dropdown-item>
            <el-dropdown-item divided @click="handleLogout">
              <el-icon><SwitchButton /></el-icon>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
</template>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  padding: 0 20px;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 40px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #409eff;
  cursor: pointer;
}

.logo .el-icon {
  font-size: 24px;
}

.header-menu {
  border-bottom: none;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #606266;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background 0.3s;
}

.user-info:hover {
  background: #f5f7fa;
}

.dropdown-icon {
  margin-left: 4px;
  font-size: 12px;
}
</style>
