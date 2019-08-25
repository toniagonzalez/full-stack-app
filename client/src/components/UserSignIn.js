import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class UserSignIn extends Component {

    constructor(props){
        super(props);
        this.state = {
            emailAddress: '',
            password: '' 
        };
    }
    

    //sets state to form input values on entry
    handleInputChange = (event) => {
        const value = event.target.value;
        const name = event.target.name;

        this.setState({
            [name]: [value]
        });
    }

     //calls 'signIn' from props on form submission
    handleSubmit = async (event)=> {
        event.preventDefault();
        const  from  = this.props.location.state ? this.props.location.state.from.pathname : this.props.history.goBack();
   
        await this.props.signIn(this.state.emailAddress, this.state.password)
            .then(user => {
                if (user === null) {  
                    this.props.history.push('/error');                     
               }
                if (this.props.redirect === true) { 
                    this.props.history.push(from);              
                } 
            })
            .catch( () => {});   
    }

    render(){
       
        return(
            <div className="bounds">
                <div className="grid-33 centered signin">
                    <h1>Sign In</h1>
                    <div>
                        <form onSubmit={this.handleSubmit}>
                            <div>
                                <input 
                                    id="emailAddress" 
                                    name="emailAddress" 
                                    type="text" 
                                    value={this.state.emailAddress}
                                    onChange={this.handleInputChange}
                                    placeholder="Email Address"
                                    required
                                />
                            </div>
                            <div>
                                <input 
                                    id="password" 
                                    name="password" 
                                    type="password"
                                    value={this.state.password}
                                    onChange={this.handleInputChange}
                                    placeholder="Password" 
                                    required
                                />
                            </div>
                            <div className="grid-100 pad-bottom">
                                    <button className="button" type="submit" >Sign In</button>
                                    <Link to="/" className="button button-secondary">Cancel</Link>
                            </div>
                        </form> 
                    </div> 
                    <p>
                        Don't have a user account? 
                        <Link to="/signup"> Click here </Link>
                        to sign up!
                    </p> 
                </div>  
            </div>
        )
    }

}

export default UserSignIn;