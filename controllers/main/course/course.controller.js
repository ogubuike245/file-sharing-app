const moment = require("moment");
const bcrypt = require("bcrypt");
const Course = require("../../../models/main/course/course.model");

//GET ALL THE UPLOADED DOCUMENTS IN THE DATABASE

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

// HANDLE THE UPLOADS

module.exports.handleUpload = async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const course = await new Course({
      path: req.file.path,
      originalName: req.file.originalname,
      heading: req.body.heading,
      type: req.body.type,
      description: req.body.description,
      title: req.body.title,
      password: hashedPassword,
    });
    course.downloadLink = `https://gubifileshare.cyclic.app/api/v1/course/download/${course.id}`;
    const savedCourse = await course.save();
    console.log(savedCourse);
    res.redirect(`/api/v1/course/category/${savedCourse.title}`);
  } catch (err) {
    console.error(err);
  }
};

// DOWNLOAD A DOCUMENT

module.exports.handleDownload = async (req, res) => {
  try {
    const file = await Course.findById(req.params.id);
    if (!file) return res.status(400).send("File not found");

    if (file.password) {
      if (!req.body.password)
        return res.render("pages/course/download", { title: "DOWNLOAD", file });

      const passwordMatch = await bcrypt.compare(
        req.body.password,
        file.password
      );
      if (!passwordMatch)
        return res.render("pages/course/download", {
          error: true,
          title: "DOWNLOAD",
          file,
        });
    }

    file.downloadCount++;
    await file.save();

    res.download(file.path, file.originalName);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error downloading file");
  }
};

// EDIT A DOCUMENT

module.exports.handleEdit = async (req, res) => {
  const { id } = req.params;
  const method = req.body._method || req.method;
  
  
  try {
    const { id } = req.params;
    const { title, description, heading , type} = req.body;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).send({ error: "Course not found" });
    }

    course.title = title;
    course.description = description;
    course.type=type;
    course.heading=heading;
    await course.save();

    return res.status(200).send({ message: "Course updated successfully" });
  } catch (error) {
    return res.status(500).send({ error: "Server error" });
  }

  
  /* try {
    if (method === 'PUT') {
      const result = await Course.findByIdAndUpdate(
        req.params.id,
        {
            heading: req.body.heading,
            type: req.body.type,
            description: req.body.description,
            title: req.body.title,
          },
      );
      console.log(result);
      res.redirect(`/api/v1/course/category/${req.body.title}`);
    } else {
      res.sendStatus(405);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  } */
};


// DELETE A DOCUMENT
module.exports.handleDelete = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    // await Course.deleteMany();
    await Course.findByIdAndDelete(id);
    // await Course.deleteOne({ _id: ObjectID(req.params.id) });

    res.status(200).json({ message: "FILE DELETED", redirect: "/" });
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
