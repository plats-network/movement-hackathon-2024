
import PlatsAppLogo from '@/assets/PlatsAppLogo'
import React from 'react'

const ConnectedPlatsApp = () => {
  return (

    <div className="relative w-full">
      <div className="absolute inset-0 rounded-xl  opacity-10"
      style={{
        background: "linear-gradient(90deg, rgba(25,5,50,1),rgba(102,255,255,1) 0%)"
      }}
      ></div>
      <div className="relative flex flex-col gap-8 p-5">
  <div className='flex items-center justify-between'>
  <p className="text-xl text-[#3AE7E7] font-semibold">
    Connected Plats App
      </p>
      <button className='text-base text-[#3AE7E7] underline'>
      See all
      </button>
  </div>
  <div className='flex flex-col items-center justify-center text-center gap-3 my-[27px]'>
      <p className='text-[40px] font-bold'>- -</p>
      <p className='text-[17px] text-[#B172FF]'>You haven't connected to any accounts yet</p>
    </div>
        {/* <div className="flex gap-2">
          <div className="group max-w-[251px] w-full  flex items-center gap-2 text-center py-[42px] px-8 bg-[#1A1A36] hover:bg-[#060625] cursor-pointer rounded-[12px]">
            <PlatsAppLogo/>
            <p className="text-[17px] text-[#B7B4BB] group-hover:bg-gradient-to-r from-[#3AE7E7] to-[#8737E9]  group-hover:text-transparent group-hover:bg-clip-text">Plats App 01</p>
          </div>
          <div className="group max-w-[251px] w-full  flex items-center  gap-2 text-center py-[42px] px-8 bg-[#1A1A36] hover:bg-[#060625] cursor-pointer rounded-[12px]">
          <PlatsAppLogo/>

            <p className="text-[17px] text-[#B7B4BB] group-hover:bg-gradient-to-r from-[#3AE7E7] to-[#8737E9]  group-hover:text-transparent group-hover:bg-clip-text">Plats App 02</p>
          </div>
          <div className="group max-w-[251px] w-full  flex  items-center gap-2 text-center py-[42px] px-8 bg-[#1A1A36] hover:bg-[#060625] cursor-pointer rounded-[12px]">
          <PlatsAppLogo/>

            <p className="text-[17px] text-[#B7B4BB] group-hover:bg-gradient-to-r from-[#3AE7E7] to-[#8737E9]  group-hover:text-transparent group-hover:bg-clip-text">Plats App 03</p>
          </div>
        </div> */}
    </div>
    </div>
   
  )
}

export default ConnectedPlatsApp