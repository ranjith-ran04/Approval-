const {
  uploadsRoot,
  upload,
  listStudentFiles,
  deleteByType,
  cleanSamePrefix,
  encryptValue,
  fileSuffixMapping,
} = require("../../../common/uploadHelper");
const db = require("../config/db");

const getCert = async (req, res) => {
  try {
    const { mobile, appln } = req.body;
    if (!mobile || !appln)
      return res
        .status(200)
        .json({ error: "mobile and application number are required" });
    const files = listStudentFiles(mobile, appln);
    return res.status(200).json(files);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const uploadCert = async (req, res) => {
  const handler = upload.single("file");
  //   // console.log("inside uloader");
  handler(req, res, async (err) => {
    // // console.log("inside handler");
    if (err) return res.status(400).json({ error: err.message });
    try {
      // // console.log("inside try");
      const { mobile, appln, type } = req.body;
      //   // console.log(mobile);
      if (!mobile || !appln || !type)
        return res
          .status(400)
          .json({ error: "mobile,appln,type are required" });

      cleanSamePrefix(mobile, appln, type, req.file.filename);
      const column = certMap[type];
      updateCertQ = `update approval_certificates set ${column} = 1 where a_no=?`;
      await db.query(updateCertQ, [appln]);

      return res.status(200).json({
        success: true,
        file: req.file.filename,
        url: `uploads/${mobile}_${encryptValue(mobile)}/${req.file.filename}`,
      });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  });
};

const deleteCert = async (req, res) => {
  const { mobile, appln, type } = req.body;
  if (!mobile || !appln || !type)
    return res.status(400).json({ error: "mobile,appln,type are required" });

  try {
    const ok = deleteByType(mobile, appln, type);
    if (!ok) return res.status(404).json({ error: "File not found" });
    const column = certMap[type];
    delCertQ = `update approval_certificates set ${column} = 0 where a_no=?`;
    await db.query(delCertQ, [appln]);
    return res.status(200).json({ success: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

const certMap = {
  community: "community_certificate",
  provisionalCertificate: "pro_degree_certificate",
  consolidate: "consolidate_marksheet",
  fg: "first_graduate_certificate",
  transferCert: "transfer_certificate",
};

module.exports = { getCert, uploadCert, deleteCert };
