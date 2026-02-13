import mongoose from 'mongoose';

export async function connectDb() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) throw new Error('MONGO_URI missing');
  await mongoose.connect(mongoUri);
}
