import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from '@tanstack/react-form';

const EmployeeForm = React.forwardRef(({ onSubmit }, ref) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const employeeUrl = `${apiUrl}/employees`;

  useEffect(() => {
    // Fetch employee data from API when the component mounts
    axios.post(employeeUrl)  // Replace with your actual API endpoint
      .then(response => {
        // Check if response.data is an array and set state accordingly
        if (Array.isArray(response.data)) {
          setEmployees(response.data);  // Set the fetched data to the state
        } else {
          console.error('Expected an array from API, but received:', response.data);
          setEmployees([]);  // If the data is not an array, fallback to an empty array
        }
      })
      .catch(error => {
        console.error('Error fetching employee data:', error);
        setEmployees([]);  // If the API call fails, fallback to an empty array
      });
  }, []); // Empty dependency array means this runs once when the component mounts
  

  const [formData, setFormData] = useState({
    staffNumber: '',
    title: '',
    firstName: '',
    middleName: '',
    lastName: '',
    DOB: '',
    nextOfKin: '',
    mobilePhone: '',
    homePhone: '',
    workPhone: '',
    email: '',
    position: '',
    department: '',
    nationalID: '',
    maritalStatus: '',
    nationality: '',
    country: '',
    bloodGroup: '',
    usesTobacco: '',
    physicalAddress: '',
    digitalAddress: '',
    picture: '',
    salary: '',
    gender: '',
    isFullTime: false,
    contractType: '',
    confirmed: false,
    confirmationDate: '',
    workAtHome: '',
    overTimeEligible: '',
    probationStarted: false,
    probationPeriod: 0,
    probationUnit: '',
    comments: '',
    baseCurrency: '',
    terminated: false,
    terminationDate: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <form ref={ref} onSubmit={handleSubmit} >
      <div className='grid gap-y-4'>
        {/* Form Group */}
        <div>
          <label className='block text-sm mb-2'> First Name <span className='text-RhemaRed'>*</span> </label>
          <div className='relative'>
            <input
              name="fieldOne"
              value={formData.firstName}
              onChange={handleInputChange}
              className='py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none'
              placeholder='First Name'
              type="text"
            />
          </div>
        </div>
        {/* End Form Group */}

        {/* Form Group */}
        <div>
          <label className='block text-sm mb-2'> Middle Name </label>
          <div className='relative'>
            <input
              name="fieldTwo"
              value={formData.middleName}
              onChange={handleInputChange}
              className='py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none'
              placeholder='Input Field Two'
              type="text"
            />
          </div>
        </div>
        {/* End Form Group */}

        {/* Form Group */}
        <div>
          <label className='block text-sm mb-2'> Comments </label>
          <div className='relative'>
            <textarea
              name="fieldThree"
              value={formData.comments}
              onChange={handleInputChange}
              rows={6}
              className='py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none'
              placeholder='Input Field Three'
            />
          </div>
        </div>
        {/* End Form Group */}

        {/* Form Group */}
        <div>
          <label className='block text-sm mb-2'> Gender </label>
          <div className='relative'>
{/*             <input
              name="fieldTwo"
              value={formData.middleName}
              onChange={handleInputChange}
              className='py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none'
              placeholder='Input Field Two'
              type="text"
            /> */}

            <select name="" id="" autoComplete=''>
              <option value=""></option>
            </select>
          </div>
        </div>
        {/* End Form Group */}
      </div>
    </form>
  );
});

export default EmployeeForm;
