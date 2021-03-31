import React from 'react';
import File from './File'
import '../App.css';

const FileList = ( {pageNumber, data} ) => {
    debugger
    return (
        <div className="file-list">
            {data.slice(5 * (pageNumber), 5 * (pageNumber) + 5).map((item) =>(
                <File id={item.file} key={item.content.slice(0, -4)} text={item.content} weight={item.weight}/>
            ))}
            <p className="file-count">Showing {data.slice(5 * (pageNumber), 5 * (pageNumber) + 5).length} out of {data.length} entries</p>
        </div>
)
};

export default FileList;