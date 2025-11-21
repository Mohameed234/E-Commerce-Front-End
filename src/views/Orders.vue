<template>
    <div class="orders-page">
      <Navbar />
  
      <div class="page-header">
        <h2>Orders Management</h2>
      </div>
  
      <!-- Loader -->
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        Loading orders...
      </div>
  
      <!-- Orders Table -->
      <table v-else class="orders-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Order Number</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>{{ order.id }}</td>
            <td>{{ order.order_number }}</td>
            <td>{{ order.address }}</td>
            <td>{{ order.phone }}</td>
            <td>{{ order.total }}</td>
            <td>
              <button @click="viewOrderDetails(order.id)" class="details-btn">View Details</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Order Details Modal -->
      <div v-if="showModal" class="modal-backdrop">
        <div class="modal">
          <h3>Order Details (#{{ orderDetails.id }})</h3>
          <p><strong>Address:</strong> {{ orderDetails.address }}</p>
          <p><strong>Phone:</strong> {{ orderDetails.phone }}</p>
          <p><strong>Total:</strong> {{ orderDetails.total }}</p>
  
          <h4>Products:</h4>
          <table class="details-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in orderDetails.items" :key="item.product.id">
                <td>{{ item.product.name }}</td>
                <td>{{ item.product.price }}</td>
                <td>{{ item.quantity }}</td>
                <td>{{ (item.product.price * item.quantity).toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
  
          <div class="modal-actions">
            <button @click="closeModal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import api from '../api/axios.js';
  import Navbar from '../components/Navbar.vue';
  
  export default {
    name: 'Orders',
    components: { Navbar },
    setup() {

        onMounted(() => {
        document.title = "My Orders - My App";
        });

      const orders = ref([]);
      const loading = ref(true);
  
      const showModal = ref(false);
      const orderDetails = ref({ id: null, address: '', phone: '', total: 0, items: [] });
  
      const fetchOrders = async () => {
        loading.value = true;
        try {
          const res = await api.get('/orders');
          orders.value = res.data;
        } catch (err) {
          console.error(err);
        } finally {
          loading.value = false;
        }
      };
  
      const viewOrderDetails = async (id) => {
        try {
          const res = await api.get(`/orders/${id}`);
          orderDetails.value = res.data;
          showModal.value = true;
        } catch (err) {
          console.error(err);
          alert('Failed to load order details');
        }
      };
  
      const closeModal = () => {
        showModal.value = false;
        orderDetails.value = { id: null, address: '', phone: '', total: 0, items: [] };
      };
  
      onMounted(fetchOrders);
  
      return { orders, loading, showModal, orderDetails, viewOrderDetails, closeModal };
    }
  };
  </script>
  
  <style scoped>
  .orders-page {
    padding: 2rem;
    background-color: #f5f7fa;
    min-height: 100vh;
  }
  
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  
  .page-header h2 {
    font-size: 1.8rem;
    color: #1f2937;
  }
  
  /* Table */
  .orders-table, .details-table {
    width: 100%;
    border-collapse: collapse;
    background-color: #fff;
    box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    margin-bottom: 1rem;
  }
  
  .orders-table th, .orders-table td,
  .details-table th, .details-table td {
    padding: 0.75rem 1rem;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .orders-table th, .details-table th {
    background-color: #f3f4f6;
    color: #4b5563;
  }
  
  /* Loader */
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
    width: 36px;
    height: 36px;
    animation: spin 1s linear infinite;
    margin-bottom: 0.5rem;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  /* Buttons */
  .details-btn {
    background-color: #10b981;
    color: #fff;
    border: none;
    padding: 0.3rem 0.6rem;
    border-radius: 6px;
    cursor: pointer;
  }
  .details-btn:hover { background-color: #059669; }
  
  /* Modal */
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  .modal {
    background-color: #fff;
    padding: 2rem;
    border-radius: 12px;
    width: 500px;
    max-width: 90%;
  }
  .modal h3 {
    margin-bottom: 1rem;
    color: #1f2937;
  }
  .modal-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 1rem;
  }
  .modal-actions button {
    padding: 0.5rem 1rem;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    background-color: #2575fc;
    color: #fff;
  }
  .modal-actions button:hover {
    background-color: #1c5bd9;
  }
  </style>
  