import React, { useEffect, useState } from 'react'
import { ArrowDownIcon, ArrowUpIcon, BookmarkIcon, ShareIcon, ChatAltIcon, DotsHorizontalIcon, GiftIcon } from '@heroicons/react/outline';
import Avatar from './Avatar';
import TimeAgo from 'react-timeago';
import Link from 'next/link';
import { Jelly } from '@uiball/loaders';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_VOTE } from '../graphql/mutations';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { GET_VOTES_BY_POST_ID } from '../graphql/queries';

type PostProps = {
    post: Post
}
function Post({ post }: PostProps) {
    const [voted, setVoted] = useState<boolean>();
    const [addVote] = useMutation(ADD_VOTE, {
        refetchQueries: [GET_VOTES_BY_POST_ID, 'getVotesUsingPost_id']
    });

    const { data: session } = useSession();
    const { data, loading, error } = useQuery(GET_VOTES_BY_POST_ID, {
        variables: {
            post_id: post?.id,
        }
    })

    const upVote = async (vote: boolean) => {
        if (!session) {
            toast("Please sign in to vote");
            return;
        }
        if (vote === true && voted) return;
        if (vote == false && voted === false) return;
        try {
            await addVote({
                variables: {
                    post_id: post?.id,
                    username: session?.user?.name,
                    upvote: vote
                }
            })
        } catch (error) {
            toast.error("Something went wrong");
            console.log(error);
        }
    }
    const displayVotes = (data: any) => {
        const votes: Vote[] = data?.getVotesUsingPost_id;
        const displayNumber = votes?.reduce((total,vote) => vote?.upvote ? total += 1 : total -= 1,0)
        if(votes?.length === 0){
            return 0;
        } 
        if(displayNumber === 0){
            return votes[0]?.upvote ? 1 : -1;
        }
        return displayNumber;
    }
    useEffect(() => {
        const votes: Vote[] = data?.getVotesUsingPost_id;
        console.log(data);
        const vote = votes?.find(vote => vote?.username == session?.user?.name)?.upvote;
        setVoted(vote);
    }, [data])

    if (!post) {
        return (
            <div className="flex w-full items-center justify-center p-10 text-xl">
                <Jelly size={50} color="#ff4501" />
            </div>
        )
    }
    console.log(post);
    return (
        <div className="rounded-md flex cursor-pointer border border-gray-300 bg-white shadow-sm hover:border-gray-600">
            <div className="flex flex-col items-center justify-start space-y-1 rounded-l-md bg-gray-50 text-gray-400 p-4">
                <ArrowUpIcon onClick={() => upVote(true)} className={`voteButtons hover:text-red-500 ${voted === true && 'text-blue-400'}`} />
                <p className="text-black text-xs font-bold text-center">{displayVotes(data)}</p>
                <ArrowDownIcon onClick={() => upVote(false)} className={`voteButtons hover:text-red-500 ${voted === false && 'text-red-400'}`} />
            </div>
            <Link href={`/post/${post.id}`}>
                <div className="p-3 pb-1">
                    <div className="flex items-center space-x-2">
                        <Avatar seed={post?.subreddits?.topic} />
                        <p className="text-xs text-gray-400">
                            <Link href={`/subreddit/${post?.subreddits?.topic}`}><span className="font-bold text-black hover:text-blue-400">r/{post?.subreddits?.topic}</span></Link>
                            <span className="pl-2">posted by {" "}u/{post?.user_id}  </span>
                            <span className="pl-2"><TimeAgo date={post?.created_at} /></span>
                        </p>
                    </div>
                    <div className="py-4">
                        <h2 className="text-xl font-semibold">{post?.title}</h2>
                        <p className="mt-2 text-sm font-light">{post.description}</p>
                    </div>
                    <img className='lg:w-full w-[60vmin] h-auto' src={post?.image} onClick={() => window.open(post?.image, '_blank')} alt="" />
                    <div className="flex lg:flex-row space-x-2 lg:space-x-4 text-gray-400">
                        <div className="postButtons">
                            <ChatAltIcon className="h-5 w-5" />
                            <p className="mt-2 text-sm font-light">{post?.commentsList?.length} {post?.commentsList?.length != 1 ? "Comments" : "Comment"}</p>
                        </div>
                        <div className="postButtons">
                            <GiftIcon className="h-5 w-5" />
                            <p className="mt-2 text-sm font-light">Award</p>
                        </div>
                        <div className="postButtons">
                            <ShareIcon className="h-5 w-5" />
                            <p className="mt-2 text-sm font-light">Share</p>
                        </div>
                        <div className="postButtons">
                            <BookmarkIcon className="5-6 w-5" />
                            <p className="mt-2 text-sm font-light">Save</p>
                        </div>
                        <div className="postButtons">
                            <DotsHorizontalIcon className="h-6 w-6" />
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default Post