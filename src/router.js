import { createRouter, createWebHistory } from "vue-router";
import { useLanguageStore } from "./store/language";
import api from "@/api";

const locales = ["en", "de", "lv", "et", "lt", "ru"]

const router = createRouter({
  history: createWebHistory(),

  scrollBehavior() {
    return { top: 0 };
  },
  routes: [
    {
      path: "/:lang(en|de|lv|et|lt|ru)?",
      name: "Home",
      component: () => import(`./views/Home.vue`),
    },
    {
      path: "/ru",
      redirect: "/",
    },
    {
      path: "/de",
      redirect: "/",
    },
    {
      path: "/:path(.*)",
      name: "NotFound",
      component: () => import(`./views/NotFound.vue`),
    },
  ],
});

async function getMenus() {
  await api.getMenus().then((response) => {
    response.data.forEach((menu) => {
      menu.attributes.menus.forEach((item) => {
        const defaultLang = "en";
        const route = {
          //name: `${item.page_slug}`,
          name: `${item.page.data.attributes.slug}`,
          component: () => import(`./views/${item.template}.vue`),
          meta: {
            lang: menu.attributes.locale,
            //page: item.page_slug,
            page: item.page.data.attributes.slug,
          },
        };

        if (menu.attributes.locale === defaultLang) {
          //route.path = `${item.url}`;
          route.path = `/${item.page.data.attributes.slug}`;
        } else {
          //route.path = `/:lang${item.url}`;
          route.path = `/:lang/${item.page.data.attributes.slug}`;
        }

        router.addRoute(route);

        // Child routes
        if (item.menu_item.length > 0) {
          const child = item.menu_item;
          child.forEach((child_item) => {

if(child_item.page.data !== null) {
            const childRoute = {
              path: `${child_item.page.data.attributes.slug}`,
              //name: `${child_item.page_slug}`,
              name: `${child_item.page.data.attributes.slug}`,
              component: () => import(`./views/${child_item.template}.vue`),
              props: true,
              meta: {
                lang: menu.attributes.locale,
                //page: child_item.page_slug,
                page: child_item.page.data.attributes.slug,
              },
            };
            router.addRoute(route.name, childRoute);
          }

          });
        }

        if (item.type === "archive") {
          const dynamicRoute = {
            path: `${item.url}/:page`,
            component: () => import(`./views/${item.template}Detail.vue`),
            meta: {
              lang: menu.attributes.locale,
            },
          };
          if (menu.attributes.locale !== defaultLang) {
            dynamicRoute.path = `/:lang(${menu.attributes.locale})${item.url}/:page`;
          }
          router.addRoute(dynamicRoute);
        }
      });
    });
    
  }).catch((error) => {
    console.error("Error fetching menus:", error);
  });
 console.log("Routes:", router.getRoutes());
}

router.beforeEach(async (to, from, next) => {
  const languageStore = useLanguageStore();
  const lang = to.params.lang;
  const currentLocales = to.path.split("/")[1];

  if (lang && !locales.includes(lang)) {
    return next({ path: "/404" });
  }

  if ((lang || lang === "") && languageStore.selected !== lang) {
    languageStore.setSelectedLanguage(lang || "en");
  }

  if (locales.includes(currentLocales || lang)) {
    if(languageStore.selected !== lang) {
      languageStore.setSelectedLanguage(lang || currentLocales);
    }
  }else {
    languageStore.setSelectedLanguage("en");
  }

  if (to.name === "NotFound") {
    await getMenus()
    router.getRoutes().forEach(route => {
      let replacedPath = ""
      if (route.path.includes("lang")) {
        replacedPath = route.path.replace(":lang", languageStore.selected)
      }

      if (replacedPath ? replacedPath === to.path : route.path === to.path) {
        router.push(to.path)
      }
    })
  }

  next();
});

getMenus()

export default router;