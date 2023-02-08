const moment = require("moment");

const Course = require("../../../models/main/course/course.model");
const User = require("../../../models/main/auth/auth.model");

//GET ALL THE UPLOADED DOCUMENTS IN THE DATABASE

// module.exports.getAllUploads = async (req, res) => {
//   if (
//     User &&
//     User.schema &&
//     User.schema.path("courses") &&
//     User.schema.path("courses").enumValues
//   ) {
//     res.render("pages/course/index", {
//       title: "HOME",
//       User: User,
//     });
//   } else {
//     res.status(500).send("Error: User schema not defined properly");
//   }

//   try {
//     const file = await Course.findById(id);
//     if (!User || !User.schema || !User.schema.path("courses")) {
//       throw new Error("User schema not defined properly");
//     }

//     res.render("pages/course/edit", {
//       file,
//       title: "EDIT",
//       User,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error: User schema not defined properly");
//   }
// };

module.exports.getHomePage = async (req, res) => {
  const { user } = res.locals;

  if (!user) {
    return res.render("pages/course/home", {
      title: "INTRO",
    });
  }

  let courses;
  try {
    courses =
      user.role === "admin"
        ? User &&
          User.schema &&
          User.schema.path("courses") &&
          User.schema.path("courses").enumValues
        : await Course.find({ title: user.selectedCourse });

    return res.render("pages/course/index", {
      title: "HOME",
      courses,
      User: user.role === "admin" ? User : null,
    });
  } catch (error) {
    return res.status(500).send(error);
  }
};

// GET ALL DOCUMENTS  UPLOADED UNDER A SPECIFIC COURSE
module.exports.getCourseCategory = async (req, res) => {
  try {
    const { title } = req.params;
    const content = await getCourse(title);

    res.render("pages/course/courseCategory", {
      course: content,
      title: title,
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
    if (!User || !User.schema || !User.schema.path("courses")) {
      throw new Error("User schema not defined properly");
    }

    res.render("pages/course/edit", {
      file,
      title: "EDIT",
      User,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error: User schema not defined properly");
  }
};

//

const getCourse = (courseTitle) =>
  Course.aggregate([
    {
      $match: {
        title: courseTitle,
      },
    },

    {
      $project: {
        path: 0,
      },
    },
  ]);
