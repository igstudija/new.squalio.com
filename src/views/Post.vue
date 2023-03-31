<script setup>
import { onMounted, onUnmounted } from "vue";

//example components
import IgNavbar from "@/components/Navbar.vue";
import IgPageHeader from "@/components/PageHeader.vue";
import IgFooter from "@/components/Footer.vue";

//hooks
const body = document.getElementsByTagName("body")[0];
onMounted(() => {
  body.classList.add("post-page");
  // document.head.querySelector("meta[name=description]").content =  "This is post page";
});
onUnmounted(() => {
  body.classList.remove("post-page");
});
</script>

<template>
  <IgNavbar transparent />
  <IgPageHeader />
  <IgFooter />
</template>
