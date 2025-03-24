import React from 'react'
import { BsAt, Bs123 } from 'react-icons/bs'
import { Link } from 'react-router-dom'

function Login() {
  return (
    <section className='relative flex flex-wrap lg:h-screen lg:items-center'>
        <div className='w-full px-4 py-12 sm:px-6 sm:py-16 lg:w-1/2 lg:px-8 lg:py-24'>

            <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
                <img className='mx-auto h-30 w-auto' src="/Media/Taurean IT Logo1-2_vectorized.png" alt="Taurean IT Logistics" />
            </div>

            <div className='mx-auto max-w-lg text-center'>
                <h1 className='text-2xl font-bold sm:text-3xl'> Get Started </h1>
                <p className='mt-4 text-gray-500'>
                    Welcome to Taurean IT Logistics EIGRP Dashboard. Please login to access your account.
                </p>
            </div>

            <form action="post" onSubmit={''} className='mx-auto mb-0 mt-8 max-w-md space-y-4'>
                <div>
                    <label htmlFor="email" className='sr-only'> Email </label>
                    <div className='relative'>
                        <input 
                        type='email'
                        name='email'
                        id='email'
                        required
                        className='w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm  focus:ring-taureanOrange focus:border-taureanOrange'
                        placeholder='Enter Email'
                         />

                         <span className='absolute inset-y-0 end-0 grid place-content-center px-4'>
                            <BsAt className='text-taureanOrange' fill='currentColor' size={24} />
                         </span>
                    </div>
                </div>

                <div>
                    <label htmlFor="password" className='sr-only'> Email </label>
                    <div className='relative'>
                        <input 
                        type='password'
                        name='password'
                        id='password'
                        required
                        className='w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm  focus:ring-taureanOrange focus:border-taureanOrange'
                        placeholder='Enter Password'
                         />

                         <span className='absolute inset-y-0 end-0 grid place-content-center px-4'>
                            <Bs123 className='text-taureanOrange' fill='currentColor' size={24} />
                         </span>
                    </div>
                </div>

                <div className='flex items-center justify-between'>
                    <p className='text-sm text-gray-500'> No account? <Link className='underline' to={'/signup'}> Sign up </Link></p>

                    {/* <button type='submit' className='inline-block rounded-lg bg-RhemaBlue hover:bg-RhemaLime px-5 py-3 text-sm font-medium text-white'>
                        Sign In
                    </button> */}
                    <Link to={'/analytics'} className='inline-block rounded-lg bg-taureanOrange hover:bg-taureanLightBlue px-5 py-3 text-sm font-medium text-white'>
                        Sign In
                    </Link>
                </div>

            </form>
        </div>

        <div className='w-full lg:w-1/2 px-4'>
            <div className='relative max-w-md lg:max-w-2xl mx-auto lg:mr-0'>
                <img className="block h-full w-full rounded-md lg:rounded-full" src="/Media/DALL·E-2.png" alt="Taurean IT Logistics Hero image" />
                <div className='absolute bottom-0 w-full left-0 p-4 lg:px-12 xl:px-20 sm:pb-16'>
                    <div className='p-10 backdrop-blur-md backdrop-filter bg-black bg-opacity-30 lg:rounded-full'>
                        <p className='text-white font-medium mb-6'> "I’m impressed with the result I’ve seen since starting to use this product, I begin receiving client and project in the first week." </p>
                        <div className='flex items-start'>
                            <div className='ml-4'>
                                <span className='block text-white font-medium leading-none'> Daniel Abrokwa </span>
                                <span className='text-xs text-white opacity-50'> Founding Partner & CEO </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

export default Login
