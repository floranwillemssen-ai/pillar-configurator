const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema(
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
            enum:    ['new', 'reviewing', 'approved', 'sent'],
            default: 'new',
        },
        adminNotes: {
            type:    String,
            default: '',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Quote', quoteSchema);
