<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

      <nav class="flex space-x-4 mb-12">
        <NuxtLink
          to="/categories/manage"
          class="bg-purple-600 text-white py-2 px-4 rounded-md shadow hover:bg-purple-900 transition duration-300"
        >
          Manage Categories
        </NuxtLink>

        <NuxtLink
          to="/products/manage"
          class="bg-slate-700 text-white py-2 px-4 rounded-md shadow hover:bg-slate-900 transition duration-300"
        >
          Manage Products
        </NuxtLink>
      </nav>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <!-- Existing grid content -->
        <NuxtLink
          to="/categories"
          class="border-2 border-purple-400 bg-white p-6 rounded-lg shadow"
        >
          <h2 class="text-xl font-semibold text-gray-700">Categories Overview</h2>
          <p class="text-gray-600 mt-2">Quick insights into your categories.</p>
        </NuxtLink>

        <div class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-xl font-semibold text-gray-700">Products Overview</h2>
          <p class="text-gray-600 mt-2">Manage your products effectively.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {},
};
</script>
