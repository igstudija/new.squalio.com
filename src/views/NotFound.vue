<script setup>
import { onMounted, onUnmounted } from "vue";

//example components
import IgNavbar from "@/components/Navbar.vue";
import DefaultFooter from "@/components/Footer.vue";

//hooks
const body = document.getElementsByTagName("body")[0];
onMounted(() => {
  body.classList.add("single-page");
  document.head.querySelector("meta[name=description]").content = "404";
});
onUnmounted(() => {
  body.classList.remove("single-page");
});
</script>

<template>
  <IgNavbar transparent />

  404

  <DefaultFooter />
</template>
