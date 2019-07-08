import React from "react";
import moment from "moment";
import { withRouter } from "react-router-dom";
import "./Home.css";

const Home = ({ history, allPosts, onDelete, onClick }) => {
  if (allPosts) {
    const blogPosts = allPosts.map(
      ({ postId, postTitle, createdOn, updatedOn }) => {
        const dateCreated = moment(createdOn).format("MMMM D YYYY, h:mm a");
        return (
          <React.Fragment key={postId}>
            <div
              className="delButtonContainer"
              onClick={() => {
                onDelete(postId);
                onClick();
              }}
            >
              <button className="delButton">X</button>
            </div>
            <div
              className="blogPost"
              id={postId}
              onClick={() => {
                history.push(`/posts/${postId}`);
                localStorage.setItem("existingPost", true);
              }}
            >
              <div>
                <h4>{dateCreated}</h4>
                <h1>{postTitle}</h1>
              </div>
            </div>
          </React.Fragment>
        );
      }
    );
    return <div>{blogPosts}</div>;
  }
  return null;
};

export default withRouter(Home);
