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
            <button type="submit" class="btn btn--primary" :disabled="isLoading">
                <template v-if="isLoading" aria-hidden="true">
                    <SvgIconSpinner />
                </template>
                <template v-else>Sign in</template>
            </button>
        </form>
    </div>
</template>

<script setup>
import { loginService } from '~/services/loginSevice';

const email = ref('')
const password = ref('')
const router = useRouter();

const isLoading = ref(false);

const login = async () => {
    isLoading.value = true;
    try {
        const login = await loginService.login(email.value, password.value);
        if (login) {
            router.push("/")
        }
    } finally {
        isLoading.value = false;
    }
}
</script>