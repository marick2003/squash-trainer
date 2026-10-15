<script setup>
import { trainingModes } from '../data/corners'

defineProps({
  mode: { type: String, required: true },
  pace: { type: Number, required: true },
  shotsPerSet: { type: Number, required: true },
  totalSets: { type: Number, required: true },
  splitWarning: { type: Boolean, required: true },
  corners: { type: Array, required: true },
})

defineEmits(['select-mode', 'update:pace', 'update:shotsPerSet', 'update:totalSets', 'update:splitWarning', 'preset'])
</script>

<template>
  <div class="space-y-4">
    <section class="rounded-lg border border-white/10 bg-[#19211d] p-4 sm:p-5">
      <div class="mb-3 flex items-center justify-between">
        <h2 class="text-xs font-bold uppercase tracking-[.16em] text-stone-400">訓練模式</h2>
        <span class="font-display text-[10px] font-bold tracking-widest text-lime-300">01 / MODE</span>
      </div>
      <div class="grid grid-cols-3 gap-2">
        <button v-for="item in trainingModes" :key="item.id" type="button" :aria-pressed="mode === item.id" :class="['min-h-[76px] rounded-md border p-2 text-left transition', mode === item.id ? 'border-lime-300/50 bg-lime-300/10 text-lime-200' : 'border-white/8 bg-[#111814] text-stone-400 hover:border-white/20 hover:text-stone-200']" @click="$emit('select-mode', item.id)">
          <span class="block text-xs font-bold leading-5">{{ item.name }}</span>
          <span class="mt-1 block text-[9px] leading-4 opacity-65">{{ item.description }}</span>
        </button>
      </div>
    </section>

    <section class="rounded-lg border border-white/10 bg-[#19211d] p-4 sm:p-5">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-xs font-bold uppercase tracking-[.16em] text-stone-400">節奏與球數</h2>
        <span class="font-display text-[10px] font-bold tracking-widest text-lime-300">02 / LOAD</span>
      </div>

      <label class="mb-1 flex items-center justify-between text-xs">
        <span class="font-medium text-stone-300">每球間隔基準</span><strong class="font-display text-sm text-lime-300">{{ pace.toFixed(1) }} 秒</strong>
      </label>
      <input :value="pace" type="range" min="1.8" max="5" step="0.2" class="mb-1 w-full cursor-pointer" aria-label="每球間隔基準" @input="$emit('update:pace', Number($event.target.value))" />
      <div class="mb-4 flex justify-between text-[9px] text-stone-500"><span>1.8 極速</span><span>5.0 新手</span></div>

      <label class="mb-1 flex items-center justify-between text-xs">
        <span class="font-medium text-stone-300">每組球數</span><strong class="font-display text-sm text-lime-300">{{ shotsPerSet }} 球</strong>
      </label>
      <input :value="shotsPerSet" type="range" min="6" max="30" step="1" class="mb-1 w-full cursor-pointer" aria-label="每組球數" @input="$emit('update:shotsPerSet', Number($event.target.value))" />
      <div class="mb-4 flex justify-between text-[9px] text-stone-500"><span>6 純爆發</span><span>30 心肺耐力</span></div>

      <label class="mb-1 flex items-center justify-between text-xs">
        <span class="font-medium text-stone-300">總組數</span><strong class="font-display text-sm text-lime-300">{{ totalSets }} 組</strong>
      </label>
      <input :value="totalSets" type="range" min="1" max="8" step="1" class="mb-5 w-full cursor-pointer" aria-label="總組數" @input="$emit('update:totalSets', Number($event.target.value))" />

      <div class="border-t border-white/8 pt-4">
        <div class="mb-2 flex items-center justify-between gap-2">
          <span class="text-xs font-medium text-stone-300">涵蓋目標點位</span>
          <div class="flex gap-1">
            <button v-for="preset in [{ id: 'all', label: '全場 6 點' }, { id: 'four', label: '前後 4 角' }, { id: 'front', label: '僅前場' }]" :key="preset.id" type="button" class="rounded border border-white/10 px-2 py-1 text-[9px] text-stone-400 transition hover:border-lime-300/40 hover:text-lime-200" @click="$emit('preset', preset.id)">{{ preset.label }}</button>
          </div>
        </div>
        <p class="text-[10px] leading-5 text-stone-500">已啟用 {{ corners.filter((corner) => corner.active).length }} / 6 點。也可直接點擊球場上的目標切換。</p>
      </div>

      <label class="mt-4 flex cursor-pointer items-center justify-between border-t border-white/8 pt-4">
        <span><span class="block text-xs font-medium text-stone-300">墊步預警信號</span><span class="mt-1 block text-[9px] text-stone-500">出球前提示小跳蓄力</span></span>
        <input :checked="splitWarning" type="checkbox" class="peer sr-only" @change="$emit('update:splitWarning', $event.target.checked)" />
        <span class="relative h-5 w-9 rounded-full bg-stone-700 transition peer-checked:bg-lime-500 after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-4 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-lime-300" />
      </label>
    </section>
  </div>
</template>