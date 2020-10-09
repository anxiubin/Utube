import React, { useEffect, useState } from "react"
import { List, Avatar, Row, Col } from "antd"
import axios from "axios"
import SideVideo from "./sections/SideVideo"
import Subscriber from "./sections/Subscriber"
import Comments from "./sections/Comments"
import LikeDislikes from "./sections/LikeDislikes"

function VideoDetailPage(props) {
	const videoId = props.match.params.videoId
	const [Video, setVideo] = useState([])
	const [CommentLists, setCommentLists] = useState([])

	const updateComment = (newComment) => {
		setCommentLists(CommentLists.concat(newComment))
	}

	const videoVariable = {
		videoId: videoId,
	}

	useEffect(() => {
		axios.post("/api/video/getVideo", videoVariable).then((response) => {
			if (response.data.success) {
				setVideo(response.data.video)
			} else {
				alert("Failed to get video Info")
			}
		})

		axios.post("/api/comment/getComments", videoVariable).then((response) => {
			if (response.data.success) {
				setCommentLists(response.data.comments)
			} else {
				alert("Failed to get video Info")
			}
		})
	}, [])

	if (Video.writer) {
		const userId = localStorage.getItem("userId")
		const subscribeButton = Video.writer._id !== userId && (
			<Subscriber userTo={Video.writer._id} userFrom={userId} />
		)
		return (
			<Row>
				<Col lg={18} xs={24}>
					<div
						className="postPage"
						style={{ width: "100%", padding: "3rem 4em" }}
					>
						<video
							style={{ width: "100%" }}
							src={`http://localhost:5000/${Video.filePath}`}
							controls
						></video>

						<List.Item
							actions={[
								<LikeDislikes
									video
									videoId={videoId}
									userId={localStorage.getItem("userId")}
								/>,
								subscribeButton,
							]}
						>
							<List.Item.Meta
								avatar={<Avatar src={Video.writer && Video.writer.image} />}
								title={Video.title}
								description={Video.description}
							/>
							<div></div>
						</List.Item>

						<Comments
							CommentLists={CommentLists}
							postId={Video._id}
							refreshFunction={updateComment}
						/>
					</div>
				</Col>
				<Col lg={6} xs={24}>
					<SideVideo />
				</Col>
			</Row>
		)
	} else {
		return <div>Loading...</div>
	}
}

export default VideoDetailPage
