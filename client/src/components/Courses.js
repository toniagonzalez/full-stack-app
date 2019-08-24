import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import urlBase from '../config';

class Courses extends Component {

  constructor(props){
    super(props);

    this.state = {
      courses: [],
      loading: true,
      unhandledError: false
    }
  };

   //fetches courses API
  api = (path, method, body=null) => {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
      };

      if (body!== null ){
        options.body = JSON.stringify(body);
      }

      return fetch(path, options);
     
  }

  //displays courses retrieved from database 
  listCourses = ()=> {
    let courses = this.state.courses; 
    let courseList = '';
    if (courses.length > 0){
      courseList = courses.map( (course)=> 
        <div className="grid-33" key={course.id}>
          <Link className="course--module course--link" to={"/courses/" + course.id} >
            <h4 className="course--label">Course</h4>
            <h3 className="course--title">{course.title}</h3>
          </Link>   
        </div>  
      )
    }  else {
       courseList = "No courses found";
    }
    return courseList;
  }
  
  //calls GET method on courses API to retrieve all courses
  getCourses = async() => {
    let path = urlBase + '/courses';
    const response = await this.api(path, 'GET', null ).catch(()=>{});

    if (response !== null){
      return response.json();
    }
    else {
      return []
    }
        
  }

  //calls 'getCourses' on page mount
  componentDidMount(){  
      this.getCourses()
        .then(data => {
          if (data.courses !== undefined){
            this.setState({
              courses: data.courses,
              loading: false,
            })
          }
          else {
            throw new Error('Something went wrong!');
          }    
        })
        .catch(error => {
          console.log(error);
          this.setState({
            unhandledError: true,
            loading: false,
          })
        })    
  }
    
    render(){
      
     let courseList = this.listCourses();
     const loading = this.state.loading;
     
     //Redirects unhandled errors
     if (this.state.unhandledError){
       return (<Redirect to={'/error'} />)
     }

      return (
          <div>
            { loading ?
              <h3 className="loading">Loading...</h3>
              :
            <div className="main-page">
              { courseList }
              <div className="grid-33">
                <Link to="/courses/create" className="course--module course--add--module">
                  <h3 className="course--add--title">New Course</h3>
                </Link>
              </div>
            </div>
            }
          </div>
      );

    }  
}

export default Courses;