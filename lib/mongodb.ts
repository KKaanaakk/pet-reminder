import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

if (!MONGODB_DB) {
  throw new Error('Please define the MONGODB_DB environment variable inside .env.local');
}

interface CachedConnection {
  client: MongoClient;
  db: Db;
  lastUsed: number;
}

let cached: CachedConnection | null = null;

// Connection timeout in milliseconds (4 minutes)
const CONNECTION_TIMEOUT = 4 * 60 * 1000;

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  // Check if we have a cached connection and it's still valid
  if (cached && Date.now() - cached.lastUsed < CONNECTION_TIMEOUT) {
    try {
      // Test the connection
      await cached.db.command({ ping: 1 });
      cached.lastUsed = Date.now();
      return cached;
    } catch (_) {
      console.log('Cached connection failed, creating new connection');
      // Connection failed, will create new below
      if (cached.client) {
        await cached.client.close().catch(console.error);
      }
      cached = null;
    }
  }

  if (!cached) {
    const client = new MongoClient(MONGODB_URI!, {
      // Add connection options for better reliability
      connectTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000,  // 45 seconds
      serverSelectionTimeoutMS: 10000, // 10 seconds
      maxPoolSize: 10,
      minPoolSize: 0,
      maxIdleTimeMS: CONNECTION_TIMEOUT,
      ssl: true,
      tls: true,
      tlsAllowInvalidCertificates: false,
      tlsAllowInvalidHostnames: false,
      // Force TLS version to 1.2 or higher
      tlsCAFile: undefined, // Let MongoDB driver handle CA certificates
      // Additional SSL/TLS options
      retryWrites: true,
      directConnection: false,
    });

    try {
      await client.connect();
      const db = client.db(MONGODB_DB);
      
      cached = {
        client,
        db,
        lastUsed: Date.now(),
      };
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw error;
    }
  }

  return cached;
} 