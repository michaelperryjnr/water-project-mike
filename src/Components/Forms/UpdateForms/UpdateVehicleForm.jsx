import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useForm } from "@tanstack/react-form";
import axios from "axios";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-form-adapter";
import Swal from "sweetalert2";
import { Dropzone, FileMosaic, FullScreen, ImagePreview } from "@files-ui/react";
import { BsX, BsUpload } from "react-icons/bs";
import ErrorMessage from "../../Alerts/floatui/ErrorMessage";

export default function UpdateVehicleForm({ data, onClose }) {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const endPointUrl = `${apiUrl}/vehicles/${data}`;

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
  const [fetchError, setFetchError] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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
        brand: brandId,
        model: deduplicatedValue.model,
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
        const response = await axios.put(endPointUrl, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (response.status === 200) {
          await alertNotification.fire({
            icon: "success",
            title: "Vehicle updated successfully",
            timer: 3000,
            text: "You have successfully updated the vehicle",
          });
          setSelectedBrand("");
          setExtFiles([]);
          form.reset();
          onClose();
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
              title: "Error updating vehicle",
              timer: 3000,
              text: displayMessage,
            });
          } else if (status === 409) {
            displayMessage = "This registration number or VIN already exists. Please use unique values.";
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

  useEffect(() => {
    if (!data) return;

    setIsLoading(true);
    Promise.all([
      axios.get(`${apiUrl}/vehicles/${data}`),
      axios.get(`${apiUrl}/brands`),
      axios.get(`${apiUrl}/departments`),
      axios.get(`${apiUrl}/employees`),
      axios.get(`${apiUrl}/insurance`),
      axios.get(`${apiUrl}/roadworth`),
    ])
      .then(([
        vehicleResponse,
        brandsResponse,
        departmentsResponse,
        employeesResponse,
        insuranceResponse,
        roadWorthResponse,
      ]) => {
        const vehicle = vehicleResponse.data;
        setBrands(brandsResponse.data.map((brand) => ({ _id: brand._id, name: brand.name })));
        setDepartments(departmentsResponse.data.map((dept) => ({ _id: dept._id, departmentName: dept.departmentName })));
        setDrivers(employeesResponse.data.map((driver) => ({ _id: driver._id, name: `${driver.firstName} ${driver.lastName}` })));
        setInsurances(insuranceResponse.data.map((ins) => ({ _id: ins._id, policyNumber: ins.policyNumber })));
        setRoadWorths(roadWorthResponse.data.map((rw) => ({ _id: rw._id, certificateNumber: rw.certificateNumber })));

        const brand = brandsResponse.data.find((b) => b._id === vehicle.brand);
        setSelectedBrand(brand ? brand.name : "");

        form.setFieldValue("registrationNumber", vehicle.registrationNumber || "");
        form.setFieldValue("vinNumber", vehicle.vinNumber || "");
        form.setFieldValue("vehicleType", vehicle.vehicleType || "");
        form.setFieldValue("brand", brand ? brand.name : "");
        form.setFieldValue("model", vehicle.model || "");
        form.setFieldValue("yearOfManufacturing", vehicle.yearOfManufacturing?.toString() || "");
        form.setFieldValue("fuelType", vehicle.fuelType || "");
        form.setFieldValue("transmissionType", vehicle.transmissionType || "");
        form.setFieldValue("sittingCapacity", vehicle.sittingCapacity?.toString() || "");
        form.setFieldValue("weight", vehicle.weight?.toString() || "");
        form.setFieldValue("weightType", vehicle.weightType || "");
        form.setFieldValue("color", vehicle.color || "");
        form.setFieldValue("status", vehicle.status || "");
        form.setFieldValue("ownershipStatus", vehicle.ownershipStatus || "");
        form.setFieldValue("vehicleCondition", vehicle.vehicleCondition || "");
        form.setFieldValue("assignedDepartment", vehicle.assignedDepartment || "");
        form.setFieldValue("assignedDriver", vehicle.assignedDriver || "");
        form.setFieldValue("isAvailableForPool", vehicle.isAvailableForPool || false);
        form.setFieldValue("currentMileage", vehicle.currentMileage?.toString() || "");
        form.setFieldValue("purchaseDate", vehicle.purchaseDate ? new Date(vehicle.purchaseDate).toISOString().split("T")[0] : "");
        form.setFieldValue("costOfVehicle", vehicle.costOfVehicle?.toString() || "");
        form.setFieldValue("vehicleDescription", vehicle.vehicleDescription || "");
        form.setFieldValue("engineDescription", vehicle.engineDescription || "");
        form.setFieldValue("insurance", vehicle.insurance || "");
        form.setFieldValue("insuranceStatus", vehicle.insuranceStatus || "");
        form.setFieldValue("insuranceStartDate", vehicle.insuranceStartDate ? new Date(vehicle.insuranceStartDate).toISOString().split("T")[0] : "");
        form.setFieldValue("insuranceEndDate", vehicle.insuranceEndDate ? new Date(vehicle.insuranceEndDate).toISOString().split("T")[0] : "");
        form.setFieldValue("roadWorth", vehicle.roadWorth || "");
        form.setFieldValue("roadWorthStatus", vehicle.roadWorthStatus || "");
        form.setFieldValue("roadWorthStartDate", vehicle.roadWorthStartDate ? new Date(vehicle.roadWorthStartDate).toISOString().split("T")[0] : "");
        form.setFieldValue("roadWorthEndDate", vehicle.roadWorthEndDate ? new Date(vehicle.roadWorthEndDate).toISOString().split("T")[0] : "");
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setFetchError("Failed to load vehicle data. Please try again later.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [data, apiUrl]);

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
          if (!fetchedModels.some((m) => m.name === form.getFieldValue("model"))) {
            form.setFieldValue("model", "");
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
        .finally(() => {
          setIsFetchingModels(false);
        });
    }, 300);

    return () => clearTimeout(debounceFetch);
  }, [selectedBrand, apiUrl, errorAlertShown]);

  const updateFiles = (incomingFiles) => setExtFiles(incomingFiles);
  const onDelete = (id) => setExtFiles(extFiles.filter((x) => x.id !== id));
  const handleSee = (imageSource) => setImageSrc(imageSource);

  if (fetchError) {
    return <div className="text-RhemaRed text-sm">{fetchError}</div>;
  }

  if (isLoading) {
    return <div>Loading vehicle data...</div>;
  }

  return (
    <Dialog.Root open={true} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal container={document.body}>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-10" />
        <Dialog.Content
          className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-2xl mx-auto px-4 z-20 data-[state=open]:animate-[modal-animation-show_600ms] data-[state=closed]:animate-[modal-animation-hide_300ms]"
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
                  <img
                    src="/Media/Taurean IT Logo3-2_vectorized.png"
                    alt="Logo"
                    className="h-20"
                  />
                </span>
              </div>
              <hr className="border border-taureanOrange" />
              <Dialog.Title className="mt-1 mb-5 text-2xl text-center font-bold text-gray-800">
                Update Vehicle
              </Dialog.Title>
              <Dialog.Description className="hidden">
                Update vehicle modal dialog
              </Dialog.Description>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
              >
                <div className="grid gap-y-4">
                  <div className="mb-4">
                    <h3 className="font-medium text-gray-900">Basic Identification Details</h3>
                  </div>
                  <form.Field
                    name="registrationNumber"
                    validatorAdapter={zodValidator()}
                    validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: stringFormat }}
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block text-sm mb-2">
                          Registration Number <span className="text-RhemaRed">*</span>
                        </label>
                        <input
                          type="text"
                          id={field.name}
                          name={field.name}
                          value={field.state.value || ""}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                          placeholder="gr-4321-19"
                          onBlur={field.handleBlur}
                        />
                        {field.state.meta.errors && (
                          <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>
                        )}
                      </div>
                    )}
                  />
                  <form.Field
                    name="vinNumber"
                    validatorAdapter={zodValidator()}
                    validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: stringFormat }}
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block text-sm mb-2">
                          VIN Number <span className="text-RhemaRed">*</span>
                        </label>
                        <input
                          type="text"
                          id={field.name}
                          name={field.name}
                          value={field.state.value || ""}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                          placeholder="jhmcm82633c004352"
                          onBlur={field.handleBlur}
                        />
                        {field.state.meta.errors && (
                          <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>
                        )}
                      </div>
                    )}
                  />
                  <div className="mb-4 mt-6">
                    <h3 className="font-medium text-gray-900">Vehicle Classification</h3>
                  </div>
                  <form.Field
                    name="vehicleType"
                    validatorAdapter={zodValidator()}
                    validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: dropDownFormat }}
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block text-sm mb-2">
                          Vehicle Type <span className="text-RhemaRed">*</span>
                        </label>
                        <select
                          id={field.name}
                          name={field.name}
                          value={field.state.value || ""}
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
                          <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>
                        )}
                      </div>
                    )}
                  />
                  <form.Field
                    name="brand"
                    validatorAdapter={zodValidator()}
                    validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: dropDownFormat }}
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block text-sm mb-2">
                          Brand <span className="text-RhemaRed">*</span>
                        </label>
                        <select
                          id={field.name}
                          name={field.name}
                          value={field.state.value || ""}
                          onChange={(e) => {
                            field.handleChange(e.target.value);
                            setSelectedBrand(e.target.value);
                          }}
                          className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                          onBlur={field.handleBlur}
                          required
                        >
                          <option value="">Select a brand</option>
                          {brands.map((brand) => (
                            <option key={brand._id} value={brand.name}>
                              {brand.name.charAt(0).toUpperCase() + brand.name.slice(1)}
                            </option>
                          ))}
                        </select>
                        {field.state.meta.errors && (
                          <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>
                        )}
                      </div>
                    )}
                  />
                  {selectedBrand && (
                    <form.Field
                      name="model"
                      validatorAdapter={zodValidator()}
                      validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: dropDownFormat }}
                      children={(field) => (
                        <div>
                          <label htmlFor={field.name} className="block text-sm mb-2">
                            Model <span className="text-RhemaRed">*</span>
                          </label>
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
                              <option value="" disabled>
                                Loading models...
                              </option>
                            ) : models.length > 0 ? (
                              models.map((model) => (
                                <option key={model._id} value={model.name}>
                                  {model.name
                                    .split(" ")
                                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                    .join(" ")}
                                </option>
                              ))
                            ) : (
                              <option value="" disabled>
                                No models available
                              </option>
                            )}
                          </select>
                          {field.state.meta.errors && (
                            <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>
                          )}
                        </div>
                      )}
                    />
                  )}
                  <form.Field
                    name="yearOfManufacturing"
                    validatorAdapter={zodValidator()}
                    validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: yearFormat }}
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block text-sm mb-2">
                          Year of Manufacturing <span className="text-RhemaRed">*</span>
                        </label>
                        <input
                          type="number"
                          id={field.name}
                          name={field.name}
                          value={field.state.value || ""}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                          placeholder="2019"
                          onBlur={field.handleBlur}
                        />
                        {field.state.meta.errors && (
                          <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>
                        )}
                      </div>
                    )}
                  />
                  <div className="mb-4 mt-6">
                    <h3 className="font-medium text-gray-900">Technical Specifications</h3>
                  </div>
                  <form.Field
                    name="fuelType"
                    validatorAdapter={zodValidator()}
                    validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: dropDownFormat }}
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block text-sm mb-2">
                          Fuel Type <span className="text-RhemaRed">*</span>
                        </label>
                        <select
                          id={field.name}
                          name={field.name}
                          value={field.state.value || ""}
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
                          <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>
                        )}
                      </div>
                    )}
                  />
                  <form.Field
                    name="transmissionType"
                    validatorAdapter={zodValidator()}
                    validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: dropDownFormat }}
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block text-sm mb-2">
                          Transmission Type <span className="text-RhemaRed">*</span>
                        </label>
                        <select
                          id={field.name}
                          name={field.name}
                          value={field.state.value || ""}
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
                          <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>
                        )}
                      </div>
                    )}
                  />
                  <form.Field
                    name="sittingCapacity"
                    validatorAdapter={zodValidator()}
                    validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: numberFormat }}
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block text-sm mb-2">
                          Sitting Capacity <span className="text-RhemaRed">*</span>
                        </label>
                        <input
                          type="number"
                          id={field.name}
                          name={field.name}
                          value={field.state.value || ""}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                          placeholder="5"
                          onBlur={field.handleBlur}
                        />
                        {field.state.meta.errors && (
                          <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>
                        )}
                      </div>
                    )}
                  />
                  <form.Field
                    name="weight"
                    validatorAdapter={zodValidator()}
                    validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: numberFormat }}
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block text-sm mb-2">
                          Weight <span className="text-RhemaRed">*</span>
                        </label>
                        <input
                          type="number"
                          id={field.name}
                          name={field.name}
                          value={field.state.value || ""}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                          placeholder="1200"
                          onBlur={field.handleBlur}
                        />
                        {field.state.meta.errors && (
                          <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>
                        )}
                      </div>
                    )}
                  />
                  <form.Field
                    name="weightType"
                    validatorAdapter={zodValidator()}
                    validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: dropDownFormat }}
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block text-sm mb-2">
                          Weight Type <span className="text-RhemaRed">*</span>
                        </label>
                        <select
                          id={field.name}
                          name={field.name}
                          value={field.state.value || ""}
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
                          <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>
                        )}
                      </div>
                    )}
                  />
                  <form.Field
                    name="color"
                    validatorAdapter={zodValidator()}
                    validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: stringFormat }}
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block text-sm mb-2">
                          Color
                        </label>
                        <input
                          type="text"
                          id={field.name}
                          name={field.name}
                          value={field.state.value || ""}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                          placeholder="Silver"
                          onBlur={field.handleBlur}
                        />
                        {field.state.meta.errors && (
                          <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>
                        )}
                      </div>
                    )}
                  />
                  <div className="mb-4 mt-6">
                    <h3 className="font-medium text-gray-900">Status and Ownership Details</h3>
                  </div>
                  <form.Field
                    name="status"
                    validatorAdapter={zodValidator()}
                    validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: dropDownFormat }}
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block text-sm mb-2">
                          Status <span className="text-RhemaRed">*</span>
                        </label>
                        <select
                          id={field.name}
                          name={field.name}
                          value={field.state.value || ""}
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
                          <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>
                        )}
                      </div>
                    )}
                  />
                  <form.Field
                    name="ownershipStatus"
                    validatorAdapter={zodValidator()}
                    validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: dropDownFormat }}
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block text-sm mb-2">
                          Ownership Status <span className="text-RhemaRed">*</span>
                        </label>
                        <select
                          id={field.name}
                          name={field.name}
                          value={field.state.value || ""}
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
                          <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>
                        )}
                      </div>
                    )}
                  />
                  <form.Field
                    name="vehicleCondition"
                    validatorAdapter={zodValidator()}
                    validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: dropDownFormat }}
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block text-sm mb-2">
                          Vehicle Condition <span className="text-RhemaRed">*</span>
                        </label>
                        <select
                          id={field.name}
                          name={field.name}
                          value={field.state.value || ""}
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
                          <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>
                        )}
                      </div>
                    )}
                  />
                  <form.Field
                    name="assignedDepartment"
                    validatorAdapter={zodValidator()}
                    validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: dropDownFormat }}
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block text-sm mb-2">
                          Assigned Department
                        </label>
                        <select
                          id={field.name}
                          name={field.name}
                          value={field.state.value || ""}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                          onBlur={field.handleBlur}
                        >
                          <option value="">Select a department</option>
                          {departments.map((dept) => (
                            <option key={dept._id} value={dept._id}>
                              {dept.departmentName.charAt(0).toUpperCase() + dept.departmentName.slice(1)}
                            </option>
                          ))}
                        </select>
                        {field.state.meta.errors && (
                          <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>
                        )}
                      </div>
                    )}
                  />
                  <form.Field
                    name="assignedDriver"
                    validatorAdapter={zodValidator()}
                    validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: dropDownFormat }}
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block text-sm mb-2">
                          Assigned Driver
                        </label>
                        <select
                          id={field.name}
                          name={field.name}
                          value={field.state.value || ""}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                          onBlur={field.handleBlur}
                        >
                          <option value="">Select a driver</option>
                          {drivers.map((driver) => (
                            <option key={driver._id} value={driver._id}>
                              {driver.name}
                            </option>
                          ))}
                        </select>
                        {field.state.meta.errors && (
                          <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>
                        )}
                      </div>
                    )}
                  />
                  <form.Field
                    name="isAvailableForPool"
                    children={(field) => (
                      <div>
                        <label className="block text-sm mb-2">Available for Pool</label>
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
                  <div className="mb-4 mt-6">
                    <h3 className="font-medium text-gray-900">Operational Details</h3>
                  </div>
                  <form.Field
                    name="currentMileage"
                    validatorAdapter={zodValidator()}
                    validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: numberFormat }}
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block text-sm mb-2">
                          Current Mileage
                        </label>
                        <input
                          type="number"
                          id={field.name}
                          name={field.name}
                          value={field.state.value || ""}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                          placeholder="43200"
                          onBlur={field.handleBlur}
                        />
                        {field.state.meta.errors && (
                          <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>
                        )}
                      </div>
                    )}
                  />
                  <form.Field
                    name="purchaseDate"
                    validatorAdapter={zodValidator()}
                    validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: dateFormat }}
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block text-sm mb-2">
                          Purchase Date <span className="text-RhemaRed">*</span>
                        </label>
                        <input
                          type="date"
                          id={field.name}
                          name={field.name}
                          value={field.state.value || ""}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                          onBlur={field.handleBlur}
                        />
                        {field.state.meta.errors && (
                          <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>
                        )}
                      </div>
                    )}
                  />
                  <form.Field
                    name="costOfVehicle"
                    validatorAdapter={zodValidator()}
                    validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: numberFormat }}
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block text-sm mb-2">
                          Cost of Vehicle <span className="text-RhemaRed">*</span>
                        </label>
                        <input
                          type="number"
                          id={field.name}
                          name={field.name}
                          value={field.state.value || ""}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                          placeholder="85000"
                          onBlur={field.handleBlur}
                        />
                        {field.state.meta.errors && (
                          <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>
                        )}
                      </div>
                    )}
                  />
                  <div className="mb-4 mt-6">
                    <h3 className="font-medium text-gray-900">Technical Details</h3>
                  </div>
                  <form.Field
                    name="vehicleDescription"
                    validatorAdapter={zodValidator()}
                    validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: stringFormat }}
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block text-sm mb-2">
                          Vehicle Description
                        </label>
                        <textarea
                          id={field.name}
                          name={field.name}
                          value={field.state.value || ""}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                          placeholder="Compact sedan used for city commutes"
                          onBlur={field.handleBlur}
                          rows="4"
                        />
                        {field.state.meta.errors && (
                          <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>
                        )}
                      </div>
                    )}
                  />
                  <form.Field
                    name="engineDescription"
                    validatorAdapter={zodValidator()}
                    validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: stringFormat }}
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block text-sm mb-2">
                          Engine Description
                        </label>
                        <textarea
                          id={field.name}
                          name={field.name}
                          value={field.state.value || ""}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                          placeholder="1.8L 4-cylinder engine"
                          onBlur={field.handleBlur}
                          rows="4"
                        />
                        {field.state.meta.errors && (
                          <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>
                        )}
                      </div>
                    )}
                  />
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
                  />
                  <div className="mb-4 mt-6">
                    <h3 className="font-medium text-gray-900">Insurance and Compliance Details</h3>
                  </div>
                  <form.Field
                    name="insurance"
                    validatorAdapter={zodValidator()}
                    validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: dropDownFormat }}
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block text-sm mb-2">
                          Insurance
                        </label>
                        <select
                          id={field.name}
                          name={field.name}
                          value={field.state.value || ""}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                          onBlur={field.handleBlur}
                        >
                          <option value="">Select an insurance policy</option>
                          {insurances.map((policy) => (
                            <option key={policy._id} value={policy._id}>
                              {policy.policyNumber}
                            </option>
                          ))}
                        </select>
                        {field.state.meta.errors && (
                          <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>
                        )}
                      </div>
                    )}
                  />
                  <form.Field
                    name="insuranceStatus"
                    validatorAdapter={zodValidator()}
                    validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: dropDownFormat }}
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block text-sm mb-2">
                          Insurance Status
                        </label>
                        <select
                          id={field.name}
                          name={field.name}
                          value={field.state.value || ""}
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
                          <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>
                        )}
                      </div>
                    )}
                  />
                  <form.Field
                    name="insuranceStartDate"
                    validatorAdapter={zodValidator()}
                    validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: dateFormat }}
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block text-sm mb-2">
                          Insurance Start Date
                        </label>
                        <input
                          type="date"
                          id={field.name}
                          name={field.name}
                          value={field.state.value || ""}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                          onBlur={field.handleBlur}
                        />
                        {field.state.meta.errors && (
                          <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>
                        )}
                      </div>
                    )}
                  />
                  <form.Field
                    name="insuranceEndDate"
                    validatorAdapter={zodValidator()}
                    validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: dateFormat }}
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block text-sm mb-2">
                          Insurance End Date
                        </label>
                        <input
                          type="date"
                          id={field.name}
                          name={field.name}
                          value={field.state.value || ""}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                          onBlur={field.handleBlur}
                        />
                        {field.state.meta.errors && (
                          <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>
                        )}
                      </div>
                    )}
                  />
                  <form.Field
                    name="roadWorth"
                    validatorAdapter={zodValidator()}
                    validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: dropDownFormat }}
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block text-sm mb-2">
                          Roadworthiness
                        </label>
                        <select
                          id={field.name}
                          name={field.name}
                          value={field.state.value || ""}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                          onBlur={field.handleBlur}
                        >
                          <option value="">Select a roadworthiness certificate</option>
                          {roadWorths.map((rw) => (
                            <option key={rw._id} value={rw._id}>
                              {rw.certificateNumber}
                            </option>
                          ))}
                        </select>
                        {field.state.meta.errors && (
                          <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>
                        )}
                      </div>
                    )}
                  />
                  <form.Field
                    name="roadWorthStatus"
                    validatorAdapter={zodValidator()}
                    validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: dropDownFormat }}
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block text-sm mb-2">
                          Roadworthiness Status
                        </label>
                        <select
                          id={field.name}
                          name={field.name}
                          value={field.state.value || ""}
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
                          <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>
                        )}
                      </div>
                    )}
                  />
                  <form.Field
                    name="roadWorthStartDate"
                    validatorAdapter={zodValidator()}
                    validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: dateFormat }}
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block text-sm mb-2">
                          Roadworthiness Start Date
                        </label>
                        <input
                          type="date"
                          id={field.name}
                          name={field.name}
                          value={field.state.value || ""}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                          onBlur={field.handleBlur}
                        />
                        {field.state.meta.errors && (
                          <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>
                        )}
                      </div>
                    )}
                  />
                  <form.Field
                    name="roadWorthEndDate"
                    validatorAdapter={zodValidator()}
                    validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: dateFormat }}
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block text-sm mb-2">
                          Roadworthiness End Date
                        </label>
                        <input
                          type="date"
                          id={field.name}
                          name={field.name}
                          value={field.state.value || ""}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-taureanOrange focus:ring-taureanOrange disabled:opacity-50 disabled:pointer-events-none"
                          onBlur={field.handleBlur}
                        />
                        {field.state.meta.errors && (
                          <div className="text-RhemaRed text-sm mt-1">{field.state.meta.errors}</div>
                        )}
                      </div>
                    )}
                  />
                  <form.Subscribe
                    selector={(state) => state.errors}
                    children={(errors) =>
                      errors.length > 0 && (
                        <ErrorMessage title={"Error"} message={errors} />
                      )
                    }
                  />
                </div>
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