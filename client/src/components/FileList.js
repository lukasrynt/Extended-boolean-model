import React from 'react';
import File from './File'
import '../App.css';

const FileList = ( {pageNumber, data} ) => {
    return (
        <div className="file-list">
            {data.slice(5 * pageNumber, 5 * pageNumber + 5).map(data =>(
                <File id={data.id} text={data.content}/>
            ))}
        </div>
    )
};

export default FileList;