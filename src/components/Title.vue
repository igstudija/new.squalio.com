<template>
  <h1 ref="parent" :class="{ 'ig-icon': hasImage }">
    <img v-if="hasImage" src="@/assets/img/ig-ikona.svg" />
    <slot />
  </h1>
</template>

<script>
export default {
  data() {
    return {
      hasImage: false,
    };
  },
  mounted() {
    this.hasImage = this.$refs.parent.classList.contains("ig-icon");
  },
};
</script>
