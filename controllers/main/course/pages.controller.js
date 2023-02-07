const moment = require("moment");

const Course = require("../../../models/main/course/course.model");
const User = require("../../../models/main/auth/auth.model");

//GET ALL THE UPLOADED DOCUMENTS IN THE DATABASE

module.exports.getAllUploads = async (req, res) => {
  if (
    User &&
    User.schema &&
    User.schema.path("courses") &&
    User.schema.path("courses").enumValues
  ) {
    res.render("pages/course/index", {
      title: "HOME",
      User: User,
    });
  } else {
    res.status(500).send("Error: User schema not defined properly");
  }
};

// GET ALL DOCUMENTS  UPLOADED UNDER A SPECIFIC COURSE
module.exports.getCourseCategory = async (req, res) => {
  try {
    const { course } = req.params;
    const content = await getCourse(course);

    res.render("pages/course/courseCategory", {
      course: content,
      title: course,
      moment,
    });
  } catch (error) {
    console.log(error);
  }
};

// UPLOAD  PAGE
module.exports.uploadPage = async (req, res) => {
  if (
    User &&
    User.schema &&
    User.schema.path("courses") &&
    User.schema.path("courses").enumValues
  ) {
    res.render("pages/course/upload", {
      title: "UPLOAD",
      User: User,
    });
  } else {
    res.status(500).send("Error: User schema not defined properly");
  }
};

// DOWNLOAD PAGE
module.exports.downloadPage = async (req, res) => {
  const course = await Course.findById(req.params.id);
  res.render("pages/course/download", { title: "DOWNLOAD", file: course });
};

// GET INFO ABOUT A SINGLE DOCUMENT UPLOADED UNDER A SPECIFIC COURSE
module.exports.getUploadedDocumentDetail = async (request, response) => {
  const { id } = request.params;
  try {
    const content = await Course.findById(id);
    response.render("pages/course/courseDetail", {
      document: content,
      title: "DOCUMENT DETAIL",
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
