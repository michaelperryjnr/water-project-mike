import * as Dialog from "@radix-ui/react-dialog";
import { useForm } from "@tanstack/react-form";
import axios from "axios";
import { BsX, BsPencil } from "react-icons/bs";
import ErrorMessage from "../../Alerts/floatui/ErrorMessage";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-form-adapter";
import Swal from "sweetalert2";
import { useEffect } from "react";

function UpdatePositionForm({ data, onClose }) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const endPointUrl = `${apiUrl}/positions/${data._id}`; // Assuming the position has an `_id` field

  const validIsActive = [
    { value: "true", label: "True" },
    { value: "false", label: "False" },
  ];

  // Validation schemas
  const nameFormat = z
    .string()
    .min(3, "This field must be at least 3 characters long.");

  const salaryFormat = z
    .string()
    .refine((value) => !isNaN(parseFloat(value)) && parseFloat(value) > 0, "Please enter a valid salary");

  const dropDownFormat = z
    .string()
    .refine((value) => value === "true" || value === "false", "Please select an option");

  const alertNotification = Swal.mixin({
    showConfirmButton: false,
    showCancelButton: false,
  });

  // Initialize the form with TanStack Form
  const form = useForm({
    defaultValues: {
      positionTitle: data.positionTitle || "",
      positionDescription: data.positionDescription || "",
      positionBaseSalary: data.positionBaseSalary?.toString() || "",
      positionResponsibilities: data.positionResponsibilities || [""],
      qualifications: data.qualifications || [""],
      isActive: data.isActive?.toString() || "",
    },
    validatorAdapter: zodValidator(),
    validators: {
      onSubmit: ({ value }) => {
        if (!value.positionTitle || !value.positionDescription || !value.positionBaseSalary) {
          return "Please fill in all required fields";
        }
      },
    },
    onSubmit: async ({ value }) => {
      try {
        // Convert data as needed for the backend
        const updatedData = {
          ...value,
          positionBaseSalary: parseFloat(value.positionBaseSalary),
          isActive: value.isActive === "true",
          positionResponsibilities: value.positionResponsibilities.filter((item) => item.trim() !== ""),
          qualifications: value.qualifications.filter((item) => item.trim() !== ""),
        };

        console.log("Submitting updated data:", updatedData);

        const response = await axios.put(endPointUrl, updatedData);

        if (response.status === 200) {
          console.log("Updated:", response.data);

          alertNotification
            .fire({
              icon: "success",
              title: "Position updated successfully",
              timer: 3000,
              text: "The position has been updated successfully.",
            })
            .then(() => {
              window.location.reload(); // Reload the page after successful update
            });
        } else {
          alertNotification.fire({
            icon: "error",
            title: "Error updating position",
            timer: 3000,
            text: "There was an error updating the position.",
          });
          console.error("Failed to update, server returned:", response.status);
        }
      } catch (error) {
        console.error("Error updating form:", error);
        alertNotification.fire({
          icon: "error",
          title: "Update Failed",
          timer: 3000,
          text: "There was an error updating the position, please try again.",
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
      {/* Trigger Button */}
      {/* <Dialog.Trigger
        onClick={() => console.log("Dialog.Trigger clicked")} // Debug log
        className="text-center py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-gray-700 hover:bg-gray-100 w-full"
      >
        Edit Position
        <BsPencil size={20} />
      </Dialog.Trigger> */}

      {/* Modal Content */}
      <Dialog.Portal>
        <Dialog.Overlay
          onClick={() => console.log("Dialog.Overlay rendered")} // Debug log
          className="fixed inset-0 bg-gray-500 bg-opacity-75 "
        />

        <Dialog.Content
          onOpenAutoFocus={() => console.log("Dialog.Content opened")} // Debug log
          className='fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-lg mx-auto px-4 data-[state=open]:animate-[modal-animation-show_600ms]  data-[state=closed]:animate-[modal-animation-hide_300ms]' aria-labelledby="modal-title" aria-describedby="modal-description"
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
                Update Position
              </Dialog.Title>

              <Dialog.Description className="hidden">
                Update position modal dialog
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
                  {/* Position Title */}
                  <form.Field
                    name="positionTitle"
                    validatorAdapter={zodValidator()}
                    validators={{
                      onChangeAsyncDebounceMs: 500,
                      onChangeAsync: nameFormat,
                    }}
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block text-sm mb-2">
                          Position Title <span className="text-RhemaRed">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                            placeholder="Junior Software Engineer"
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

                  {/* Position Description */}
                  <form.Field
                    name="positionDescription"
                    validatorAdapter={zodValidator()}
                    validators={{
                      onChangeAsyncDebounceMs: 500,
                      onChangeAsync: nameFormat,
                    }}
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block text-sm mb-2">
                          Position Description <span className="text-RhemaRed">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                            placeholder="Assists in developing and testing web applications under supervision"
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

                  {/* Position Base Salary */}
                  <form.Field
                    name="positionBaseSalary"
                    validatorAdapter={zodValidator()}
                    validators={{
                      onChangeAsyncDebounceMs: 500,
                      onChangeAsync: salaryFormat,
                    }}
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block text-sm mb-2">
                          Base Salary (Monthly Take Home) <span className="text-RhemaRed">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                            placeholder="45000"
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

                  {/* Position Responsibilities */}
                  <form.Field
                    name="positionResponsibilities"
                    mode="array"
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block text-sm mb-2">
                          Key Responsibilities <span className="text-RhemaRed">*</span>
                        </label>
                        {field.state.value.map((_, index) => (
                          <div
                            key={index}
                            className="my-2 py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                          >
                            <form.Field
                              name={`positionResponsibilities[${index}]`}
                              children={(subField) => (
                                <input
                                  type="text"
                                  placeholder="Write unit tests"
                                  className="mb-2 py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50"
                                  value={subField.state.value}
                                  onChange={(e) => subField.handleChange(e.target.value)}
                                />
                              )}
                            />
                            <button
                              type="button"
                              className="bg-RhemaRed px-2 py-2 rounded-md"
                              onClick={() => field.removeValue(index)}
                            >
                              <BsX className="text-white" size={23} />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="text-center py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-taureanOrange text-white hover:bg-taureanLightBlue disabled:opacity-50 disabled:pointer-events-none"
                          onClick={() => field.pushValue("")}
                        >
                          Add
                        </button>
                      </div>
                    )}
                  />

                  {/* Qualifications */}
                  <form.Field
                    name="qualifications"
                    mode="array"
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block text-sm mb-2">
                          Required Qualifications <span className="text-RhemaRed">*</span>
                        </label>
                        {field.state.value.map((_, index) => (
                          <div
                            key={index}
                            className="my-2 py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                          >
                            <form.Field
                              name={`qualifications[${index}]`}
                              children={(subField) => (
                                <input
                                  type="text"
                                  placeholder="BSc in Computer Science or related field"
                                  className="mb-2 py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50"
                                  value={subField.state.value}
                                  onChange={(e) => subField.handleChange(e.target.value)}
                                />
                              )}
                            />
                            <button
                              type="button"
                              className="bg-RhemaRed px-2 py-2 rounded-md"
                              onClick={() => field.removeValue(index)}
                            >
                              <BsX className="text-white" size={23} />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="text-center py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-taureanOrange text-white hover:bg-taureanLightBlue disabled:opacity-50 disabled:pointer-events-none"
                          onClick={() => field.pushValue("")}
                        >
                          Add
                        </button>
                      </div>
                    )}
                  />

                  {/* Is Active */}
                  <form.Field
                    name="isActive"
                    validatorAdapter={zodValidator()}
                    validators={{
                      onChangeAsyncDebounceMs: 500,
                      onChangeAsync: dropDownFormat,
                    }}
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block text-sm mb-2">
                          Is Position Active
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
                            {validIsActive.map((option) => (
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

export default UpdatePositionForm;