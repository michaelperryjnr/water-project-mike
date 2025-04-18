// src/components/Forms/SubForms/RoadWorthSubForm.jsx
import React from "react";
import { useForm } from "@tanstack/react-form";
import axios from "axios";
import ErrorMessage from "../../Alerts/floatui/ErrorMessage";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-form-adapter";
import Swal from "sweetalert2";
/* import { useNavigate } from "react-router-dom"; */

export default function RoadWorthSubForm() {
  /* const navigate = useNavigate(); */
  const apiUrl = import.meta.env.VITE_API_URL;
  const endPointUrl = `${apiUrl}/roadworth`;

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
      certificateNumber: "",
      issuedBy: "dvla", // Default value as per schema
      notes: "",
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
        const response = await axios.post(endPointUrl, cleanedValue);
        console.log("Response:", response);

        if (response.status === 201) {
          console.log("Created:", response.data);

          alertNotification
            .fire({
              icon: "success",
              title: "Roadworthiness certificate created successfully",
              timer: 3000,
              text: "You have successfully created a Roadworthiness Certificate",
            })
            .then(() => {
              /* navigate("/roadworth"); */
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
              title: "Error creating roadworthiness certificate",
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

  return (
    <div>
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
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Certificate Number <span className="text-RhemaRed">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
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
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Issued By <span className="text-RhemaRed">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
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
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: optionalStringFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Notes
                </label>
                <div className="relative">
                  <textarea
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
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
        <div className="mt-5">
          <button
            type="submit"
            className="w-full p-3 text-white bg-taureanOrange rounded-md outline-none ring-offset-2 ring-taureanLightBlue focus:ring-2"
          >
            Submit
          </button>
        </div>
      </form>
      {/* End of Form */}
    </div>
  );
}