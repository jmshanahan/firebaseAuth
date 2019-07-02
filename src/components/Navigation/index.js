import React from "react";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import Typography from '@material-ui/core/Typography'
import * as ROUTES from "../../constants/routes";

const styles = theme => ({
    root:{
        flexGrow:1
    },
    flex:{
        flex:1
        
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20
      },
    toolbarMargin: theme.mixins.toolbar

});

const Navigation = withStyles(styles) (({classes})=> (
    <div>
      <AppBar position="fixed" color='default'>
      <Toolbar>
      <IconButton
          className={classes.menuButton}
          color="inherit"
          aria-label="Menu"
        >
          <MenuIcon />
        </IconButton>
        <Typography variant='h6' color="inherit" className={classes.flex}>
            Comeragh
        </Typography>
        <ul>
          <li>
            <Link to={ROUTES.SIGN_IN}>Sign In</Link>
          </li>
          <li>
            <Link to={ROUTES.LANDING}>Landing</Link>
          </li>
          <li>
            <Link to={ROUTES.HOME}>Home</Link>
          </li>
          <li>
            <Link to={ROUTES.ACCOUNT}>Account</Link>
          </li>
          <li>
            <Link to={ROUTES.ADMIN}>Admin</Link>
          </li>
        </ul>
      </Toolbar>
      </AppBar>
      <div className={classes.toolbarMargin} />

    </div>
  ))

export default Navigation;
