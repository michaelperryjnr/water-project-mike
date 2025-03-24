import * as Dialog from "@radix-ui/react-dialog";
import { useForm } from "@tanstack/react-form";
import axios from "axios";
import { BsX, BsPlus } from "react-icons/bs";
import ErrorMessage from "../Alerts/floatui/ErrorMessage";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-form-adapter";
import Swal from "sweetalert2";

function NextOfKinForm({ title, btnName }) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const endPointUrl = `${apiUrl}/nextofkin`;

  const validGender = [
    {value: 'male', label: 'Male'},
    {value: 'female', label: 'Female'},
  ]

  const validRelationship = [
    { value: 'mother', label: 'Mother' },
    { value: 'father', label: 'Father' },
    { value: 'uncle', label: 'Uncle' },
    { value: 'aunty', label: 'Aunty' },
    { value: 'son', label: 'Son' },
    { value: 'daughter', label: 'Daughter' },
    { value: 'spouse', label: 'Spouse' },
    { value: 'cousin', label: 'Cousin' },
    { value: 'brother', label: 'Brother' },
    { value: 'sister', label: 'Sister' },
    { value: 'grandparent', label: 'Grandparent' },
    { value: 'grandchild', label: 'Grandchild' },
    { value: 'niece', label: 'Niece' },
    { value: 'nephew', label: 'Nephew' }
  ];
  
  const nameFormat = z
  .string()
  .min(3, "This field must be at least 3 characters long.");

  const dropDownFormat = z
  .string()
  .refine(value => value !== "", "Please select an option");

  const emailFormat = z
  .string()
  .email('Invalid email format. Please enter a valid email address.')

  const phoneNumberFormat = z
  .string()
  .refine((value) => /^(\+233)-\d{2}-\d{3}-\d{4}$/.test(value), 'Invalid phone number format. Please use (+233)-50-404-4044.')


    const alertNotification = Swal.mixin({
      showConfirmButton: false,
      showCancelButton: false,
    })

    const form = useForm({
      defaultValues: {
        firstName: "",
        middleName: "",
        lastName: "",
        mobileNumber: "",
        email: "",
        physicalAddress: "",
        digitalAddress: "",
        relationship: "",
        gender: "",
      },
      validators: {
          onSubmit: ({ value }) => {
              if (!value.firstName || !value.middleName || !value.lastName) {
                  return "Please fill in all fields "
              }
          }
      },
      onSubmit: async ({ value }) => {
        try {
          const response = await axios.post(endPointUrl, value);
        
          if (response.status === 201) {
            console.log('Submitted:', response.data);
        
            alertNotification.fire({
              icon: 'success',
              title: 'Next Of Kin added successfully',
              timer: 3000,
              text: 'You have successfully added a new next of kin',
            }).then(() => {
              // Reload the page after the notification is closed
              window.location.reload();
            });
        
          } else if (response.status === 400) {
            alertNotification.fire({
              icon: 'error',
              title: 'Error adding Next Of Kin',
              timer: 3000,
              text: 'There was an error adding the Next Of Kin, the request was invalid',
            });
            console.error("Failed to submit, server returned a non-201 status:", response.status);
          } else if (response.status === 500) {
            alertNotification.fire({
              icon: 'error',
              title: 'Oops!',
              timer: 3000,
              text: "Looks like we have an internal server error, please try again later",
            });
            console.error("Failed to submit, server returned a non-201 status:", response.status);
          }
        } catch (error) {
          console.error("Error submitting form:", error);
          alertNotification.fire({
            icon: 'error',
            title: 'Submission Failed',
            timer: 3000,
            text: 'There was an error submitting the form, please try again.',
          });
          console.error(value);
        }      
      },      
    });

  return (
    <Dialog.Root>

      <Dialog.Trigger className='text-center py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-taureanOrange text-white hover:bg-taureanLightBlue disabled:opacity-50 disabled:pointer-events-none'>
        Add {btnName}
        <BsPlus size={24} />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75" />

        <Dialog.Content className='fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-lg mx-auto px-4 data-[state=open]:animate-[modal-animation-show_600ms]  data-[state=closed]:animate-[modal-animation-hide_300ms]' aria-labelledby="modal-title" aria-describedby="modal-description">
          <div className='relative flex flex-col bg-white border shadow-sm rounded-xl overflow-hidden'>

            <div className='absolute top-2 end-2'>
              <Dialog.Close className='flex justify-center items-center size-7 text-sm font-semibold rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none'>
                <BsX className='flex-shrink-0 size-8' />
              </Dialog.Close>
            </div>

            <div className='p-4 sm:p-10 overflow-y-auto' style={{maxHeight: '600px'}}>
              {/* Icon */}
              <div className='text-center'>
                <span className='mb-4 inline-flex justify-center items-center rounded-full'>
                  <img src="/Media/Taurean IT Logo3-2_vectorized.png" alt="Logo" className='h-20' />
                </span>
              </div>
              {/* End of Icon */}

              <hr className='border border-taureanOrange' />

              <Dialog.Title className='mt-1 mb-5 text-2xl text-center font-bold text-gray-800'>
                {title}
              </Dialog.Title>

              <Dialog.Description className="hidden">
                {title} modal dialog
              </Dialog.Description>

              {/* Form */}
                <form onSubmit={(e) => {e.preventDefault(); e.stopPropagation();}}>
                    <div className="grid gap-y-4">
                        {/* Form Group */}
                        <form.Field name='firstName'
                        validatorAdapter={zodValidator()} 
                        validators={{
                            onChangeAsyncDebounceMs: 500,
                            onChangeAsync: nameFormat
                         }}
                        children={(field) => (
                        <div>
                            <label htmlFor={field.name} className='block text-sm mb-2'> First Name <span className="text-RhemaRed">*</span> </label>
                            <div className="relative">
                                <input 
                                  type="text"
                                  id={field.name}
                                  name={field.name}
                                  value={form.state.values.firstName}
                                  onChange={(e) => field.handleChange(e.target.value)}
                                  className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                                   placeholder="John" 
                                  onBlur={field.handleBlur}
                                />
                                {field.state.meta.errors &&(
                                    <div className="text-RhemaRed text-sm mt-1">
                                        {field.state.meta.errors}
                                    </div>
                                )}
                            </div>
                        </div>
                        )} />
                        {/* End of Form Group */}

                        {/* Form Group */}
                        <form.Field name='middleName'
                        validatorAdapter={zodValidator()} 
                        validators={{
                            onChangeAsyncDebounceMs: 500,
                            onChangeAsync: nameFormat
                         }}
                        children={(field) => (
                        <div>
                            <label htmlFor={field.name} className='block text-sm mb-2'> Middle Name <span className="text-RhemaRed">*</span> </label>
                            <div className="relative">
                                <input 
                                  type="text"
                                  id={field.name}
                                  name={field.name}
                                  value={form.state.values.middleName}
                                  onChange={(e) => field.handleChange(e.target.value)}
                                  className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                                   placeholder="Doe" 
                                  onBlur={field.handleBlur}
                                />
                                {field.state.meta.errors &&(
                                    <div className="text-RhemaRed text-sm mt-1">
                                        {field.state.meta.errors}
                                    </div>
                                )}
                            </div>
                        </div>
                        )} />
                        {/* End of Form Group */}

                        {/* Form Group */}
                        <form.Field name='lastName'
                        validatorAdapter={zodValidator()} 
                        validators={{
                            onChangeAsyncDebounceMs: 500,
                            onChangeAsync: nameFormat
                         }}
                        children={(field) => (
                        <div>
                            <label htmlFor={field.name} className='block text-sm mb-2'> Last Name <span className="text-RhemaRed">*</span> </label>
                            <div className="relative">
                                <input 
                                  type="text"
                                  id={field.name}
                                  name={field.name}
                                  value={form.state.values.lastName}
                                  onChange={(e) => field.handleChange(e.target.value)}
                                  className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                                   placeholder="Smith" 
                                  onBlur={field.handleBlur}
                                />
                                {field.state.meta.errors &&(
                                    <div className="text-RhemaRed text-sm mt-1">
                                        {field.state.meta.errors}
                                    </div>
                                )}
                            </div>
                        </div>
                        )} />
                        {/* End of Form Group */}

                        {/* Form Group */}
                        <form.Field name='mobileNumber'/* 
                        validatorAdapter={zodValidator()} 
                        validators={{
                            onChangeAsyncDebounceMs: 500,
                            onChangeAsync: phoneNumberFormat
                         }} */
                        children={(field) => (
                        <div>
                            <label htmlFor={field.name} className='block text-sm mb-2'> Mobile Number <span className="text-RhemaRed">*</span> </label>
                            <div className="relative">
                                <input 
                                  type="text"
                                  id={field.name}
                                  name={field.name}
                                  value={form.state.values.mobileNumber}
                                  onChange={(e) => field.handleChange(e.target.value)}
                                  className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                                   placeholder="(+233)-50-404-4044" 
                                  onBlur={field.handleBlur}
                                />
                                {field.state.meta.errors &&(
                                    <div className="text-RhemaRed text-sm mt-1">
                                        {field.state.meta.errors}
                                    </div>
                                )}
                            </div>
                        </div>
                        )} />
                        {/* End of Form Group */}

                       {/* Form Group */}
                       <form.Field name='email'
                        validatorAdapter={zodValidator()} 
                        validators={{
                            onChangeAsyncDebounceMs: 500,
                            onChangeAsync: emailFormat
                         }}
                        children={(field) => (
                        <div>
                            <label htmlFor={field.name} className='block text-sm mb-2'> Email <span className="text-RhemaRed">*</span> </label>
                            <div className="relative">
                                <input 
                                  type="text"
                                  id={field.name}
                                  name={field.name}
                                  value={form.state.values.email}
                                  onChange={(e) => field.handleChange(e.target.value)}
                                  className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                                   placeholder="john.doe.smith@example.com" 
                                  onBlur={field.handleBlur}
                                />
                                {field.state.meta.errors &&(
                                    <div className="text-RhemaRed text-sm mt-1">
                                        {field.state.meta.errors}
                                    </div>
                                )}
                            </div>
                        </div>
                        )} />
                        {/* End of Form Group */}

                         {/* Form Group */}
                         <form.Field name= 'physicalAddress'
                        validatorAdapter={zodValidator()} 
                        validators={{
                            onChangeAsyncDebounceMs: 500,
                            onChangeAsync: nameFormat
                         }}
                        children={(field) => (
                        <div>
                            <label htmlFor={field.name} className='block text-sm mb-2'> Physical Address <span className="text-RhemaRed">*</span> </label>
                            <div className="relative">
                                <input 
                                  type="text"
                                  id={field.name}
                                  name={field.name}
                                  value={form.state.values.physicalAddress}
                                  onChange={(e) => field.handleChange(e.target.value)}
                                  className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                                   placeholder="T12/b4/5 Agblezaa North Teshie" 
                                  onBlur={field.handleBlur}
                                />
                                {field.state.meta.errors &&(
                                    <div className="text-RhemaRed text-sm mt-1">
                                        {field.state.meta.errors}
                                    </div>
                                )}
                            </div>
                        </div>
                        )} />
                        {/* End of Form Group */}

                         {/* Form Group */}
                         <form.Field name='digitalAddress'
                        validatorAdapter={zodValidator()} 
                        validators={{
                            onChangeAsyncDebounceMs: 500,
                            onChangeAsync: nameFormat
                         }}
                        children={(field) => (
                        <div>
                            <label htmlFor={field.name} className='block text-sm mb-2'> Digital Address <span className="text-RhemaRed">*</span> </label>
                            <div className="relative">
                                <input 
                                  type="text"
                                  id={field.name}
                                  name={field.name}
                                  value={form.state.values.digitalAddress}
                                  onChange={(e) => field.handleChange(e.target.value)}
                                  className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                                   placeholder="gz-101-2020" 
                                  onBlur={field.handleBlur}
                                />
                                {field.state.meta.errors &&(
                                    <div className="text-RhemaRed text-sm mt-1">
                                        {field.state.meta.errors}
                                    </div>
                                )}
                            </div>
                        </div>
                        )} />
                        {/* End of Form Group */}

                        {/* Form Group */}
                        <form.Field name='relationship'
                        validatorAdapter={zodValidator()}
                         validators={{
                          onChangeAsyncDebounceMs: 500,
                          onChangeAsync: dropDownFormat
                         }}
                         children={(field) => (
                          <div>
                          <label htmlFor="" className="block text-sm mb-2"> Relationship To Employee </label>
                          <div className="relative">
                            <select
                            id={field.name}
                            name= {field.name}
                            value={form.state.values.relationship}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                            onBlur={field.handleBlur}
                            required
                            >
                              <option value="">Select an option</option>
                            { validRelationship.map((option)=> (
                               <option key={option.value} value={option.value}> {option.label} </option>
                              ))}
                            </select>
                            {field.state.meta.errors &&(
                                    <div className="text-RhemaRed text-sm mt-1">
                                        {field.state.meta.errors}
                                    </div>
                                )}
                          </div>
                        </div>
                         )} />
                        {/* End Form Group */}

                        {/* Form Group */}
                        <form.Field name='gender'
                        validatorAdapter={zodValidator()}
                         validators={{
                          onChangeAsyncDebounceMs: 500,
                          onChangeAsync: dropDownFormat
                         }}
                         children={(field) => (
                          <div>
                          <label htmlFor="" className="block text-sm mb-2"> Gender </label>
                          <div className="relative">
                            <select
                            id={field.name}
                            name= {field.name}
                            value={form.state.values.gender}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                            onBlur={field.handleBlur}
                            required
                            >
                              <option value="">Select an option</option>
                            { validGender.map((option)=> (
                               <option key={option.value} value={option.value}> {option.label} </option>
                              ))}
                            </select>
                            {field.state.meta.errors &&(
                                    <div className="text-RhemaRed text-sm mt-1">
                                        {field.state.meta.errors}
                                    </div>
                                )}
                          </div>
                        </div>
                         )} />
                        {/* End Form Group */}
                    </div>
                    <form.Subscribe
                    selector={(state) => state.errors}
                    children = {(errors) =>
                        errors.length > 0 && (
                            <ErrorMessage title={'Error'} message= {errors} />
                        )
                    }
                    />
                </form>
              {/* End of Form */}

            </div>

            {/* Buttons */}
            <div className='items-center gap-x-2 mt-3 py-3 px-4 text-sm sm:flex bg-gray-50 border-t'>
              <Dialog.Close className='w-full mt-2 p-2.5 flex-1 text-white bg-taureanOrange rounded-md outline-none ring-offset-2 ring-taureanLightBlue focus:ring-2'>
                Cancel
              </Dialog.Close>

              <button className='w-full mt-2 p-2.5 flex-1 text-gray-800 rounded-md outline-none border ring-offset-2 ring-taureanDeepBlue focus:ring-2' onClick={form.handleSubmit}>
                Save
              </button>
            </div>
            {/* End of Buttons */}

          </div>
        </Dialog.Content>

      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default NextOfKinForm
