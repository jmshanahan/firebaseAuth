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
    provider: "twitterProvider"
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
      )
      .catch(error => this.setState({ error }));
  };
  onSocialLoginLink = provider => {
    this.props.firebase.auth.currentUser
      .linkWithPopup(this.props.firebase[provider])
      .then(this.fetchSignInMethods)
      .catch(error => this.setState({ error }));
  };
  onUnLink = providerId => {
    this.props.firebase.auth.currentUser
      .ulink(providerId)
      .then(this.fetchSignInMethods)
      .catch(error => this.setState({ error }));
  };

  onDefaultLoginLink = password => {
    const credential = this.props.firebase.emailAuthProvider.credential(
      this.props.authUser.email,
      password
    );
    this.props.firebase.auth.currentUser
      .linkAndRetrieveDataWithCredential(credential)
      .then(this.fetchSignInMethods)
      .catch(error => this.setState({ error }));
  };

  render() {
    const { activeSignInMethods, error } = this.state;
    return (
      <div>
        Sign In Methods:
        <ul>
          {SIGN_IN_METHODS.map(signInMethod => {
            const onlyOneLeft = activeSignInMethods.length === 1;
            const isEnabled = activeSignInMethods.includes(signInMethod.id);

            return (
              <li key={signInMethod.id}>
                {signInMethod.id === "password" ? (
                  <DefaultLoginToggle
                    onlyOneLeft={onlyOneLeft}
                    isEnabled={isEnabled}
                    signInMethod={signInMethod}
                    onLink={this.onDefaultLoginLink}
                    onUnLink={this.onUnLink}
                  />
                ) : (
                  <SocialLoginToggle
                    onlyOneLeft={onlyOneLeft}
                    isEnabled={isEnabled}
                    signInMethod={signInMethod}
                    onLink={this.onSocialLoginLink}
                    onUnLink={this.onUnLink}
                  />
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

class DefaultLoginToggle extends Component {
  constructor(props) {
    super(props);
    this.state = { passwordOne: "", passwordTwo: "" };
  }
  onSubmit = event => {
    event.preventDefault();
    this.props.onLink(this.state.passwordOne);
    this.setState({ passwordOne: "", passwordTwo: "" });
  };
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  render() {
    const { onlyOneLeft, isEnabled, signInMethod, onUnLink } = this.props;
    const { passwordOne, passwordTwo } = this.state;

    const isInvalid = passwordOne !== passwordTwo || passwordOne === "";
    return isEnabled ? (
      <button
        type="button"
        onClick={() => onUnLink(signInMethod.id)}
        disabled={onlyOneLeft}
      >
        Deactivate {signInMethod.id}
      </button>
    ) : (
      <form onSubmit={this.onSubmit}>
        <input
          name="passwordOne"
          value={passwordOne}
          onChange={this.onChange}
          type="password"
          placeholder="New Password"
        />
        <input
          name="passwordTwo"
          value={passwordTwo}
          onChange={this.onChange}
          type="password"
          placeholder="Confirm New Password"
        />
        <button disabled={isInvalid} type="submit">
          Link {signInMethod.id}
        </button>
      </form>
    );
  }
}

const SocialLoginToggle = ({
  onlyOneLeft,
  isEnabled,
  signInMethod,
  onLink,
  onUnLink
}) =>
  isEnabled ? (
    <button
      type="button"
      onClick={() => this.onUnLink(signInMethod.id)}
      disabled={onlyOneLeft}
    >
      Deactivate {signInMethod.id}
    </button>
  ) : (
    <button
      type="button"
      onClick={() => this.onSocialLoginLink(signInMethod.provider)}
    >
      Link {signInMethod}
    </button>
  );

const Account = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <div>
        <h1>Account: {authUser.email}</h1>

        <PasswordForgetForm />
        <PasswordChangeForm />
        <LoginManagement />
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
