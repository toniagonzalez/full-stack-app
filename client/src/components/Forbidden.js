import React from 'react';
import { Link } from 'react-router-dom';

const Forbidden = ()=>{
    return(
        <div className="bounds">
            <h1>Forbidden</h1>
            <p>You are not authorized to edit/delete this course.</p>
            <Link to="/" className="button button-secondary">Return to Courses</Link>
        </div>
    )
}

export default Forbidden;