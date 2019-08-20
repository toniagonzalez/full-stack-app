import React from 'react';
import { Link } from 'react-router-dom';

const Header = (props) => { 

        return(
            <div className="header">
                <div className="bounds">
                    <h1 className="header--logo">Courses</h1>
                    <nav>
                        {props.isAuthed ?
                            <div>
                                <span>Welcome, {props.isAuthed.user[0].firstName} {props.isAuthed.user[0].lastName}!</span>
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

export default Header;