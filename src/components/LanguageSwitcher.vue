<script setup>
import { ref, defineProps, onMounted, watch, computed } from "vue";
import { useLanguageStore } from "@/store/language";
import { useRoute } from "vue-router";
import api from "@/api";

const locales = ref([]);
const errors = ref([]);
const loc = ref([]);
const parent = ref([]);
const parentLoc = ref([]);
const route = useRoute();

const slug = computed(() => route.meta.page);

//const slug = route.meta.page;
//console.log(route.meta.page);

const props = defineProps({
  contentType: {
    type: String,
    required: true,
  },
});

// Watch for route changes
watch(route, () => {
  console.log("Route changed. Current slug:", slug.value);
  fetchLocalizations();
});

async function fetchLocalizations() {
  try {
    const languagesResponse = await api.getLanguages();
    locales.value = languagesResponse;
    console.log("locales", locales.value);

    if (props.contentType === "home") {
      // console.log("Calling getSinLoc"); // Add this line for debugging
      const localizationsResponse = await api.getSinLoc(
        props.contentType,
        languageStore.selected
      );
      loc.value = localizationsResponse.data.attributes.localizations.data;
      console.log("getSinLoc", localizationsResponse);
    } else {
      // console.log("Calling getColLoc"); // Add this line for debugging
      const localizationsResponse = await api.getColLoc(
        props.contentType,
        slug.value,
        languageStore.selected
      );
      loc.value = localizationsResponse.data[0].attributes.localizations.data;
      console.log("getColLoc", loc.value);

      parent.value = localizationsResponse.data[0].attributes.parent;
      console.log("parent", parent.value.data.attributes.slug);
      if (parent.value !==null) {
        const parentLocalizationsResponse = await api.getColLoc(
        props.contentType,
        parent.value.data.attributes.slug,
        languageStore.selected
      );
      //console.log("parentLocalizationsResponse", parentLocalizationsResponse);
      parentLoc.value = parentLocalizationsResponse.data[0].attributes.localizations.data;
      console.log("parentLoc", parentLoc.value);
      }
      
    }
  } catch (e) {
    console.log("Error occurred:", e); // Add this line for debugging
    errors.value.push(e);
  }
}

onMounted(() => {
  console.log("Current slug:", slug.value);
  fetchLocalizations();
});

function getNameByCode(code) {
  const language = locales.value.find((locale) => locale.code === code);
  return language ? language.name : null;
}

function getSlugByCode(code) {
  const language = parentLoc.value.find((parentlocale) => parentlocale.attributes.locale === code);
  return language ? language.attributes.slug : null;
}


function getUrl(lang) {

  if (props.contentType === 'home') {

    if (lang.attributes.locale === 'en') {
      return '/';
    } else {
      return `/${lang.attributes.locale}`;
    }

  } else {

    if (lang.attributes.locale === 'en' && parentLoc.value.length > 0) {
      return `/${getSlugByCode(lang.attributes.locale)}/${lang.attributes.slug}`;
    } else if (lang.attributes.locale !== 'en' && parentLoc.value.length > 0) {
      return `/${lang.attributes.locale}/${getSlugByCode(lang.attributes.locale)}/${lang.attributes.slug}`;
    } else if (lang.attributes.locale === 'en' && parentLoc.value.length <= 0) {
      return `/${lang.attributes.slug}`;
    } else if (lang.attributes.locale !== 'en' && parentLoc.value.length <= 0) {
      return `/${lang.attributes.locale}/${lang.attributes.slug}`;
    }

  }
}

const languageStore = useLanguageStore();
const currentLanguage = languageStore.selected;
//console.log(currentLanguage);




</script>
<template>

  <ul class="relative inline-block text-left z-50">
    <li class="p-2 text-sm text-slate-500">
      <a href="#"
        >{{ getNameByCode(currentLanguage) }}
        <i class="fa-solid fa-angle-down text-sm"></i
      ></a>
      <ul
        class="origin-top-right absolute right-0 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden transition-all duration-300 opacity-0"
        id="language-options"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="language-selector"
      >
      
        <li class="py-1" role="none" v-for="lang in loc" :key="lang">
          <a
          :href="getUrl(lang)"
            class="block px-4 py-2 text-sm text-slate-600 hover:bg-gray-100 hover:text-gray-900"
            role="menuitem"
            >{{ getNameByCode(lang.attributes.locale) }}</a
          >
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
