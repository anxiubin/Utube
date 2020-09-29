import React, { useState } from "react"
import { Comment, Avatar, Button, Input } from "antd"
import Axios from "axios"
import { useSelector } from "react-redux"
const { TextArea } = Input

function SingleComment(props) {
	const { userData } = useSelector((state) => state.user)
	const [CommentValue, setCommentValue] = useState("")
	const [OpenReply, setOpenReply] = useState(false)

	const handleChange = (e) => {
		setCommentValue(e.currentTarget.value)
	}

	const handleClickOpenReply = () => {
		setOpenReply(!OpenReply)
	}

	const onSubmit = (e) => {
		e.preventDefault()

		const variables = {
			writer: userData._id,
			postId: props.postId,
			responseTo: props.comment._id,
			content: CommentValue,
		}

		Axios.post("/api/comment/saveComment", variables).then((response) => {
			if (response.data.success) {
				setCommentValue("")
				setOpenReply(!OpenReply)
				props.refreshFunction(response.data.result)
			} else {
				alert("Failed to save Comment")
			}
		})
	}

	const actions = [
		<span onClick={handleClickOpenReply} key="comment-basic-reply-to">
			Reply to
		</span>,
	]

	return (
		<div>
			<Comment
				actions={actions}
				author={props.comment.writer.name}
				avatar={<Avatar src={props.comment.writer.image} alt="image" />}
				content={<p>{props.comment.content}</p>}
			></Comment>

			{OpenReply && (
				<form style={{ display: "flex" }} onSubmit={onSubmit}>
					<TextArea
						style={{ width: "100%", borderRadius: "5px", marginRight: "10px" }}
						onChange={handleChange}
						value={CommentValue}
						placeholder="write some comments"
					/>
					<br />
					<Button style={{ width: "20%", height: "52px" }} onClick={onSubmit}>
						Submit
					</Button>
				</form>
			)}
		</div>
	)
}

export default SingleComment