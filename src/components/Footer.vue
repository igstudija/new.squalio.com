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
  <footer class=" bg-gray-900 w-screen h-64 -mt-64">
    <div class="mx-auto relative max-w-7xl overflow-hidden px-6 pt-6 lg:px-8 h-full">
      
     <div class="absolute bottom-0 pb-4 w-full ">
      <RouterLink
        v-if="settings.seo?.title && currentLanguage"
        :to="`${currentLanguage === 'en' ? '/' : `/${currentLanguage}`}`"
        rel="tooltip"
        :title="settings.seo.title"
        data-placement="bottom"
        class="block text-center"
      >
        <template v-if="settings.logo?.data?.attributes?.url">
          <img
            :src="Domain + settings.logo.data.attributes.url"
            :alt="settings.seo.title"
            loading="lazy"
            :style="{ height: '25px' }"
            class="inline-block footer-logo"
          />
        </template>
      </RouterLink>

      
      <div class="text-center pt-2 text-gray-400 text-sm">&copy; {{ new Date().getFullYear() }}, <template v-if="settings.seo?.title">{{ settings.seo.title }}</template></div>

    </div>
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

.footer-logo {
  -webkit-filter: brightness(0) invert(1);
  filter: brightness(0) invert(1);
}

</style>