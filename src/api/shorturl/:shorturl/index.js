import express from "express";
import { db } from "../../../db.js";
import { get } from "http";

const get_url = express.Router();

get_url.get("/api/shorturl/:id", async (req, res) => {
    
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid URL ID" });
    }

    let result = await db.get_url(null, id);

    if (result) {
        res.status(301).redirect(result.url);
    } else {
        res.status(404).json({ error: "No short URL found for the given input" });
    }
});

export { get_url };