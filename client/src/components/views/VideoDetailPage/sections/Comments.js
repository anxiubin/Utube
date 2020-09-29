import React, { useState } from "react"
import { Button, Input } from "antd"
import axios from "axios"
import { useSelector } from "react-redux"
import SingleComment from "./SingleComment"
import ReplyComment from "./ReplyComment"
const { TextArea } = Input

function Comments(props) {
	const { userData } = useSelector((state) => state.user)
	const [Comment, setComment] = useState("")

	const handleChange = (e) => {
		setComment(e.currentTarget.value)
	}

	const onSubmit = (e) => {
		e.preventDefault()

		const variables = {
			content: Comment,
			writer: userData._id,
			postId: props.postId,
		}

		axios.post("/api/comment/saveComment", variables).then((response) => {
			if (response.data.success) {
				setComment("")
				props.refreshFunction(response.data.result)
			} else {
				alert("Failed to save Comment")
			}
		})
	}

	return (
		<div>
			<br />
			<p> Replies</p>
			<hr />

			{props.CommentLists &&
				props.CommentLists.map(
					(comment) =>
						!comment.responseTo && (
							<React.Fragment key={comment._id}>
								<SingleComment
									comment={comment}
									postId={props.postId}
									refreshFunction={props.refreshFunction}
								/>
								<ReplyComment
									CommentLists={props.CommentLists}
									postId={props.postId}
									parentCommentId={comment._id}
									refreshFunction={props.refreshFunction}
								/>
							</React.Fragment>
						)
				)}

			<form style={{ display: "flex", marginTop: "20px" }} onSubmit={onSubmit}>
				<TextArea
					style={{ width: "100%", borderRadius: "5px", marginRight: "10px" }}
					onChange={handleChange}
					value={Comment}
					placeholder="write some comments"
				/>
				<Button style={{ width: "20%", height: "52px" }} onClick={onSubmit}>
					Submit
				</Button>
			</form>
		</div>
	)
}

export default Comments
