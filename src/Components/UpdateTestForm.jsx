import React, { useEffect, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom'; // Add useParams
import DefaultLayout from '../Layout/DefaultLayout';
import UpdateInsuranceForm2 from './Forms/UpdateForms/UpdateInsuranceForm';

const UpdateTestForm = () => {
  const { id } = useParams(); // Get the id from the URL
  const location = useLocation();

  // Log the id for debugging
  useEffect(() => {
    console.log("UpdateTestForm - Insurance ID from URL:", id);
    console.log("UpdateTestForm - Location:", location);
  }, [id, location]);

  return (
    <DefaultLayout>
      <div className="space-y-6">
        <div className="bg-white shadow px-4 py-4 sm:rounded-lg sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 py-3 sm:px-0 border-b-2 border-taureanDeepBlue">
                <h3 className="text-5xl font-medium leading-6 text-taureanLightBlue">
                  Update
                </h3>
                <p className="mt-1 text-sm text-taureanOrange">
                  
                </p>
              </div>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <div className="shadow sm:rounded-md sm:overflow-hidden">
                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                  <UpdateInsuranceForm2 />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default UpdateTestForm;