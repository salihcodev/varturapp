<template>
  <div class="max-w-2xl mx-auto p-2">
    <CategoryForm />
  </div>
</template>

<script lang="ts">
import CategoryForm from "~/components/category-form.vue";

export default defineComponent({
  components: {
    CategoryForm,
  },
});
</script>
