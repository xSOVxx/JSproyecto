const fs = require("fs");
const path = require("path");
const multer = require("multer");
const cors = require("cors");

// Configuración de multer para almacenar imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({ storage: storage });

module.exports = (req, res, next) => {
  // Habilitar CORS para todas las rutas
  cors()(req, res, (err) => {
    if (err) {
      return next(err);
    }

    // Ruta para subir imágenes
    if (req.url === "/api/upload" && req.method === "POST") {
      return upload.single("imagen")(req, res, (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        if (!req.file) {
          return res
            .status(400)
            .json({ error: "No se proporcionó ninguna imagen" });
        }

        // Devolver la URL de la imagen
        const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;
        return res.status(201).json({ url: imageUrl });
      });
    }

    // Middleware para servir archivos de la carpeta uploads
    if (req.url.startsWith("/uploads/") && req.method === "GET") {
      const filePath = path.join(__dirname, req.url);
      if (fs.existsSync(filePath)) {
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
        return;
      }
    }

    next();
  });
};
