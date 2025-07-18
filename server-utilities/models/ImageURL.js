import mongoose from "mongoose";
import { object } from "zod";

const Schema=mongoose.Schema;

const imgSchema=new Schema({
    imgURL:{
        type:[String], //An array of strings
        required:true
    },
    code:{
        type:String,
        required:true,
        unique:true // there is very minimal chance that code can be same so i used unique true
    },
    expiresAt:{
        type:Date,
        required:true
    }
},{collection:"images",timestamps:true});

export default mongoose.models.image || mongoose.model("image",imgSchema);