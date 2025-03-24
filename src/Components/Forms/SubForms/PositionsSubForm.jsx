import { useForm } from "@tanstack/react-form";
import axios from "axios";
import ErrorMessage from "../../Alerts/floatui/ErrorMessage";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-form-adapter";
import Swal from "sweetalert2";
import { BsX } from "react-icons/bs";


function PositionsSubForm() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const endPointUrl = `${apiUrl}/positions`;
  
    const validIsActive = [
      { value: "true", label: "True" },
      { value: "false", label: "False" },
    ];

    const nameFormat = z
      .string()
      .min(3, "This field must be at least 3 characters long.");
  
    const dropDownFormat = z
      .string()
      .refine((value) => value === "true" || value === "false", 'Please select an option');

  
    const alertNotification = Swal.mixin({
      showConfirmButton: false,
      showCancelButton: false,
    });
  
    const form = useForm({
      defaultValues: {
        positionTitle: "",
        positionDescription: "",
        positionBaseSalary: "",
        positionResponsibilities: [""],
        qualifications: [""],
        isActive: "",
      },
      validators: {
        onSubmit: ({ value }) => {
          if (!value.positionTitle || !value.positionDescription) {
            return "Please fill in all fields ";
          }
        },
      },
      onSubmit: async ({ value }) => {
        try {
          const response = await axios.post(endPointUrl, value);
  
          if (response.status === 201) {
            console.log("Submitted:", response.data);
  
            alertNotification
              .fire({
                icon: "success",
                title: "Position added successfully",
                timer: 3000,
                text: "You have successfully added a new position",
              })
              .then(() => {
                // Reload the page after the notification is closed
                window.location.reload();
              });
          } else if (response.status === 400) {
            alertNotification.fire({
              icon: "error",
              title: "Error adding position",
              timer: 3000,
              text: "There was an error adding a position, the request was invalid",
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
            name="positionTitle"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: nameFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  {" "}
                  Position Title <span className="text-RhemaRed">*</span>{" "}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id={field.name}
                    name={field.name}
                    value={form.state.values.positionTitle}
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
          {/* End of Form Group */}

          {/* Form Group */}
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
                  {" "}
                  Position Description <span className="text-RhemaRed">*</span>{" "}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id={field.name}
                    name={field.name}
                    value={form.state.values.positionDescription}
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
          {/* End of Form Group */}

          {/* Form Group */}
          <form.Field
            name="positionBaseSalary"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: nameFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  {" "}
                  Base Salary (Monthly Take Home) <span className="text-RhemaRed">*</span>{" "}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id={field.name}
                    name={field.name}
                    value={form.state.values.positionBaseSalary}
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
          {/* End of Form Group */}

          {/* Form Group */}
          <form.Field
            name="positionResponsibilities"
            mode="array"
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  {" "}
                  Key Responsibilities <span className="text-RhemaRed">*</span>{" "}
                </label>
                {field.state.value.map((_, index) => (
                    <div key={index} className="my-2 py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none">
                        <form.Field
                        name={`positionResponsibilities[${index}]`}
                        key={index}
                        children={(subField) => (
                            <input
                            type = "text"
                            placeholder="Write unit tests"
                            /* autoFocus */
                            className="mb-2 py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 "
                            value ={subField.state.value}
                            onChange ={(e) => subField.handleChange(e.target.value)}
                             />
                        )} 
                        />
                        <button type="button" className="bg-RhemaRed px-2 py-2 rounded-md" onClick={() => field.removeValue(index)}>
                            <BsX className="text-white" size={23} />
                        </button>
                    </div>
                ))}
                <button
                type="button" 
                className="text-center py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-taureanOrange text-white hover:bg-taureanLightBlue disabled:opacity-50 disabled:pointer-events-none" 
                onClick={() => field.pushValue("")}>
                    Add
                </button>
              </div>
            )}
          />
          {/* End of Form Group */}

          {/* Form Group */}
          <form.Field
            name="qualifications"
            mode="array"
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  {" "}
                  Required Qualifications <span className="text-RhemaRed">*</span>{" "}
                </label>
                {field.state.value.map((_, index) => (
                    <div key={index} className="my-2 py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none">
                        <form.Field
                        name={`qualifications[${index}]`}
                        key={index}
                        children={(subField) => (
                            <input
                            type = "text"
                            placeholder="BSc in Computer Science or related field"
                            /* autoFocus */
                            className="mb-2 py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 "
                            value ={subField.state.value}
                            onChange ={(e) => subField.handleChange(e.target.value)}
                             />
                        )} 
                        />
                        <button type="button" className="bg-RhemaRed px-2 py-2 rounded-md" onClick={() => field.removeValue(index)}>
                            <BsX className="text-white" size={23} />
                        </button>
                    </div>
                ))}
                <button type="button" 
                className="text-center py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-taureanOrange text-white hover:bg-taureanLightBlue disabled:opacity-50 disabled:pointer-events-none" 
                onClick={() => field.pushValue("")}>
                    Add
                </button>
              </div>
            )}
          />
          {/* End of Form Group */}

          {/* Form Group */}
          <form.Field
            name="isActive"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: dropDownFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor="" className="block text-sm mb-2">
                  {" "}
                  Is Position Active{" "}
                </label>
                <div className="relative">
                  <select
                    id={field.name}
                    name={field.name}
                    value={form.state.values.isActive}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                    onBlur={field.handleBlur}
                    required
                  >
                    <option value="">Select an option</option>
                    {validIsActive.map((option) => (
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

export default PositionsSubForm
