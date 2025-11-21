<template>
  <div class="register-page">
    <div class="login-container">

      <h2>Register</h2>

      <!-- Error Message Box -->
      <div v-if="errorMessage" class="error-box">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="register">
        <div class="form-group">
          <label>Name</label>
          <input type="text" v-model="name" placeholder="Enter your name" required />
        </div>

        <div class="form-group">
          <label>Email</label>
          <input type="email" v-model="email" placeholder="Enter your email" required />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input type="password" v-model="password" placeholder="Enter your password" required />
        </div>

        <button type="submit">Register</button>
      </form>

      <p class="register-link">
        Already have an account? <router-link to="/login">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import api from '../api/axios.js';
import { useRouter } from 'vue-router';

export default {
  name: 'Register',
  setup() {
    const router = useRouter();
    const name = ref('');
    const email = ref('');
    const password = ref('');
    const errorMessage = ref('');

    const register = async () => {
      errorMessage.value = ''; // Clear previous errors

      try {
        const res = await api.post('/register', {
          name: name.value,
          email: email.value,
          password: password.value
        });

        localStorage.setItem('token', res.data.token);
        router.push('/dashboard');

      } catch (err) {
        if (err.response?.data?.message) {
          errorMessage.value = err.response.data.message;
        } else {
          errorMessage.value = 'Registration failed! Please try again.';
        }
      }
    };

    return { name, email, password, register, errorMessage };
  }
};
</script>

<style scoped>
.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.login-container {
  background-color: #fff;
  padding: 2.5rem 3rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.login-container h2 {
  margin-bottom: 1.5rem;
  color: #333;
  font-size: 1.8rem;
}

/* Error Box */
.error-box {
  background-color: #ffdddd;
  color: #b30000;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 15px;
  border-left: 4px solid #ff4d4d;
  text-align: left;
  font-size: 0.95rem;
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Form Fields */
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

/* Button */
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

/* Login Link */
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
