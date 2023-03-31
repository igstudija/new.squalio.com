import { createRouter, createWebHistory } from "vue-router";
import { useLanguageStore } from "./store/language";
import api from "@/api";

const router = createRouter({
  history: createWebHistory(),

  scrollBehavior() {
    return { top: 0 };
  },
  routes: [
    {
      path: "/:lang(en|de|lv|ee|lt|ru)?",
      component: () => import(`./views/Home.vue`),
    },
    {
      path: "/:path(.*)",
      component: () => import(`./views/NotFound.vue`),
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const languageStore = useLanguageStore();
  const lang = to.params.lang;

  if (lang && !["en", "de", "lv", "ee", "lt", "ru"].includes(lang)) {
    return next({ path: "/404" });
  }

  if (lang && languageStore.selected !== lang) {
    languageStore.setSelectedLanguage(lang);
  }

  next();
});

api.getMenus().then((response) => {
    response.data.forEach((menu) => {
        menu.attributes.menus.forEach((item) => {
          const defaultLang = "en";
          const route = {
            //name: `${menu.attributes.locale}-${item.page_slug}`,
            name: `${item.page_slug}`,
            component: () => import(`./views/${item.template}.vue`),
            meta: {
              lang: menu.attributes.locale,
              page: item.page_slug,
            },
          };
    
          if (menu.attributes.locale === defaultLang) {
            route.path = `${item.url}`;
          } else {
            route.path = `/:lang${item.url}`;
          }
    
          router.addRoute(route);
    
          // Child routes
          if (item.menu_item.length > 0) {
            const child = item.menu_item;
            child.forEach((child_item) => {
              const childRoute = {
                path: `${child_item.url}`,
                name: `${child_item.page_slug}`,
                component: () => import(`./views/${child_item.template}.vue`),
                props: true,
                meta: {
                  lang: menu.attributes.locale,
                  page: child_item.page_slug,
                },
              };
              router.addRoute(route.name, childRoute);
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

  // Log the generated routes
  console.log(router.getRoutes());
}).catch((error) => {
  console.error("Error fetching menus:", error);
});

export default router;