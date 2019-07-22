import React, { Component } from "react";
import { compose } from "recompose";
import {
  AuthUserContext,
  withAuthorization,
  withEmailVerification
} from "../Session";
import { withFirebase } from "../Firebase";

const HomePage = () => {
  return (
    <div>
      <h1>Home</h1>
      <p>The Home Page is accessible to every signed in user.</p>
      <Messages />
    </div>
  );
};

const MessageList = ({ messages, onRemoveMessage }) => (
  <ul>
    {messages.map(message => (
      <MessageItem key={message.key} message={message} onRemoveMessage={onRemoveMessage}/>
    ))}
  </ul>
);
const MessageItem = ({ message, onRemoveMessage }) => (
  <li>
    <strong>{message.userId}</strong> {message.text}
    <button type="button" onClick={() => onRemoveMessage(message.uid)}>Delete</button>
  </li>
);

class MessagesBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      loading: false,
      messages: []
    };
  }
  onChangeText = event => {
    this.setState({ text: event.target.value });
  };
  onCreateMessage = (event, authUser) => {
    this.props.firebase.messages().push({
      text: this.state.text,
      userId: authUser.uid
    });
    this.setState({ text: "" });
    event.preventDefault();
  };
  componentDidMount() {
    // convert messages list from snapshot
    this.props.firebase.messages().on("value", snapshot => {
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

    this.setState({ loading: false });
  }
  componentWillUnmount() {
    this.props.firebase.messages().off();
  }
  onRemoveMessage = uid => {
    this.props.firebase.message(uid).remove();
  }
  render() {
    const { text, messages, loading } = this.state;
    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <div>
            {loading && <div>Loading...</div>}
            {messages ? (
              <MessageList messages={messages} onRemoveMessage={this.onRemoveMessage} />
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
  withEmailVerification,
  withAuthorization(condition)
)(HomePage);
