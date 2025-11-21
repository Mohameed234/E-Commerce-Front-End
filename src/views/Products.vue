<template>
    <div class="products-page">
      <Navbar />
  
      <div class="page-header">
        <h2>Products Management</h2>
        <button @click="showAddProduct = true" class="add-btn">+ Add Product</button>
      </div>
  
      <!-- Loader كامل الصفحة -->
      <div v-if="loadingAll" class="loading">
        <div class="spinner"></div>
        Loading products...
      </div>
  
      <!-- Table -->
      <table v-else class="products-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id">
            <td>{{ product.id }}</td>
            <td>{{ product.name }}</td>
            <td>{{ product.description }}</td>
            <td>{{ product.price }}</td>
            <td>{{ product.quantity }}</td>
            <td>
              <button @click="editProduct(product)" class="edit-btn">Edit</button>
              <button @click="deleteProduct(product.id)" class="delete-btn">
                <span v-if="loadingDelete === product.id" class="spinner-small"></span>
                <span v-else>Delete</span>
              </button>
  
              <!-- Add to Cart / In Cart -->
              <button v-if="!isInCart(product.id)" @click="addToCart(product)" class="add-cart-btn">
                <span v-if="loadingCart === product.id" class="spinner-small"></span>
                <span v-else>Add to Cart</span>
              </button>
              <button v-else class="in-cart-btn" disabled>In Cart</button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Notification -->
      <div v-if="notification.show" :class="['notification', notification.type]">
        {{ notification.message }}
      </div>
  
      <!-- Add / Edit Modal -->
      <div v-if="showAddProduct" class="modal-backdrop">
        <div class="modal">
          <h3>{{ editingProduct ? 'Edit Product' : 'Add Product' }}</h3>
          <form @submit.prevent="saveProduct">
            <label>Name</label>
            <input type="text" v-model="form.name" placeholder="Name" required />
            <label>Description</label>
            <input type="text" v-model="form.description" placeholder="Description" />
            <label>Price</label>
            <input type="number" v-model.number="form.price" placeholder="Price" required />
            <label>Quantity</label>
            <input type="number" v-model.number="form.quantity" placeholder="Quantity" required />
            <div class="modal-actions">
              <button type="submit">
                <span v-if="loadingSave">Saving...</span>
                <span v-else>{{ editingProduct ? 'Update' : 'Add' }}</span>
              </button>
              <button type="button" @click="closeModal">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Navbar from '../components/Navbar.vue';
  import api from '../api/axios.js';
  import { ref, onMounted } from 'vue';
  
  export default {
    name: 'Products',
    components: { Navbar },
    setup() {

        onMounted(() => {
        document.title = "My Products - My App";
        });



      const products = ref([]);
      const cartItems = ref([]); 
      const loadingAll = ref(true); 
      const showAddProduct = ref(false);
      const editingProduct = ref(null);
      const form = ref({ name: '', description: '', price: 0, quantity: 0 });
  
      const loadingSave = ref(false);
      const loadingDelete = ref(null); 
      const loadingCart = ref(null); 
  
      // Notification
      const notification = ref({ show: false, message: '', type: 'success' });
      const showNotification = (msg, type = 'success', duration = 3000) => {
        notification.value = { show: true, message: msg, type };
        setTimeout(() => {
          notification.value.show = false;
        }, duration);
      };
  
      const fetchProducts = async () => {
        loadingAll.value = true;
        try {
          const res = await api.get('/products');
          products.value = res.data;
        } catch (err) {
          console.error(err);
          showNotification('Failed to load products', 'error');
        } finally {
          loadingAll.value = false;
        }
      };
  
      const fetchCart = async () => {
        try {
          const res = await api.get('/cart');
          cartItems.value = res.data.map(item => item.product.id);
        } catch (err) {
          console.error(err);
        }
      };
  
      const saveProduct = async () => {
        loadingSave.value = true;
        try {
          if (editingProduct.value) {
            const res = await api.put(`/products/${editingProduct.value.id}`, form.value);
            const index = products.value.findIndex(p => p.id === editingProduct.value.id);
            if (index !== -1) products.value[index] = res.data;
          } else {
            const res = await api.post('/products', form.value);
            products.value.push(res.data);
          }
          closeModal();
        } catch (err) {
          console.error(err);
          showNotification('Failed to save product', 'error');
        } finally {
          loadingSave.value = false;
        }
      };
  
      const editProduct = (product) => {
        editingProduct.value = product;
        form.value = { ...product };
        showAddProduct.value = true;
      };
  
      const deleteProduct = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        loadingDelete.value = id;
        try {
          await api.delete(`/products/${id}`);
          products.value = products.value.filter(p => p.id !== id);
          showNotification('Product deleted successfully', 'success');
        } catch (err) {
          console.error(err);
          showNotification('Failed to delete product', 'error');
        } finally {
          loadingDelete.value = null;
        }
      };
  
      const isInCart = (productId) => cartItems.value.includes(productId);
  
      const addToCart = async (product) => {
        loadingCart.value = product.id;
        try {
          await api.post('/cart', { product_id: product.id, quantity: 1 });
          cartItems.value.push(product.id);
          showNotification(`Product "${product.name}" added to cart!`, 'success');
        } catch (err) {
          console.error(err);
          showNotification('Failed to add product to cart', 'error');
        } finally {
          loadingCart.value = null;
        }
      };
  
      const closeModal = () => {
        showAddProduct.value = false;
        editingProduct.value = null;
        form.value = { name: '', description: '', price: 0, quantity: 0 };
      };
  
      onMounted(() => {
        fetchProducts();
        fetchCart();
      });
  
      return {
        products,
        cartItems,
        loadingAll,
        showAddProduct,
        editingProduct,
        form,
        saveProduct,
        editProduct,
        deleteProduct,
        closeModal,
        loadingSave,
        loadingDelete,
        loadingCart,
        addToCart,
        isInCart,
        notification
      };
    }
  };
  </script>
  
  <style scoped>
  .products-page { padding: 2rem; background-color: #f5f7fa; min-height: 100vh; }
  .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
  .page-header h2 { font-size: 1.8rem; color: #1f2937; }
  .add-btn { background-color: #2575fc; color: #fff; border: none; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; font-weight: 500; transition: all 0.2s ease; }
  .add-btn:hover { background-color: #1c5bd9; }
  .products-table { width: 100%; border-collapse: collapse; background-color: #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.1); }
  .products-table th, .products-table td { padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid #e5e7eb; }
  .products-table th { background-color: #f3f4f6; color: #4b5563; }
  .edit-btn { background-color: #f59e0b; color: #fff; border: none; padding: 0.3rem 0.6rem; border-radius: 6px; cursor: pointer; margin-right: 0.3rem; }
  .edit-btn:hover { background-color: #d97706; }
  .delete-btn { background-color: #ef4444; color: #fff; border: none; padding: 0.3rem 0.6rem; border-radius: 6px; cursor: pointer; }
  .delete-btn:hover { background-color: #dc2626; }
  .add-cart-btn { background-color: #10b981; color: #fff; border: none; padding: 0.3rem 0.6rem; border-radius: 6px; cursor: pointer; margin-left: 0.3rem; }
  .add-cart-btn:hover { background-color: #059669; }
  .in-cart-btn { background-color: #6b7280; color: #fff; border: none; padding: 0.3rem 0.6rem; border-radius: 6px; cursor: not-allowed; margin-left: 0.3rem; }
  
  /* Spinner styles */
  .spinner-small { border: 3px solid #f3f3f3; border-top: 3px solid #ef4444; border-radius: 50%; width: 18px; height: 18px; animation: spin 1s linear infinite; display: inline-block; margin-right: 5px; vertical-align: middle; }
  .loading { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; font-size: 1.2rem; color: #4b5563; }
  .spinner { border: 4px solid #f3f3f3; border-top: 4px solid #2575fc; border-radius: 50%; width: 36px; height: 36px; animation: spin 1s linear infinite; margin-bottom: 0.5rem; }
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  
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
  