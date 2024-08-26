<template>
  <div class="max-w-2xl mx-auto p-2">
    <ProductForm />
  </div>
</template>

<script lang="ts">
import ProductForm from "~/components/product-form.vue";

export default defineComponent({
  components: {
    ProductForm,
  },
});
</script>
