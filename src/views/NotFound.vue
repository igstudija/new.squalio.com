<script setup>
import { onMounted, onUnmounted } from "vue";

//example components
import IgNavbar from "@/components/Navbar.vue";
import DefaultFooter from "@/components/Footer.vue";

//hooks
const body = document.getElementsByTagName("body")[0];
onMounted(() => {
  body.classList.add("single-page");
  document.head.querySelector("meta[name=description]").content = "404";
});
onUnmounted(() => {
  body.classList.remove("single-page");
});
</script>

<template>
  <div class="h-screen pb-64">
  <IgNavbar transparent />

  <section class="flex items-center  p-16 dark:bg-gray-900 dark:text-gray-100">
	<div class="container flex flex-col items-center justify-center px-5 mx-auto my-8">
		<div class="text-center">
			<h2 class="mb-4 font-extrabold text-9xl dark:text-gray-600">
				<span class="sr-only">Error</span>404
			</h2>
			<p class="text-3xl font-semibold md:text-2xl">Sorry, we couldn't find this page.</p>
			<p class="mt-4 mb-8 dark:text-gray-400">But dont worry, you can find plenty of other things on our homepage.</p>
			<a rel="noopener noreferrer" href="#" class="px-8 py-3 font-semibold rounded bg-slate-300">Back to homepage</a>
		</div>
	</div>
</section>


</div>

  <DefaultFooter />
</template>
