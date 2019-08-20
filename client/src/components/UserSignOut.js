import React from 'react';
import { Redirect } from 'react-router-dom';

const UserSignOut = (props) => {

        props.signOut();
       
        return(        
            <Redirect to="/" />
        )         
}

export default UserSignOut;