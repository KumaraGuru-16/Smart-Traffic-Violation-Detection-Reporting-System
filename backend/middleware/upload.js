import multer from "multer";

// Use memory storage — no disk writes, we stream directly to Cloudinary
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only images allowed"), false);
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

export default upload;
