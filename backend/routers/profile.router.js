const {
  getVideosById,
  getData,
  addToFav,
  removeFromFav,
  uploadProfilePic,
  editProfile,
  removeFromHighlight,
  getFavVideosById,
} = require("../controllers/profile.controller");
const { auth } = require("../controllers/token.controller");

const router = require("express").Router();
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/getVideos", auth, getVideosById);
router.get("/getData", auth, getData);
router.put("/addToFav", auth, addToFav);
router.delete("/removeFromFav", auth, removeFromFav);
router.post(
  "/uploadProfilePic",
  auth,
  upload.single("image"),
  uploadProfilePic
);
router.post("/editProfile", auth, upload.single("image"), editProfile);
router.get("/getFavVideos", auth, getFavVideosById);

router.delete("/deleteHighlight", auth, removeFromHighlight);

module.exports = router;
