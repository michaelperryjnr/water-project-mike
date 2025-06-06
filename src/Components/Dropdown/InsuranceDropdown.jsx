import { useState, Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import Swal from 'sweetalert2';
import axios from 'axios';
import DepartmentSlideOver from '../SlideOver/DepartmentSlideOver';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation


function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function InsuranceDropdown({ handleInvoice, handlePreview, row }) {
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;
  const endPointUrl = `${apiUrl}/insurance`;

  const navigate = useNavigate(); // Hook for navigation

  const handleViewDetails = () => {
    setIsSlideOverOpen(true);
  };

  const closeSlideOver = () => {
    setIsSlideOverOpen(false);
  };

  const handleUpdate = () => {
    navigate(`/insurance/edit/${row._id}`); // Navigate to the standalone edit page
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
        text: 'You will not be able to revert this!',
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
              title: 'Insurance deleted successfully',
              timer: 3000,
              text: 'You have successfully deleted an Insurance Policy',
            })
            .then(() => {
              window.location.reload();
            });
        } else if (response.status === 404) {
          alertNotification.fire({
            icon: 'error',
            title: 'Error deleting Insurance',
            timer: 3000,
            text: 'There was an error deleting the Insurance Policy. Policy not found.',
          });
          console.error("Failed to submit, server returned a non-200 status:", response.status);
        } else if (response.status === 500) {
          alertNotification.fire({
            icon: "error",
            title: "Oops!",
            timer: 3000,
            text: "Looks like we have an internal server error, please try again later",
          });
          console.error("Failed to submit, server returned a non-200 status:", response.status);
        }
      }
    } catch (error) {
      console.error("Error deleting position:", error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'There was an error deleting the record, please try again.',
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
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block px-4 py-2 text-sm w-full text-left'
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
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block px-4 py-2 text-sm w-full text-left'
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

      <DepartmentSlideOver
        isOpen={isSlideOverOpen}
        onClose={closeSlideOver}
        data={row}
      />
    </>
  );
}