import React from 'react';
import { Link } from 'react-router-dom';


const File = ( {id, text, weight} ) => {
    return (
        <div className="file">
            <p className="file-info">{id}</p>
            <p className="file-content">{text.split(' ').slice(0, 90).join(' ')} ...</p>
            <Link className="link" to={{pathname: '/about/' + id.slice(0, -4)}} >
                <li className="link">Read more...</li>
            </Link>
            <p className="file-relevance">Relevance: {weight}%</p>
        </div>
    );
};

export default File;