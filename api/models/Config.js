const mongoose = require('mongoose');

const configSchema = new mongoose.Schema(
    {
        configId: {
            type:     String,
            required: true,
            unique:   true,
            index:    true,
        },
        contactData: {
            email:   { type: String, required: true },
            name:    { type: String, required: true },
            company: { type: String, default: '' },
            phone:   { type: String, default: '' },
            message: { type: String, default: '' },
        },
        configData: {
            modules:   { type: Array,  default: [] },
            workspace: {
                width:  { type: Number, default: 4 },
                depth:  { type: Number, default: 6 },
                height: { type: Number, default: 2.4 },
            },
        },
        status: {
            type:    String,
            enum:    ['draft', 'submitted', 'quoted', 'ordered'],
            default: 'submitted',
        },
    },
    {
        // Voegt createdAt en updatedAt automatisch toe
        timestamps: true,
    }
);

module.exports = mongoose.model('Config', configSchema);
