const mongoose = require("mongoose"); // Erase if already required
const bcrypt = require("bcrypt");

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        mobile: { type: String, required: true, unique: true },
        role: {
            type: String,
            enum: ["customer", "staff", "manager"],
            default: "customer",
        },
        address: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
        wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
        isBlocked: { type: Boolean, default: false },
        refreshToken: { type: String },
        passwordChangedAt: { type: String },
        passwordResetToken: { type: String },
        passwordResetExpires: { type: String },
    },
    {
        timestamps: true,
    }
);

// Trong model thì ko thể sử dụng arrow function vì nó sẽ không có this
// This function is used to hash the password before saving the user
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = bcrypt.genSaltSync(10);
    this.password = await bcrypt.hashSync(this.password, salt);
});

//Export the model
module.exports = mongoose.model("User", userSchema);
