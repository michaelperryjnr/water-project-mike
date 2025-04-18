import React, { useState, Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import Swal from 'sweetalert2';
import axios from 'axios';
import VehicleSlideOver from '../SlideOver/VehicleSlideOver';
import UpdateVehicleForm from '../Forms/UpdateForms/UpdateVehicleForm';
import AssignDriverForm from '../Forms/UpdateForms/AssignDriverForm';
/* import UpdateStatusForm from '../Forms/UpdateForms/UpdateStatusForm'; */ 

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function VehicleDropdown({ row }) {
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);
  const [isAssignDriverFormOpen, setIsAssignDriverFormOpen] = useState(false);
  const [isUpdateStatusFormOpen, setIsUpdateStatusFormOpen] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;
  const endPointUrl = `${apiUrl}/vehicles`;

  const handleViewDetails = () => {
    setIsSlideOverOpen(true);
  };

  const closeSlideOver = () => {
    setIsSlideOverOpen(false);
  };

  const handleUpdate = () => {
    setIsUpdateFormOpen(true);
  };

  const handleAssignDriver = () => {
    setIsAssignDriverFormOpen(true);
  };

  const handleUpdateStatus = () => {
    setIsUpdateStatusFormOpen(true);
  };

  const alertNotification = Swal.mixin({
    showCancelButton: false,
    showConfirmButton: false,
  });

  const handleDelete = async ({ row, _id }) => {
    try {
      const result = await Swal.fire({
        icon: 'warning',
        title: 'Are you sure you want to delete?',
        text: `This will permanently delete vehicle ${row.registrationNumber || 'ID: ' + _id}.`,
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
      });

      if (result.isConfirmed) {
        const response = await axios.delete(`${endPointUrl}/${_id}`);

        if (response.status === 200) {
          console.log('Deleted:', response.data);

          alertNotification
            .fire({
              icon: 'success',
              title: 'Vehicle deleted successfully',
              timer: 3000,
              text: `Vehicle ${row.registrationNumber || 'ID: ' + _id} has been deleted.`,
            })
            .then(() => {
              window.location.reload();
            });
        } else if (response.status === 404) {
          alertNotification.fire({
            icon: 'error',
            title: 'Error deleting vehicle',
            timer: 3000,
            text: 'Vehicle not found.',
          });
          console.error('Failed to delete, server returned 404:', response.status);
        } else {
          alertNotification.fire({
            icon: 'error',
            title: 'Error deleting vehicle',
            timer: 3000,
            text: 'There was an error deleting the vehicle. Please try again.',
          });
          console.error('Failed to delete, server returned non-200 status:', response.status);
        }
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'There was an error deleting the vehicle, please try again.',
        timer: 3000,
      });
    }
  };

  const handleUnassignDriver = async ({ row, _id }) => {
    try {
      const result = await Swal.fire({
        icon: 'warning',
        title: 'Are you sure you want to unassign the driver?',
        text: `This will unassign the driver from vehicle ${row.registrationNumber || 'ID: ' + _id}.`,
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, unassign!',
        cancelButtonText: 'Cancel',
      });

      if (result.isConfirmed) {
        const response = await axios.delete(`${endPointUrl}/${_id}/driver`);

        if (response.status === 200) {
          console.log('Driver unassigned:', response.data);

          alertNotification
            .fire({
              icon: 'success',
              title: 'Driver unassigned successfully',
              timer: 3000,
              text: `Driver has been unassigned from vehicle ${row.registrationNumber || 'ID: ' + _id}.`,
            })
            .then(() => {
              window.location.reload();
            });
        } else if (response.status === 404) {
          alertNotification.fire({
            icon: 'error',
            title: 'Error unassigning driver',
            timer: 3000,
            text: 'Vehicle not found.',
          });
          console.error('Failed to unassign driver, server returned 404:', response.status);
        } else {
          alertNotification.fire({
            icon: 'error',
            title: 'Error unassigning driver',
            timer: 3000,
            text: 'There was an error unassigning the driver. Please try again.',
          });
          console.error('Failed to unassign driver, server returned non-200 status:', response.status);
        }
      }
    } catch (error) {
      console.error('Error unassigning driver:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'There was an error unassigning the driver, please try again.',
        timer: 3000,
      });
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
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetails();
                    }}
                    className={classNames(
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block px-4 py-2 text-sm w-full text-left'
                    )}
                  >
                    View Details
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
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAssignDriver();
                    }}
                    className={classNames(
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block px-4 py-2 text-sm w-full text-left'
                    )}
                  >
                    Assign Driver
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => handleUnassignDriver({ row, _id: row._id })}
                    className={classNames(
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block px-4 py-2 text-sm w-full text-left'
                    )}
                  >
                    Unassign Driver
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpdateStatus();
                    }}
                    className={classNames(
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block px-4 py-2 text-sm w-full text-left'
                    )}
                  >
                    Update Status
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => handleDelete({ row, _id: row._id })}
                    className={classNames(
                      active ? 'bg-red-100 text-red-900' : 'text-red-700',
                      'block px-4 py-2 text-sm w-full text-left'
                    )}
                  >
                    Delete
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>

      <VehicleSlideOver
        isOpen={isSlideOverOpen}
        onClose={closeSlideOver}
        data={row._id}
      />

      {isUpdateFormOpen && (
        <UpdateVehicleForm
          isOpen={isUpdateFormOpen}
          data={row._id}
          onClose={() => setIsUpdateFormOpen(false)}
        />
      )}

      {isAssignDriverFormOpen && (
        <AssignDriverForm
          data={row._id}
          onClose={() => setIsAssignDriverFormOpen(false)}
        />
      )}

      {isUpdateStatusFormOpen && (
        <UpdateStatusForm
          data={row._id}
          onClose={() => setIsUpdateStatusFormOpen(false)}
        />
      )}
    </>
  );
}