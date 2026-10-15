import { onBeforeUnmount, ref } from 'vue'

const MALE_HINTS = ['male', 'yunyang', 'yunxi', 'yunjian', 'yunjhe', 'kangkang', 'zhiwei', 'li-mu', 'limu', 'wanlung', 'danny']
const FEMALE_HINTS = ['female', 'mei-jia', 'meijia', 'ting-ting', 'tingting', 'sin-ji', 'yaoyao', 'huihui', 'hanhan', 'xiaoxiao', 'xiaoyi', 'hsiaochen', 'hsiaoyu', 'yating', 'shanshan', 'google']

function isMale(voice) {
  const name = voice.name.toLowerCase()
  return !name.includes('female') && MALE_HINTS.some((hint) => name.includes(hint))
}

export function useVoice() {
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : undefined
  const supported = Boolean(synth)
  const voiceEnabled = ref(true)
  const gender = ref('female')
  const volume = ref(0.8)
  const rate = ref(1.3)
  const voices = ref([])

  function loadVoices() {
    if (!synth) return
    const all = synth.getVoices()
    const tw = all.filter((voice) => /zh[-_](TW|HK)/i.test(voice.lang))
    const zh = all.filter((voice) => /^(zh|cmn)/i.test(voice.lang) && !tw.includes(voice))
    voices.value = [...tw, ...zh]
  }

  // When the device has no voice of the chosen gender, fall back to pitch shifting
  function pickVoice() {
    const list = voices.value
    if (gender.value === 'male') {
      const male = list.find(isMale)
      return male ? { voice: male, pitch: 1, exact: true } : { voice: list[0], pitch: 0.55, exact: false }
    }
    const female = list.find((voice) => !isMale(voice) && FEMALE_HINTS.some((hint) => voice.name.toLowerCase().includes(hint)))
      || list.find((voice) => !isMale(voice))
    return female ? { voice: female, pitch: 1.1, exact: true } : { voice: list[0], pitch: 1.4, exact: false }
  }

  function voiceLabel() {
    if (!supported) return '此瀏覽器不支援語音合成，僅能使用提示音'
    const { voice, exact } = pickVoice()
    if (!voice) return '找不到中文語音，將使用系統預設語音'
    return `使用語音：${voice.name}${exact ? '' : `（以音調模擬${gender.value === 'male' ? '男聲' : '女聲'}）`}`
  }

  function speak(text) {
    if (!synth || !voiceEnabled.value) return
    try {
      synth.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      const { voice, pitch } = pickVoice()
      if (voice) utterance.voice = voice
      utterance.lang = voice?.lang || 'zh-TW'
      utterance.pitch = pitch
      utterance.rate = rate.value
      utterance.volume = volume.value
      synth.speak(utterance)
    } catch (error) {
      console.error('Speech error:', error)
    }
  }

  function cancel() {
    synth?.cancel()
  }

  if (synth) {
    loadVoices()
    synth.addEventListener?.('voiceschanged', loadVoices)
  }

  onBeforeUnmount(() => {
    cancel()
    synth?.removeEventListener?.('voiceschanged', loadVoices)
  })

  return { supported, voiceEnabled, gender, volume, rate, voices, voiceLabel, speak, cancel }
}
