import React from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";

const WizardControls = ({ onBack, onNext, currentStep, totalSteps }) => {
  return (
    <div className="container flex justify-around mt-4 mb-8 gap-x-2">
      {/* Back Button */}
      <button
        onClick={onBack}
        disabled={currentStep === 1}
        className={`w-full mt-2 p-2.5 flex-1 ${
          currentStep === 1
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-taureanOrange text-white hover:bg-taureanLightOrange"
        } outline-none ring-offset-2 ring-taureanLightBlue focus:ring-2 uppercase py-2 px-4 rounded-xl font-semibold`}
      >
        Back
      </button>

      {/* Next/Submit Button */}
      <button
        onClick={currentStep === totalSteps ? () => alert("Submit form!") : onNext}
        disabled={currentStep === totalSteps && false} // Enable submit on last step
        className={`w-full mt-2 p-2.5 flex-1 ${
          currentStep === totalSteps
            ? "bg-taureanOrange text-white hover:bg-taureanLightOrange"
            : "text-gray-800 border hover:bg-gray-100"
        } outline-none ring-offset-2 ring-taureanDeepBlue focus:ring-2 uppercase py-2 px-4 rounded-xl font-semibold`}
      >
        {currentStep === totalSteps ? "Submit" : "Next"}
      </button>
    </div>
  );
};

export default WizardControls;