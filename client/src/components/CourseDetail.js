import React, { Component } from 'react';
import { Link} from 'react-router-dom';
import urlBase from '../config';

class CourseDetail extends Component{

    constructor(props){
        super(props);
    
        this.state = {
          course: {},
          error: false,

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

    getCourse = async() => {
        let courseId = window.location.pathname.substr(9);
        let path = urlBase + '/courses/' + courseId;
        const getApi = await this.api(path, 'GET', null );
        return getApi.json();    
    }

    actionsBar = ()=>{
        return( 
                <div className="actions--bar">
                    <div className="bounds">
                        <div className="grid-100">
                            <span>
                                <Link className="button" to={"/courses/" + this.state.course.id + "/update"}>Update Course</Link>
                                <Link className="button" to="/">Delete Course</Link> 
                            </span>
                            <Link className="button button-secondary" to="/">Return to List</Link>
                        </div>
                    </div>
                </div>
        )
    }

    courseDetail = ()=>{
        
        return (
                <div className="bounds course--detail">
                    <div className="grid-66">
                        <div className="course-header">
                            <h4 className="course--label">Course</h4>
                            <h3 className="course-title">{this.state.course.title}</h3>
                            <p>Created by User: {this.state.course.userId}</p>
                        </div>
                        <div className="course--description">
                            <p>{this.state.course.description}</p>
                        </div>
                    </div>
                    <div className="grid-25 grid-right">
                        <div className="course--stats">
                            <ul className="course--stats--list">
                                <li className="course--stats--list--item">
                                    <h4>Estimated Time</h4>
                                    <h3>{this.state.course.estimatedTime}</h3>
                                </li>
                                <li className="course--stats--list--item">
                                    <h4>Materials Needed</h4>
                                    <p>
                                        {this.state.course.materialsNeeded}
                                    </p>
                                </li>
                            </ul> 
                        </div>
                    </div>                       
                </div>
        )
    }

    componentDidMount(){  
        this.getCourse()
          .then(data => {
            this.setState({
                course: data.course,
                loading: false,
            })
          })
          .catch(error => {
            console.log('Unable to fetch data');
          })    
    }

    render(){
        const actionsBar = this.actionsBar();
        const courseDetail = this.courseDetail();

        return(
            <div>
                { actionsBar }
                { courseDetail }
            </div>
           
        )
    }
}

export default CourseDetail;