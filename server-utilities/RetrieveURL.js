"use server";

import ConnectDB from "./ConnectDB";
import mongoose from "mongoose";
import image from './models/ImageURL';

export default async function RetrieveURL(code){
    try{
        
        await ConnectDB();
        console.log(code)
        const found= await image.findOne({code:code});

        if(!found){
            throw new Error("Invalid or expired sharing code!");
        }

        // if code exists , take url from that document and return it!

        // return the whole imgURL String array
        return found.imgURL;


    }
    catch(err){
        console.error(err)
        if(err?.message.includes("Invalid or expired sharing code!")){
            throw err;
        }
        else{
            throw new Error("Server Down! Please try again later.")
        }

    }
    
}