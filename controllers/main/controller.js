const bcrypt = require("bcrypt");
const File = require("../../models/main/model");
const { hashData, verifyHashedData } = require("../../utils/hashData");

//GET ALL THE UPLOADED DOCUMENTS IN THE DATABASE
module.exports.getAllUploads = async (req, res) => {
  await File.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      res.render("pages/index", { file: result, title: "HOME" });
    })
    .catch((error) => {
      console.log(error);
    });
};

// UPLOAD PAGE
module.exports.uploadPage = async (req, res) => {
  res.render("pages/upload", { title: "UPLOAD" });
};

// DOWNLOAD PAGE
module.exports.downloadPage = async (req, res) => {
  const file = await File.findById(req.params.id);
  res.render("pages/download", { title: "DOWNLOAD", file: file });
};

// GET INFO ABOUT A SINGLE DOCUMENT
module.exports.singleDocumentPage = async (request, response) => {
  const id = request.params.id;
  File.findById(id)
    .then((result) => {
      response.render("pages/single", {
        document: result,
        title: "SINGLE",
        redirect: "/api/v1/user/",
      });
    })
    .catch((error) => {
      console.log(error);
    });
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
  };
  if (req.body.password != null && req.body.password !== "") {
    if (req.body.password.length < 3) {
      response.json({ message: "PASSWORD SHOULD BE MORE THAN 3 NUMBERS" });
    }

    // fileData.password = await bcrypt.hash(req.body.password, 10);
    fileData.password = await hashData(req.body.password, 10);
  }
  const file = await new File(fileData);
  file.fileLink = `${req.headers.origin}/api/v1/user/download/${file.id}`;
  file.save();

  res.redirect("/api/v1/user/");
};

// DOWNLOAD A DOCUMENT
module.exports.handleDownload = async (req, res) => {
  const file = await File.findById(req.params.id);

  if (file.password != null) {
    if (req.body.password == null) {
      res.render("pages/download", { title: "DOWNLOAD", file: file });
      return;
    }

    // if (!(await bcrypt.compare(req.body.password, file.password))) {

    if (!(await verifyHashedData(req.body.password, file.password))) {
      res.render("pages/download", {
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
    const file = await File.findById(id);

    res.render("pages/edit", { file: file, title: "EDIT" });
  } catch (error) {
    console.log(error);
  }
};

// EDIT A DOCUMENT
module.exports.handleEdit = async (req, res) => {
  const { id } = req.params;
  try {
    await File.findByIdAndUpdate(
      { _id: id },
      {
        ...req.body,
      }
    );

    res.redirect("/api/v1/user/");
  } catch (error) {
    console.log(error);
  }
};
// DELETE A DOCUMENT
module.exports.handleDelete = async (req, res) => {
  const { id } = req.params;
  try {
    await File.findByIdAndDelete(id);
    console.log(id);

    res
      .status(200)
      .json({ message: "FILE DELETED", redirect: "/api/v1/user/" });
  } catch (error) {
    console.log(error);
  }
};
