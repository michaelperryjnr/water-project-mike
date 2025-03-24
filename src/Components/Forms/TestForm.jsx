/* import React, { useRef } from "react"; */
import * as Dialog from "@radix-ui/react-dialog";
import { useForm } from "@tanstack/react-form";
import axios from "axios";
import { BsX, BsPlus } from "react-icons/bs";

function TestForm({ title, btnName }) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const nextOfKinUrl = `${apiUrl}/nextofkin`;

  const form = useForm({
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      mobileNumber: "",
      email: "",
      physicalAddress: "",
      digitalAddress: "",
      relationship: "",
      gender: "",
    },
    onSubmit: async (value) => {
      try {
        const response = await axios.post(nextOfKinUrl, value);
        if (onSubmit) {
          onSubmit(response.data); // Send data back to parent
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
  });

  return (
    <Dialog.Root>
      <Dialog.Trigger
        className="text-center py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-RhemaRed text-white hover:bg-black disabled:opacity-50 disabled:pointer-events-none"
        aria-describedby="modal-description"
      >
        Add {btnName}
        <BsPlus size={24} />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75" />

        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-lg mx-auto px-4 data-[state=open]:animate-[modal-animation-show_600ms]  data-[state=closed]:animate-[modal-animation-hide_300ms]">
          <div className="relative flex flex-col bg-white border shadow-sm rounded-xl overflow-hidden">
            <div className="absolute top-2 end-2">
              <Dialog.Close className="flex justify-center items-center size-7 text-sm font-semibold rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none">
                <BsX className="flex-shrink-0 size-8" />
              </Dialog.Close>
            </div>

            <div
              className="p-4 sm:p-10 overflow-y-auto"
              style={{ maxHeight: "600px" }}
            >
              {/* Icon */}
              <div className="text-center">
                <span className="mb-4 inline-flex justify-center items-center rounded-full">
                  <img
                    src="/Media/Taurean IT Logo3-2_vectorized.png"
                    alt="Logo"
                    className="h-20"
                  />
                </span>
              </div>
              {/* End of Icon */}

              <hr className="border border-RhemaRed" />

              <Dialog.Title className="mt-1 mb-5 text-2xl text-center font-bold text-gray-800">
                {title}
              </Dialog.Title>

              <Dialog.Description className="hidden">
                {title} modal dialog
              </Dialog.Description>

              {/* Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <div className="grid gap-y-4">
                  {/* Form Group */}
                  <form.Field
                    name="firstName"
                    children={(field) => (
                      <div>
                        <label className="block text-sm mb-2">Input Field One</label>
                        <div className="relative">
                          <input
                            name="firstName"
                            value={form.state.values.firstName}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-RhemaRed focus:ring-RhemaRed disabled:opacity-50 disabled:pointer-events-none"
                            placeholder="Input Field One"
                            type="text"
                          />
                        </div>
                      </div>
                    )}
                  />
                  {/* End Form Group */}
                </div>
              </form>
              {/* End of Form */}
            </div>

            {/* Buttons */}
            <div className="items-center gap-x-2 mt-3 py-3 px-4 text-sm sm:flex bg-gray-50 border-t">
              <Dialog.Close className="w-full mt-2 p-2.5 flex-1 text-white bg-RhemaRed rounded-md outline-none ring-offset-2 ring-RhemaRed focus:ring-2">
                Cancel
              </Dialog.Close>

              <button className="w-full mt-2 p-2.5 flex-1 text-gray-800 rounded-md outline-none border ring-offset-2 ring-black focus:ring-2" onClick={form.handleSubmit}>
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

export default TestForm;
