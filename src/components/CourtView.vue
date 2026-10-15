<script setup>
import { ArrowUpRight } from 'lucide-vue-next'

defineProps({
  corners: { type: Array, required: true },
  activeCornerId: { type: String, default: null },
  splitCueActive: { type: Boolean, default: false },
})

defineEmits(['toggle-corner'])
</script>

<template>
  <div class="court-grid select-none" aria-label="互動式壁球場，點擊目標點可開啟或關閉">
    <div class="absolute inset-x-0 top-0 z-10 flex h-7 items-center justify-center border-b-2 border-[#ed5c48] bg-[#ed5c48]/20 text-[9px] font-bold tracking-[.18em] text-red-200">FRONT WALL · 前牆</div>
    <div class="absolute inset-x-0 top-[45%] z-0 h-0.5 bg-[#ed5c48]/90" />
    <div class="absolute bottom-0 left-1/2 top-[45%] z-0 w-0.5 -translate-x-1/2 bg-[#ed5c48]/90" />
    <div class="absolute left-0 top-[45%] z-0 h-[24%] w-[28%] border-b-2 border-r-2 border-[#ed5c48]/90" />
    <div class="absolute right-0 top-[45%] z-0 h-[24%] w-[28%] border-b-2 border-l-2 border-[#ed5c48]/90" />

    <div :class="['absolute left-1/2 top-[45%] z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-dashed text-xs font-black transition', splitCueActive ? 'pulse-effect border-amber-300 bg-amber-300/30 text-amber-100' : 'border-lime-300/70 bg-lime-300/10 text-lime-300']">T 點</div>

    <svg class="pointer-events-none absolute inset-0 z-10 h-full w-full" aria-hidden="true">
      <defs><marker id="court-arrow" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#a8d96b" /></marker></defs>
      <line v-if="activeCornerId" x1="50%" y1="45%" :x2="`${corners.find((corner) => corner.id === activeCornerId)?.x}%`" :y2="`${corners.find((corner) => corner.id === activeCornerId)?.y}%`" stroke="#a8d96b" stroke-width="3" stroke-dasharray="6,4" marker-end="url(#court-arrow)" />
    </svg>

    <button
      v-for="corner in corners"
      :key="corner.id"
      type="button"
      :aria-label="`${corner.name}，${corner.type}${corner.active ? '，已啟用' : '，已停用'}`"
      :aria-pressed="corner.active"
      :style="{ left: `${corner.x}%`, top: `${corner.y}%` }"
      :class="[
        'absolute z-20 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-md border text-xs font-bold shadow-lg transition duration-200 hover:-translate-x-1/2 hover:-translate-y-1/2 hover:border-lime-200',
        corner.active ? 'border-white/15 bg-[#18201c]/95 text-stone-100' : 'border-white/5 bg-[#18201c]/70 text-stone-500 opacity-40 line-through',
        activeCornerId === corner.id ? 'scale-110 border-lime-200 bg-lime-500 text-[#101613] ring-4 ring-lime-300/60' : '',
      ]"
      @click="$emit('toggle-corner', corner.id)"
    >
      <span>{{ corner.shortName }}</span>
      <span class="mt-0.5 text-[8px] font-medium opacity-70">{{ corner.type }}</span>
      <ArrowUpRight v-if="activeCornerId === corner.id" class="absolute -right-2 -top-2 h-4 w-4 rounded-full bg-lime-200 p-0.5 text-[#18201c]" />
    </button>

    <div class="absolute inset-x-0 bottom-0 z-10 flex h-5 items-center justify-center border-t border-[#ed5c48]/60 bg-[#ed5c48]/10 text-[8px] font-bold tracking-[.18em] text-red-200/80">BACK WALL · 後牆</div>
  </div>
</template>