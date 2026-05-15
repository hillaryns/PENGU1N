require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const DB_NAME = process.env.DB_NAME || 'pengu1n';
const COLLECTION_NAME = process.env.COLLECTION_NAME || 'userDetails';

app.use(cors());
app.use(express.json());

let db;
let usersCollection;

async function connectDatabase() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  db = client.db(DB_NAME);
  usersCollection = db.collection(COLLECTION_NAME);
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

app.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields required' });
    }

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      name,
      email,
      password: hashedPassword,
      progress: {
        notesRead: 0,
        questionsAnswered: 0,
        testsTaken: 0,
        badges: [],
      },
      createdAt: new Date(),
    };

    await usersCollection.insertOne(newUser);

    res.status(201).json({
      success: true,
      message: 'Signup successful',
      user: { name, email },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ success: false, message: 'Wrong password' });
    }

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        name: user.name,
        email: user.email,
        progress: user.progress || {
          notesRead: 0,
          questionsAnswered: 0,
          testsTaken: 0,
          badges: [],
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

async function startServer() {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    console.error('Make sure MongoDB is running (MongoDB Compass / mongod on port 27017).');
    process.exit(1);
  }
}

startServer();
