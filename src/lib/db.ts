import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

let connectPromise: Promise<typeof mongoose> | null = null;

export async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (connectPromise) {
    return connectPromise;
  }

  connectPromise = mongoose
    .connect(MONGODB_URI!, {
      dbName: "ecomarsStor",
      bufferCommands: false,
    })
    .then(() => {
      connectPromise = null;
      return mongoose;
    });

  return connectPromise;
}
