import {gql} from '@apollo/client'

export const ADD_POST = gql`
  mutation MyMutation(
    $description: String!
    $title: String!
    $subreddit_id: String!
    $user_id: String!
    $image: String!
  ){
    insertPosts(
        title: $title
        description: $description
        image: $image
        subreddit_id: $subreddit_id
        user_id: $user_id
    ) {
        description
        created_at
        id
        image
        title
        user_id
    }
  }
`;

export const ADD_VOTE = gql`
  mutation MyMutation(
    $upvote: Boolean!
    $username: String!
    $post_id: ID!
  ){
    insertVotes(upvote:$upvote, username:$username, post_id:$post_id){
      id
      created_at
      upvote
      username
      post_id
    }
  }
`;

export const ADD_SUBREDDIT = gql`
    mutation MyMutation($topic: String){
        insertSubreddits(topic: $topic){
            id
            topic
            created_at
        }
    }
`;

export const ADD_COMMENTS = gql`
    mutation MyMutation(
      $text: String!
      $user_id: String!
      $post_id: ID!
    ){
      insertComments(text: $text, user_id: $user_id,post_id: $post_id){
        id
        text
        user_id
        post_id
      }
    }
`;