const express = require('express');
const axios = require('axios');
const client = require('./client'); // Redis client

const app = express();
const PORT = 3000;

// Route to fetch and cache data
app.get('/todos', async (req, res) => {
  const cacheKey = 'todos';

  try {
    // Check if data is in cache
    const cachedData = await client.get(cacheKey);

    if (cachedData) {
      console.log('Serving from cache');
      return res.json(JSON.parse(cachedData));
    }

    // If not in cache, fetch from API
    console.log('Fetching from API');
    const { data } = await axios.get('https://jsonplaceholder.typicode.com/todos');

    // Store data in cache for 2 minutes
    await client.set(cacheKey, JSON.stringify(data), 'EX', 120);

    return res.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
