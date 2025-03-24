import React, { useState, Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import EmployeeSlideOver from "../SlideOver/EmployeeSlideOver"; // Import the SlideOver component
import Swal from "sweetalert2";
import axios from "axios";
import UpdateEmployeesForm from "../Forms/UpdateForms/UpdateEmployeesForm";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function EmployeeDropdown({ handleInvoice, handlePreview, row,}) {
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;
  const endPointUrl = `${apiUrl}/employees`;

  const handleViewDetails = () => {
    setIsSlideOverOpen(true);
  };

  const closeSlideOver = () => {
    setIsSlideOverOpen(false);
  };

  const handleUpdate = () => {
    setIsUpdateFormOpen(true);
  };

  const alertNotification = Swal.mixin({
    showCancelButton: false,
    showConfirmButton: false,
  });

  const handleDelete = async ({ row, _id }) => {
    try {
      const result = await Swal.fire({
        icon: "warning",
        title: "Are you sure you want to delete?",
        text: "You will not be able to revert this!",
        showCancelButton: true,
        confirmButtonColor: "#d33", // Custom red color for the confirm button
        cancelButtonColor: "#3085d6", // Custom blue color for the cancel button
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        const response = await axios.delete(`${endPointUrl}/${_id}`);

        if (response.status === 200) {
          console.log("Deleted:", response.data);

          alertNotification
            .fire({
              icon: "success",
              title: "Employee deleted successfully",
              timer: 3000,
              text: "You have successfully deleted an employee",
            })
            .then(() => {
              // Reload the page after the notification is closed
              window.location.reload();
            });

          if (response.status === 404) {
            alertNotification.fire({
              icon: "error",
              title: "Error deleting employee",
              timer: 3000,
              text: "There was an error deleting a employee. Employee not found.",
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
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "There was an error deleting the record, please try again.",
        timer: 3000,
      });
      console.error(_id);
      console.log(row);
      console.log(row._id);
      console.log(`${endPointUrl}/${_id}`);
    }
  };

  return (
    <>
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="rounded-full flex items-center text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-taureanOrange">
            <span className="sr-only">Actions</span>
            <BsThreeDotsVertical className="h-5 w-5" aria-hidden="true" />
          </Menu.Button>
        </div>

        <Transition as={Fragment}>
          <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white z-20 ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => handleInvoice(row)}
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm w-full text-left"
                    )}
                  >
                    Download
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => handlePreview(row)}
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm w-full text-left"
                    )}
                  >
                    Preview
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent the event from bubbling up
                      handleViewDetails(); // Open the slide-over
                    }}
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block px-4 py-2 text-sm w-full text-left"
                    )}
                  >
                    View Details
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => handleDelete(row)} //Handle delete button click
                    className={classNames(
                      active ? "bg-red-100 text-red-900" : "text-red-700",
                      "block px-4 py-2 text-sm w-full text-left"
                    )}
                  >
                    Delete
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
              {({ active }) => (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpdate();
                    }}
                    className={classNames(
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block px-4 py-2 text-sm w-full text-left'
                    )}
                  >
                    Edit
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>

      <EmployeeSlideOver
        isOpen={isSlideOverOpen}
        onClose={closeSlideOver}
        data={row} // Pass the row data to the slide-over
      />

      {isUpdateFormOpen && (
        <UpdateEmployeesForm
         data={row}
         onClose={() => setIsUpdateFormOpen(false)}
         />
      )}
    </>
  );
}
