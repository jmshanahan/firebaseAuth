import React, { Component } from "react";
import { compose } from "recompose";
import cuid from 'cuid';

import {
  AuthUserContext,
  withAuthorization,
  withEmailVerification
} from "../Session";
import { withFirebase } from "../Firebase";

class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      users: []
    };
  }

  componentDidMount() {
    this.props.firebase.users().on("value", snapshot => {
      const userObject = snapshot.val();
      if (userObject) {
        const userList = Object.keys(userObject).map(key => ({
          ...userObject[key],
          uid: key
        }));
      this.setState({
        users: userList,
        loading: false
      });
    }else{
      this.setState({users: null})
    }
  })}
  componentWillUnmount() {
    this.props.firebase.users().off();
  }
  render() {
    const {users, loading} = this.state;
    return (
      <div>
        <h1>Home</h1>
        <p>The Home Page is accessible to every signed in user.</p>

        {users ? (<UserList users={users}/>) :(
          <div> There are no users</div>
        ) }
        
        
        {/* {users ?  <Messages users={users}/> : null } */}
        
      </div>
    );
  }
}

const UserList = ({ users  }) => (
  <ul>
    {users.map(user => (
      <UserItem key={user.uid} user={user}/>
    ))}
  </ul>
);
const UserItem = ({user}) =>(
  <li >
      <strong>{user.email}</strong>{user.uid}
  </li>
)

const MessageList = ({ messages, onEditMessage, onRemoveMessage }) => (
  <ul>
    {messages.map(message => (
      <MessageItem
        key={message.uid}
        message={message}
        onEditMessage={onEditMessage}
        onRemoveMessage={onRemoveMessage}
      />
    ))}
  </ul>
);

class MessageItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      editText: this.props.message.text
    };
  }
  onToggleEditMode = () => {
    this.setState(state => ({
      editMode: !state.editMode,
      editText: this.props.message.text
    }));
  };
  onChangeEditText = event => {
    this.setState({ editText: event.target.value });
  };
  onSaveEditText = () => {
    this.props.onEditMessage(this.props.message, this.state.editText);
    this.setState({ editMode: false });
  };
  render() {
    const { message, onRemoveMessage } = this.props;
    const { editMode, editText } = this.state;
    return (
      <li key={message.key}>
        {editMode ? (
          <input
            type="text"
            value={editText}
            onChange={this.onChangeEditText}
          />
        ) : (
          <span>
          <strong>{ message.user.userId}</strong>
            <strong>{message.userId}</strong> {message.text}
            {message.editedAt && <span>Edited</span>}
          </span>
        )}

        {editMode ? (
          <span>
            <button onClick={this.onSaveEditText}>Save</button>
            <button onClick={this.onToggleEditMode}>Reset</button>
          </span>
        ) : (
          <button onClick={this.onToggleEditMode}>Edit</button>
        )}

        {!editMode && (
          <button type="button" onClick={() => onRemoveMessage(message.uid)}>
            Delete
          </button>
        )}
      </li>
    );
  }
}

class MessagesBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      loading: true,
      messages: [],
      limit: 5
    };
  }
  onChangeText = event => {
    this.setState({ text: event.target.value });
  };
  onCreateMessage = (event, authUser) => {
    this.props.firebase.messages().push({
      text: this.state.text,
      userId: authUser.uid,
      createdAt: this.props.firebase.serverValue.TIMESTAMP
    });
    this.setState({ text: "" });
    event.preventDefault();
  };
  onEditMessage = (message, text) => {
    this.props.firebase.message(message.uid).set({
      ...message,
      text,
      editedAt: this.props.firebase.serverValue.TIMESTAMP
    });
  };
  onListenForMessages = () => {
    this.setState({ loading: true });
    // convert messages list from snapshot
    const { limit } = this.state;
    this.props.firebase
      .messages()
      .orderByChild("createdAt")
      .limitToLast(limit)
      .on("value", snapshot => {
        const messageObject = snapshot.val();
        if (messageObject) {
          const messageList = Object.keys(messageObject).map(key => ({
            ...messageObject[key],
            uid: key
          }));
          this.setState({ messages: messageList, loading: false });
        } else {
          this.setState({ messages: null, loading: false });
        }
      });
  };

  onNextPage = () => {
    this.setState(
      state => ({ limit: state.limit + 5 }),
      this.onListenForMessages
    );
  };

  componentDidMount() {
    this.onListenForMessages();
  }
  componentWillUnmount() {
    this.props.firebase.messages().off();
  }
  onRemoveMessage = uid => {
    this.props.firebase.message(uid).remove();
  };

  render() {
    const {users} = this.props;
    const { text, messages, loading } = this.state;
    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <div>
            {!loading && messages && (
              <button type="button" onClick={this.onNextPage}>
                More
              </button>
            )}

            {loading && <div>Loading...</div>}
            {messages ? (
              <MessageList
                messages={messages.map(message => ({
                  ...message,
                  user: users ? users[message.userId]:{userId:message.userId}
                }))}
                onEditMessage={this.onEditMessage}
                onRemoveMessage={this.onRemoveMessage}
              />
            ) : (
              <div>There are no messages ...</div>
            )}
            <form onSubmit={event => this.onCreateMessage(event, authUser)}>
              <input type="text" value={text} onChange={this.onChangeText} />
              <button type="submit">Send</button>
            </form>
          </div>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

const Messages = withFirebase(MessagesBase);

const condition = authUser => !!authUser;
export default compose(
  withFirebase,
  withEmailVerification,
  withAuthorization(condition)
)(HomePage);
