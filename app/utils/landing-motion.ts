/**
 * Spring motion primitives for the fet.cx landing page.
 *
 * Springs are parameterised the way Apple describes them in its fluid-interface
 * talks — a damping ratio (how much it overshoots) and a response (how quickly
 * it converges) — rather than raw mass/stiffness/damping. A spring always
 * animates from its current value and carries its velocity through a re-target,
 * which is what lets an in-flight animation be grabbed and reversed without a
 * visible jump or a velocity discontinuity.
 *
 * Hand-rolled on purpose: adding a motion library would put `package.json` and
 * the lockfile into the merge surface with upstream Sink.
 */

export interface SpringConfig {
  /** 1 = critically damped (no overshoot). Below 1 overshoots and settles back. */
  dampingRatio?: number
  /** Seconds to approach the target. This is not a fixed duration. */
  response?: number
}

/** Below these thresholds the spring is close enough to snap to rest. */
const REST_DISPLACEMENT = 0.01
const REST_VELOCITY = 0.08
/** Longest gap we integrate at once, so a backgrounded tab does not resume with an explosive step. */
const MAX_FRAME = 1 / 30
/** Fixed sub-step keeps stiff springs stable when frames run long. */
const STEP = 1 / 240

function springConstants({ dampingRatio = 1, response = 0.4 }: SpringConfig) {
  const naturalFrequency = (Math.PI * 2) / response
  return {
    stiffness: naturalFrequency ** 2,
    damping: 2 * dampingRatio * naturalFrequency,
  }
}

/**
 * A single-axis spring driven by `requestAnimationFrame`.
 *
 * Compose two of these for 2D motion rather than springing a 2D distance — one
 * spring over a combined distance desynchronises as soon as the axes carry
 * different velocities.
 */
export class MotionSpring {
  value: number
  velocity = 0

  private target: number
  private readonly stiffness: number
  private readonly damping: number
  private frame: number | null = null
  private lastTime = 0

  constructor(
    initial: number,
    private readonly onUpdate: (value: number) => void,
    config: SpringConfig = {},
  ) {
    this.value = initial
    this.target = initial
    const { stiffness, damping } = springConstants(config)
    this.stiffness = stiffness
    this.damping = damping
  }

  /**
   * Re-aim the spring. Velocity is preserved unless one is supplied, so a
   * reversal blends instead of hitting a brick wall, and a gesture release can
   * hand its own velocity straight to the animation.
   */
  setTarget(target: number, velocity?: number) {
    this.target = target
    if (velocity !== undefined)
      this.velocity = velocity
    this.start()
  }

  /** Pin the value directly — used while a pointer is tracking 1:1. */
  set(value: number) {
    this.stop()
    this.value = value
    this.target = value
    this.velocity = 0
    this.onUpdate(value)
  }

  stop() {
    if (this.frame !== null) {
      cancelAnimationFrame(this.frame)
      this.frame = null
    }
  }

  private start() {
    if (this.frame !== null)
      return
    this.lastTime = performance.now()
    this.frame = requestAnimationFrame(this.tick)
  }

  private readonly tick = (now: number) => {
    let remaining = Math.min((now - this.lastTime) / 1000, MAX_FRAME)
    this.lastTime = now

    while (remaining > 0) {
      const dt = Math.min(remaining, STEP)
      remaining -= dt
      const displacement = this.value - this.target
      const acceleration = -this.stiffness * displacement - this.damping * this.velocity
      this.velocity += acceleration * dt
      this.value += this.velocity * dt
    }

    const atRest = Math.abs(this.value - this.target) < REST_DISPLACEMENT
      && Math.abs(this.velocity) < REST_VELOCITY

    if (atRest) {
      this.value = this.target
      this.velocity = 0
      this.frame = null
      this.onUpdate(this.value)
      return
    }

    this.onUpdate(this.value)
    this.frame = requestAnimationFrame(this.tick)
  }
}

/** Window of pointer history used to estimate release velocity, in milliseconds. */
const VELOCITY_WINDOW = 100
const MAX_SAMPLES = 6

/**
 * Rolling pointer history. Release velocity has to come from a short window of
 * recent samples — the delta between the last two events is far too noisy to
 * hand to a spring.
 */
export class PointerVelocity {
  private samples: { value: number, time: number }[] = []

  add(value: number, time = performance.now()) {
    this.samples.push({ value, time })
    if (this.samples.length > MAX_SAMPLES)
      this.samples.shift()
  }

  /** Recent velocity in units per second. */
  get velocity(): number {
    const last = this.samples[this.samples.length - 1]
    if (!last || this.samples.length < 2)
      return 0

    const first = this.samples.find(sample => last.time - sample.time <= VELOCITY_WINDOW)
      ?? this.samples[0]
    if (!first)
      return 0

    const elapsed = (last.time - first.time) / 1000
    if (elapsed <= 0)
      return 0

    return (last.value - first.value) / elapsed
  }

  reset() {
    this.samples = []
  }
}

/**
 * Progressive resistance past a boundary. A hard stop reads as frozen; damping
 * that grows with the overshoot reads as responsive with nothing left to reach.
 */
export function rubberband(offset: number, dimension: number, constant = 0.55): number {
  const magnitude = Math.abs(offset)
  if (magnitude === 0)
    return 0
  const resisted = (magnitude * dimension * constant) / (dimension + constant * magnitude)
  return Math.sign(offset) * resisted
}
