/* app/page.tsx */
'use client'

import { useEffect, useState } from 'react'
import { client, exploreProfiles,challenge,authenticate } from '../api'
import { ethers } from 'ethers'
import Link from 'next/link'

export default function Home() {
  /* create initial state to hold array of profiles */
  const [profiles, setProfiles] = useState<any>([])
  const [address, setAddress] = useState()
  const [token, setToken] = useState()
  useEffect(() => {
    checkConnection()
    
  }, [])
  async function checkConnection() {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const accounts = await provider.listAccounts()
    if (accounts.length) {
      setAddress(accounts[0])
    }
  }
  async function connect() {
    /* this allows the user to connect their wallet */
    const account = await window.ethereum.send('eth_requestAccounts')
    if (account.result.length) {
      setAddress(account.result[0])
    }
  }
  async function login() {
    try {
      /* first request the challenge from the API server */
      const challengeInfo = await client.query({
        query: challenge,
        variables: { address }
      })
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      /* ask the user to sign a message with the challenge info returned from the server */
      const signature = await signer.signMessage(challengeInfo.data.challenge.text)
      /* authenticate the user */
      const authData = await client.mutate({
        mutation: authenticate,
        variables: {
          address, signature
        }
      })
      /* if user authentication is successful, you will receive an accessToken and refreshToken */
      const { data: { authenticate: { accessToken }}} = authData
      console.log({ accessToken })
      setToken(accessToken)
    } catch (err) {
      console.log('Error signing in: ', err)
    }
  }

  
  return (

    <div className='pt-20'>
      { /* if the user has not yet connected their wallet, show a connect button */ }
      {
        !address && <div className="bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login with MetaMask</h2>
        <div className="flex items-center justify-center">
          <button onClick={connect} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
            Connect with MetaMask
          </button>
        </div>
      </div>
      }
      { /* if the user has connected their wallet but has not yet authenticated, show them a login button */ }
      {
        address && !token && (
          
          <div className="flex flex-col items-center justify-center h-screen bg-grey-500">
           <video
    autoplay
    loop
    muted
    class="absolute z-10 w-auto min-w-full min-h-full max-w-none"
  >
    <source
      src="https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-heights-in-a-sunset-26070-large.mp4"
      type="video/mp4"
    />
    Your browser does not support the video tag.
  </video>     
      <div className="bg-white rounded-lg text-center shadow-lg p-8 bg-grey-500 z-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Login with Metamask</h1>
        <p className="text-gray-700 mb-4">Click the button below to connect with Metamask and login to our site.</p>
        <button onClick={login} className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full">Connect with Metamask</button>
      </div>
    </div>
        )
      }
      { /* once the user has authenticated, show them a success message */ }
      {
        address && token &&  <header className="bg-white shadow-lg">
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
      
      }
      
    </div>
  )
}