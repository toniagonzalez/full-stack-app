import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Header extends Component{ 

    
    render(){
        const isAuthed = this.props.isAuthed;

        return(
            <div className="header">
                <div className="bounds">
                    <h1 className="header--logo">Courses</h1>
                    <nav>
                        {isAuthed ?
                            <div>
                                <span>Welcome, {isAuthed.user[0].firstName} {isAuthed.user[0].lastName}!</span>
                                <Link className="signout" to="/signOut">Sign Out</Link>
                            </div>
                        :
                            <div>
                                <Link to="/signup" className="signup">Sign Up</Link>
                                <Link to="/signin" className="signin" >Sign In</Link>
                            </div>
                        }
                    </nav>
                </div>    
            </div>
        )
    
    }
}

export default Header;