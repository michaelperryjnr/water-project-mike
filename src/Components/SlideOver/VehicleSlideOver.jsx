import { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { BsX } from "react-icons/bs";
import axios from "axios";import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// Utility function to capitalize each word in a string
const capitalizeWords = (str) => {
  if (!str || typeof str !== "string") return "N/A";
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

// Utility function to format dates using 'en-GB' locale with full date style
const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "N/A";
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "long" }).format(date);
};

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const backendBaseUrl = apiBaseUrl.replace("/api", "");

export default function VehicleSlideOver({ isOpen, onClose, data }) {
  const [vehicle, setVehicle] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    if (!isOpen || !data) return;

    setIsLoading(true);
    axios
      .get(`${apiBaseUrl}/vehicles/${data}`)
      .then((response) => {
        setVehicle(response.data);
      })
      .catch((error) => {
        console.error("Error fetching vehicle details:", error);
        setFetchError("Failed to load vehicle details. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isOpen, data]);

  if (!isOpen) return null;

  const imageUrls = vehicle?.pictures?.map((pic) => `${backendBaseUrl}${pic}`) || [];

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50 overflow-hidden" onClose={onClose}>
        <div className="absolute inset-0 overflow-hidden">
          <Dialog.Overlay className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

          <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="w-screen max-w-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                  <div className="px-4 py-6 sm:px-6">
                    <div className="flex items-start justify-between">
                      <Dialog.Title className="text-lg font-medium text-gray-900">
                        Vehicle Details
                      </Dialog.Title>
                      <div className="ml-3 h-7 flex items-center">
                        <button
                          type="button"
                          className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-taureanOrange"
                          onClick={onClose}
                        >
                          <span className="sr-only">Close panel</span>
                          <BsX className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-200">
                    <div className="pb-6">
                      <div className="bg-taureanLightBlue h-24 sm:h-20 lg:h-28" />
                      <div className="px-4 sm:px-6">
                        <div className="mt-6">
                          <h3 className="font-bold text-xl text-gray-900 sm:text-2xl">
                            {vehicle?.registrationNumber || "N/A"}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {capitalizeWords(vehicle?.brand?.name)} {capitalizeWords(vehicle?.model)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-5 sm:px-0 sm:py-0">
                      {fetchError ? (
                        <div className="text-RhemaRed text-sm">{fetchError}</div>
                      ) : isLoading ? (
                        <div className="text-gray-600 text-sm">Loading vehicle details...</div>
                      ) : (
                        <dl className="space-y-8 sm:divide-y sm:divide-gray-200 sm:space-y-0">
                            
                          <div className="sm:flex sm:px-6 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                              Pictures
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">
                              {imageUrls.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                  {imageUrls.map((url, index) => (
                                    <img
                                      key={index}
                                      src={url}
                                      alt={`Vehicle image ${index + 1}`}
                                      className="h-20 w-20 object-cover rounded cursor-pointer"
                                      onClick={() => {
                                        setPhotoIndex(index);
                                        setIsLightboxOpen(true);
                                      }}
                                      onError={(e) => console.error("Image failed to load:", e)}
                                    />
                                  ))}
                                </div>
                              ) : (
                                "No images available"
                              )}
                            </dd>
                          </div>
                          <div className="sm:flex sm:px-6 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                              VIN Number
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">
                              {vehicle?.vinNumber || "N/A"}
                            </dd>
                          </div>
                          <div className="sm:flex sm:px-6 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                              Vehicle Type
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">
                              {capitalizeWords(vehicle?.vehicleType)}
                            </dd>
                          </div>
                          <div className="sm:flex sm:px-6 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                              Year of Manufacturing
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">
                              {vehicle?.yearOfManufacturing || "N/A"}
                            </dd>
                          </div>
                          <div className="sm:flex sm:px-6 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                              Fuel Type
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">
                              {capitalizeWords(vehicle?.fuelType)}
                            </dd>
                          </div>
                          <div className="sm:flex sm:px-6 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                              Transmission Type
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">
                              {capitalizeWords(vehicle?.transmissionType)}
                            </dd>
                          </div>
                          <div className="sm:flex sm:px-6 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                              Sitting Capacity
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">
                              {vehicle?.sittingCapacity || "N/A"}
                            </dd>
                          </div>
                          <div className="sm:flex sm:px-6 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                              Weight
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">
                              {vehicle?.weight} {capitalizeWords(vehicle?.weightType)}
                            </dd>
                          </div>
                          <div className="sm:flex sm:px-6 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                              Color
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">
                              {capitalizeWords(vehicle?.color)}
                            </dd>
                          </div>
                          <div className="sm:flex sm:px-6 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                              Status
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">
                              {capitalizeWords(vehicle?.status)}
                            </dd>
                          </div>
                          <div className="sm:flex sm:px-6 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                              Ownership Status
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">
                              {capitalizeWords(vehicle?.ownershipStatus)}
                            </dd>
                          </div>
                          <div className="sm:flex sm:px-6 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                              Vehicle Condition
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">
                              {capitalizeWords(vehicle?.vehicleCondition)}
                            </dd>
                          </div>
                          <div className="sm:flex sm:px-6 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                              Assigned Department
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">
                              {capitalizeWords(vehicle?.assignedDepartment?.departmentName) || "N/A"}
                            </dd>
                          </div>
                          <div className="sm:flex sm:px-6 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                              Assigned Driver
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">
                              {vehicle?.assignedDriver
                                ? `${capitalizeWords(vehicle.assignedDriver.firstName)} ${capitalizeWords(vehicle.assignedDriver.lastName)}`
                                : "N/A"}
                            </dd>
                          </div>
                          <div className="sm:flex sm:px-6 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                              Available for Pool
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">
                              {vehicle?.isAvailableForPool ? "Yes" : "No"}
                            </dd>
                          </div>
                          <div className="sm:flex sm:px-6 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                              Current Mileage
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">
                              {vehicle?.currentMileage || "N/A"}
                            </dd>
                          </div>
                          <div className="sm:flex sm:px-6 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                              Purchase Date
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">
                              {formatDate(vehicle?.purchaseDate)}
                            </dd>
                          </div>
                          <div className="sm:flex sm:px-6 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                              Cost of Vehicle
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">
                              {vehicle?.costOfVehicle || "N/A"}
                            </dd>
                          </div>
                          <div className="sm:flex sm:px-6 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                              Vehicle Description
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">
                              {capitalizeWords(vehicle?.vehicleDescription)}
                            </dd>
                          </div>
                          <div className="sm:flex sm:px-6 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                              Engine Description
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">
                              {capitalizeWords(vehicle?.engineDescription)}
                            </dd>
                          </div>
                          <div className="sm:flex sm:px-6 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                              Insurance
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">
                              {vehicle?.insurance?.policyNumber || "N/A"} | Status: {capitalizeWords(vehicle?.insuranceStatus)} | Start: {formatDate(vehicle?.insuranceStartDate)} | End: {formatDate(vehicle?.insuranceEndDate)}
                            </dd>
                          </div>
                          <div className="sm:flex sm:px-6 sm:py-5">
                            <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">
                              Roadworthiness
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:ml-6 sm:col-span-2">
                              {vehicle?.roadWorth?.certificateNumber || "N/A"} | Status: {capitalizeWords(vehicle?.roadWorthStatus)} | Start: {formatDate(vehicle?.roadWorthStartDate)} | End: {formatDate(vehicle?.roadWorthEndDate)}
                            </dd>
                          </div>
                        </dl>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
        {isLightboxOpen && imageUrls.length > 0 && (
            <Lightbox
                open={isLightboxOpen}
                close={() => setIsLightboxOpen(false)}
                slides={imageUrls.map((url) => ({ src: url }))}
                index={photoIndex}
                on={{
                view: ({ index }) => setPhotoIndex(index),
                }}
            />
        )}
      </Dialog>
    </Transition.Root>
  );
}