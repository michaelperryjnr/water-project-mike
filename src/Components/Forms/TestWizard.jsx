import React, { useState } from "react";
import WizardControls from "./WizardControls";
/* import PersonalInfo from "./Steps/PersonalInfo"; // New component for Step 1
import ContactInfo from "./Steps/ContactInfo"; // New component for Step 2
import ReviewSubmit from "./Steps/ReviewSubmit"; */ // New component for Step 10
// Add other step components as needed (e.g., Identification, Employment, etc.)

const TestWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const steps = [
    "Personal Information",
    "Contact Information",
    "Identification",
    "Employment",
    "Probation",
    "Work Preferences",
    "Health",
    "Additional Info",
    "Termination",
    "Review",
  ];

  // Display the step indicator
  const displaySteps = (
    <div>
      <h2 className="sr-only">Steps</h2>

      <div className="relative after:absolute after:inset-x-0 after:top-1/2 after:block after:h-0.5 after:-translate-y-1/2 after:rounded-lg after:bg-gray-100">
        <ol className="relative z-10 flex justify-between text-sm font-medium text-gray-800">
          {steps.map((step, index) => (
            <li
              key={index}
              className="flex items-center gap-2 bg-white p-2"
            >
              <span
                className={`size-6 rounded-full text-center text-[10px]/6 font-bold ${
                  currentStep === index + 1
                    ? "bg-taureanOrange text-white"
                    : "bg-white border border-taureanOrange"
                }`}
              >
                {index + 1}
              </span>
              <span className="hidden sm:block">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );

  // Display the current step's content
  const displayStep = (step) => {
    switch (step) {
      case 1:
        return {/* <PersonalInfo /> */};
      case 2:
        return {/* <ContactInfo /> */};
      case 10:
        return {/* <ReviewSubmit /> */};
      // Add more cases for other steps as needed (e.g., case 3: <Identification />, etc.)
      default:
        return <div>Step {step} content coming soon!</div>;
    }
  };

  // Handle navigation
  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="md:w-1/2 mx-auto shadow-xl rounded-2xl pb-2 bg-white px-2">
      <div className="container mt-5">{displaySteps}</div>
      <div className="container mt-5">{displayStep(currentStep)}</div>
      <WizardControls
        onBack={handleBack}
        onNext={handleNext}
        currentStep={currentStep}
        totalSteps={steps.length}
      />
    </div>
  );
};

export default TestWizard;