import mongoose from 'mongoose';

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set('strictQuery', true);

  if(!String(process.env.MONGO_URI)) return console.log("MONGODB URI IS NOT DEFINED");

  if (isConnected) return ;
    try {
      const uri = String(process.env.MONGODB_URI);
      await mongoose.connect(uri);
      isConnected = true;  

    } catch (error:any) {
      console.log(error.message);
    }

  
  }
