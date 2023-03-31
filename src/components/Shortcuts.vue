<script setup>
import Title from "@/components/Title.vue";
//functions
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
        `home?populate[0]=shortcuts&populate[1]=shortcuts.featured_image&populate[2]=slides.featured_image.media`
      )
      .then((response) => {
        this.posts = response.data.attributes.shortcuts;
        
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
 
    <div id="my-grid" class="grid grid-cols-1 md:grid-cols-3 gap-4 justify-items-center">
      <div v-for="(post, index) in posts" :key="post.id" class=" mb-10"
      
      >
        <a :href="post.link"  class="justify-center flex">
          <Title class="ig-heading ig-icon block relative leading-none lg:text-8xl text-7xl mb-4">
          {{ post.title }}
          </Title>
          
        </a>
        <div v-text="post.description" class=" font-black text-center"></div>
      </div>
    </div>

</template>



