<template>
  <div
    v-if="visible"
    class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
  >
    <div class="bg-white rounded-lg p-6 w-1/3">
      <h3 class="text-lg font-semibold mb-4">{{ title }}</h3>
      <p class="mb-4">{{ message }}</p>
      <div class="flex justify-end space-x-2 my-2 mt-8">
        <button
          @click="onCancel"
          class="bg-gray-500 text-white hover:bg-gray-600 rounded-md px-4 py-1 ml-4"
        >
          Cancel
        </button>
        <button
          @click="onConfirm"
          class="bg-red-600 text-white hover:bg-red-700 rounded-md px-4 py-1 ml-4"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: "ConfirmModal",
  props: {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    visible: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["confirm", "cancel"],
  setup(props: any, { emit }: any) {
    const onConfirm = () => {
      emit("confirm");
    };

    const onCancel = () => {
      emit("cancel");
    };

    return { onConfirm, onCancel };
  },
});
</script>

<style scoped></style>
