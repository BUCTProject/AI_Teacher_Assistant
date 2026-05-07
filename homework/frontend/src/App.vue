<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth'
import AppHeader from './components/layout/AppHeader.vue'
import ToastContainer from './components/common/ToastContainer.vue'

const route = useRoute()
const authStore = useAuthStore()
const showHeader = computed(() => !route.meta.hideHeader)

// 应用启动时恢复登录状态
onMounted(async () => {
  if (authStore.token && !authStore.user) {
    await authStore.fetchCurrentUser()
  }
})
</script>

<template>
  <div class="app">
    <ToastContainer />
    <AppHeader v-if="showHeader" />
    <main class="app-main" :class="{ 'no-header': !showHeader }">
      <div class="content-container">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1;
  padding-top: 60px;
  background: #f5f7fa;
}

.app-main.no-header {
  padding-top: 0;
}

.content-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  width: 100%;
}
</style>
