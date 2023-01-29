const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      required: true,
    },

    path: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    downloadCount: {
      type: Number,
      required: true,
      default: 0,
    },

    password: {
      type: String,
      minlength: [3, "MINIMUM LENGTH OF PASSWORD IS 3 NUMBERS"],
    },
    fileLink: String,
  },
  { timestamps: true }
);

const File = mongoose.model("File", fileSchema);

module.exports = File;

//APP MODEL / DOCUMENT SCHEMA
