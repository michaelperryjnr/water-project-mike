import * as Dialog from "@radix-ui/react-dialog";
import { useState, useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import axios from "axios";
import { BsX } from "react-icons/bs";
import ErrorMessage from "../../Alerts/floatui/ErrorMessage";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-form-adapter";
import Swal from "sweetalert2";

function UpdateInsuranceForm1({ data, onClose }) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const endPointUrl = `${apiUrl}/insurance/${data._id}`; // Use the insurance policy's _id

  // Define enum values (same as InsuranceSubForm)
  const VALID_INSURANCE_TYPE = ["health", "life", "auto", "home", "travel", "business"];
  const AUTO_INSURANCE_TYPES = ["comprehensive", "third-party", "collision", "liability", "uninsured motorist"];
  const VALID_PROVIDERS = ["enterprise insurance", "alliance insurance", "united insurance", "global insurance", "sic insurance", "star assurance", "allianz", "axa", "metlife", "prudential", "liberty mutual", "geico", "progressive", "state farm", "travelers", "nationwide", "farmers", "american family", "chubb", "the hartford"];

  // Validation schemas using zod
  const stringFormat = z
    .string()
    .min(3, "This field must be at least 3 characters long.");

  const optionalStringFormat = z
    .string()
    .optional()
    .refine(
      (value) => !value || value.length >= 3,
      "Description must be at least 3 characters long if provided"
    );

  const numberFormat = z
    .number()
    .min(0, "Coverage amount must be a positive number");

  const providerFormat = z.enum(VALID_PROVIDERS, {
    errorMap: () => ({ message: "Please select a valid provider" }),
  });

  const insuranceTypeFormat = z.enum(VALID_INSURANCE_TYPE, {
    errorMap: () => ({ message: "Please select a valid insurance type" }),
  });

  const autoInsuranceTypeFormat = z.enum(AUTO_INSURANCE_TYPES, {
    errorMap: () => ({ message: "Please select a valid auto insurance type" }),
  });

  const alertNotification = Swal.mixin({
    showConfirmButton: false,
    showCancelButton: false,
  });

  // Initialize the form with TanStack Form
  const form = useForm({
    defaultValues: {
      policyNumber: data.policyNumber || "",
      provider: data.provider || "",
      coverageAmount: data.coverageAmount || "",
      insuranceType: data.insuranceType || "",
      autoInsuranceType: data.autoInsuranceType || "",
      insuranceDescription: data.insuranceDescription || "",
    },
    validatorAdapter: zodValidator(),
    validators: {
      onSubmit: ({ value }) => {
        if (
          !value.policyNumber ||
          !value.provider ||
          !value.coverageAmount ||
          !value.insuranceType ||
          (value.insuranceType === "auto" && !value.autoInsuranceType)
        ) {
          return "Please fill in all required fields";
        }
      },
    },
    onSubmit: async ({ value }) => {
      try {
        alertNotification.fire({
          title: "Updating...",
          text: "Please wait while we update the insurance policy",
          icon: "info",
          showConfirmButton: false,
          allowOutsideClick: false,
        });

        // Clean the data before submission (lowercase strings to match schema)
        const updatedData = {
          policyNumber: value.policyNumber.toLowerCase(),
          provider: value.provider.toLowerCase(),
          coverageAmount: parseFloat(value.coverageAmount),
          insuranceType: value.insuranceType.toLowerCase(),
          autoInsuranceType: value.autoInsuranceType
            ? value.autoInsuranceType.toLowerCase()
            : undefined,
          insuranceDescription: value.insuranceDescription
            ? value.insuranceDescription.toLowerCase()
            : undefined,
        };

        const response = await axios.put(endPointUrl, updatedData);

        if (response.status === 200) {
          console.log("Updated:", response.data);
          alertNotification
            .fire({
              icon: "success",
              title: "Insurance policy updated successfully",
              timer: 3000,
              text: "The insurance policy has been updated successfully.",
            })
            .then(() => {
              window.location.reload(); // Reload the page after successful update
            });
        } else {
          alertNotification.fire({
            icon: "error",
            title: "Error updating insurance policy",
            timer: 3000,
            text: "There was an error updating the insurance policy.",
          });
          console.error("Failed to update, server returned:", response.status);
        }
      } catch (error) {
        console.error("Error updating form:", error);
        alertNotification.fire({
          icon: "error",
          title: "Update Failed",
          timer: 10000,
          text:
            error.response?.data?.message ||
            "There was an error updating the insurance policy, please try again.",
        });
      }
    },
  });

  // Log form state for debugging
  useEffect(() => {
    console.log("Form state:", form.state);
    console.log("Data prop:", data);
  }, [form.state, data]);

  return (
    <Dialog.Root open={true} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal container={document.body}>
        <Dialog.Overlay
          className="fixed inset-0 bg-gray-500 bg-opacity-75 z-[100] !w-full !h-full"
        />

        <Dialog.Content
          className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-lg mx-auto px-4 z-[101] data-[state=open]:animate-[modal-animation-show_600ms] data-[state=closed]:animate-[modal-animation-hide_300ms]"
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
                Update Insurance Policy
              </Dialog.Title>

              <Dialog.Description className="hidden">
                Update insurance policy modal dialog
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
                  {/* Policy Number */}
                  <form.Field
                    name="policyNumber"
                    validatorAdapter={zodValidator()}
                    validators={{
                      onChangeAsyncDebounceMs: 500,
                      onChangeAsync: stringFormat,
                    }}
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block text-sm mb-2">
                          Policy Number <span className="text-RhemaRed">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                            placeholder="POL123456"
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

                  {/* Provider */}
                  <form.Field
                    name="provider"
                    validatorAdapter={zodValidator()}
                    validators={{
                      onChangeAsyncDebounceMs: 500,
                      onChangeAsync: providerFormat,
                    }}
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block text-sm mb-2">
                          Insurance Provider <span className="text-RhemaRed">*</span>
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
                            <option value="">Select a provider</option>
                            {VALID_PROVIDERS.map((provider) => (
                              <option key={provider} value={provider}>
                                {provider.charAt(0).toUpperCase() + provider.slice(1)}
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

                  {/* Coverage Amount */}
                  <form.Field
                    name="coverageAmount"
                    validatorAdapter={zodValidator()}
                    validators={{
                      onChangeAsyncDebounceMs: 500,
                      onChangeAsync: numberFormat,
                    }}
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block text-sm mb-2">
                          Coverage Amount <span className="text-RhemaRed">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onChange={(e) =>
                              field.handleChange(
                                e.target.value ? parseFloat(e.target.value) : ""
                              )
                            }
                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                            placeholder="50000"
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

                  {/* Insurance Type */}
                  <form.Field
                    name="insuranceType"
                    validatorAdapter={zodValidator()}
                    validators={{
                      onChange: insuranceTypeFormat,
                    }}
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block text-sm mb-2">
                          Insurance Type <span className="text-RhemaRed">*</span>
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
                            <option value="">Select an insurance type</option>
                            {VALID_INSURANCE_TYPE.map((type) => (
                              <option key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
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

                  {/* Auto Insurance Type (Conditional) */}
                  <form.Subscribe
                    selector={(state) => state.values.insuranceType}
                    children={(insuranceType) =>
                      insuranceType === "auto" && (
                        <form.Field
                          name="autoInsuranceType"
                          validatorAdapter={zodValidator()}
                          validators={{
                            onChangeAsyncDebounceMs: 5,
                            onChangeAsync: autoInsuranceTypeFormat,
                          }}
                          children={(field) => (
                            <div>
                              <label htmlFor={field.name} className="block text-sm mb-2">
                                Auto Insurance Type <span className="text-RhemaRed">*</span>
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
                                  <option value="">Select an auto insurance type</option>
                                  {AUTO_INSURANCE_TYPES.map((type) => (
                                    <option key={type} value={type}>
                                      {type
                                        .split("-")
                                        .map((word) =>
                                          word.charAt(0).toUpperCase() + word.slice(1)
                                        )
                                        .join(" ")}
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
                      )
                    }
                  />

                  {/* Insurance Description */}
                  <form.Field
                    name="insuranceDescription"
                    validatorAdapter={zodValidator()}
                    validators={{
                      onChangeAsyncDebounceMs: 500,
                      onChangeAsync: optionalStringFormat,
                    }}
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block text-sm mb-2">
                          Insurance Description
                        </label>
                        <div className="relative">
                          <textarea
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                            placeholder="Details about the insurance policy"
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

export default UpdateInsuranceForm1;