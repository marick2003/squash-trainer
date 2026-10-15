<script setup>
import { computed } from 'vue'
import { Activity, Info, Pause, Play, RotateCcw, Volume2, VolumeX } from 'lucide-vue-next'
import CourtView from './components/CourtView.vue'
import GuideModal from './components/GuideModal.vue'
import TrainingSettings from './components/TrainingSettings.vue'
import VoiceSettings from './components/VoiceSettings.vue'
import { useTraining } from './composables/useTraining'

const training = useTraining()
const voice = training.voice
const voiceLabel = computed(() => (voice.gender.value, voice.voices.value, voice.voiceLabel()))
const shotDisplay = computed(() => `${training.currentShot.value} / ${training.shotsPerSet.value}`)
const setDisplay = computed(() => `${training.currentSet.value} / ${training.totalSets.value}`)
const toneClasses = computed(() => ({
  neutral: 'border-white/10', cyan: 'border-cyan-400/45', amber: 'border-amber-300/70',
  green: 'border-lime-300/70', red: 'border-red-400/70', muted: 'border-white/10',
}[training.status.tone]))

function toggleSound() {
  training.soundEnabled.value = !training.soundEnabled.value
  if (!training.soundEnabled.value) voice.cancel()
}

function setGender(gender) {
  voice.gender.value = gender
  voice.speak(gender === 'male' ? '男聲，前左' : '女聲，前左')
}
</script>

<template>
  <div class="min-h-screen bg-[#101613] text-stone-100 selection:bg-lime-300 selection:text-[#101613]">
    <header class="sticky top-0 z-30 border-b border-white/8 bg-[#101613]/95 backdrop-blur">
      <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div class="flex min-w-0 items-center gap-3">
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-lime-300 text-xl font-black text-[#101613]"><Activity class="h-5 w-5" /></div>
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <h1 class="text-sm font-bold text-white sm:text-base">壁球步法訓練器</h1>
              <span class="font-display text-[9px] font-bold tracking-[.14em] text-lime-300">GHOSTING STUDIO</span>
            </div>
            <p class="hidden text-[10px] text-stone-500 sm:block">SPLIT STEP · REACTION · RECOVERY</p>
          </div>
        </div>

        <div class="flex items-center gap-2 sm:gap-3">
          <div class="hidden items-center gap-4 rounded-md border border-white/8 bg-[#19211d] px-3 py-1.5 sm:flex">
            <div><span class="block text-[8px] tracking-wider text-stone-500">本組球數</span><strong class="font-display text-sm text-lime-300">{{ shotDisplay }}</strong></div>
            <div class="h-6 w-px bg-white/10" />
            <div><span class="block text-[8px] tracking-wider text-stone-500">組數</span><strong class="font-display text-sm text-cyan-300">{{ setDisplay }}</strong></div>
          </div>
          <button type="button" :aria-label="training.soundEnabled.value ? '關閉聲音' : '開啟聲音'" class="rounded-md border border-white/10 bg-[#19211d] p-2 text-stone-300 transition hover:border-lime-300/40 hover:text-lime-200" @click="toggleSound"><Volume2 v-if="training.soundEnabled.value" class="h-4 w-4" /><VolumeX v-else class="h-4 w-4" /></button>
          <button type="button" aria-label="開啟動作指南" class="rounded-md border border-white/10 bg-[#19211d] p-2 text-stone-300 transition hover:border-amber-300/40 hover:text-amber-200" @click="training.guideOpen.value = true"><Info class="h-4 w-4" /></button>
        </div>
      </div>
    </header>

    <main class="mx-auto grid w-full max-w-6xl gap-5 px-4 py-5 sm:px-6 sm:py-7 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,.9fr)] lg:gap-7">
      <section class="flex flex-col items-center">
        <div :class="['mb-4 w-full rounded-lg border bg-[#19211d] px-4 py-4 text-center transition-colors duration-200 sm:px-6', toneClasses]">
          <p class="font-display text-[10px] font-bold uppercase tracking-[.2em] text-stone-400">{{ training.status.phase }}</p>
          <h2 class="mt-1 text-xl font-black leading-tight text-white sm:text-2xl">{{ training.status.title }}</h2>
          <p class="mt-1 text-[11px] leading-5 text-stone-400 sm:text-xs">{{ training.status.hint }}</p>
        </div>

        <CourtView :corners="training.corners" :active-corner-id="training.activeCornerId.value" :split-cue-active="training.splitCueActive.value" @toggle-corner="training.toggleCorner" />

        <div class="mt-4 grid w-full max-w-[410px] grid-cols-[1fr_auto_auto] gap-2">
          <button type="button" class="flex min-h-12 items-center justify-center gap-2 rounded-md bg-lime-300 px-4 text-sm font-bold text-[#101613] transition hover:bg-lime-200 active:scale-[.99]" @click="training.start"><Play v-if="!training.isRunning.value || training.isPaused.value" class="h-4 w-4 fill-current" /><span>{{ training.isPaused.value ? '繼續訓練' : training.isRunning.value ? '訓練進行中' : training.currentShot.value ? '再練一輪' : '開始空擊訓練' }}</span></button>
          <button v-if="training.isRunning.value && !training.isPaused.value" type="button" aria-label="暫停訓練" class="flex min-h-12 items-center justify-center rounded-md border border-white/10 bg-[#19211d] px-4 text-stone-200 transition hover:bg-white/5" @click="training.pause"><Pause class="h-4 w-4" /></button>
          <button type="button" aria-label="重置訓練" class="flex min-h-12 items-center justify-center rounded-md border border-white/10 bg-[#19211d] px-4 text-stone-300 transition hover:bg-white/5 hover:text-white" @click="training.reset"><RotateCcw class="h-4 w-4" /></button>
        </div>
        <div class="mt-2 flex w-full max-w-[410px] justify-between px-1 text-[9px] text-stone-600 sm:hidden"><span>本組 {{ shotDisplay }} 球</span><span>組數 {{ setDisplay }}</span></div>
        <p class="mt-3 hidden text-[9px] tracking-[.16em] text-stone-600 sm:block">COURT MAP <span class="mx-1 text-lime-300">/</span> TAP A ZONE TO INCLUDE OR SKIP</p>
      </section>

      <aside class="space-y-4">
        <TrainingSettings
          :mode="training.mode.value"
          :pace="training.pace.value"
          :shots-per-set="training.shotsPerSet.value"
          :total-sets="training.totalSets.value"
          :split-warning="training.splitWarning.value"
          :corners="training.corners"
          @select-mode="training.selectMode"
          @update:pace="training.pace.value = $event"
          @update:shots-per-set="training.shotsPerSet.value = $event"
          @update:total-sets="training.totalSets.value = $event"
          @update:split-warning="training.splitWarning.value = $event"
          @preset="training.applyPreset"
        />

        <VoiceSettings
          :voice-enabled="voice.voiceEnabled.value"
          :gender="voice.gender.value"
          :volume="voice.volume.value"
          :rate="voice.rate.value"
          :label="voiceLabel"
          @update:voice-enabled="voice.voiceEnabled.value = $event; if (!$event) voice.cancel()"
          @update:gender="setGender"
          @update:volume="voice.volume.value = $event"
          @update:rate="voice.rate.value = $event"
          @test="voice.speak('前左，後右，中左')"
        />

        <section class="rounded-lg border border-white/8 bg-[#161d19] p-4 sm:p-5">
          <div class="mb-3 flex items-center gap-2"><span class="h-4 w-1 rounded-full bg-amber-300" /><h2 class="text-xs font-bold tracking-wide text-amber-200">步法提示</h2><span class="ml-auto font-display text-[9px] tracking-widest text-stone-600">COURT NOTES</span></div>
          <ul class="space-y-2 text-[10px] leading-5 text-stone-400 sm:text-[11px]">
            <li><strong class="text-stone-200">回 T 點不站死</strong>：腳掌輕踩、膝蓋微彎，保持隨時移動。</li>
            <li><strong class="text-stone-200">對手觸球即墊步</strong>：聽到提示音時微跳落地，準備向六個方向啟動。</li>
            <li><strong class="text-stone-200">前場大跨步</strong>：持拍側腳跨步擊球，接著蹬地推回 T 點。</li>
            <li><strong class="text-stone-200">後場轉體交叉</strong>：快速轉肩移動，留出與後牆的擊球距離。</li>
          </ul>
        </section>
      </aside>
    </main>

    <footer class="border-t border-white/6 px-4 py-3 text-center text-[9px] tracking-wide text-stone-600">GHOSTING STUDIO <span class="mx-1 text-lime-300">·</span> 壁球步法訓練</footer>
    <GuideModal :open="training.guideOpen.value" @close="training.guideOpen.value = false" />
  </div>
</template>