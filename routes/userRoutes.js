const express = require('express');
const mongoose = require('mongoose');
const { getUsers, getUserById, createUser, updateUser, deleteUser,getTasksbyUser } = require('../controllers/userController');
const router = express.Router();
const User = require('../models/User-model');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');
const { createQuery, addReply, updateQueryStatus, fetchQueriesByEmployee, fetchQueriesByTeam, fetchAllQueries, fetchCompleteQueryDetails } = require('../controllers/queryController');
const { createAnnouncement, fetchAnnouncementsByTeam, fetchAllAnnouncements, fetchCompleteAnnouncementDetails, deleteAnnouncement } = require('../controllers/announcementController');
const { markEntryAttendance, markExitAttendance, fetchAttendanceByMonth, fetchCustomEmployeeAttendance } = require('../controllers/attendanceController');

router.get('/getUsers', authMiddleware, isAdmin,getUsers);

// ✅ This route works fine
router.get('/kamm', authMiddleware , async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
})

// ✅ Validate ID before calling getUserById
router.post('/getUserById', authMiddleware, isAdmin,getUserById);
router.get('/getTasksbyUser', authMiddleware,getTasksbyUser);
router.post('/createUser', authMiddleware, isAdmin, createUser);
router.put('/updateUser',authMiddleware, isAdmin, updateUser);
router.delete('/deleteUser', authMiddleware, isAdmin,deleteUser);

// Query Routes
router.post('/createQuery',createQuery);
router.post('/addReply',addReply);
router.post('/updateQueryStatus',updateQueryStatus);
router.post('/fetchQueriesByEmployee',fetchQueriesByEmployee);
router.post('/fetchQueriesByTeam',fetchQueriesByTeam);
router.get('/fetchAllQueries',fetchAllQueries);
router.post('/fetchCompleteQueryDetails',fetchCompleteQueryDetails);

//Announcement Routes
router.post('/createAnnouncement',createAnnouncement);
router.post('/fetchAnnouncementsByTeam',fetchAnnouncementsByTeam);
router.get('/fetchAllAnnouncements',fetchAllAnnouncements);
router.post('/fetchCompleteAnnouncementDetails',fetchCompleteAnnouncementDetails);
router.post('/deleteAnnouncement',deleteAnnouncement);

//Attendance Routes
router.post('/markEntryAttendance',markEntryAttendance);
router.post('/markExitAttendance',markExitAttendance);
router.post('/fetchCustomEmployeeAttendance',fetchCustomEmployeeAttendance);

module.exports = router;
