import path from "path";
import {
  uploadsRoot,
  upload,
  listStudentFiles,
  deleteByType,
  cleanSamePrefix,
  encryptValue,
} from "../../../common/uploadHelper";

const getCert = async (req, res) => {
  try {
    const { mobile, appln } = req.body;
    if (!mobile || !appln)
      return res
        .status(400)
        .json({ error: "mobile and application number are required" });
    const files = listStudentFiles(mobile, appln);
    return res.json(files);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const uploadCert = async (req, res) => {
  const handler = upload.single("file");

  handler(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    try {
        const {mobile, appln, type } = req.body;
        if(!mobile || !appln || !type) return res.status(400).json({error : "mobile,appln,type are required"});

        cleanSamePrefix(mobile, appln,type,req.file.filename);

        return res.json({success:true,
            file:req.file.filename,
            url: `api/uploads/${mobile}_${encryptValue(mobile)}/${req.file.filename}`,
        });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  });
};

const deleteCert= (req, res) => {
    const {mobile, appln, type} =req.body;
    if(!mobile || !appln || !type) return res.status(400).json({ error: "mobile,appln,type are required"});
    
    try{
        const ok = deleteByType(mobile,appln,type);
        if(!ok) return res.status(404).json({error : "File not found"});
        return res.json({success : true});
    }catch(e){
        return res.status(500).json({error : e.message});
    }
}

module.exports = {getCert, uploadCert,deleteCert};