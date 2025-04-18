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
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
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
  const [errorAlertShown, setErrorAlertShown] = useState(false);
  const [fetchError, setFetchError] = useState(null); // New state for critical API errors
  const [selectedBrand, setSelectedBrand] = useState(""); // Track selected brand

  const VALID_VEHICLE_TYPES = ["sedan", "suv", "truck", "van", "pickup", "minivan", "bus", "motorcycle", "utility", "coupe", "saloon"];
  const VALID_FUEL_TYPES = ["diesel", "petrol", "electric", "hybrid", "compressed natural gas", "biofuel", "ethanol", "hydrogen"];
  const VALID_TRANSMISSION_TYPES = ["automatic", "manual", "semi-automatic", "cvt"];
  const VALID_WEIGHT_TYPES = ["kg", "grams", "tons"];
  const VALID_STATUSES = ["available", "in-use", "maintenance", "out-of-service", "retired", "reserved", "auctioned", "sold", "disposed off"];
  const VALID_OWNERSHIP_STATUSES = ["owned", "leased", "rented", "financed", "borrowed", "shared"];
  const VALID_VEHICLE_CONDITIONS = ["new", "used", "damaged", "salvage", "repaired", "refurbished"];
  const VALID_COMPLIANCE_STATUSES = ["valid", "expired", "revoked"];

  const stringFormat = z.string().min(3, "This field must be at least 3 characters long.");
  const dropDownFormat = z.string().refine((value) => value !== "", "Please select an option");
  const numberFormat = z.string().refine((value) => !isNaN(parseFloat(value)) && isFinite(value), "Please enter a valid number");
  const yearFormat = z.string().refine((value) => {
    const year = parseInt(value);
    const currentYear = new Date().getFullYear() + 1;
    return year >= 1900 && year <= currentYear;
  }, `Year must be between 1900 and ${new Date().getFullYear() + 1}`);
  const dateFormat = z.string().refine((value) => !isNaN(Date.parse(value)), "Please enter a valid date");

  const alertNotification = Swal.mixin({
    showConfirmButton: false,
    showCancelButton: false,
  });

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
      const deduplicatedValue = Object.fromEntries(
        Object.entries(value).map(([key, val]) => [key, Array.isArray(val) ? val[0] : val])
      );

      // Map brand name to brand _id
      const selectedBrandObj = brands.find(
        (brand) => brand.name.toLowerCase().trim() === deduplicatedValue.brand.toLowerCase().trim()
      );
      if (!selectedBrandObj) {
        await alertNotification.fire({
          icon: "error",
          title: "Submission Failed",
          timer: 3000,
          text: `Could not find brand ID for name: ${deduplicatedValue.brand}`,
        });
        return;
      }
      const brandId = selectedBrandObj._id;

      const convertedData = {
        ...deduplicatedValue,
        brand: brandId, // Replace name with _id
        model: deduplicatedValue.model, // Model remains a string
        isAvailableForPool: deduplicatedValue.isAvailableForPool === true || deduplicatedValue.isAvailableForPool === "true",
        sittingCapacity: parseInt(deduplicatedValue.sittingCapacity),
        weight: parseFloat(deduplicatedValue.weight),
        currentMileage: parseFloat(deduplicatedValue.currentMileage) || 0,
        costOfVehicle: parseFloat(deduplicatedValue.costOfVehicle),
        yearOfManufacturing: parseInt(deduplicatedValue.yearOfManufacturing),
      };
      for (const [key, value] of Object.entries(convertedData)) {
        if (value !== undefined && value !== "" && key !== "pictures") {
          formData.append(key, value);
        }
      }
      if (extFiles.length > 0) {
        extFiles.forEach((file) => formData.append("pictures", file.file));
      }
      try {
        const response = await axios.post(endPointUrl, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (response.status === 201) {
          await alertNotification.fire({
            icon: "success",
            title: "Vehicle added successfully",
            timer: 3000,
            text: "You have successfully added a new vehicle",
          });
          setSelectedBrand(""); // Reset selectedBrand
          form.reset(); // Reset the form
          window.location.reload();
        } else if (response.status === 400) {
          await alertNotification.fire({
            icon: "error",
            title: "Error adding vehicle",
            timer: 3000,
            text: "The request was invalid",
          });
        } else if (response.status === 500) {
          await alertNotification.fire({
            icon: "error",
            title: "Oops!",
            timer: 3000,
            text: "Internal server error, please try again later",
          });
        }
      } catch (error) {
        await alertNotification.fire({
          icon: "error",
          title: "Submission Failed",
          timer: 10000,
          text: error.response?.data?.message || "There was an error submitting the form.",
        });
      }
    },
  });

  useEffect(() => {
    axios
      .get(`${apiUrl}/brands`)
      .then((response) => {
        setBrands(
          response.data.map((brand) => ({ _id: brand._id, name: brand.name }))
        );
      })
      .catch((error) => {
        console.error("Error fetching brands:", error);
        setFetchError("Failed to load brands. Please try again later.");
        alertNotification.fire({
          icon: "error",
          title: "Failed to Load Brands",
          timer: 3000,
          text: "Unable to fetch brands. Please try again.",
        });
      });

    axios
      .get(`${apiUrl}/departments`)
      .then((response) => {
        setDepartments(
          response.data.map((dept) => ({ _id: dept._id, departmentName: dept.departmentName }))
        );
      })
      .catch((error) => {
        console.error("Error fetching departments:", error);
        alertNotification.fire({
          icon: "error",
          title: "Failed to Load Departments",
          timer: 3000,
          text: "Unable to fetch departments.",
        });
      });

    axios
      .get(`${apiUrl}/employees`)
      .then((response) => {
        setDrivers(
          response.data.map((driver) => ({ _id: driver._id, name: `${driver.firstName} ${driver.lastName}` }))
        );
      })
      .catch((error) => {
        console.error("Error fetching drivers:", error);
        alertNotification.fire({
          icon: "error",
          title: "Failed to Load Drivers",
          timer: 3000,
          text: "Unable to fetch drivers.",
        });
      });

    axios
      .get(`${apiUrl}/insurance`)
      .then((response) => {
        setInsurances(
          response.data.map((ins) => ({ _id: ins._id, policyNumber: ins.policyNumber }))
        );
      })
      .catch((error) => {
        console.error("Error fetching insurances:", error);
        alertNotification.fire({
          icon: "error",
          title: "Failed to Load Insurances",
          timer: 3000,
          text: "Unable to fetch insurances.",
        });
      });

    axios
      .get(`${apiUrl}/roadworth`)
      .then((response) => {
        setRoadWorths(
          response.data.map((rw) => ({ _id: rw._id, certificateNumber: rw.certificateNumber }))
        );
      })
      .catch((error) => {
        console.error("Error fetching roadworthiness:", error);
        alertNotification.fire({
          icon: "error",
          title: "Failed to Load Roadworthiness",
          timer: 3000,
          text: "Unable to fetch roadworthiness certificates.",
        });
      });
  }, [apiUrl]);

  useEffect(() => {
    if (!selectedBrand) {
      setModels([]);
      form.setFieldValue("model", "");
      setIsFetchingModels(false);
      return;
    }

    const debounceFetch = setTimeout(() => {
      setIsFetchingModels(true);
      axios
        .get(`${apiUrl}/brands/name/${selectedBrand.toLowerCase().trim()}`)
        .then((response) => {
          const fetchedModels = response.data.models || [];
          setModels(fetchedModels);
          form.setFieldValue("model", "");
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
        .finally(() => {
          setIsFetchingModels(false);
        });
    }, 300); // 300ms debounce

    return () => clearTimeout(debounceFetch);
  }, [selectedBrand, apiUrl, errorAlertShown]);

  const updateFiles = (incomingFiles) => setExtFiles(incomingFiles);
  const onDelete = (id) => setExtFiles(extFiles.filter((x) => x.id !== id));
  const handleSee = (imageSource) => setImageSrc(imageSource);

  if (fetchError) {
    return <div className="text-RhemaRed text-sm">{fetchError}</div>;
  }

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className="grid gap-y-4">
          <div className="mb-4"><h3 className="font-medium text-gray-900">Basic Identification Details</h3></div>
          <form.Field name="registrationNumber" validatorAdapter={zodValidator()} validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: stringFormat }}>
            {(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">Registration Number <span className="text-RhemaRed">*</span></label>
                <input type="text" id={field.name} name={field.name} value={field.state.value || ""} onChange={(e) => field.handleChange(e.target.value)} className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange" placeholder="gr-4321-19" onBlur={field.handleBlur} />
                {field.state.meta.errors && <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>}
              </div>
            )}
          </form.Field>
          <form.Field name="vinNumber" validatorAdapter={zodValidator()} validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: stringFormat }}>
            {(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">VIN Number <span className="text-RhemaRed">*</span></label>
                <input type="text" id={field.name} name={field.name} value={field.state.value || ""} onChange={(e) => field.handleChange(e.target.value)} className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange" placeholder="jhmcm82633c004352" onBlur={field.handleBlur} />
                {field.state.meta.errors && <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>}
              </div>
            )}
          </form.Field>
          <div className="mb-4 mt-6"><h3 className="font-medium text-gray-900">Vehicle Classification</h3></div>
          <form.Field name="vehicleType" validatorAdapter={zodValidator()} validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: dropDownFormat }}>
            {(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">Vehicle Type <span className="text-RhemaRed">*</span></label>
                <select id={field.name} name={field.name} value={field.state.value || ""} onChange={(e) => field.handleChange(e.target.value)} className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange" onBlur={field.handleBlur} required>
                  <option value="">Select a vehicle type</option>
                  {VALID_VEHICLE_TYPES.map((type) => <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>)}
                </select>
                {field.state.meta.errors && <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>}
              </div>
            )}
          </form.Field>
          <form.Field name="brand" validatorAdapter={zodValidator()} validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: dropDownFormat }}>
            {(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">Brand <span className="text-RhemaRed">*</span></label>
                <select
                  id={field.name}
                  name={field.name}
                  value={field.state.value || ""}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    setSelectedBrand(e.target.value);
                  }}
                  className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange"
                  onBlur={field.handleBlur}
                  required
                >
                  <option value="">Select a brand</option>
                  {brands.map((brand) => <option key={brand._id} value={brand.name}>{brand.name.charAt(0).toUpperCase() + brand.name.slice(1)}</option>)}
                </select>
                {field.state.meta.errors && <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>}
              </div>
            )}
          </form.Field>
          {selectedBrand && (
            <form.Field name="model" validatorAdapter={zodValidator()} validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: dropDownFormat }}>
              {(field) => (
                <div>
                  <label htmlFor={field.name} className="block text-sm mb-2">Model <span className="text-RhemaRed">*</span></label>
                  <select
                    id={field.name}
                    name={field.name}
                    value={field.state.value || ""}
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
                      models.map((model) => (
                        <option key={model._id} value={model.name}>
                          {model.name.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
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
          )}
          <form.Field name="yearOfManufacturing" validatorAdapter={zodValidator()} validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: yearFormat }}>
            {(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">Year of Manufacturing <span className="text-RhemaRed">*</span></label>
                <input type="number" id={field.name} name={field.name} value={field.state.value || ""} onChange={(e) => field.handleChange(e.target.value)} className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange" placeholder="2019" onBlur={field.handleBlur} />
                {field.state.meta.errors && <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>}
              </div>
            )}
          </form.Field>
          <div className="mb-4 mt-6"><h3 className="font-medium text-gray-900">Technical Specifications</h3></div>
          <form.Field name="fuelType" validatorAdapter={zodValidator()} validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: dropDownFormat }}>
            {(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">Fuel Type <span className="text-RhemaRed">*</span></label>
                <select id={field.name} name={field.name} value={field.state.value || ""} onChange={(e) => field.handleChange(e.target.value)} className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange" onBlur={field.handleBlur} required>
                  <option value="">Select a fuel type</option>
                  {VALID_FUEL_TYPES.map((type) => <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>)}
                </select>
                {field.state.meta.errors && <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>}
              </div>
            )}
          </form.Field>
          <form.Field name="transmissionType" validatorAdapter={zodValidator()} validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: dropDownFormat }}>
            {(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">Transmission Type <span className="text-RhemaRed">*</span></label>
                <select id={field.name} name={field.name} value={field.state.value || ""} onChange={(e) => field.handleChange(e.target.value)} className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange" onBlur={field.handleBlur} required>
                  <option value="">Select a transmission type</option>
                  {VALID_TRANSMISSION_TYPES.map((type) => <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>)}
                </select>
                {field.state.meta.errors && <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>}
              </div>
            )}
          </form.Field>
          <form.Field name="sittingCapacity" validatorAdapter={zodValidator()} validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: numberFormat }}>
            {(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">Sitting Capacity <span className="text-RhemaRed">*</span></label>
                <input type="number" id={field.name} name={field.name} value={field.state.value || ""} onChange={(e) => field.handleChange(e.target.value)} className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange" placeholder="5" onBlur={field.handleBlur} />
                {field.state.meta.errors && <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>}
              </div>
            )}
          </form.Field>
          <form.Field name="weight" validatorAdapter={zodValidator()} validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: numberFormat }}>
            {(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">Weight <span className="text-RhemaRed">*</span></label>
                <input type="number" id={field.name} name={field.name} value={field.state.value || ""} onChange={(e) => field.handleChange(e.target.value)} className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange" placeholder="1200" onBlur={field.handleBlur} />
                {field.state.meta.errors && <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>}
              </div>
            )}
          </form.Field>
          <form.Field name="weightType" validatorAdapter={zodValidator()} validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: dropDownFormat }}>
            {(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">Weight Type <span className="text-RhemaRed">*</span></label>
                <select id={field.name} name={field.name} value={field.state.value || ""} onChange={(e) => field.handleChange(e.target.value)} className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange" onBlur={field.handleBlur} required>
                  <option value="">Select a weight type</option>
                  {VALID_WEIGHT_TYPES.map((type) => <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>)}
                </select>
                {field.state.meta.errors && <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>}
              </div>
            )}
          </form.Field>
          <form.Field name="color" validatorAdapter={zodValidator()} validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: stringFormat }}>
            {(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">Color</label>
                <input type="text" id={field.name} name={field.name} value={field.state.value || ""} onChange={(e) => field.handleChange(e.target.value)} className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange" placeholder="Silver" onBlur={field.handleBlur} />
                {field.state.meta.errors && <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>}
              </div>
            )}
          </form.Field>
          <div className="mb-4 mt-6"><h3 className="font-medium text-gray-900">Status and Ownership Details</h3></div>
          <form.Field name="status" validatorAdapter={zodValidator()} validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: dropDownFormat }}>
            {(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">Status <span className="text-RhemaRed">*</span></label>
                <select id={field.name} name={field.name} value={field.state.value || ""} onChange={(e) => field.handleChange(e.target.value)} className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange" onBlur={field.handleBlur} required>
                  <option value="">Select a status</option>
                  {VALID_STATUSES.map((status) => <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>)}
                </select>
                {field.state.meta.errors && <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>}
              </div>
            )}
          </form.Field>
          <form.Field name="ownershipStatus" validatorAdapter={zodValidator()} validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: dropDownFormat }}>
            {(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">Ownership Status <span className="text-RhemaRed">*</span></label>
                <select id={field.name} name={field.name} value={field.state.value || ""} onChange={(e) => field.handleChange(e.target.value)} className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange" onBlur={field.handleBlur} required>
                  <option value="">Select an ownership status</option>
                  {VALID_OWNERSHIP_STATUSES.map((status) => <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>)}
                </select>
                {field.state.meta.errors && <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>}
              </div>
            )}
          </form.Field>
          <form.Field name="vehicleCondition" validatorAdapter={zodValidator()} validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: dropDownFormat }}>
            {(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">Vehicle Condition <span className="text-RhemaRed">*</span></label>
                <select id={field.name} name={field.name} value={field.state.value || ""} onChange={(e) => field.handleChange(e.target.value)} className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange" onBlur={field.handleBlur} required>
                  <option value="">Select a vehicle condition</option>
                  {VALID_VEHICLE_CONDITIONS.map((condition) => <option key={condition} value={condition}>{condition.charAt(0).toUpperCase() + condition.slice(1)}</option>)}
                </select>
                {field.state.meta.errors && <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>}
              </div>
            )}
          </form.Field>
          <form.Field name="assignedDepartment" validatorAdapter={zodValidator()} validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: dropDownFormat }}>
            {(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">Assigned Department</label>
                <select id={field.name} name={field.name} value={field.state.value || ""} onChange={(e) => field.handleChange(e.target.value)} className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange" onBlur={field.handleBlur}>
                  <option value="">Select a department</option>
                  {departments.map((dept) => <option key={dept._id} value={dept._id}>{dept.departmentName.charAt(0).toUpperCase() + dept.departmentName.slice(1)}</option>)}
                </select>
                {field.state.meta.errors && <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>}
              </div>
            )}
          </form.Field>
          <form.Field name="assignedDriver" validatorAdapter={zodValidator()} validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: dropDownFormat }}>
            {(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">Assigned Driver</label>
                <select id={field.name} name={field.name} value={field.state.value || ""} onChange={(e) => field.handleChange(e.target.value)} className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange" onBlur={field.handleBlur}>
                  <option value="">Select a driver</option>
                  {drivers.map((driver) => <option key={driver._id} value={driver._id}>{driver.name}</option>)}
                </select>
                {field.state.meta.errors && <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>}
              </div>
            )}
          </form.Field>
          <form.Field name="isAvailableForPool">
            {(field) => (
              <div>
                <label className="block text-sm mb-2">Available for Pool</label>
                <div className="flex items-center">
                  <input type="checkbox" id={field.name} name={field.name} checked={field.state.value} onChange={(e) => field.handleChange(e.target.checked)} className="mr-2" />
                  <label htmlFor={field.name}>Yes</label>
                </div>
              </div>
            )}
          </form.Field>
          <div className="mb-4 mt-6"><h3 className="font-medium text-gray-900">Operational Details</h3></div>
          <form.Field name="currentMileage" validatorAdapter={zodValidator()} validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: numberFormat }}>
            {(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">Current Mileage</label>
                <input type="number" id={field.name} name={field.name} value={field.state.value || ""} onChange={(e) => field.handleChange(e.target.value)} className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange" placeholder="43200" onBlur={field.handleBlur} />
                {field.state.meta.errors && <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>}
              </div>
            )}
          </form.Field>
          <form.Field name="purchaseDate" validatorAdapter={zodValidator()} validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: dateFormat }}>
            {(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">Purchase Date <span className="text-RhemaRed">*</span></label>
                <input type="date" id={field.name} name={field.name} value={field.state.value || ""} onChange={(e) => field.handleChange(e.target.value)} className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange" onBlur={field.handleBlur} />
                {field.state.meta.errors && <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>}
              </div>
            )}
          </form.Field>
          <form.Field name="costOfVehicle" validatorAdapter={zodValidator()} validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: numberFormat }}>
            {(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">Cost of Vehicle <span className="text-RhemaRed">*</span></label>
                <input type="number" id={field.name} name={field.name} value={field.state.value || ""} onChange={(e) => field.handleChange(e.target.value)} className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange" placeholder="85000" onBlur={field.handleBlur} />
                {field.state.meta.errors && <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>}
              </div>
            )}
          </form.Field>
          <div className="mb-4 mt-6"><h3 className="font-medium text-gray-900">Technical Details</h3></div>
          <form.Field name="vehicleDescription" validatorAdapter={zodValidator()} validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: stringFormat }}>
            {(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">Vehicle Description</label>
                <textarea id={field.name} name={field.name} value={field.state.value || ""} onChange={(e) => field.handleChange(e.target.value)} className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange" placeholder="Compact sedan used for city commutes" onBlur={field.handleBlur} />
                {field.state.meta.errors && <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>}
              </div>
            )}
          </form.Field>
          <form.Field name="engineDescription" validatorAdapter={zodValidator()} validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: stringFormat }}>
            {(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">Engine Description</label>
                <textarea id={field.name} name={field.name} value={field.state.value || ""} onChange={(e) => field.handleChange(e.target.value)} className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange" placeholder="1.8L 4-cylinder engine" onBlur={field.handleBlur} />
                {field.state.meta.errors && <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>}
              </div>
            )}
          </form.Field>
          <form.Field name="pictures">
            {(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">Pictures</label>
                <Dropzone
                  onChange={updateFiles}
                  value={extFiles}
                  accept=".png, .jpg, .jpeg"
                  maxFiles={5}
                  maxFileSize={15 * 1024 * 1024}
                  minHeight="200px"
                  label={
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <BsUpload size={20} style={{ color: "#588abd" }} />
                      <span>Drag & drop PNG or JPG images or click to browse</span>
                    </div>
                  }
                  style={{ backgroundColor: "#ffffff", border: "2px dashed #fb8602", borderRadius: "10px", color: "#333" }}
                  footerConfig={{ style: { backgroundColor: "#588abd", color: "#ffffff", padding: "10px", fontWeight: "bold", textAlign: "center" } }}
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
                      style={{ backgroundColor: "#fff", border: "1px solid #ddd", borderRadius: "8px", padding: "10px" }}
                    />
                  ))}
                </Dropzone>
                <FullScreen open={imageSrc !== undefined} onClose={() => setImageSrc(undefined)}>
                  <ImagePreview src={imageSrc} />
                </FullScreen>
              </div>
            )}
          </form.Field>
          <div className="mb-4 mt-6"><h3 className="font-medium text-gray-900">Insurance and Compliance Details</h3></div>
          <form.Field name="insurance" validatorAdapter={zodValidator()} validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: dropDownFormat }}>
            {(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">Insurance</label>
                <select id={field.name} name={field.name} value={field.state.value || ""} onChange={(e) => field.handleChange(e.target.value)} className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange" onBlur={field.handleBlur}>
                  <option value="">Select an insurance policy</option>
                  {insurances.map((policy) => <option key={policy._id} value={policy._id}>{policy.policyNumber}</option>)}
                </select>
                {field.state.meta.errors && <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>}
              </div>
            )}
          </form.Field>
          <form.Field name="insuranceStatus" validatorAdapter={zodValidator()} validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: dropDownFormat }}>
            {(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">Insurance Status</label>
                <select id={field.name} name={field.name} value={field.state.value || ""} onChange={(e) => field.handleChange(e.target.value)} className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange" onBlur={field.handleBlur}>
                  <option value="">Select an insurance status</option>
                  {VALID_COMPLIANCE_STATUSES.map((status) => <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>)}
                </select>
                {field.state.meta.errors && <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>}
              </div>
            )}
          </form.Field>
          <form.Field name="insuranceStartDate" validatorAdapter={zodValidator()} validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: dateFormat }}>
            {(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">Insurance Start Date</label>
                <input type="date" id={field.name} name={field.name} value={field.state.value || ""} onChange={(e) => field.handleChange(e.target.value)} className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange" onBlur={field.handleBlur} />
                {field.state.meta.errors && <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>}
              </div>
            )}
          </form.Field>
          <form.Field name="insuranceEndDate" validatorAdapter={zodValidator()} validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: dateFormat }}>
            {(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">Insurance End Date</label>
                <input type="date" id={field.name} name={field.name} value={field.state.value || ""} onChange={(e) => field.handleChange(e.target.value)} className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange" onBlur={field.handleBlur} />
                {field.state.meta.errors && <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>}
              </div>
            )}
          </form.Field>
          <form.Field name="roadWorth" validatorAdapter={zodValidator()} validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: dropDownFormat }}>
            {(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">Roadworthiness</label>
                <select id={field.name} name={field.name} value={field.state.value || ""} onChange={(e) => field.handleChange(e.target.value)} className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange" onBlur={field.handleBlur}>
                  <option value="">Select a roadworthiness certificate</option>
                  {roadWorths.map((rw) => <option key={rw._id} value={rw._id}>{rw.certificateNumber}</option>)}
                </select>
                {field.state.meta.errors && <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>}
              </div>
            )}
          </form.Field>
          <form.Field name="roadWorthStatus" validatorAdapter={zodValidator()} validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: dropDownFormat }}>
            {(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">Roadworthiness Status</label>
                <select id={field.name} name={field.name} value={field.state.value || ""} onChange={(e) => field.handleChange(e.target.value)} className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange" onBlur={field.handleBlur}>
                  <option value="">Select a roadworthiness status</option>
                  {VALID_COMPLIANCE_STATUSES.map((status) => <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>)}
                </select>
                {field.state.meta.errors && <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>}
              </div>
            )}
          </form.Field>
          <form.Field name="roadWorthStartDate" validatorAdapter={zodValidator()} validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: dateFormat }}>
            {(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">Roadworthiness Start Date</label>
                <input type="date" id={field.name} name={field.name} value={field.state.value || ""} onChange={(e) => field.handleChange(e.target.value)} className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange" onBlur={field.handleBlur} />
                {field.state.meta.errors && <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>}
              </div>
            )}
          </form.Field>
          <form.Field name="roadWorthEndDate" validatorAdapter={zodValidator()} validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: dateFormat }}>
            {(field) => (
              <div>
                <label htmlFor={field.name} className="block text-sm mb-2">Roadworthiness End Date</label>
                <input type="date" id={field.name} name={field.name} value={field.state.value || ""} onChange={(e) => field.handleChange(e.target.value)} className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange" onBlur={field.handleBlur} />
                {field.state.meta.errors && <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>}
              </div>
            )}
          </form.Field>
        </div>
        <div className="items-center gap-x-2 mt-3 py-3 px-4 text-sm sm:flex border-t">
          <button className="w-full mt-2 p-2.5 flex-1 text-white bg-taureanOrange rounded-md outline-none ring-offset-2 ring-taureanLightBlue focus:ring-2" onClick={() => form.handleSubmit()}>
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default VehicleSubForm;