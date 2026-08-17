<script setup lang="ts">
import { ArrowRight } from '@lucide/vue'

const { domain } = landingConfig
</script>

<template>
  <section
    class="
      border-t border-border py-20
      md:py-28
    "
  >
    <div class="mx-auto max-w-6xl px-6">
      <LandingReveal>
        <div class="mx-auto flex max-w-xl flex-col items-center text-center">
          <p
            class="
              text-4xl leading-none font-semibold tracking-tight
              sm:text-5xl
            "
          >
            {{ domain }}
          </p>
          <p class="mt-5 text-lg text-pretty text-muted-foreground">
            One domain, every link, one dashboard.
          </p>
          <Button
            as-child
            size="lg"
            class="mt-8"
          >
            <NuxtLink to="/dashboard">
              Open dashboard
              <ArrowRight data-icon="inline-end" aria-hidden="true" />
            </NuxtLink>
          </Button>
        </div>
      </LandingReveal>
    </div>
  </section>
</template>
