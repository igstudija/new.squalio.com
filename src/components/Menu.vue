<script setup>
import { RouterLink } from "vue-router";
import api from "@/api";
</script>

<script>
export default {
  props: {
    id: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      levels: [],
      errors: [],
    };
  },

  created() {
    const menuId = this.id;

    api
      .get(`menus/${menuId}?populate=*&nested`)

      .then((response) => {
        this.levels = response.data.attributes.items.data;
      })
      .catch((e) => {
        this.errors.push(e);
      });
  },
};
</script>

<template>
  <ul class="hidden list-none lg:flex lg:gap-x-4">
    <li
      v-for="level_1 in levels"
      :key="level_1.id"
      :class="[level_1.attributes.children.data.length ? 'has-children' : '']"
      class="inline-block"
    >
      <RouterLink :to="{ name: level_1.attributes.page_slug }">
        <span>{{ level_1.attributes.title }} </span>

        <i
          class="fa-solid fa-angle-down ml-2"
          v-if="level_1.attributes.children.data.length"
        ></i>
      </RouterLink>

      <ul v-if="level_1.attributes.children.data.length" class="list-none">
        <li
          v-for="level_2 in level_1.attributes.children.data"
          :key="level_2.id"
          :class="[
            level_2.attributes.children.data.length ? 'has-children' : '',
          ]"
        >
          <RouterLink :to="level_1.attributes.url + level_2.attributes.url">
            <span>{{ level_2.attributes.title }} </span>
            <i
              class="fa-solid fa-angle-down ml-2"
              v-if="level_2.attributes.children.data.length"
            ></i>
          </RouterLink>

          <ul v-if="level_2.attributes.children.data.length" class="list-none">
            <li
              v-for="level_3 in level_2.attributes.children.data"
              :key="level_3.id"
            >
              <RouterLink
                :to="
                  level_1.attributes.url +
                  level_2.attributes.url +
                  level_3.attributes.url
                "
              >
                <span>{{ level_3.attributes.title }} </span>
              </RouterLink>
            </li>
          </ul>
        </li>
      </ul>
    </li>
  </ul>
</template>
