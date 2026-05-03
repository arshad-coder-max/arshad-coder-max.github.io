const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const DB_PATH = path.join(__dirname, 'palettes.json');

app.use(cors());
app.use(express.json());

// Initialize palettes.json if it doesn't exist
async function initDB() {
  try {
    await fs.access(DB_PATH);
  } catch (error) {
    await fs.writeFile(DB_PATH, JSON.stringify([]));
  }
}

initDB();

app.get('/api/palettes', async (req, res) => {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Failed to read palettes' });
  }
});

app.post('/api/palettes', async (req, res) => {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    const palettes = JSON.parse(data);
    
    // palette should be an array of colors or an object with id, colors array
    const newPalette = {
      id: Date.now().toString(),
      colors: req.body.colors,
      createdAt: new Date().toISOString()
    };
    
    palettes.push(newPalette);
    await fs.writeFile(DB_PATH, JSON.stringify(palettes, null, 2));
    
    res.status(201).json(newPalette);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save palette' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
