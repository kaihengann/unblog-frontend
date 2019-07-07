import React from "react";
import moment from "moment";
import { withRouter } from "react-router-dom";
import "./Home.css";

const Home = withRouter(({ posts, history, onClick }) => {
  if (posts) {
    const blogPosts = posts.map(
      ({ postId, postTitle, createdOn, updatedOn }) => {
        const dateCreated = moment(createdOn).format("MMMM D YYYY, h:mm a");
        return (
          <div
            className="blogPost"
            id={postId}
            key={postId}
            onClick={() => {
              history.push(`/posts/${postId}`);
            }}
          >
            <div>
              <h4>{dateCreated}</h4>
              <h1>{postTitle}</h1>
            </div>
          </div>
        );
      }
    );

    return <div>{blogPosts}</div>;
  }
  return null;
});

export default Home;
