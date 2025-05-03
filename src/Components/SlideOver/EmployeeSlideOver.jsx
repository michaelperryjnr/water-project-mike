import React, { useState, Fragment } from 'react';
import { Menu, Dialog, Transition } from '@headlessui/react';
import { BsX, BsThreeDots } from 'react-icons/bs';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

// Utility function to capitalize each word in a string
const capitalizeWords = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Utility function to format dates using 'en-GB' locale with full date style
const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'N/A'; // Handle invalid dates
  return new Intl.DateTimeFormat('en-GB', { dateStyle: 'long' }).format(date); // e.g., "Thursday, 20 February 1994"
};

// Access the backend API URL from Vite environment variables
const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const backendBaseUrl = apiBaseUrl.replace('/api', '');

export default function EmployeeSlideOver({ isOpen, onClose, data }) {
  console.log('Employee Data:', data);
  console.log('Picture URL:', data.picture);
  console.log('Backend Base URL:', backendBaseUrl);

  const pictureUrl = data.picture ? `${backendBaseUrl}${data.picture}` : null;

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
                        Profile of {capitalizeWords(data.title)}{' '}
                        {capitalizeWords(data.firstName)}{' '}
                        {capitalizeWords(data.middleName)}{' '}
                        {capitalizeWords(data.lastName)}
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
                      <div className="bg-taureanLightBlue h-24 sm:h-20 lg:h-28" />
                      <div className="-mt-12 flow-root px-4 sm:-mt-8 sm:flex sm:items-end sm:px-6 lg:-mt-15">
                        <div>
                          <div className="-m-1 flex">
                            <div className="inline-flex rounded-lg overflow-hidden border-4 border-white">
                              {pictureUrl ? (
                                <img
                                  className="flex-shrink-0 h-24 w-24 sm:h-40 sm:w-40 lg:w-48 lg:h-48"
                                  src={pictureUrl}
                                  alt={`${capitalizeWords(data.firstName)} ${capitalizeWords(
                                    data.lastName
                                  )}'s profile picture`}
                                  onError={(e) => console.error('Image failed to load:', e)}
                                />
                              ) : (
                                <div className="flex-shrink-0 h-24 w-24 sm:h-40 sm:w-40 lg:w-48 lg:h-48 bg-gray-200 flex items-center justify-center">
                                  <span className="text-gray-500">No Image</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="mt-6 sm:ml-6 sm:flex-1">
                          <div>
                            <div className="flex items-center">
                              <h3 className="font-bold text-xl text-gray-900 sm:text-2xl">
                                {capitalizeWords(data.firstName)}{' '}
                                {capitalizeWords(data.middleName)}{' '}
                                {capitalizeWords(data.lastName)}
                              </h3>
                              <span className="ml-2.5 bg-green-400 flex-shrink-0 inline-block h-2 w-2 rounded-full">
                                <span className="sr-only">Active</span>
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">
                              Title: {capitalizeWords(data.title)} / Gender:{' '}
                              {capitalizeWords(data.gender)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-5 sm:px-0 sm:py-0">
                      <dl className="space-y-8 sm:divide-y sm:divide-gray-200 sm:space-y-0">
                        <div className="sm:flex sm:px-6 sm:py-5">
                          <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                            Staff Number
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">
                            <p>{data.staffNumber}</p>
                          </dd>
                        </div>
                        <div className="sm:flex sm:px-6 sm:py-5">
                          <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                            Date Of Birth
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">
                            <p>{formatDate(data.DOB)}</p>
                          </dd>
                        </div>
                        <div className="sm:flex sm:px-6 sm:py-5">
                          <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                            Next Of Kin
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">
                            <p>
                              {capitalizeWords(data.nextOfKin?.firstName)}{' '}
                              {capitalizeWords(data.nextOfKin?.lastName)} | Contact:{' '}
                              {data.nextOfKin?.mobileNumber} | Email: {data.nextOfKin?.email} | Relation:{' '}
                              {capitalizeWords(data.nextOfKin?.relationship)} | Gender:{' '}
                              {capitalizeWords(data.nextOfKin?.gender)}
                            </p>
                          </dd>
                        </div>
                        <div className="sm:flex sm:px-6 sm:py-5">
                          <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                            Mobile Phone Number
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">
                            <p>{data.mobilePhone}</p>
                          </dd>
                        </div>
                        <div className="sm:flex sm:px-6 sm:py-5">
                          <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                            Home Phone Number
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">
                            <p>{data.homePhone}</p>
                          </dd>
                        </div>
                        <div className="sm:flex sm:px-6 sm:py-5">
                          <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                            Work Phone Number
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">
                            <p>{data.workPhone}</p>
                          </dd>
                        </div>
                        <div className="sm:flex sm:px-6 sm:py-5">
                          <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                            Email
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">
                            {data.email}
                          </dd>
                        </div>
                        <div className="sm:flex sm:px-6 sm:py-5">
                          <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                            Position
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">
                            {capitalizeWords(data.position?.positionTitle) || "N/A"}
                          </dd>
                        </div>
                        <div className="sm:flex sm:px-6 sm:py-5">
                          <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                            Department
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">
                            {capitalizeWords(data.department?.departmentName) || "N/A"}
                          </dd>
                        </div>
                        <div className="sm:flex sm:px-6 sm:py-5">
                          <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                            National ID
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">
                            {data.nationalID}
                          </dd>
                        </div>
                        <div className="sm:flex sm:px-6 sm:py-5">
                          <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                            Marital Status
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">
                            {capitalizeWords(data.maritalStatus)}
                          </dd>
                        </div>
                        <div className="sm:flex sm:px-6 sm:py-5">
                          <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                            Nationality
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">
                            {capitalizeWords(data.nationality?.nationalityName)}
                          </dd>
                        </div>
                        <div className="sm:flex sm:px-6 sm:py-5">
                          <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                            Country Of Origin
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2 inline-flex">
                            {capitalizeWords(data.country?.name)}{' '}
                            <img className="size-5" src={data.country?.flag} alt={`${data.country?.name} flag`} />
                          </dd>
                        </div>
                        <div className="sm:flex sm:px-6 sm:py-5">
                          <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                            Blood Group
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">
                            {data.bloodGroup ? data.bloodGroup.toUpperCase() : 'N/A'}
                          </dd>
                        </div>
                        <div className="sm:flex sm:px-6 sm:py-5">
                          <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                            Tobacco Use
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">
                            {capitalizeWords(data.usesTobacco)}
                          </dd>
                        </div>
                        <div className="sm:flex sm:px-6 sm:py-5">
                          <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                            House Address
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">
                            {capitalizeWords(data.physicalAddress)}
                          </dd>
                        </div>
                        <div className="sm:flex sm:px-6 sm:py-5">
                          <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                            Digital Address
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">
                            {data.digitalAddress}
                          </dd>
                        </div>
                        <div className="sm:flex sm:px-6 sm:py-5">
                          <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                            Salary
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">
                            {data.baseCurrency} - {data.salary}
                          </dd>
                        </div>
                        <div className="sm:flex sm:px-6 sm:py-5">
                          <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                            Contract Type
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">
                            {capitalizeWords(data.contractType?.contractTypeName)} | Duration/Period:{' '}
                            {data.contractType?.contractTypeDuration}{' '}
                            {capitalizeWords(data.contractType?.contractTypeDurationUnit)}
                          </dd>
                        </div>
                        <div className="sm:flex sm:px-6 sm:py-5">
                          <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                            Date Confirmed
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">
                            {formatDate(data.confirmationDate)}
                          </dd>
                        </div>
                        <div className="sm:flex sm:px-6 sm:py-5">
                          <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                            Work At Home
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">
                            {capitalizeWords(data.workAtHome)}
                          </dd>
                        </div>
                        <div className="sm:flex sm:px-6 sm:py-5">
                          <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                            Over Time Eligible
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">
                            {capitalizeWords(data.overTimeEligible)}
                          </dd>
                        </div>
                        <div className="sm:flex sm:px-6 sm:py-5">
                          <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                            Probation Start/End Date
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">
                            {formatDate(data.probationStart)} - {formatDate(data.probationEnd)}
                          </dd>
                        </div>
                        <div className="sm:flex sm:px-6 sm:py-5">
                          <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                            Probation Period
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">
                            {data.probationPeriod} {capitalizeWords(data.probationUnit)}
                          </dd>
                        </div>
                        <div className="sm:flex sm:px-6 sm:py-5">
                          <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                            Employer's Comments
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">
                            {capitalizeWords(data.comments)}
                          </dd>
                        </div>
                        <div className="sm:flex sm:px-6 sm:py-5">
                          <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                            Date Employed
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">
                            {formatDate(data.dateEmployed)}
                          </dd>
                        </div>
                        <div className="sm:flex sm:px-6 sm:py-5">
                          <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                            Date Terminated
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">
                            {formatDate(data.terminationDate)}
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