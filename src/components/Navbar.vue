<template>
    <nav class="navbar">
      <div class="logo">E-Commerce</div>
      <ul class="nav-links">
        <li><router-link to="/dashboard">Dashboard</router-link></li>
        <li><router-link to="/products">Products</router-link></li>
        <li><router-link to="/orders">Orders</router-link></li>
        <li><router-link to="/cart">Cart</router-link></li>
        <li><router-link to="/profile">Profile</router-link></li>
        <li><button @click="logout" class="logout-btn">Logout</button></li>
      </ul>
    </nav>
  </template>
  
  <script>
  import store from '../store';
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'Navbar',
    setup() {
      const router = useRouter();
  
      const logout = () => {
        store.commit('clearToken');
        router.push('/login');
      };
  
      return { logout };
    }
  };
  </script>
  
  <style scoped>
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: #2575fc;
    color: #fff;
  }
  
  .nav-links {
    display: flex;
    gap: 1rem;
    list-style: none;
    align-items: center;
  }
  
  .nav-links li a {
    color: #fff;
    text-decoration: none;
    font-weight: 500;
  }
  
  .nav-links li a:hover {
    text-decoration: underline;
  }
  
  .logout-btn {
    background-color: #ff4d4f;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    color: #fff;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;
  }
  
  .logout-btn:hover {
    background-color: #d9363e;
  }
  
  .logo {
    font-weight: bold;
    font-size: 1.2rem;
  }
  </style>
  