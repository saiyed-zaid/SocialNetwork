import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import GoogleLogin from "react-google-login";

class SocialLogin extends Component {
  constructor() {
    super();
    this.state = {
      redirectToReferrer: false,
    };
  }

  responseGoogle = async (response) => {
    if (response.error) {
      return console.log(response.error);
    }
    const { googleId, name, email, imageUrl } = response.profileObj;
    const user = {
      password: googleId,
      name: name,
      email: email,
      imageUrl: imageUrl,
    };

    const responseApi = await this.props.socialLogin(user);
    if (responseApi.status === 200) {
      this.props.authenticate(responseApi.data, () => {
        this.setState({ redirectToReferrer: true });
      });
    } else {
      console.log("Error Login. Please try again..");
    }
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
        clientId="917310965900-697ehn1i25siarcg4otfav5obfa580ev.apps.googleusercontent.com"
        buttonText="Login with Google"
        onSuccess={this.responseGoogle}
        onFailure={this.responseGoogle}
      />
    );
  }
}

export default SocialLogin;
