<script setup>
import IgNavbar from "@/components/Navbar.vue";
import IgPageHeader from "@/components/PageHeader.vue";
import IgFooter from "@/components/Footer.vue";
import { ref, onMounted, onUnmounted, watch, defineComponent } from "vue";
import { useRoute } from "vue-router";
import api from "@/api";

const Content = ref({});

onMounted(() => {
  getContent();
});

watch(useRoute, (newRoute) => {
  getContent();
});

const body = document.getElementsByTagName("body")[0];
onMounted(() => {
  body.classList.add("single-page");
});
onUnmounted(() => {
  body.classList.remove("single-page");
});

const posts = ref([]);
const errors = ref([]);

const getContent = async () => {
  const slug = useRoute().params.slug ?? useRoute().meta.slug ?? "sakums";
  const res = await api.getCollectionItem('pages', slug); 
  if (res.data && res.data.length > 0) {
    Content.value = res.data[0].attributes;
    posts.value = Content.value.Blocks;
    document.title = `${import.meta.env.VITE_SITE_NAME} - ${Content.value.title}`;
    document.head.querySelector("meta[name=description]").content = Content.value.seo.seo_description;
    document.head.querySelector("meta[name=keywords]").content = Content.value.seo.seo_keywords;
  }
 
  
};

</script>

<script>
export default defineComponent({


  setup() {
    return { posts, errors };
  },
});
</script>


<template>
  <IgNavbar transparent />
  <IgPageHeader :content-type="'pages'"/>
  <div v-for="Block in posts">
    <div class="mx-auto max-w-7xl px-6 lg:px-8 relative" v-html="Block.description"></div>
  </div>
  <IgFooter />
</template>
