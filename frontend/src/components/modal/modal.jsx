import React, { Component } from "react";

export default class modal extends Component {
  modalClose = () => {
    let modal = document.getElementById(this.props.id);

    // modal.classList.add("modal-remove");
    // modal.addEventListener("onanimationend", () => {});
    modal.style.display = "none";
    modal.classList.remove("show");
  };
  render() {
    return (
      <div
        className="modal fade"
        id={this.props.id}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
        style={{ zIndex: "9999" }}
      >
        <div
          className="modal-dialog modal-dialog-centered"
          role="document"
          style={{ maxWidth: "800px" }}
        >
          <div
            className="modal-content"
            style={{ width: "100% !important", height: "100% !important" }}
          >
            <div className="modal-header bg-dark text-light p-2">
              <h5 className="modal-title" id="exampleModalLongTitle">
                {this.props.title}
              </h5>
              <button
                type="button"
                className="close text-light"
                aria-label="Close"
                onClick={this.modalClose}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div
              className="modal-body bg-dark"
              style={this.props.style}
              id="modal-body"
              /* style={{ background: "#7d99a3" }} */
            >
              {this.props.body}
            </div>
            {this.props.show ? (
              <div className="modal-footer bg-primary" id="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                  onClick={this.modalClose}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  id="modalbtn"
                  data-dismiss="modal"
                  onClick={this.props.buttonClick}
                >
                  {this.props.buttonText}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}
