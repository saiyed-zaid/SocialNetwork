import React, { Component } from "react";
import moment from "moment";

export default class scheduledPosts extends Component {
  constructor() {
    super();
    this.state = {
      posts: "",
    };
  }
  async componentDidMount() {
    const userId = this.props.authUser._id;
    const token = this.props.authUser.token;

    try {
      const data = await this.props.fetchScheduledPosts(userId, token);

      if (data.error) {
        this.setState({ error: data.error });
      } else {
        this.setState({ posts: data.posts });
      }
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const { posts } = this.state;
    return (
      <>
        <div class="jumbotron-fluid m-4">
          <h1 class="display-5 text-light">Scheduled Posts</h1>
        </div>
        <div className="container-fluid">
          <div>
            <table className="table table-hover">
              <thead className="thead-dark">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Post Title</th>
                  <th scope="col">Scheduled Time</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>

              <tbody className="bg-light">
                {posts &&
                  posts.map((post, i) => (
                    <tr className="table-row">
                      {console.log(post)}
                      <th scope="row">{i}</th>
                      <td>{post.title}</td>
                      <td>
                        {moment(post.scheduleTime).format(
                          "MMMM Do YYYY, h:mm:ss a"
                        )}
                      </td>
                      <td>
                        <button className="btn btn-info">Edit</button>
                        <button className="btn btn-info">Delete</button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  }
}
