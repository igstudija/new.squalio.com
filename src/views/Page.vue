<script setup>
import Navbar from "@/components/Navbar.vue";
import PageHeader from "@/components/PageHeader.vue";
import Footer from "@/components/Footer.vue";
import { ref, onMounted, onUnmounted, watch, defineComponent } from "vue";
import { useRoute } from "vue-router";
import api from "@/api";
import Title from "@/components/Title.vue";

const Content = ref({});

const route = useRoute();
const domain = import.meta.env.VITE_APP_DOMAIN;

const body = document.getElementsByTagName("body")[0];

onMounted(() => {
  body.classList.add("single-page");
  getContent();
});
onUnmounted(() => {
  body.classList.remove("single-page");
  Content.value = {};
});

const errors = ref([]);

const getContent = async () => {
  //const slug = route.params.slug ?? route.meta.slug ?? "sakums";
  const slug = route.meta.page;
  const locale = route.params.lang ?? route.meta.lang ?? "en";
  //console.log(slug);
  const res = await api.get(
    `pages?populate=*&filters[slug][$eq]=${slug}&locale=${locale}`
  );
  //console.log(res);
  Content.value = res.data[0].attributes;
  console.log(Content.value);
  document.title = `${Content.value.title} | ${import.meta.env.VITE_SITE_NAME}`;

  if (Content.value.seo && Content.value.seo.description !== '') {
    document.head.querySelector("meta[name=description]").content =
      Content.value.seo.description;
  } else {
    document.head.querySelector("meta[name=description]").content =
      Content.value.title;
  }
};

// Watch for changes in the route and update the content
watch(route, (newRoute) => {
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
   <div class="h-screen pb-64">
  <Navbar transparent :contentType="'pages'"/>
  <PageHeader :contentType="'pages'" />
  <div v-if="Content">
    <div v-for="Block in Content.Blocks">
      <div
        class="mx-auto max-w-7xl px-6 pb-24 lg:px-8 relative text-lg"
        v-if="Block.__component === 'blocks.quote'"
      >
        <div class="flex">
          <div class="pr-10 ig-heading text-6xl">
            <i class="fa-solid fa-quote-right"></i>
          </div>
          <div class="" v-html="Block.Quote"></div>
        </div>
      </div>

      <div
        class="content mx-auto max-w-7xl px-6 pb-10 lg:px-8 relative"
        v-if="Block.__component === 'blocks.description'"
      >
        <div v-html="Block.description"></div>
      </div>

      <div
        class="mx-auto max-w-5xl px-6 pb-10 lg:px-8 relative"
        v-if="Block.__component === 'blocks.text-and-image'"
      >
        <div
          class="grid grid-cols-1 gap-8"
          :class="{ 'md:grid-cols-4': Block.Image.data }"
        >
          <div
            v-if="Block.Image.data"
            class="md:col-span-1 text-center"
            :class="{ 'order-last': Block.image_position === 'right' }"
          >
            <img
              class="max-h-20 inline-block"
              :src="domain + Block.Image.data.attributes.url"
              :alt="Block.Image.data.attributes.alternativeText"
            />
          </div>
          <div
            class="md:col-span-3 flex items-center"
            :class="{ 'order-first': Block.image_position === 'right' }"
          >
            <div>
              <h2 v-if="Block.title" class="text-center md:text-left">
                {{ Block.title }}
              </h2>
              <div
                v-if="Block.Text"
                v-html="Block.Text"
                class="content text-center md:text-left"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="Block.__component === 'blocks.shortcuts'">
        <div
          class="mx-auto max-w-7xl px-6 pb-10 lg:px-8 relative"
          :class="{
            'max-w-lg': Block.max_width == 'w512px',
            'max-w-xl': Block.max_width == 'w576px',
            'max-w-2xl': Block.max_width == 'w672px',
            'max-w-3xl': Block.max_width == 'w768px',
            'max-w-4xl': Block.max_width == 'w896px',
            'max-w-5xl': Block.max_width == 'w1024px',
            'max-w-6xl': Block.max_width == 'w1152px',
            'max-w-7xl': Block.max_width == 'w1280px',
            'max-w-7xl': Block.max_width == null,
          }"
        >
          <h2 v-if="Block.title">{{ Block.title }}</h2>

          <div
            :class="Block.columns == 2 ? 'md:grid-cols-4' : 'md:grid-cols-3'"
            class="grid grid-cols-1 gap-8 justify-items-center"
          >
            <div
              v-for="(Shortcut, index) in Block.Shortcut"
              :key="Shortcut.id"
              class="mb-10"
              :class="Block.columns == 2 ? 'col-span-2' : 'col-span-1'"
            >
              <a :href="Shortcut.link" class="justify-center flex no-underline">
                <Title class="ig-heading ig-icon lh-1 text-5xl block relative">
                  {{ Shortcut.title }}
                </Title>
              </a>
              <div
                v-text="Shortcut.description"
                class="font-black text-center"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  <Footer />
</template>
