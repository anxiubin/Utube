import React, { useEffect, useState } from "react"
import { Tooltip } from "antd"
import {
	LikeFilled,
	LikeOutlined,
	DislikeFilled,
	DislikeOutlined,
} from "@ant-design/icons"
import Axios from "axios"

function LikeDislikes(props) {
	const [Likes, setLikes] = useState(0)
	const [Dislikes, setDislikes] = useState(0)
	const [LikeAction, setLikeAction] = useState(null)
	const [DislikeAction, setDislikeAction] = useState(null)
	let variable = {}

	if (props.video) {
		variable = { videoId: props.videoId, userId: props.userId }
	} else {
		variable = { commentId: props.commentId, userId: props.userId }
	}

	useEffect(() => {
		Axios.post("/api/like/getLikes", variable).then((response) => {
			if (response.data.success) {
				setLikes(response.data.likes.length)

				for (let i = 0; i < response.data.likes.length; i++) {
					if (response.data.likes[i].userId === props.userId) {
						setLikeAction("liked")
						return
					}
				}
			} else {
				alert("Failed to get likes")
			}
		})

		Axios.post("/api/like/getDislikes", variable).then((response) => {
			if (response.data.success) {
				setDislikes(response.data.dislikes.length)

				for (let i = 0; i < response.data.dislikes.length; i++) {
					if (response.data.dislikes[i].userId === props.userId) {
						setDislikeAction("disliked")
						return
					}
				}
			} else {
				alert("Failed to get dislikes")
			}
		})
	}, [])

	const onLike = () => {
		if (LikeAction === null) {
			Axios.post("/api/like/upLike", variable).then((response) => {
				if (response.data.success) {
					setLikes(Likes + 1)
					setLikeAction("liked")

					if (DislikeAction !== null) {
						setDislikeAction(null)
						setDislikes(Dislikes - 1)
					}
				} else {
					alert("Failed to increase the like")
				}
			})
		} else {
			Axios.post("/api/like/unLike", variable).then((response) => {
				if (response.data.success) {
					setLikes(Likes - 1)
					setLikeAction(null)
				} else {
					alert("Failed to decrease the like")
				}
			})
		}
	}

	const onDisLike = () => {
		if (DislikeAction !== null) {
			Axios.post("/api/like/unDisLike", variable).then((response) => {
				if (response.data.success) {
					setDislikes(Dislikes - 1)
					setDislikeAction(null)
				} else {
					alert("Failed to decrease dislike")
				}
			})
		} else {
			Axios.post("/api/like/upDisLike", variable).then((response) => {
				if (response.data.success) {
					setDislikes(Dislikes + 1)
					setDislikeAction("disliked")

					if (LikeAction !== null) {
						setLikeAction(null)
						setLikes(Likes - 1)
					}
				} else {
					alert("Failed to increase dislike")
				}
			})
		}
	}

	return (
		<React.Fragment>
			<span key="comment-basic-like">
				<Tooltip title="Like">
					{LikeAction === "liked" ? (
						<LikeFilled onClick={onLike} />
					) : (
						<LikeOutlined onClick={onLike} />
					)}
				</Tooltip>
				<span style={{ paddingLeft: "8px", cursor: "auto" }}>{Likes}</span>
			</span>
			&nbsp;&nbsp;
			<span key="comment-basic-dislike">
				<Tooltip title="Dislike">
					{DislikeAction === "disliked" ? (
						<DislikeFilled onClick={onDisLike} />
					) : (
						<DislikeOutlined onClick={onDisLike} />
					)}
				</Tooltip>
				<span style={{ paddingLeft: "8px", cursor: "auto" }}>{Dislikes}</span>
			</span>
		</React.Fragment>
	)
}

export default LikeDislikes
