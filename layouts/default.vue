<template>
    <main v-if="isAuthenticated">
        <AppHeader />
        <NuxtPage />
        <AppFooter />
    </main>
    <div v-else>
        <p>Loading...</p>
    </div>
</template>

<script setup>
import { getBearer } from '~/utils/getBearer';
const router = useRouter();
let isAuthenticated = ref(false);

onBeforeMount(() => {
    const authStillValid = getBearer();
    if (authStillValid) {
        isAuthenticated.value = true;
    } else {
        isAuthenticated.value = false;
        router.push("/login");
    }
})
</script>