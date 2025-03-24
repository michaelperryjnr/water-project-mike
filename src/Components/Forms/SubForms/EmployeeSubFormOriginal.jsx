import { useState, useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import axios from "axios";
import ErrorMessage from "../../Alerts/floatui/ErrorMessage";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-form-adapter";
import Swal from "sweetalert2";
import AdvancedDropzoneDemo from "../../AdvancedDropzoneDemo";
import { Dropzone, FileMosaic, FullScreen, ImagePreview } from "@files-ui/react";
import { BsUpload } from "react-icons/bs";

function EmployeeSubFormOriginal() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const endPointUrl = `${apiUrl}/employees`;

  const [departmentData, setDepartmentData] = useState([]);
  const [positionData, setPositionData] = useState([]);
  const [nationalityData, setNationalityData] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [contractTypeData, setContractTypeData] = useState([]);
  const [nextOfKinData, setNextOfKinData] = useState([]);
  const [extFiles, setExtFiles] = useState([]); // Move file state here
  const [imageSrc, setImageSrc] = useState(undefined);

  // Valid options for dropdown fields
  const validTitles = [
    { value: "mr.", label: "Mr." },
    { value: "mrs.", label: "Mrs." },
    { value: "ms.", label: "Ms." },
    { value: "dr.", label: "Dr." },
    { value: "prof.", label: "Prof." },
  ];

  const validMaritalStatus = [
    { value: "single", label: "Single" },
    { value: "married", label: "Married" },
    { value: "divorced", label: "Divorced" },
    { value: "widowed", label: "Widowed" },
  ];

  const validGenders = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ];

  const validBloodGroups = [
    { value: "a+", label: "A+" },
    { value: "a-", label: "A-" },
    { value: "b+", label: "B+" },
    { value: "b-", label: "B-" },
    { value: "ab+", label: "AB+" },
    { value: "ab-", label: "AB-" },
    { value: "o+", label: "O+" },
    { value: "o-", label: "O-" },
  ];

  const validYesNo = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  const validProbationUnits = [
    { value: "days", label: "Days" },
    { value: "weeks", label: "Weeks" },
    { value: "months", label: "Months" },
  ];

  const validCurrencies = [
    { value: "GHS", label: "Ghanaian Cedi (GHS)" },
    { value: "USD", label: "United States Dollar (USD)" },
    { value: "EUR", label: "Euro (EUR)" },
    { value: "GBP", label: "British Pound (GBP)" },
    { value: "NGN", label: "Nigerian Naira (NGN)" },
  ];

  // Fetch data for dropdown fields
  useEffect(() => {
    // Fetch departments
    axios
      .get(`${apiUrl}/departments`)
      .then((response) => {
        const formattedData = response.data.map((dept) => ({
          value: dept._id,
          label: dept.departmentName,
        }));
        setDepartmentData(formattedData);
      })
      .catch((error) => {
        console.error("Error fetching department data: ", error);
      });

    // Fetch positions
    axios
      .get(`${apiUrl}/positions`)
      .then((response) => {
        const formattedData = response.data.map((pos) => ({
          value: pos._id,
          label: pos.positionTitle,
        }));
        setPositionData(formattedData);
      })
      .catch((error) => {
        console.error("Error fetching position data: ", error);
      });

    // Fetch nationalities
    axios
      .get(`${apiUrl}/nationalities`)
      .then((response) => {
        const formattedData = response.data.map((nat) => ({
          value: nat._id,
          label: nat.nationalityName,
        }));
        setNationalityData(formattedData);
      })
      .catch((error) => {
        console.error("Error fetching nationality data: ", error);
      });

    // Fetch countries
    axios
      .get(`${apiUrl}/countries`)
      .then((response) => {
        const formattedData = response.data.map((country) => ({
          value: country._id,
          label: country.name,
        }));
        setCountryData(formattedData);
      })
      .catch((error) => {
        console.error("Error fetching country data: ", error);
      });

    // Fetch contract types
    axios
      .get(`${apiUrl}/contracttypes`)
      .then((response) => {
        const formattedData = response.data.map((contract) => ({
          value: contract._id,
          label: contract.contractTypeName,
        }));
        setContractTypeData(formattedData);
      })
      .catch((error) => {
        console.error("Error fetching contract type data: ", error);
      });

    // Fetch next of kin
    axios
      .get(`${apiUrl}/nextofkin`)
      .then((response) => {
        const formattedData = response.data.map((kin) => ({
          value: kin._id,
          label: `${kin.firstName} ${kin.middleName} ${kin.lastName}`,
        }));
        setNextOfKinData(formattedData);
      })
      .catch((error) => {
        console.error("Error fetching next of kin data: ", error);
      });
  }, [apiUrl]);

  // Validation schemas
  const nameFormat = z
    .string()
    .min(3, "This field must be at least 3 characters long.");

  const dropDownFormat = z
    .string()
    .refine((value) => value !== "", "Please select an option");

  const emailFormat = z
    .string()
    .email("Invalid email format. Please enter a valid email address.");

  const phoneNumberFormat = z
    .string()
    .refine(
      (value) => /^(\+)?\([0-9]{1,3}\)-\d{2}-\d{3}-\d{4}$/.test(value),
      "Invalid phone number format. Please use the format +(xxx)-50-404-4044"
    );

  const numberFormat = z
    .string()
    .refine(
      (value) => !isNaN(parseFloat(value)) && isFinite(value),
      "Please enter a valid number"
    );

  const dateFormat = z
    .string()
    .refine((value) => !isNaN(Date.parse(value)), "Please enter a valid date");

  const alertNotification = Swal.mixin({
    showConfirmButton: false,
    showCancelButton: false,
  });

  const form = useForm({
    defaultValues: {
      title: "",
      firstName: "",
      middleName: "",
      lastName: "",
      DOB: "",
      nextOfKin: "",
      mobilePhone: "",
      homePhone: "",
      workPhone: "",
      email: "",
      position: "",
      department: "",
      nationalID: "",
      maritalStatus: "",
      nationality: "",
      country: "",
      bloodGroup: "",
      usesTobacco: "",
      physicalAddress: "",
      digitalAddress: "",
      picture: "",
      salary: "",
      gender: "",
      isFullTime: true,
      dateEmployed: new Date().toISOString().split("T")[0],
      contractType: "",
      confirmed: false,
      confirmationDate: "",
      workAtHome: "",
      overTimeEligible: "",
      probationStarted: false,
      probationStart: "",
      probationEnd: "",
      probationPeriod: "",
      probationUnit: "",
      comments: "",
      baseCurrency: "",
      terminated: false,
      terminationDate: "",
    },
    validators: {
      onSubmit: ({ value }) => {
        if (
          !value.firstName ||
          !value.lastName ||
          !value.title ||
          !value.email ||
          !value.mobilePhone ||
          !value.nationalID ||
          !value.maritalStatus ||
          !value.nationality ||
          !value.country ||
          !value.salary ||
          !value.gender ||
          !value.contractType ||
          !value.baseCurrency
        ) {
          return "Please fill in all required fields";
        }
      },
    },
    onSubmit: async ({ value }) => {
      const formData = new FormData(); // Use FormData for file upload

      // Convert and append form fields
      const convertedData = {
        ...value,
        isFullTime: value.isFullTime === true || value.isFullTime === "true",
        confirmed: value.confirmed === true || value.confirmed === "true",
        probationStarted:
          value.probationStarted === true || value.probationStarted === "true",
        terminated: value.terminated === true || value.terminated === "true",
        salary: parseFloat(value.salary),
        probationPeriod: value.probationPeriod
          ? parseInt(value.probationPeriod)
          : undefined,
      };

      //Omit staffNumber to let the pre-save hook generate it
      const { staffNumber, ...dataWithoutStaffNumber } = convertedData;

      for (const key in dataWithoutStaffNumber) {
        if (dataWithoutStaffNumber[key] !== undefined && dataWithoutStaffNumber[key] !== "") {
          formData.append(key, dataWithoutStaffNumber[key]);
        }
      }

      for (const key in convertedData) {
        if (convertedData[key] !== undefined && convertedData[key] !== "") {
          formData.append(key, convertedData[key]);
        }
      }

      // Append the file if it exists
      if (extFiles.length > 0) {
        formData.append("picture", extFiles[0].file); // Use the file object from files-ui
      }

      try {
        const response = await axios.post(endPointUrl, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 201) {
          console.log("Submitted:", response.data);
          alertNotification
            .fire({
              icon: "success",
              title: "Employee added successfully",
              timer: 3000,
              text: "You have successfully added a new employee",
            })
            .then(() => {
              window.location.reload();
            });
        } else if (response.status === 400) {
          alertNotification.fire({
            icon: "error",
            title: "Error adding employee",
            timer: 3000,
            text: "There was an error adding the employee, the request was invalid",
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
          timer: 10000,
          text:
            error.response?.data?.message ||
            "There was an error submitting the form, please try again.",
        });
      }
    },
  });

  const updateFiles = (incomingFiles) => {
    setExtFiles(incomingFiles.slice(0, 1)); // Limit to one file
  };

  const onDelete = (id) => {
    setExtFiles(extFiles.filter((x) => x.id !== id));
  };

  const handleSee = (imageSource) => {
    setImageSrc(imageSource);
  };

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
          {/* Basic Information */}
          <div className="mb-4">
            <h3 className="font-medium text-gray-900">Basic Information</h3>
          </div>

          {/* Title */}
          <form.Field
            name="title"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: dropDownFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor="" className="block text-sm mb-2">
                  Title <span className="text-RhemaRed">*</span>
                </label>
                <div className="relative">
                  <select
                    id={field.name}
                    name={field.name}
                    value={form.state.values.title}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                    onBlur={field.handleBlur}
                    required
                  >
                    <option value="">Select an option</option>
                    {validTitles.map((option) => (
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
                    value={form.state.values.firstName}
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
                  Middle Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id={field.name}
                    name={field.name}
                    value={form.state.values.middleName}
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
                    value={form.state.values.lastName}
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

          {/* DOB */}
          <form.Field
            name="DOB"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: dateFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Date of Birth <span className="text-RhemaRed">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id={field.name}
                    name={field.name}
                    value={form.state.values.DOB}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
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
                    value={form.state.values.gender}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                    onBlur={field.handleBlur}
                    required
                  >
                    <option value="">Select an option</option>
                    {validGenders.map((option) => (
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

          {/* Marital Status */}
          <form.Field
            name="maritalStatus"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: dropDownFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Marital Status <span className="text-RhemaRed">*</span>
                </label>
                <div className="relative">
                  <select
                    id={field.name}
                    name={field.name}
                    value={form.state.values.maritalStatus}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                    onBlur={field.handleBlur}
                    required
                  >
                    <option value="">Select an option</option>
                    {validMaritalStatus.map((option) => (
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

          {/* Nationality */}
          <form.Field
            name="nationality"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: dropDownFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Nationality <span className="text-RhemaRed">*</span>
                </label>
                <div className="relative">
                  <select
                    id={field.name}
                    name={field.name}
                    value={form.state.values.nationality}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                    onBlur={field.handleBlur}
                    required
                  >
                    <option value="">Select an option</option>
                    {nationalityData.map((option) => (
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

          {/* Country */}
          <form.Field
            name="country"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: dropDownFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Country <span className="text-RhemaRed">*</span>
                </label>
                <div className="relative">
                  <select
                    id={field.name}
                    name={field.name}
                    value={form.state.values.country}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                    onBlur={field.handleBlur}
                    required
                  >
                    <option value="">Select an option</option>
                    {countryData.map((option) => (
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

          {/* Contact Information */}
          <div className="mb-4 mt-6">
            <h3 className="font-medium text-gray-900">Contact Information</h3>
          </div>

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
                    type="email"
                    id={field.name}
                    name={field.name}
                    value={form.state.values.email}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                    placeholder="john.doe@example.com"
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

          {/* Mobile Phone */}
          <form.Field
            name="mobilePhone"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: phoneNumberFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Mobile Phone <span className="text-RhemaRed">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    id={field.name}
                    name={field.name}
                    value={form.state.values.mobilePhone}
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

          {/* Home Phone */}
          <form.Field
            name="homePhone"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: phoneNumberFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Home Phone
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    id={field.name}
                    name={field.name}
                    value={form.state.values.homePhone}
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

          {/* Work Phone */}
          <form.Field
            name="workPhone"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: phoneNumberFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Work Phone
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    id={field.name}
                    name={field.name}
                    value={form.state.values.workPhone}
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
                  Physical Address
                </label>
                <div className="relative">
                  <textarea
                    id={field.name}
                    name={field.name}
                    value={form.state.values.physicalAddress}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                    placeholder="123 Main St, City"
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
                  Digital Address
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id={field.name}
                    name={field.name}
                    value={form.state.values.digitalAddress}
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

          {/* Employment Details */}
          <div className="mb-4 mt-6">
            <h3 className="font-medium text-gray-900">Employment Details</h3>
          </div>

          {/* Position */}
          <form.Field
            name="position"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: dropDownFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Position
                </label>
                <div className="relative">
                  <select
                    id={field.name}
                    name={field.name}
                    value={form.state.values.position}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                    onBlur={field.handleBlur}
                  >
                    <option value="">Select an option</option>
                    {positionData.map((option) => (
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

          {/* Department */}
          <form.Field
            name="department"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: dropDownFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Department
                </label>
                <div className="relative">
                  <select
                    id={field.name}
                    name={field.name}
                    value={form.state.values.department}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                    onBlur={field.handleBlur}
                  >
                    <option value="">Select an option</option>
                    {departmentData.map((option) => (
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

          {/* Contract Type */}
          <form.Field
            name="contractType"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: dropDownFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Contract Type <span className="text-RhemaRed">*</span>
                </label>
                <div className="relative">
                  <select
                    id={field.name}
                    name={field.name}
                    value={form.state.values.contractType}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                    onBlur={field.handleBlur}
                    required
                  >
                    <option value="">Select an option</option>
                    {contractTypeData.map((option) => (
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

          {/* Salary */}
          <form.Field
            name="salary"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: numberFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Salary <span className="text-RhemaRed">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id={field.name}
                    name={field.name}
                    value={form.state.values.salary}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                    placeholder="5000"
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

          {/* Base Currency */}
          <form.Field
            name="baseCurrency"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: dropDownFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Base Currency <span className="text-RhemaRed">*</span>
                </label>
                <div className="relative">
                  <select
                    id={field.name}
                    name={field.name}
                    value={form.state.values.baseCurrency}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                    onBlur={field.handleBlur}
                    required
                  >
                    <option value="">Select an option</option>
                    {validCurrencies.map((option) => (
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

          {/* Date Employed */}
          {/* <form.Field
            name="dateEmployed"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: dateFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Date Employed
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id={field.name}
                    name={field.name}
                    value={form.state.values.dateEmployed}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
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
          /> */}

          {/* Is Full Time */}
          <form.Field
            name="isFullTime"
            children={(field) => (
              <div>
                <label className="block text-sm mb-2">
                  Full-Time <span className="text-RhemaRed">*</span>
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={field.name}
                    name={field.name}
                    checked={form.state.values.isFullTime}
                    onChange={(e) => field.handleChange(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor={field.name}>Yes</label>
                </div>
              </div>
            )}
          />

          {/* Work At Home */}
          <form.Field
            name="workAtHome"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: dropDownFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Work At Home
                </label>
                <div className="relative">
                  <select
                    id={field.name}
                    name={field.name}
                    value={form.state.values.workAtHome}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                    onBlur={field.handleBlur}
                  >
                    <option value="">Select an option</option>
                    {validYesNo.map((option) => (
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

          {/* Overtime Eligible */}
          <form.Field
            name="overTimeEligible"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: dropDownFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Overtime Eligible
                </label>
                <div className="relative">
                  <select
                    id={field.name}
                    name={field.name}
                    value={form.state.values.overTimeEligible}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                    onBlur={field.handleBlur}
                  >
                    <option value="">Select an option</option>
                    {validYesNo.map((option) => (
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

          {/* Additional Information */}
          <div className="mb-4 mt-6">
            <h3 className="font-medium text-gray-900">
              Additional Information
            </h3>
          </div>

          {/* National ID */}
          <form.Field
            name="nationalID"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: nameFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  National ID <span className="text-RhemaRed">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id={field.name}
                    name={field.name}
                    value={form.state.values.nationalID}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                    placeholder="GH-123-456-789"
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

          {/* Next of Kin */}
          <form.Field
            name="nextOfKin"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: dropDownFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Next of Kin
                </label>
                <div className="relative">
                  <select
                    id={field.name}
                    name={field.name}
                    value={form.state.values.nextOfKin}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                    onBlur={field.handleBlur}
                  >
                    <option value="">Select an option</option>
                    {nextOfKinData.map((option) => (
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

          {/* Blood Group */}
          <form.Field
            name="bloodGroup"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: dropDownFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Blood Group
                </label>
                <div className="relative">
                  <select
                    id={field.name}
                    name={field.name}
                    value={form.state.values.bloodGroup}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                    onBlur={field.handleBlur}
                  >
                    <option value="">Select an option</option>
                    {validBloodGroups.map((option) => (
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

          {/* Uses Tobacco */}
          <form.Field
            name="usesTobacco"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: dropDownFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Uses Tobacco
                </label>
                <div className="relative">
                  <select
                    id={field.name}
                    name={field.name}
                    value={form.state.values.usesTobacco}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                    onBlur={field.handleBlur}
                  >
                    <option value="">Select an option</option>
                    {validYesNo.map((option) => (
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

          {/* Picture */}
{/*           <form.Field
            name="picture"
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Picture
                </label>
                <div className="relative">
                  <input
                    type="file"
                    id={field.name}
                    name={field.name}
                    onChange={(e) =>
                      field.handleChange(
                        e.target.files[0] ? e.target.files[0].name : ""
                      )
                    }
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                  />
                </div>
              </div>
            )}
          /> */}
          {/* <AdvancedDropzoneDemo /> */}

          {/* Picture with CustomDropzone */}
          <form.Field
            name="picture"
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Picture
                </label>
                <Dropzone
                  onChange={updateFiles}
                  value={extFiles}
                  accept=".png, .jpg, .jpeg"
                  maxFiles={1}
                  maxFileSize={15 * 1024 * 1024}
                  minHeight="200px"
                  label={
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <BsUpload size={20} style={{ color: "#588abd" }} />
                      <span>Drag & drop a PNG or JPG image or click to browse</span>
                    </div>
                  }
                  style={{
                    backgroundColor: "#ffffff",
                    border: "2px dashed #fb8602",
                    borderRadius: "10px",
                    color: "#333",
                  }}
                  footerConfig={{
                    style: {
                      backgroundColor: "#588abd",
                      color: "#ffffff",
                      padding: "10px",
                      fontWeight: "bold",
                      textAlign: "center",
                    },
                  }}
                  actionButtons={false}
                >
                  {extFiles.map((file) => (
                    <FileMosaic
                      {...file}
                      key={file.id}
                      onDelete={onDelete}
                      onSee={handleSee}
                      preview
                      info
                      style={{
                        backgroundColor: "#fff",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        padding: "10px",
                      }}
                    />
                  ))}
                </Dropzone>
                <FullScreen open={imageSrc !== undefined} onClose={() => setImageSrc(undefined)}>
                  <ImagePreview src={imageSrc} />
                </FullScreen>
              </div>
            )}
          />

          {/* Probation Details */}
          {/* <div className="mb-4 mt-6">
            <h3 className="font-medium text-gray-900">Probation Details</h3>
          </div> */}

          {/* Probation Started */}
          {/* <form.Field
            name="probationStarted"
            children={(field) => (
              <div>
                <label className="block text-sm mb-2">Probation Started</label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={field.name}
                    name={field.name}
                    checked={form.state.values.probationStarted}
                    onChange={(e) => field.handleChange(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor={field.name}>Yes</label>
                </div>
              </div>
            )}
          /> */}

          {/* Probation Start */}
          {/* <form.Field
            name="probationStart"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: dateFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Probation Start Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id={field.name}
                    name={field.name}
                    value={form.state.values.probationStart}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
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
          /> */}

          {/* Probation End */}
          {/* <form.Field
            name="probationEnd"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: dateFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Probation End Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id={field.name}
                    name={field.name}
                    value={form.state.values.probationEnd}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
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
          /> */}

          {/* Probation Period */}
          {/* <form.Field
            name="probationPeriod"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: numberFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Probation Period
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id={field.name}
                    name={field.name}
                    value={form.state.values.probationPeriod}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                    placeholder="30"
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
          /> */}

          {/* Probation Unit */}
          {/* <form.Field
            name="probationUnit"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: dropDownFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Probation Unit
                </label>
                <div className="relative">
                  <select
                    id={field.name}
                    name={field.name}
                    value={form.state.values.probationUnit}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                    onBlur={field.handleBlur}
                  >
                    <option value="">Select an option</option>
                    {validProbationUnits.map((option) => (
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
          /> */}

          {/* Confirmation and Termination */}
          {/* <div className="mb-4 mt-6">
            <h3 className="font-medium text-gray-900">
              Confirmation and Termination
            </h3>
          </div> */}

          {/* Confirmed */}
          {/* <form.Field
            name="confirmed"
            children={(field) => (
              <div>
                <label className="block text-sm mb-2">Confirmed</label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={field.name}
                    name={field.name}
                    checked={form.state.values.confirmed}
                    onChange={(e) => field.handleChange(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor={field.name}>Yes</label>
                </div>
              </div>
            )}
          /> */}

          {/* Confirmation Date */}
          {/* <form.Field
            name="confirmationDate"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: dateFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Confirmation Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id={field.name}
                    name={field.name}
                    value={form.state.values.confirmationDate}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
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
          /> */}

          {/* Terminated */}
          {/* <form.Field
            name="terminated"
            children={(field) => (
              <div>
                <label className="block text-sm mb-2">Terminated</label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={field.name}
                    name={field.name}
                    checked={form.state.values.terminated}
                    onChange={(e) => field.handleChange(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor={field.name}>Yes</label>
                </div>
              </div>
            )}
          /> */}

          {/* Termination Date */}
          {/* <form.Field
            name="terminationDate"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: dateFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Termination Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id={field.name}
                    name={field.name}
                    value={form.state.values.terminationDate}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
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
          /> */}

          {/* Comments */}
          <div className="mb-4 mt-6">
            <h3 className="font-medium text-gray-900">Additional Notes</h3>
          </div>

          <form.Field
            name="comments"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: nameFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Comments
                </label>
                <div className="relative">
                  <textarea
                    id={field.name}
                    name={field.name}
                    value={form.state.values.comments}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                    placeholder="Additional notes..."
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

export default EmployeeSubFormOriginal;
