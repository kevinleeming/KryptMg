import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

const Feed = () => {
    const [loading, setLoading] = useState(false);
    const { categoryName } = useParams();

    useEffect(() => {
        setLoading(true);
        if(categoryName){
            


        }
        else{
            


        }
    }, [categoryName])

    if(loading) return <Spinner message="Adding new idea..." />

    return (
        <div>
            
        </div>
    )
}

export default Feed
