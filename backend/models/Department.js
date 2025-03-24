//modesl/Department.js

const mongoose = require('mongoose')




const departmentSchema = new mongoose.Schema({
    departmentName: { type: String, required: true, unique: true, trim: true },
    departmentDescription: { type: String, required: true, trim: true },
    departmentHead: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: false },
});

//Pre-save hook to convert departmentName and departmentDescription
departmentSchema.pre('save', function(next) {
    if(this.departmentName) {
        this.departmentName = this.departmentName.toLowerCase();
    }
    if(this.departmentDescription) {
        this.departmentDescription = this.departmentDescription.toLowerCase();
    }
    next();
});


//Pre-save hook to convert departmentName and departmentDescription to lowercase during update
departmentSchema.pre('updateOne', { document: true, query: false }, function(next) {
    if(this._update.departmentName) {
        this._update.departmentName = this._update.departmentName.toLowerCase();
    }
    if(this._update.departmentDescription) {
        this._update.departmentDescription = this._update.departmentDescription.toLowerCase();
    }
    next();
});


const Department = mongoose.model('Department', departmentSchema);

module.exports = Department;