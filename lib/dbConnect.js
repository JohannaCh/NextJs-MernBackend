import mongoose from 'mongoose';

const DB_CNN = process.env.DB_CNN

if (!DB_CNN) {
  throw new Error(
    'Defini la variable de entorno "DB_CNN" en .env'
  )
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect () {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(DB_CNN, opts).then(mongoose => {
        return mongoose;
    })
  }
  try {
    cached.conn = await cached.promise
    console.log('DB Conectada!');
  } catch (e) {
    cached.promise = null
    throw e
  }
  return cached.conn;
}

export default dbConnect;