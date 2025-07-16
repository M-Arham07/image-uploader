"use server";

import ConnectDB from "./ConnectDB";
import mongoose, { model } from "mongoose";
import image from './models/ImageURL';

export default async function SaveCode(url,code) {

    try {
        await ConnectDB();

        const expiry = new Date(Date.now() + 10 * 60 * 1000); // CALCULATE TIME 10 MIN from NOW

        // SAVE THE CODE ALONG WITH URL!
        await image.create({ imgURL: url, code:code, expiresAt: expiry });

        return true;

    }

    catch (err) {
        console.error("Inserting Code and url failed! Logs:\n", err);
        throw new Error("Server Down! Please try again later")
    }

}