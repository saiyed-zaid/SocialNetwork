import React, { Component } from "react";

export default class card extends Component {
  render() {
    return (
      <div
        className={this.props.class}
        key={this.props.key}
        style={this.props.style}
      >
        {this.props.img}
        <div className="card-body">
          <h6 className="card-title">{this.props.title}</h6>
          <p className="card-text">{this.props.text}</p>
          {this.props.children}
        </div>
      </div>
    );
  }
}
