const mongoose = require("mongoose");

const ManhuaSchema = new mongoose.Schema({
    title: { type: String, required: true },
    alternativeTitle: { type: String },
    description: { type: String },
    coverImage: { type: String },
    genres: [{ type: String }],
    status: { type: String, enum: ["En emisión", "Finalizado", "Cancelado", "Pausado"], default: "En emisión" }, 
    demographic: { type: String, enum: ["Shounen", "Shoujo", "Seinen", "Josei", "Danmei"], default: "Danmei" }, 

    chapters: [
        {
            number: { type: Number, required: true },
            title: { type: String },
            images: [{ type: String }],
            uploadedAt: { type: Date, default: Date.now },
        },
    ],
}, { timestamps: true });

module.exports = mongoose.model('Manhua', ManhuaSchema);