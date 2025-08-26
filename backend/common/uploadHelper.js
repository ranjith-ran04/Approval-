const path =require( "path");
const fs = require("fs");
const crypto = require("crypto");
const multer = require("../college/node_modules/multer");
const { fileURLToPath } = require("url");

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const uploadsRoot = path.resolve(__dirname, "..", "uploads");

if (!fs.existsSync(uploadsRoot)) {
  fs.mkdirSync(uploadsRoot, { recursive: true });
}

const encryptValue = (value) => {
  hash = crypto.createHash("sha256").update(value).digest("hex");
  return hash.substring(0, 10);
};

const fileSuffixMapping = {
  photo: "photo",
  signature: "signature",
  community: "community",
  nativityCertificate: "nativity",
  tenthMarksheet: "tenthMarkSheet",
  twelfthMarksheet: "twelfthMarkSheet",
  provisionalCertificate: "provisionalCertificate",
  consolidate: "consolidate",
  semesterOne: "semester1",
  semesterTwo: "semester2",
  semesterThree: "semester3",
  semesterFour: "semester4",
  semesterFive: "semester5",
  semesterSix: "semester6",
  semesterSeven: "semester7",
  semesterEight: "semester8",
  transferCert: "transferCert",
  aadhar: "aadhar",
  fg: "fg",
  sportsCertificate6: "sportCert6",
  sportsCertificate5: "sportCert5",
  sportsCertificate4: "sportCert4",
  sportsCertificate3: "sportCert3",
  sportsCertificate2: "sportCert2",
  sportsCertificate1: "sportCert1",
  disabilityCertificate1: "disabilityCert1",
  disabilityCertificate2: "disabilityCert2",
  disabilityCertificate3: "disabilityCert3",
  exServicemanCertificate1: "exServiceCert1",
  exServicemanCertificate2: "exServiceCert2",
  exServicemanCertificate3: "exServiceCert3",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { mobile } = req.body;
    if (!mobile) return cb(new Error("Missing mobile"));
    mobileHash = encryptValue(mobile);
    const mob = `${mobile}_${mobileHash}`;
    const dir = path.join(uploadsRoot, mob);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const { appln, type } = req.body;
    if (!appln) return cb(new Error("Misssing appl_no"));
    if (!type || !fileSuffixMapping[type]) cb(new Error("Invalid type"));

    const applnHash = encryptValue(appln);
    const suffix = fileSuffixMapping[type];
    const ext = path.extname(file.originalname) || "";

    cb(null, `${applnHash}-${suffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const okByExt = /pdf|jpg|jpeg|png$/i.test(path.extname(file.originalname));
  const okByMime = /pdf|image\/(jpeg|png|jpg)/i.test(file.mimetype);
  if (!okByExt || !okByMime)
    return cb(new Error("Only pdf/jpg/jpeg/png allowed"));
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 300 * 1024 },
});

const listStudentFiles = (mobile, appln) => {
  const mobileHash = encryptValue(mobile);
  const applnHash = encryptValue(appln);
  const mob = `${mobile}_${mobileHash}`;
  const dir = path.join(uploadsRoot, mob);

  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.startsWith(applnHash + "-"))
    .map((f) => ({
      name: f,
      url: `uploads/${mob}/${f}`,
      suffix: f.split("-")[1]?.split(".")[0] || "",
    }));
};

const deleteByType = (mobile, appln, type) => {
  if (!fileSuffixMapping[type]) throw new Error("Invalid type");
  const mobileHash = encryptValue(mobile);
  const applnHash = encryptValue(appln);
  const suffix = fileSuffixMapping[type];
  const mob = `${mobile}_${mobileHash}`;
  const dir = path.join(uploadsRoot, mob);
  if (!fs.existsSync(dir)) return false;

  const prefix = `${applnHash}-${suffix}`;
  const hit = fs.readdirSync(dir).find((f) => f.startsWith(prefix));
  if (!hit) return false;

  fs.unlinkSync(path.join(dir, hit));
  return true;
};

const cleanSamePrefix = (mobile, appln, type, keepFilename) => {
  const mobileHash = encryptValue(mobile);
  const applnHash = encryptValue(appln);
  const suffix = fileSuffixMapping[type];
  const mob = `${mobile}_${mobileHash}`;
  const dir = path.join(uploadsRoot, mob);
  const prefix = `${applnHash}-${suffix}`;
  if (!fs.existsSync(dir)) return;

  fs.readdirSync(dir)
    .filter((f) => f.startsWith(prefix) && f !== keepFilename)
    .forEach((f) => fs.unlinkSync(path.join(dir, f)));
};


module.exports = ({uploadsRoot, fileSuffixMapping,encryptValue,upload,listStudentFiles,deleteByType,cleanSamePrefix});