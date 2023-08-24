import React from "react";
import Avatar from "../avatar/Avatar";
import "./Post.scss";
// import background from "../../assets/background.jpg";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import useNavigate from "react-dom";
import { likeAndUnlikePost } from "../../redux/slice/postsSlice";
import { showToast } from "../../redux/slice/appConfigSlice";
import { TOAST_SUCCESS } from "../../App";
// import { post } from "../../../../server/router/userRouter";

function Post({post}) {
  console.log('this is post', post);
  const dispatch = useDispatch();
  const navigate = useNavigate;
  async function handlePostLiked() {
    dispatch(
      showToast({
        type: TOAST_SUCCESS,
        message: "like or unlike",
      })
    );
    dispatch(
      likeAndUnlikePost({
        postId: post._id,
      })
    );
  }

  return (
    <div className="Post">
      <div
        className="heading"
        onClick={() => navigate(`/profile/${post.owner._id}`)}
      >
        <Avatar src={post?.owner?.avatar?.url} />
        <h4>{post?.owner?.name}</h4>
      </div>
      <div className="content">
        <img src={post?.image?.url} alt="" />
      </div>
      <div className="footer">
        <div className="like" onClick={handlePostLiked}>
          {post.isLiked ? (
            <AiFillHeart style={{ color:'red' }} className="icon" />
          ) : (
            <AiOutlineHeart className="icon" />
          )}
          <h4>{`${post.likeCount} likes`}</h4>
        </div>
        <p className="caption">{post.caption}</p>
        <h6 className="time-ago">{post?.timeAgo}</h6>
      </div>
    </div>
  );
}

export default Post;
