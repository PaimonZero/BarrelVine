const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var categorySchema = new mongoose.Schema(
    {
        title: { type: String, required: true, unique: true, index: true },
        slug: {type: String, required: true, unique: true}
    },
    {
        timestamps: true,
    }
);

//Export the model
module.exports = mongoose.model('Category', categorySchema);