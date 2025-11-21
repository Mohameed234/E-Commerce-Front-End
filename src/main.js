// main.js
import { createApp } from 'vue';        // لازم يكون من 'vue'
import App from './App.vue';
import router from './router';
import store from './store';           // لو عندك Vuex

const app = createApp(App);           // createApp مش createApp() بدون import

app.use(router);                      // لازم تضيف router
app.use(store);                       // Vuex اختياري
app.mount('#app');                    // mount على #app في index.html
