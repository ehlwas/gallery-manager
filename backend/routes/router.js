const express = require("express");
const multer = require("multer");

const { 
  getImageList,
  getImageListLoadMore,
  uploadImage,
  deleteImage,
  getLogoDrive,
  setLogo,
  getColor,
  updateColor
} = require('../controller/indexController')

const upload = multer();

const router = express.Router();

// ROUTES
router.get("/list", getImageList)

router.get("/list/:nextPageToken", getImageListLoadMore)

router.post("/upload", upload.any(), uploadImage);

router.delete("/delete/:fileId", deleteImage);

router.get("/getLogo", getLogoDrive)

router.post("/uploadLogo", upload.any(), setLogo)

router.get("/getColor", getColor)

router.post("/updateColor", updateColor)
  
module.exports = router;