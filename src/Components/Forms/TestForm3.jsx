import React, {useEffect, useRef} from 'react'
import { useLocation } from 'react-router-dom'
import DefaultLayout from '../../Layout/DefaultLayout'
import NextOfKinSubForm from './SubForms/NextOfKinSubForm'
import PositionsSubForm from './SubForms/PositionsSubForm'
import DepartmentSubForm from './SubForms/DepartmentSubForm'
import EmployeeSubForm from './SubForms/EmployeeSubForm'

const TestForm3 = () => {

 const location = useLocation();

  // Refs for scrolling
  const positionRef = useRef(null);
  const employeeRef = useRef(null);
  const departmentRef = useRef(null);
  const nextOfKinRef = useRef(null);

  // Effect to scroll to the correct section
  useEffect(() => {
    if (location.hash) {
      const elementId = location.hash.replace("#", ""); // Remove #
      const element = document.getElementById(elementId);

      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [location]);

  return (
    <DefaultLayout>
        <div className=' space-y-6'>

          <div ref={employeeRef} id="employee-form" className='bg-white shawdow px-4 py-4 sm:rounded-lg sm:p-6'>
            <div className='md:grid md:grid-cols-3 md:gap-6'>
                <div className='md:col-span-1'>
                    <div className='px-4 sm:px-0 border-b-2 border-taureanDeepBlue'>
                        <h3 className='text-5xl font-medium leading6 text-taureanLightBlue'>Employee Form</h3>
                        <p className='mt-1 text-sm text-taureanOrange'> Fill this form to add a employee</p>
                    </div>
                </div>
                <div className='mt-5 md:mt-0 md:col-span-2'>
                    <div className='shadow sm:rounded-md sm:overflow-hidden'>
                        <div className='px-4 py-5 bg-white space-y-6 sm:p-6'>
                            <EmployeeSubForm />  
                        </div>
                    </div>
                </div>
            </div>
          </div>

          <div ref={nextOfKinRef} id="next-of-kin-form" className='bg-white shawdow px-4 py-4 sm:rounded-lg sm:p-6'>
            <div className='md:grid md:grid-cols-3 md:gap-6'>
                <div className='md:col-span-1'>
                    <div className='px-4 sm:px-0 border-b-2 border-taureanDeepBlue'>
                        <h3 className='text-5xl font-medium leading6 text-taureanLightBlue'>Next Of Kin Form</h3>
                        <p className='mt-1 text-sm text-taureanOrange'> Fill this form to add a new next of kin</p>
                    </div>
                </div>
                <div className='mt-5 md:mt-0 md:col-span-2'>
                    <div className='shadow sm:rounded-md sm:overflow-hidden'>
                        <div className='px-4 py-5 bg-white space-y-6 sm:p-6'>
                            <NextOfKinSubForm />  
                        </div>
                    </div>
                </div>
            </div>
          </div>

          <div ref={positionRef} id="position-form" className='bg-white shawdow px-4 py-4 sm:rounded-lg sm:p-6'>
            <div className='md:grid md:grid-cols-3 md:gap-6'>
                <div className='md:col-span-1'>
                    <div className='px-4 sm:px-0 border-b-2 border-taureanDeepBlue'>
                        <h3 className='text-5xl font-medium leading6 text-taureanLightBlue'>Position Form</h3>
                        <p className='mt-1 text-sm text-taureanOrange'> Fill this form to create a new Position</p>
                    </div>
                </div>
                <div className='mt-5 md:mt-0 md:col-span-2'>
                    <div className='shadow sm:rounded-md sm:overflow-hidden'>
                        <div className='px-4 py-5 bg-white space-y-6 sm:p-6'>
                            <PositionsSubForm />  
                        </div>
                    </div>
                </div>
            </div>
          </div>

          <div ref={departmentRef} id='department-form' className='bg-white shawdow px-4 py-4 sm:rounded-lg sm:p-6'>
            <div className='md:grid md:grid-cols-3 md:gap-6'>
                <div className='md:col-span-1'>
                    <div className='px-4 sm:px-0 border-b-2 border-taureanDeepBlue'>
                        <h3 className='text-5xl font-medium leading6 text-taureanLightBlue'>Department Form</h3>
                        <p className='mt-1 text-sm text-taureanOrange'> Fill this form to add a new Department</p>
                    </div>
                </div>
                <div className='mt-5 md:mt-0 md:col-span-2'>
                    <div className='shadow sm:rounded-md sm:overflow-hidden'>
                        <div className='px-4 py-5 bg-white space-y-6 sm:p-6'>
                            <DepartmentSubForm />  
                        </div>
                    </div>
                </div>
            </div>
          </div>

        </div>
    </DefaultLayout>
  )
}

export default TestForm3
