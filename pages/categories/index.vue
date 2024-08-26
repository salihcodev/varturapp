<template>
  <div>
    <h1 class="text-xl font-bold mb-4">Categories</h1>
    <div v-if="loading" class="mt-4 text-blue-500">Loading...</div>
    <div v-else class="mt-4">
      <span class="text-gray-500">Total Items: </span>
      <span>{{ results }}</span>
    </div>
    <div v-if="loading" class="mt-4 text-red-500">Deleting...</div>
    <ul v-if="!loading">
      <CategoryNode
        v-for="category in categories"
        :key="category.id"
        :category="category"
        @deleteCategory="deleteCategory"
      />
    </ul>
  </div>
</template>

<script lang="ts">
import CategoryNode from "~/components/category-node.vue";

interface Category {
  id: number;
  name: string;
  picture: string;
  parent_id: number | null;
  childrenCount: number;
  children: Category[];
}

export default defineComponent({
  name: "CategoryTree",
  components: {
    CategoryNode,
  },
  setup() {
    const categories = ref<Category[]>([]);
    const results = ref<number>(0);
    const loading = ref<boolean>(false);

    onMounted(async () => {
      loading.value = true;
      try {
        const response = await fetch("/api/categories");
        const result = await response.json();
        categories.value = result.data;
        results.value = result.results;
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        loading.value = false;
      }
    });

    const deleteCategory = async (categoryId: number) => {
      loading.value = true;
      try {
        await fetch(`/api/categories/${categoryId}`, {
          method: "DELETE",
        });

        // Reload categories after deletion
        const response = await fetch("/api/categories");
        const result = await response.json();
        categories.value = result.data;
        results.value = result.results;
      } catch (error) {
        console.error("Failed to delete category:", error);
      } finally {
        loading.value = false;
      }
    };

    return {
      categories,
      results,
      loading,
      deleteCategory,
    };
  },
});
</script>

<style scoped>
div {
  padding: 2rem;
}
</style>
