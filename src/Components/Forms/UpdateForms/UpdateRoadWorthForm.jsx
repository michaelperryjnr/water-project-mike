// src/Forms/UpdateForms/UpdateRoadWorthForm.jsx
import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog"; // Switch to Radix UI
import { useForm } from "@tanstack/react-form";
import axios from "axios";
import { BsX } from "react-icons/bs";
import ErrorMessage from "../../Alerts/floatui/ErrorMessage";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-form-adapter";
import Swal from "sweetalert2";

export default function UpdateRoadWorthForm({ data, onClose }) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const endPointUrl = `${apiUrl}/roadworth/${data._id}`;

  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the existing roadworthiness certificate data
  useEffect(() => {
    const fetchRoadWorth = async () => {
      try {
        const response = await axios.get(endPointUrl);
        setInitialData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching roadworthiness data:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch roadworthiness data. Please try again later.",
        });
        setIsLoading(false);
      }
    };
    fetchRoadWorth();
  }, [endPointUrl]);

  // Validation schemas using zod
  const stringFormat = z
    .string()
    .min(3, "This field must be at least 3 characters long.");

  const optionalStringFormat = z
    .string()
    .optional()
    .refine(
      (value) => !value || value.length >= 3,
      "Notes must be at least 3 characters long if provided"
    );

  const alertNotification = Swal.mixin({
    showConfirmButton: false,
    showCancelButton: false,
  });

  // Initialize the form with TanStack Form
  const form = useForm({
    defaultValues: {
      certificateNumber: initialData?.certificateNumber || "",
      issuedBy: initialData?.issuedBy || "dvla",
      notes: initialData?.notes || "",
    },
    validators: {
      onSubmit: ({ value }) => {
        if (!value.certificateNumber || !value.issuedBy) {
          return "Please fill in all required fields";
        }
      },
    },
    onSubmit: async ({ value }) => {
      // Clean the data before submission (lowercase strings to match schema)
      const cleanedValue = {
        certificateNumber: value.certificateNumber.toLowerCase(),
        issuedBy: value.issuedBy.toLowerCase(),
        notes: value.notes ? value.notes.toLowerCase() : undefined,
      };

      try {
        console.log("Submitting data to:", endPointUrl);
        console.log("Data:", cleanedValue);
        const response = await axios.put(endPointUrl, cleanedValue);
        console.log("Response:", response);

        if (response.status === 200) {
          console.log("Updated:", response.data);

          alertNotification
            .fire({
              icon: "success",
              title: "Roadworthiness certificate updated successfully",
              timer: 3000,
              text: "You have successfully updated the Roadworthiness Certificate",
            })
            .then(() => {
              window.location.reload();
            });
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        console.error("Error details:", {
          message: error.message,
          response: error.response,
          request: error.request,
        });

        if (error.response) {
          const { status, data } = error.response;
          let displayMessage = data.message || "An unexpected error occurred.";

          if (status === 400) {
            displayMessage = "Please check your input values: " + displayMessage.split(": ").slice(1).join(": ");
            alertNotification.fire({
              icon: "error",
              title: "Error updating roadworthiness certificate",
              timer: 3000,
              text: displayMessage,
            });
          } else if (status === 409) {
            displayMessage = "This certificate number already exists. Please use a unique certificate number.";
            alertNotification.fire({
              icon: "error",
              title: "Submission Failed",
              timer: 3000,
              text: displayMessage,
            });
          } else if (status === 500) {
            alertNotification.fire({
              icon: "error",
              title: "Server Error",
              timer: 3000,
              text: displayMessage || "Looks like we have an internal server error, please try again later",
            });
          } else {
            alertNotification.fire({
              icon: "error",
              title: "Submission Failed",
              timer: 3000,
              text: `Unexpected error: ${displayMessage || "Please try again."}`,
            });
          }
        } else {
          alertNotification.fire({
            icon: "error",
            title: "Submission Failed",
            timer: 3000,
            text: `There was an error submitting the form: ${error.message}. Please check your network and try again.`,
          });
        }
      }
    },
  });

  // Update form default values once initial data is fetched
  useEffect(() => {
    if (initialData) {
      form.setFieldValue("certificateNumber", initialData.certificateNumber || "");
      form.setFieldValue("issuedBy", initialData.issuedBy || "dvla");
      form.setFieldValue("notes", initialData.notes || "");
    }
  }, [initialData, form]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!initialData) {
    return <div>Error: Roadworthiness certificate not found.</div>;
  }

  return (
    <Dialog.Root open={true} onOpenChange={(open) => !open && onClose()}>
      {/* Modal Content */}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75" />

        <Dialog.Content
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
                  <img
                    src="/Media/Taurean IT Logo3-2_vectorized.png"
                    alt="Logo"
                    className="h-20"
                  />
                </span>
              </div>
              <hr className="border border-taureanOrange" />

              {/* Title */}
              <Dialog.Title className="mt-1 mb-5 text-2xl text-center font-bold text-gray-800">
                Update Roadworthiness Certificate
              </Dialog.Title>

              <Dialog.Description className="hidden">
                Update roadworthiness certificate modal dialog
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
                  {/* Form Group: Certificate Number */}
                  <form.Field
                    name="certificateNumber"
                    validatorAdapter={zodValidator()}
                    validators={{
                      onChangeAsyncDebounceMs: 500,
                      onChangeAsync: stringFormat,
                    }}
                    children={(field) => (
                      <div>
                        <label
                          htmlFor={field.name}
                          className="block text-sm mb-2"
                        >
                          Certificate Number{" "}
                          <span className="text-RhemaRed">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onChange={(e) =>
                              field.handleChange(e.target.value)
                            }
                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                            placeholder="RW123456"
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
                  {/* End of Form Group */}

                  {/* Form Group: Issued By */}
                  <form.Field
                    name="issuedBy"
                    validatorAdapter={zodValidator()}
                    validators={{
                      onChangeAsyncDebounceMs: 500,
                      onChangeAsync: stringFormat,
                    }}
                    children={(field) => (
                      <div>
                        <label
                          htmlFor={field.name}
                          className="block text-sm mb-2"
                        >
                          Issued By{" "}
                          <span className="text-RhemaRed">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onChange={(e) =>
                              field.handleChange(e.target.value)
                            }
                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                            placeholder="DVLA"
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
                  {/* End of Form Group */}

                  {/* Form Group: Notes */}
                  <form.Field
                    name="notes"
                    validator RussieAdapter={zodValidator()}
                    validators={{
                      onChangeAsyncDebounceMs: 500,
                      onChangeAsync: optionalStringFormat,
                    }}
                    children={(field) => (
                      <div>
                        <label
                          htmlFor={field.name}
                          className="block text-sm mb-2"
                        >
                          Notes
                        </label>
                        <div className="relative">
                          <textarea
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onChange={(e) =>
                              field.handleChange(e.target.value)
                            }
                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                            placeholder="Additional notes or comments"
                            onBlur={field.handleBlur}
                            rows="4"
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
                  {/* End of Form Group */}
                </div>
                <form.Subscribe
                  selector={(state) => state.errors}
                  children={(errors) =>
                    errors.length > 0 && (
                      <ErrorMessage title={"Error"} message={errors} />
                    )
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