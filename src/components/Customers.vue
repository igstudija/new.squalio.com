<script setup>

import api from "@/api";
//carousel
import { defineComponent } from "vue";

const domain = import.meta.env.VITE_APP_DOMAIN;
</script>


<script>
export default defineComponent({
  name: "Basic",

  data() {
    return {
      posts: [],
      errors: [],
    };
  },

  created() {
    api
      .get(
        `customers?populate=*&nested&filters[Frontpage][$eq]=true`
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
 
    <div id="my-grid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      <div v-for="(post, index) in posts" :key="post.id" class="client-logo bg-white p-6 text-center"
      
      >
        <a :href="post.attributes.url" target="_blank" class="">
        <img :src="domain + post.attributes.featured_image.data.attributes.url"  class="mx-auto max-h-10" :alt="post.attributes.title">
         
        </a>
       
      </div>
    </div>

</template>



