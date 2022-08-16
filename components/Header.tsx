import Image from 'next/image'
import React from 'react'
import { BeakerIcon, ChevronDownIcon, HomeIcon, MenuIcon, SearchIcon } from '@heroicons/react/solid';
import { BellIcon, ChatIcon, GlobeIcon, PlusIcon, SparklesIcon, SpeakerphoneIcon, VideoCameraIcon } from '@heroicons/react/outline';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { GET_SUBREDDITS_LIST } from '../graphql/queries';
import { ReactSearchAutocomplete } from 'react-search-autocomplete'

function Header() {
    const { data: session } = useSession();
    const { data: subreddits } = useQuery(GET_SUBREDDITS_LIST);

    const searchData: Subreddit[] = subreddits?.getSubredditsList;

    const handleOnSelect = (item: Subreddit) => {
        window.location.href = `subreddit/${item?.topic}`;
    }
    const formatResult = (item: Subreddit) => {
        return (
            <>
                <span className="block text-left text-gray-300 bg-white px-3 mt-2">name: {item?.topic}</span>
            </>
        )
    }
    return (
        <div className='flex bg-white px-4 py-2 shadow-sm sticky top-0 z-50'>
            <div className='relative h-10 w-20 flex-shrink-0 cursor-pointer'>
                <Link href="/">
                    <Image objectFit='contain' src="https://links.papareact.com/fqy" layout='fill' />
                </Link>
            </div>
            <div className='flex items-center mx-7 xl:min-w-[300px]'>
                <HomeIcon className='h-5 w-5' />
                <p className='flex-1 ml-2 hidden lg:inline'>Home</p>
                <ChevronDownIcon className='h-5 w-5 lg:hidden' />
            </div>
            {/*Search */}
            <div className="min-w-[280px]">
            <ReactSearchAutocomplete items={searchData} onSelect={handleOnSelect} formatResult={formatResult} />
            </div>
           

            <div className='flex-1 text-gray-500 space-x-2 items-center mx-5 hidden lg:inline-flex'>
                <SparklesIcon className='icon' />
                <GlobeIcon className='icon' />
                <VideoCameraIcon className='icon' />
                <hr className='h-10 border border-gray-100' />
                <ChatIcon className='icon' />
                <BellIcon className='icon' />
                <PlusIcon className='icon' />
                <SpeakerphoneIcon className='icon' />
            </div>
            <div className='ml-5 flex items-center lg:hidden'>
                <MenuIcon className='icon' />
            </div>
            <div className='hidden lg:flex items-center space-x-2 border border-gray-100 p-2 cursor-pointer' onClick={() => !session ? signIn() : signOut()}>
                {session ?
                    <div className="flex text-xs"><p className="truncate font-semibold">{session?.user?.name}</p>
                        <hr className='ml-2' /><p className='text-gray-400 text-xs border-l-2 border-gray-200 pl-2'>1 Karma</p></div> : <div className='hidden lg:flex items-center space-x-2 border border-gray-100 p-0 cursor-pointer'>
                        <div className='relative h-5 w-5 flex-shrink-0'>
                            <Image src="https://links.papareact.com/23l" layout='fill' objectFit='contain' alt="" />
                        </div>
                        <p className='text-gray-400'>Sign in</p>
                    </div>}
            </div>
        </div>
    )
}

export default Header