<script setup>
import { X } from 'lucide-vue-next'

defineProps({ open: Boolean })
defineEmits(['close'])
</script>

<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm" @click.self="$emit('close')" @keydown.esc="$emit('close')">
    <section role="dialog" aria-modal="true" aria-labelledby="guide-title" class="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-lg border border-white/10 bg-[#19211d] p-5 shadow-2xl sm:p-7">
      <button type="button" aria-label="關閉指南" class="absolute right-4 top-4 rounded-md p-2 text-stone-400 transition hover:bg-white/5 hover:text-white" @click="$emit('close')"><X class="h-5 w-5" /></button>
      <p class="font-display text-[10px] font-bold tracking-[.2em] text-lime-300">COURT NOTES / 01</p>
      <h2 id="guide-title" class="mt-2 pr-10 text-lg font-bold text-white">T 點墊步與啟動步</h2>
      <div class="mt-5 space-y-3 text-xs leading-6 text-stone-300 sm:text-sm">
        <article class="rounded-md border border-white/8 bg-[#111814] p-4"><h3 class="mb-1 font-bold text-lime-300">01 / T 點墊步</h3><p>不要靜止站在 T 點。對手擊球的瞬間做小幅墊步，雙腳微開落地、膝蓋保持彈性，讓身體隨時準備朝下一個方向啟動。</p></article>
        <article class="rounded-md border border-white/8 bg-[#111814] p-4"><h3 class="mb-1 font-bold text-cyan-300">02 / 六個方向</h3><ul class="list-inside list-disc space-y-1"><li>前場：持拍側腳大跨步，重心穩定，擊球後蹬地回 T。</li><li>中場：側向推蹬、快速引拍，在球彈跳前完成截擊。</li><li>後場：轉肩交叉步，側身後退並留出揮拍空間。</li></ul></article>
        <article class="rounded-md border border-white/8 bg-[#111814] p-4"><h3 class="mb-1 font-bold text-amber-300">03 / Ghosting 練習</h3><p>把裝置放在場邊並開啟音量。站上 T 點，聽見提示後先墊步，再依球場指示全速啟動、揮拍，最後穩定回到 T 點。</p></article>
      </div>
      <button type="button" class="mt-5 w-full rounded-md bg-lime-300 px-4 py-3 text-sm font-bold text-[#101613] transition hover:bg-lime-200" @click="$emit('close')">明白，開始訓練</button>
    </section>
  </div>
</template>