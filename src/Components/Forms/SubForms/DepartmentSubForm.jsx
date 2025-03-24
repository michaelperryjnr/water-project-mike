import { useState, useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import axios from "axios";
import ErrorMessage from "../../Alerts/floatui/ErrorMessage";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-form-adapter";
import Swal from "sweetalert2";

function DepartmentSubForm() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const endPointUrl = `${apiUrl}/departments`;

    const [employeeData, setemployeeData] = useState([]);

    useEffect(() => {
      //Fetch employee data from the backend
      axios.get(`${apiUrl}/employees`) //Replace with actual API enpoint
      .then((response) => {
        const formattedData = response.data.map(emp => ({
          value: emp._id,
          label: `${emp.firstName} ${emp.middleName} ${emp.lastName}`
        }));
        setemployeeData(formattedData);
      })
      .catch((error) => {
        console.error("Error fetching employee data: ", error);
      })
    }, []);
    
 

    const nameFormat = z
      .string()
      .min(3, "This field must be at least 3 characters long.");
  
    const dropDownFormat = z
      .string()
      .refine((value) => !value || /^[0-9a-fA-F]{24}$/.test(value), 'Please select an option');

  
    const alertNotification = Swal.mixin({
      showConfirmButton: false,
      showCancelButton: false,
    });
  
    const form = useForm({
      defaultValues: {
        departmentName: "",
        departmentDescription: "",
        departmentHead: null,
      },
      validators: {
        onSubmit: ({ value }) => {
          if (!value.departmentName || !value.departmentDescription) {
            return "Please fill in all fields ";
          }
        },
      },
      onSubmit: async ({ value }) => {
        // Clean the data before submission
      const cleanedValue = {
        ...value,
        departmentHead: value.departmentHead === "" ? null : value.departmentHead, // Convert empty string to null
      };
      
        try {
          const response = await axios.post(endPointUrl, value);
  
          if (response.status === 201) {
            console.log("Submitted:", response.data);
  
            alertNotification
              .fire({
                icon: "success",
                title: "Department added successfully",
                timer: 3000,
                text: "You have successfully added a new department",
              })
              .then(() => {
                // Reload the page after the notification is closed
                window.location.reload();
              });
          } else if (response.status === 400) {
            alertNotification.fire({
              icon: "error",
              title: "Error adding department",
              timer: 3000,
              text: "There was an error adding a department, the request was invalid",
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
          {/* Form Group */}
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
                  {" "}
                  Department Name <span className="text-RhemaRed">*</span>{" "}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id={field.name}
                    name={field.name}
                    value={form.state.values.departmentName}
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
          {/* End of Form Group */}

          {/* Form Group */}
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
                  {" "}
                  Department Description <span className="text-RhemaRed">*</span>{" "}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id={field.name}
                    name={field.name}
                    value={form.state.values.departmentDescription}
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
          {/* End of Form Group */}

          {/* Form Group */}
          <form.Field
            name="departmentHead"/* 
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: dropDownFormat,
            }} */
            children={(field) => (
              <div>
                <label htmlFor="" className="block text-sm mb-2">
                  {" "}
                  Department Head{" "}
                </label>
                <div className="relative">
                  <select
                    id={field.name}
                    name={field.name}
                    value={form.state.values.departmentHead}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                    onBlur={field.handleBlur}
                    required
                  >
                    <option value="">Select an option</option>
                    {employeeData.map((option) => (
                      <option key={option.value} value={option.value}>
                        {" "}
                        {option.label}{" "}
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
          {/* End Form Group */}

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
  )
}

export default DepartmentSubForm
