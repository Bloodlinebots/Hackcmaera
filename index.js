const express = require('express');
const app = express();
const path = require('path');
const ejs = require('ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Dummy data
const dummyData = {
  uid: 'abc123456',
  url: 'https://example.com',
  ip: '123.123.123.123',
  time: new Date().toLocaleTimeString(),
  t: false,
  a: 'https://example.com/api'
};

// Render from current directory (no views folder needed)
app.get('/webview', (req, res) => {
  ejs.renderFile(path.join(__dirname, 'webview.ejs'), dummyData, {}, (err, str) => {
    if (err) return res.status(500).send(err.toString());
    res.send(str);
  });
});

app.get('/cloudflare', (req, res) => {
  ejs.renderFile(path.join(__dirname, 'cloudflare.ejs'), dummyData, {}, (err, str) => {
    if (err) return res.status(500).send(err.toString());
    res.send(str);
  });
});

app.get('/', (req, res) => {
  res.send('✅ Heroku app is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
