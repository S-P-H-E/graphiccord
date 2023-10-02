import BadgeEditor from '@/components/BadgeEditor/page'
import Image from 'next/image'
import { FaCrown } from 'react-icons/fa'

export default function Home() {
  

  return (
    <>
      {/* Navbar */}
      <div className='flex justify-between p-10 bg-[--highlight]'>
        <div className='flex items-center gap-2'>
          <Image src={'/logo.svg'} alt='logo' width={25} height={0}/>
          <h1 className='text-xl font-semibold text-[--text]'>graphiccord</h1>
        </div>
        <button className='bg-[--text] text-[--highlight] font-medium px-3 py-2 rounded-xl'>
          Donate
        </button>
      </div>

      <div className='bg-[--highlight] flex flex-col items-center h-[700px]'>
        <div className='flex flex-col justify-center items-center mt-10 gap-4'>
          {/* <div className='bg-[--text] w-[150px] p-3 rounded-full flex justify-center items-center text-[--highlight]'>
            <FaCrown size={30}/>
          </div> */}
          <Image src={'/logo.svg'} alt='logo' width={30} height={0}/>
          <h1 className='text-5xl md:text-8xl font-semibold px-3 md:p-0 w-[340px] md:w-[700px] text-center text-[--text]'>Create your own graphics</h1>
          <p className='md:text-xl text-center text-[--text] px-5'>Make your discord profile unique with your own graphics! Try it now!</p>
        </div>
        <BadgeEditor />
      </div>
    </>
  )
}