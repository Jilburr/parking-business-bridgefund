<template>
  <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
const navigateToRoute = (route) => {
  router.push(route);
};
</script>