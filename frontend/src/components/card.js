import React, { Component } from "react";

export default class Card extends Component {
  render() {
    return (
      <div
        className={this.props.className}
        key={this.props.ckey}
        style={this.props.style}
      >
        {this.props.img}
        <div className="card-body">
          <blockquote className="blockquote mb-0">
            <h5 className="card-title">{this.props.title}</h5>
            <p className="card-text">{this.props.text}</p>
            {this.props.postedBy ? (
              <footer className="blockquote-footer">
                <cite title="Source Title">{this.props.postedBy} </cite>
              </footer>
            ) : (
              ""
            )}
          </blockquote>
          {this.props.children}
        </div>
      </div>
    );
  }
}
