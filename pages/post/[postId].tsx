import { useMutation, useQuery } from '@apollo/client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Avatar from '../../components/Avatar';
import Post from '../../components/Post';
import { ADD_COMMENTS } from '../../graphql/mutations';
import { GET_COMMENTS_LIST_BY_ID, GET_POSTS_BY_POST_ID } from '../../graphql/queries';
import TimeAgo from 'react-timeago';

type FormData = {
    comment: string
}
function PostPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const { data: postData } = useQuery(GET_POSTS_BY_POST_ID, {
        variables: {
            post_id: router.query.postId
        }
    })
    const { data: commentData } = useQuery(GET_COMMENTS_LIST_BY_ID, {
        variables: {
            id: router.query.postId
        }
    })
    const comments = commentData?.getCommentsUsingPost_id;
    const [addComment] = useMutation(ADD_COMMENTS, {
        refetchQueries: [GET_POSTS_BY_POST_ID,'getPosts']
    });

    const onSubmit: SubmitHandler<FormData> = async (formData: FormData) => {
        const notification = toast.loading('Posting your comment...');
        try {
            const { data: { insertComments: newComment }, } = await addComment({
                variables: {
                    text: formData?.comment,
                    post_id: router.query.postId,
                    user_id: session?.user?.name,
                }
            });
            toast.success('Comment posted!', {
                id: notification
            });
            setValue('comment', '');
        } catch (error) {
            toast.error("Couldn't post your comment", {
                id: notification
            })
            console.log(error);
        }
    }
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<FormData>();
    const post: Post = postData?.getPosts;
    return (
        <div className="mx-auto my-7 max-w-5xl">
            <Post post={post} />
            <div className="-mt-1 bg-white rounded-b-md border border-t-0 border-gray-300 p-5 pl-16">
                <p className="text-sm">Comment as <span className="text-red-500">{session?.user?.name}</span></p>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-2">
                    <textarea {...register('comment')} disabled={!session} className="h-24 rounded-md border border-gray-200 p-2 pl-4 outline-none disabled:bg-gray-50"
                        placeholder={session ? "What are your thoughts?" : "Please sign in to comment"}
                    />
                    <button disabled={!session} type="submit" className="rounder-full bg-red-500 p-2 font-semibold text-white disabled:bg-gray-200 rounded-full">Comment</button>
                </form>
            </div>
            <div className="-my-5 rounded-b-md border-t-0 border-gray-300 bg-white p-5 px-10">
                <hr className="py-2" />
                {comments?.map((comment: Comments) => {
                    return (
                        <div className="relative flex items-center space-x-2 space-y-5" key={comment?.id}>
                            <hr className="absolute top-10 h-16 border left-7 z-0"/>
                            <div className="z-50">
                                <Avatar seed={comment?.user_id} />
                            </div>
                            <div className="flex flex-col">
                                <p className="py-2 text-xs text-gray-400">
                                    <span className="font-semibold text-gray-600 mr-2">u/{comment?.user_id}</span>
                                    {" "}
                                    <TimeAgo date={comment?.created_at} />
                                </p>
                                <p className="text-sm mt-1">{comment?.text}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default PostPage