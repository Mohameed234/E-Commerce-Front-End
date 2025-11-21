<template>
  <div class="dashboard-page">
    <Navbar />

    <div class="dashboard-header">
      <h2>Dashboard</h2>
      <p>Welcome to your admin panel</p>
    </div>

    <!-- Loader -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      Loading dashboard stats...
    </div>

    <!-- Stats -->
    <div v-else class="stats-container">
      <StatsCard title="Total Products" :count="totalProducts" />
      <StatsCard title="Total Orders" :count="totalOrders" />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import api from "../api/axios.js";
import StatsCard from "../components/StatsCard.vue";
import Navbar from "../components/Navbar.vue";

export default {
  name: "Dashboard",
  components: { StatsCard, Navbar },

  setup() {
    onMounted(() => {
      document.title = "Dashboard - My App";
    });

    const totalProducts = ref(0);
    const totalOrders = ref(0);
    const loading = ref(true);

    const fetchStats = async () => {
      loading.value = true;
      try {
        const products = await api.get("/products");
        const orders = await api.get("/orders");
        totalProducts.value = products.data.length;
        totalOrders.value = orders.data.length;
      } catch (err) {
        console.error(err);
      } finally {
        loading.value = false;
      }
    };

    onMounted(fetchStats);

    return { totalProducts, totalOrders, loading };
  },
};
</script>

<style scoped>
.dashboard-page {
  padding: 2rem;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.dashboard-header {
  margin: 2rem 0;
  text-align: center;
}

.dashboard-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
}

.dashboard-header p {
  font-size: 1rem;
  color: #4b5563;
  margin-top: 0.5rem;
}

/* Loader Same As Products Page */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #4b5563;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #2575fc;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 0.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}
</style>
