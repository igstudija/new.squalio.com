<script setup>
import IgNavbar from "@/components/Navbar.vue";
import IgPageHeader from "@/components/PageHeader.vue";
import IgFooter from "@/components/Footer.vue";
import { ref, onMounted, onUnmounted, watch, defineComponent } from "vue";
import { useRoute } from "vue-router";
import api from "@/api";

const Content = ref({});
const route = useRoute();
const domain = import.meta.env.VITE_APP_DOMAIN;

const body = document.getElementsByTagName("body")[0];
onMounted(() => {
  body.classList.add("single-page");
  getContent();
  // console.log(getContent());
});
onUnmounted(() => {
  body.classList.remove("single-page");
  
  Content.value = {};
});



const errors = ref([]);

const getContent = async () => {
  const slug = route.params.slug ?? route.meta.slug ?? "sakums";
  const res = await api.getCollectionItem("blogs", slug);
  if (res.data && res.data.length > 0) {
    Content.value = res.data[0].attributes;
    if(Content.value.seo.seo_description != null){
    document.head.querySelector("meta[name=description]").content = Content.value.seo.seo_description;
    } else {
      document.head.querySelector("meta[name=description]").content = Content.value.excerpt;
    }
    document.head.querySelector("meta[name=keywords]").content = Content.value.seo.seo_keywords;
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
  <IgNavbar transparent />
  <IgPageHeader :contentType="'blogs'"/>
  <div class="content" v-if="Content">
    <div v-for="Block in Content.Blocks">
      <div
        class="mx-auto max-w-7xl px-6 pb-24 lg:px-8 relative text-lg"
        v-if="Block.__component === 'blocks.quote'"
      >
        <div class="flex">
          <div class="pr-10 ig-heading text-6xl">
            <i class="fa-solid fa-quote-right"></i>
          </div>
          <div class=" font-semibold" v-html="Block.Quote" ></div>
        </div>
      </div>
      <div
        class="mx-auto max-w-7xl px-6 pb-10 lg:px-8 relative"
        v-if="Block.__component === 'blocks.description'"
      >
        <div v-html="Block.description"></div>
      </div>
      <div
        class="mx-auto max-w-5xl px-6 pb-10 lg:px-8 relative"
        v-if="Block.__component === 'blocks.text-and-image'"
      >
        <div class="grid grid-cols-1 gap-8" :class="{ 'md:grid-cols-4': Block.Image.data }">
          <div
            v-if="Block.Image.data"
            class="md:col-span-1 text-center"
            :class="{ 'order-last': Block.image_position === 'right' }"
          >
            <img
              class="inline-block rounded-xl"
              :src="domain + Block.Image.data.attributes.url"
              :alt="Block.Image.data.attributes.alternativeText"
            />
          </div>
          <div
            class="md:col-span-3 flex items-center"
            :class="{ 'order-first': Block.image_position === 'right' }"
          >
            <div>
              <h2 v-if="Block.title" class="text-center md:text-left">{{ Block.title }}</h2>
              <div v-if="Block.Text" v-html="Block.Text" class="content text-center md:text-left"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <IgFooter />
</template>
<style lang="scss">
.content {
  ul, ol {
  list-style: none;
  margin: 0;

  margin-bottom: 20px;
  li {
    position: relative;
    padding-left: 1.5em;
    &:before {
      content: "";
      position: absolute;
      left: 0;
      top: 0.5em;
      width: 0.75em;
      height: 0.75em;
      border-radius: 50%;
      background: #93278f; 
  background: -moz-linear-gradient(
    255.15deg,
    #1d5ab5 0%,
    #d4145a 100%
  ); 
  background: -webkit-linear-gradient(
    255.15deg,
    #1d5ab5 0%,
    #d4145a 100%
  ); 
  background: linear-gradient(
    255.15deg,
    #1d5ab5 0%,
    #d4145a 100%
  ); 
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#93278f', endColorstr='#d4145a',GradientType=1 ); 
    }
  }
}
}


</style>

