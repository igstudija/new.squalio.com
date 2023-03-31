<script setup>
import { ref, onMounted, onUnmounted, watch, defineProps } from "vue";
import { useRoute } from "vue-router";
import Title from "@/components/Title.vue";
//functions
import api from "@/api";

const route = useRoute();
const Content = ref({});
//const Image = ref({});
//const Domain = import.meta.env.VITE_APP_DOMAIN;

const props = defineProps({
  contentType: {
    type: String,
    required: true,
  },
});

onMounted(() => {
  getContent();
});

onUnmounted(() => {
  Content.value = {};
});

async function getContent() {
  const slug = route.meta.page;
  const locale = route.params.lang ?? route.meta.lang ?? "en";
  //console.log(route.meta);
  const type = props.contentType;
  var res;
  if (locale !== "en") {
    //loc = `&locale=${locale}`;
    const res = await api.get(
      `${type}?populate=*&filters[slug][$eq]=${slug}&locale=${locale}`
    );

    if (res.data && res.data.length > 0) {
      Content.value = res.data[0].attributes;
    }
  } else {
    const res = await api.get(`${type}?populate=*&filters[slug][$eq]=${slug}`);
    //console.log(res);
    if (res.data && res.data.length > 0) {
      Content.value = res.data[0].attributes;
    }
  }
}

watch(route, (newRoute) => {
  getContent();
});
</script>

<template>
  <div class="isolate overflow-hidden pt-32 pb-20 relative">
    <div class="mx-auto max-w-7xl px-6 lg:px-8 relative">
      <div class="mx-auto lg:mx-0">
        <Title
          class="text-3xl uppercase font-extrabold font-sans leading-none pb-2"
        >
          {{ Content.title }}
        </Title>
      </div>
    </div>
  </div>
</template>
