'use client'

import { useEffect, useState } from 'react'
import { client, exploreProfiles,challenge,authenticate } from '../../api'
import { ethers } from 'ethers'

import Link from 'next/link'
export default function Accounts() {
  useEffect(() => {
    fetchProfiles()
    
  }, [])

      const [profiles, setProfiles] = useState<any>([])
      async function fetchProfiles() {
        try {
          /* fetch profiles from Lens API */
          let response = await client.query({ query: exploreProfiles })
          let profileData = await Promise.all(response.data.exploreProfiles.items.map(async profileInfo => {
            let profile = { ...profileInfo }
            let picture = profile.picture
            if (picture && picture.original && picture.original.url) {
              if (picture.original.url.startsWith('ipfs://')) {
                let result = picture.original.url.substring(7, picture.original.url.length)
                profile.avatarUrl = `http://lens.infura-ipfs.io/ipfs/${result}`
              } else {
                profile.avatarUrl = picture.original.url
              }
            }
            return profile
          }))
    
          /* update the local state with the profiles array */
          setProfiles(profileData)
        } catch (err) {
          console.log({ err })
        }
      }
return(
    <>
    <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <img className="h-8 w-auto" src="https://i.postimg.cc/wB8Dgqn3/image.png" alt="Logo" />
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
            <Link href={"/"} className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-50">Home</Link>
              <Link href={"/posts"} className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-50">Posts</Link>
              <Link href={"/account"} className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-50">Account</Link>
            </div>
          </div>
        </div>
      </header>
  <div className='pt-20'>
    <h1 className='text-5xl mb-6 text-center font-bold'>Famous Accounts</h1>
  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        
        
        {
          
          profiles.map(profile => (
            <div key={profile.id} className='w-2/3 shadow-md p-6 rounded-lg mb-8 flex flex-col items-center'>
              <img className='w-48' src={profile.avatarUrl || 'https://picsum.photos/200'} />
              <p className='text-xl text-center mt-6'>{profile.name}</p>
              <p className='text-base text-gray-400  text-center mt-2'>{profile.bio}</p>
              <Link href={`/profile/${profile.handle}`}>
                <p className='cursor-pointer text-violet-600 text-lg font-medium text-center mt-2 mb-2'>{profile.handle}</p>
              </Link>
              <p className='text-pink-600 text-sm font-medium text-center'>{profile.stats.totalFollowers} followers</p>
            </div>
          ))
        }
        </div>
        </div>
        </>
    )}