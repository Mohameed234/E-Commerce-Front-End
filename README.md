# Frontend - Vue.js E-Commerce 

This project is the **frontend** of an e-commerce admin panel built with **Vue 3**, **Vuex**, and **Vue Router**.  
It connects to a backend API for managing users, products, orders, and the shopping cart.

---


## ⚡ Key Features

- User registration and login with **JWT authentication**.
- Dashboard showing product and order statistics.
- Products and orders management pages.
- Order details displayed in a modal.
- Shopping cart with quantity update and product removal.
- User profile page.
- Route protection using Vue Router and Vuex.
- Token and user saved in **localStorage** to persist sessions after page reload.

---

## 🚀 Installation & Running

1. Install dependencies:
```bash
npm install
```

2. Run the project :
```bash
npm run build
```


## API Connection
- All API requests are made through src/api/axios.js.

- Set the correct backend base URL:

```bash
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api', // change according to your backend
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
```

