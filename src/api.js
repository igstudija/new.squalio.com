import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_APP_SERVER_API_ENDPOINT,
  timeout: 6000,
});

API.interceptors.request.use(
  async (config) => {
    config.headers = {
      Authorization: `Bearer ${import.meta.env.VITE_APP_TOKEN}`,
      ...config.headers,
    };

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//export default API;


export default  {
  
  async getMenus() {
    try {
      const response = await API.get(`navigations/?locale=all&populate=deep`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getLanguages() {
    try {
      const response = await API.get(`/i18n/locales`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getSettings() {
    try {
      const response = await API.get(`setting?populate=*`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  async getMenu(id) {
    try {
      const response = await API.get(`navigations/${id}?populate=deep`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },


  async getSlides(slug) {
    try {
      const response = await API.get(`${slug}?populate[0]=slides&populate[1]=slides.image&populate[2]=slides.image.media`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

 

  async getCollectionItem(collection, slug) {
    try {
      const response = await API.get(`${collection}?filters[slug][$eq]=${slug}&populate=deep`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },



  async get(rest) {
    try {
      const response = await API.get(`${rest}`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // Add more API functions as needed
};
