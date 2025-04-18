import { useState, useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import axios from "axios";
import ErrorMessage from "../../Alerts/floatui/ErrorMessage";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-form-adapter";
import Swal from "sweetalert2";

function InsuranceSubForm() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const endPointUrl = `${apiUrl}/insurance`;

  // Define enum values (copied from the schema)
  const VALID_INSURANCE_TYPE = [
    "health",
    "life",
    "auto",
    "home",
    "travel",
    "business",
  ];
  const AUTO_INSURANCE_TYPES = [
    "comprehensive",
    "third-party",
    "collision",
    "liability",
    "uninsured motorist",
  ];
  const VALID_PROVIDERS = [
    "enterprise insurance",
    "alliance insurance",
    "united insurance",
    "global insurance",
    "sic insurance",
    "star assurance",
    "allianz",
    "axa",
    "metlife",
    "prudential",
    "liberty mutual",
    "geico",
    "progressive",
    "state farm",
    "travelers",
    "nationwide",
    "farmers",
    "american family",
    "chubb",
    "the hartford",
  ];

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

  const form = useForm({
    defaultValues: {
      policyNumber: "",
      provider: "",
      coverageAmount: "",
      insuranceType: "",
      autoInsuranceType: "",
      insuranceDescription: "",
    },
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
      // Clean the data before submission (lowercase strings to match schema)
      const cleanedValue = {
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

      try {
        const response = await axios.post(endPointUrl, cleanedValue);

        if (response.status === 201) {
          console.log("Submitted:", response.data);

          alertNotification
            .fire({
              icon: "success",
              title: "Insurance added successfully",
              timer: 3000,
              text: "You have successfully added a new insurance record",
            })
            .then(() => {
              // Reload the page after the notification is closed
              window.location.reload();
            });
        } else if (response.status === 400) {
          alertNotification.fire({
            icon: "error",
            title: "Error adding insurance",
            timer: 3000,
            text: "There was an error adding the insurance record, the request was invalid",
          });
          console.error(
            "Failed to submit, server returned a non-201 status:",
            response.status
          );
        } else if (response.status === 500) {
          alertNotification.fire({
            icon: "error",
            title: "Oops!",
            timer: 3000,
            text: "Looks like we have an internal server error, please try again later",
          });
          console.error(
            "Failed to submit, server returned a non-201 status:",
            response.status
          );
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        alertNotification.fire({
          icon: "error",
          title: "Submission Failed",
          timer: 3000,
          text: "There was an error submitting the form, please try again.",
        });
        console.error(value);
      }
    },
  });

  return (
    <div>
      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <div className="grid gap-y-4">
          {/* Form Group: Policy Number */}
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
                    value={form.state.values.policyNumber}
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
          {/* End of Form Group */}

          {/* Form Group: Provider */}
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
                    value={form.state.values.provider}
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
          {/* End of Form Group */}

          {/* Form Group: Coverage Amount */}
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
                    value={form.state.values.coverageAmount}
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
          {/* End of Form Group */}

          {/* Form Group: Insurance Type */}
          <form.Field
            name="insuranceType"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: insuranceTypeFormat,
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
                    value={form.state.values.insuranceType}
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
          {/* End of Form Group */}

          {/* Form Group: Auto Insurance Type (Conditional) */}
          <form.Subscribe selector={(state) => state.values.insuranceType}>
            {(insuranceType) =>
              insuranceType === "auto" && (
                <form.Field
                  name="autoInsuranceType"
                  validatorAdapter={zodValidator()}
                  validators={{
                    onChangeAsyncDebounceMs: 5,
                    onChangeAsync: autoInsuranceTypeFormat,
                  }}
                >
                  {(field) => (
                    <div>
                      <label
                        htmlFor={field.name}
                        className="block text-sm mb-2"
                      >
                        Auto Insurance Type{" "}
                        <span className="text-RhemaRed">*</span>
                      </label>
                      <div className="relative">
                        <select
                          id={field.name}
                          name={field.name}
                          value={form.state.values.autoInsuranceType}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                          onBlur={field.handleBlur}
                          required
                        >
                          <option value="">
                            Select an auto insurance type
                          </option>
                          {AUTO_INSURANCE_TYPES.map((type) => (
                            <option key={type} value={type}>
                              {type
                                .split("-")
                                .map(
                                  (word) =>
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
                </form.Field>
              )
            }
          </form.Subscribe>
          {/* End of Form Group */}

          {/* Form Group: Insurance Description */}
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
                    value={form.state.values.insuranceDescription}
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
      {/* End of Form */}

      <div className="items-center gap-x-2 mt-3 py-3 px-4 text-sm sm:flex border-t">
        <button
          className="w-full mt-2 p-2.5 flex-1 text-white bg-taureanOrange rounded-md outline-none ring-offset-2 ring-taureanLightBlue focus:ring-2"
          onClick={form.handleSubmit}
        >
          save
        </button>
      </div>
    </div>
  );
}

export default InsuranceSubForm;
