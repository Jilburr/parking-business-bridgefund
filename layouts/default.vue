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
const router = useRouter();
const token = JSON.parse(localStorage.getItem("authToken"));
let isAuthenticated = ref(false);

const checkAuth = () => {
    if (token) {
        const currentTime = Date.now() / 1000;
        const expiresAt = token.expiresAt;
        if (currentTime > expiresAt) {
            console.log("Token expired");
            isAuthenticated.value = false;
            localStorage.removeItem("authToken");
            router.push("/login");
        } else {
            console.log("Token is valid");
            isAuthenticated.value = true;
        }
    } else {
        console.log("No token found");
        isAuthenticated.value = false;
        router.push("/login");
    }
}
onBeforeMount(() => {
    checkAuth();
})
</script>