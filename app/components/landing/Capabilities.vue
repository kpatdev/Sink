<script setup lang="ts">
import { AreaChart, Globe, Hourglass, QrCode } from '@lucide/vue'

const capabilities = [
  {
    title: 'Resolved at the edge',
    description:
      'Redirects run in Cloudflare\'s nearest data center. No origin round-trip, no cold start, nothing to wake up first.',
    icon: Globe,
  },
  {
    title: 'Analytics, no trackers',
    description:
      'Referrers, countries, devices and browsers, all read from the redirect itself. Nothing is injected into the page you land on.',
    icon: AreaChart,
  },
  {
    title: 'A QR for every link',
    description:
      'Each short link carries a styled QR code, ready to drop straight into a slide, a poster, or the back of a card.',
    icon: QrCode,
  },
  {
    title: 'Links that know when to stop',
    description:
      'Give a link an expiry date, send phones and desktops to different places, or preview where it goes before it fires.',
    icon: Hourglass,
  },
]
</script>

<template>
  <section
    id="capabilities"
    class="
      scroll-mt-24 border-t border-border py-20
      md:py-28
    "
  >
    <div class="mx-auto max-w-6xl px-6">
      <LandingReveal>
        <h2
          class="
            max-w-2xl text-3xl leading-[1.1] font-semibold tracking-tight
            text-balance
            sm:text-4xl
          "
        >
          What it does
        </h2>
        <p class="mt-4 max-w-xl text-pretty text-muted-foreground">
          A short link is the whole product. Everything else is there to make the
          one that matters easy to find again.
        </p>
      </LandingReveal>

      <div
        class="
          mt-14 grid gap-4
          md:grid-cols-2
        "
      >
        <LandingReveal
          v-for="(capability, index) in capabilities"
          :key="capability.title"
          :delay="index * 70"
        >
          <Card class="h-full">
            <CardContent class="flex flex-col gap-4">
              <span
                class="
                  flex size-10 items-center justify-center rounded-xl bg-muted
                  text-foreground
                "
              >
                <component :is="capability.icon" class="size-5" aria-hidden="true" />
              </span>
              <h3 class="text-base font-medium">
                {{ capability.title }}
              </h3>
              <p class="text-pretty text-muted-foreground">
                {{ capability.description }}
              </p>
            </CardContent>
          </Card>
        </LandingReveal>
      </div>
    </div>
  </section>
</template>
