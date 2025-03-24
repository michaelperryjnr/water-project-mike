//models/Employee.js

const mongoose = require('mongoose');

/* const logger = require('logger');  // hypothetical logging library

employeeSchema.pre('save', function (next) {
    if (this.confirmed && this.isModified('confirmed')) {
        logger.log(`Employee ${this.staffNumber} confirmed on ${new Date()}`);
    }
    next();
}); */

// Validations for some fields with preset values
const VALID_TITLES = ['mr.', 'mrs.', 'ms.', 'dr.', 'prof.']; // Acceptable titles
const VALID_MARITAL_STATUSES = ['single', 'married', 'divorced', 'widowed']; // Marital status options
const VALID_GENDERS = ['male', 'female']; // Gender options
const VALID_BLOOD_GROUPS = ['a+', 'a-', 'b+', 'b-', 'ab+', 'ab-', 'o+', 'o-']; // Blood group options
const VALID_TOBACCO_USAGE = ['yes', 'no']; // Whether the employee uses tobacco
const VALID_WORK_AT_HOME = ['yes', 'no']; // Whether the employee works from home
const VALID_OVERTIME_ELIGIBLE = ['yes', 'no']; // Whether the employee is eligible for overtime
const VALID_PROBATION_UNIT = ['days', 'weeks', 'months']; // Time unit for probation period
const VALID_BASE_CURRENCIES = ['USD', 'GHS', 'EUR', 'GBP', 'NGN']; // Base currency options

// Employee schema definition
const employeeSchema = new mongoose.Schema({
    staffNumber: { type: String, unique: true, required: false }, // Unique identifier for the employee
    title: { type: String, enum: VALID_TITLES, required: true }, // The title of the employee (e.g., Mr., Mrs., etc.)
    firstName: { type: String, required: true }, // Employee's first name
    middleName: { type: String }, // Employee's middle name
    lastName: { type: String, required: true }, // Employee's last name
    DOB: { type: Date, required: true }, // Date of birth
    nextOfKin: { type: mongoose.Schema.Types.ObjectId, ref: 'NextOfKin' }, // Reference to the next of kin (relation to employee)
    mobilePhone: { type: String, minlength: 10, maxlength: 18, required: true }, // Employee's mobile number
    homePhone: { type: String, minlength: 10, maxlength: 18 }, // Employee's home phone number
    workPhone: { type: String, minlength: 10, maxlength: 18 }, // Employee's work phone number
    email: { type: String, required: true, unique: true }, // Unique email address
    position: { type: mongoose.Schema.Types.ObjectId, ref: 'Position' }, // Employee's position in the company (refers to Position model)
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' }, // Department the employee belongs to (refers to Department model)
    nationalID: { type: String, required: true }, // National identification number
    maritalStatus: { type: String, enum: VALID_MARITAL_STATUSES, required: true }, // Marital status of the employee
    nationality: { type: mongoose.Schema.Types.ObjectId, ref: 'Nationality', required: true }, // Nationality of the employee (refers to Nationality model)
    country: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: true }, // Country of the employee (refers to Country model)
    bloodGroup: { type: String, enum: VALID_BLOOD_GROUPS }, // Blood group of the employee
    usesTobacco: { type: String, enum: VALID_TOBACCO_USAGE }, // Whether the employee uses tobacco
    physicalAddress: { type: String }, // Physical address of the employee
    digitalAddress: { type: String }, // Digital address (e.g., post box)
    picture: { type: String }, // URL or path to the employee's picture
    salary: { type: Number, required: true }, // Employee's salary
    gender: { type: String, enum: VALID_GENDERS, required: true }, // Gender of the employee
    isFullTime: { type: Boolean, required: true }, // Whether the employee is full-time or not
    dateEmployed: { type: Date, default: Date.now }, // The date when the employee was employed or when the employee details were captured
    contractType: { type: mongoose.Schema.Types.ObjectId, ref: 'ContractType', required: true }, // Type of contract (refers to ContractType model)
    confirmed: { type: Boolean, default: false }, // Whether the employee's employment is confirmed
    confirmationDate: { type: Date }, // The date when the employee was confirmed
    workAtHome: { type: String, enum: VALID_WORK_AT_HOME }, // Whether the employee works from home
    overTimeEligible: { type: String, enum: VALID_OVERTIME_ELIGIBLE }, // Whether the employee is eligible for overtime
    probationStarted: { type: Boolean, default: false }, // Indicates if probation has started
    probationStart: { type: Date }, // Start date for the probation period
    probationEnd: { type: Date }, // End date for the probation period
    probationPeriod: { type: Number }, // Duration of probation period
    probationUnit: { type: String, enum: VALID_PROBATION_UNIT }, // Unit of the probation period (Days, Weeks, Months)
    comments: { type: String }, // Additional comments or notes about the employee
    baseCurrency: { type: String, required: true, enum: VALID_BASE_CURRENCIES }, // Currency used for the employee's salary
    terminated: { type: Boolean, default: false }, // Indicates whether the employee has been terminated
    terminationDate: { type: Date }, // Date of termination, if applicable
}, { timestamps: true }); // Automatically adds `createdAt` and `updatedAt`

// Pre-save hook to generate employee ID based on companyName
/* employeeSchema.pre('save', function (next) {
    if (!this.staffNumber) {
        // Generate the staff number with a random 5-digit number
        this.staffNumber = `EMP-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
    }
    next(); // Move to the next middleware
}); */

/* employeeSchema.pre('save', function (next) {
    if (!this.staffNumber) {
        if (this.companyName) {
            // Create abbreviation based on company name
            const abbreviation = this.companyName
                .split(' ') // Split the name into words
                .map(word => word[0]) // Take the first letter of each word
                .join('') // Join them together
                .toUpperCase() // Ensure uppercase
                .slice(0, 3); // Limit to first 3 characters

            // Generate the staff number
            this.staffNumber = `${abbreviation}-EMP-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
        } else {
            // Fallback if companyName is not provided
            this.staffNumber = `EMP-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
        }
    }
    next();
}); */

// Pre-save hook to ensure confirmation date, termination date is valid
/* employeeSchema.pre('save', function (next) {
    // Validate confirmation date after probation period
    if (this.confirmed && this.confirmationDate && this.probationEnd) {
        if (new Date(this.confirmationDate) < new Date(this.probationEnd)) {
            const error = new Error('Confirmation date must be after the probation period end date.');
            return next(error);
        }
    }

    // Confirm that probation start date is set if probationStarted is true
    if (this.probationStarted && !this.probationStart) {
        const error = new Error('Probation start date must be set if probation has started.');
        return next(error);
    }

    // Validate that probation end date makes sense if provided
    if (this.probationStartDate && this.probationEnd && new Date(this.probationStart) > new Date(this.probationEnd)) {
        const error = new Error('Probation end date cannot be before probation start date.');
        return next(error);
    }

    // Validate termination date if terminated is true
    if (this.terminated && !this.terminatedDate) {
        const error = new Error('Termination date is required if terminated is set to true.');
        return next(error);
    }

    // Validate dateEmployed is not after confirmationDate
    if (this.confirmationDate && new Date(this.dateEmployed) > new Date(this.confirmationDate)) {
        const error = new Error('Date employed cannot be after the confirmation date.');
        return next(error);  // Throws error if validation fails
    }

    next();
});
 */

//Pre-save hook to generate employee ID and to automatically handle probationStart, probationEnd, confirmationDate, terminationDate based on boolean flags
/* employeeSchema.pre('save', async function (next) {
  try {
    // Auto-generate staff number if not set
    if (!this.staffNumber) {
      const count = await mongoose.model('Employee').countDocuments();
      this.staffNumber = `EMP-${String(count + 1).padStart(5, '0')}`; // e.g., EMP-00001, EMP-00002, etc.
    }

    // Handle confirmationDate
    if (this.confirmed && !this.confirmationDate) {
      this.confirmationDate = new Date();
    }

    // Handle probationStart and probationEnd dates
    if (this.probationStarted && !this.probationStart) {
      this.probationStart = new Date();
    }

    if (
      this.probationStarted &&
      this.probationStart &&
      !this.probationEnd &&
      this.probationPeriod &&
      this.probationUnit
    ) {
      let probationEndDate = new Date(this.probationStart);
      if (this.probationUnit === 'days') {
        probationEndDate.setDate(probationEndDate.getDate() + this.probationPeriod);
      } else if (this.probationUnit === 'weeks') {
        probationEndDate.setDate(probationEndDate.getDate() + this.probationPeriod * 7);
      } else if (this.probationUnit === 'months') {
        probationEndDate.setMonth(probationEndDate.getMonth() + this.probationPeriod);
      }
      this.probationEnd = probationEndDate;
    }

    // Handle terminationDate
    if (this.terminated && !this.terminationDate) {
      this.terminationDate = new Date();
    }

    // Ensure that dateEmployed is not after confirmationDate
    if (this.confirmationDate && new Date(this.dateEmployed) > new Date(this.confirmationDate)) {
      const error = new Error('Date employed cannot be after the confirmation date.');
      return next(error);
    }

    next();
  } catch (error) {
    next(error);
  }
}); */

employeeSchema.pre('save', async function (next) {
    try {
      // Auto-generate staff number if not set
      if (!this.staffNumber) {
        const count = await mongoose.model('Employee').countDocuments();
        this.staffNumber = `EMP-${String(count + 1).padStart(5, '0')}`; // e.g., EMP-00001, EMP-00002, etc.
      }
  
      // Handle confirmationDate
      if (this.confirmed && !this.confirmationDate) {
        this.confirmationDate = new Date();
      }
  
      // Handle probationStart and probationEnd dates
      if (this.probationStarted && !this.probationStart) {
        this.probationStart = new Date();
      }
  
      if (
        this.probationStarted &&
        this.probationStart &&
        !this.probationEnd &&
        this.probationPeriod &&
        this.probationUnit
      ) {
        let probationEndDate = new Date(this.probationStart);
        if (this.probationUnit === 'days') {
          probationEndDate.setDate(probationEndDate.getDate() + this.probationPeriod);
        } else if (this.probationUnit === 'weeks') {
          probationEndDate.setDate(probationEndDate.getDate() + this.probationPeriod * 7);
        } else if (this.probationUnit === 'months') {
          probationEndDate.setMonth(probationEndDate.getMonth() + this.probationPeriod);
        }
        this.probationEnd = probationEndDate;
      }
  
      // Handle terminationDate
      if (this.terminated && !this.terminationDate) {
        this.terminationDate = new Date();
      }
  
      // Ensure that dateEmployed is not after confirmationDate
      if (this.confirmationDate && new Date(this.dateEmployed) > new Date(this.confirmationDate)) {
        const error = new Error('Date employed cannot be after the confirmation date.');
        return next(error);
      }
  
      next();
    } catch (error) {
      next(error);
    }
  });


// Pre-update hook to handle automatic date assignments when updating
employeeSchema.pre('findOneAndUpdate', function (next) {
    const updateData = this._update; // The update data being applied

    // Handle confirmationDate
    if (updateData.confirmed && !updateData.confirmationDate) {
        updateData.confirmationDate = new Date(); // Automatically set confirmation date if confirmed is true
    }

    // Handle probationStart and probationEnd dates
    if (updateData.probationStarted && !updateData.probationStart) {
        updateData.probationStart = new Date(); // Automatically set probation start date if probationStarted is true
    }

    if (updateData.probationStarted && updateData.probationStart && !updateData.probationEnd && updateData.probationPeriod && updateData.probationUnit) {
        let probationEndDate = new Date(updateData.probationStart);
        if (updateData.probationUnit === 'days') {
            probationEndDate.setDate(probationEndDate.getDate() + updateData.probationPeriod);
        } else if (updateData.probationUnit === 'weeks') {
            probationEndDate.setDate(probationEndDate.getDate() + updateData.probationPeriod * 7);
        } else if (updateData.probationUnit === 'months') {
            probationEndDate.setMonth(probationEndDate.getMonth() + updateData.probationPeriod);
        }
        updateData.probationEnd = probationEndDate;
    }

    // Handle terminationDate
    if (updateData.terminated && !updateData.terminationDate) {
        updateData.terminationDate = new Date(); // Automatically set termination date if terminated is true
    }

    // Ensure that dateEmployed is not after confirmationDate
    if (updateData.confirmationDate && new Date(updateData.dateEmployed) > new Date(updateData.confirmationDate)) {
        const error = new Error('Date employed cannot be after the confirmation date.');
        return next(error); // Throws error if validation fails
    }

    next(); // Move to the next middleware
});



// Pre-save hook to convert fields to lowercase
employeeSchema.pre('save', function (next) {
    if (this.firstName) {
        this.firstName = this.firstName.toLowerCase();
    }
    if (this.middleName) {
        this.middleName = this.middleName.toLowerCase();
    }
    if (this.lastName) {
        this.lastName = this.lastName.toLowerCase();
    }
    if (this.email) {
        this.email = this.email.toLowerCase();
    }
    if (this.mobilePhone) {
        this.mobilePhone = this.mobilePhone.toLowerCase();
    }
    if (this.homePhone) {
        this.homePhone = this.homePhone.toLowerCase();
    }
    if (this.workPhone) {
        this.workPhone = this.workPhone.toLowerCase();
    }
    if (this.physicalAddress) {
        this.physicalAddress = this.physicalAddress.toLowerCase();
    }
    if (this.digitalAddress) {
        this.digitalAddress = this.digitalAddress.toLowerCase();
    }
    if (this.comments) {
        this.comments = this.comments.toLowerCase();
    }
    next();
});

// Pre-update hook to convert fields to lowercase during updates
employeeSchema.pre('update', function (next) {
    if (this._update.firstName) {
        this._update.firstName = this._update.firstName.toLowerCase();
    }
    if (this._update.middleName) {
        this._update.middleName = this._update.middleName.toLowerCase();
    }
    if (this._update.lastName) {
        this._update.lastName = this._update.lastName.toLowerCase();
    }
    if (this._update.email) {
        this._update.email = this._update.email.toLowerCase();
    }
    if (this._update.mobilePhone) {
        this._update.mobilePhone = this._update.mobilePhone.toLowerCase();
    }
    if (this._update.homePhone) {
        this._update.homePhone = this._update.homePhone.toLowerCase();
    }
    if (this._update.workPhone) {
        this._update.workPhone = this._update.workPhone.toLowerCase();
    }
    if (this._update.physicalAddress) {
        this._update.physicalAddress = this._update.physicalAddress.toLowerCase();
    }
    if (this._update.digitalAddress) {
        this._update.digitalAddress = this._update.digitalAddress.toLowerCase();
    }
    if (this._update.comments) {
        this._update.comments = this._update.comments.toLowerCase();
    }
    next();
});


const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
