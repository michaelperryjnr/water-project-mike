import * as Dialog from "@radix-ui/react-dialog";
import { useForm } from "@tanstack/react-form";
import axios from "axios";
import { BsX } from "react-icons/bs";
import ErrorMessage from "../../Alerts/floatui/ErrorMessage";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-form-adapter";
import Swal from "sweetalert2";
import { useEffect } from "react";

function UpdateNextOfKinForm({ data, onClose }) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const endPointUrl = `${apiUrl}/nextofkin/${data._id}`; // Assuming the next of kin record has an `_id` field

  const validGender = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ];

  const validRelationship = [
    { value: "mother", label: "Mother" },
    { value: "father", label: "Father" },
    { value: "uncle", label: "Uncle" },
    { value: "aunty", label: "Aunty" },
    { value: "son", label: "Son" },
    { value: "daughter", label: "Daughter" },
    { value: "spouse", label: "Spouse" },
    { value: "cousin", label: "Cousin" },
    { value: "brother", label: "Brother" },
    { value: "sister", label: "Sister" },
    { value: "grandparent", label: "Grandparent" },
    { value: "grandchild", label: "Grandchild" },
    { value: "niece", label: "Niece" },
    { value: "nephew", label: "Nephew" },
  ];

  // Validation schemas
  const nameFormat = z
    .string()
    .min(3, "This field must be at least 3 characters long.");

  const emailFormat = z
    .string()
    .email("Invalid email format. Please enter a valid email address.");

  const phoneNumberFormat = z
    .string()
    .refine(
      (value) => /^(\+)?\([0-9]{1,3}\)-\d{2}-\d{3}-\d{4}$/.test(value),
      "Invalid phone number format. Please use the format +(xxx)-50-404-4044"
    );

  const dropDownFormat = z
    .string()
    .refine((value) => value !== "", "Please select an option");

  const alertNotification = Swal.mixin({
    showConfirmButton: false,
    showCancelButton: false,
  });

  // Initialize the form with TanStack Form
  const form = useForm({
    defaultValues: {
      firstName: data.firstName || "",
      middleName: data.middleName || "",
      lastName: data.lastName || "",
      mobileNumber: data.mobileNumber || "",
      email: data.email || "",
      physicalAddress: data.physicalAddress || "",
      digitalAddress: data.digitalAddress || "",
      relationship: data.relationship || "",
      gender: data.gender || "",
    },
    validatorAdapter: zodValidator(),
    validators: {
      onSubmit: ({ value }) => {
        if (
          !value.firstName ||
          !value.middleName ||
          !value.lastName ||
          !value.mobileNumber ||
          !value.email ||
          !value.physicalAddress ||
          !value.digitalAddress ||
          !value.relationship ||
          !value.gender
        ) {
          return "Please fill in all required fields";
        }
      },
    },
    onSubmit: async ({ value }) => {
      try {
        // Show loading indicator
        alertNotification.fire({
          title: "Updating...",
          text: "Please wait while we update the next of kin",
          icon: "info",
          showConfirmButton: false,
          allowOutsideClick: false,
        });

        const updatedData = { ...value }; // No additional data transformation needed

        console.log("Submitting updated data:", updatedData);

        const response = await axios.put(endPointUrl, updatedData);

        if (response.status === 200) {
          console.log("Updated:", response.data);

          alertNotification
            .fire({
              icon: "success",
              title: "Next of Kin updated successfully",
              timer: 3000,
              text: "The next of kin has been updated successfully.",
            })
            .then(() => {
              window.location.reload(); // Reload the page after successful update
            });
        } else {
          alertNotification.fire({
            icon: "error",
            title: "Error updating next of kin",
            timer: 3000,
            text: "There was an error updating the next of kin.",
          });
          console.error("Failed to update, server returned:", response.status);
        }
      } catch (error) {
        console.error("Error updating form:", error);
        alertNotification.fire({
          icon: "error",
          title: "Update Failed",
          timer: 3000,
          text: "There was an error updating the next of kin, please try again.",
        });
      }
    },
  });

  // Log form state for debugging
  useEffect(() => {
    console.log("Form state:", form.state);
  }, [form.state]);

  return (
    <Dialog.Root open={true} onOpenChange={(open) => !open && onClose()}>
      {/* Modal Content */}
      <Dialog.Portal container={document.body}>
        <Dialog.Overlay
          onClick={() => console.log("Dialog.Overlay rendered")} // Debug log
          className="fixed inset-0 bg-gray-500 bg-opacity-75"
        />

        <Dialog.Content
          onOpenAutoFocus={() => console.log("Dialog.Content opened")} // Debug log
          className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-lg mx-auto px-4 data-[state=open]:animate-[modal-animation-show_600ms] data-[state=closed]:animate-[modal-animation-hide_300ms]"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <div className="relative flex flex-col bg-white border shadow-sm rounded-xl overflow-hidden">
            {/* Close Button */}
            <div className="absolute top-2 end-2">
              <Dialog.Close className="flex justify-center items-center size-7 text-sm font-semibold rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none">
                <BsX className="flex-shrink-0 size-8" />
              </Dialog.Close>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-10 overflow-y-auto" style={{ maxHeight: "600px" }}>
              {/* Logo */}
              <div className="text-center">
                <span className="mb-4 inline-flex justify-center items-center rounded-full">
                  <img src="/Media/Taurean IT Logo3-2_vectorized.png" alt="Logo" className="h-20" />
                </span>
              </div>
              <hr className="border border-taureanOrange" />

              {/* Title */}
              <Dialog.Title className="mt-1 mb-5 text-2xl text-center font-bold text-gray-800">
                Update Next of Kin
              </Dialog.Title>

              <Dialog.Description className="hidden">
                Update next of kin modal dialog
              </Dialog.Description>

              {/* Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
              >
                <div className="grid gap-y-4">
                  {/* First Name */}
                  <form.Field
                    name="firstName"
                    validatorAdapter={zodValidator()}
                    validators={{
                      onChangeAsyncDebounceMs: 500,
                      onChangeAsync: nameFormat,
                    }}
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block text-sm mb-2">
                          First Name <span className="text-RhemaRed">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                            placeholder="John"
                            onBlur={field.handleBlur}
                          />
                          {field.state.meta.errors && (
                            <div className="text-RhemaRed text-sm mt-1">
                              {field.state.meta.errors}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  />

                  {/* Middle Name */}
                  <form.Field
                    name="middleName"
                    validatorAdapter={zodValidator()}
                    validators={{
                      onChangeAsyncDebounceMs: 500,
                      onChangeAsync: nameFormat,
                    }}
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block text-sm mb-2">
                          Middle Name <span className="text-RhemaRed">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                            placeholder="Doe"
                            onBlur={field.handleBlur}
                          />
                          {field.state.meta.errors && (
                            <div className="text-RhemaRed text-sm mt-1">
                              {field.state.meta.errors}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  />

                  {/* Last Name */}
                  <form.Field
                    name="lastName"
                    validatorAdapter={zodValidator()}
                    validators={{
                      onChangeAsyncDebounceMs: 500,
                      onChangeAsync: nameFormat,
                    }}
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block text-sm mb-2">
                          Last Name <span className="text-RhemaRed">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                            placeholder="Smith"
                            onBlur={field.handleBlur}
                          />
                          {field.state.meta.errors && (
                            <div className="text-RhemaRed text-sm mt-1">
                              {field.state.meta.errors}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  />

                  {/* Mobile Number */}
                  <form.Field
                    name="mobileNumber"
                    validatorAdapter={zodValidator()}
                    validators={{
                      onChangeAsyncDebounceMs: 500,
                      onChangeAsync: phoneNumberFormat,
                    }}
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block text-sm mb-2">
                          Mobile Number <span className="text-RhemaRed">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                            placeholder="+(233)-50-404-4044"
                            onBlur={field.handleBlur}
                          />
                          {field.state.meta.errors && (
                            <div className="text-RhemaRed text-sm mt-1">
                              {field.state.meta.errors}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  />

                  {/* Email */}
                  <form.Field
                    name="email"
                    validatorAdapter={zodValidator()}
                    validators={{
                      onChangeAsyncDebounceMs: 500,
                      onChangeAsync: emailFormat,
                    }}
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block text-sm mb-2">
                          Email <span className="text-RhemaRed">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                            placeholder="john.doe.smith@example.com"
                            onBlur={field.handleBlur}
                          />
                          {field.state.meta.errors && (
                            <div className="text-RhemaRed text-sm mt-1">
                              {field.state.meta.errors}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  />

                  {/* Physical Address */}
                  <form.Field
                    name="physicalAddress"
                    validatorAdapter={zodValidator()}
                    validators={{
                      onChangeAsyncDebounceMs: 500,
                      onChangeAsync: nameFormat,
                    }}
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block text-sm mb-2">
                          Physical Address <span className="text-RhemaRed">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                            placeholder="T12/b4/5 Agblezaa North Teshie"
                            onBlur={field.handleBlur}
                          />
                          {field.state.meta.errors && (
                            <div className="text-RhemaRed text-sm mt-1">
                              {field.state.meta.errors}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  />

                  {/* Digital Address */}
                  <form.Field
                    name="digitalAddress"
                    validatorAdapter={zodValidator()}
                    validators={{
                      onChangeAsyncDebounceMs: 500,
                      onChangeAsync: nameFormat,
                    }}
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block text-sm mb-2">
                          Digital Address <span className="text-RhemaRed">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                            placeholder="gz-101-2020"
                            onBlur={field.handleBlur}
                          />
                          {field.state.meta.errors && (
                            <div className="text-RhemaRed text-sm mt-1">
                              {field.state.meta.errors}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  />

                  {/* Relationship */}
                  <form.Field
                    name="relationship"
                    validatorAdapter={zodValidator()}
                    validators={{
                      onChangeAsyncDebounceMs: 500,
                      onChangeAsync: dropDownFormat,
                    }}
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block text-sm mb-2">
                          Relationship To Employee <span className="text-RhemaRed">*</span>
                        </label>
                        <div className="relative">
                          <select
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                            onBlur={field.handleBlur}
                            required
                          >
                            <option value="">Select an option</option>
                            {validRelationship.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          {field.state.meta.errors && (
                            <div className="text-RhemaRed text-sm mt-1">
                              {field.state.meta.errors}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  />

                  {/* Gender */}
                  <form.Field
                    name="gender"
                    validatorAdapter={zodValidator()}
                    validators={{
                      onChangeAsyncDebounceMs: 500,
                      onChangeAsync: dropDownFormat,
                    }}
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block text-sm mb-2">
                          Gender <span className="text-RhemaRed">*</span>
                        </label>
                        <div className="relative">
                          <select
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                            onBlur={field.handleBlur}
                            required
                          >
                            <option value="">Select an option</option>
                            {validGender.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          {field.state.meta.errors && (
                            <div className="text-RhemaRed text-sm mt-1">
                              {field.state.meta.errors}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  />
                </div>

                {/* Error Message */}
                <form.Subscribe
                  selector={(state) => state.errors}
                  children={(errors) =>
                    errors.length > 0 && <ErrorMessage title={"Error"} message={errors} />
                  }
                />
              </form>
            </div>

            {/* Buttons */}
            <div className="items-center gap-x-2 mt-3 py-3 px-4 text-sm sm:flex bg-gray-50 border-t">
              <Dialog.Close className="w-full mt-2 p-2.5 flex-1 text-white bg-taureanOrange rounded-md outline-none ring-offset-2 ring-taureanLightBlue focus:ring-2">
                Cancel
              </Dialog.Close>

              <button
                className="w-full mt-2 p-2.5 flex-1 text-gray-800 rounded-md outline-none border ring-offset-2 ring-taureanDeepBlue focus:ring-2"
                onClick={form.handleSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default UpdateNextOfKinForm;