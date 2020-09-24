const express = require("express")
const router = express.Router()

const { Subscriber } = require("../models/Subscriber")

// 구독자 수 가져오기
router.post("/subscribeNumber", (req, res) => {
	Subscriber.find({ userTo: req.body.userTo }).exec((err, subscribe) => {
		if (err) return res.status(400).send(err)

		res.status(200).json({ success: true, subscribeNumber: subscribe.length })
	})
})

// 특정 유저 구독했는지 판별하기
router.post("/subscribed", (req, res) => {
	Subscriber.find({
		userTo: req.body.userTo,
		userFrom: req.body.userFrom,
	}).exec((err, subscribe) => {
		if (err) return res.status(400).send(err)

		let result = false
		if (!!subscribe.length) result = true
		res.status(200).json({ success: true, subcribed: result })
	})
})

// 구독하기
router.post("/subscribe", (req, res) => {
	const subscribe = new Subscriber(req.body)

	subscribe.save((err, doc) => {
		if (err) return res.json({ success: false, err })
		return res.status(200).json({ success: true })
	})
})

// 구독해지하기
router.post("/unSubscribe", (req, res) => {
	Subscriber.findOneAndDelete({
		userTo: req.body.userTo,
		userFrom: req.body.userFrom,
	}).exec((err, doc) => {
		if (err) return res.status(400).json({ success: false, err })
		res.status(200).json({ success: true, doc })
	})
})

module.exports = router
