<template>
    <header class="header">
        <div class="container">
            <div class="header__inner">
                <div class="header__logo">
                    <h1>Parking Business</h1>
                </div>
                <div class="header__auth">
                    <button class="btn btn--primary" @click="logout">Logout</button>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
    const router = useRouter();
    const logout = () => {
        // Remove the auth token from localStorage
        localStorage.removeItem("authToken");
        // Redirect the user to the login page
        router.push("/login");
    }
</script>