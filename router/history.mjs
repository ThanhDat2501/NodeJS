import express from "express";
import { handleHistoryRequest } from "../modules/requestHandler.mjs";
import { endpoint } from "../modules/constants.mjs";

const router = express.Router();
router.get(endpoint.historyUrl, handleHistoryRequest);

export default router;