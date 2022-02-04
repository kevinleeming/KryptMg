import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';

import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import { TransactionContext } from '../context/TransactionContext';

const Feed = ({ user }) => {
    const { allPost, fetchPost, postExist } = useContext(TransactionContext);

    const [loading, setLoading] = useState(false);
    const { categoryName } = useParams();

    const fetch = async (categoryName) => {
        await fetchPost(categoryName);
        setLoading(false);
    }

    useEffect(() => {
        setLoading(true);
        if(categoryName){
            fetch(categoryName);
        }
        else{
            fetch('all');
        }
    }, [categoryName])

    const ideaName = categoryName || 'new';
    if(loading) return <Spinner message={`Adding ${ideaName} idea...`} />

    return (
        <div>
            {!postExist ? 
                <Spinner message={`Adding ${ideaName} idea...`} /> :
                <MasonryLayout pins={allPost} user={user} />
            }
        </div>
    )
}

export default Feed
