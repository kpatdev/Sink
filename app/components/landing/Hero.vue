<script setup lang="ts">
import { ArrowRight } from '@lucide/vue'

const { domain, tagline, description } = landingConfig
</script>

<template>
  <section class="relative overflow-hidden">
    <!-- A single soft wash of the primary role, static so it never competes with the content. -->
    <div
      aria-hidden="true"
      class="
        pointer-events-none absolute -top-40 left-1/2 -z-10 size-144
        -translate-x-1/2 rounded-full bg-primary/6 blur-3xl
      "
    />

    <div
      class="
        mx-auto max-w-6xl px-6 py-20
        md:py-28
      "
    >
      <div
        class="
          grid items-center gap-16
          lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-20
        "
      >
        <div>
          <LandingReveal>
            <span
              class="
                inline-flex items-center gap-2 rounded-full border border-border
                bg-card/60 py-1 pr-3 pl-2 text-xs font-medium
                text-muted-foreground backdrop-blur-sm
              "
            >
              <span class="size-1.5 rounded-full bg-success" aria-hidden="true" />
              Private link shortener
            </span>
          </LandingReveal>

          <LandingReveal :delay="60">
            <h1
              class="
                mt-6 text-5xl leading-[1.03] font-semibold tracking-tight
                text-balance
                sm:text-6xl
                lg:text-7xl
              "
            >
              {{ tagline }}
            </h1>
          </LandingReveal>

          <LandingReveal :delay="120">
            <p
              class="
                mt-6 max-w-xl text-lg/relaxed text-pretty text-muted-foreground
              "
            >
              {{ description }}
            </p>
          </LandingReveal>

          <LandingReveal :delay="180">
            <div
              class="
                mt-10 flex flex-col items-stretch gap-3
                sm:flex-row sm:items-center
              "
            >
              <Button as-child size="lg">
                <NuxtLink to="/dashboard">
                  Open dashboard
                  <ArrowRight data-icon="inline-end" aria-hidden="true" />
                </NuxtLink>
              </Button>
              <Button as-child size="lg" variant="ghost">
                <a href="#capabilities">What it does</a>
              </Button>
            </div>
          </LandingReveal>

          <LandingReveal :delay="240">
            <p class="mt-10 text-sm text-muted-foreground">
              Every <span class="text-foreground">{{ domain }}</span> link resolves at
              Cloudflare's nearest data center — no origin round-trip, no cold start.
            </p>
          </LandingReveal>
        </div>

        <LandingReveal :delay="160" :distance="28">
          <LandingLinkCard />
        </LandingReveal>
      </div>
    </div>
  </section>
</template>
