import React, { Component } from "react";
import { compose } from "recompose";

import {
  withAuthorization,
  withEmailVerification
} from "../Session";

const HomePage = () =>(
  <div>
    <h1>Home Page</h1>
    <Messages />
  </div>
)

const condition = authUser => !!authUser;
export default compose(
  withEmailVerification,
  withAuthorization(condition)
)(HomePage);
