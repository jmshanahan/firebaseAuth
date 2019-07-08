import React from "react";
import { Link as RouterLink} from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
// import IconButton from '@material-ui/core/IconButton';
// import MenuIcon from '@material-ui/icons/Menu';

import Typography from "@material-ui/core/Typography";
import CssBaseline from "@material-ui/core/CssBaseline"
import SignOutButton from '../SignOut'
import * as ROUTES from "../../constants/routes";
import {withStyles} from '@material-ui/core/styles'
import Link from '@material-ui/core/Link'

const styles = theme => ({
    '@global':{
      body: {backgroundColor: theme.palette.common.white}
    },
    ul:{
      margin:0,
      padding:0
    },
    li:{
      listStyle:'none'
    },
    appBar:{
      borderBottom: `1px solid ${theme.palette.divider}`
    },
    toolbar:{
      flexWrap:'wrap'
    },
    toolbarTitle:{
      flexGrow:1
    },
    link:{
      margin: theme.spacing(1,1.5)
    },

    toolbarMargin: theme.mixins.toolbar

})

const AdapterLink = React.forwardRef((props, ref) =>(<RouterLink innerRef={ref}{...props}/>));

const Navigation = withStyles(styles)(({classes}) => (
  
      <React.Fragment>
      <CssBaseline/>
        <AppBar position="static" color="default" elevation={0} className={classes.appBar}>
          <Toolbar className={classes.toolbar}>
            <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
              Comeragh
            </Typography>
            <nav>
                <Link variant="button" color="textPrimary" to={ROUTES.SIGN_IN} component={AdapterLink} className={classes.link}>Sign In</Link>
                <Link variant="button" color="textPrimary" to={ROUTES.LANDING} component={AdapterLink} className={classes.link}>Landing</Link>
                <Link variant="button" color="textPrimary" to={ROUTES.HOME} component={AdapterLink} className={classes.link}>Home</Link>
                <Link variant="button" color="textPrimary" to={ROUTES.ACCOUNT} component={AdapterLink} className={classes.link}>Account</Link>
                <Link variant="button" color="textPrimary" to={ROUTES.ADMIN} component={AdapterLink} className={classes.link}>Admin</Link>
                <SignOutButton/>
            </nav>
          </Toolbar>
        </AppBar>
      </React.Fragment>
  
  ));

export default Navigation;
