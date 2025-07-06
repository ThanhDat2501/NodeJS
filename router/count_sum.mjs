import express from "express";
import { handleCountRequest } from "../modules/requestHandler.mjs";
import { endpoint } from "../modules/constants.mjs";

const router = express.Router();
router.get(endpoint.countSumUrl, handleCountRequest);

export default router;