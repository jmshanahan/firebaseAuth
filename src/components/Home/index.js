import React from 'react'
import {compose} from 'recompose';
import {withAuthorization, withEmailVerification}  from '../Session'

const HomePage = () => {
    return (
        <div>
            <h1>Home</h1>
            <p>The Home Page is accessible to every signed in user.</p>
        </div>
    )
}
const condition = authUser => !!authUser;
export default compose(withEmailVerification,withAuthorization(condition))(HomePage)
