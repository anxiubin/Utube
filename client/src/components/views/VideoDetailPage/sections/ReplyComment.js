import React, { useEffect, useState } from "react"
import SingleComment from "./SingleComment"

const renderReplyComment = (props) =>
	props.CommentLists.map((comment) => (
		<React.Fragment key={comment._id}>
			{comment.responseTo === props.parentCommentId && (
				<div style={{ marginLeft: "40px" }}>
					<SingleComment
						comment={comment}
						postId={props.postId}
						refreshFunction={props.refreshFunction}
					/>
					<ReplyComment
						CommentLists={props.CommentLists}
						parentCommentId={comment._id}
						postId={props.postId}
						refreshFunction={props.refreshFunction}
					/>
				</div>
			)}
		</React.Fragment>
	))

function ReplyComment(props) {
	const [ChildCommentNumber, setChildCommentNumber] = useState(0)
	const [OpenReplyComments, setOpenReplyComments] = useState(false)

	const handleChange = () => {
		setOpenReplyComments(!OpenReplyComments)
	}

	useEffect(() => {
		let commentNumber = props.CommentLists.filter(
			(comment) => comment.responseTo === props.parentCommentId
		).length

		setChildCommentNumber(commentNumber)
	}, [props.CommentLists, props.parentCommentId])

	return (
		<div>
			{ChildCommentNumber > 0 && (
				<button
					style={{
						fontSize: "14px",
						margin: 0,
						color: "gray",
						backgroundColor: "transparent",
						border: "none",
						cursor: "pointer",
					}}
					onClick={handleChange}
				>
					View {ChildCommentNumber} more comment(s)
				</button>
			)}

			{OpenReplyComments && renderReplyComment(props)}
		</div>
	)
}

export default ReplyComment
