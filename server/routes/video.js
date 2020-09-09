const express = require("express")
const router = express.Router()
const multer = require("multer")
var ffmpeg = require("fluent-ffmpeg")

const { Video } = require("../models/Video")

// Storage Multer Config
var storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/")
	},
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}_${file.originalname}`)
	},
	fileFilter: (req, file, cb) => {
		const ext = path.extname(file.originalname)
		if (ext !== ".mp4") {
			return cb(res.status(400).end("only mp4 is allowed"), false)
		}
		cb(null, true)
	},
})

// 비디오를 서버에 저장
var upload = multer({ storage: storage }).single("file")

router.post("/uploadfiles", (req, res) => {
	upload(req, res, (err) => {
		if (err) {
			return res.json({ success: false, err })
		}
		return res.json({
			success: true,
			filePath: res.req.file.path,
			fileName: res.req.file.filename,
		})
	})
})

router.post("/thumbnail", (req, res) => {
	let thumbsFilePath = ""
	let fileDuration = ""

	// 비디오 정보 가져오기
	ffmpeg.ffprobe(req.body.filePath, function (err, metadata) {
		console.dir(metadata)
		console.log(metadata.format.duration)

		fileDuration = metadata.format.duration
	})

	// 썸네일 생성하기
	ffmpeg(req.body.filePath)
		.on("filenames", function (filenames) {
			console.log("Will generate " + filenames.join(", "))
			thumbsFilePath = "uploads/thumbnails/" + filenames[0]
		})
		.on("end", function () {
			console.log("Screenshots taken")
			return res.json({
				success: true,
				thumbsFilePath: thumbsFilePath,
				fileDuration: fileDuration,
			})
		})
		.screenshots({
			count: 3,
			folder: "uploads/thumbnails",
			size: "320x240",
			filename: "thumbnail-%b.png",
		})
})

// DB에 비디오 데이터 업로드 하기
router.post("/uploadVideo", (req, res) => {
	const video = new Video(req.body)

	video.save((err, video) => {
		if (err) return res.status(400).json({ success: false, err })
		return res.status(200).json({
			success: true,
		})
	})
})

module.exports = router
