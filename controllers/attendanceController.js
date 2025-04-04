const Attendance = require('../models/Attendance-model');

exports.markEntryAttendance = async(req,res)=>{
    try {
        const {employeeId} = req.body;
        if(!employeeId){
            return res.status(404).json({
                success: false,
                message: "Required details not found"
            })
        }

        //create new attendance and mark entry time
        const newAttendance = await Attendance.create({
            employeeId,
            entry: Date.now(),
            // dateField: Date.now()
        });
        if(!newAttendance){
            return res.status(403).json({
                success: false,
                message: "Could not mark Attendance"
            })
        }
        // console.log("New Attendance",newAttendance);

        return res.status(200).json({
            success: true,
            message: "Attendance marked successfully",
            data: newAttendance
        })

    } catch (err) {
        console.log("mark attendance error: ",err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })        
    }
}

exports.markExitAttendance = async(req,res)=>{
    try {
        const {attendanceId} = req.body;
        if(!attendanceId){
            return res.status(404).json({
                success: false,
                message: "Required details not found"
            })
        }

        //create new attendance and mark entry time
        const exitAttendance = await Attendance.findByIdAndUpdate(
            attendanceId,
            {exit: Date.now()},
            {new: true}
        )
        .populate('employeeId','-password')
        .exec();
        // console.log("Exit Attendance",exitAttendance);
        if(!exitAttendance){
            return res.status(403).json({
                success: false,
                message: "Could not mark Exit Attendance"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Exit Attendance marked successfully",
            data: exitAttendance
        })

    } catch (err) {
        console.log("exit attendance error: ",err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })        
    }
}

exports.fetchCustomEmployeeAttendance = async(req,res)=>{
    try{
        const {employeeId,start,end} = req.body;
        if(!employeeId || !start || !end){
            return res.status(404).json({
                success: false,
                message: "Required details not found"
            })
        }

        const monthlyAttendance = await Attendance
        .find({
            employeeId: employeeId,
            entry:{
                $gte: start,
                $lt: end
            }
            // $expr: {
            //     $eq: [
            //         { $month: { $toDate: "$dateField" } },
            //         +month
            //     ]
            // }
        })
        .populate('employeeId','-password')
        .exec();
        // console.log("Monthly Attendance: ",monthlyAttendance);
        if(!monthlyAttendance){
            return res.status(404).json({
                success: false,
                message: "Attendance not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Attendance fetched successfully",
            data: monthlyAttendance
        })

    }catch(err){
        console.log("Custom Attendance Error: ",err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}