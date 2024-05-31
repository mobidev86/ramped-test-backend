import mongoose from 'mongoose';
const url: string = process.env.MONGO_URL ?? ''
const connectDB = async () => {
    try {
        await mongoose.connect(url, {});
        console.log('MongoDB connected');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

export default connectDB;

