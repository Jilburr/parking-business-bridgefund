<template>
  <div class="container container--margin">
    <nav class="nav">
      <ul class="nav__list">
        <li class="nav__item" :class="{ 'is-active': activeTab === 'dashboard' }">
          <button class="btn btn--link" @click="activeTab = 'dashboard'">Dashboard</button>
        </li>
        <li class="nav__item" :class="{ 'is-active': activeTab === 'sessions' }">
          <button class="btn btn--link" @click="activeTab = 'sessions'">Sessions</button>
        </li>
      </ul>
    </nav>
  </div>
  <ParkingBuilding v-if="activeTab === 'dashboard'" />
  <SessionOverview v-if="activeTab === 'sessions'" />
</template>

<script setup>
const activeTab = ref("dashboard");
</script>
