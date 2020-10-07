const express = require("express")
const app = express()
const path = require("path")
const cors = require("cors")
const cookieParser = require("cookie-parser")

const config = require("./config/key")

const mongoose = require("mongoose")
mongoose
	.connect(config.mongoURI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false,
	})
	.then(() => console.log("MongoDB Connected..."))
	.catch((err) => console.log("MongoDB", err))

app.use(cors())

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())

app.use("/api/users", require("./routes/users"))
app.use("/api/video", require("./routes/video"))
app.use("/api/subscribe", require("./routes/subscribe"))
app.use("/api/comment", require("./routes/comment"))

app.use("/uploads", express.static("uploads"))

if (process.env.NODE_ENV === "production") {
	app.use(express.static("client/build"))

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"))
	})
}

const port = process.env.PORT || 5000

app.listen(port, () => {
	console.log(`Server Listening on ${port}`)
})
