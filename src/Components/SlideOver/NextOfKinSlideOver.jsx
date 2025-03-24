import React, {useState, Fragment} from 'react'
import { Menu, Dialog, Transition } from '@headlessui/react'
import { BsX, BsThreeDots } from 'react-icons/bs'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
  
  export default function NextOfKinSlideOver({isOpen, onClose, data}) {
  
    return (
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-50 overflow-hidden" onClose={() => {
            if (typeof onClose === 'function') {
                onClose();
            }
        }}>
          <div className="absolute inset-0 overflow-hidden">
            <Dialog.Overlay className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
  
            <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <div className="w-screen max-w-2xl" onClick={(e) => e.stopPropagation()}>
                  <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                    <div className="px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">Details of {data.firstName} {data.middleName} {data.lastName} </Dialog.Title>
                        <div className="ml-3 h-7 flex items-center">
                          <button
                            type="button"
                            className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-taureanOrange"
                            onClick={onClose}
                          >
                            <span className="sr-only">Close panel</span>
                            <BsX className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Main */}
                    <div className="divide-y divide-gray-200">
                      <div className="pb-6">
                        <div className="bg-taureanLightBlue h-24 sm:h-20 lg:h-28" />
                        <div className="-mt-12 flow-root px-4 sm:-mt-8 sm:flex sm:items-end sm:px-6 lg:-mt-15">
                          <div>
                            <div className="-m-1 flex">
                              <div className="inline-flex rounded-lg overflow-hidden border-4 border-white">
                                <img
                                  className="flex-shrink-0 h-24 w-24 sm:h-40 sm:w-40 lg:w-48 lg:h-48"
                                  src="/Media/Taurean IT Logo1-2_vectorized.png"
                                  alt=""
                                />
                              </div>
                            </div>
                          </div>
                          <div className="mt-6 sm:ml-6 sm:flex-1">
                            <div>
                              <div className="flex items-center">
                                <h3 className="font-bold text-xl text-gray-900 sm:text-2xl"> {data.firstName} {data.middleName} {data.lastName} </h3>
{/*                                 <span className="ml-2.5 flex-shrink-0 inline-block h-2 w-2 rounded-full">
                                  <span className="sr-only">Active</span>
                                </span> */}
                              </div>
                              <p className="text-sm text-gray-500"> Gender: {data.gender} </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="px-4 py-5 sm:px-0 sm:py-0">
                        <dl className="space-y-8 sm:divide-y sm:divide-gray-200 sm:space-y-0">
                          <div className="sm:flex sm:px-6 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48"> Mobile Phone Number </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">
                              <p>
                                {data.mobileNumber}
                              </p>
                            </dd>
                          </div>
                          <div className="sm:flex sm:px-6 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48"> Email </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2"> {data.email} </dd>
                          </div>
                           <div className="sm:flex sm:px-6 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48"> Relation To Employee</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">
                              {data.relationship}
                            </dd>
                          </div>
                          <div className="sm:flex sm:px-6 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48"> House Address </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2"> {data.physicalAddress} </dd>
                          </div>
                          <div className="sm:flex sm:px-6 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48"> Digital Address </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2"> {data.digitalAddress} </dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    )
  }