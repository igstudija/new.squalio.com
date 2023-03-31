<script setup>
import { RouterLink } from "vue-router";
import { useLanguageStore } from '@/store/language';
import CookieConsentBlock from './CookieConsentBlock.vue';
import api from "@/api";



const Domain = import.meta.env.VITE_APP_DOMAIN;

const languageStore = useLanguageStore();
const currentLanguage = languageStore.selected;





</script>

<script>

export default {
  components: {
    CookieConsentBlock,
  },

  data() {
    return {
      settings: [],
      errors: [],
    };
  },



  created() {
    api
      .getSettings()
      .then((response) => {
        this.settings = response.data.attributes;
      })
      .catch((e) => {
        this.errors.push(e);
      });
  },

  computed: {
    currentLanguage() {
      return useLanguageStore().selected;
    },
  },
};
</script>

<template>
  <footer class="bg-white">
    <div class="mx-auto flex flex-col items-center justify-center max-w-7xl overflow-hidden py-20 px-6 sm:py-24 lg:px-8">
      
     
      <RouterLink
        v-if="settings.seo?.title && currentLanguage"
        :to="`${currentLanguage === 'en' ? '/' : `/${currentLanguage}`}`"
        rel="tooltip"
        :title="settings.seo.title"
        data-placement="bottom"
      >
        <template v-if="settings.logo?.data?.attributes?.url">
          <img
            :src="Domain + settings.logo.data.attributes.url"
            :alt="settings.seo.title"
            loading="lazy"
            :style="{ height: '25px' }"
          />
        </template>
      </RouterLink>

      <div class="mt-10 flex justify-center space-x-10"></div>
      <p class="mt-10 text-center text-xs leading-5 text-gray-500">&copy; {{ new Date().getFullYear() }} <template v-if="settings.seo?.title">{{ settings.seo.title }}</template>.</p>
    </div>
  </footer>

  <cookie-consent-block :expireDays="30" />
</template>
  
<style lang="scss">

.menu {
  padding-top: 20px;
  a {
    text-decoration: underline;
  }
}

</style>