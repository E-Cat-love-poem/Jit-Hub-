"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "exam",
  setup(__props) {
    const startExam = common_vendor.ref(false);
    const showResult = common_vendor.ref(false);
    const isLoading = common_vendor.ref(false);
    const showNavDrawer = common_vendor.ref(false);
    const currentMode = common_vendor.ref("");
    const currentIndex = common_vendor.ref(0);
    const showAnalysis = common_vendor.ref(false);
    const timeLeft = common_vendor.ref(90 * 60);
    const timeUsed = common_vendor.ref(0);
    const timer = common_vendor.ref(null);
    const questionBank = common_vendor.ref({
      randomCount: 100,
      chapters: [
        { id: 1, name: "基础知识", questions: 20 },
        { id: 2, name: "核心概念", questions: 30 },
        { id: 3, name: "高级应用", questions: 25 },
        { id: 4, name: "综合实战", questions: 25 }
      ]
    });
    const studyProgress = common_vendor.ref(3);
    const wrongQuestions = common_vendor.ref([]);
    const lastWrongReview = common_vendor.ref("2024-01-10");
    const questions = common_vendor.ref([]);
    const examResult = common_vendor.ref({
      score: 0,
      totalQuestions: 0,
      correctCount: 0,
      wrongCount: 0,
      timeUsed: 0,
      knowledgePoints: [],
      wrongQuestions: []
    });
    const currentQuestion = common_vendor.computed(() => questions.value[currentIndex.value] || {});
    const answeredCount = common_vendor.computed(() => questions.value.filter((q) => q.userAnswer !== void 0).length);
    const markedCount = common_vendor.computed(() => questions.value.filter((q) => q.marked).length);
    const unansweredCount = common_vendor.computed(() => questions.value.length - answeredCount.value);
    common_vendor.onLoad(() => {
      loadWrongQuestions();
    });
    common_vendor.onUnmounted(() => {
      if (timer.value)
        clearInterval(timer.value);
    });
    const loadWrongQuestions = async () => {
      try {
        wrongQuestions.value = [
          { id: 1, questionId: 101, content: "关于Python装饰器的作用...", userAnswer: "A", correctAnswer: "C" },
          { id: 2, questionId: 205, content: "JavaScript闭包的应用场景...", userAnswer: "B", correctAnswer: "D" }
        ];
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/exam/exam.vue:396", "加载错题失败:", error);
      }
    };
    const getModeText = (mode) => {
      const modeMap = {
        "random": "随机练习",
        "chapter": "章节测试",
        "exam": "模拟考试",
        "wrong": "错题重做"
      };
      return modeMap[mode] || "";
    };
    const selectMode = (mode) => {
      currentMode.value = mode;
      switch (mode) {
        case "random":
          startRandomPractice();
          break;
        case "chapter":
          showChapterSelect();
          break;
        case "exam":
          startSimulatedExam();
          break;
        case "wrong":
          startWrongReview();
          break;
      }
    };
    const startRandomPractice = async () => {
      isLoading.value = true;
      try {
        await loadQuestions();
        startExam.value = true;
        startTimer(false);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/exam/exam.vue:439", "加载题目失败:", error);
        common_vendor.index.showToast({ title: "加载失败", icon: "none" });
      } finally {
        isLoading.value = false;
      }
    };
    const startSimulatedExam = async () => {
      common_vendor.index.showModal({
        title: "模拟考试",
        content: "本次考试共50题，限时90分钟。开始后计时将不会停止，确定开始吗？",
        success: async (res) => {
          if (res.confirm) {
            isLoading.value = true;
            try {
              await loadQuestions(50);
              startExam.value = true;
              startTimer(true);
            } catch (error) {
              common_vendor.index.__f__("error", "at pages/exam/exam.vue:459", "加载题目失败:", error);
            } finally {
              isLoading.value = false;
            }
          }
        }
      });
    };
    const startWrongReview = async () => {
      if (wrongQuestions.value.length === 0) {
        common_vendor.index.showToast({ title: "暂无错题", icon: "none" });
        return;
      }
      isLoading.value = true;
      try {
        await loadQuestions(10, true);
        startExam.value = true;
        startTimer(false);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/exam/exam.vue:481", "加载错题失败:", error);
      } finally {
        isLoading.value = false;
      }
    };
    const showChapterSelect = () => {
      common_vendor.index.showActionSheet({
        title: "选择章节",
        itemList: questionBank.value.chapters.map((ch) => `${ch.name} (${ch.questions}题)`),
        success: async (res) => {
          const chapterIndex = res.tapIndex;
          isLoading.value = true;
          try {
            await loadQuestions(20, false, chapterIndex + 1);
            startExam.value = true;
            startTimer(false);
          } catch (error) {
            common_vendor.index.__f__("error", "at pages/exam/exam.vue:500", "加载章节题目失败:", error);
          } finally {
            isLoading.value = false;
          }
        }
      });
    };
    const loadQuestions = async (count = 10, isWrong = false, chapterId = null) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const sampleQuestions = [];
          const types = ["single", "multiple", "judge"];
          const knowledgePoints = [
            "Python基础",
            "JavaScript核心",
            "HTML/CSS",
            "数据结构",
            "算法"
          ];
          for (let i = 0; i < count; i++) {
            const type = types[Math.floor(Math.random() * types.length)];
            const optionCount = type === "multiple" ? 4 : 4;
            sampleQuestions.push({
              id: i + 1,
              type,
              content: `<p>${i + 1}. 这是第${i + 1}道题目，关于${knowledgePoints[Math.floor(Math.random() * knowledgePoints.length)]}的知识点。</p>`,
              options: Array.from(
                { length: optionCount },
                (_, idx) => `选项${String.fromCharCode(65 + idx)}的内容描述`
              ),
              correctAnswer: type === "multiple" ? "AB" : "A",
              analysis: "<p>这是题目的详细解析，解释了为什么正确答案是正确选项。</p>",
              knowledgePoints: knowledgePoints[Math.floor(Math.random() * knowledgePoints.length)],
              userAnswer: void 0,
              marked: false
            });
          }
          questions.value = sampleQuestions;
          resolve();
        }, 1e3);
      });
    };
    const startTimer = (isLimited) => {
      if (isLimited) {
        timer.value = setInterval(() => {
          if (timeLeft.value <= 0) {
            clearInterval(timer.value);
            timeUp();
            return;
          }
          timeLeft.value--;
          timeUsed.value++;
        }, 1e3);
      } else {
        timer.value = setInterval(() => {
          timeUsed.value++;
        }, 1e3);
      }
    };
    const timeUp = () => {
      common_vendor.index.showModal({
        title: "时间到",
        content: "考试时间已结束，系统将自动交卷",
        showCancel: false,
        success: () => {
          submitExam();
        }
      });
    };
    const formatTime = (seconds) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor(seconds % 3600 / 60);
      const secs = seconds % 60;
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };
    const getQuestionType = (type) => {
      const typeMap = {
        "single": "单选题",
        "multiple": "多选题",
        "judge": "判断题"
      };
      return typeMap[type] || "未知类型";
    };
    const selectAnswer = (answer) => {
      if (showResult.value)
        return;
      const currentQ = currentQuestion.value;
      if (currentQ.type === "multiple") {
        if (!currentQ.userAnswer) {
          currentQ.userAnswer = answer;
        } else if (currentQ.userAnswer.includes(answer)) {
          currentQ.userAnswer = currentQ.userAnswer.replace(answer, "");
          if (currentQ.userAnswer === "") {
            currentQ.userAnswer = void 0;
          }
        } else {
          currentQ.userAnswer = (currentQ.userAnswer + answer).split("").sort().join("");
        }
      } else {
        currentQ.userAnswer = answer;
      }
    };
    const toggleMark = () => {
      questions.value[currentIndex.value].marked = !questions.value[currentIndex.value].marked;
    };
    const toggleAnalysis = () => {
      showAnalysis.value = !showAnalysis.value;
    };
    const toggleNavDrawer = () => {
      showNavDrawer.value = !showNavDrawer.value;
    };
    const closeNavDrawer = () => {
      showNavDrawer.value = false;
    };
    const prevQuestion = () => {
      if (currentIndex.value > 0) {
        currentIndex.value--;
        showAnalysis.value = false;
        closeNavDrawer();
      }
    };
    const nextQuestion = () => {
      if (currentIndex.value < questions.value.length - 1) {
        currentIndex.value++;
        showAnalysis.value = false;
        closeNavDrawer();
      }
    };
    const jumpToQuestion = (index) => {
      currentIndex.value = index;
      showAnalysis.value = false;
      closeNavDrawer();
    };
    const jumpToUnanswered = () => {
      const unansweredIndex = questions.value.findIndex((q) => q.userAnswer === void 0);
      if (unansweredIndex !== -1) {
        jumpToQuestion(unansweredIndex);
      }
    };
    const showSubmitConfirm = () => {
      common_vendor.index.showModal({
        title: "确认交卷",
        content: `当前已答${answeredCount.value}/${questions.value.length}题，确认要提交试卷吗？`,
        success: (res) => {
          if (res.confirm) {
            calculateResult();
          }
        }
      });
    };
    const submitExam = () => {
      if (timer.value) {
        clearInterval(timer.value);
      }
      const answeredQuestions = questions.value.filter((q) => q.userAnswer !== void 0);
      const correctQuestions = answeredQuestions.filter((q) => q.userAnswer === q.correctAnswer);
      const wrongQuestionsList = questions.value.filter((q) => q.userAnswer !== void 0 && q.userAnswer !== q.correctAnswer).map((q, index) => ({
        ...q,
        index
      }));
      const knowledgeMap = {};
      questions.value.forEach((q) => {
        if (!knowledgeMap[q.knowledgePoints]) {
          knowledgeMap[q.knowledgePoints] = { total: 0, correct: 0 };
        }
        knowledgeMap[q.knowledgePoints].total++;
        if (q.userAnswer === q.correctAnswer) {
          knowledgeMap[q.knowledgePoints].correct++;
        }
      });
      const knowledgePoints = Object.entries(knowledgeMap).map(([name, data]) => ({
        name,
        mastery: Math.round(data.correct / data.total * 100)
      }));
      const score = Math.round(correctQuestions.length / questions.value.length * 100);
      examResult.value = {
        score,
        totalQuestions: questions.value.length,
        correctCount: correctQuestions.length,
        wrongCount: wrongQuestionsList.length,
        timeUsed: timeUsed.value,
        knowledgePoints,
        wrongQuestions: wrongQuestionsList
      };
      startExam.value = false;
      showResult.value = true;
      saveWrongQuestions(wrongQuestionsList);
    };
    const saveWrongQuestions = (wrongList) => {
      try {
        const existing = common_vendor.index.getStorageSync("wrongQuestions") || [];
        const newWrongs = wrongList.map((q) => ({
          questionId: q.id,
          content: q.content,
          userAnswer: q.userAnswer,
          correctAnswer: q.correctAnswer,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }));
        common_vendor.index.setStorageSync("wrongQuestions", [...existing, ...newWrongs]);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/exam/exam.vue:747", "保存错题失败:", error);
      }
    };
    const reviewQuestion = (question) => {
      common_vendor.index.showModal({
        title: "查看错题",
        content: "确定要查看这道错题的详细内容吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.navigateTo({
              url: `/pages/questionDetail/questionDetail?id=${question.questionId || question.id}`
            });
          }
        }
      });
    };
    const reviewWrongQuestions = () => {
      currentMode.value = "wrong";
      startWrongReview();
    };
    const restartExam = () => {
      startExam.value = false;
      showResult.value = false;
      currentIndex.value = 0;
      timeLeft.value = 90 * 60;
      timeUsed.value = 0;
      showAnalysis.value = false;
      showNavDrawer.value = false;
      questions.value = [];
      selectMode(currentMode.value);
    };
    const goHome = () => {
      common_vendor.index.switchTab({
        url: "/pages/home/home"
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: !startExam.value && !showResult.value
      }, !startExam.value && !showResult.value ? {
        b: common_vendor.t(questionBank.value.randomCount),
        c: common_vendor.o(($event) => selectMode("random")),
        d: common_vendor.t(studyProgress.value),
        e: common_vendor.o(($event) => selectMode("chapter")),
        f: common_vendor.o(($event) => selectMode("exam")),
        g: common_vendor.t(wrongQuestions.value.length),
        h: common_vendor.t(lastWrongReview.value),
        i: common_vendor.o(($event) => selectMode("wrong"))
      } : {}, {
        j: startExam.value && !showResult.value
      }, startExam.value && !showResult.value ? common_vendor.e({
        k: common_vendor.t(currentIndex.value + 1),
        l: common_vendor.t(questions.value.length),
        m: common_vendor.t(getModeText(currentMode.value)),
        n: common_vendor.t(currentMode.value === "exam" ? formatTime(timeLeft.value) : formatTime(timeUsed.value)),
        o: timeLeft.value < 300 ? 1 : "",
        p: unansweredCount.value > 0
      }, unansweredCount.value > 0 ? {
        q: common_vendor.t(unansweredCount.value)
      } : {}, {
        r: common_vendor.o(toggleNavDrawer),
        s: common_vendor.t(currentQuestion.value.marked ? "★" : "☆"),
        t: common_vendor.o(toggleMark),
        v: currentQuestion.value.marked ? 1 : "",
        w: common_vendor.o(toggleAnalysis),
        x: showAnalysis.value ? 1 : "",
        y: showNavDrawer.value
      }, showNavDrawer.value ? common_vendor.e({
        z: common_vendor.t(answeredCount.value),
        A: common_vendor.t(markedCount.value),
        B: common_vendor.t(unansweredCount.value),
        C: common_vendor.o(closeNavDrawer),
        D: common_vendor.f(questions.value, (q, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(index + 1),
            b: q.marked
          }, q.marked ? {} : {}, {
            c: index,
            d: currentIndex.value === index ? 1 : "",
            e: q.userAnswer !== void 0 ? 1 : "",
            f: q.marked ? 1 : "",
            g: q.userAnswer === void 0 ? 1 : "",
            h: common_vendor.o(($event) => jumpToQuestion(index), index)
          });
        }),
        E: unansweredCount.value > 0
      }, unansweredCount.value > 0 ? {
        F: common_vendor.o(jumpToUnanswered)
      } : {}, {
        G: common_vendor.o(showSubmitConfirm),
        H: common_vendor.o(() => {
        }),
        I: common_vendor.o(closeNavDrawer)
      }) : {}, {
        J: common_vendor.t(getQuestionType(currentQuestion.value.type)),
        K: common_vendor.t(currentQuestion.value.marked ? "★ 已标记" : "☆ 标记"),
        L: common_vendor.o(toggleMark),
        M: currentQuestion.value.marked ? 1 : "",
        N: currentQuestion.value.content,
        O: common_vendor.f(currentQuestion.value.options, (option, optIndex, i0) => {
          return {
            a: common_vendor.t(String.fromCharCode(65 + optIndex)),
            b: common_vendor.t(option),
            c: optIndex,
            d: String.fromCharCode(65 + optIndex) === currentQuestion.value.userAnswer ? 1 : "",
            e: showAnalysis.value && String.fromCharCode(65 + optIndex) === currentQuestion.value.correctAnswer ? 1 : "",
            f: showAnalysis.value && String.fromCharCode(65 + optIndex) === currentQuestion.value.userAnswer && String.fromCharCode(65 + optIndex) !== currentQuestion.value.correctAnswer ? 1 : "",
            g: common_vendor.o(($event) => selectAnswer(String.fromCharCode(65 + optIndex)), optIndex)
          };
        }),
        P: showAnalysis.value
      }, showAnalysis.value ? {
        Q: common_vendor.t(currentQuestion.value.correctAnswer),
        R: currentQuestion.value.analysis,
        S: common_vendor.t(currentQuestion.value.knowledgePoints)
      } : {}, {
        T: common_vendor.o(prevQuestion),
        U: currentIndex.value === 0,
        V: common_vendor.o(nextQuestion),
        W: currentIndex.value === questions.value.length - 1,
        X: currentMode.value !== "random"
      }, currentMode.value !== "random" ? {
        Y: common_vendor.o(showSubmitConfirm)
      } : {}, {
        Z: common_vendor.t(showAnalysis.value ? "隐藏解析" : "查看解析"),
        aa: common_vendor.o(toggleAnalysis)
      }) : {}, {
        ab: showResult.value
      }, showResult.value ? common_vendor.e({
        ac: common_vendor.t(examResult.value.score),
        ad: common_vendor.t(examResult.value.totalQuestions),
        ae: common_vendor.t(examResult.value.correctCount),
        af: common_vendor.t(examResult.value.wrongCount),
        ag: common_vendor.t(formatTime(examResult.value.timeUsed)),
        ah: common_vendor.f(examResult.value.knowledgePoints, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: item.mastery + "%",
            c: common_vendor.t(item.mastery),
            d: item.name
          };
        }),
        ai: examResult.value.wrongQuestions.length > 0
      }, examResult.value.wrongQuestions.length > 0 ? {
        aj: common_vendor.t(examResult.value.wrongQuestions.length),
        ak: common_vendor.f(examResult.value.wrongQuestions, (q, index, i0) => {
          return {
            a: common_vendor.t(q.index + 1),
            b: common_vendor.t(q.content.substring(0, 50)),
            c: common_vendor.t(q.userAnswer),
            d: common_vendor.t(q.correctAnswer),
            e: index,
            f: common_vendor.o(($event) => reviewQuestion(q), index)
          };
        })
      } : {}, {
        al: common_vendor.o(restartExam),
        am: examResult.value.wrongQuestions.length > 0
      }, examResult.value.wrongQuestions.length > 0 ? {
        an: common_vendor.o(reviewWrongQuestions)
      } : {}, {
        ao: common_vendor.o(goHome)
      }) : {}, {
        ap: isLoading.value
      }, isLoading.value ? {} : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-970fed46"]]);
_sfc_main.__runtimeHooks = 2;
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/exam/exam.js.map
