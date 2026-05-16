require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const DB_NAME = process.env.DB_NAME || 'pengu1n';
const COLLECTION_NAME = process.env.COLLECTION_NAME || 'userDetails';

app.set('trust proxy', 1);
app.use(cors());
app.use(express.json());

let db;
let usersCollection;

async function connectDatabase() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  db = client.db(DB_NAME);
  usersCollection = db.collection(COLLECTION_NAME);

  try {
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    await usersCollection.createIndex({ username: 1 }, { unique: true, sparse: true });
  } catch (idxErr) {
    console.warn('MongoDB index warning (resolve duplicates if needed):', idxErr.message);
  }

  console.log(`MongoDB connected: ${MONGODB_URI} / ${DB_NAME}`);
  return client;
}

app.get('/', (req, res) => {
  res.json({ success: true, message: 'PENGU1N API running' });
});

app.get('/health', async (req, res) => {
  try {
    await db.command({ ping: 1 });
    const count = await usersCollection.countDocuments();
    res.json({
      success: true,
      message: 'MongoDB connected',
      apiVersion: 2,
      database: DB_NAME,
      collection: COLLECTION_NAME,
      users: count,
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'MongoDB not connected',
      error: error.message,
    });
  }
});

async function startServer() {
  try {
    await connectDatabase();

    // Mount after DB is ready so controllers receive the real collection (not undefined).
    const auth = authRoutes(usersCollection);
    app.use(auth);
    app.use('/api', auth);

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log('Auth routes: /signup, /login, … (also under /api/*)');
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    console.error('Make sure MongoDB is running (MongoDB Compass / mongod on port 27017).');
    process.exit(1);
  }
}

startServer();
