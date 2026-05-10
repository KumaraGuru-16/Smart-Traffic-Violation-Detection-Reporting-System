import express from "express";
import {
  createReport,
  getAllReports,
  getMyReports,
  updateReportStatus,
} from "../controllers/reportController.js";
import protect from "../middleware/authMiddleware.js";
import isAdmin from "../middleware/adminMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// user routes
router.post("/", protect, upload.single("image"), createReport);
router.get("/my", protect, getMyReports);

// admin routes
router.get("/", protect, isAdmin, getAllReports);
router.put("/:id", protect, isAdmin, updateReportStatus);

export default router;
