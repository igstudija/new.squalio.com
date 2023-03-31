<script setup>
import { ref, onMounted, onUnmounted, watch, defineComponent } from "vue";
import { useRoute } from "vue-router";
//example components
import IgNavbar from "@/components/Navbar.vue";
import IgPageHeader from "@/components/PageHeader.vue";
import IgFooter from "@/components/Footer.vue";

import api from "@/api";

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
  const slug = route.params.slug ?? route.meta.slug ?? "sakums";
  const res = await api.getCollectionItem("pages", slug);
  if (res.data && res.data.length > 0) {
    Content.value = res.data[0].attributes;
    document.title = `${import.meta.env.VITE_SITE_NAME} - ${Content.value.title}`;
    document.head.querySelector("meta[name=description]").content = Content.value.seo.seo_description;
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
  name: "Customers",

  setup() {
    return { Content, errors };
  },

  data() {
    return {
      posts: [],
      errors: [],
    };
  },

  created() {
    api
      .get(
        `customers?populate=*&nested`
      )
      .then((response) => {
        this.posts = response.data;
        //console.log(this.posts);
      })
      .catch((e) => {
        this.errors.push(e);
      });
  },

  //get posts end
});

</script>

<template>
  <IgNavbar transparent />
  <IgPageHeader :content-type="'pages'"/>


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
          <div class="" v-html="Block.Quote"></div>
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
        <div class="grid" :class="{ 'grid-cols-4 gap-8': Block.Image.data }">
          <div
            v-if="Block.Image.data"
            class="col-span-1 text-center"
            :class="{ 'order-last': Block.image_position === 'right' }"
          >
            <img
              class="max-h-20 inline-block"
              :src="domain + Block.Image.data.attributes.url"
              :alt="Block.Image.data.attributes.alternativeText"
            />
          </div>
          <div
            class="col-span-3 flex items-center"
            :class="{ 'order-first': Block.image_position === 'right' }"
          >
            <div>
              <h2 v-if="Block.title">{{ Block.title }}</h2>
              <div v-if="Block.Text" v-html="Block.Text"></div>
            </div>
          </div>
        </div>

        <div v-html="Block.description"></div>
      </div>
    </div>
  </div>

  <div class="mx-auto max-w-7xl px-6 lg:px-8 relative">

  <div id="my-grid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      <div v-for="(post, index) in posts" :key="post.id" class="client-logo bg-white p-6 text-center"
      
      >
        <a :href="post.attributes.url" target="_blank" class="">
        <img :src="domain + post.attributes.featured_image.data.attributes.url"  class="mx-auto max-h-10" :alt="post.attributes.title">
         
        </a>
       
      </div>
    </div>

</div>

  <IgFooter />
</template>