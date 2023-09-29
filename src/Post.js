import React, { useEffect, useState } from "react";
import "./Post.css";
import Avatar from "@mui/material/Avatar";
import { db } from "./firebase";
import firebase from "firebase/compat/app";

// username =>who wrote the post
// user =>who signed in
// use props ,we will destruxture using es6 tech
export default function Post({ postId, user, username, caption, imageUrl }) {
  const [comments, setComments] = useState([]);
  // for single comments
  const [comment, setComment] = useState("");

  // make unsubscribe a function to run code
  useEffect(() => {
    const unsubscribe = () => {
      if (postId) {
        unsubscribe = db
          .collection("posts")
          .doc(postId)
          .collection("comments")
          .orderBy("timestamp", "desc")
          .onSnapshot((snapshot) => {
            setComments(snapshot.docs.map((doc) => doc.data()));
          });
      }
      return () => {
        unsubscribe();
      };
    };
  }, [postId]);

  const postComment = (event) => {
    event.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,

      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };

  return (
    // BEM convention-> container classname first than element name eg post__image
    <div className="post">
      <div className="post__header">
        <Avatar alt="Jimmy" className="post__avatar" src="" />
        {/* Jsx in curly brackets */}
        <h3>{username}</h3>
      </div>

      <img src={imageUrl} alt="" className="post__image" />
      <h4 className="post__text">
        <strong>{username}</strong>:{caption}
      </h4>

      <div className="post__comments">
        {comments.map((comment) => {
          <p>
            <strong>{comment.username}</strong>
            {comment.text}
          </p>;
        })}
      </div>

      {/* if there is user than he can comment */}
      {user && (
        <form className="comment__form">
          <div className="comment__wrapper">
            <input
              className="comment__Input"
              type="text"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              className="comment__button text__button"
              disabled={!comment}
              onClick={postComment}
              type="submit"
            >
              Post
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
