import React, { Component} from 'react';
import { Switch, Route } from 'react-router-dom';
import urlBase from './config';
import Cookies from 'js-cookie';

//Components
import Header from './components/Header';
import Courses from './components/Courses';
import CreateCourse from './components/CreateCourse';
import UpdateCourse from './components/UpdateCourse';
import CourseDetail from './components/CourseDetail';
import UserSignUp from './components/UserSignUp';
import UserSignIn from './components/UserSignIn';
import UserSignOut from './components/UserSignOut';
import NotFound from './components/NotFound';
import Errors from './components/Errors';

class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      authenticatedUser: Cookies.getJSON('authenticatedUser') || null,
      errors: []
    }
  };

  api = (path, method = 'GET', body = null, requiresAuth = false, credentials =  null) => {
    const url = urlBase + path;
  
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    };

    if (body !== null) {
      options.body = JSON.stringify(body); 
    }

    if(requiresAuth) {
      const encodedCredentials = btoa(`${credentials.username}:${credentials.password}`);

      options.headers['Authorization'] = `Basic ${encodedCredentials}`;
    }

    return fetch(url, options);
  }

  getUser= async(username, password) => {
    const response = await this.api(`/users`, 'GET', null, true, { username, password });
    if (response.status === 200) {
      return response.json().then(data => data);
    }
    else if (response.status === 401) {
      return null;
    }
    else {
      this.setState({ errors: response.errors });
    }
  }
  
  createUser = async(user) => {
    const response = await this.api('/users', 'POST', user);
    if (response.status === 201) {
      return [];
    }
    else if (response.status === 400) {
      return response.json().then(data => {
        return data.errors;
      });
    }
    else {
      this.setState({ errors: response.errors });
    }
  }


  signIn = async (username, password) => {
    const user = await this.getUser(username, password);
    if(user !== null){

      this.setState( () => {
        return {
          authenticatedUser: user
        }

    });

    //Set cookie on SignIn
    Cookies.set('authenticatedUser', JSON.stringify(user), { expires: 1 });
    }

    return user;
  }

  signOut = () => {

      this.setState( ()=> {
      return { 
          authenticatedUser: null 
      }
      });

      //Remove cookie on SignOut
      Cookies.remove('authenticatedUser');
  }

  render() {
    return (
      <div>
        <Header isAuthed={this.state.authenticatedUser} signOut={this.signOut}/>
        <Switch>       
            <Route exact path="/" component={Courses} />
            <Route
              path="/signin" 
              render={ (props) => 
                <UserSignIn 
                  {...props} 
                  isAuthed={this.state.authenticatedUser} 
                  signIn={this.signIn}
               />
              }
            />
            <Route 
              path="/signup" 
              render={(props) => 
                <UserSignUp 
                  {...props} 
                  isAuthed={this.state.authenticatedUser} 
                  createUser={this.createUser}
                  signIn={this.signIn}
               />

              }
              />
            <Route 
              path="/signout" 
              render={ (props) => 
                <UserSignOut
                  {...props}
                  signOut={this.signOut}
                />
             }
            />  
            <Route 
              path="/courses/create" 
              render={ (props) =>
                <CreateCourse
                {...props}
                isAuthed={this.state.authenticatedUser} 
                />
              }
            />
            <Route 
              path="/courses/:id/update" 
              render={ (props) =>
                <UpdateCourse
                {...props}
                isAuthed={this.state.authenticatedUser} 
                />
              }
            />
            <Route path="/courses/:id" component={CourseDetail}/>
            <Route path="/errors" component={Errors}/>
            <Route component={NotFound}/>
        </Switch>
      </div>
    );

  }
  
}

export default App;
