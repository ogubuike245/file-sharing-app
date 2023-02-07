const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
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
    type: {
      type: String,
      // required: true,
      default: "default",
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

const Course = mongoose.model("File", courseSchema);

module.exports = Course;

//APP MODEL / DOCUMENT SCHEMA
