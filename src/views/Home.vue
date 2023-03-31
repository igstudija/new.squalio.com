<script setup>
import { ref, onMounted, watch, onUnmounted, defineComponent } from "vue";

//example components
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import api from "@/api";
import { useRoute } from "vue-router";

//hooks
const body = document.getElementsByTagName("body")[0];
const Content = ref({});

const getContent = async () => {
  const res = await api.get(`/home?populate=*&nested`);
  Content.value = res.data.attributes;
  document.title = `${import.meta.env.VITE_SITE_NAME} - ${Content.value.title}`;
  // document.head.querySelector("meta[name=description]").content = Content.value.seo.seo_description;
  //  document.head.querySelector("meta[name=keywords]").content = Content.value.seo.seo_keywords;
};

onMounted(() => {
  getContent();
  body.classList.add("home");
});
onUnmounted(() => {
  body.classList.remove("home");
  Content.value = {};
});

watch(useRoute(), (newRoute) => {
  getContent();
});
</script>

<script>
export default defineComponent({
  name: "Page",
  setup() {
    return { Content, errors };
  },
});
</script>

<template>
  <Navbar transparent />

  <Footer />
</template>
