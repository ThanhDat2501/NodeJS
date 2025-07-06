import express from "express";
import { handleTimeRequest } from "../modules/requestHandler.mjs";
import { endpoint } from "../modules/constants.mjs";

const router = express.Router();

router.get(endpoint.currentTimeUrl, handleTimeRequest);

export default router;