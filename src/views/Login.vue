<template>
    <div class="login-page">
      <div class="login-container">
        <h2>Login</h2>
        <form @submit.prevent="login">
          <div class="form-group">
            <label>Email</label>
            <input type="email" v-model="email" placeholder="Enter your email" required />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" v-model="password" placeholder="Enter your password" required />
          </div>
          <button type="submit">Login</button>
        </form>
        <p class="register-link">
          Don't have an account? <router-link to="/register">Register</router-link>
        </p>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import api from '../api/axios.js';
  import store from '../store';
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'Login',
    setup() {
      const router = useRouter();
      const email = ref('');
      const password = ref('');
  
      const login = async () => {
        try {
          const res = await api.post('/login', { email: email.value, password: password.value });
          store.commit('setToken', res.data.token);
          router.push('/');
        } catch (err) {
          alert('Login failed!');
          console.error(err);
        }
      };
  
      return { email, password, login };
    }
  };
  </script>
  
  <style scoped>
  /* الخلفية والصفحة */
  .login-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  
  /* الصندوق الرئيسي */
  .login-container {
    background-color: #fff;
    padding: 2.5rem 3rem;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    width: 100%;
    max-width: 400px;
    text-align: center;
  }
  
  /* العنوان */
  .login-container h2 {
    margin-bottom: 1.5rem;
    color: #333;
    font-size: 1.8rem;
  }
  
  /* حقول الفورم */
  .form-group {
    margin-bottom: 1rem;
    text-align: left;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 0.4rem;
    font-weight: 600;
    color: #555;
  }
  
  .form-group input {
    width: 100%;
    padding: 0.6rem 0.8rem;
    border-radius: 8px;
    border: 1px solid #ccc;
    outline: none;
    transition: all 0.2s ease;
  }
  
  .form-group input:focus {
    border-color: #2575fc;
    box-shadow: 0 0 0 3px rgba(37, 117, 252, 0.2);
  }
  
  /* زر الدخول */
  button {
    width: 100%;
    padding: 0.7rem;
    background-color: #2575fc;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  button:hover {
    background-color: #1a5fd1;
  }
  
  /* رابط التسجيل */
  .register-link {
    margin-top: 1rem;
    font-size: 0.9rem;
  }
  
  .register-link a {
    color: #2575fc;
    text-decoration: none;
    font-weight: 600;
  }
  
  .register-link a:hover {
    text-decoration: underline;
  }
  </style>
  