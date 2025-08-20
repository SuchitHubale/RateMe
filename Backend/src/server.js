const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/database');

// Import models so Sequelize knows about them
require('./models/User');
require('./models/Store');
require('./models/Rating');

const authRoutes = require('./routes/auth.routes');
const storeRoutes = require('./routes/stores.routes');
const user = require("./routes/user.route");
const rating = require("./routes/rating.route");

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_, res) => res.json({ ok: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/users', user);
app.use('/api/ratings', rating);

// Sync database before starting server
sequelize.sync({ alter: true })  // use { force: true } only in dev (drops & recreates tables)
  .then(() => {
    console.log("✅ Database synced successfully");
    const port = Number(process.env.PORT || 4000);
    app.listen(port, () => console.log(`🚀 API running on http://localhost:${port}`));
  })
  .catch(err => {
    console.error("❌ Failed to sync database:", err);
  });
