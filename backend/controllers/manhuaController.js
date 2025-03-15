const Manhua = require("../models/Manhua.js");
const { upload } = require("../middlewares/upload.js");
const fs = require("fs");
const path = require("path");

// Subir un nuevo Manhua
const createManhua = async (req, res) => {
  try {
    const { title, alternativeTitle, description, genres, status, demographic } = req.body;
    const coverImage = req.file ? `/uploads/${req.file.filename}` : null;

    const newManhua = new Manhua({
      title,
      alternativeTitle,
      description,
      coverImage,
      genres: genres.split(","),
      status,
      demographic,
      chapters: []
    });

    await newManhua.save();
    res.status(201).json({ message: "Manhua creado con éxito", manhua: newManhua });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el manhua", error });
  }
};

// Agregar un capítulo a un Manhua existente
const addChapter = async (req, res) => {
  try {
    const { manhuaId } = req.params;
    const { number, title } = req.body;
    const images = req.files.map(file => `/uploads/${file.filename}`);

    const manhua = await Manhua.findById(manhuaId);
    if (!manhua) return res.status(404).json({ message: "Manhua no encontrado" });

    manhua.chapters.push({ number, title, images });
    await manhua.save();

    res.status(201).json({ message: "Capítulo agregado con éxito", manhua });
  } catch (error) {
    res.status(500).json({ message: "Error al agregar el capítulo", error });
  }
};

// Actualizar la descripción o portada de un Manhua
const updateManhua = async (req, res) => {
  try {
    const { manhuaId } = req.params;
    const { description } = req.body;
    const coverImage = req.file ? `/uploads/${req.file.filename}` : null;

    const updateData = {};
    if (description) updateData.description = description;
    if (coverImage) updateData.coverImage = coverImage;

    const updatedManhua = await Manhua.findByIdAndUpdate(manhuaId, updateData, { new: true });

    if (!updatedManhua) return res.status(404).json({ message: "Manhua no encontrado" });

    res.status(200).json({ message: "Manhua actualizado con éxito", updatedManhua });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el manhua", error });
  }
};

// Eliminar un Manhua completo
const deleteManhua = async (req, res) => {
  try {
    const { manhuaId } = req.params;
    const manhua = await Manhua.findByIdAndDelete(manhuaId);

    if (!manhua) return res.status(404).json({ message: "Manhua no encontrado" });

    res.status(200).json({ message: "Manhua eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el manhua", error });
  }
};

// Eliminar un capítulo específico
const deleteChapter = async (req, res) => {
  try {
    const { manhuaId, chapterNumber } = req.params;
    const manhua = await Manhua.findById(manhuaId);

    if (!manhua) return res.status(404).json({ message: "Manhua no encontrado" });

    manhua.chapters = manhua.chapters.filter(chap => chap.number != chapterNumber);
    await manhua.save();

    res.status(200).json({ message: "Capítulo eliminado con éxito", manhua });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el capítulo", error });
  }
};

// Ver la ficha de un Manhua y sus capítulos
const getManhuaDetails = async (req, res) => {
  try {
    const { manhuaId } = req.params;
    const manhua = await Manhua.findById(manhuaId);

    if (!manhua) return res.status(404).json({ message: "Manhua no encontrado" });

    res.status(200).json(manhua);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el manhua", error });
  }
};

// Leer un capítulo y obtener sus imágenes
const getChapter = async (req, res) => {
  try {
    const { manhuaId, chapterNumber } = req.params;
    const manhua = await Manhua.findById(manhuaId);

    if (!manhua) return res.status(404).json({ message: "Manhua no encontrado" });

    const chapter = manhua.chapters.find(chap => chap.number == chapterNumber);
    if (!chapter) return res.status(404).json({ message: "Capítulo no encontrado" });

    res.status(200).json(chapter);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el capítulo", error });
  }
};

// Listar todos los Manhuas con paginación opcional
const getAllManhuas = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const manhuas = await Manhua.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    res.status(200).json(manhuas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los manhuas", error });
  }
};

// Actualizar el estado del Manhua
const updateManhuaStatus = async (req, res) => {
  try {
    const { manhuaId } = req.params;
    const { status } = req.body;

    if (!["En emisión", "Finalizado", "Cancelado", "Pausado"].includes(status)) {
      return res.status(400).json({ message: "Estado inválido" });
    }

    const updatedManhua = await Manhua.findByIdAndUpdate(manhuaId, { status }, { new: true });

    if (!updatedManhua) return res.status(404).json({ message: "Manhua no encontrado" });

    res.status(200).json({ message: "Estado del Manhua actualizado con éxito", updatedManhua });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el estado del manhua", error });
  }
};

// Buscar manhuas por título, género o demografía
const searchManhuas = async (req, res) => {
  try {
    const { query } = req.query;
    const manhuas = await Manhua.find({
      $or: [
        { title: new RegExp(query, "i") },
        { alternativeTitle: new RegExp(query, "i") },
        { genres: new RegExp(query, "i") },
        { demographic: new RegExp(query, "i") }
      ]
    });

    res.status(200).json(manhuas);
  } catch (error) {
    res.status(500).json({ message: "Error en la búsqueda", error });
  }
};

// Obtener manhuas recientes
const getRecentManhuas = async (req, res) => {
  try {
    const manhuas = await Manhua.find().sort({ createdAt: -1 }).limit(10);
    res.status(200).json(manhuas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los manhuas recientes", error });
  }
};

const getPopularManhuas = async (req, res) => {
  try {
    const manhuas = await Manhua.find().sort({ chapters: -1 }).limit(10);
    res.status(200).json(manhuas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los manhuas populares", error });
  }
};

const updateChapter = async (req, res) => {
  try {
    const { manhuaId, chapterNumber } = req.params;
    const { title } = req.body;
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : null;

    const manhua = await Manhua.findById(manhuaId);
    if (!manhua) return res.status(404).json({ message: "Manhua no encontrado" });

    const chapterIndex = manhua.chapters.findIndex(chap => chap.number == chapterNumber);
    if (chapterIndex === -1) return res.status(404).json({ message: "Capítulo no encontrado" });

    if (title) manhua.chapters[chapterIndex].title = title;
    if (images) manhua.chapters[chapterIndex].images = images;

    await manhua.save();
    res.status(200).json({ message: "Capítulo actualizado con éxito", manhua });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el capítulo", error });
  }
};

// Exportar controladores
module.exports = {
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
};
