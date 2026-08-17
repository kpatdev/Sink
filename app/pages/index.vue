<script setup lang="ts">
const { domain, origin, tagline, description } = landingConfig

const title = `${domain} — ${tagline}`

definePageMeta({
  layout: 'landing',
})

// Overrides the app-level Sink defaults for this route only.
useSeoMeta({
  title,
  description,
  ogType: 'website',
  ogUrl: origin,
  ogTitle: title,
  ogSiteName: domain,
  ogDescription: description,
  twitterTitle: title,
  twitterDescription: description,
})
</script>

<template>
  <div class="flex flex-col">
    <LandingHero />
    <LandingCapabilities />
    <LandingClosing />
  </div>
</template>
