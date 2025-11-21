<template>
    <div class="profile-page">
      <Navbar />
  
      <div class="page-header">
        <h2>My Profile</h2>
      </div>
  
      <!-- Loader -->
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        Loading profile...
      </div>
  
      <!-- Profile Card -->
      <div v-else class="profile-card">
        <h3>{{ user.name }}</h3>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Created At:</strong> {{ formatDate(user.created_at) }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import api from '../api/axios.js';
  import Navbar from '../components/Navbar.vue';
  
  export default {
    name: 'Profile',
    components: { Navbar },
    setup() {

        onMounted(() => {
        document.title = "My Profile - My App";
        });

      const user = ref({});
      const loading = ref(true);
  
      const fetchProfile = async () => {
        loading.value = true;
        try {
          const res = await api.get('/me');
          user.value = res.data;
        } catch (err) {
          console.error(err);
          alert('Failed to fetch profile');
        } finally {
          loading.value = false;
        }
      };
  
      const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
      };
  
      onMounted(fetchProfile);
  
      return { user, loading, formatDate };
    }
  };
  </script>
  
  <style scoped>
  .profile-page {
    padding: 2rem;
    min-height: 100vh;
    background-color: #f5f7fa;
  }
  
  .page-header {
    margin-bottom: 2rem;
  }
  
  .page-header h2 {
    font-size: 1.8rem;
    color: #1f2937;
    text-align: center;
  }
  
  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
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
  
  /* Profile Card */
  .profile-card {
    max-width: 400px;
    margin: 0 auto;
    background-color: #fff;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    text-align: center;
  }
  
  .profile-card h3 {
    font-size: 1.5rem;
    color: #1f2937;
    margin-bottom: 1rem;
  }
  
  .profile-card p {
    font-size: 1rem;
    color: #4b5563;
    margin-bottom: 0.5rem;
  }
  </style>
  