import express from "express";
const router = express.Router();
import {
  registerClient,
  getClients,
  getKeywordClients
} from "../controllers/clientController.js";

router.route("/").post(registerClient).get(getClients);

router.route("/find").get(getKeywordClients);

export default router;
