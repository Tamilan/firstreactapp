import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { authenticationService } from '../services/authenticationService';

export const PrivateRoute = ({ component: Component, roles, ...rest }) => (
    <Route {...rest} render={props => {
        //console.log(props);
        //const currentUser = authenticationService.currentUserValue;
        //console.log(currentUser);
        //authenticationService.is_valid();
        //console.log(authenticationService.is_valid());
        if (!authenticationService.is_valid()) {
            // not logged in so redirect to login page with the return url
            return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        }

        // check if route is restricted by role
        // if (roles && roles.indexOf(authenticationService.get_role()) === -1) {
        //     console.log(roles);
        //     // role not authorised so redirect to home page
        //     return <Redirect to={{ pathname: '/'}} />
        // }

        // authorised so return component
        return <Component {...props} />
    }} />
)