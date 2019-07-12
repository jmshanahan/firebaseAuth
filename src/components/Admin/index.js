import React, { Component } from "react";
import { withFirebase } from "../Firebase";

class AdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      users: []
    };
  }
  componentDidMount() {
    this.setState({ loading: true });
    console.log(`Admin Page mounted`)
    this.props.firebase.users().on('value', snapshot => {
        const usersObject = snapshot.val();
        const usersList = Object.keys(usersObject).map(key => ({
            ...usersObject[key],
            uid: key
        }));
        console.log(`Object Length ${usersList.length}`);
        this.setState({
        users: usersList,
        loading: false
      });
    });
  }
  componentWillUnmount() {
    this.props.firebase.users().off();
  }
  render() {
      const {users, loading} = this.state;
    return (
      <div>
        <h1>Admin</h1>
        {loading && <div>Loading ...</div>}
        <UsersList users={users}/>
      </div>
    );
  }
}
const UsersList =({users}) =>(
    <ul>
    { users.map(user => (
        <li key={user.uid}>
            <span>ID: {user.uid}</span>
            <span>E-Mail: {user.email}</span>
            <span>Username: {user.username}</span> 
        </li> 
    ))}
    </ul>
)
export default withFirebase(AdminPage);
