#!/usr/bin/env node

/**
 * AI Teaching Assistant - 开发环境一键启动脚本
 * 并行启动前后端服务，自动打开浏览器，显示实时状态
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

// 配置
const CONFIG = {
  frontend: {
    port: 3000,
    command: 'npm',
    args: ['run', 'dev'],
    cwd: path.resolve('frontend'),
    url: 'http://localhost:3000'
  },
  backend: {
    port: 9000,
    command: 'python',
    args: ['-m', 'uvicorn', 'app.main:app', '--reload', '--port', '9000'],
    cwd: path.resolve('backend'),
    url: 'http://localhost:9000'
  }
};

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  frontend: (msg) => console.log(`${colors.cyan}[Frontend]${colors.reset} ${msg}`),
  backend: (msg) => console.log(`${colors.magenta}[Backend]${colors.reset} ${msg}`)
};

// 进程管理
const processes = {};
let isShuttingDown = false;

/**
 * 检查端口是否被占用
 */
function checkPort(port) {
  return new Promise((resolve) => {
    const server = http.createServer();
    server.listen(port, () => {
      server.close(() => resolve(false)); // 端口可用
    });
    server.on('error', () => resolve(true)); // 端口被占用
  });
}

/**
 * 等待服务启动
 */
function waitForService(url, timeout = 30000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const check = () => {
      if (Date.now() - startTime > timeout) {
        reject(new Error(`Service at ${url} did not start within ${timeout}ms`));
        return;
      }
      
      http.get(url, (res) => {
        if (res.statusCode === 200 || res.statusCode === 404) {
          resolve();
        } else {
          setTimeout(check, 1000);
        }
      }).on('error', () => {
        setTimeout(check, 1000);
      });
    };
    
    check();
  });
}

/**
 * 启动服务
 */
function startService(name, config) {
  return new Promise((resolve, reject) => {
    log.info(`启动 ${name}...`);
    
    // 检查工作目录
    if (!fs.existsSync(config.cwd)) {
      reject(new Error(`目录不存在: ${config.cwd}`));
      return;
    }
    
    // 启动进程
    const process = spawn(config.command, config.args, {
      cwd: config.cwd,
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true
    });
    
    processes[name] = process;
    
    // 处理输出
    process.stdout.on('data', (data) => {
      const output = data.toString().trim();
      if (output) {
        if (name === 'frontend') {
          log.frontend(output);
        } else {
          log.backend(output);
        }
      }
    });
    
    process.stderr.on('data', (data) => {
      const output = data.toString().trim();
      if (output && !output.includes('WARNING')) {
        if (name === 'frontend') {
          log.frontend(`⚠️ ${output}`);
        } else {
          log.backend(`⚠️ ${output}`);
        }
      }
    });
    
    process.on('close', (code) => {
      if (!isShuttingDown) {
        if (code === 0) {
          log.success(`${name} 正常退出`);
        } else {
          log.error(`${name} 异常退出，代码: ${code}`);
        }
      }
    });
    
    process.on('error', (error) => {
      log.error(`${name} 启动失败: ${error.message}`);
      reject(error);
    });
    
    // 等待服务启动
    setTimeout(async () => {
      try {
        await waitForService(config.url);
        log.success(`${name} 启动成功: ${config.url}`);
        resolve();
      } catch (error) {
        log.error(`${name} 启动超时: ${error.message}`);
        reject(error);
      }
    }, name === 'backend' ? 3000 : 5000); // 后端等待3秒，前端等待5秒
  });
}

/**
 * 打开浏览器
 */
function openBrowser(url) {
  const { exec } = require('child_process');
  const platform = process.platform;
  
  let command;
  if (platform === 'win32') {
    command = `start ${url}`;
  } else if (platform === 'darwin') {
    command = `open ${url}`;
  } else {
    command = `xdg-open ${url}`;
  }
  
  exec(command, (error) => {
    if (error) {
      log.warning(`无法自动打开浏览器: ${error.message}`);
      log.info(`请手动打开: ${url}`);
    } else {
      log.success(`浏览器已打开: ${url}`);
    }
  });
}

/**
 * 优雅关闭
 */
function gracefulShutdown() {
  if (isShuttingDown) return;
  isShuttingDown = true;
  
  log.info('正在关闭服务...');
  
  Object.entries(processes).forEach(([name, process]) => {
    if (process && !process.killed) {
      log.info(`关闭 ${name}...`);
      process.kill('SIGTERM');
      
      // 强制关闭
      setTimeout(() => {
        if (!process.killed) {
          process.kill('SIGKILL');
        }
      }, 5000);
    }
  });
  
  setTimeout(() => {
    log.success('所有服务已关闭');
    process.exit(0);
  }, 6000);
}

/**
 * 主函数
 */
async function main() {
  console.log(`${colors.cyan}
╔══════════════════════════════════════════════════════════════╗
║                AI Teaching Assistant                         ║
║                  开发环境启动工具                              ║
╚══════════════════════════════════════════════════════════════╝
${colors.reset}`);
  
  try {
    // 检查环境
    log.info('检查环境...');
    
    // 检查端口占用
    const frontendPortBusy = await checkPort(CONFIG.frontend.port);
    const backendPortBusy = await checkPort(CONFIG.backend.port);
    
    if (frontendPortBusy) {
      log.warning(`前端端口 ${CONFIG.frontend.port} 已被占用`);
    }
    
    if (backendPortBusy) {
      log.warning(`后端端口 ${CONFIG.backend.port} 已被占用`);
    }
    
    // 启动服务
    log.info('启动服务...');
    
    // 并行启动前后端
    await Promise.all([
      startService('backend', CONFIG.backend),
      startService('frontend', CONFIG.frontend)
    ]);
    
    // 显示状态
    console.log(`\n${colors.green}🎉 所有服务启动成功！${colors.reset}\n`);
    console.log(`📊 前端应用: ${colors.cyan}${CONFIG.frontend.url}${colors.reset}`);
    console.log(`🔧 后端API: ${colors.magenta}${CONFIG.backend.url}${colors.reset}`);
    console.log(`📚 API文档: ${colors.magenta}${CONFIG.backend.url}/docs${colors.reset}`);
    console.log(`\n${colors.yellow}按 Ctrl+C 停止所有服务${colors.reset}\n`);
    
    // 自动打开浏览器
    setTimeout(() => {
      openBrowser(CONFIG.frontend.url);
    }, 2000);
    
  } catch (error) {
    log.error(`启动失败: ${error.message}`);
    gracefulShutdown();
  }
}

// 处理退出信号
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('exit', gracefulShutdown);

// 运行
if (require.main === module) {
  main().catch((error) => {
    log.error(`启动脚本异常: ${error.message}`);
    process.exit(1);
  });
}
