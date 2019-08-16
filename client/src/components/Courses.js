import React, { Component } from 'react';
import { Link} from 'react-router-dom';
import urlBase from '../config';

class Courses extends Component {

  constructor(props){
    super(props);

    this.state = {
      courses: [],
      loading: true,
      error: false
    }
  };

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

      return fetch(path, options)
  }


  listCourses = ()=> {
    let courses = this.state.courses; 
    let courseList = '';
    if (courses.length){
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
  
  getCourses = async() => {
    let path = urlBase + '/courses';
    const getApi = await this.api(path, 'GET', null );
    return getApi.json();    
  }

  componentDidMount(){  
      this.getCourses()
        .then(data => {
            this.setState({
              courses: data.courses,
              loading: false,
            })
        })
        .catch(error => {
          console.log('Unable to fetch data');
        })    
  }
    
    render(){

     let courseList = this.listCourses();

      return (
        <div className="bounds">
          { courseList }
          <div className="grid-33">
            <Link to="/courses/create" className="course--module course--add--module">
              <h3 className="course--add--title">New Course</h3>
            </Link>
          </div>
        </div>
      );

    }  
}

export default Courses;