import * as Dialog from "@radix-ui/react-dialog";
import { useState, useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import axios from "axios";
import { BsX } from "react-icons/bs";
import ErrorMessage from "../../Alerts/floatui/ErrorMessage";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-form-adapter";
import Swal from "sweetalert2";
import {
  Dropzone,
  FileMosaic,
  FullScreen,
  ImagePreview,
} from "@files-ui/react";
import { BsUpload } from "react-icons/bs";

function UpdateEmployeesForm({ data, onClose }) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const endPointUrl = `${apiUrl}/employees/${data._id}`; // Assuming the employee record has an `_id` field

  const [departmentData, setDepartmentData] = useState([]);
  const [positionData, setPositionData] = useState([]);
  const [nationalityData, setNationalityData] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [contractTypeData, setContractTypeData] = useState([]);
  const [nextOfKinData, setNextOfKinData] = useState([]);
  const [extFiles, setExtFiles] = useState([]);
  const [imageSrc, setImageSrc] = useState(undefined);
  const [isLoadingDropdowns, setIsLoadingDropdowns] = useState(true);

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

  const validCurrencies = [
    { value: "GHS", label: "Ghanaian Cedi (GHS)" },
    { value: "USD", label: "United States Dollar (USD)" },
    { value: "EUR", label: "Euro (EUR)" },
    { value: "GBP", label: "British Pound (GBP)" },
    { value: "NGN", label: "Nigerian Naira (NGN)" },
  ];

  // Fetch data for dropdown fields
  useEffect(() => {
    Promise.all([
      axios.get(`${apiUrl}/departments`),
      axios.get(`${apiUrl}/positions`),
      axios.get(`${apiUrl}/nationalities`),
      axios.get(`${apiUrl}/countries`),
      axios.get(`${apiUrl}/contracttypes`),
      axios.get(`${apiUrl}/nextofkin`),
    ])
      .then(
        ([
          deptResponse,
          posResponse,
          natResponse,
          countryResponse,
          contractResponse,
          kinResponse,
        ]) => {
          setDepartmentData(
            deptResponse.data.map((dept) => ({
              value: dept._id,
              label: dept.departmentName,
            }))
          );
          setPositionData(
            posResponse.data.map((pos) => ({
              value: pos._id,
              label: pos.positionTitle,
            }))
          );
          setNationalityData(
            natResponse.data.map((nat) => ({
              value: nat._id,
              label: nat.nationalityName,
            }))
          );
          setCountryData(
            countryResponse.data.map((country) => ({
              value: country._id,
              label: country.name,
            }))
          );
          setContractTypeData(
            contractResponse.data.map((contract) => ({
              value: contract._id,
              label: contract.contractTypeName,
            }))
          );
          setNextOfKinData(
            kinResponse.data.map((kin) => ({
              value: kin._id,
              label: `${kin.firstName} ${kin.middleName} ${kin.lastName}`,
            }))
          );
          setIsLoadingDropdowns(false);
        }
      )
      .catch((error) => {
        console.error("Error fetching dropdown data:", error);
        setIsLoadingDropdowns(false);
      });
  }, [apiUrl]);

  // Debug the data prop and dropdown data
  useEffect(() => {
    console.log("Data prop:", data);
    console.log("Nationality data:", nationalityData);
    console.log("Country data:", countryData);
    console.log("Position data:", positionData);
    console.log("Department data:", departmentData);
    console.log("Contract type data:", contractTypeData);
  }, [data, nationalityData, countryData, positionData, departmentData, contractTypeData]);

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

  // Initialize the form with TanStack Form
  const form = useForm({
    defaultValues: {
      title: data.title || "",
      firstName: data.firstName || "",
      middleName: data.middleName || "",
      lastName: data.lastName || "",
      DOB: data.DOB ? new Date(data.DOB).toISOString().split("T")[0] : "",
      nextOfKin: data.nextOfKin?._id || data.nextOfKin || "",
      mobilePhone: data.mobilePhone || "",
      homePhone: data.homePhone || "",
      workPhone: data.workPhone || "",
      email: data.email || "",
      position: data.position?._id || data.position || "",
      department: data.department?._id || data.department || "",
      nationalID: data.nationalID || "",
      maritalStatus: data.maritalStatus || "",
      nationality: data.nationality?._id || data.nationality || "",
      country: data.country?._id || data.country || "",
      bloodGroup: data.bloodGroup || "",
      usesTobacco: data.usesTobacco || "",
      physicalAddress: data.physicalAddress || "",
      digitalAddress: data.digitalAddress || "",
      picture: data.picture || "",
      salary: data.salary?.toString() || "",
      gender: data.gender || "",
      isFullTime: data.isFullTime || false,
      dateEmployed: data.dateEmployed
        ? new Date(data.dateEmployed).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      contractType: data.contractType?._id || data.contractType || "",
      confirmed: data.confirmed || false,
      confirmationDate: data.confirmationDate
        ? new Date(data.confirmationDate).toISOString().split("T")[0]
        : "",
      workAtHome: data.workAtHome || "",
      overTimeEligible: data.overTimeEligible || "",
      probationStarted: data.probationStarted || false,
      probationStart: data.probationStart
        ? new Date(data.probationStart).toISOString().split("T")[0]
        : "",
      probationEnd: data.probationEnd
        ? new Date(data.probationEnd).toISOString().split("T")[0]
        : "",
      probationPeriod: data.probationPeriod?.toString() || "",
      probationUnit: data.probationUnit || "",
      comments: data.comments || "",
      baseCurrency: data.baseCurrency || "",
      terminated: data.terminated || false,
      terminationDate: data.terminationDate
        ? new Date(data.terminationDate).toISOString().split("T")[0]
        : "",
    },
    validatorAdapter: zodValidator(),
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
      try {
        alertNotification.fire({
          title: "Updating...",
          text: "Please wait while we update the employee",
          icon: "info",
          showConfirmButton: false,
          allowOutsideClick: false,
        });

        const formData = new FormData();
        const updatedData = {
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

        for (const [key, val] of Object.entries(updatedData)) {
          if (val !== undefined && val !== "") {
            formData.append(key, val);
          }
        }

        if (extFiles.length > 0) {
          formData.append("picture", extFiles[0].file);
        }

        const response = await axios.put(endPointUrl, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 200) {
          console.log("Updated:", response.data);
          alertNotification
            .fire({
              icon: "success",
              title: "Employee updated successfully",
              timer: 3000,
              text: "The employee has been updated successfully.",
            })
            .then(() => {
              window.location.reload();
            });
        } else {
          alertNotification.fire({
            icon: "error",
            title: "Error updating employee",
            timer: 3000,
            text: "There was an error updating the employee.",
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
            "There was an error updating the employee, please try again.",
        });
      }
    },
  });

  useEffect(() => {
    console.log("Form state:", form.state);
  }, [form.state]);

  const updateFiles = (incomingFiles) => {
    console.log("Updated files:", incomingFiles);
    setExtFiles(incomingFiles.slice(0, 1));
  };

  const onDelete = (id) => {
    setExtFiles(extFiles.filter((x) => x.id !== id));
  };

  const handleSee = (imageSource) => {
    setImageSrc(imageSource);
  };

  if (isLoadingDropdowns) {
    return <div>Loading...</div>;
  }

  return (
    <Dialog.Root open={true} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal container={document.body}>
        <Dialog.Overlay
          onClick={() => console.log("Dialog.Overlay rendered")}
          className="fixed inset-0 bg-gray-500 bg-opacity-75 z-[100] !w-full !h-full"
        />

        <Dialog.Content
          onOpenAutoFocus={() => console.log("Dialog.Content opened")}
          className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-2xl mx-auto px-4 z-[101] data-[state=open]:animate-[modal-animation-show_600ms] data-[state=closed]:animate-[modal-animation-hide_300ms]"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <div className="relative flex flex-col bg-white border shadow-sm rounded-xl overflow-hidden">
            <div className="absolute top-2 end-2">
              <Dialog.Close className="flex justify-center items-center size-7 text-sm font-semibold rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none">
                <BsX className="flex-shrink-0 size-8" />
              </Dialog.Close>
            </div>

            <div className="p-4 sm:p-10 overflow-y-auto" style={{ maxHeight: "600px" }}>
              <div className="text-center">
                <span className="mb-4 inline-flex justify-center items-center rounded-full">
                  <img src="/Media/Taurean IT Logo3-2_vectorized.png" alt="Logo" className="h-20" />
                </span>
              </div>
              <hr className="border border-taureanOrange" />

              <Dialog.Title className="mt-1 mb-5 text-2xl text-center font-bold text-gray-800">
                Update Employee
              </Dialog.Title>

              <Dialog.Description className="hidden">
                Update employee modal dialog
              </Dialog.Description>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
              >
                <div className="grid gap-y-4">
                  {/* Basic Information */}
                  <div className="mb-4">
                    <h3 className="font-medium text-gray-900">Basic Information</h3>
                  </div>

                  <form.Field
                    name="title"
                    validatorAdapter={zodValidator()}
                    validators={{
                      onChangeAsyncDebounceMs: 500,
                      onChangeAsync: dropDownFormat,
                    }}
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block text-sm mb-2">
                          Title <span className="text-RhemaRed">*</span>
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
                            value={field.state.value}
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
                            value={field.state.value}
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
                            value={field.state.value}
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
                            value={field.state.value}
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
                            value={field.state.value}
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
                            value={field.state.value}
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
                            value={field.state.value}
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
                            value={field.state.value}
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

                  <div className="mb-4 mt-6">
                    <h3 className="font-medium text-gray-900">Contact Information</h3>
                  </div>

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
                            value={field.state.value}
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
                            value={field.state.value}
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
                            value={field.state.value}
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
                            value={field.state.value}
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
                            value={field.state.value}
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
                            value={field.state.value}
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

                  <div className="mb-4 mt-6">
                    <h3 className="font-medium text-gray-900">Employment Details</h3>
                  </div>

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
                            value={field.state.value}
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
                            value={field.state.value}
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
                            value={field.state.value}
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
                            value={field.state.value}
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
                            value={field.state.value}
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
                            checked={field.state.value}
                            onChange={(e) => field.handleChange(e.target.checked)}
                            className="mr-2"
                          />
                          <label htmlFor={field.name}>Yes</label>
                        </div>
                      </div>
                    )}
                  />

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
                            value={field.state.value}
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
                            value={field.state.value}
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

                  <div className="mb-4 mt-6">
                    <h3 className="font-medium text-gray-900">Additional Information</h3>
                  </div>

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
                            value={field.state.value}
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
                            value={field.state.value}
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
                            value={field.state.value}
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
                            value={field.state.value}
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
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                              }}
                            >
                              <BsUpload size={20} style={{ color: "#588abd" }} />
                              <span>
                                Drag & drop a PNG or JPG image or click to browse
                              </span>
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
                        <FullScreen
                          open={imageSrc !== undefined}
                          onClose={() => setImageSrc(undefined)}
                        >
                          <ImagePreview src={imageSrc} />
                        </FullScreen>
                      </div>
                    )}
                  />

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
                            value={field.state.value}
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
                    errors.length > 0 && <ErrorMessage title={"Error"} message={errors} />
                  }
                />
              </form>
            </div>

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

export default UpdateEmployeesForm;