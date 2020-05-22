import React, { Component } from "react";

export default class scheduledPosts extends Component {
  render() {
    return (
      <>
        {" "}
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
                  <th scope="col">Image Url</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody className="bg-light">
                <tr className='table-row'>
                  <th scope="row">1</th>
                  <td>New Post</td>
                  <td>{new Date().toString()}</td>
                  <td>....</td>
                  <td>
                    <button className="btn btn-info">Edit</button>
                    <button className="btn btn-info">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  }
}
