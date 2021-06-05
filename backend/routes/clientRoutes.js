import express from "express";
const router = express.Router();
import {
  deleteClient,
  getClientById,
  updateClient,
} from "../controllers/clientController.js";

router.route("/:id").put(updateClient).delete(deleteClient).get(getClientById);

export default router;
