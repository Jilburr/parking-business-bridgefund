<template>
    <div class="login-form">
        <form @submit.prevent="login">
            <SvgIconLock :width="32" :height="32" />
            <h2>Welcome back!</h2>
            <div>
                <label aria-label="Email" for="email">Email</label>
                <input type="text" id="email" v-model="email" aria-label="Email" aria-required="true" placeholder="Enter your email" required class="w-full" />
            </div>
            <div>
                <label aria-label="Password" for="password">Password</label>
                <input type="password" id="password" v-model="password" aria-label="Password" aria-required="true" placeholder="Enter your password" required class="w-full" />
            </div>
            <button type="submit" class="btn btn--primary">
                Sign in
            </button>
        </form>
    </div>
</template>

<script setup lang="ts">
const email = ref('')
const password = ref('')
const router = useRouter();
const config = useRuntimeConfig();
const login = async () => {
    try {
        const response = await fetch(`${config.public.apiBase}/auth/password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email.value,
                password: password.value
            })
        })

        const data = await response.json()

        if (response.status === 201) {
            if (data.data?.auth?.accessToken) {
                const token = {
                    value: data.data.auth.accessToken,
                    expiresAt: Date.now() / 1000 + data.data.auth.expiresIn
                }
                localStorage.setItem("authToken", JSON.stringify(token));
                alert("Login is successful");
                router.push("/")
            } else {
                console.error('Token structure:', data);
                throw new Error('Token not found in response');
            }
        } else {
            console.log("Login failed:", data.status?.message || "Unknown error");
            alert("Username or password is invalid");
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert("Error during login. Please try again.");
    }
}
</script>