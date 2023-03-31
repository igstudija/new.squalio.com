<script setup>
import Title from "@/components/Title.vue";
//functions
import api from "@/api";
//carousel
import { defineComponent } from "vue";
import { Carousel, Navigation, Pagination, Slide } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";

const domain = import.meta.env.VITE_APP_DOMAIN;
</script>

<script>
export default defineComponent({
  name: "Basic",
  components: {
    Carousel,
    Slide,
    Pagination,
    Navigation,
  },

  data() {
    return {
      posts: [],
      errors: [],
    };
  },

  created() {
    const slug = "home";
    api.getSlides(slug)
      .then((response) => {
        this.posts = response.data.attributes.slides;
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
  <Carousel
    :autoplay="5000"
    :wrap-around="true"
    :pauseAutoplayOnHover="true"
    class="ig-carousel relative"
  >
    <Slide
      v-for="(post, index) in posts"
      :key="post.id"
      class="carousel-item h-full position-absolute"
    >
      <div class="carousel__item carousel-inner h-full w-full absolute flex">
        <div
          class="background z-0 absolute h-full w-full bg-cover bg-center"
          v-if="post.image.data != null"
          :style="{
            backgroundImage: `url(${domain}${post.image.data.attributes.url})`,
          }"
        ></div>
        <div class="container mx-auto self-center p-6 lg:px-8 max-w-7xl">
          <div class="flex flex-col justify-center h-full w-full z-10 relative">
            <Title class="ig-heading ig-icon block relative leading-none lg:text-9xl text-7xl mb-4">{{
              post.title
            }}</Title>
            <div class="text-white relative font-black text-2xl text-left text-shadow-50" v-html="post.short_description">
             
            </div>
            <div class="mt-5 flex relative">
              <a
                href="/kontakti"
                class=" rounded-full pr-8 pl-8 bg-transparent px-3.5 py-2.5 text-sm font-semibold ig-gradient text-white  uppercase"
                >Piesakies <i class="fa-solid fa-angle-right ml-2"></i
              ></a>
              <a :href="post.link" class="ml-5 py-2.5 text-white text-sm font-bold text-shadow-20"
                >Uzzini vairāk</a>
            </div>
            <Pagination/>
          </div>
        </div>
      </div>
    </Slide>

    <template #addons>
    
     <div class="absolute h-9 right-1 bottom-1 rotate-180  text-white p-0 text-sm leading-none mb-0 pb-1 text-shadow-20 vertical">foto: Agnese Aljēna</div>
     
    </template>
  </Carousel>
</template>

<style lang="scss">


.vertical {
        writing-mode: vertical-rl;
      white-space: nowrap;
      }

.ig-lead {
  font-weight: 800;
  font-family: "Inter", sans-serif;
}

.ig-carousel {
  height: 90vh;
  .carousel-inner {
    height: 100%;
  }

  sup {
    font-weight: 100;
    font-size: 0.5em;
    background: #93278f; 
    display: inline-block;
    border-radius: 5px;
    height: 15px;
    line-height: 15px;
    padding-left: 4px;
    padding-right: 4px;
    display: inline-block;
    border-radius: 5px;
    margin-left: -20px;
    transform: translateY(-100%);
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
    border:0px
  }
  
  
  }


.carousel__pagination {
  justify-content: start;
  padding-top: 20px;
  .carousel__pagination-button::after {
    background-color: transparent;
    width:15px;
    height: 15px;
    border:1px solid #fff;
    border-radius: 50%;
  }
  .carousel__pagination-button--active::after {
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
    border:0px
  }
}

.carousel__viewport,
.carousel__slide,
.carousel__track {
  height: 100%;
}



.carousel__slide {
  padding: 10px;
}

.carousel__prev,
.carousel__next {
  box-sizing: content-box;
  border: 5px solid white;
}
</style>
