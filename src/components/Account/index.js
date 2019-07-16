import React from "react";
import { AuthUserContext, withAuthorization, withEmailVerification } from "../Session";
import{compose} from 'recompose'
import { PasswordForgetForm } from "../PasswordForget";
import PasswordChangeForm from "../PasswordChange";

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

const condition = authUser => !!authUser;
export default compose(withEmailVerification,withAuthorization(condition))(Account);
