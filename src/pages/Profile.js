import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import JSONPretty from 'react-json-pretty';

import PostModel from '../models/Post';
import ReplyModel from '../models/Reply';
import { getFormValues } from 'redux-form';

class Profile extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      posts: [],
      replies: [],
      limitTo = 5
    };
  };

  componentDidMount() {
    this.fetchData()
  };

  fetchData = () => {
    PostModel.all().then((res) => {
      this.setState ({
        posts: res.data.posts
      })
    })
    ReplyModel.all().then((res) => {
      this.setState ({
        posts: res.data.replies
      });
    });
  };

  onLoadMore() {
    this.setState({
      limitTo: this.state.limitTo + 5
    });
  };

  createPost = (post) => {
    let newPost = {
      body: post
    };

    PostModel.create(newPost).then((res) => {
      let posts = this.state.posts;
      posts.push(res.data)
      this.setState({posts: posts})
    });
  };

  createReply = (reply) => {
    let newReply = {
      body: reply
    };

    ReplyModel.create(newReply).then((res) => {
      let replies = this.state.replies;
      replies.push(res.data)
      this.setState({replies: replies})
    });
  };
  
  deletePost = (post) => {
    PostModel.delete(post).then((res) => {
      let posts = this.state.posts.filter((post) => {
        return post._id !== res.data._id;
      });
      this.setState({posts})
    });
  };

  deleteReply = (reply) => {
    ReplyModel.delete(reply).then((res) => {
      let replies = this.state.replies.filter((post) => {
        return reply._id !== res.data._id;
      });
      this.setState({replies})
    });
  };

  updatePost = (post) => {
    const updatedPost = (item) => {
      return item._id ===  post._id
    };

    PostModel.update(post) 
    .then((res) => {
      let posts = this.state.posts;
      posts.find(updatedPost).body = post.body;
      this.setState({posts: posts})
    })
  };

  updateReply = (reply) => {
    const updatedReply = (item) => {
      return item._id ===  reply._id
    };

    PostModel.update(reply) 
    .then((res) => {
      let replies = this.state.replies;
      replies.find(updatedReply).body = reply.body;
      this.setState({replies: replies})
    })
  };

  render() {

    const { user, isAuthenticated } = useAuth0();

    const postCount = this.state.posts.length;
    const repliesCount = this.state.replies.length;

    const postsList = posts.slice(0, this.state.limitTo).map((post, index) => {
      return <li key={index}>{post}</li>
    })


    return (
      isAuthenticated && ( 
        <div>
          <img src={user.picture} alt={user.name} />
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <button type="submit">Edit Profile</button>
          <JSONPretty data={user} />
          {/* {JSON.stringify(user, null, 2)} */}
          <h2>Recent Activities</h2>
          <div>
            <h5>{postCount} Posts</h5>
          </div>
          <div>
            <h5>{repliesCount} Comments</h5>
          </div>
          <ul>
          {postsList}
          </ul>
          <h2 onClick={this.onLoadMore}>See All</h2>
          <h5>Customize Feed</h5>
          <span><p>Coronavirus</p>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider round"></span>
            </label>
          </span>
          <span><p>General</p>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider round"></span>
            </label>
          </span>
        </div>
      )
    )
  } 
}

export default Profile