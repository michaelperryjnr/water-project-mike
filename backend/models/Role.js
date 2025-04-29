const mongoose = require("mongoose")

const roleSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    description: {type: String},
    permissions: {type: [String], default: []},
    isActive: {type: Boolean, default: true},
}, {timestamps: true})


roleSchema.pre("save", function(next){
    if (this.name) {
        this.name = this.name.trim().toLowerCase()
    }

    if (this.description) {{
        this.description = this.description.toLowerCase()
    }}

    if (this.permissions && Array.isArray(this.permissions)) {
        this.permissions = this.permissions.map(permission => permission.trim().toLowerCase())
    }

    next()
})


roleSchema.pre("findOneAndUpdate", function(next) {
    if (this._update.name) {
        this._update.name = this._update.name.trim().toLowerCase()
    }

    if (this._update.description) {
        this._update.description = this._update.description.toLowerCase()
    }

    if (this._update.permissions && Array.isArray(this._update.permissions)) {
        this._update.permissions = this._update.permissions.map(permission => permission.trim().toLowerCase())
    }

    next()
})

const Role = mongoose.model("Role", roleSchema)

module.exports = Role;