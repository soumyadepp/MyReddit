import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client';
import { GET_ALL_POSTS,GET_ALL_POSTS_BY_TOPIC } from '../graphql/queries';
import Post from './Post';
import { Jelly } from '@uiball/loaders';

type FeedProps = {
    topic?: string;
}
function Feed({topic}:FeedProps) {
    const { data, error } = !topic ? useQuery(GET_ALL_POSTS) : useQuery(GET_ALL_POSTS_BY_TOPIC,{
        variables:{
            topic: topic,
        }
    });
    const posts: Post[] = !topic ? data?.getPostsList : data?.getPostsListByTopic;

    return (
        <div className="mt-5">
            {!posts && <div className="h-auto mt-4 flex items-center justify-center lg:w-[80vw] w-screen"><Jelly size={100} color="#ff4501"/></div>}
            {posts?.map((post: Post) => {
                return (
                    <Post key={post.id} post={post} />
                )
            })}
        </div>
    )
}

export default Feed