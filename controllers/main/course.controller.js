const moment = require("moment");
const Course = require("../../models/main/course/course.model");
const { hashData, verifyHashedData } = require("../../utils/hashData");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "datmbb439",
  api_key: "815386214487686",
  api_secret: "-Hb0eu1YPzy2vZXt3ECL_oXMqTY",
});

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
  res.render("pages/course/download", { title: "DOWNLOAD", file: course });
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
  try {
    const file = req.file;
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ resource_type: "auto" }, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        })
        .end(file.buffer);
    });

    console.log(result);
    const courseData = {
      path: result.public_id,
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
      courseData.password = await hashData(req.body.password, 10);
    }

    const course = await new Course(courseData);
    course.fileLink = `http://localhost:5000/api/v1/course/download/${course.id}`;
    // course.fileLink = `https://gubifileshare.cyclic.app/api/v1/course/download/${course.id}`;
    await course.save();

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
  console.log(file.downloadCount);

  const public_id = file.path;

  cloudinary.api.resource(public_id, (error, result) => {
    if (error) {
      return res.status(400).send(error);
    }

    res.redirect(result.secure_url);
  });

  // res.download(file.path, file.originalName, {
  //   info: "DOWNLOAD ABOUT TO START",
  // });
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
