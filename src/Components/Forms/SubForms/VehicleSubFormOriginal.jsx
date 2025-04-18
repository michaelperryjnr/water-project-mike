import { useState, useEffect } from "react"; 
import { useForm } from "@tanstack/react-form";
import axios from "axios";
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

function VehicleSubForm() {
  const apiUrl = import.meta.env.VITE_API_URL; // Adjust based on your backend URL
  const endPointUrl = `${apiUrl}/vehicles`;

  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [isFetchingModels, setIsFetchingModels] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [insurances, setInsurances] = useState([]);
  const [roadWorths, setRoadWorths] = useState([]);
  const [extFiles, setExtFiles] = useState([]);
  const [imageSrc, setImageSrc] = useState(undefined);

  // Define enum values
  const VALID_VEHICLE_TYPES = ["sedan","suv","truck","van","pickup","minivan","bus","motorcycle","utility","coupe","saloon"];

  const VALID_FUEL_TYPES = ["diesel","petrol","electric","hybrid","compressed natural gas","biofuel","ethanol","hydrogen"];

  const VALID_TRANSMISSION_TYPES = [ "automatic","manual", "semi-automatic","cvt"];

  const VALID_WEIGHT_TYPES = ["kg","grams", "tons"];

  const VALID_STATUSES = ["available","in-use","maintenance","out-of-service","retired","reserved","auctioned","sold", "disposed off",];

  const VALID_OWNERSHIP_STATUSES = ["owned","leased","rented","financed","borrowed","shared"];

  const VALID_VEHICLE_CONDITIONS = ["new","used","damaged","salvage","repaired","refurbished"];

  const VALID_COMPLIANCE_STATUSES = ["valid","expired","revoked"];

  // Validation schemas
  const stringFormat = z
    .string()
    .min(3, "This field must be at least 3 characters long.");

  const dropDownFormat = z
    .string()
    .refine((value) => value !== "", "Please select an option");

  const numberFormat = z
    .string()
    .refine(
      (value) => !isNaN(parseFloat(value)) && isFinite(value),
      "Please enter a valid number"
    );

  const yearFormat = z
    .string()
    .refine(
      (value) => {
        const year = parseInt(value);
        const currentYear = new Date().getFullYear() + 1;
        return year >= 1900 && year <= currentYear;
      },
      `Year must be between 1900 and ${new Date().getFullYear() + 1}`
    );

  const dateFormat = z
    .string()
    .refine((value) => !isNaN(Date.parse(value)), "Please enter a valid date");

  const alertNotification = Swal.mixin({
    showConfirmButton: false,
    showCancelButton: false,
  });

  // Define form before useEffect hooks
  const form = useForm({
    defaultValues: {
      registrationNumber: "",
      vinNumber: "",
      vehicleType: "",
      brand: "",
      model: "",
      yearOfManufacturing: "",
      fuelType: "",
      transmissionType: "",
      sittingCapacity: "",
      weight: "",
      weightType: "",
      color: "",
      status: "",
      ownershipStatus: "",
      vehicleCondition: "",
      assignedDepartment: "",
      assignedDriver: "",
      isAvailableForPool: true,
      currentMileage: "",
      purchaseDate: "",
      costOfVehicle: "",
      vehicleDescription: "",
      engineDescription: "",
      pictures: [],
      insurance: "",
      insuranceStatus: "",
      insuranceStartDate: "",
      insuranceEndDate: "",
      roadWorth: "",
      roadWorthStatus: "",
      roadWorthStartDate: "",
      roadWorthEndDate: "",
    },
    validators: {
      onSubmit: ({ value }) => {
        if (
          !value.registrationNumber ||
          !value.vinNumber ||
          !value.vehicleType ||
          !value.brand ||
          !value.model ||
          !value.yearOfManufacturing ||
          !value.fuelType ||
          !value.transmissionType ||
          !value.sittingCapacity ||
          !value.weight ||
          !value.weightType ||
          !value.status ||
          !value.ownershipStatus ||
          !value.vehicleCondition ||
          !value.purchaseDate ||
          !value.costOfVehicle
        ) {
          return "Please fill in all required fields";
        }
      },
    },
    onSubmit: async ({ value }) => {
      const formData = new FormData();

      // Deduplicate the value object in case it contains arrays
      const deduplicatedValue = Object.fromEntries(
        Object.entries(value).map(([key, val]) => [
          key,
          Array.isArray(val) ? val[0] : val,
        ])
      );

      // Convert and clean the data
      const convertedData = {
        ...deduplicatedValue,
        isAvailableForPool: deduplicatedValue.isAvailableForPool === true || deduplicatedValue.isAvailableForPool === "true",
        sittingCapacity: parseInt(deduplicatedValue.sittingCapacity),
        weight: parseFloat(deduplicatedValue.weight),
        currentMileage: parseFloat(deduplicatedValue.currentMileage) || 0,
        costOfVehicle: parseFloat(deduplicatedValue.costOfVehicle),
        yearOfManufacturing: parseInt(deduplicatedValue.yearOfManufacturing),
      };

      // Append(cleaned data to FormData
      for (const [key, value] of Object.entries(convertedData)) {
        if (value !== undefined && value !== "" && key !== "pictures") {
          formData.append(key, value);
        }
      }

      // Append the files if they exist
      if (extFiles.length > 0) {
        extFiles.forEach((file) => {
          formData.append("pictures", file.file);
        });
      }

      try {
        const response = await axios.post(endPointUrl, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 201) {
          alertNotification
            .fire({
              icon: "success",
              title: "Vehicle added successfully",
              timer: 3000,
              text: "You have successfully added a new vehicle",
            })
            .then(() => {
              window.location.reload();
            });
        } else if (response.status === 400) {
          alertNotification.fire({
            icon: "error",
            title: "Error adding vehicle",
            timer: 3000,
            text: "There was an error adding the vehicle, the request was invalid",
          });
        } else if (response.status === 500) {
          alertNotification.fire({
            icon: "error",
            title: "Oops!",
            timer: 3000,
            text: "Looks like we have an internal server error, please try again later",
          });
        }
      } catch (error) {
        alertNotification.fire({
          icon: "error",
          title: "Submission Failed",
          timer: 10000,
          text: error.response?.data?.message || "There was an error submitting the form, please try again.",
        });
      }
    },
  });

  // Fetch data for dropdown fields
  useEffect(() => {
    // Fetch brands
    axios
      .get(`${apiUrl}/brands`)
      .then((response) => {
        setBrands(response.data.map((brand) => brand.name));
      })
      .catch((error) => {
        console.error("Error fetching brand data: ", error);
      });

    // Fetch departments
    axios
      .get(`${apiUrl}/departments`)
      .then((response) => {
        setDepartments(response.data.map((dept) => dept.departmentName));
      })
      .catch((error) => {
        console.error("Error fetching department data: ", error);
      });

    // Fetch drivers (employees)
    axios
      .get(`${apiUrl}/employees`)
      .then((response) => {
        setDrivers(response.data.map((driver) => `${driver.firstName} ${driver.lastName}`));
      })
      .catch((error) => {
        console.error("Error fetching driver data: ", error);
      });

    // Fetch insurances
    axios
      .get(`${apiUrl}/insurance`)
      .then((response) => {
      setInsurances(response.data.map((ins) => ins.policyNumber));
      })
      .catch((error) => {
      console.error("Error fetching insurance data: ", error);
      });

    // Fetch roadworthiness
    axios
      .get(`${apiUrl}/roadworth`)
      .then((response) => {
        setRoadWorths(response.data.map((rw) => rw.certificateNumber));
      })
      .catch((error) => {
        console.error("Error fetching roadworthiness data: ", error);
      });
  }, [apiUrl]);

  const [errorAlertShown, setErrorAlertShown] = useState(false);

// Update models when a brand is selected
// Fetch models when brand changes
useEffect(() => {
  if (!form.state.values.brand) {
    setModels([]);
    form.setFieldValue("model", ""); // Ensure model is reset to empty string
    setIsFetchingModels(false);
    console.log("Brand cleared, models reset:", models); // Debug reset
    return;
  }

  const brandName = form.state.values.brand.toLowerCase().trim();
  setIsFetchingModels(true);
  console.log("Fetching models for brand:", brandName);

  axios
    .get(`${apiUrl}/brands/name/${brandName}`)
    .then((response) => {
      console.log("Full API Response:", response.data);
      const fetchedModels = response.data.models || [];
      console.log("Models extracted:", fetchedModels);
      setModels(fetchedModels);
      // Reset model value if it doesn't match new options
      if (field.state.value && !fetchedModels.some((m) => m.name === field.state.value)) {
        form.setFieldValue("model", "");
        console.log("Model reset due to mismatch:", field.state.value);
      }
    })
    .catch((error) => {
      console.error("Error fetching models:", error.response?.data || error.message);
      setModels([]);
      form.setFieldValue("model", "");
      if (!errorAlertShown) {
        setErrorAlertShown(true);
        alertNotification.fire({
          icon: "error",
          title: "Failed to Load Models",
          timer: 3000,
          text: "Unable to fetch models. Check console for details.",
        });
      }
    })
    .finally(() => setIsFetchingModels(false));

  return () => setErrorAlertShown(false);
}, [form.state.values.brand, apiUrl, errorAlertShown, form]); // Added form to dependencies

  const updateFiles = (incomingFiles) => {
    setExtFiles(incomingFiles);
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
          {/* Basic Identification Details */}
          <div className="mb-4">
            <h3 className="font-medium text-gray-900">Basic Identification Details</h3>
          </div>

          {/* Registration Number */}
          <form.Field
            name="registrationNumber"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: stringFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Registration Number <span className="text-RhemaRed">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id={field.name}
                    name={field.name}
                    value={form.state.values.registrationNumber}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                    placeholder="gr-4321-19"
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

          {/* VIN Number */}
          <form.Field
            name="vinNumber"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: stringFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  VIN Number <span className="text-RhemaRed">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id={field.name}
                    name={field.name}
                    value={form.state.values.vinNumber}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                    placeholder="jhmcm82633c004352"
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

          {/* Vehicle Classification */}
          <div className="mb-4 mt-6">
            <h3 className="font-medium text-gray-900">Vehicle Classification</h3>
          </div>

          {/* Vehicle Type */}
          <form.Field
            name="vehicleType"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: dropDownFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Vehicle Type <span className="text-RhemaRed">*</span>
                </label>
                <div className="relative">
                  <select
                    id={field.name}
                    name={field.name}
                    value={form.state.values.vehicleType}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                    onBlur={field.handleBlur}
                    required
                  >
                    <option value="">Select a vehicle type</option>
                    {VALID_VEHICLE_TYPES.map((type) => (
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

          {/* Brand */}
          <form.Field
            name="brand"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: dropDownFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Brand <span className="text-RhemaRed">*</span>
                </label>
                <div className="relative">
                  <select
                    id={field.name}
                    name={field.name}
                    value={form.state.values.brand}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                    onBlur={field.handleBlur}
                    required
                  >
                    <option value="">Select a brand</option>
                    {brands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand.charAt(0).toUpperCase() + brand.slice(1)}
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

          {/* Model */}
          <form.Subscribe selector={(state) => [state.values.brand, state.values.model]}>
            {([brand, model]) =>
              brand && (
                <form.Field name="model" validatorAdapter={zodValidator()} validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: dropDownFormat }}>
                  {(field) => (
                    <div>
                      <label htmlFor={field.name} className="block text-sm mb-2">Model <span className="text-RhemaRed">*</span></label>
                      <select
                        id={field.name}
                        name={field.name}
                        value={field.state.value || ""} // Default to empty string if undefined/null
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                        onBlur={field.handleBlur}
                        required
                        disabled={isFetchingModels}
                      >
                        <option value="">Select a model</option>
                        {isFetchingModels ? (
                          <option value="" disabled>Loading models...</option>
                        ) : models.length > 0 ? (
                          models.map((model, index) => (
                            <option key={index} value={model.name}>
                              {model.name.includes("/") || model.name.includes("-")
                                ? model.name
                                    .split(/[-/]/)
                                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                    .join(" ")
                                : model.name.charAt(0).toUpperCase() + model.name.slice(1)}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>No models available</option>
                        )}
                      </select>
                      {field.state.meta.errors && <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>}
                    </div>
                  )}
                </form.Field>
              )
            }
          </form.Subscribe>


          {/* Year of Manufacturing */}
          <form.Field
            name="yearOfManufacturing"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: yearFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Year of Manufacturing <span className="text-RhemaRed">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id={field.name}
                    name={field.name}
                    value={form.state.values.yearOfManufacturing}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                    placeholder="2019"
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

          {/* Technical Specifications */}
          <div className="mb-4 mt-6">
            <h3 className="font-medium text-gray-900">Technical Specifications</h3>
          </div>

          {/* Fuel Type */}
          <form.Field
            name="fuelType"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: dropDownFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Fuel Type <span className="text-RhemaRed">*</span>
                </label>
                <div className="relative">
                  <select
                    id={field.name}
                    name={field.name}
                    value={form.state.values.fuelType}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                    onBlur={field.handleBlur}
                    required
                  >
                    <option value="">Select a fuel type</option>
                    {VALID_FUEL_TYPES.map((type) => (
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

          {/* Transmission Type */}
          <form.Field
            name="transmissionType"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: dropDownFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Transmission Type <span className="text-RhemaRed">*</span>
                </label>
                <div className="relative">
                  <select
                    id={field.name}
                    name={field.name}
                    value={form.state.values.transmissionType}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                    onBlur={field.handleBlur}
                    required
                  >
                    <option value="">Select a transmission type</option>
                    {VALID_TRANSMISSION_TYPES.map((type) => (
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

          {/* Sitting Capacity */}
          <form.Field
            name="sittingCapacity"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: numberFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Sitting Capacity <span className="text-RhemaRed">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id={field.name}
                    name={field.name}
                    value={form.state.values.sittingCapacity}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                    placeholder="5"
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

          {/* Weight */}
          <form.Field
            name="weight"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: numberFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Weight <span className="text-RhemaRed">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id={field.name}
                    name={field.name}
                    value={form.state.values.weight}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                    placeholder="1200"
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

          {/* Weight Type */}
          <form.Field
            name="weightType"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: dropDownFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Weight Type <span className="text-RhemaRed">*</span>
                </label>
                <div className="relative">
                  <select
                    id={field.name}
                    name={field.name}
                    value={form.state.values.weightType}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                    onBlur={field.handleBlur}
                    required
                  >
                    <option value="">Select a weight type</option>
                    {VALID_WEIGHT_TYPES.map((type) => (
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

          {/* Color */}
          <form.Field
            name="color"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: stringFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Color
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id={field.name}
                    name={field.name}
                    value={form.state.values.color}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                    placeholder="Silver"
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

          {/* Status and Ownership Details */}
          <div className="mb-4 mt-6">
            <h3 className="font-medium text-gray-900">Status and Ownership Details</h3>
          </div>

          {/* Status */}
          <form.Field
            name="status"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: dropDownFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Status <span className="text-RhemaRed">*</span>
                </label>
                <div className="relative">
                  <select
                    id={field.name}
                    name={field.name}
                    value={form.state.values.status}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                    onBlur={field.handleBlur}
                    required
                  >
                    <option value="">Select a status</option>
                    {VALID_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
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

          {/* Ownership Status */}
          <form.Field
            name="ownershipStatus"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: dropDownFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Ownership Status <span className="text-RhemaRed">*</span>
                </label>
                <div className="relative">
                  <select
                    id={field.name}
                    name={field.name}
                    value={form.state.values.ownershipStatus}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                    onBlur={field.handleBlur}
                    required
                  >
                    <option value="">Select an ownership status</option>
                    {VALID_OWNERSHIP_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
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

          {/* Vehicle Condition */}
          <form.Field
            name="vehicleCondition"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: dropDownFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Vehicle Condition <span className="text-RhemaRed">*</span>
                </label>
                <div className="relative">
                  <select
                    id={field.name}
                    name={field.name}
                    value={form.state.values.vehicleCondition}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                    onBlur={field.handleBlur}
                    required
                  >
                    <option value="">Select a vehicle condition</option>
                    {VALID_VEHICLE_CONDITIONS.map((condition) => (
                      <option key={condition} value={condition}>
                        {condition.charAt(0).toUpperCase() + condition.slice(1)}
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

          {/* Assigned Department */}
          <form.Field
            name="assignedDepartment"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: dropDownFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Assigned Department
                </label>
                <div className="relative">
                  <select
                    id={field.name}
                    name={field.name}
                    value={form.state.values.assignedDepartment}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                    onBlur={field.handleBlur}
                  >
                    <option value="">Select a department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept.charAt(0).toUpperCase() + dept.slice(1)}
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

          {/* Assigned Driver */}
          <form.Field
            name="assignedDriver"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: dropDownFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Assigned Driver
                </label>
                <div className="relative">
                  <select
                    id={field.name}
                    name={field.name}
                    value={form.state.values.assignedDriver}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                    onBlur={field.handleBlur}
                  >
                    <option value="">Select a driver</option>
                    {drivers.map((driver) => (
                      <option key={driver} value={driver}>
                        {driver}
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

          {/* Is Available for Pool */}
          <form.Field
            name="isAvailableForPool"
            children={(field) => (
              <div>
                <label className="block text-sm mb-2">
                  Available for Pool
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={field.name}
                    name={field.name}
                    checked={form.state.values.isAvailableForPool}
                    onChange={(e) => field.handleChange(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor={field.name}>Yes</label>
                </div>
              </div>
            )}
          />

          {/* Operational Details */}
          <div className="mb-4 mt-6">
            <h3 className="font-medium text-gray-900">Operational Details</h3>
          </div>

          {/* Current Mileage */}
          <form.Field
            name="currentMileage"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: numberFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Current Mileage
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id={field.name}
                    name={field.name}
                    value={form.state.values.currentMileage}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                    placeholder="43200"
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

          {/* Purchase Date */}
          <form.Field
            name="purchaseDate"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: dateFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Purchase Date <span className="text-RhemaRed">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id={field.name}
                    name={field.name}
                    value={form.state.values.purchaseDate}
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

          {/* Cost of Vehicle */}
          <form.Field
            name="costOfVehicle"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: numberFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Cost of Vehicle <span className="text-RhemaRed">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id={field.name}
                    name={field.name}
                    value={form.state.values.costOfVehicle}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                    placeholder="85000"
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

          {/* Technical Details */}
          <div className="mb-4 mt-6">
            <h3 className="font-medium text-gray-900">Technical Details</h3>
          </div>

          {/* Vehicle Description */}
          <form.Field
            name="vehicleDescription"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: stringFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Vehicle Description
                </label>
                <div className="relative">
                  <textarea
                    id={field.name}
                    name={field.name}
                    value={form.state.values.vehicleDescription}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                    placeholder="Compact sedan used for city commutes"
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

          {/* Engine Description */}
          <form.Field
            name="engineDescription"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: stringFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Engine Description
                </label>
                <div className="relative">
                  <textarea
                    id={field.name}
                    name={field.name}
                    value={form.state.values.engineDescription}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                    placeholder="1.8L 4-cylinder engine"
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

          {/* Pictures with CustomDropzone */}
          <form.Field
            name="pictures"
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Pictures
                </label>
                <Dropzone
                  onChange={updateFiles}
                  value={extFiles}
                  accept=".png, .jpg, .jpeg"
                  maxFiles={5}
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
                        Drag & drop PNG or JPG images or click to browse
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

          {/* Insurance and Compliance Details */}
          <div className="mb-4 mt-6">
            <h3 className="font-medium text-gray-900">Insurance and Compliance Details</h3>
          </div>

          {/* Insurance */}
          <form.Field
            name="insurance"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: dropDownFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Insurance
                </label>
                <div className="relative">
                  <select
                    id={field.name}
                    name={field.name}
                    value={form.state.values.insurance}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                    onBlur={field.handleBlur}
                  >
                    <option value="">Select an insurance policy</option>
                    {insurances.map((policy) => (
                      <option key={policy} value={policy}>
                        {policy}
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

          {/* Insurance Status */}
          <form.Field
            name="insuranceStatus"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: dropDownFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Insurance Status
                </label>
                <div className="relative">
                  <select
                    id={field.name}
                    name={field.name}
                    value={form.state.values.insuranceStatus}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                    onBlur={field.handleBlur}
                  >
                    <option value="">Select an insurance status</option>
                    {VALID_COMPLIANCE_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
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

          {/* Insurance Start Date */}
          <form.Field
            name="insuranceStartDate"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: dateFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Insurance Start Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id={field.name}
                    name={field.name}
                    value={form.state.values.insuranceStartDate}
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

          {/* Insurance End Date */}
          <form.Field
            name="insuranceEndDate"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: dateFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Insurance End Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id={field.name}
                    name={field.name}
                    value={form.state.values.insuranceEndDate}
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

          {/* Roadworthiness */}
          <form.Field
            name="roadWorth"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: dropDownFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Roadworthiness
                </label>
                <div className="relative">
                  <select
                    id={field.name}
                    name={field.name}
                    value={form.state.values.roadWorth}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                    onBlur={field.handleBlur}
                  >
                    <option value="">Select a roadworthiness certificate</option>
                    {roadWorths.map((rw) => (
                      <option key={rw} value={rw}>
                        {rw}
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

          {/* Roadworthiness Status */}
          <form.Field
            name="roadWorthStatus"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: dropDownFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Roadworthiness Status
                </label>
                <div className="relative">
                  <select
                    id={field.name}
                    name={field.name}
                    value={form.state.values.roadWorthStatus}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                    onBlur={field.handleBlur}
                  >
                    <option value="">Select a roadworthiness status</option>
                    {VALID_COMPLIANCE_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
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

          {/* Roadworthiness Start Date */}
          <form.Field
            name="roadWorthStartDate"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: dateFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Roadworthiness Start Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id={field.name}
                    name={field.name}
                    value={form.state.values.roadWorthStartDate}
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

          {/* Roadworthiness End Date */}
          <form.Field
            name="roadWorthEndDate"
            validatorAdapter={zodValidator()}
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: dateFormat,
            }}
            children={(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">
                  Roadworthiness End Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id={field.name}
                    name={field.name}
                    value={form.state.values.roadWorthEndDate}
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
        </div>
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

export default VehicleSubForm;