const express = require('express');
const app = express();
const PORT = 5001;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Test server is running!');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Test server running on http://localhost:${PORT}`);
});
