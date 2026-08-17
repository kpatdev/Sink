<script setup lang="ts">
import { Link } from '@lucide/vue'
import { usePreferredReducedMotion } from '@vueuse/core'

const { domain, sampleSlug } = landingConfig

/** How far the card can be pulled before resistance dominates. */
const DRAG_RANGE = 190
/** Larger divisors mean a gentler lean; tuned so a hard flick reads clearly without cartwheeling. */
const TILT_DIVISOR = 14
const ROLL_DIVISOR = 26

const card = ref<HTMLElement | null>(null)
const dragging = shallowRef(false)
const reducedMotion = usePreferredReducedMotion()

let springX: MotionSpring | null = null
let springY: MotionSpring | null = null
const trackX = new PointerVelocity()
const trackY = new PointerVelocity()

let activePointer: number | null = null
let grabX = 0
let grabY = 0
/** Spring values at the moment of the grab, so an interrupted flight continues from where it is. */
let originX = 0
let originY = 0

function applyTransform() {
  const element = card.value
  if (!element || !springX || !springY)
    return

  const x = springX.value
  const y = springY.value
  // Lean into the direction of travel so the in-between frames point at the outcome.
  const tiltY = x / TILT_DIVISOR
  const tiltX = -y / TILT_DIVISOR
  const roll = x / ROLL_DIVISOR

  element.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) rotate(${roll.toFixed(2)}deg)`
}

onMounted(() => {
  // A flick is momentum-driven, so a little overshoot on the way home is right.
  // Reduced motion keeps the tracking but settles without bounce.
  const config = reducedMotion.value === 'reduce'
    ? { dampingRatio: 1, response: 0.3 }
    : { dampingRatio: 0.8, response: 0.35 }

  springX = new MotionSpring(0, applyTransform, config)
  springY = new MotionSpring(0, applyTransform, config)
})

onBeforeUnmount(() => {
  springX?.stop()
  springY?.stop()
})

function onPointerDown(event: PointerEvent) {
  if (!card.value || !springX || !springY)
    return
  if (event.pointerType === 'mouse' && event.button !== 0)
    return

  activePointer = event.pointerId
  // Capture keeps tracking alive once the pointer leaves the card, but it
  // throws if the pointer id is already gone (a very fast tap, for instance).
  try {
    card.value.setPointerCapture(event.pointerId)
  }
  catch {}
  dragging.value = true

  // Take over from the live on-screen value rather than the resting target,
  // so grabbing the card mid-flight never jumps.
  springX.stop()
  springY.stop()
  originX = springX.value
  originY = springY.value
  grabX = event.clientX
  grabY = event.clientY

  trackX.reset()
  trackY.reset()
  trackX.add(originX, event.timeStamp)
  trackY.add(originY, event.timeStamp)
}

function onPointerMove(event: PointerEvent) {
  if (activePointer !== event.pointerId || !springX || !springY)
    return

  // Respect where the card was grabbed, then resist progressively at the edges.
  const x = rubberband(originX + (event.clientX - grabX), DRAG_RANGE)
  const y = rubberband(originY + (event.clientY - grabY), DRAG_RANGE)

  springX.set(x)
  springY.set(y)
  // Track the resisted values — that is what is actually on screen, so the
  // handoff into the spring has no seam.
  trackX.add(x, event.timeStamp)
  trackY.add(y, event.timeStamp)
}

function onPointerRelease(event: PointerEvent) {
  if (activePointer !== event.pointerId || !springX || !springY)
    return

  activePointer = null
  dragging.value = false
  // Releasing must never throw past this point: the spring below is what
  // brings the card home, so an exception here would strand it mid-drag.
  try {
    if (card.value?.hasPointerCapture(event.pointerId))
      card.value.releasePointerCapture(event.pointerId)
  }
  catch {}

  // Continue at exactly the velocity the pointer had on release.
  springX.setTarget(0, trackX.velocity)
  springY.setTarget(0, trackY.velocity)
}
</script>

<template>
  <div
    class="relative mx-auto w-full max-w-sm select-none"
    :style="{ perspective: '1200px' }"
  >
    <!-- Two resting cards behind the live one give the stack real depth.
         They share the top card's box so only their rotated corners show. -->
    <div
      aria-hidden="true"
      class="absolute inset-0 rounded-3xl border border-border bg-card/50"
      :style="{ transform: 'rotate(-4deg) scale(0.96)' }"
    />
    <div
      aria-hidden="true"
      class="absolute inset-0 rounded-3xl border border-border bg-card/80"
      :style="{ transform: 'rotate(2.5deg) scale(0.98)' }"
    />

    <div
      ref="card"
      class="
        relative cursor-grab touch-pan-y rounded-3xl border border-border
        bg-card text-card-foreground shadow-xl will-change-transform
        active:cursor-grabbing
      "
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerRelease"
      @pointercancel="onPointerRelease"
    >
      <!-- Press feedback lives on a child so it never fights the imperative drag transform. -->
      <div
        class="
          flex flex-col gap-8 p-7 transition-transform duration-150 ease-out
        "
        :class="dragging ? 'scale-[0.98]' : 'scale-100'"
      >
        <div class="flex items-center justify-between">
          <span
            class="
              inline-flex items-center gap-2 text-xs font-medium tracking-wide
              text-muted-foreground uppercase
            "
          >
            <Link class="size-3.5" aria-hidden="true" />
            Short link
          </span>
          <span class="flex gap-1.5" aria-hidden="true">
            <span class="size-1.5 rounded-full bg-muted-foreground/30" />
            <span class="size-1.5 rounded-full bg-muted-foreground/30" />
            <span class="size-1.5 rounded-full bg-muted-foreground/30" />
          </span>
        </div>

        <p
          class="
            text-2xl leading-none font-semibold tracking-tight
            sm:text-3xl
          "
        >
          <span class="text-muted-foreground">{{ domain }}/</span>{{ sampleSlug }}
        </p>

        <p class="text-sm text-muted-foreground">
          Drag it. It comes back.
        </p>
      </div>
    </div>
  </div>
</template>
