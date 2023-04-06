<script setup>
import api from "@/api";
import { useLanguageStore } from "@/store/language";
const languageStore = useLanguageStore();

const currentLanguage = languageStore.selected;
</script>

<script>
export default {
  
  props: {
    cookieName: {
      type: String,
      default: "cookieConsent",
    },
    expireDays: {
      type: Number,
      default: 30,
    },
  },

  watch: {
    cookieOptions: {
      handler() {
        this.applyCookiesSettings();
      },
      deep: true,
    },
  },
  
  computed: {
    currentLanguage() {
      return useLanguageStore().selected;
    },
    
    cookieDomain() {
      const domain = window.location.hostname;

      // Check if the domain is an IP address
      if (/^(\d{1,3}\.){3}\d{1,3}$/.test(domain)) {
        return domain;
      }

      // Check if the domain already has a subdomain (by counting the number of dots)
      const numberOfDots = domain.split(".").length - 1;
      if (numberOfDots >= 2) {
        return domain;
      }

      // Otherwise, add a dot prefix
      return "." + domain;
    },
    hasStoredConsent() {
      return !!localStorage.getItem("cookieConsent");
    },
    
  },

  created() {
    api
      .get(`gdpr?locale=${this.currentLanguage}&populate=*&nested`)
      .then((response) => {
        this.consentData = response.data.attributes;
        //this.cookieOptions = this.consentData.cookie_scripts;
        //console.log(this.cookieOptions);
        // console.log("Consent data:", this.consentData);
        //console.log("Cookie options:", this.cookieOptions);
      })
      .catch((e) => {
        this.errors.push(e);
      });


      api
      .get(`cookie-script?populate=deep`)
      .then((response) => {
        this.cookieOptions = response.data.attributes.cookie_scripts;
        
        console.log("Cookie options:", this.cookieOptions);
      })
      .catch((e) => {
        this.errors.push(e);
      });




      
      
  },

  data() {
    return {
      errors: [],
      isAccepted: false,
      showBlock: false,
      consentData: [],
      cookieOptions: [],
      selectedCookies: ["necessary"],
      cookieNameToOption: {},
    };
  },
  mounted() {
    this.loadCookieConsent();
    this.showBlock = true;
    this.cookieNameToOption = this.cookieOptions.reduce((acc, option) => {
      /* if (option.cookie_names) {
        option.cookie_names.split(",").forEach((cookieName) => {
          acc[cookieName] = option;
        });
      }
      return acc;*/
    }, {});
  },
  methods: {






    loadCookieConsent() {
      const storedConsent = localStorage.getItem("cookieConsent");

      if (storedConsent) {
        this.isAccepted = true;
        this.selectedCookies = JSON.parse(storedConsent);
        this.applyCookiesSettings();
      }
    },

    deleteCookie(cookieName) {
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    },

    deleteCookiesByName(cookieNames) {
      cookieNames.forEach((cookieName) => {
        this.deleteCookie(cookieName);
      });
    },

    toggleCookie(cookieOption) {
      const { slug, cookie_names } = cookieOption;

      if (slug === "necessary") return; // Do not toggle the necessary cookie

      const index = this.selectedCookies.indexOf(slug);

      if (index === -1) {
        this.selectedCookies.push(slug);
      } else {
        this.selectedCookies.splice(index, 1);

        if (cookie_names) {
          const cookieNames = cookie_names.split(",");
          this.deleteCookies(cookieNames);
        }
      }
    },

    accept() {
      if (!this.selectedCookies.includes("necessary")) {
        this.selectedCookies.push("necessary");
      }
      localStorage.setItem(
        "cookieConsent",
        JSON.stringify(this.selectedCookies)
      );
      this.isAccepted = true;
      this.applyCookiesSettings();

      // Add the following lines to remove cookies that are no longer selected
      this.cookieOptions.forEach((option) => {
        if (
          !this.selectedCookies.includes(option.slug) &&
          option.cookie_names
        ) {
          const cookieNames = option.cookie_names.split(",");
          this.deleteCookiesByName(cookieNames); // Changed the function name to deleteCookiesByName
        }
      });
      // Refresh the window
      window.location.reload();
    },

    acceptAll() {
      this.selectedCookies = this.cookieOptions.map((option) => option.slug);
      this.accept();
      window.location.reload();
    },
    declineAll() {
      this.selectedCookies = ["necessary"];
      localStorage.removeItem("cookieConsent");
      this.isAccepted = true;
      this.applyCookiesSettings();
      this.deleteAllCookies(); // This line will delete all cookies, not just by name
      window.location.reload();
    },

    deleteAllCookies() {
      const cookies = document.cookie.split(";");

      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const [cookieName] = cookie.split("=");
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
    },

    showCookieSettings() {
      this.isAccepted = false;
      this.showBlock = true;
    },

    hideCookieSettings() {
      this.isAccepted = false;
      this.showBlock = false;
    },

    addScript(option) {
      // console.log("Adding script for option:", option);
      if (option.script && option.placement) {
        const template = document.createElement("template");
        template.innerHTML = option.script.trim();
        const fragment = template.content;
        const scripts = fragment.querySelectorAll("script");

        scripts.forEach((script) => {
          const scriptElement = document.createElement("script");
          if (script.src) {
            scriptElement.src = script.src;
          } else {
            scriptElement.innerHTML = script.innerHTML;
          }

          if (script.async) {
            scriptElement.async = true;
          }

          scriptElement.dataset.cookieSlug = option.slug;

          if (option.placement === "head") {
            //console.log("Adding script to head:", scriptElement);
            const head = document.getElementsByTagName("head")[0];
            head.appendChild(scriptElement);
          } else if (option.placement === "body") {
            document.body.insertBefore(scriptElement, document.body.firstChild);
          } else if (option.placement === "footer") {
            document.body.appendChild(scriptElement);
          } else {
            console.error(
              "Invalid placement specified in cookie option:",
              option
            );
          }
        });
      }
    },

    removeScript(option) {
      if (option.script && option.placement) {
        const scriptElements = document.querySelectorAll(
          `script[data-cookie-slug="${option.slug}"]`
        );
        scriptElements.forEach((scriptElement) => {
          scriptElement.remove();
        });
      }
    },

    applyCookiesSettings() {
      //console.log("Applying cookie settings...");
      this.cookieOptions.forEach((option) => {
        // console.log("Processing option:", option);
        if (this.selectedCookies.includes(option.slug)) {
          this.addScript(option);
        } else {
          this.removeScript(option);
        }
      });
    },
  },
};
</script>

<template>
  <div
    v-if="!isAccepted && !hasStoredConsent"
    class="top-0 left-0 right-0 bottom-0 z-40 fixed bg-black opacity-60"
  ></div>
  <div
    v-if="!isAccepted"
    :class="{ 'cookie-block': true, 'slide-in': showBlock }"
    class="block p-6 mb-6 bg-white border m-4 border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:hover:bg-gray-700 hover:bg-gray-100 dark:border-gray-700 z-50 absolute"
  >
    <button
      v-if="hasStoredConsent"
      class="absolute top-0 right-0 p-4 ig-heading text-sm"
      @click="isAccepted = true"
    >
    Close
    </button>
    <div class="message text-2xl font-extrabold leading-none pb-2 pt-5 md:pt-0">
      {{ consentData.title }}
    </div>
    <div class="message text-lg py-2">{{ consentData.description }}</div>
    <div class="cookie-options">
      <label
        for="necessary"
        class="relative inline-flex items-center cursor-pointer my-1"
      >
        <input
          type="checkbox"
          id="necessary"
          name="Necessary"
          checked
          disabled
          class="sr-only peer"
        />
        <div
          class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"
        ></div>
        <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"
          >Funkcionālās sīkdatnes</span
        >
      </label>

      <div class="font-bold py-1">{{ consentData.custom_cookies_title }}</div>

      <div
        v-for="(option, index) in cookieOptions"
        :key="index"
        class="cookie-option"
      >
        <label
          :for="option.slug"
          class="relative inline-flex items-center cursor-pointer my-1"
        >
          <input
            type="checkbox"
            :id="option.slug"
            :name="option.title"
            :checked="selectedCookies.includes(option.slug)"
            @change="toggleCookie(option)"
            class="sr-only peer"
          />
          <div
            class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"
          ></div>
          <span
            class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"
            >{{ option.title }}</span
          >
        </label>
      </div>
    </div>
    <div class="text-center pt-6">
      <button
        class="accept-all-button rounded-full pr-8 pl-8 bg-slate-500 px-3.5 py-2.5 text-sm font-semibold m-1 text-white uppercase w-full md:w-auto"
        @click="acceptAll"
      >
        {{ consentData.accept_button_name }}
      </button>

      <button
        class="accept-button rounded-full pr-8 pl-8 bg-slate-500 px-3.5 py-2.5 text-sm font-semibold m-1 text-white uppercase w-full md:w-auto"
        @click="accept"
      >
        {{ consentData.accept_selected_button_name }}
      </button>

      <button
        class="decline-all-button rounded-full pr-8 pl-8 bg-slate-500 px-3.5 py-2.5 text-sm font-semibold m-1 text-white uppercase w-full md:w-auto"
        @click="declineAll"
      >
        {{ consentData.reject_button_name }}
      </button>
    </div>
  </div>
  <button
    v-if="isAccepted && hasStoredConsent"
    class="fixed bottom-2 left-2 text-3xl leading-none cookie-button"
    @click="showCookieSettings"
  >
    <i class="fa fa-cookie ig-heading"></i>
  </button>
</template>

<style lang="scss">
.cookie-block {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;

  transition: transform 0.3s ease-in-out;
}

.cookie-button {
  i {
    color:#a9b62b
  }
}
</style>
