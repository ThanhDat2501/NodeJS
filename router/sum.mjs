import express from "express";
import { handleSumRequest } from "../modules/requestHandler.mjs";
import { endpoint } from "../modules/constants.mjs";

const router = express.Router();

router.post(endpoint.sumUrl, handleSumRequest);

export default router;