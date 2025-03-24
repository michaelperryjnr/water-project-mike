import * as Dialog from "@radix-ui/react-dialog";
import { useState, useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import axios from "axios";
import { BsX } from "react-icons/bs";
import ErrorMessage from "../../Alerts/floatui/ErrorMessage";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-form-adapter";
import Swal from "sweetalert2";

function UpdateDepartmentForm({ data, onClose }) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const endPointUrl = `${apiUrl}/departments/${data._id}`; // Assuming the department has an `_id` field

  const [employeeData, setEmployeeData] = useState([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(true);
  const [departmentHeadNotFound, setDepartmentHeadNotFound] = useState(false);

  // Fetch employee data for the departmentHead dropdown
  useEffect(() => {
    axios
      .get(`${apiUrl}/employees`)
      .then((response) => {
        const formattedData = response.data.map((emp) => ({
          value: emp._id,
          label: `${emp.firstName} ${emp.middleName || ""} ${emp.lastName}`.trim(),
        }));
        setEmployeeData(formattedData);
        setIsLoadingEmployees(false);

        // Check if the current departmentHeadId exists in the employeeData
        if (data.departmentHeadId && !formattedData.some(emp => emp.value === data.departmentHeadId)) {
          console.warn(`Department head with ID ${data.departmentHeadId} not found in employee data`);
          setDepartmentHeadNotFound(true);
        }
      })
      .catch((error) => {
        console.error("Error fetching employee data:", error);
        setEmployeeData([]);
        setIsLoadingEmployees(false);
      });
  }, [apiUrl, data.departmentHeadId]);

  // Validation schemas
  const nameFormat = z
    .string()
    .min(3, "This field must be at least 3 characters long.");

  const dropDownFormat = z
    .string()
    .nullable()
    .refine(
      (value) => !value || /^[0-9a-fA-F]{24}$/.test(value),
      "Please select a valid employee"
    );

  const alertNotification = Swal.mixin({
    showConfirmButton: false,
    showCancelButton: false,
  });

  // Initialize the form with TanStack Form
  const form = useForm({
    defaultValues: {
      departmentName: data.departmentName || "",
      departmentDescription: data.departmentDescription || "",
      departmentHead: data.departmentHeadId || "", // Use departmentHeadId directly
    },
    validatorAdapter: zodValidator(),
    validators: {
      onSubmit: ({ value }) => {
        if (!value.departmentName || !value.departmentDescription) {
          return "Please fill in all required fields";
        }
      },
    },
    onSubmit: async ({ value }) => {
      try {
        alertNotification.fire({
          title: "Updating...",
          text: "Please wait while we update the department",
          icon: "info",
          showConfirmButton: false,
          allowOutsideClick: false,
        });

        // Clean the data before submission
        const updatedData = {
          ...value,
          departmentHead: value.departmentHead === "" ? null : value.departmentHead, // Convert empty string to null
        };

        const response = await axios.put(endPointUrl, updatedData);

        if (response.status === 200) {
          console.log("Updated:", response.data);
          alertNotification
            .fire({
              icon: "success",
              title: "Department updated successfully",
              timer: 3000,
              text: "The department has been updated successfully.",
            })
            .then(() => {
              window.location.reload(); // Reload the page after successful update
            });
        } else {
          alertNotification.fire({
            icon: "error",
            title: "Error updating department",
            timer: 3000,
            text: "There was an error updating the department.",
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
            "There was an error updating the department, please try again.",
        });
      }
    },
  });

  // Log form state for debugging
  useEffect(() => {
    console.log("Form state:", form.state);
    console.log("Data prop:", data);
    console.log("Employee data:", employeeData);
  }, [form.state, data, employeeData]);

  if (isLoadingEmployees) {
    return <div>Loading...</div>;
  }

  return (
    <Dialog.Root open={true} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal container={document.body}>
        <Dialog.Overlay
          onClick={() => console.log("Dialog.Overlay rendered")} // Debug log
          className="fixed inset-0 bg-gray-500 bg-opacity-75 z-[100] !w-full !h-full"
        />

        <Dialog.Content
          onOpenAutoFocus={() => console.log("Dialog.Content opened")} // Debug log
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
                Update Department
              </Dialog.Title>

              <Dialog.Description className="hidden">
                Update department modal dialog
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
                  {/* Department Name */}
                  <form.Field
                    name="departmentName"
                    validatorAdapter={zodValidator()}
                    validators={{
                      onChangeAsyncDebounceMs: 500,
                      onChangeAsync: nameFormat,
                    }}
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block text-sm mb-2">
                          Department Name <span className="text-RhemaRed">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                            placeholder="Sales Department"
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

                  {/* Department Description */}
                  <form.Field
                    name="departmentDescription"
                    validatorAdapter={zodValidator()}
                    validators={{
                      onChangeAsyncDebounceMs: 500,
                      onChangeAsync: nameFormat,
                    }}
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block text-sm mb-2">
                          Department Description <span className="text-RhemaRed">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                            placeholder="A department that handles sales and marketing"
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

                  {/* Department Head */}
                  <form.Field
                    name="departmentHead"
                    validatorAdapter={zodValidator()}
                    validators={{
                      onChangeAsyncDebounceMs: 500,
                      onChangeAsync: dropDownFormat,
                    }}
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block text-sm mb-2">
                          Department Head
                        </label>
                        <div className="relative">
                          <select
                            id={field.name}
                            name={field.name}
                            value={field.state.value || ""}
                            onChange={(e) => {
                              console.log("Selected departmentHead value:", e.target.value);
                              console.log("Type of selected value:", typeof e.target.value);
                              field.handleChange(e.target.value);
                            }}
                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                            onBlur={field.handleBlur}
                          >
                            <option value="">Select an option</option>
                            {employeeData.map((option) => (
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
                          {departmentHeadNotFound && (
                            <div className="text-RhemaRed text-sm mt-1">
                              The current department head is no longer available. Please select a new one.
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

export default UpdateDepartmentForm;