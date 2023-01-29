const bcrypt = require("bcrypt");
const File = require("../../models/test/file.model");

module.exports.getAllUploads = async (req, res) => {
  const file = await File.find();
  res.render("pages/index", { file: file, title: "GUBI" });
};

module.exports.handleUpload = async (req, res) => {
  const fileData = {
    path: req.file.path,
    originalName: req.file.originalname,
  };
  if (req.body.password != null && req.body.password !== "") {
    fileData.password = await bcrypt.hash(req.body.password, 10);
  }

  const file = await File.create(fileData);

  res.render("pages/index", {
    fileLink: `${req.headers.origin}/api/v1/user/file/${file.id}`,
    title: "GUBI",
  });
};

module.exports.handleDownload = async (req, res) => {
  const file = await File.findById(req.params.id);

  if (file.password != null) {
    if (req.body.password == null) {
      res.render("pages/password");
      return;
    }

    if (!(await bcrypt.compare(req.body.password, file.password))) {
      res.render("pages/password", { error: true });
      return;
    }
  }

  file.downloadCount++;
  await file.save();
  console.log(file.downloadCount);

  res.download(file.path, file.originalName);
};

module.exports.handleDelete = async (req, res) => {
  try {
    console.log(req.params.id);
    await File.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "FILE DELETED" });
  } catch (error) {
    console.log(error);
  }
};
