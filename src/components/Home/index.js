import React, {Component} from 'react'
import {compose} from 'recompose';
import {withAuthorization, withEmailVerification}  from '../Session'
import {withFirebase} '../Firebase'

const HomePage = () => {
    return (
        <div>
            <h1>Home</h1>
            <p>The Home Page is accessible to every signed in user.</p>
            <Messages />
        </div>
    )
}

const MessageList = ({messages}) =>{
<ul>
    {messages.map(messages => (
        <MessageItem key={messages.uid} message={message}/>
    ))}
</ul>
}
const MessageItem = ({message}) => {
    <li>
        <strong>{message.userId}</strong>{message.text}
    </li>
}

class MessagesBase extends Component{
    constructor(props){
        super(props)
        this.state ={
            loading: false,
            messages:[],
        }
    }
    componentDidMount(){
        this.setState({loading: true});
        this.props.firebase.messages().on('value',snapshot =>{
            const messageObject = snapsot.val();
            if(messageObject){
                // convert messages list from snapshot
                this.setState({loading: false})
                const messageList = Object.keys(messageObject).map(key =>({
                    ...messageObject[key],
                    uid:key
                }))
                this.setState({
                    messages: messageList,
                    loading: false
                })
            } else {
                this.setState({messages: null, loading: false});
            }
        })
    }
    render(){
        const {messages, loading} = this.state;
        return(
            <div>
                {loading && <div>Loading ...</div>}
                {messages ? (
                <MessageList  messages={messages}/>
                ):(
                    <div>There are no messages ... </div>
                )
                
                }
            </div>
        )
    }
}


const Messages = withFirebase(MessagesBase);

const condition = authUser => !!authUser;
export default compose(withEmailVerification,withAuthorization(condition))(HomePage)
