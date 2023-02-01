const moment = require("moment");
const Course = require("../../models/main/course/course.model");
const { hashData, verifyHashedData } = require("../../utils/hashData");

//GET ALL THE UPLOADED DOCUMENTS IN THE DATABASE

module.exports.getAllUploads = async (req, res) => {
  try {
    // const course = await Course.find().sort({ createdAt: -1 });

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
  res.render("pages/course/download", { title: "DOWNLOAD", file: file });
};

// GET INFO ABOUT A SINGLE DOCUMENT
module.exports.singleDocumentPage = async (request, response) => {
  const id = request.params.id;

  try {
    const groupedCourse = await Course.findById(id);

    response.render("pages/course/single", {
      document: groupedCourse,
      title: "SINGLE",
      redirect: "/api/v1/course/",
    });
  } catch (error) {
    console.log(error);
  }
};

// HANDLE THE UPLOADS
module.exports.handleUpload = async (req, res) => {
  const fileData = {
    path: req.file.path,
    originalName: req.file.originalname,
    title: req.body.title,
    description: req.body.description,
    course: req.body.course,
    title: req.body.title,
    ...req.body,
  };
  if (req.body.password != null && req.body.password !== "") {
    if (req.body.password.length < 3) {
      response.json({ message: "PASSWORD SHOULD BE MORE THAN 3 NUMBERS" });
    }

    fileData.password = await hashData(req.body.password, 10);
  }
  const file = await new Course(fileData);
  // file.fileLink = `${req.headers.origin}/api/v1/course/download/${file.id}`;
  file.fileLink = `https://gubifileshare.cyclic.app/api/v1/course/download/${file.id}`;
  file.save();

  res.redirect("/api/v1/course/");
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
  console.log(file.downloadCount);

  res.download(file.path, file.originalName, {
    info: "DOWNLOAD ABOUT TO START",
  });
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

// EDIT A DOCUMENT
module.exports.handleEdit = async (req, res) => {
  const { id } = req.params;
  console.log(req.body);

  try {
    if (req.file !== undefined) {
      await File.findOneAndUpdate(
        { _id: id },
        {
          ...req.body,
        }
      );

      res.redirect("/api/v1/course/");
    }

    // process all other fields
  } catch (error) {
    console.log(error);
  }
};
// DELETE A DOCUMENT
module.exports.handleDelete = async (req, res) => {
  const { id } = req.params;
  // console.log(id);
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
