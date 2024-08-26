<template>
  <li>
    <div class="border-b flex justify-between items-center">
      <div
        @click="toggleAccordion"
        class="w-full text-left flex items-center justify-between p-3 cursor-pointer"
      >
        <div class="flex items-center space-x-3">
          <img :src="category.picture" alt="Category Image" class="w-10 h-10 rounded-md" />
          <div>
            <span class="font-semibold text-lg">{{ category.name }}</span>
            <span v-if="category.childrenCount" class="text-sm text-gray-500">
              ({{ category.childrenCount }} children) - ({{ category.productCount }} Product/s)
            </span>
          </div>
        </div>
        <svg
          :class="{
            'transform rotate-180': isOpen,
            'transform rotate-0': !isOpen,
          }"
          class="w-5 h-5 text-gray-500 transition-transform duration-300"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
      <button
        @click="openModal"
        class="bg-red-600 text-white hover:bg-red-700 rounded-md px-4 py-1 ml-4"
      >
        Delete
      </button>
    </div>
    <ul v-if="isOpen && category.children.length" class="pl-5 mt-2 space-y-2">
      <CategoryNode
        v-for="child in category.children"
        :key="child.id"
        :category="child"
        @deleteCategory="handleDelete"
      />
    </ul>
    <ConfirmModal
      :title="'Confirm Deletion'"
      :message="'Are you sure you want to delete the category'"
      :visible="isModalOpen"
      @confirm="confirmDelete"
      @cancel="closeModal"
    />
  </li>
</template>

<script lang="ts">
import ConfirmModal from "~/components/confirmation-modal.vue";

interface Category {
  id: number;
  name: string;
  picture: string;
  parent_id: number | null;
  childrenCount: number;
  productCount: number;
  children: Category[];
}

export default defineComponent({
  name: "CategoryNode",
  components: { ConfirmModal },
  props: {
    category: {
      type: Object as PropType<Category>,
      required: true,
    },
  },
  setup(props: any, { emit }: any) {
    const isOpen = ref(false);
    const isModalOpen = ref(false);

    const toggleAccordion = () => {
      isOpen.value = !isOpen.value;
    };

    const openModal = () => {
      console.log("Modal opened");
      isModalOpen.value = true;
    };

    const closeModal = () => {
      isModalOpen.value = false;
    };

    const confirmDelete = () => {
      emit("deleteCategory", props.category.id);
      closeModal();
    };

    const handleDelete = (categoryId: number) => {
      emit("deleteCategory", categoryId);
    };

    return {
      isOpen,
      isModalOpen,
      toggleAccordion,
      openModal,
      closeModal,
      confirmDelete,
      handleDelete,
    };
  },
});
</script>

<style scoped>
li {
  list-style-type: none;
}
</style>
