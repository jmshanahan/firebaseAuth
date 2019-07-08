import React,{Component} from "react";
import { Link as RouterLink , withRouter} from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import CssBaseline from "@material-ui/core/CssBaseline";
import * as ROUTES from '../../constants/routes';
import {withFirebase} from '../Firebase';

const styles = theme => ({
  "@global": {
    body: { backgroundColor: theme.palette.common.white }
  },
  ul: {
    margin: 0,
    padding: 0
  },
  li: {
    listStyle: "none"
  },

  toolbar: {
    flexWrap: "wrap"
  },
  toolbarTitle: {
    flexGrow: 1
  },
  link: {
    margin: theme.spacing(1, 1.5)
  },

});

const AdapterLink = React.forwardRef((props, ref) => (
  <RouterLink innerRef={ref} {...props} />
));

const SignUpPage = () => (
  <div>
    <h1>Signup</h1>
   <SignUpForm />
  </div>
);
const INITIAL_STATE = {
    username: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    error: null,
    };
    
class SignUpFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = {...INITIAL_STATE}
  }
  onSubmit = event => {
    const {username, email, passwordOne} = this.state;
    this.props.firebase.doCreateUserWithEmailAndPassword(email, passwordOne)
    .then(authUser =>{
        this.setState({...INITIAL_STATE});
        this.props.history.push(ROUTES.HOME);
    }).catch(error => {
        this.setState({error});
    })
    event.preventDefault();

  };
  onChange = event => {this.setState({[event.target.name]:event.target.value})};
  render() {
      const {
          username, email, passwordOne,passwordTwo,error
      }= this.state;
      const isInvalid = 
        passwordOne!== passwordTwo ||
        passwordOne ==='' ||
        email==='' ||
        username==='';

    return (<form onSubmit={this.onSubmit}>
    <input name="username" value={username} onChange={this.onChange} type="text" placeholder="Full Name"/>
    <input name="email" value={email} onChange={this.onChange} type="text" placeholder="Email Address"/>
    <input name="passwordOne" value={passwordOne} onChange={this.onChange} type="password" placeholder="Password"/>
    <input name="passwordTwo" value={passwordTwo} onChange={this.onChange} type="text" placeholder="Confirm Password"/>
    <button disabled={isInvalid} type="submit">Sign Up</button>
    {error && <p>{error.message}</p>}


    </form>
    )
  }
}

const SignUpLink = withStyles(styles)(({classes}) => (
  <p>
    Don't have an account? <Link variant="button" color="textPrimary" to={ROUTES.SIGN_UP} component={AdapterLink} className={classes.link}>Sign Up</Link>
  </p>
))
const SignUpForm = withRouter(withFirebase(SignUpFormBase));
export default SignUpPage;

export { SignUpForm, SignUpLink };
