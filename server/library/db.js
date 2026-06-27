import mongoose from "mongoose";

// Connect to MongoDB
export const connectDB = async () => {
  try {
    // Set up event listeners for connection events
    mongoose.connection.on("connected", () => {
      console.log("Database connected successfully");
    });
    mongoose.connection.on("error", (err) => {
      console.error("Database connection error:", err);
    });
    mongoose.connection.on("disconnected", () => {
      console.log("Database disconnected");
    });

    // Connect to the database
    await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`);
    console.log("Connection established to chat-app database");

  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1); // Exit the process with failure code
  }
};
