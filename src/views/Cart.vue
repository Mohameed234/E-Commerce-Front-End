<template>
    <div class="cart-page">
      <Navbar />
  
      <h2>Shopping Cart</h2>
  
      <!-- Loader -->
      <div v-if="loading" class="loading">Loading cart...</div>
  
      <!-- Cart Table or Empty Message -->
      <template v-else>
        <table v-if="cart.length" class="cart-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in cart" :key="item.product.id">
              <td>{{ item.product.name }}</td>
              <td>{{ item.product.price }}</td>
              <td>
                <input type="number" v-model.number="item.quantity" @change="updateQuantity(item)" min="1"/>
              </td>
              <td>{{ (item.product.price * item.quantity).toFixed(2) }}</td>
              <td>
                <button @click="removeItem(item.product.id)" class="delete-btn">Remove</button>
              </td>
            </tr>
          </tbody>
        </table>
  
        <div v-else>
          <p>Your cart is empty.</p>
        </div>
      </template>
  
      <!-- Cart Footer -->
      <div v-if="cart.length" class="cart-footer">
        <p>Total: {{ total.toFixed(2) }}</p>
        <button @click="showCheckout = true" class="checkout-btn">Checkout</button>
      </div>
  
      <!-- Notification -->
      <div v-if="notification.show" :class="['notification', notification.type]">
        {{ notification.message }}
      </div>
  
      <!-- Checkout Modal -->
      <div v-if="showCheckout" class="modal-backdrop">
        <div class="modal">
          <h3>Checkout</h3>
          <form @submit.prevent="submitCheckout">
            <label for="address">Address</label>
            <input type="text" v-model="checkoutForm.address" id="address" placeholder="Enter your address" required />
  
            <label for="phone">Phone Number</label>
            <input type="text" v-model="checkoutForm.phone" id="phone" placeholder="Enter your phone number" required />
  
            <div class="modal-actions">
              <button type="submit" :disabled="loadingCheckout">
                <span v-if="loadingCheckout">Placing Order...</span>
                <span v-else>Place Order</span>
              </button>
              <button type="button" @click="closeCheckout">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Navbar from '../components/Navbar.vue';
  import api from '../api/axios.js';
  import { ref, computed, onMounted } from 'vue';
  
  export default {
    name: 'Cart',
    components: { Navbar },
    setup() {

        onMounted(() => {
        document.title = "My Cart - My App";
        });

      const cart = ref([]);
      const loading = ref(true);
  
      const showCheckout = ref(false);
      const loadingCheckout = ref(false);
      const checkoutForm = ref({ address: '', phone: '' });
  
      // Notification
      const notification = ref({ show: false, message: '', type: 'success' });
      const showNotification = (msg, type = 'success', duration = 3000) => {
        notification.value = { show: true, message: msg, type };
        setTimeout(() => notification.value.show = false, duration);
      };
  
      const fetchCart = async () => {
        loading.value = true;
        try {
          const res = await api.get('/cart');
          cart.value = res.data;
        } catch (err) {
          console.error(err);
          showNotification('Failed to load cart', 'error');
        } finally {
          loading.value = false;
        }
      };
  
      const updateQuantity = async (item) => {
        try {
          await api.put(`/cart/${item.product.id}`, { quantity: item.quantity });
        } catch (err) {
          console.error(err);
          showNotification('Failed to update quantity', 'error');
        }
      };
  
      const removeItem = async (productId) => {
        try {
          await api.delete(`/cart/${productId}`);
          cart.value = cart.value.filter(i => i.product.id !== productId);
          showNotification('Item removed from cart', 'success');
        } catch (err) {
          console.error(err);
          showNotification('Failed to remove item', 'error');
        }
      };
  
      const total = computed(() => {
        return cart.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      });
  
      const submitCheckout = async () => {
        if (!checkoutForm.value.address || !checkoutForm.value.phone) return;
  
        loadingCheckout.value = true;
        try {
          await api.post('/orders', { address: checkoutForm.value.address, phone: checkoutForm.value.phone });
          showNotification('Order placed successfully!', 'success');
          cart.value = [];
          closeCheckout();
        } catch (err) {
          console.error(err);
          showNotification('Checkout failed!', 'error');
        } finally {
          loadingCheckout.value = false;
        }
      };
  
      const closeCheckout = () => {
        showCheckout.value = false;
        checkoutForm.value = { address: '', phone: '' };
      };
  
      onMounted(fetchCart);
  
      return {
        cart,
        loading,
        total,
        updateQuantity,
        removeItem,
        showCheckout,
        checkoutForm,
        submitCheckout,
        closeCheckout,
        loadingCheckout,
        notification
      };
    }
  };
  </script>
  
  <style scoped>
  .cart-page { padding: 2rem; min-height: 100vh; background-color: #f5f7fa; }
  .cart-table { width: 100%; border-collapse: collapse; background: #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.1); margin-bottom: 1rem; }
  .cart-table th, .cart-table td { padding: 0.75rem 1rem; border-bottom: 1px solid #e5e7eb; }
  .cart-table th { background: #f3f4f6; color: #4b5563; text-align:left; }
  .delete-btn { background-color: #ef4444; color: #fff; border: none; padding: 0.3rem 0.6rem; border-radius: 6px; cursor: pointer; }
  .delete-btn:hover { background-color: #dc2626; }
  .cart-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; }
  .checkout-btn { background-color: #2575fc; color: #fff; border: none; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; }
  .checkout-btn:hover { background-color: #1c5bd9; }
  .loading { padding: 2rem; color: #4b5563; }
  
  /* Modal */
  .modal-backdrop { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
  .modal { background-color: #fff; padding: 2rem; border-radius: 12px; width: 400px; max-width: 90%; }
  .modal h3 { margin-bottom: 1rem; color: #1f2937; }
  .modal input { width: 100%; padding: 0.5rem; margin-bottom: 0.75rem; border-radius: 6px; border: 1px solid #d1d5db; }
  .modal-actions { display: flex; justify-content: flex-end; gap: 0.5rem; }
  .modal-actions button { padding: 0.5rem 1rem; border-radius: 8px; border: none; cursor: pointer; }
  .modal-actions button[type="submit"] { background-color: #2575fc; color: #fff; }
  .modal-actions button[type="button"] { background-color: #f3f4f6; color: #1f2937; }
  
  /* Notification */
  .notification {
    position: fixed;
    top: 80px;
    right: 20px;
    padding: 0.8rem 1.2rem;
    border-radius: 8px;
    color: #fff;
    font-weight: 500;
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    z-index: 2000;
    transition: all 0.3s ease;
  }
  .notification.success { background-color: #10b981; }
  .notification.error { background-color: #ef4444; }
  </style>
  