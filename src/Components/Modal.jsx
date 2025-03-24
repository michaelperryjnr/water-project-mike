import React, { useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { BsX, BsPlus } from 'react-icons/bs';
import { useForm } from '@tanstack/react-form';

function Modal({ title, btnName, children, onSubmit }) {
  const formRef = useRef(null);

/*   const handleSubmit = (form) => {
    onSubmit(form);
  };
 */
  const triggerSubmit = () => {
    if (formRef.current) {
      formRef.current.requestSubmit(); // Programmatically submit the form
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger className='text-center py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-taureanOrange text-white hover:bg-taureanLightBlue disabled:opacity-50 disabled:pointer-events-none'>
        Add {btnName}
        <BsPlus size={24} />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75" />

        <Dialog.Content className='fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-lg mx-auto px-4 data-[state=open]:animate-[modal-animation-show_600ms]  data-[state=closed]:animate-[modal-animation-hide_300ms]' aria-labelledby="modal-title" aria-describedby="modal-description">
          <div className='relative flex flex-col bg-white border shadow-sm rounded-xl overflow-hidden'>

            <div className='absolute top-2 end-2'>
              <Dialog.Close className='flex justify-center items-center size-7 text-sm font-semibold rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none'>
                <BsX className='flex-shrink-0 size-8' />
              </Dialog.Close>
            </div>

            <div className='p-4 sm:p-10 overflow-y-auto' style={{ maxHeight: '600px' }}>
              {/* Icon */}
              <div className='text-center'>
                <span className='mb-4 inline-flex justify-center items-center rounded-full'>
                  <img src="/Media/Taurean IT Logo3-2_vectorized.png" alt="Logo" className='h-20' />
                </span>
              </div>
              {/* End of Icon */}

              <hr className='border border-taureanOrange' />

              <Dialog.Title className='mt-1 mb-5 text-2xl text-center font-bold text-gray-800'>
                {title}
              </Dialog.Title>

              <Dialog.Description className='hidden'>
                {title} modal dialog
              </Dialog.Description>

              {/* Form */}
              {children}
              {/* End of Form */}

            </div>

            {/* Buttons */}
            <div className='items-center gap-x-2 mt-3 py-3 px-4 text-sm sm:flex bg-gray-50 border-t'>
              <Dialog.Close className='w-full mt-2 p-2.5 flex-1 text-white bg-taureanOrange rounded-md outline-none ring-offset-2 ring-taureanLightBlue focus:ring-2'>
                Cancel
              </Dialog.Close>

              <button className='w-full mt-2 p-2.5 flex-1 text-gray-800 rounded-md outline-none border ring-offset-2 ring-taureanDeepBlue focus:ring-2' onClick={onsubmit}>
                Save
              </button>
            </div>
            {/* End of Buttons */}

          </div>
        </Dialog.Content>

      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default Modal;