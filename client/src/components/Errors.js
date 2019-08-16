import React from 'react';
import { Link } from 'react-router-dom';

const Error = ()=>{
    return(
        <div className="bounds">
            <h1>Error</h1>
            <p>Sorry! We have encountered an unexpcted error.</p>
            <Link to="/" className="button button-secondary">Return to Courses</Link>
        </div>
    )
}

export default Error;