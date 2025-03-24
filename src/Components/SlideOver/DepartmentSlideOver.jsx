import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { BsX } from 'react-icons/bs';

// Utility function to capitalize each word in a string
const capitalizeWords = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Utility function to get the department head's name
const getDepartmentHeadName = (departmentHead) => {
  if (!departmentHead) return "N/A";
  if (typeof departmentHead === "string") return departmentHead; // If it's just the ID
  if (departmentHead.firstName || departmentHead.lastName) {
    return `${capitalizeWords(departmentHead.firstName)} ${capitalizeWords(departmentHead.lastName)}`.trim();
  }
  return "N/A";
};

export default function DepartmentSlideOver({ isOpen, onClose, data }) {
  console.log('Department Data:', data);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-hidden"
        onClose={() => {
          if (typeof onClose === 'function') {
            onClose();
          }
        }}
      >
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
                      <Dialog.Title className="text-lg font-medium text-gray-900">
                        Department: {capitalizeWords(data.departmentName)}
                      </Dialog.Title>
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
                      <div className="bg-taureanLightBlue mb-10 h-24 sm:h-20 lg:h-28" />
                      <div className="-mt-12 px-4 sm:-mt-8 sm:flex sm:items-end sm:px-6 lg:-mt-15">
                        <div className="mt-6 sm:flex-1">
                          <div className="flex items-center">
                            <h3 className="font-bold text-xl text-gray-900 sm:text-2xl">
                              {capitalizeWords(data.departmentName)}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-500">
                            Department Head: {getDepartmentHeadName(data.departmentHead)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="px-4 py-5 sm:px-0 sm:py-0">
                      <dl className="space-y-8 sm:divide-y sm:divide-gray-200 sm:space-y-0">
                        <div className="sm:flex sm:px-6 sm:py-5">
                          <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                            Department Name
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">
                            {capitalizeWords(data.departmentName)}
                          </dd>
                        </div>
                        <div className="sm:flex sm:px-6 sm:py-5">
                          <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                            Description
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">
                            {capitalizeWords(data.departmentDescription) || 'N/A'}
                          </dd>
                        </div>
                        <div className="sm:flex sm:px-6 sm:py-5">
                          <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                            Department Head
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">
                            {getDepartmentHeadName(data.departmentHead)}
                          </dd>
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
  );
}