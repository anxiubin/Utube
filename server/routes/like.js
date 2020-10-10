const express = require("express")
const router = express.Router()
const { Like } = require("../models/Like")
const { Dislike } = require("../models/Dislike")

router.post("/getLikes", (req, res) => {
	let variable = {}
	if (req.body.videoId) {
		variable = { videoId: req.body.videoId }
	} else {
		variable = { commentId: req.body.commentId }
	}

	Like.find(variable).exec((err, likes) => {
		if (err) return res.status(400).send(err)
		res.status(200).json({ success: true, likes })
	})
})

router.post("/getDislikes", (req, res) => {
	let variable = {}
	if (req.body.videoId) {
		variable = { videoId: req.body.videoId }
	} else {
		variable = { commentId: req.body.commentId }
	}

	Dislike.find(variable).exec((err, dislikes) => {
		if (err) return res.status(400).send(err)
		res.status(200).json({ success: true, dislikes })
	})
})

router.post("/upLike", (req, res) => {
	let variable = {}
	if (req.body.videoId) {
		variable = { videoId: req.body.videoId, userId: req.body.userId }
	} else {
		variable = { commentId: req.body.commentId, userId: req.body.userId }
	}

	const like = new Like(variable)

	like.save((err, likeResult) => {
		if (err) return res.json({ success: false, err })

		//만약 싫어요 버튼이 이미 클릭되어있다면, 싫어요 하나를 제거한다
		Dislike.findOneAndDelete(variable).exec((err, disLikeResult) => {
			if (err) return res.status(400).json({ success: false, err })
			res.status(200).json({ success: true })
		})
	})
})

router.post("/unLike", (req, res) => {
	let variable = {}
	if (req.body.videoId) {
		variable = { videoId: req.body.videoId, userId: req.body.userId }
	} else {
		variable = { commentId: req.body.commentId, userId: req.body.userId }
	}

	Like.findOneAndDelete(variable).exec((err, result) => {
		if (err) return res.status(400).json({ success: false, err })
		res.status(200).json({ success: true })
	})
})

router.post("/unDisLike", (req, res) => {
	let variable = {}
	if (req.body.videoId) {
		variable = { videoId: req.body.videoId, userId: req.body.userId }
	} else {
		variable = { commentId: req.body.commentId, userId: req.body.userId }
	}

	Dislike.findOneAndDelete(variable).exec((err, result) => {
		if (err) return res.status(400).json({ success: false, err })
		res.status(200).json({ success: true })
	})
})

router.post("/upDisLike", (req, res) => {
	let variable = {}
	if (req.body.videoId) {
		variable = { videoId: req.body.videoId, userId: req.body.userId }
	} else {
		variable = { commentId: req.body.commentId, userId: req.body.userId }
	}

	const disLike = new Dislike(variable)

	disLike.save((err, dislikeResult) => {
		if (err) return res.json({ success: false, err })

		//만약 좋아요 버튼이 이미 클릭되어있다면, 좋아요 하나를 제거한다
		Like.findOneAndDelete(variable).exec((err, likeResult) => {
			if (err) return res.status(400).json({ success: false, err })
			res.status(200).json({ success: true })
		})
	})
})

module.exports = router
