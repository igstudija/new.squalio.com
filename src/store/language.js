import { defineStore } from 'pinia';

export const useLanguageStore = defineStore({
  id: 'language',
  state: () => ({
    selected: 'en', // default language is English
  }),
  actions: {
    setSelectedLanguage(lang) {
       // console.log('Updating language store to:', lang);
      this.selected = lang;
    },
  },
});