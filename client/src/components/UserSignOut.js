import React, { Component} from 'react';
import { Redirect } from 'react-router-dom';

class UserSignOut extends Component {

    componentDidMount(){
        this.props.signOut();
    }

    render(){        
        return(        
            <Redirect to="/" />
        )         
    }
}

export default UserSignOut;