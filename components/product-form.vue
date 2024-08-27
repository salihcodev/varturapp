<template>
  <div class="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
    <!-- Conditional Header -->
    <h1 v-if="isEditing" class="text-2xl font-semibold text-gray-800 text-center my-10">
      Edit Product
    </h1>
    <h1 v-else class="text-2xl font-semibold text-gray-800 text-center my-10">
      Create a New Product
    </h1>

    <button
      v-if="toUpdatedid"
      @click="openModal"
      class="bg-red-600 text-white hover:bg-red-700 rounded-full size-10 flex items-center justify-center mb-4"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-7 w-5 white"
        fill="none"
        viewBox="0 0 26 26"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="square"
          stroke-linejoin="miter"
          d="M3 6h18M9 6V4h6v2M4 6v14a1 1 0 001 1h14a1 1 0 001-1V6H4z"
        />
      </svg>
    </button>
    <form @submit.prevent="saveProduct">
      <!-- ID Field for Editing -->
      <div v-if="isEditing" class="mb-4">
        <label for="id" class="block text-sm font-bold text-gray-700"> Product ID: </label>
        <input
          type="text"
          v-model="formData.id"
          id="id"
          readonly
          placeholder="Product ID"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500 sm:text-sm"
        />
      </div>

      <!-- Name Field -->
      <div class="mb-4">
        <label for="name" class="block text-sm font-bold text-gray-700"> Product Name: </label>
        <input
          type="text"
          v-model="formData.name"
          id="name"
          placeholder="Enter product name"
          required
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
        />
      </div>

      <!-- Picture Field -->
      <div class="mb-4">
        <label for="picture" class="block text-sm font-bold text-gray-700"> Picture: </label>
        <input
          :key="fileInputKey"
          type="file"
          @change="handleFileUpload"
          id="picture"
          accept="image/*"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
        />
        <div v-if="formData.picturePreview" class="mt-2">
          <img
            :src="formData.picturePreview"
            alt="Image Preview"
            class="h-20 w-20 object-cover rounded-md shadow-md"
          />
        </div>
      </div>

      <!-- Category Dropdowns -->
      <div class="mb-6">
        <div v-for="(dropdown, index) in dropdowns" :key="index" class="mb-4">
          <label :for="`dropdown-${index}`" class="block text-sm font-semibold text-gray-700 mb-1">
            {{ index === 0 ? "Main Category" : "Category" }}
          </label>
          <select
            :id="`dropdown-${index}`"
            v-model="selectedValues[index]"
            @change="handleChange(index)"
            class="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm bg-white text-gray-900"
          >
            <option value="" disabled>Select a category</option>
            <option v-for="category in dropdown" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="isLoading"
        class="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-bold rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
      >
        <span v-if="isEditing">Update product</span>
        <span v-else>Create product</span>
        <span v-if="isLoading" class="ml-2">Loading...</span>
      </button>
    </form>

    <!-- Error and Success Messages -->
    <div v-if="error" class="mt-4 text-xs font-bold text-red-600">
      {{ error }}
    </div>

    <div v-if="successMessage" class="mt-4 text-xs font-bold text-green-600">
      {{ successMessage }}
    </div>
    <ConfirmModal
      :title="'Confirm Deletion'"
      :message="'Are you sure you want to delete the category'"
      :visible="isModalOpen"
      @confirm="confirmDelete"
      @cancel="closeModal"
    />
  </div>
</template>

<script lang="ts">
import ConfirmModal from "~/components/confirmation-modal.vue";

interface Category {
  id: number;
  name: string;
  children: Category[];
}

export default defineComponent({
  components: { ConfirmModal },
  setup() {
    const router = useRouter();
    const isOpen = ref(false);
    const isModalOpen = ref(false);

    const openModal = () => {
      isModalOpen.value = true;
    };

    const closeModal = () => {
      isModalOpen.value = false;
    };

    const confirmDelete = () => {
      deleteCategory();
      closeModal();
    };

    const formData = ref({
      id: "",
      name: "",
      picture: null as File | null,
      picturePreview: "" as string | null,
      category_id: null as number | null,
    });

    const error = ref<string | null>(null);
    const successMessage = ref<string | null>(null);
    const isLoading = ref<boolean>(false);
    const isEditing = ref<boolean>(false);

    // Ref for resetting file input
    const fileInputKey = ref(0);

    onMounted(() => {
      if (window) {
        const url = new URL(window.location.href);
        const id = url.searchParams.get("id");
        if (id) {
          toUpdatedid.value = id;
          isEditing.value = true;

          fetchCategory(id);
        }
      }
    });

    const deleteCategory = async () => {
      try {
        isLoading.value = true;
        const response = await fetch(`/api/products/${toUpdatedid.value}`, {
          method: "DELETE",
        });

        const { statusMessage } = await response.json();

        if (!response.ok) {
          throw new Error(statusMessage);
        }
        setTimeout(() => {
          router.push(`/`);
        }, 3000);
      } catch (err: any) {
        error.value = err.message;
      } finally {
        isLoading.value = false;
      }
    };

    const fetchCategory = async (id: string) => {
      try {
        isLoading.value = true;

        const response = await fetch(`/api/products/${id}`);
        const { statusMessage, data } = await response.json();

        if (!response.ok) throw new Error(statusMessage);
        successMessage.value = statusMessage;

        formData.value.id = data.id; // Set ID field
        formData.value.name = data.name;
        formData.value.picturePreview = data.picture;
        formData.value.category_id = data.category_id;
      } catch (err: any) {
        error.value = err.message;
      } finally {
        isLoading.value = false;
        setTimeout(() => {
          error.value = null;
          successMessage.value = null;
        }, 3000);
      }
    };

    const handleFileUpload = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        formData.value.picture = target.files[0];
        formData.value.picturePreview = URL.createObjectURL(target.files[0]);
      } else {
        formData.value.picture = null;
        formData.value.picturePreview = null;
      }
    };

    const saveProduct = async () => {
      isLoading.value = true;
      error.value = null;
      successMessage.value = null;

      try {
        const data = new FormData();
        data.append("name", formData.value.name);
        if (formData.value.picture) {
          data.append("picture", formData.value.picture);
        }
        if (formData.value.category_id !== null) {
          data.append("category_id", formData.value.category_id.toString());
        }

        const method = isEditing.value ? "PUT" : "POST";
        const url = isEditing.value ? `/api/products/${formData.value.id}` : "/api/products";

        const response = await fetch(url, {
          method,
          body: data,
        });

        const { statusMessage, status, details } = await response.json();
        if (!response.ok) {
          throw new Error(statusMessage);
        }

        if (status === "OK") {
          successMessage.value = statusMessage;

          // Reset form data
          if (method === `POST`) {
            formData.value = {
              id: "",
              name: "",
              picture: null,
              picturePreview: null,
              category_id: null,
            };
          }

          // Reset dropdowns and selected values
          selectedValues.value = [];
          dropdowns.value = [];

          // Reset file input
          fileInputKey.value += 1; // Increment key to force reset
        } else {
          throw new Error(details || "Unknown error");
        }
      } catch (err: any) {
        error.value = err.message;
      } finally {
        isLoading.value = false;
        setTimeout(() => {
          error.value = null;
          successMessage.value = null;
        }, 3000);
      }
    };

    // ================================
    // Catch the Cats :)
    const categories = ref<Category[]>([]);
    const toUpdatedid = ref<number | null>(null);
    const dropdowns = ref<Category[][]>([]);
    const selectedValues = ref<(number | null)[]>([]);

    // retrieve categories from API
    const fetchCategories = async (): Promise<void> => {
      try {
        const response = await fetch("/api/categories");
        const { data } = await response.json();
        categories.value = data;
        buildDropdowns();
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    // Build dropdowns based on the selected values and category data
    const buildDropdowns = () => {
      dropdowns.value = [];
      let currentLevelCategories: Category[] = categories.value;

      selectedValues.value.forEach((selectedValue: any, index: any) => {
        dropdowns.value.push(currentLevelCategories);
        const selectedCategory = currentLevelCategories.find((cat) => cat.id === selectedValue);
        currentLevelCategories = selectedCategory?.children || [];
      });

      // Push the next level only if there are children
      if (currentLevelCategories.length > 0) {
        dropdowns.value.push(currentLevelCategories);

        //  when update <form>...
        // add the fetched `category_id` to selection in the dropdown
        selectedValues.value.push(formData.value.category_id);
      }

      // Set category_id to the last selected value
      formData.value.category_id = selectedValues.value[selectedValues.value.length - 1] ?? null;
    };

    // Handle dropdown change events
    const handleChange = (index: number) => {
      // Remove any selected values after the current index
      selectedValues.value = selectedValues.value.slice(0, index + 1);
      buildDropdowns();
    };

    onMounted(fetchCategories);
    watch(selectedValues, buildDropdowns);

    return {
      formData,
      dropdowns,
      selectedValues,
      handleChange,
      error,
      successMessage,
      saveProduct,
      isLoading,
      handleFileUpload,
      isEditing,
      fileInputKey,
      isOpen,
      isModalOpen,
      openModal,
      closeModal,
      confirmDelete,
      toUpdatedid,
    };
  },
});
</script>

<style scoped></style>
