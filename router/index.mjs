import express from "express";
import sumRouter from "./sum.mjs";
import countRouter from "./count_sum.mjs";
import currenttimeRouter from "./current_time.mjs";
import historyRouter from "./history.mjs"
import { https_status } from "../modules/constants.mjs";

const router = express.Router();

router.use(sumRouter);
router.use(countRouter);
router.use(currenttimeRouter);
router.use(historyRouter);

router.use((req, res) => {
  res.status(https_status.notfound).json({ error: "Not found" });
});

export default router;