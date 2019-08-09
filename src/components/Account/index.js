import React, { Component } from "react";
import {
  AuthUserContext,
  withAuthorization,
  withEmailVerification
} from "../Session";
import { withFirebase } from "../Firebase";
import { compose } from "recompose";
import { PasswordForgetForm } from "../PasswordForget";
import PasswordChangeForm from "../PasswordChange";

const SIGN_IN_METHODS = [
  {
    id: "password",
    provider: null
  },
  {
    id: "google.com",
    provider: "googleProvider"
  },
  {
    id: "facebook.com",
    provider: "facebookProvider"
  },
  {
    id: "twitter.com",
    provider: "twitter.com"
  }
];

class LoginManagementBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSignInMethods: [],
      error: null
    };
  }
  componentDidMount() {
    this.fetchSignInMethods();
  }
  fetchSignInMethods = () => {
    this.props.firebase.authUser
      .fetchSignInMethodsForEmail(this.props.authUser.email)
      .then(activeSignInMethods =>
        this.setState({ activeSignInMethods, error: null })
      ).catch(error => this.setState({error}))
  };
  onSocialLoginLink = provider => {

  };
  onUnLink = providerId => {

  };
  render() {
    const { activeSignInMethods } = this.state;
    return (
      <div>
        Sign In Methods:
        <ul>
          {SIGN_IN_METHODS.map(signInMethod => {
            return (
              <li key={signInMethod.id}>
                {isEnabled ? (
                  <button type="button" onClick={() => {}}>
                    Deactivate {signInMethod.id}
                  </button>
                ) : (
                  <button type="button" onClick={() => {}}>
                    Link {signInMethod}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
        {error && error.message}
      </div>
    );
  }
}

const Account = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <div>
        <h1>Account: {authUser.email}</h1>

        <PasswordForgetForm />
        <PasswordChangeForm />
      </div>
    )}
  </AuthUserContext.Consumer>
);
const LoginManagement = withFirebase(LoginManagementBase);
const condition = authUser => !!authUser;
export default compose(
  withEmailVerification,
  withAuthorization(condition)
)(Account);
