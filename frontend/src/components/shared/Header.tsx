import Link from 'next/link'
import { ExitIcon } from '@radix-ui/react-icons'
import React from 'react'

const Header = () => {
  return (
    <div className='fixed text-white h-10 z-50 w-full'>
        <div className='w-full flex items-end justify-end p-3'>
        <Link  href={'/logout'} className='border-2 rounded-xl p-2 hover:bg-slate-800'>
       <ExitIcon/>
        </Link>
        </div>
    </div>
  )
}

export default Header