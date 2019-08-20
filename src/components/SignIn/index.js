import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { SignUpLink } from "../SignUp";
import { PasswordForgetLink } from "../PasswordForget";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";
import {
  Grid,
  Form,
  Button,
  Header,
  Icon,
  Message,
  Divider
} from "semantic-ui-react";

const SignInPage = () => (
  <Grid centered columns={2}>
    <Grid.Column>
      <Header as="h2" textAlign="center">
        Sign In
      </Header>
      <SignInForm />
      <SignInGoogle />
      <SignInFaceBook />
      <SignInTwitter />
      <PasswordForgetLink />
      <SignUpLink />
    </Grid.Column>
  </Grid>
);
const INITIAL_STATE = {
  email: "",
  password: "",
  error: null
};

class SignInFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }
  onSubmit = event => {
    const { email, password } = this.state;
    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => this.setState({ error }));
    event.preventDefault();
  };
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  render() {
    const { email, password, error } = this.state;
    const isInvalid = password === "" || email === "";
    return (
      <Form onSubmit={this.onSubmit}>
        <Form.Field>
          <label>Email</label>
          <input
            name="email"
            value={email}
            onChange={this.onChange}
            type="text"
            placeholder="Email Address"
          />
        </Form.Field>

        <Form.Field>
          <label>Password</label>
          <input
            name="password"
            value={password}
            onChange={this.onChange}
            type="password"
            placeholder="Password"
          />
        </Form.Field>
        <Form.Field >
          <Button disabled={isInvalid} type="submit">
            Submit
          </Button>
        </Form.Field>
        {error && (
          <Message negative>
            <p>{error.message}</p>
          </Message>
        )}
        <PasswordForgetLink/>
        <Divider horizontal>Or sign with</Divider>
      </Form>
    );
  }
}

class SignInGoogleBase extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  onSubmit = event => {
    this.props.firebase
      .doSignInWithGoogle()
      .then(socialAuthUser => {
        //Create the user in your Firebase Realtime database too
        return this.props.firebase.user(socialAuthUser.user.uid).set({
          username: socialAuthUser.user.displayName,
          email: socialAuthUser.additionalUserInfo.profile.email,
          roles: []
        });
      })
      .then(() => {
        this.setState({ error: null });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({ error });
      });
    event.preventDefault();
  };
  render() {
    const { error } = this.state;
    return (
      <form onSubmit={this.onSubmit} className="inline">
        <Button color='google plus' type="submit"><Icon name="google"/>Google</Button>
        {error && <Message negative ><p>{error.message}</p></Message>}
      </form>
    );
  }
}

class SignInFacebookBase extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  onSubmit = event => {
    this.props.firebase
      .doSignInWithFacebook()
      .then(socialAuthUser => {
        return this.props.firebase.user(socialAuthUser.user.uid).set({
          username: socialAuthUser.additionalUserInfo.profile.name,
          email: socialAuthUser.additionalUserInfo.profile.email,
          roles: []
        });
      })
      .then(() => {
        this.setState({ error: null });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({ error });
      });
    event.preventDefault();
  };
  render() {
    const { error } = this.state;
    return (
      <form onSubmit={this.onSubmit} className="inline">
        <Button color="facebook" type="submit"><Icon name="facebook"/>Facebook</Button>
        {error && <Message negative><p>{error.message}</p></Message>}
      </form>
    );
  }
}

class SignInTwitterBase extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  onSubmit = event => {
    this.props.firebase
      .doSignInWithTwitter()
      .then(socialAuthUser => {
        return this.props.firebase.user(socialAuthUser.user.uid).set({
          username: socialAuthUser.additionalUserInfo.profile.name,
          email: socialAuthUser.additionalUserInfo.profile.email,
          roles: []
        });
      })
      .then(() => {
        this.setState({ error: null });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => this.setState({ error }));
    event.preventDefault();
  };
  render() {
    const { error } = this.state;
    return (
      <form onSubmit={this.onSubmit} className="inline">
        <Button color="twitter" type="submit"><Icon name="twitter"/>Twitter</Button>
        {error && <Message negative><p>{error.message}</p></Message>}
      </form>
    );
  }
}

const SignInForm = compose(
  withRouter,
  withFirebase
)(SignInFormBase);
const SignInGoogle = compose(
  withRouter,
  withFirebase
)(SignInGoogleBase);
const SignInFaceBook = compose(
  withRouter,
  withFirebase
)(SignInFacebookBase);
const SignInTwitter = compose(
  withRouter,
  withFirebase
)(SignInTwitterBase);
export { SignInForm, SignInGoogle, SignInFaceBook, SignInTwitter };
export default SignInPage;
