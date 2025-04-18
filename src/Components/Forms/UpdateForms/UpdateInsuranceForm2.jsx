import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "@tanstack/react-form";
import axios from "axios";
import ErrorMessage from "../../Alerts/floatui/ErrorMessage";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-form-adapter";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";

function UpdateInsuranceForm2() {
  const { id } = useParams(); // Get the insurance ID from the URL
  const apiUrl = import.meta.env.VITE_API_URL;
  const endPointUrl = `${apiUrl}/insurance/${id}`;

  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // Hook for navigation

  // Define enum values (same as InsuranceSubForm)
  const VALID_INSURANCE_TYPE = ["health", "life", "auto", "home", "travel", "business"];
  const AUTO_INSURANCE_TYPES = ["comprehensive", "third-party", "collision", "liability", "uninsured motorist"];
  const VALID_PROVIDERS = ["enterprise insurance", "alliance insurance", "united insurance", "global insurance", "sic insurance", "star assurance", "allianz", "axa", "metlife", "prudential","liberty mutual", "geico", "progressive", "state farm", "travelers", "nationwide", "farmers", "american family", "chubb", "the hartford"];

  // Fetch the existing insurance policy data
  useEffect(() => {
    const fetchInsurance = async () => {
      try {
        const response = await axios.get(endPointUrl);
        setInitialData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching insurance data:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch insurance data. Please try again later.",
        });
        setIsLoading(false);
      }
    };
    fetchInsurance();
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
      policyNumber: initialData?.policyNumber || "",
      provider: initialData?.provider || "",
      coverageAmount: initialData?.coverageAmount || "",
      insuranceType: initialData?.insuranceType || "",
      autoInsuranceType: initialData?.autoInsuranceType || "",
      insuranceDescription: initialData?.insuranceDescription || "",
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
        console.log("Submitting data to:", endPointUrl);
        console.log("Data:", cleanedValue);
        const response = await axios.put(endPointUrl, cleanedValue);
        console.log("Response:", response);

        if (response.status === 200) {
          console.log("Updated:", response.data);

          alertNotification
            .fire({
              icon: "success",
              title: "Insurance updated successfully",
              timer: 3000,
              text: "You have successfully updated the insurance record",
            })
            .then(() => {
              
              navigate("/insurance"); // Navigate to the insurance list page
            });
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        console.error("Error details:", {
          message: error.message,
          response: error.response,
          request: error.request,
        });

        // Check if the error is an Axios error with a response
        if (error.response) {
          const { status, data } = error.response;
          let displayMessage = data.message || "An unexpected error occurred.";

          // Simplify error messages for users
          if (status === 400) {
            if (displayMessage.includes("Auto insurance type is required")) {
              displayMessage = "Please select an auto insurance type for auto insurance.";
            } else if (displayMessage.includes("ValidationError")) {
              displayMessage = "Please check your input values: " + displayMessage.split(": ").slice(1).join(": ");
            }
            alertNotification.fire({
              icon: "error",
              title: "Error updating insurance",
              timer: 3000,
              text: displayMessage,
            });
          } else if (status === 409) {
            displayMessage = "This policy number already exists. Please use a unique policy number.";
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
          // Network error or other issues (no response from server)
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
      form.setFieldValue("policyNumber", initialData.policyNumber || "");
      form.setFieldValue("provider", initialData.provider || "");
      form.setFieldValue("coverageAmount", initialData.coverageAmount || "");
      form.setFieldValue("insuranceType", initialData.insuranceType || "");
      form.setFieldValue("autoInsuranceType", initialData.autoInsuranceType || "");
      form.setFieldValue("insuranceDescription", initialData.insuranceDescription || "");
    }
  }, [initialData, form]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!initialData) {
    return <div>Error: Insurance policy not found.</div>;
  }

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
          {/* End of Form Group */}

          {/* Form Group: Insurance Type */}
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
          {/* End of Form Group */}

          {/* Form Group: Auto Insurance Type (Conditional) */}
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
          Save
        </button>
      </div>
    </div>
  );
}

export default UpdateInsuranceForm2;