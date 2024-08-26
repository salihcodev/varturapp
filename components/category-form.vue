<template>
  <div class="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
    <!-- Conditional Header -->
    <h1 v-if="isEditing" class="text-2xl font-semibold text-gray-800 text-center my-10">
      Edit Category
    </h1>
    <h1 v-else class="text-2xl font-semibold text-gray-800 text-center my-10">
      Create a New Category
    </h1>

    <form @submit.prevent="saveCategory">
      <!-- ID Field for Editing -->
      <div v-if="isEditing" class="mb-4">
        <label for="id" class="block text-sm font-medium text-gray-700"> Category ID: </label>
        <input
          type="text"
          v-model="formData.id"
          id="id"
          readonly
          placeholder="Category ID"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500 sm:text-sm"
        />
      </div>

      <!-- Name Field -->
      <div class="mb-4">
        <label for="name" class="block text-sm font-medium text-gray-700"> Category Name: </label>
        <input
          type="text"
          v-model="formData.name"
          id="name"
          placeholder="Enter category name"
          required
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
        />
      </div>

      <!-- Picture Field -->
      <div class="mb-4">
        <label for="picture" class="block text-sm font-medium text-gray-700"> Picture: </label>
        <input
          :key="fileInputKey"
          type="file"
          @change="handleFileUpload"
          id="picture"
          accept="image/*"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
        />
        <div v-if="formData.picturePreview" class="mt-2">
          <img
            :src="formData.picturePreview"
            alt="Image Preview"
            class="h-20 w-20 object-cover rounded-md shadow-md"
          />
        </div>
      </div>

      <!-- Parent ID Field -->
      <div class="mb-4">
        <label for="parent_id" class="block text-sm font-medium text-gray-700"> Parent ID: </label>
        <input
          type="number"
          v-model.number="formData.parent_id"
          id="parent_id"
          placeholder="Enter parent ID (if any)"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          min="1"
          max="9999"
        />
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="isLoading"
        class="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
      >
        <span v-if="isEditing">Update Category</span>
        <span v-else>Create Category</span>
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
  </div>
</template>

<script lang="ts">
export default defineComponent({
  setup() {
    const router = useRouter();
    const formData = ref({
      id: "", // Add ID field
      name: "",
      picture: null as File | null,
      picturePreview: "" as string | null,
      parent_id: null as number | null,
    });

    const error = ref<string | null>(null);
    const successMessage = ref<string | null>(null);
    const isLoading = ref<boolean>(false);
    const isEditing = ref<boolean>(false);
    const fileInputKey = ref(0);

    onMounted(() => {
      if (window) {
        const url = new URL(window.location.href);
        const id = url.searchParams.get("id");
        if (id) {
          isEditing.value = true;
          fetchCategory(id);
        }
      }
    });

    const fetchCategory = async (id: string) => {
      try {
        const response = await fetch(`/api/categories/${id}`);
        if (!response.ok) throw new Error("Failed to fetch category");

        const { data } = await response.json();

        formData.value.id = data.id; // Set ID field
        formData.value.name = data.name;
        formData.value.picturePreview = data.picture;
        formData.value.parent_id = data.parent_id;
      } catch (err: any) {
        error.value = err.message;
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

    const saveCategory = async () => {
      isLoading.value = true;
      error.value = null;
      successMessage.value = null;

      try {
        const data = new FormData();
        data.append("name", formData.value.name);
        if (formData.value.picture) {
          data.append("picture", formData.value.picture);
        }
        if (formData.value.parent_id !== null) {
          data.append("parent_id", formData.value.parent_id.toString());
        }

        const method = isEditing.value ? "PUT" : "POST";
        const url = isEditing.value ? `/api/categories/${formData.value.id}` : "/api/categories";

        const response = await fetch(url, {
          method,
          body: data,
        });

        if (!response.ok) {
          throw new Error("Failed to save category");
        }

        const result = await response.json();

        if (result.status === "OK") {
          successMessage.value = isEditing.value
            ? "Category updated successfully!"
            : "Category created successfully!";
          // Reset form data
          formData.value = {
            id: "",
            name: "",
            picture: null,
            picturePreview: null,
            parent_id: null,
          };
          fileInputKey.value += 1;
        } else {
          throw new Error(result.details || "Unknown error");
        }
      } catch (err: any) {
        error.value = err.message;
      } finally {
        isLoading.value = false;
      }
    };

    return {
      formData,
      error,
      successMessage,
      saveCategory,
      isLoading,
      handleFileUpload,
      isEditing,
      fileInputKey,
    };
  },
});
</script>

<style scoped></style>
