import { gql } from '@apollo/client';

export const GET_ALL_POSTS = gql`
    query MyQuery{
        getPostsList{
            id
            title
            description
            image
            created_at
            user_id
            subreddit_id
            commentsList{
                created_at
                id
                post_id
                text
                user_id
            }
            subreddits{
                created_at
                id
                topic
            }
            votesList{
                created_at
                id
                post_id
                upvote
                username
            }
        }
    }
`;

export const GET_ALL_POSTS_BY_TOPIC = gql`
    query MyQuery($topic: String!){
        getPostsListByTopic(topic: $topic){
            id
            title
            description
            image
            created_at
            user_id
            subreddit_id
            commentsList{
                created_at
                id
                post_id
                text
                user_id
            }
            subreddits{
                created_at
                id
                topic
            }
            votesList{
                created_at
                id
                post_id
                upvote
                username
            }
        }
    }
`;

export const GET_POSTS_BY_POST_ID = gql`
    query MyQuery($post_id: ID!){
        getPosts(id: $post_id){
            id
            description
            created_at
            commentsList{
                created_at
                id
                post_id
                text
                user_id
            }
            subreddits{
                created_at
                id
                topic
            }
            votesList{
                created_at
                id
                post_id
                upvote
                username
            }
            title
            image
        }
    }
`;
export const GET_SUBREDDIT_BY_TOPIC = gql`
    query MyQuery($topic: String!) {
        getSubredditsListByTopic(topic: $topic){
            id
            topic
            created_at
        }
    }
`;

export const GET_COMMENTS_LIST_BY_ID = gql`
    query MyQuery($id: ID!){
        getCommentsUsingPost_id(id: $id){
            id
            text
            post_id
            user_id
            created_at
        }
    }
`;