const moment = require("moment");

const Course = require("../../../models/main/course/course.model");
const { hashData, verifyHashedData } = require("../../../utils/hashData");

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

// GET INFO ABOUT A SINGLE DOCUMENT
module.exports.singleDocumentPage = async (request, response) => {
  const { id } = request.params;

  try {
    const content = await Course.findById(id);
    response.render("pages/course/single", {
      document: content,
      title: "SINGLE",
      redirect: "/api/v1/course/",
    });
  } catch (error) {
    console.log(error);
  }
};

// EDIT A DOCUMENT PAGE
module.exports.editPage = async (req, res) => {
  const { id } = req.params;
  try {
    const file = await Course.findById(id);

    res.render("pages/course/edit", { file: file, title: "EDIT" });
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
