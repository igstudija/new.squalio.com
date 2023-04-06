<script setup>
import { ref, onMounted, onUnmounted, watch, defineProps } from "vue";
import { useRoute } from "vue-router";
import Title from "@/components/Title.vue";
import api from "@/api";

const route = useRoute();
const Content = ref({});

const props = defineProps({
  contentType: {
    type: String,
    required: true,
  },
});

onMounted(getContent);
onUnmounted(() => (Content.value = {}));

watch(route, getContent);

async function getContent() {
  const slug = route.meta.page;
  const locale = route.params.lang ?? route.meta.lang ?? "en";
  const type = props.contentType;

  const res = await api.get(
    `${type}?populate=*&filters[slug][$eq]=${slug}${locale !== "en" ? `&locale=${locale}` : ""}`
  );

  if (res.data && res.data.length > 0) {
    Content.value = res.data[0].attributes;
  }
}
</script>

<template>
  <div class="isolate overflow-hidden pt-12 pb-12 relative">
    <div class="mx-auto max-w-7xl px-6 lg:px-8 relative">
      <div class="mx-auto lg:mx-0">
        <Title
          class="text-2xl uppercase font-extrabold font-sans leading-none pb-2"
        >
          {{ Content.title }}
        </Title>
      </div>
    </div>
  </div>
</template>
