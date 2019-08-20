import React, { Component } from "react";
import { AuthUserContext } from "../Session";
import { withFirebase } from "../Firebase";
import MessageList from "./MessageList";
import { Card, Message, Button, Loader, Form, Icon } from "semantic-ui-react";

class MessagesBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: "",
      loading: false,
      messages: [],
      limit: 5
    };
  }

  componentDidMount() {
    this.onListenForMessages();
  }

  onListenForMessages = () => {
    this.setState({ loading: true });

    this.props.firebase
      .messages()
      .orderByChild("createdAt")
      .limitToLast(this.state.limit)
      .on("value", snapshot => {
        const messageObject = snapshot.val();

        if (messageObject) {
          const messageList = Object.keys(messageObject).map(key => ({
            ...messageObject[key],
            uid: key
          }));

          this.setState({
            messages: messageList,
            loading: false
          });
        } else {
          this.setState({ messages: null, loading: false });
        }
      });
  };

  componentWillUnmount() {
    this.props.firebase.messages().off();
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

  onRemoveMessage = uid => {
    this.props.firebase.message(uid).remove();
  };

  onNextPage = () => {
    this.setState(
      state => ({ limit: state.limit + 5 }),
      this.onListenForMessages
    );
  };

  render() {
    const { users } = this.props;
    const { text, messages, loading } = this.state;

    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <Card fluid={true}>
            <Card.Content>
              <Card.Description>
                {!loading && messages && (
                  <Button type="button" onClick={this.onNextPage}>
                    More
                  </Button>
                )}
                {loading && <Loader active inline="centered" />}
                {messages && (
                  <MessageList
                    authUser={authUser}
                    messages={messages}
                    onEditMessage={this.onEditMessage}
                    onRemoveMessage={this.onRemoveMessage}
                  />
                )}
                {!messages && (
                  <Message info>
                    <p>There are no messages ...</p>
                  </Message>
                )}
                <form onSubmit={event => this.onCreateMessage(event, authUser)}>
                  <Form.TextArea
                    value={text}
                    onChange={this.onChangeText}
                    placeholder="Enter your message here..."
                  />
                  <Button type="submit">
                    Send
                    <Icon name="send" />
                  </Button>
                </form>
              </Card.Description>
            </Card.Content>
          </Card>
        )}
      </AuthUserContext.Consumer>
    );
  }
}
export default withFirebase(MessagesBase);
