type Comments = {
    created_at: string
    id: number
    post_id: number
    text: string
    user_id: string
}

type Vote = {
    created_at: string
    id: number
    post_id: number
    upvote: boolean
    username: string
}

type Subreddit = {
    created_at: string
    id: number
    topic: string
}

type Post = {
    body: string
    created_at: string  
    id: number
    image: string
    subreddit_id: number
    title: string
    description: string
    user_id: string
    commentsList: Comments[]
    votesList: Vote[]
    subreddits: Subreddit
}

