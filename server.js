const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Enable CORS (to allow frontend to communicate with backend)
app.use(cors());

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

// Serve frontend (HTML, CSS, JS)
app.use(express.static("public"));

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Handle file uploads
app.post("/upload", upload.single("file"), (req, res) => {
  res.json({ success: true, filename: req.file.filename });
});

// Get uploaded files
app.get("/files", (req, res) => {
  fs.readdir("uploads", (err, files) => {
    if (err) return res.status(500).json({ error: "Unable to read files" });
    res.json(files);
  });
});

// Serve index.html when visiting "/"
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
