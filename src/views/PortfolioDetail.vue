
<script setup>


//example components
import Navbar from "@/components/Navbar.vue";
import Title from "@/components/Title.vue";
import Footer from "@/components/Footer.vue";



import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";

//functions
import api from "@/api";

const route = useRoute();
const Content = ref({});
const Image = ref({});
const Domain = import.meta.env.VITE_APP_DOMAIN;

const getContent = async () => {
  const slug = route.params.slug ?? route.meta.slug ?? "sakums";
  const res = await api.get(`portfolios?populate=*&filters[slug][$eq]=${slug}`);
  Content.value = res.data[0].attributes;
  console.log(Content.value)

  if (Content.value.featured_image.data !== null) {
    Image.value =
      Domain + Content.value.featured_image.data.attributes.formats.large.url;
  } else {
    Image.value = "";
  }
};
const body = document.getElementsByTagName("body")[0];
onMounted(() => {
    body.classList.add("single-page");
  getContent();
});

watch(route, (newRoute) => {
  
  getContent();
});


</script>

<template>
  <Navbar transparent />


  <div
    class="isolate overflow-hidden bg-gray-900 pt-56 pb-10 ig-header relative"
  >
    <img
      v-if="Image"
      v-lazy="Image"
      class="absolute inset-0 -z-10 h-full w-full object-cover"
    />

    <div class="mx-auto max-w-7xl px-6 lg:px-8 relative">
      <div class="mx-auto lg:mx-0">
        <Title class="ig-heading text-2xl md:text-5xl leading-normal"> {{ Content.title }} </Title>
        
      </div>
    </div>
  </div>
  <div class="-mt-8 mb-10 slogan pt-6 pb-8 md:pt-12 md:pb-16 slogan ">
    <div class="mx-auto max-w-7xl items-center p-6 lg:px-8 slogan-text">
      <div
        class="text-white  font-black fob md:text-2xl  sm:text-xl -rotate-0  md:-rotate-1"
        v-html="Content.excerpt"
      ></div>
    </div>
  </div>
  <div class="container mx-auto max-w-7xl px-6 lg:px-8 relative">
  <div v-html="Content.description" ></div>
</div>


  <Footer />
</template>

