import React from 'react'
import DefaultLayout from '../Layout/DefaultLayout'

const UserProfiles = () => {
  return (
    <DefaultLayout>
        <div className='rounded-2xl border border-gray-200 bg-white p-5 lg:p-6'>
            <h3 className='mb-5 text-lg font-semibold text-gray-800 lg:mb-7'>
                profile
            </h3>
            <div className='space-y-6'>
                {/* User Meta Card */}
                  <div className='p-5 border border-gray-200 rounded-2xl lg:p-6'>
                    <div className='flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between'>
                        <div className='flex flex-col items-center w-full gap-6 xl:flex-row'>
                            <div className='w-20 h-20 overflow-hidden border border-gray-200 rounded-full'>
                                <img src="/Media/DALL·E-1.png" alt="user" />
                            </div>
                            <div className='order-3 xl:order-2'>
                                <h4 className='mb-2 text-lg font-semibold text-center text-gray-800 xl:text-left'>
                                    First Name Middle Name Last Name
                                </h4>
                                <div className='flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left'>
                                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                                        User Role | User Name
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                  </div>
                {/* User Meta Card */}

                {/* User Info Card */}
                  <div className='p-5 border border-gray-200 rounded-2xl lg:p-6'>
                    <div className='flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between'>
                        <div>
                            <h4 className='text-lg font-semibold text-gray-800 lg:mb-6'>
                                Personal Information
                            </h4>

                            <div className='grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32'>
                                <div>
                                    <p className='mb-2 text-xs leading-normal text-gray-500'>First Name</p>
                                    <p className='text-sm font-medium text-gray-800'>John</p>
                                </div>

                                <div>
                                    <p className='mb-2 text-xs leading-normal text-gray-500'>Middle Name</p>
                                    <p className='text-sm font-medium text-gray-800'>Doe</p>
                                </div>

                                <div>
                                    <p className='mb-2 text-xs leading-normal text-gray-500'>Last Name</p>
                                    <p className='text-sm font-medium text-gray-800'>Smith</p>
                                </div>

                                <div>
                                    <p className='mb-2 text-xs leading-normal text-gray-500'>Email Address</p>
                                    <p className='text-sm font-medium text-gray-800'>johndoesmith@email.com</p>
                                </div>

                                <div>
                                    <p className='mb-2 text-xs leading-normal text-gray-500'>Phone Number</p>
                                    <p className='text-sm font-medium text-gray-800'>+(233)-50-534-3432</p>
                                </div>

                                <div>
                                    <p className='mb-2 text-xs leading-normal text-gray-500'>Staff Number</p>
                                    <p className='text-sm font-medium text-gray-800'>EMP-0000</p>
                                </div>
                            </div>
                        </div>
                    </div>
                  </div>
                {/* User Info Card */}
            </div>
        </div>
    </DefaultLayout>
  )
}

export default UserProfiles
