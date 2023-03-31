<script setup>
import api from "@/api";
//example components
import Navbar from "@/components/Navbar.vue";
import PageHeader from "@/components/PageHeader.vue";
import Footer from "@/components/Footer.vue";
import { RouterLink } from "vue-router";

const Domain = import.meta.env.VITE_APP_DOMAIN;
</script>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      posts: [],
      errors: [],
    };
  },

  created() {
    api
      .get(`blogs?populate=*&nested`)
      .then((response) => {
        this.posts = response.data;
       // console.log(this.posts);
      })
      .catch((e) => {
        this.errors.push(e);
      });
  },

  
});
</script>

<template>
  <Navbar transparent />
  <PageHeader :contentType="'pages'"/>

  

  <div class="container mx-auto max-w-7xl px-6 lg:px-8 relative">
    <div v-if="posts">
      <div v-for="post in posts" :key="post.id" class="pb-16 ">
      <div class="pb-4">
        <h2 class="ifs-2">
          <RouterLink
          :to="'/blogs/' + post.attributes.slug"
          class="font-extrabold underline ig-heading text-2xl"
          >
            {{ post.attributes.title }}
          </RouterLink>
        </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <RouterLink
          :to="'/blogs/' + post.attributes.slug"
          class="font-extrabold underline "
          v-if="post.attributes.featured_image.data != null"
          >
          <img :src="Domain + post.attributes.featured_image.data.attributes.formats.small.url" class="rounded-lg w-full" />
        </RouterLink>
          <div :class="post.attributes.featured_image.data !== null ? 'col-span-2' : 'col-span-3'">
            
          <div v-html="post.attributes.excerpt" class="text-lg font-light "></div>
          </div>
        
          
          </div>
        
      </div>
    </div>
  </div>
  <Footer />
</template>


