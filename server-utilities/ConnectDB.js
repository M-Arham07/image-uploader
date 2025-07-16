
import mongoose from 'mongoose';

export default async function ConnectDB(){
    
    try{
        await mongoose.connect(process.env.DB_URI);
        console.log("Connected to database successfully!")
    }

    catch(err){
        console.error("Failed Connecting to database! Logs:\n",err);
        throw err;
    }
}