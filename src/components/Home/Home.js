import React from "react";
import moment from "moment";
import { withRouter } from "react-router-dom";
import "./Home.css";
import { getAllPosts, deletePost } from "../../utils/api";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: null
    };
  }

  componentDidMount = async () => {
    const posts = await getAllPosts();
    this.setState({ posts });
  };

  onDelete = async postId => {
    const jwt = sessionStorage.getItem("jwt");
    const username = sessionStorage.getItem("username");
    await deletePost(postId, jwt, username);
  };

  onClick = async () => {
    const posts = await getAllPosts();
    this.setState({ posts });
  };

  render() {
    if (this.state.posts) {
      const blogPosts = this.state.posts.map(
        ({ postId, postTitle, createdOn, updatedOn }) => {
          const dateCreated = moment(createdOn).format("MMMM D YYYY, h:mm a");
          return (
            <React.Fragment key={postId}>
              <div
                className="delButtonContainer"
                onClick={async () => {
                  await this.onDelete(postId);
                  await this.onClick();
                }}
              >
                <button className="delButton">X</button>
              </div>
              <div
                className="blogPost"
                id={postId}
                onClick={() => {
                  this.props.history.push(`/posts/${postId}`);
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
  }
}

export default withRouter(Home);
