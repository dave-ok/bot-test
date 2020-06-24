// handle CRC checks
import express from "express";
import { validateWebhook, validateSignature } from "twitter-autohook";

require("dotenv").config();

const url = require("url");
const webhookRouter = express.Router();
const auth = require("config").get("auth");

webhookRouter.get("/webhook", (req, res) => {
  if (req.query.crc_token) {
    try {
      if (!validateSignature(req.headers, auth, url.parse(req.url).query)) {
        console.error("Cannot validate webhook signature");
        return;
      }
    } catch (e) {
      console.error(e);
    }

    const crc = validateWebhook(req.query.crc_token, auth, res);
    res.status(200).json(crc);
  }

  res.end();
});

webhookRouter.post("/webhook", (req, res) => {
  try {
    if (!validateSignature(req.headers, auth, req.body)) {
      console.error("Cannot validate webhook signature");
      return;
    }
  } catch (e) {
    console.error(e);
  }

  console.log("Event received:", req.body);
  res.status(200).end();
});

export default webhookRouter;
