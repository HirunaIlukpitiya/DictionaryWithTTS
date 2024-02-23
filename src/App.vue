<script setup>
import { RouterLink, RouterView } from "vue-router";
//import NavBar from "./components/Navbar.vue"
import Footer from "./components/Footer.vue";
</script>

<template>
  <div class="bg-white dark:bg-gray-900 h-max">
    <RouterView />
    <Footer />
  </div>
</template>

<style></style>
