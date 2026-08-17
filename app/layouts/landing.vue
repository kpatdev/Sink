<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'

const { github } = useAppConfig()
const { domain } = landingConfig

const { y } = useWindowScroll()
/** The chrome only separates itself from the page once content is actually behind it. */
const scrolled = computed(() => y.value > 8)

const year = new Date().getFullYear()

useHead({
  htmlAttrs: { class: 'scroll-smooth' },
})
</script>

<template>
  <div
    class="
      flex min-h-svh flex-col overflow-x-clip bg-background text-foreground
    "
  >
    <a
      href="#main-content"
      class="
        fixed top-4 left-4 z-50 -translate-y-24 rounded-md bg-background px-4
        py-2 text-sm font-medium shadow-lg
        focus:translate-y-0
        focus-visible:ring-2 focus-visible:ring-ring
      "
    >
      {{ $t('layouts.links.skip_to_content') }}
    </a>

    <header
      class="
        fixed z-20 w-full border-b bg-background/70
        pt-[env(safe-area-inset-top)] backdrop-blur-xl transition-colors
        duration-300
      "
      :class="scrolled ? 'border-border' : 'border-transparent'"
    >
      <div class="mx-auto max-w-6xl px-6">
        <div class="flex items-center justify-between gap-6 py-3">
          <NuxtLink
            to="/"
            :title="domain"
            :aria-label="$t('layouts.links.home_aria_label')"
            class="
              rounded-md text-lg font-semibold tracking-tight
              focus-visible:ring-2 focus-visible:ring-ring
              focus-visible:outline-none
            "
          >
            {{ domain }}
          </NuxtLink>

          <div class="flex items-center gap-2">
            <SwitchTheme />
            <Button as-child size="sm">
              <NuxtLink to="/dashboard">
                Dashboard
              </NuxtLink>
            </Button>
          </div>
        </div>
      </div>
    </header>

    <main
      id="main-content"
      class="flex flex-1 flex-col pt-[calc(4rem+env(safe-area-inset-top))]"
    >
      <slot />
    </main>

    <footer
      class="
        border-t border-border pt-8 pb-[calc(2rem+env(safe-area-inset-bottom))]
      "
    >
      <div class="mx-auto max-w-6xl px-6">
        <div
          class="
            flex flex-col items-center gap-4 text-sm text-muted-foreground
            sm:flex-row sm:justify-between
          "
        >
          <p>&copy; {{ year }} {{ domain }}</p>
          <nav class="flex items-center gap-6">
            <a
              href="/_docs/scalar"
              target="_blank"
              rel="noopener noreferrer"
              class="
                rounded-md
                hover:text-foreground
                focus-visible:ring-2 focus-visible:ring-ring
                focus-visible:outline-none
              "
            >
              API reference
            </a>
            <a
              :href="github"
              target="_blank"
              rel="noopener noreferrer"
              class="
                rounded-md
                hover:text-foreground
                focus-visible:ring-2 focus-visible:ring-ring
                focus-visible:outline-none
              "
            >
              Built on Sink
            </a>
          </nav>
        </div>
      </div>
    </footer>
  </div>
</template>
