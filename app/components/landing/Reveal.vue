<script setup lang="ts">
import { useIntersectionObserver, usePreferredReducedMotion } from '@vueuse/core'

const props = withDefaults(defineProps<{
  /** Milliseconds to stagger this element behind its neighbours. */
  delay?: number
  /** Distance in pixels the element travels on the way in. */
  distance?: number
}>(), {
  delay: 0,
  distance: 20,
})

const root = ref<HTMLElement | null>(null)
const revealed = shallowRef(false)
const reducedMotion = usePreferredReducedMotion()

/**
 * A one-shot entrance is not gesture-driven, so a transition is the right tool
 * here — springs are reserved for what the user can actually grab.
 */
const { stop } = useIntersectionObserver(
  root,
  (entries) => {
    if (entries.some(entry => entry.isIntersecting)) {
      revealed.value = true
      stop()
    }
  },
  { rootMargin: '0px 0px -10% 0px', threshold: 0.15 },
)

const style = computed(() => {
  // Reduced motion keeps the fade for comprehension but drops the travel.
  const offset = reducedMotion.value === 'reduce' ? 0 : props.distance
  return {
    'opacity': revealed.value ? 1 : 0,
    'transform': revealed.value ? 'none' : `translate3d(0, ${offset}px, 0)`,
    'transition-delay': `${props.delay}ms`,
  }
})
</script>

<template>
  <div
    ref="root"
    class="
      transition-[opacity,transform] duration-700
      ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[opacity,transform]
      motion-reduce:transition-opacity
      print:translate-none! print:opacity-100!
    "
    :style="style"
  >
    <slot />
  </div>
</template>
