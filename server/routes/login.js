const router = require("express").Router();
const Admin = require("../models/admin");
require('dotenv').config()
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {
    const { userid, password } = req.body;
    try {
        const admin = await Admin.findOne({
            $or: [
                { email: userid }, isNaN(userid) ? {} : { phone: Number(userid) }
            ]
          });
          if (!admin) {
            return res.status(200).json({ message: 'Admin not found' });
          }

        const isPasswordCorrect = bcrypt.compareSync(password, admin.password);
        if (!isPasswordCorrect) {
            return res.status(200).json({ message: "Incorrect password" });
        }
        if (admin.status === 'blocked') {
            return res.status(200).json({message: 'Your account is blocked' });
          }

        // If sign-in is successful, return user data (excluding password)
        const token = jwt.sign(
            { id: admin._id, email: admin.email, role:admin.role }, // Payload
            process.env.JWT_SECRET,               // Secret key
            { expiresIn: process.env.JWT_EXPIRATION }  // Token expiration time
        );
        res.cookie('adminToken', token, {
            httpOnly: true, // Prevent access by JavaScript
            secure: process.env.NODE_ENV === 'production', // Send only over HTTPS
            sameSite: 'Lax', // CSRF protection
            maxAge: 12 * 60 * 60 * 1000, // 1 hour in milliseconds
            path:'/'
        });
        return res.status(200).json({token});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('adminToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        path:'/'
    });
    res.status(200).json({ message: 'Logout successful' });
});

module.exports = router;