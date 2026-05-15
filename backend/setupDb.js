require('dotenv').config();

const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const DB_NAME = process.env.DB_NAME || 'pengu1n';

async function createCollections() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db(DB_NAME);

    const collections = await db.listCollections().toArray();
    const names = collections.map((c) => c.name);

    if (!names.includes('userDetails')) {
      await db.createCollection('userDetails');
      console.log('Created collection: userDetails');
    } else {
      console.log('Collection already exists: userDetails');
    }

    if (!names.includes('courseDetails')) {
      await db.createCollection('courseDetails');
      console.log('Created collection: courseDetails');
    } else {
      console.log('Collection already exists: courseDetails');
    }

    console.log(`Database ready: ${DB_NAME} on ${MONGODB_URI}`);
    console.log('Open MongoDB Compass and connect to the same URI to view data.');
  } finally {
    await client.close();
  }
}

createCollections().catch((error) => {
  console.error('Database setup failed:', error.message);
  process.exit(1);
});
