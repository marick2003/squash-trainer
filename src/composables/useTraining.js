import { computed, onBeforeUnmount, reactive, ref } from 'vue'
import { corners as cornerDefaults } from '../data/corners'

const idleStatus = {
  phase: '待機準備',
  title: '站在 T 點準備',
  hint: '重心微放低，雙腳微彈動，視線模擬盯著前牆對手球路',
  tone: 'neutral',
}

export function useTraining() {
  const corners = reactive(cornerDefaults.map((corner) => ({ ...corner })))
  const mode = ref('match')
  const pace = ref(3.2)
  const shotsPerSet = ref(15)
  const totalSets = ref(3)
  const splitWarning = ref(true)
  const soundEnabled = ref(true)
  const isRunning = ref(false)
  const isPaused = ref(false)
  const currentSet = ref(1)
  const currentShot = ref(0)
  const guideOpen = ref(false)
  const activeCornerId = ref(null)
  const splitCueActive = ref(false)
  const status = reactive({ ...idleStatus })
  const activeCorners = computed(() => corners.filter((corner) => corner.active))
  const currentTotal = computed(() => totalSets.value * shotsPerSet.value)

  let audioContext
  let mainTimer
  let splitTimer
  let intervalTimer

  function clearTimers() {
    clearTimeout(mainTimer)
    clearTimeout(splitTimer)
    clearInterval(intervalTimer)
    mainTimer = splitTimer = intervalTimer = undefined
  }

  function tone(frequency, duration = 0.12, volume = 0.25, type = 'sine') {
    if (!soundEnabled.value) return
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext
      if (!audioContext && AudioContextClass) audioContext = new AudioContextClass()
      if (!audioContext) return
      if (audioContext.state === 'suspended') audioContext.resume()
      const oscillator = audioContext.createOscillator()
      const gain = audioContext.createGain()
      oscillator.type = type
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
      gain.gain.setValueAtTime(volume, audioContext.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration)
      oscillator.connect(gain)
      gain.connect(audioContext.destination)
      oscillator.start()
      oscillator.stop(audioContext.currentTime + duration)
    } catch (error) {
      console.error('Audio play error:', error)
    }
  }

  function setStatus(phase, title, hint, toneName = 'neutral') {
    Object.assign(status, { phase, title, hint, tone: toneName })
  }

  function selectMode(selectedMode) {
    mode.value = selectedMode
    pace.value = { match: 3.2, fixed: 3.0, hiit: 2.4 }[selectedMode]
  }

  function applyPreset(preset) {
    const enabled = {
      all: corners.map((corner) => corner.id),
      four: ['FL', 'FR', 'BL', 'BR'],
      front: ['FL', 'FR'],
    }[preset]
    corners.forEach((corner) => { corner.active = enabled.includes(corner.id) })
  }

  function toggleCorner(id) {
    const corner = corners.find((item) => item.id === id)
    if (corner) corner.active = !corner.active
  }

  function countdown(seconds, callback) {
    let remaining = seconds
    setStatus('倒數準備', `站上 T 點... ${remaining}`, '調整呼吸，重心下沉預備', 'amber')
    tone(440, 0.1, 0.2)
    intervalTimer = setInterval(() => {
      remaining -= 1
      if (remaining > 0) {
        setStatus('倒數準備', `站上 T 點... ${remaining}`, '調整呼吸，重心下沉預備', 'amber')
        tone(440, 0.1, 0.2)
      } else {
        clearInterval(intervalTimer)
        intervalTimer = undefined
        callback()
      }
    }, 1000)
  }

  function start() {
    if (isRunning.value) {
      if (isPaused.value) resume()
      return
    }
    if (!activeCorners.value.length) {
      setStatus('提示', '請至少開啟一個目標點', '點擊球場上的點位，或使用上方點位預設', 'red')
      return
    }
    tone(600, 0.1, 0.15)
    isRunning.value = true
    isPaused.value = false
    currentShot.value = 0
    currentSet.value = 1
    countdown(3, nextShot)
  }

  function pause() {
    if (!isRunning.value || isPaused.value) return
    isPaused.value = true
    clearTimers()
    splitCueActive.value = false
    setStatus('已暫停', '訓練已暫停', '點擊「繼續訓練」回到節奏', 'muted')
  }

  function resume() {
    isPaused.value = false
    nextShot()
  }

  function reset() {
    clearTimers()
    isRunning.value = false
    isPaused.value = false
    currentSet.value = 1
    currentShot.value = 0
    activeCornerId.value = null
    splitCueActive.value = false
    Object.assign(status, idleStatus)
  }

  function nextShot() {
    if (!isRunning.value || isPaused.value) return
    currentShot.value += 1
    if (currentShot.value > shotsPerSet.value) {
      currentShot.value = shotsPerSet.value
      completeSet()
      return
    }

    const variance = mode.value === 'match' ? (Math.random() * 0.5 - 0.25) * pace.value : 0
    const interval = Math.max(1.8, pace.value + variance)
    const target = activeCorners.value[Math.floor(Math.random() * activeCorners.value.length)]
    activeCornerId.value = null
    splitCueActive.value = false
    setStatus(`第 ${currentShot.value} 球 · 回 T 點`, '回 T 點就位', '雙腳微踩動，注視前牆', 'cyan')

    if (splitWarning.value) {
      splitTimer = setTimeout(() => {
        if (!isRunning.value || isPaused.value) return
        splitCueActive.value = true
        setStatus('墊步小跳！', 'SPLIT STEP 墊步！', '對手擊球瞬間！小跳落地蓄力、膝蓋微彎！', 'amber')
        tone(880, 0.1, 0.35, 'triangle')
      }, Math.max(0.6, interval - 0.7) * 1000)
    }

    mainTimer = setTimeout(() => {
      if (!isRunning.value || isPaused.value) return
      splitCueActive.value = false
      activeCornerId.value = target.id
      tone(523.25, 0.18, 0.4)
      const advice = target.zone === 'front'
        ? '前場大跨步（Lunge）放短，揮拍後蹬地推回 T 點！'
        : target.zone === 'middle'
          ? '側向橫跨一步截擊（Volley），核心緊繃！'
          : '轉體交叉步向後退（Drive），側身引拍擊深球！'
      setStatus(`第 ${currentShot.value} 球 · 啟動出擊！`, `${target.name}（${target.type}）`, advice, 'green')
      mainTimer = setTimeout(nextShot, Math.max(1.2, interval * 0.7) * 1000)
    }, interval * 1000)
  }

  function completeSet() {
    clearTimeout(mainTimer)
    clearTimeout(splitTimer)
    splitCueActive.value = false
    tone(523.25, 0.1, 0.3)
    setTimeout(() => tone(659.25, 0.1, 0.3), 120)
    setTimeout(() => tone(783.99, 0.25, 0.3), 240)

    if (currentSet.value >= totalSets.value) {
      isRunning.value = false
      setStatus('訓練圓滿達成！', '全套空擊訓練完成！', `共完成 ${totalSets.value} 組、${currentTotal.value} 次 T 點墊步與啟動步！`, 'green')
      return
    }

    let remaining = 30
    setStatus(`第 ${currentSet.value} 組完成！`, `組間休息 ${remaining} 秒`, '深呼吸放鬆腳踝與小腿，補充水分', 'amber')
    intervalTimer = setInterval(() => {
      if (!isRunning.value || isPaused.value) return
      remaining -= 1
      if (remaining > 0) {
        setStatus(`第 ${currentSet.value} 組完成！`, `組間休息 ${remaining} 秒`, '深呼吸放鬆腳踝與小腿，補充水分', 'amber')
      } else {
        clearInterval(intervalTimer)
        intervalTimer = undefined
        currentSet.value += 1
        currentShot.value = 0
        countdown(3, nextShot)
      }
    }, 1000)
  }

  onBeforeUnmount(() => {
    clearTimers()
    audioContext?.close()
  })

  return {
    corners, activeCorners, mode, pace, shotsPerSet, totalSets, splitWarning,
    soundEnabled, isRunning, isPaused, currentSet, currentShot, currentTotal,
    guideOpen, activeCornerId, splitCueActive, status, selectMode, applyPreset,
    toggleCorner, start, pause, reset,
  }
}