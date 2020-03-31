import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import GoogleLogin from "react-google-login";
import { socialLogin, authenticate } from "../index";

class SocialLogin extends Component {
  constructor() {
    super();
    this.state = {
      redirectToReferrer: false
    };
  }

  responseGoogle = response => {
    const { googleId, name, email, imageUrl } = response.profileObj;
    const user = {
      password: googleId,
      name: name,
      email: email,
      imageUrl: imageUrl
    };

    socialLogin(user).then(data => {
      if (data.error) {
        console.log("Error Login. Please try again..");
      } else {
        console.log("signin success - setting jwt: ", data);
        authenticate(data, () => {
          this.setState({ redirectToReferrer: true });
        });
      }
    });
  };

  render() {
    // redirect
    const { redirectToReferrer } = this.state;
    if (redirectToReferrer) {
      return <Redirect to="/" />;
    }

    return (
      <GoogleLogin
        className="w-100"
        clientId="679380407525-2cvoah9gpsjjffc5k1p6atahhf2vqfl4.apps.googleusercontent.com"
        buttonText="Login with Google"
        onSuccess={this.responseGoogle}
        onFailure={this.responseGoogle}
      />
    );
  }
}

export default SocialLogin;
