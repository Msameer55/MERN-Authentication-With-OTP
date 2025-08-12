import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const response = await mongoose.connect(process.env.MONGO);
        console.log( "MongoDb Connected Successfully" ,response.connection.host)
    } catch (error) {
        console.log("Error Connecting to Database");
        process.exit(1);
    }
}

export default connectDB;