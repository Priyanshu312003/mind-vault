import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log("database connected");
    }
    catch (error) {
        console.error("database connection failed",error);
        process.exit(1);
    }
};

export default connectDB;