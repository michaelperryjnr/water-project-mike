import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useForm } from "@tanstack/react-form";
import axios from "axios";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-form-adapter";
import Swal from "sweetalert2";
import { BsX } from "react-icons/bs";
import ErrorMessage from "../../Alerts/floatui/ErrorMessage";

export default function AssignDriverForm({ data, onClose }) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const endPointUrl = data ? `${apiUrl}/vehicles/${data}` : null;

  const [drivers, setDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const dropDownFormat = z.string().refine((value) => value !== "", "Please select a driver");

  const alertNotification = Swal.mixin({
    showConfirmButton: false,
    showCancelButton: false,
  });

  const form = useForm({
    defaultValues: {
      assignedDriver: "",
    },
    validators: {
      onSubmit: ({ value }) => {
        if (!value.assignedDriver) {
          return "Please select a driver";
        }
        if (!data) {
          return "Cannot assign driver: No vehicle ID provided.";
        }
      },
    },
    onSubmit: async ({ value }) => {
      if (!endPointUrl) {
        alertNotification.fire({
          icon: "error",
          title: "Assignment Failed",
          timer: 3000,
          text: "No vehicle ID provided.",
        });
        return;
      }
      try {
        const response = await axios.put(endPointUrl, { assignedDriver: value.assignedDriver });
        if (response.status === 200) {
          await alertNotification.fire({
            icon: "success",
            title: "Driver Assigned",
            timer: 3000,
            text: "Driver has been successfully assigned to the vehicle",
          });
          form.reset();
          onClose();
        }
      } catch (error) {
        console.error("Error assigning driver:", error);
        let message = "An unexpected error occurred.";
        if (error.response) {
          const { status, data } = error.response;
          message = data.message || message;
          if (status === 400) {
            message = "Invalid driver selection.";
          } else if (status === 404) {
            message = "Vehicle not found.";
          } else if (status === 500) {
            message = "Server error, please try again later.";
          }
        }
        alertNotification.fire({
          icon: "error",
          title: "Assignment Failed",
          timer: 3000,
          text: message,
        });
      }
    },
  });

  useEffect(() => {
    console.log("AssignDriverForm received data:", data);
    if (!data) {
      setFetchError("No vehicle ID provided. Please select a vehicle from the table.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const controller = new AbortController();

    axios
      .get(`${apiUrl}/employees`, { signal: controller.signal })
      .then((response) => {
        console.log("Drivers API response:", response.data);
        const fetchedDrivers = Array.isArray(response.data)
          ? response.data.map((driver) => ({
              _id: driver._id,
              name: `${driver.firstName || ""} ${driver.lastName || ""}`.trim() || "Unnamed Driver",
            }))
          : [];
        console.log("Setting drivers:", fetchedDrivers);
        setDrivers(fetchedDrivers);
        if (fetchedDrivers.length === 0) {
          setFetchError("No drivers found in the system.");
        } else {
          setFetchError(null);
        }
      })
      .catch((error) => {
        if (error.name === "AbortError") {
          console.log("Fetch aborted, likely due to component unmount or timeout");
          return;
        }
        console.error("Error fetching drivers:", {
          message: error.message,
          code: error.code,
          response: error.response?.data,
        });
        setFetchError(error.response?.data?.message || "Failed to load drivers. Please try again.");
      })
      .finally(() => {
        console.log("Fetch complete, setting isLoading to false");
        setIsLoading(false);
      });

    return () => {
      console.log("Cleaning up useEffect, aborting fetch");
      controller.abort();
    };
  }, [data, apiUrl]);

  if (fetchError) {
    return (
      <Dialog.Root open={true} onOpenChange={(open) => !open && onClose()}>
        <Dialog.Portal container={document.body}>
          <Dialog.Overlay style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 10 }} />
          <Dialog.Content
            className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-md mx-auto px-4 z-20 data-[state=open]:animate-[modal-animation-show_600ms] data-[state=closed]:animate-[modal-animation-hide_300ms]"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            <div className="relative flex flex-col bg-white border shadow-sm rounded-xl overflow-hidden">
              <div className="absolute top-2 end-2">
                <Dialog.Close className="flex justify-center items-center size-7 text-sm font-semibold rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none">
                  <BsX className="flex-shrink-0 size-8" />
                </Dialog.Close>
              </div>
              <div className="p-4 sm:p-6 overflow-y-auto">
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
                <div className="text-RhemaRed text-sm text-center">{fetchError}</div>
                <div className="mt-4 text-center">
                  <Dialog.Close className="p-2.5 text-white bg-taureanOrange rounded-md">
                    Close
                  </Dialog.Close>
                </div>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  }

  if (isLoading) {
    return (
      <Dialog.Root open={true} onOpenChange={(open) => !open && onClose()}>
        <Dialog.Portal container={document.body}>
          <Dialog.Overlay style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 10 }} />
          <Dialog.Content
            className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-md mx-auto px-4 z-20 data-[state=open]:animate-[modal-animation-show_600ms] data-[state=closed]:animate-[modal-animation-hide_300ms]"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            <div className="relative flex flex-col bg-white border shadow-sm rounded-xl overflow-hidden">
              <div className="p-4 sm:p-6 overflow-y-auto">
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
                <div className="text-gray-800 text-sm text-center">Loading drivers...</div>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  }

  return (
    <Dialog.Root open={true} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal container={document.body}>
        <Dialog.Overlay style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 10 }} />
        <Dialog.Content
          className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-md mx-auto px-4 z-20 data-[state=open]:animate-[modal-animation-show_600ms] data-[state=closed]:animate-[modal-animation-hide_300ms]"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <div className="relative flex flex-col bg-white border shadow-sm rounded-xl overflow-hidden">
            <div className="absolute top-2 end-2">
              <Dialog.Close className="flex justify-center items-center size-7 text-sm font-semibold rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none">
                <BsX className="flex-shrink-0 size-8" />
              </Dialog.Close>
            </div>
            <div className="p-4 sm:p-6 overflow-y-auto" style={{ maxHeight: "400px" }}>
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
                Assign Driver
              </Dialog.Title>
              <Dialog.Description className="hidden">
                Assign driver modal dialog
              </Dialog.Description>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
              >
                <div className="grid gap-y-4">
                  <form.Field
                    name="assignedDriver"
                    validatorAdapter={zodValidator()}
                    validators={{ onChangeAsyncDebounceMs: 500, onChangeAsync: dropDownFormat }}
                    children={(field) => (
                      <div>
                        <label htmlFor={field.name} className="block text-sm mb-2">
                          Select Driver <span className="text-RhemaRed">*</span>
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