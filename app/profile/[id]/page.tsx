/* app/profile/[id]/page.tsx */
'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation';
import { client, getPublications, getProfile } from '../../../api'
import Link from 'next/link';

 
export default function Profile() {
  /* create initial state to hold user profile and array of publications */
  const [profile, setProfile] = useState<any>()
  const [publications, setPublications] = useState<any>([])
  /* using the router we can get the lens handle from the route path */
  const pathName = usePathname()
  const handle = pathName?.split('/')[2]
  
  useEffect(() => {
    if (handle) {
      fetchProfile()
    }
  }, [handle])

  async function fetchProfile() {
    try {
      /* fetch the user profile using their handle */
      const returnedProfile = await client.query({
        query: getProfile,
        variables: { handle }
      })
      const profileData = { ...returnedProfile.data.profile }
      /* format their picture if it is not in the right format */
      const picture = profileData.picture
      if (picture && picture.original && picture.original.url) {
        if (picture.original.url.startsWith('ipfs://')) {
          let result = picture.original.url.substring(7, picture.original.url.length)
          profileData.avatarUrl = `http://lens.infura-ipfs.io/ipfs/${result}`
        } else {
          profileData.avatarUrl = profileData.picture.original.url
        }
      }
      setProfile(profileData)
            /* fetch the user's publications from the Lens API and set them in the state */
      const pubs = await client.query({
        query: getPublications,
        variables: {
            id: profileData.id, limit: 50
        }
      })
      setPublications(pubs.data.publications.items)
    } catch (err) {
      console.log('error fetching profile...', err)
    }
  }

  if (!profile) return null

  return (
    
    <div className='pt-20'>
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
      <div className='flex flex-col justify-center items-center'>
        <img
          className='w-64 rounded-full'
          src={profile.avatarUrl}
        />
        <p className='text-4xl mt-8 mb-8'>{profile.handle}</p>
        <p className='text-center text-xl font-bold mt-2 mb-2 w-1/2'>{profile.bio}</p>
        {
            publications.map(pub => (
              <div key={pub.id} className='shadow p-10 rounded mb-8 w-2/3'>
                <p>{pub.metadata.content}</p>
                <div className="flex items-center space-x-2">
  <button className="bg-gray-200 rounded-full px-2 py-1">
  <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402m5.726-20.583c-2.203 0-4.446 1.042-5.726 3.238-1.285-2.206-3.522-3.248-5.719-3.248-3.183 0-6.281 2.187-6.281 6.191 0 4.661 5.571 9.429 12 15.809 6.43-6.38 12-11.148 12-15.809 0-4.011-3.095-6.181-6.274-6.181"/></svg>
  <p>12k</p>
  </button>
  <button className="bg-gray-200 rounded-full px-2 py-1">
  <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M12 1c-6.338 0-12 4.226-12 10.007 0 2.05.739 4.063 2.047 5.625l-1.993 6.368 6.946-3c1.705.439 3.334.641 4.864.641 7.174 0 12.136-4.439 12.136-9.634 0-5.812-5.701-10.007-12-10.007m0 1c6.065 0 11 4.041 11 9.007 0 4.922-4.787 8.634-11.136 8.634-1.881 0-3.401-.299-4.946-.695l-5.258 2.271 1.505-4.808c-1.308-1.564-2.165-3.128-2.165-5.402 0-4.966 4.935-9.007 11-9.007"/></svg>
  <p>1k</p>
  </button>
  <button className="px-2 py-1 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400">
    Follow
  </button>
</div>

  


              </div>
            ))
        }
      </div>
    </div>
  )
}