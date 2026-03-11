import mongoose from "mongoose";

const dbConn = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected Successfully...`);

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });
  } catch (err) {
    console.error("MongoDB connection failed:");
    console.error(err.message);
    process.exit(1);
  }
};

export default dbConn;