<template>
  <view class="exam-container">
    <!-- 测试模式选择 -->
    <view v-if="!startExam && !showResult" class="mode-select">
      <view class="section-title">
        <text>在线测试</text>
        <text class="sub-title">检验学习成果</text>
      </view>
      
      <view class="mode-card" @click="selectMode('random')">
        <view class="mode-icon">🎯</view>
        <text class="mode-title">随机练习</text>
        <text class="mode-desc">随机抽取题目进行练习</text>
        <view class="mode-info">
          <text>题库：{{ questionBank.randomCount }}题</text>
          <text>时间：不限时</text>
        </view>
      </view>
      
      <view class="mode-card" @click="selectMode('chapter')">
        <view class="mode-icon">📚</view>
        <text class="mode-title">章节测试</text>
        <text class="mode-desc">按章节知识点测试</text>
        <view class="mode-info">
          <text>已学习：{{ studyProgress }}章</text>
          <text>难度：自适应</text>
        </view>
      </view>
      
      <view class="mode-card" @click="selectMode('exam')">
        <view class="mode-icon">⏰</view>
        <text class="mode-title">模拟考试</text>
        <text class="mode-desc">全真模拟考试环境</text>
        <view class="mode-info">
          <text>题量：50题</text>
          <text>时间：90分钟</text>
        </view>
      </view>
      
      <view class="mode-card" @click="selectMode('wrong')">
        <view class="mode-icon">🔍</view>
        <text class="mode-title">错题重做</text>
        <text class="mode-desc">复习做错的题目</text>
        <view class="mode-info">
          <text>错题：{{ wrongQuestions.length }}题</text>
          <text>上次：{{ lastWrongReview }}</text>
        </view>
      </view>
    </view>

    <!-- 正在考试界面（精简顶部） -->
    <view v-if="startExam && !showResult" class="exam-in-progress">
      <!-- 顶部精简信息栏 -->
      <view class="exam-header-slim">
        <view class="header-left">
          <text class="question-number">{{ currentIndex + 1 }}/{{ questions.length }}</text>
          <text class="exam-mode">{{ getModeText(currentMode) }}</text>
        </view>
        
        <view class="header-right">
          <text class="timer" :class="{ 'time-warning': timeLeft < 300 }">
            {{ currentMode === 'exam' ? formatTime(timeLeft) : formatTime(timeUsed) }}
          </text>
          
          <!-- 导航按钮 -->
          <view class="nav-controls">
            <view class="nav-icon" @click="toggleNavDrawer">
              <text>📋</text>
              <view class="nav-badge" v-if="unansweredCount > 0">{{ unansweredCount }}</view>
            </view>
            
            <view class="nav-icon" @click="toggleMark" :class="{ 'active': currentQuestion.marked }">
              <text>{{ currentQuestion.marked ? '★' : '☆' }}</text>
            </view>
            
            <view class="nav-icon" @click="toggleAnalysis" :class="{ 'active': showAnalysis }">
              <text>💡</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 侧边导航抽屉 -->
      <view v-if="showNavDrawer" class="nav-drawer-mask" @click="closeNavDrawer">
        <view class="nav-drawer" @click.stop>
          <view class="drawer-header">
            <text>题目导航</text>
            <view class="drawer-stats">
              <text class="stat-item">已答：{{ answeredCount }}</text>
              <text class="stat-item">标记：{{ markedCount }}</text>
              <text class="stat-item">未答：{{ unansweredCount }}</text>
            </view>
            <view class="close-drawer" @click="closeNavDrawer">✕</view>
          </view>
          
          <scroll-view class="drawer-content" scroll-y>
            <view class="question-nav-grid">
              <view 
                v-for="(q, index) in questions" 
                :key="index"
                class="nav-grid-item"
                :class="{
                  'current': currentIndex === index,
                  'answered': q.userAnswer !== undefined,
                  'marked': q.marked,
                  'unanswered': q.userAnswer === undefined
                }"
                @click="jumpToQuestion(index)"
              >
                {{ index + 1 }}
                <view class="nav-status" v-if="q.marked">★</view>
              </view>
            </view>
          </scroll-view>
          
          <view class="drawer-actions">
            <button class="btn-jump" @click="jumpToUnanswered" v-if="unansweredCount > 0">
              跳转到未答
            </button>
            <button class="btn-submit-drawer" @click="showSubmitConfirm">
              提交试卷
            </button>
          </view>
        </view>
      </view>

      <!-- 题目区域 -->
      <scroll-view class="question-scroll" scroll-y>
        <view class="question-container">
          <!-- 题目类型和标记提示 -->
          <view class="question-header-mini">
            <text class="question-type-tag">{{ getQuestionType(currentQuestion.type) }}</text>
            <view 
              class="mark-btn-mini" 
              @click="toggleMark"
              :class="{ 'marked': currentQuestion.marked }"
            >
              {{ currentQuestion.marked ? '★ 已标记' : '☆ 标记' }}
            </view>
          </view>

          <!-- 题目内容 -->
          <view class="question-content">
            <rich-text :nodes="currentQuestion.content"></rich-text>
          </view>

          <!-- 选项 -->
          <view class="options-container">
            <view 
              v-for="(option, optIndex) in currentQuestion.options" 
              :key="optIndex"
              class="option-item"
              :class="{
                'selected': String.fromCharCode(65 + optIndex) === currentQuestion.userAnswer,
                'correct': showAnalysis && String.fromCharCode(65 + optIndex) === currentQuestion.correctAnswer,
                'wrong': showAnalysis && 
                  String.fromCharCode(65 + optIndex) === currentQuestion.userAnswer &&
                  String.fromCharCode(65 + optIndex) !== currentQuestion.correctAnswer
              }"
              @click="selectAnswer(String.fromCharCode(65 + optIndex))"
            >
              <view class="option-label">{{ String.fromCharCode(65 + optIndex) }}</view>
              <view class="option-text">{{ option }}</view>
            </view>
          </view>

          <!-- 答案解析 -->
          <view v-if="showAnalysis" class="analysis-section">
            <view class="analysis-title">答案解析</view>
            <view class="analysis-content">
              <view class="correct-answer">
                正确答案：<text class="answer-text">{{ currentQuestion.correctAnswer }}</text>
              </view>
              <view class="analysis-text">
                <rich-text :nodes="currentQuestion.analysis"></rich-text>
              </view>
              <view class="knowledge-points">
                知识点：{{ currentQuestion.knowledgePoints }}
              </view>
            </view>
          </view>

          <!-- 底部操作按钮（固定） -->
          <view class="action-buttons-fixed">
            <view class="btn-group">
              <button 
                class="btn-nav" 
                @click="prevQuestion"
                :disabled="currentIndex === 0"
              >
                <text>← 上一题</text>
              </button>
              
              <button 
                class="btn-nav" 
                @click="nextQuestion"
                :disabled="currentIndex === questions.length - 1"
              >
                <text>下一题 →</text>
              </button>
            </view>
            
            <button 
              class="btn-submit" 
              @click="showSubmitConfirm"
              v-if="currentMode !== 'random'"
            >
              提交试卷
            </button>
            
            <button 
              class="btn-analysis-toggle" 
              @click="toggleAnalysis"
            >
              {{ showAnalysis ? '隐藏解析' : '查看解析' }}
            </button>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 考试结果界面 -->
    <view v-if="showResult" class="exam-result">
      <scroll-view class="result-scroll" scroll-y>
        <view class="result-content">
          <view class="result-header">
            <view class="result-icon">🏆</view>
            <text class="result-title">测试完成</text>
            <text class="result-subtitle">恭喜您完成测试！</text>
          </view>

          <!-- 成绩概览 -->
          <view class="score-overview">
            <view class="score-circle">
              <view class="score-number">{{ examResult.score }}</view>
              <view class="score-label">得分</view>
            </view>
            
            <view class="score-details">
              <view class="score-item">
                <text class="score-item-label">总题数</text>
                <text class="score-item-value">{{ examResult.totalQuestions }}</text>
              </view>
              <view class="score-item">
                <text class="score-item-label">正确</text>
                <text class="score-item-value correct">{{ examResult.correctCount }}</text>
              </view>
              <view class="score-item">
                <text class="score-item-label">错误</text>
                <text class="score-item-value wrong">{{ examResult.wrongCount }}</text>
              </view>
              <view class="score-item">
                <text class="score-item-label">用时</text>
                <text class="score-item-value">{{ formatTime(examResult.timeUsed) }}</text>
              </view>
            </view>
          </view>

          <!-- 详细分析 -->
          <view class="detailed-analysis">
            <view class="analysis-title">详细分析</view>
            
            <!-- 知识点掌握情况 -->
            <view class="knowledge-mastery">
              <view class="knowledge-title">知识点掌握情况</view>
              <view v-for="item in examResult.knowledgePoints" :key="item.name" class="knowledge-item">
                <text class="knowledge-name">{{ item.name }}</text>
                <view class="knowledge-progress">
                  <view class="progress-bar">
                    <view class="progress-fill" :style="{ width: item.mastery + '%' }"></view>
                  </view>
                  <text class="knowledge-percentage">{{ item.mastery }}%</text>
                </view>
              </view>
            </view>

            <!-- 错题列表 -->
            <view class="wrong-questions" v-if="examResult.wrongQuestions.length > 0">
              <view class="wrong-title">
                <text>错题集</text>
                <text class="wrong-count">{{ examResult.wrongQuestions.length }}题</text>
              </view>
              
              <view 
                v-for="(q, index) in examResult.wrongQuestions" 
                :key="index"
                class="wrong-item"
                @click="reviewQuestion(q)"
              >
                <view class="wrong-question-number">第 {{ q.index + 1 }} 题</view>
                <view class="wrong-question-content">{{ q.content.substring(0, 50) }}...</view>
                <view class="wrong-answer-info">
                  <text class="your-answer">你的答案：{{ q.userAnswer }}</text>
                  <text class="correct-answer">正确答案：{{ q.correctAnswer }}</text>
                </view>
              </view>
            </view>
          </view>

          <!-- 操作按钮 -->
          <view class="result-actions">
            <button class="btn-restart" @click="restartExam">重新测试</button>
            <button class="btn-review" @click="reviewWrongQuestions" v-if="examResult.wrongQuestions.length > 0">
              复习错题
            </button>
            <button class="btn-home" @click="goHome">返回首页</button>
            <button class="btn-share" open-type="share">分享成绩</button>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 加载提示 -->
    <view v-if="isLoading" class="loading-mask">
      <view class="loading-content">
        <text>加载中...</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

// 响应式数据
const startExam = ref(false)
const showResult = ref(false)
const isLoading = ref(false)
const showNavDrawer = ref(false)

// 考试相关数据
const currentMode = ref('')
const currentIndex = ref(0)
const showAnalysis = ref(false)

// 计时相关
const timeLeft = ref(90 * 60)
const timeUsed = ref(0)
const timer = ref(null)

// 题库数据
const questionBank = ref({
  randomCount: 100,
  chapters: [
    { id: 1, name: '基础知识', questions: 20 },
    { id: 2, name: '核心概念', questions: 30 },
    { id: 3, name: '高级应用', questions: 25 },
    { id: 4, name: '综合实战', questions: 25 }
  ]
})

// 学习进度
const studyProgress = ref(3)
const wrongQuestions = ref([])
const lastWrongReview = ref('2024-01-10')

// 考试题目
const questions = ref([])

// 考试结果
const examResult = ref({
  score: 0,
  totalQuestions: 0,
  correctCount: 0,
  wrongCount: 0,
  timeUsed: 0,
  knowledgePoints: [],
  wrongQuestions: []
})

// 计算属性
const currentQuestion = computed(() => questions.value[currentIndex.value] || {})
const answeredCount = computed(() => questions.value.filter(q => q.userAnswer !== undefined).length)
const markedCount = computed(() => questions.value.filter(q => q.marked).length)
const unansweredCount = computed(() => questions.value.length - answeredCount.value)

// 页面加载
onLoad(() => {
  loadWrongQuestions()
})

// 组件卸载时清除计时器
onUnmounted(() => {
  if (timer.value) clearInterval(timer.value)
})

// 加载错题
const loadWrongQuestions = async () => {
  try {
    wrongQuestions.value = [
      { id: 1, questionId: 101, content: '关于Python装饰器的作用...', userAnswer: 'A', correctAnswer: 'C' },
      { id: 2, questionId: 205, content: 'JavaScript闭包的应用场景...', userAnswer: 'B', correctAnswer: 'D' }
    ]
  } catch (error) {
    console.error('加载错题失败:', error)
  }
}

// 获取模式文本
const getModeText = (mode) => {
  const modeMap = {
    'random': '随机练习',
    'chapter': '章节测试',
    'exam': '模拟考试',
    'wrong': '错题重做'
  }
  return modeMap[mode] || ''
}

// 选择考试模式
const selectMode = (mode) => {
  currentMode.value = mode
  
  switch(mode) {
    case 'random':
      startRandomPractice()
      break
    case 'chapter':
      showChapterSelect()
      break
    case 'exam':
      startSimulatedExam()
      break
    case 'wrong':
      startWrongReview()
      break
  }
}

// 开始随机练习
const startRandomPractice = async () => {
  isLoading.value = true
  try {
    await loadQuestions()
    startExam.value = true
    startTimer(false)
  } catch (error) {
    console.error('加载题目失败:', error)
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    isLoading.value = false
  }
}

// 开始模拟考试
const startSimulatedExam = async () => {
  uni.showModal({
    title: '模拟考试',
    content: '本次考试共50题，限时90分钟。开始后计时将不会停止，确定开始吗？',
    success: async (res) => {
      if (res.confirm) {
        isLoading.value = true
        try {
          await loadQuestions(50)
          startExam.value = true
          startTimer(true)
        } catch (error) {
          console.error('加载题目失败:', error)
        } finally {
          isLoading.value = false
        }
      }
    }
  })
}

// 开始错题重做
const startWrongReview = async () => {
  if (wrongQuestions.value.length === 0) {
    uni.showToast({ title: '暂无错题', icon: 'none' })
    return
  }
  
  isLoading.value = true
  try {
    await loadQuestions(10, true)
    startExam.value = true
    startTimer(false)
  } catch (error) {
    console.error('加载错题失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 显示章节选择
const showChapterSelect = () => {
  uni.showActionSheet({
    title: '选择章节',
    itemList: questionBank.value.chapters.map(ch => `${ch.name} (${ch.questions}题)`),
    success: async (res) => {
      const chapterIndex = res.tapIndex
      isLoading.value = true
      try {
        await loadQuestions(20, false, chapterIndex + 1)
        startExam.value = true
        startTimer(false)
      } catch (error) {
        console.error('加载章节题目失败:', error)
      } finally {
        isLoading.value = false
      }
    }
  })
}

// 加载题目（模拟）
const loadQuestions = async (count = 10, isWrong = false, chapterId = null) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const sampleQuestions = []
      const types = ['single', 'multiple', 'judge']
      const knowledgePoints = [
        'Python基础',
        'JavaScript核心',
        'HTML/CSS',
        '数据结构',
        '算法'
      ]
      
      for (let i = 0; i < count; i++) {
        const type = types[Math.floor(Math.random() * types.length)]
        const optionCount = type === 'multiple' ? 4 : 4
        
        sampleQuestions.push({
          id: i + 1,
          type: type,
          content: `<p>${i + 1}. 这是第${i + 1}道题目，关于${knowledgePoints[Math.floor(Math.random() * knowledgePoints.length)]}的知识点。</p>`,
          options: Array.from({ length: optionCount }, (_, idx) => 
            `选项${String.fromCharCode(65 + idx)}的内容描述`
          ),
          correctAnswer: type === 'multiple' ? 'AB' : 'A',
          analysis: '<p>这是题目的详细解析，解释了为什么正确答案是正确选项。</p>',
          knowledgePoints: knowledgePoints[Math.floor(Math.random() * knowledgePoints.length)],
          userAnswer: undefined,
          marked: false
        })
      }
      
      questions.value = sampleQuestions
      resolve()
    }, 1000)
  })
}

// 开始计时
const startTimer = (isLimited) => {
  if (isLimited) {
    timer.value = setInterval(() => {
      if (timeLeft.value <= 0) {
        clearInterval(timer.value)
        timeUp()
        return
      }
      timeLeft.value--
      timeUsed.value++
    }, 1000)
  } else {
    timer.value = setInterval(() => {
      timeUsed.value++
    }, 1000)
  }
}

// 时间到
const timeUp = () => {
  uni.showModal({
    title: '时间到',
    content: '考试时间已结束，系统将自动交卷',
    showCancel: false,
    success: () => {
      submitExam()
    }
  })
}

// 格式化时间
const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 获取题目类型文本
const getQuestionType = (type) => {
  const typeMap = {
    'single': '单选题',
    'multiple': '多选题',
    'judge': '判断题'
  }
  return typeMap[type] || '未知类型'
}

// 选择答案
const selectAnswer = (answer) => {
  if (showResult.value) return
  
  const currentQ = currentQuestion.value
  
  if (currentQ.type === 'multiple') {
    if (!currentQ.userAnswer) {
      currentQ.userAnswer = answer
    } else if (currentQ.userAnswer.includes(answer)) {
      currentQ.userAnswer = currentQ.userAnswer.replace(answer, '')
      if (currentQ.userAnswer === '') {
        currentQ.userAnswer = undefined
      }
    } else {
      currentQ.userAnswer = (currentQ.userAnswer + answer).split('').sort().join('')
    }
  } else {
    currentQ.userAnswer = answer
  }
}

// 切换标记
const toggleMark = () => {
  questions.value[currentIndex.value].marked = !questions.value[currentIndex.value].marked
}

// 切换解析显示
const toggleAnalysis = () => {
  showAnalysis.value = !showAnalysis.value
}

// 切换导航抽屉
const toggleNavDrawer = () => {
  showNavDrawer.value = !showNavDrawer.value
}

const closeNavDrawer = () => {
  showNavDrawer.value = false
}

// 上一题
const prevQuestion = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    showAnalysis.value = false
    closeNavDrawer()
  }
}

// 下一题
const nextQuestion = () => {
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++
    showAnalysis.value = false
    closeNavDrawer()
  }
}

// 跳转到指定题目
const jumpToQuestion = (index) => {
  currentIndex.value = index
  showAnalysis.value = false
  closeNavDrawer()
}

// 跳转到未答题目
const jumpToUnanswered = () => {
  const unansweredIndex = questions.value.findIndex(q => q.userAnswer === undefined)
  if (unansweredIndex !== -1) {
    jumpToQuestion(unansweredIndex)
  }
}

// 显示提交确认
const showSubmitConfirm = () => {
  uni.showModal({
    title: '确认交卷',
    content: `当前已答${answeredCount.value}/${questions.value.length}题，确认要提交试卷吗？`,
    success: (res) => {
      if (res.confirm) {
        calculateResult()
      }
    }
  })
}

// 提交考试
const submitExam = () => {
  if (timer.value) {
    clearInterval(timer.value)
  }
  
  const answeredQuestions = questions.value.filter(q => q.userAnswer !== undefined)
  const correctQuestions = answeredQuestions.filter(q => q.userAnswer === q.correctAnswer)
  
  const wrongQuestionsList = questions.value
    .filter(q => q.userAnswer !== undefined && q.userAnswer !== q.correctAnswer)
    .map((q, index) => ({
      ...q,
      index: index
    }))
  
  const knowledgeMap = {}
  questions.value.forEach(q => {
    if (!knowledgeMap[q.knowledgePoints]) {
      knowledgeMap[q.knowledgePoints] = { total: 0, correct: 0 }
    }
    knowledgeMap[q.knowledgePoints].total++
    if (q.userAnswer === q.correctAnswer) {
      knowledgeMap[q.knowledgePoints].correct++
    }
  })
  
  const knowledgePoints = Object.entries(knowledgeMap).map(([name, data]) => ({
    name,
    mastery: Math.round((data.correct / data.total) * 100)
  }))
  
  const score = Math.round((correctQuestions.length / questions.value.length) * 100)
  
  examResult.value = {
    score: score,
    totalQuestions: questions.value.length,
    correctCount: correctQuestions.length,
    wrongCount: wrongQuestionsList.length,
    timeUsed: timeUsed.value,
    knowledgePoints: knowledgePoints,
    wrongQuestions: wrongQuestionsList
  }
  
  startExam.value = false
  showResult.value = true
  
  saveWrongQuestions(wrongQuestionsList)
}

// 保存错题
const saveWrongQuestions = (wrongList) => {
  try {
    const existing = uni.getStorageSync('wrongQuestions') || []
    const newWrongs = wrongList.map(q => ({
      questionId: q.id,
      content: q.content,
      userAnswer: q.userAnswer,
      correctAnswer: q.correctAnswer,
      timestamp: new Date().toISOString()
    }))
    
    uni.setStorageSync('wrongQuestions', [...existing, ...newWrongs])
  } catch (error) {
    console.error('保存错题失败:', error)
  }
}

// 复习特定题目
const reviewQuestion = (question) => {
  uni.showModal({
    title: '查看错题',
    content: '确定要查看这道错题的详细内容吗？',
    success: (res) => {
      if (res.confirm) {
        uni.navigateTo({
          url: `/pages/questionDetail/questionDetail?id=${question.questionId || question.id}`
        })
      }
    }
  })
}

// 复习所有错题
const reviewWrongQuestions = () => {
  currentMode.value = 'wrong'
  startWrongReview()
}

// 重新开始考试
const restartExam = () => {
  startExam.value = false
  showResult.value = false
  currentIndex.value = 0
  timeLeft.value = 90 * 60
  timeUsed.value = 0
  showAnalysis.value = false
  showNavDrawer.value = false
  questions.value = []
  
  selectMode(currentMode.value)
}

// 返回首页
const goHome = () => {
  uni.switchTab({
    url: '/pages/home/home'
  })
}

// 分享功能
const onShareAppMessage = () => {
  return {
    title: '我在学习平台上取得了好成绩！',
    path: '/pages/exam/exam'
  }
}
</script>

<style scoped>
.exam-container {
  background-color: #f8f1e9;
  min-height: 100vh;
}

/* 模式选择页面 */
.mode-select {
  padding: 20px;
}

.section-title {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px 0;
  background: rgba(212, 167, 98, 0.1);
  border-radius: 12px;
  margin: 15px;
}

.section-title text:first-child {
  font-size: 24px;
  font-weight: bold;
  color: #5d4037;
  display: block;
}

.sub-title {
  font-size: 14px;
  color: #8d6e63;
  display: block;
  margin-top: 5px;
}

.mode-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin: 0 15px 15px;
  box-shadow: 0 4px 12px rgba(93, 64, 55, 0.08);
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
  border-left: 4px solid #d4a762;
}

.mode-card:active {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(93, 64, 55, 0.12);
  border-color: #d4a762;
}

.mode-icon {
  font-size: 40px;
  text-align: center;
  margin-bottom: 10px;
}

.mode-title {
  font-size: 18px;
  font-weight: bold;
  color: #5d4037;
  display: block;
  margin-bottom: 5px;
}

.mode-desc {
  font-size: 14px;
  color: #8d6e63;
  display: block;
  margin-bottom: 15px;
}

.mode-info {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #a1887f;
  padding-top: 10px;
  border-top: 1px solid #f8f1e9;
}

/* 精简头部 */
.exam-header-slim {
  background: white;
  padding: 12px 15px;
  box-shadow: 0 2px 8px rgba(93, 64, 55, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid #f8f1e9;
}

.header-left {
  display: flex;
  flex-direction: column;
}

.question-number {
  font-size: 16px;
  font-weight: bold;
  color: #5d4037;
}

.exam-mode {
  font-size: 12px;
  color: #8d6e63;
  margin-top: 2px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.timer {
  font-size: 14px;
  font-weight: bold;
  color: #d4a762;
  background: rgba(212, 167, 98, 0.1);
  padding: 4px 10px;
  border-radius: 15px;
  min-width: 70px;
  text-align: center;
}

.time-warning {
  color: #e74c3c;
  background: rgba(231, 76, 60, 0.1);
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.7; }
  100% { opacity: 1; }
}

.nav-controls {
  display: flex;
  gap: 10px;
}

.nav-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f8f1e9;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.nav-icon:active {
  background: #e8e1d9;
  transform: scale(0.95);
}

.nav-icon.active {
  background: #d4a762;
  color: white;
  border-color: #d4a762;
}

.nav-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #e74c3c;
  color: white;
  font-size: 10px;
  min-width: 16px;
  height: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}

/* 导航抽屉 */
.nav-drawer-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
}

.nav-drawer {
  width: 85%;
  height: 100%;
  background: white;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.drawer-header {
  padding: 20px;
  background: #f8f1e9;
  border-bottom: 1px solid #e8e1d9;
  position: relative;
}

.drawer-header text {
  font-size: 18px;
  font-weight: bold;
  color: #5d4037;
  display: block;
  margin-bottom: 10px;
}

.drawer-stats {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #8d6e63;
}

.stat-item {
  padding: 4px 8px;
  background: rgba(212, 167, 98, 0.1);
  border-radius: 10px;
}

.close-drawer {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  color: #5d4037;
}

.drawer-content {
  flex: 1;
  padding: 15px;
}

.question-nav-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}

.nav-grid-item {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  position: relative;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.nav-grid-item:active {
  transform: scale(0.95);
}

.nav-grid-item.current {
  background: #d4a762;
  color: white;
  font-weight: bold;
  border-color: #d4a762;
}

.nav-grid-item.answered {
  background: rgba(46, 204, 113, 0.1);
  color: #2ecc71;
  border-color: rgba(46, 204, 113, 0.3);
}

.nav-grid-item.marked {
  background: rgba(243, 156, 18, 0.1);
  color: #f39c12;
  border-color: rgba(243, 156, 18, 0.3);
}

.nav-grid-item.unanswered {
  background: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
  border-color: rgba(231, 76, 60, 0.3);
}

.nav-status {
  position: absolute;
  top: -2px;
  right: -2px;
  font-size: 10px;
  color: #f39c12;
}

.drawer-actions {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-top: 1px solid #f8f1e9;
}

.btn-jump, .btn-submit-drawer {
  height: 40px;
  border-radius: 20px;
  font-size: 14px;
  border: none;
  outline: none;
}

.btn-jump {
  background: #3498db;
  color: white;
}

.btn-submit-drawer {
  background: #d4a762;
  color: white;
}

/* 题目滚动区域 */
.question-scroll {
  height: calc(100vh - 60px);
}

.question-container {
  padding: 20px 15px 100px;
  background: white;
  min-height: 100%;
}

.question-header-mini {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f8f1e9;
}

.question-type-tag {
  font-size: 13px;
  color: #8d6e63;
  background: rgba(212, 167, 98, 0.1);
  padding: 4px 10px;
  border-radius: 12px;
}

.mark-btn-mini {
  font-size: 13px;
  color: #8d6e63;
  cursor: pointer;
  padding: 4px 12px;
  border: 1px solid #e8e1d9;
  border-radius: 15px;
  transition: all 0.3s;
}

.mark-btn-mini:active {
  background: #f8f1e9;
}

.mark-btn-mini.marked {
  background: #d4a762;
  color: white;
  border-color: #d4a762;
}

.question-content {
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 25px;
  color: #5d4037;
}

/* 选项 */
.options-container {
  margin-bottom: 30px;
}

.option-item {
  display: flex;
  align-items: flex-start;
  padding: 15px;
  margin-bottom: 12px;
  border: 2px solid #e8e1d9;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  background: white;
}

.option-item:active {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.option-item.selected {
  border-color: #d4a762;
  background: rgba(212, 167, 98, 0.05);
}

.option-item.correct {
  border-color: #2ecc71;
  background: rgba(46, 204, 113, 0.05);
}

.option-item.wrong {
  border-color: #e74c3c;
  background: rgba(231, 76, 60, 0.05);
}

.option-label {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f8f1e9;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-weight: bold;
  color: #8d6e63;
  flex-shrink: 0;
}

.option-item.selected .option-label {
  background: #d4a762;
  color: white;
}

.option-item.correct .option-label {
  background: #2ecc71;
  color: white;
}

.option-item.wrong .option-label {
  background: #e74c3c;
  color: white;
}

.option-text {
  flex: 1;
  font-size: 15px;
  line-height: 1.5;
  color: #5d4037;
}

/* 底部固定操作按钮 */
.action-buttons-fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 15px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  border-top: 1px solid #f8f1e9;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn-group {
  display: flex;
  gap: 10px;
}

.btn-nav, .btn-submit, .btn-analysis-toggle {
  flex: 1;
  height: 44px;
  border-radius: 22px;
  font-size: 14px;
  border: none;
  outline: none;
}

.btn-nav {
  background: #f8f1e9;
  color: #8d6e63;
}

.btn-nav:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-submit {
  background: #d4a762;
  color: white;
}

.btn-analysis-toggle {
  background: #3498db;
  color: white;
}

/* 答案解析 */
.analysis-section {
  background: rgba(212, 167, 98, 0.05);
  border-radius: 8px;
  padding: 20px;
  border-left: 4px solid #d4a762;
  margin-bottom: 20px;
}

.analysis-title {
  font-size: 16px;
  font-weight: bold;
  color: #5d4037;
  margin-bottom: 15px;
}

.correct-answer {
  font-size: 15px;
  margin-bottom: 15px;
  color: #2ecc71;
}

.answer-text {
  font-weight: bold;
  font-size: 18px;
}

.analysis-text {
  font-size: 14px;
  line-height: 1.6;
  color: #8d6e63;
  margin-bottom: 15px;
}

.knowledge-points {
  font-size: 13px;
  color: #a1887f;
  padding: 8px 12px;
  background: white;
  border-radius: 6px;
  display: inline-block;
  border: 1px solid #f8f1e9;
}

/* 考试结果页面 */
.result-scroll {
  height: 100vh;
}

.result-content {
  padding-bottom: 120px;
  background: #f8f1e9;
}

.result-header {
  text-align: center;
  padding: 30px 20px;
  background: white;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(93, 64, 55, 0.08);
}

.result-icon {
  font-size: 60px;
  margin-bottom: 10px;
}

.result-title {
  font-size: 24px;
  font-weight: bold;
  color: #5d4037;
  display: block;
  margin-bottom: 5px;
}

.result-subtitle {
  font-size: 14px;
  color: #8d6e63;
}

/* 成绩概览 */
.score-overview {
  background: white;
  border-radius: 16px;
  padding: 30px 20px;
  margin: 0 15px 25px;
  box-shadow: 0 8px 25px rgba(93, 64, 55, 0.08);
  display: flex;
  align-items: center;
  gap: 30px;
  border: 1px solid #e8e1d9;
}

.score-circle {
  position: relative;
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #d4a762, #b88a3e);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 4px 15px rgba(212, 167, 98, 0.3);
}

.score-number {
  font-size: 36px;
  font-weight: bold;
}

.score-label {
  font-size: 14px;
  opacity: 0.9;
}

.score-details {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.score-item {
  text-align: center;
  padding: 12px;
  background: #f8f1e9;
  border-radius: 10px;
  border: 1px solid #e8e1d9;
}

.score-item-label {
  display: block;
  font-size: 13px;
  color: #8d6e63;
  margin-bottom: 5px;
}

.score-item-value {
  display: block;
  font-size: 18px;
  font-weight: bold;
  color: #5d4037;
}

.score-item-value.correct {
  color: #2ecc71;
}

.score-item-value.wrong {
  color: #e74c3c;
}

/* 详细分析 */
.detailed-analysis {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin: 0 15px 25px;
  border: 1px solid #e8e1d9;
}

.knowledge-mastery {
  margin-bottom: 25px;
}

.knowledge-title {
  font-size: 16px;
  font-weight: bold;
  color: #5d4037;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f8f1e9;
}

.knowledge-item {
  margin-bottom: 15px;
}

.knowledge-name {
  font-size: 14px;
  color: #8d6e63;
  display: block;
  margin-bottom: 8px;
}

.knowledge-progress {
  display: flex;
  align-items: center;
  gap: 15px;
}

.knowledge-progress .progress-bar {
  flex: 1;
  height: 6px;
  background: #f8f1e9;
  border-radius: 3px;
  overflow: hidden;
}

.knowledge-progress .progress-fill {
  background: linear-gradient(90deg, #d4a762, #b88a3e);
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s ease;
}

.knowledge-percentage {
  font-size: 12px;
  color: #a1887f;
  min-width: 40px;
}

/* 错题列表 */
.wrong-questions {
  border-top: 1px solid #f8f1e9;
  padding-top: 20px;
}

.wrong-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.wrong-title text:first-child {
  font-size: 16px;
  font-weight: bold;
  color: #5d4037;
}

.wrong-count {
  font-size: 12px;
  color: #e74c3c;
  background: rgba(231, 76, 60, 0.1);
  padding: 4px 10px;
  border-radius: 12px;
  border: 1px solid rgba(231, 76, 60, 0.2);
}

.wrong-item {
  background: #f8f1e9;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s;
  border-left: 3px solid #d4a762;
  border: 1px solid #e8e1d9;
}

.wrong-item:active {
  background: #e8e1d9;
  transform: translateX(5px);
}

.wrong-question-number {
  font-size: 13px;
  color: #d4a762;
  font-weight: bold;
  margin-bottom: 8px;
}

.wrong-question-content {
  font-size: 14px;
  color: #5d4037;
  line-height: 1.4;
  margin-bottom: 10px;
}

.wrong-answer-info {
  display: flex;
  gap: 15px;
  font-size: 12px;
}

.your-answer {
  color: #e74c3c;
}

.correct-answer {
  color: #2ecc71;
}

/* 结果页面操作按钮 */
.result-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 20px 15px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e8e1d9;
}

.result-actions button {
  flex: 1;
  min-width: 120px;
  height: 44px;
  border-radius: 22px;
  font-size: 15px;
  border: none;
  outline: none;
}

.btn-restart {
  background: linear-gradient(135deg, #d4a762, #b88a3e);
  color: white;
}

.btn-review {
  background: #f39c12;
  color: white;
}

.btn-home {
  background: #f8f1e9;
  color: #8d6e63;
  border: 1px solid #e8e1d9;
}

.btn-share {
  background: #2ecc71;
  color: white;
}

/* 加载蒙层 */
.loading-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(248, 241, 233, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-content {
  background: white;
  padding: 25px 35px;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(93, 64, 55, 0.1);
  font-size: 16px;
  color: #5d4037;
  border: 1px solid #e8e1d9;
}

/* 响应式设计 */
@media (min-width: 768px) {
  .exam-container {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .mode-card {
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .question-container {
    max-width: 700px;
    margin: 0 auto;
    padding: 30px 20px 120px;
  }
  
  .nav-drawer {
    width: 400px;
  }
  
  .question-nav-grid {
    grid-template-columns: repeat(8, 1fr);
  }
}
</style>