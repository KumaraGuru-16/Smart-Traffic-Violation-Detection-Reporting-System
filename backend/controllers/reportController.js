import Report from "../models/Report.js";
import { uploadBufferToCloudinary } from "../services/cloudinaryService.js";

export const createReport = async (req, res) => {
  try {
    console.log("\n==== NEW REPORT SUBMISSION ====");
    console.log("📨 req.body:", req.body);
    console.log("📁 req.file:", req.file ? `${req.file.originalname} (${req.file.size} bytes)` : "❌ MISSING");
    console.log("👤 req.user:", req.user);

    if (!req.file) {
      console.error("❌ No file received!");
      return res.status(400).json({ message: "Image is required" });
    }

    const { description, location } = req.body;
    console.log(`📝 description: "${description}", 📍 location: "${location}"`);

    // Upload the in-memory buffer directly to Cloudinary
    console.log(`\n📤 Uploading to Cloudinary...`);
    let cloudinaryUrl;
    try {
      cloudinaryUrl = await uploadBufferToCloudinary(
        req.file.buffer,
        req.file.mimetype
      );
      console.log(`✅ Cloudinary URL: ${cloudinaryUrl}`);
    } catch (cloudErr) {
      console.error("❌ Cloudinary upload FAILED:", cloudErr.message);
      return res.status(500).json({ message: "Cloudinary upload failed: " + cloudErr.message });
    }

    // Save report with the Cloudinary URL to MongoDB
    console.log(`\n💾 Saving to MongoDB...`);
    let report;
    try {
      report = await Report.create({
        user: req.user.id,
        image: cloudinaryUrl,
        description,
        location,
        status: "pending",
      });
      console.log(`✅ Report saved to MongoDB: ${report._id}`);
      console.log("📄 Saved data:", JSON.stringify(report, null, 2));
    } catch (dbErr) {
      console.error("❌ MongoDB save FAILED:", dbErr.message);
      return res.status(500).json({ message: "Database save failed: " + dbErr.message });
    }

    res.status(201).json({
      message: "Report uploaded successfully",
      report,
    });
  } catch (error) {
    console.error("❌ Unexpected error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    report.status = status;
    const updatedReport = await report.save();

    res.json({
      message: "Report status updated",
      report: updatedReport,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
