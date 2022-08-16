import { useQuery } from '@apollo/client'
import type { NextPage } from 'next'
import Head from 'next/head'
import Feed from '../components/Feed'
import PostBox from '../components/PostBox'
import SubredditRow from '../components/SubredditRow'
import { GET_SUBREDDITS_LIST_LIMIT } from '../graphql/queries'

const Home: NextPage = () => {
  const {data} = useQuery(GET_SUBREDDITS_LIST_LIMIT,{
    variables:{
      limit: 10
    }
  })
  if(data !== undefined)
    console.log(data);
  const subreddits: Subreddit[] = data?.getSubredditsListLimit;
  console.log(subreddits);
  return (
    <div className='my-7 max-w-5xl mx-auto'>
      <Head>
        <title>Reddit 2.0 Clone</title>
      </Head>
      <PostBox/>
      <div className='flex'>
        <Feed/>
        {subreddits && <div className="sticky top-30 mx-5 mt-5 hidden h-fit min-w-[300px] rounded-md border border-gray-300 bg-white lg:inline">
          <p className="text-md mb-1 p-4 pb-3 font-bold">Top Communities</p>
          <div>
            {subreddits?.map((subreddit,i) => {
              return(
                <SubredditRow key={subreddit?.id} index={i} topic={subreddit?.topic}/>
              )
            })}
          </div>
        </div>}
      </div>
    </div>
  )
}

export default Home
