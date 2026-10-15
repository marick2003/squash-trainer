<script setup>
defineProps({
  voiceEnabled: { type: Boolean, required: true },
  gender: { type: String, required: true },
  volume: { type: Number, required: true },
  rate: { type: Number, required: true },
  label: { type: String, required: true },
})

defineEmits(['update:voiceEnabled', 'update:gender', 'update:volume', 'update:rate', 'test'])
</script>

<template>
  <section class="rounded-lg border border-white/10 bg-[#19211d] p-4 sm:p-5">
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-xs font-bold uppercase tracking-[.16em] text-stone-400">語音報位</h2>
      <span class="font-display text-[10px] font-bold tracking-widest text-lime-300">03 / VOICE</span>
    </div>

    <label class="mb-4 flex cursor-pointer items-center justify-between">
      <span><span class="block text-xs font-medium text-stone-300">語音喊出目標位置</span><span class="mt-1 block text-[9px] text-stone-500">不看螢幕也能聽聲音跑位</span></span>
      <input :checked="voiceEnabled" type="checkbox" class="peer sr-only" @change="$emit('update:voiceEnabled', $event.target.checked)" />
      <span class="relative h-5 w-9 rounded-full bg-stone-700 transition peer-checked:bg-lime-500 after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-4 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-lime-300" />
    </label>

    <div class="mb-4 flex items-center justify-between gap-2">
      <span class="text-xs font-medium text-stone-300">聲線</span>
      <div class="flex gap-1">
        <button v-for="item in [{ id: 'female', label: '女聲' }, { id: 'male', label: '男聲' }]" :key="item.id" type="button" :aria-pressed="gender === item.id" :class="['rounded border px-3 py-1 text-[11px] font-bold transition', gender === item.id ? 'border-lime-300/50 bg-lime-300/10 text-lime-200' : 'border-white/10 text-stone-400 hover:border-white/20 hover:text-stone-200']" @click="$emit('update:gender', item.id)">{{ item.label }}</button>
        <button type="button" class="rounded border border-white/10 px-3 py-1 text-[11px] font-bold text-amber-200 transition hover:border-amber-300/40" @click="$emit('test')">試聽</button>
      </div>
    </div>

    <label class="mb-1 flex items-center justify-between text-xs">
      <span class="font-medium text-stone-300">音量</span><strong class="font-display text-sm text-lime-300">{{ Math.round(volume * 100) }}%</strong>
    </label>
    <input :value="volume" type="range" min="0" max="1" step="0.05" class="mb-4 w-full cursor-pointer" aria-label="音量" @input="$emit('update:volume', Number($event.target.value))" />

    <label class="mb-1 flex items-center justify-between text-xs">
      <span class="font-medium text-stone-300">語速</span><strong class="font-display text-sm text-lime-300">{{ rate.toFixed(1) }}x</strong>
    </label>
    <input :value="rate" type="range" min="0.8" max="2" step="0.1" class="mb-3 w-full cursor-pointer" aria-label="語速" @input="$emit('update:rate', Number($event.target.value))" />

    <p class="text-[10px] leading-5 text-stone-500">{{ label }}</p>
  </section>
</template>
