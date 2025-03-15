const express = require("express");
const { upload } = require("../middlewares/upload.js");
const {
  createManhua,
  addChapter,
  updateManhua,
  deleteManhua,
  deleteChapter,
  getManhuaDetails,
  getChapter,
  getAllManhuas,
  updateManhuaStatus,
  searchManhuas,
  getRecentManhuas,
  getPopularManhuas,
  updateChapter
} = require("../controllers/manhuaController.js");

const router = express.Router();

// CRUD Manhua
router.post("/", upload.single("coverImage"), createManhua); // Crear un nuevo Manhua
router.put("/:manhuaId", upload.single("coverImage"), updateManhua); // Actualizar Manhua
router.delete("/:manhuaId", deleteManhua); // Eliminar Manhua
router.get("/:manhuaId", getManhuaDetails); // Obtener detalles de un Manhua

// Capítulos
router.post("/:manhuaId/chapters", upload.array("images"), addChapter); // Agregar capítulo
router.put("/:manhuaId/chapters/:chapterNumber", upload.array("images"), updateChapter); // Actualizar capítulo
router.delete("/:manhuaId/chapters/:chapterNumber", deleteChapter); // Eliminar capítulo
router.get("/:manhuaId/chapters/:chapterNumber", getChapter); // Obtener un capítulo específico

// Listados y búsqueda
router.get("/", getAllManhuas); // Obtener todos los Manhuas (paginación opcional)
router.get("/search", searchManhuas); // Buscar Manhuas por título, género o demografía
router.get("/recent", getRecentManhuas); // Obtener Manhuas recientes
router.get("/popular", getPopularManhuas); // Obtener Manhuas populares

// Actualizar estado del Manhua
router.patch("/:manhuaId/status", updateManhuaStatus);

module.exports = router;