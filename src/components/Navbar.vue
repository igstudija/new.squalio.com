<script setup>
import { ref, computed, watch } from "vue";
import { RouterLink } from "vue-router";

import LanguageSwitcher from "@/components/LanguageSwitcher.vue";

import { useLanguageStore } from "@/store/language";
import { Dialog, DialogPanel } from "@headlessui/vue";
import { Bars3Icon, XMarkIcon } from "@heroicons/vue/24/outline";
import api from "@/api";
const mobileMenuOpen = ref(false);
const Domain = import.meta.env.VITE_APP_DOMAIN;

const store = useLanguageStore();
const selectedLanguage = computed(() => store.selected);

function switchLanguage(lang) {
  //console.log("Received language change event:", lang);
  store.setSelectedLanguage(lang);
  // set the language in the VueI18n instance if you're using it
}

//watch(selectedLanguage, (newLang, oldLang) => {
// console.log("Selected language changed from", oldLang, "to", newLang);
//});
</script>

<script>
export default {
  components: {
    LanguageSwitcher,
  },

  computed: {
    currentLanguage() {
      return useLanguageStore().selected;
    },
  },

  //get posts

  data() {
    return {
      posts: [],
      menu: [],
      settings: [],
      languages: [],
      errors: [],
      isNavbarScrolled: false,
    };
  },

  created() {
    //this is default top menu id
    const default_menu_id = 1;
    api
      .getMenu(default_menu_id)
      .then((response) => {
        this.localizations = response.data.attributes.localizations;

        let loc = this.localizations.data;

        const desiredLocale = useLanguageStore().selected;
        const itemWithLocale = loc.find(
          (c) => c.attributes.locale === desiredLocale
        );

        if (itemWithLocale) {
          const menu_id = itemWithLocale.id;
          api
            .getMenu(menu_id)
            .then((response) => {
              this.menu = response.data.attributes;
              this.posts = response.data.attributes.menus;
              //console.log(this.posts);
            })
            .catch((e) => {
              this.errors.push(e);
            });
        } else {
          //const menu_id = itemWithLocale.id;
          api
            .getMenu(default_menu_id)
            .then((response) => {
              this.menu = response.data.attributes;
              this.posts = response.data.attributes.menus;
              //console.log(this.posts);
            })
            .catch((e) => {
              this.errors.push(e);
            });
        }
      })
      .catch((e) => {
        this.errors.push(e);
      });

    api
      .getSettings()
      .then((response) => {
        this.settings = response.data.attributes;
        //console.log(this.settings);
      })
      .catch((e) => {
        this.errors.push(e);
      });
  },
};
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-30">
    <div
      class="justify-between mx-auto max-w-7xl hidden list-none lg:px-8 lg:flex lg:gap-x-4"
    >
      <div>email</div>
      <language-switcher />
    </div>

    <nav
      class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      aria-label="Global"
    >
      <RouterLink
        v-if="menu.locale"
        class=""
        :to="`${currentLanguage === 'en' ? '/' : `/${currentLanguage}`}`"
         
        rel="tooltip"
        title="SQUALIO"
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
      <div class="flex lg:hidden">
        <button
          type="button"
          class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-slate-600"
          @click="mobileMenuOpen = true"
        >
          <span class="sr-only">Open main menu</span>
          <Bars3Icon class="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      <ul class="hidden list-none lg:flex lg:gap-x-4">
        <li
          v-if="menu.locale"
          v-for="post in posts"
          :key="post.id"
          :class="[post.menu_item ? 'has-children' : '']"
          class="text-md font-semibold leading-6 text-gray-900 group inline-block relative"
        >
          <RouterLink
            v-if="post.external == null || post.external == false"
            :to="{
              path: `${currentLanguage === 'en' ? '' : `/${menu.locale}`}${
                post.url
              }`,
            }"
            class="p-2 uppercase text-slate-600 hover:text-slate-900 text-sm block"
          >
            <span>{{ post.title }} </span>

            <i
              class="fa-solid fa-angle-down ml-2"
              v-if="post.menu_item.length"
            ></i>
          </RouterLink>

          <a
            v-else="post.external == true"
            :href="post.url"
            target="_blank"
            class="p-2 uppercase text-slate-600 hover:text-slate-900 text-sm block"
          >
            <span>{{ post.title }} </span>
          </a>

          <ul
            v-if="post.menu_item.length"
            class="m-0 pb-2 pt-2 min-w-[200px] w-auto list-none hidden group-hover:block absolute bg-slate-100 rounded-md -translate-x-1/4"
          >
            <li v-for="child in post.menu_item" :key="child">
              <RouterLink
                v-if="child.external == null || child.external == false"
                :to="{
                  path: `${currentLanguage === 'en' ? '' : `/${menu.locale}`}${
                    post.url
                  }/${child.url}`,
                }"
                class="dropdown-item uppercase py-1 text-sm ps-3 border-radius-md p-5 block"
              >
                <span>{{ child.title }} </span>
              </RouterLink>
              <a
                v-if="child.external == true"
                :href="child.url"
                target="_blank"
                class="dropdown-item uppercase py-1 text-sm ps-3 border-radius-md p-5 block"
              >
                <span>{{ child.title }} </span>
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
    <Dialog
      as="div"
      class="lg:hidden"
      @close="mobileMenuOpen = false"
      :open="mobileMenuOpen"
    >
      <div class="fixed inset-0 z-90" />
      <DialogPanel
        class="fixed inset-y-0 right-0 z-40 w-full overflow-y-auto bg-gray-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10"
      >
        <div class="flex items-center justify-between">
          <img
            :src="Domain + settings.logo.data.attributes.url"
            :alt="settings.seo.title"
            loading="lazy"
            :style="{ height: '25px' }"
          />
          <button
            type="button"
            class="-m-2.5 rounded-md p-2.5 text-gray-500"
            @click="mobileMenuOpen = false"
          >
            <span class="sr-only">Close menu</span>
            <XMarkIcon class="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div class="mt-6 flow-root">
          <div class="-my-6 divide-y divide-gray-500/10">
            <div class="space-y-2 py-6">
              <ul class="list-none">
                <li
                  v-for="post in posts"
                  :key="post.id"
                  :class="[post.menu_item ? 'has-children' : '']"
                  class="text-md font-semibold text-gray-900 block"
                >
                  <RouterLink
                    v-if="post.external == null || post.external == false"
                    :to="{
                      path: `${
                        currentLanguage === 'en' ? '' : `/${menu.locale}`
                      }${post.url}`,
                    }"
                    class="p-2 uppercase text-slate-600 hover:text-slate-900 text-sm block"
                  >
                    {{ post.title }}
                  </RouterLink>

                  <ul
                    v-if="post.menu_item.length"
                    class="m-0 mt-1 pb-2 list-none"
                  >
                    <li v-for="child in post.menu_item" :key="child">
                      <RouterLink
                        v-if="child.external == null || child.external == false"
                        :to="{
                          path: `${
                            currentLanguage === 'en' ? '' : `/${menu.locale}`
                          }${post.url}/${child.url}`,
                        }"
                        class="dropdown-item py-2 ps-3 border-radius-md p-5 block text-white font-normal"
                        @click="mobileMenuOpen = false"
                      >
                        {{ child.title }}
                      </RouterLink>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <language-switcher />
      </DialogPanel>
    </Dialog>
  </header>
</template>

<style>
.ig-dark {
  background-color: #1c1b22;
  color: #ffffff;
  transition: all 0.5s ease;
}
</style>
