import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import Avatar from './Avatar';
import { PhotographIcon, LinkIcon } from '@heroicons/react/outline';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { ADD_POST, ADD_SUBREDDIT } from '../graphql/mutations';
import { GET_ALL_POSTS, GET_SUBREDDIT_BY_TOPIC } from '../graphql/queries';
import client from '../apollo-client';
import toast from 'react-hot-toast';

type FormData = {
  title: string;
  description: string;
  image: string;
  user_id: string;
  subreddit: string;
};

type PostBoxProps = {
  subreddit?: string;
}
function PostBox({ subreddit }: PostBoxProps) {
  const { data: session } = useSession();
  const { register, setValue, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
  const [imageBoxOpen, setImageBoxOpen] = useState<Boolean>(false);
  const [addPost] = useMutation(ADD_POST, {
    refetchQueries: [GET_ALL_POSTS, 'getPostsList']
  });
  const [addSubreddit] = useMutation(ADD_SUBREDDIT);

  const onSubmit = handleSubmit(async (formData: FormData) => {
    const notification = toast.loading('Creating new post...');
    try {
      const { data: { getSubredditsListByTopic }, } = await client.query({
        query: GET_SUBREDDIT_BY_TOPIC,
        variables: {
          topic: subreddit || formData.subreddit
        }
      });
      const subredditExists = getSubredditsListByTopic.length > 0;
      if (!subredditExists) {
        const { data: { insertSubreddits: newSubreddit }, } = await addSubreddit({
          variables: {
            topic: formData.subreddit,
          }
        })
        const image = formData.image || '';
        const { data: { insertPosts: newPost }, } = await addPost({
          variables: {
            title: formData.title,
            description: formData.description,
            image: image,
            subreddit_id: newSubreddit?.id,
            user_id: session?.user?.name,
          }
        })
      }
      else {
        const image = formData.image || '';
        const { data: { insertPost: newPost }, } = await addPost({
          variables: {
            title: formData?.title,
            description: formData?.description,
            image: image,
            subreddit_id: getSubredditsListByTopic[0]?.id,
            user_id: session?.user?.name,
            created_at: new Date(),
          }
        });
      }
      setValue('title', '');
      setValue('description', '');
      setValue('image', '');
      setValue('subreddit', '');
      toast.success('post added successfully', {
        id: notification
      });
    } catch (error) {
      toast.error('Something went wrong', {
        id: notification
      });
      console.log(error);
    }
  })

  return (
    <form onSubmit={onSubmit}
      className="sticky top-20 z-50 bg-white border rounded-md border-gray-300 p-2">
      <div className="flex items-center space-x-3">
        <Avatar />
        <input {...register('title', { required: true })}
          disabled={!session}
          className="flex-1 rounder-md bg-gray-50 p-2 pl-5 outline-none"
          type="text"
          placeholder={session ? subreddit ? `Create a post in r/${subreddit}` : 'Create a new post by entering the title' : 'You need to sign in to create a new post'} required />
        <PhotographIcon onClick={() => setImageBoxOpen(!imageBoxOpen)}
          className={`h-6 text-gray-300 cursor-pointer ${imageBoxOpen && 'text-blue-300'}`} />
        <LinkIcon className={"h-6 text-gray-300 cursor-pointer"} />
      </div>
      {!!watch('title') && (
        <div>
          <div className="flex items-center px-2">
            <p className="min-w-[90px]">Body</p>
            <input className="m-2 flex-1 bg-blue-50 p-2 outline-none"
              {...register('description')}
              type="text"
              placeholder="Text(Optional)" />
          </div>
          {!subreddit && (<div className="flex items-center px-2">
            <p className="min-w-[90px]">Subreddit</p>
            <input className="m-2 flex-1 bg-blue-50 p-2 outline-none"
              {...register('subreddit', { required: true })}
              type="text"
              placeholder="Subreddits" />
          </div>)}
          {imageBoxOpen && (
            <div className="flex items-center px-2">
              <p className="min-w-[90px]">Image URL</p>
              <input className="m-2 flex-1 bg-blue-50 p-2 outline-none"
                {...register('image')}
                type="text"
                placeholder="Optional..." />
            </div>
          )}
          {Object.keys(errors).length > 0 && (
            <div className="flex items-center px-2">
              {errors.title?.type === 'required' && (
                <p className="py-2 text-red-500">Title required</p>
              )}
              {errors.subreddit?.type === 'required' && (
                <p className="py-2 text-red-500 text-sm">- Subreddit required</p>
              )}
            </div>
          )}
          {!!watch('title') && (
            <button type="submit" className="py-2 w-full rounded-full bg-blue-500 text-white">Create Post</button>
          )}
        </div>
      )}
    </form>
  )
}

export default PostBox