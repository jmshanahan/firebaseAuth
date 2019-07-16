import React from "react";
import AuthUserContext from "./context";
import { withFirebase } from "../Firebase";

const needsEmailVerification = authUser =>
  authUser &&
  !authUser.emailVerified &&
  authUser.providerData
    .map(provider => provider.providerId)
    .includes("password");

const withEmailVerification = Component => {
  class WithEmailVerification extends React.Component {
      constructor(props){
          super(props);
          this.state=({isSent: false})
      }
    onSendEmailVErification = () => {
      this.props.firebase.onSendEmailVerification()
      .then(()=> this.setState({isSent:true}))
    };
    render() {
      return (
        <AuthUserContext.Consumer>
          {authUser =>
            needsEmailVerification(authUser) ? (
              <div>
              {this.state.isSent ? (
                <p>
                  E-Mail confirmation sent: Check your E-mails (Spam folder included)
                  for confirmation E-Mail.
                  Refresh this page once you confirmed your E-mail.
                </p>
              ):(
                <p>
                  Verify your E-Mail: Check your E-Mails (Spam folder included)
                  for a confirmation E-Mail or send another confirmation E-Mail
                </p>
              )}
                <button type="button" disabled={this.state.isSent} onClick={this.onSendEmailVerification}>
                  Send confirmation E-Mail
                </button>
              </div>
            ) : (
              <Component {...this.props} />
            )
          }
        </AuthUserContext.Consumer>
      );
    }
  }
  return withFirebase(WithEmailVerification);
};
export default withEmailVerification;
