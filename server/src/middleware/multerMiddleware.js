import multer from "multer";

// memory storage (NO disk, production safe)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 200 * 1024 * 1024, // 200MB max (for videos)
  },
  fileFilter: (req, file, cb) => {
    // accept only videos
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only video files are allowed"), false);
    }
  },
});

export default upload;