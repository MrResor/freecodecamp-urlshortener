import express from "express";
import { db } from "../../../db.js";

const get_url = express.Router();

get_url.get("/api/shorturl/:id", async (req, res) => {
    
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(401).json({ error: "Invalid ID" });
    }

    let result = await db.get_url(null, id);

    if (result) {
        res.status(301).redirect(result.url);
    } else {
        res.status(404).json({ error: "No url found for the given ID" });
    }
});

export { get_url };