const moment = require("moment");
const cloudinary = require("cloudinary").v2;
const bcrypt = require("bcrypt");
const fs = require("fs");
var request = require("request");
const Course = require("../../../models/main/course/course.model");
const { hashData, verifyHashedData } = require("../../../utils/hashData");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//GET ALL THE UPLOADED DOCUMENTS IN THE DATABASE

module.exports.getAllUploads = async (req, res) => {
  try {
    res.render("pages/course/index", {
      title: "HOME",
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports.getSingleCourseDocuments = async (req, res) => {
  try {
    const { course } = req.params;
    const content = await getCourse(course);

    res.render("pages/course/course", {
      course: content,
      title: course,
      moment,
    });
  } catch (error) {
    console.log(error);
  }
};

// UPLOAD PAGE
module.exports.uploadPage = async (req, res) => {
  res.render("pages/course/upload", { title: "UPLOAD" });
};

// DOWNLOAD PAGE
module.exports.downloadPage = async (req, res) => {
  const course = await Course.findById(req.params.id);
  res.render("pages/course/download", { title: "DOWNLOAD", file: course });
};

// HANDLE THE UPLOADS
module.exports.handleUpload = async (req, res) => {
  try {
    const courseData = {
      path: req.file.path,
      originalName: req.file.originalname,

      title: req.body.title,
      description: req.body.description,
      course: req.body.course,
      ...req.body,
    };
    if (req.body.password != null && req.body.password !== "") {
      courseData.password = await bcrypt.hash(req.body.password, 10);
    }

    const course = await new Course(courseData);
    // course.fileLink = `http://localhost:5000/api/v1/course/download/${course.id}`;
    course.fileLink = `https://gubifileshare.cyclic.app/api/v1/course/download/${course.id}`;
    await course.save();

    res.redirect(`/api/v1/course/document/course/${course.course}`);
    // res.redirect("/api/v1/course/");
  } catch (err) {
    console.error(err);
    return "Error uploading file";
  }
};

// DOWNLOAD A DOCUMENT
module.exports.handleDownload = async (req, res) => {
  const file = await Course.findById(req.params.id);

  if (file.password != null) {
    if (req.body.password == null) {
      res.render("pages/course/download", { title: "DOWNLOAD", file: file });
      return;
    }

    if (!(await verifyHashedData(req.body.password, file.password))) {
      res.render("pages/course/download", {
        error: true,
        title: "DOWNLOAD",
        file: file,
      });
      return;
    }
  }

  file.downloadCount++;
  await file.save();

  res.download(file.path, file.originalName);
};

// EDIT A DOCUMENT
module.exports.handleEdit = async (req, res) => {
  const { id } = req.params;
  console.log(req.body);

  try {
    if (req.file !== undefined) {
      await Course.findOneAndUpdate(
        { _id: id },
        {
          // path: req.file.path,
          ...req.body,
        }
      );
    }

    res.redirect(`/api/v1/course/document/course/${req.body.course}`);

    // process all other fields
  } catch (error) {
    console.log(error);
  }
};
// DELETE A DOCUMENT
module.exports.handleDelete = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    // await Course.deleteMany();
    await Course.findByIdAndDelete(id);

    res
      .status(200)
      .json({ message: "FILE DELETED", redirect: "/api/v1/course/" });
  } catch (error) {
    console.log(error);
  }
};

//

const getCourse = (courseTitle) =>
  Course.aggregate([
    {
      $match: {
        course: courseTitle,
      },
    },

    {
      $project: {
        path: 0,
      },
    },
  ]);
