const User = require('../models/User-model');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const Team = require('../models/Team-model');
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD // Replace with an app-specific password for security
    }
});


const generateRandomPassword = () => {
    return crypto.randomBytes(6).toString('hex'); // Generates a 12-character random password
};

// Get All Users
const getUsers = async (req, res) => {
    try {
        // Fetch all users and populate related fields
        const users = await User.find().populate('team tasks');

        // Check if users exist
        if (!users || users.length === 0) {
            return res.status(404).json({ 
                success:false,
                message: "No users found"
             }
            );
        }

        res.status(200).json({
            success:true,
            message: "Users Fetched Successfully",
            data:users
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
            success:false,
             message: "Internal Server Error"
             });
    }
};


// Get User by ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.body;

        // Validate if ID is a valid MongoDB ObjectId
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ 
                success:false,
                message: "Invalid user ID format" 
            });
        }

        // Find user by ID and populate related fields
        const user = await User.findById(id).populate('team tasks');

        // Check if user exists
        if (!user) {
            return res.status(404).json({
                success:false,
                 message: "User not found" 
                });
        }

        res.status(200).json({
            success:true,
            message:"Users Fetched Successfully By Id",
            data:user
        });
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        res.status(500).json({
            success:false,
             message: "Internal Server Error" 
            });
    }
};

// Create New User
// const createUser = async (req, res) => {
//     const { name, email, password, role, team, teamLeader, tasks } = req.body;

//     try {
//         // Check if email already exists
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ message: 'Email already exists' });
//         }

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Create user
//         const user = new User({ 
//             name, 
//             email, 
//             password: hashedPassword, 
//             role, 
//             team, 
//             teamLeader, 
//             tasks 
//         });

//         await user.save();
//         res.status(201).json({ message: 'User created successfully', user });
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };
const createUser = async (req, res) => {
    const { name, email, role, team, phoneNo, teamLeader, tasks } = req.body;

    try {
        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists'
            });
        }

        // Generate a random password
        const generatedPassword = generateRandomPassword();
        const hashedPassword = await bcrypt.hash(generatedPassword, 10);

        // Create user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            phoneNo,
            role,
            team,
            teamLeader,
            tasks
        });

        await user.save();

        // **Add User to the Team's Members Array Automatically**
        if (team) {
            await Team.findByIdAndUpdate(team, { $addToSet: { members: user._id } });
        }

        // Send email with generated password
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Your Account Credentials',
            text: `Hello ${name},\n\nYour account has been created successfully.\nYour login credentials:\nEmail: ${email}\nPassword: ${generatedPassword}\n\nPlease change your password after logging in.\n\nBest regards,\nYour Team`
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({
            success: true,
            message: 'User created successfully. Password sent to email.',
            data: user
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Update User
const updateUser = async (req, res) => {
    try {
        const { id, name, email, phoneNo, password, role, team, teamLeader, tasks } = req.body;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, message: "Invalid user ID format" });
        }

        let user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let hashedPassword = user.password;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // **If team is updated, add user to the team's members array**
        if (team && user.team?.toString() !== team) {
            // Remove the user from their previous team's members array
            if (user.team) {
                await Team.findByIdAndUpdate(user.team, { $pull: { members: id } });
            }
            // Add the user to the new team's members array
            await Team.findByIdAndUpdate(team, { $addToSet: { members: id } });
        }

        user = await User.findByIdAndUpdate(
            id,
            { name, email, password: hashedPassword, role, team, phoneNo, teamLeader, tasks },
            { new: true, runValidators: true }
        ).populate("team tasks");

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: user
        });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};




// Delete User
const deleteUser = async (req, res) => {
    try {
        const { id } = req.body;

        // Validate if ID is a valid MongoDB ObjectId
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ 
                success:false,
                message: "Invalid user ID format" 
            });
        }

        // Find and delete the user
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({
                success:false,
                 message: "User not found" 
                });
        }

        res.status(200).json({ 
            success:true,
            message: "User deleted successfully"
         });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ 
            success:false,
            message: "Internal Server Error" });
    }
};


module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };
