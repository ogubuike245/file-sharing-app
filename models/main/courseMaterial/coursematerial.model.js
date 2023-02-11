const mongoose = require("mongoose");

const courseMaterialSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      // required: true,
      default: "default",
    },
    originalName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      minlength: [3, "MINIMUM LENGTH OF PASSWORD IS 3 NUMBERS"],
    },
    downloadCount: {
      type: Number,
      required: true,
      default: 0,
    },
    downloadedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    downloadLink: String,
  },
  { timestamps: true }
);

const CourseMaterial = mongoose.model("courseMaterial", courseMaterialSchema);

module.exports = CourseMaterial;
