import React from 'react';
import File from './File'
import '../App.css';

const FileList = ( {pageNumber, data} ) => {
    return (
        <div className="file-list">
            {data.slice(5 * pageNumber, 5 * pageNumber + 5).map(data =>(
                <File text={data.split(' ').slice(0, 90).join(' ')}/>
            ))}
        </div>
    )
};

export default FileList;