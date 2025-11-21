<template>
    <div class="stats-card">
      <h3>{{ title }}</h3>
      <p>{{ count }}</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'StatsCard',
    props: {
      title: String,
      count: Number
    }
  };
  </script>
  
  <style scoped>
  .stats-card {
    background-color: #fff;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    text-align: center;
    transition: transform 0.2s;
  }
  .stats-card:hover {
    transform: translateY(-5px);
  }
  .stats-card h3 {
    font-size: 1.2rem;
    color: #4b5563;
    margin-bottom: 0.5rem;
  }
  .stats-card p {
    font-size: 2rem;
    font-weight: 700;
    color: #1f2937;
  }
  </style>
  