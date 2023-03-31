<script setup>
import { ref } from "vue";
import { useLanguageStore } from "@/store/language";
import { useRouter } from "vue-router";
import api from "@/api";

const locales = ref([]);
const errors = ref([]);

api.getLanguages().then(response => {
  locales.value = response;
  //console.log(locales.value);
}).catch(e => {
  errors.value.push(e);
});


const languageStore = useLanguageStore();
const currentLanguage = languageStore.selected;

</script>
<template>
  <ul class="relative inline-block text-left z-50">
    <li>
      <a href="#">{{ currentLanguage }}
      <i class="fa-solid fa-angle-down"></i></a>
      <ul
        class="origin-top-right absolute right-0  w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden transition-all duration-300 opacity-0"
        id="language-options"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="language-selector"
      >
        <li class="py-1" role="none">
          <a
            
            v-for="lang in locales"
            :key="lang"
            :href="`${lang.code === 'en' ? '/' : `/${lang.code}`}`"
            
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            role="menuitem"
          >{{ lang.name }}</a>
        </li>
      </ul>
    </li>
  </ul>
</template>
<style>
  /* hide submenu by default */
  #language-options {
    display: none;
  }

  /* show submenu on hover */
  li:hover #language-options {
    display: block;
    opacity: 1;
  }
</style>
