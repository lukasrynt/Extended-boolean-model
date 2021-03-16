import React from 'react';
import File from './File'
import '../App.css';

const FileList = ( {pageNumber, data} ) => {
    return (
        <div className="file-list">
            {data.slice(5 * (pageNumber), 5 * (pageNumber) + 5).map(file =>(
                <File text={file.content} data={data}/>
            ))}
        </div>
    )
};

export default FileList;