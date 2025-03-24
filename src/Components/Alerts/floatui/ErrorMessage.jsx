import React from 'react'
import { BsInfoCircle } from 'react-icons/bs'

function ErrorMessage({title, message}) {
  return (
    <div className="mt-12 mx-4 px-4 rounded-md border-l-4 border-red-500 bg-red-50 md:max-w-2xl md:mx-auto md:px-8">
    <div className="flex justify-between py-3">
        <div className="flex">
            <div>
              <BsInfoCircle className="text-red-500" />
            </div>
            <div className="self-center ml-3">
                <span className="text-red-600 font-semibold">
                    {title}
                </span>
                <p className="text-red-600 mt-1">
                    {message}
                </p>
            </div>
        </div>
    </div>
</div>
  )
}

export default ErrorMessage
