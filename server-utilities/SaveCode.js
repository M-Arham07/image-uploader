"use server";

import ConnectDB from "./ConnectDB";
import mongoose, { model } from "mongoose";
import image from './models/ImageURL';

export default async function SaveCode(uploads,code) {

    try {

        await ConnectDB();
        mongoose.set('debug', true);


        console.log(uploads) //upload array is like this: ['url1','url2','urlN']

        const expiry = new Date(Date.now() + 10 * 60 * 1000); // CALCULATE TIME 10 MIN from NOW

        const urls=uploads; // I'LL STORE THE WHOLE String ARRAY uploads as url

        // SAVE THE CODE ALONG WITH URL!
        await image.create({ imgURL: urls, code:code, expiresAt: expiry });

        return true;

    }

    catch (err) {
        console.error("Inserting Code and url failed! Logs:\n", err);
        throw new Error("Server Down! Please try again later")
    }

}