import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

class UserSignUp extends Component {

    constructor(props){
        super(props);
        this.state = {
            errors: [],
            unhandledError: false,
            firstName: '',
            lastName: '',
            emailAddress: '',
            password: '',
            confirmPassword: ''
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

    //calls 'createUser' from props
    //if valid user calls 'signIn' from props 
    //else display validation errors
    signUp = async(user, username, password) => {
        const response = await this.props.createUser(user).catch(()=>{});
        if (response === undefined){
            this.setState({
                unhandledError: true
            })
        }
        else{
            await this.props.createUser(user).then( errors => {
                if (errors) {
                    this.setState({ errors });
                  }
                  else {
                      this.props.signIn(username, password)
                      .then(() => {
                          this.props.history.push('/');    
                      });
                  } 
    
            })
            .catch( err => {
                console.log(err);
            })
        }

    }

    //calls 'signUp' on form submission & handles validation errors
    handleSubmit = async (event)=> { 
       await  event.preventDefault();
        let password = this.state.password[0];
        let firstName = this.state.firstName[0];
        let lastName = this.state.lastName[0];
        let emailAddress = this.state.emailAddress[0];

        const user = {
            password,
            firstName,
            lastName,
            emailAddress
        }
        
        this.signUp(user, emailAddress, password);
    }   

    render(){
        const errors = this.state.errors;

        //Redirects unhandled errors
        if (this.state.unhandledError){
            return (
                <Redirect to={'/error'}/>
            )
        }

        return(
            <div className="bounds">
                <div className="grid-33 centered signin">
                    <h1>Sign Up</h1>
                    {errors.length ?
                        <div>
                            <h2 className="validation--errors--label">Validation errors</h2>
                            <div className="validation-errors">
                                <ul>
                                    {errors.map((error, i) => <li key={i}>{error}</li>)}
                                </ul>
                            </div>
                        </div>
                        :
                        []
                    }
                    
                    <div>
                        <form onSubmit={this.handleSubmit}>
                            <div>
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    value={this.state.firstName}
                                    onChange={this.handleInputChange} 
                                    placeholder="First Name"
                                />
                            </div>
                            <div>
                                <input
                                    id="lastName" 
                                    name="lastName" 
                                    type="text" 
                                    value={this.state.lastName} 
                                    onChange={this.handleInputChange}
                                    placeholder="Last Name"
                                />
                            </div>
                            <div>
                                <input 
                                    id="emailAddress" 
                                    name="emailAddress" 
                                    type="text" 
                                    value={this.state.emailAddress}
                                    onChange={this.handleInputChange}
                                    placeholder="Email Address"
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
                                />
                            </div>
                            <div>
                                <input 
                                    id="confirmPassword" 
                                    name="confirmPassword" 
                                    type="password"
                                    value={this.state.confirmPassword}
                                    onChange={this.handleInputChange} 
                                    placeholder="Confirm Password"
                                />
                            </div>
                            <div className="grid-100 pad-bottom">
                                <button className="button" type="submit">Sign Up</button>
                                <Link to="/" className="button button-secondary">Cancel</Link>
                            </div>
                        </form> 
                    </div> 
                    <p>
                        Already have a user account? 
                        <Link to="/signIn"> Click here </Link>
                        to sign in!
                    </p> 
                </div>  
            </div>
        )
    }

}

export default UserSignUp;
