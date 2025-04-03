const Announcement = require('../models/Announcement-model');
const { ROLE } = require('../utils/constants');

exports.createAnnouncement = async(req,res)=>{
    try{

        const {teamId,role,subject,description} = req.body;

        if(!role || !subject || !description || (role === ROLE.TEAM && !teamId)){
            return res.status(404).json({
                success: false,
                message: "Required details not found"
            })
        }

        //Publish new Announcment
        const newAnnouncement = await Announcement.create({
            role,
            raisedBy: role === ROLE.TEAM ? teamId : null,
            raisedByModel: role === ROLE.ADMIN ? "User" : "Team",
            subject,
            description
        });

        return res.status(200).json({
            success: true,
            message: "Announcement published successfully",
            data: newAnnouncement
        });

    }catch(err){
        console.log("Announcement Error",err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

exports.fetchAnnouncementsByTeam = async(req,res)=>{
    try {
        
        const { teamId } = req.body;

        if(!teamId){
            return res.status(404).json({
                success: false,
                message: "Required details not found"
            })
        }

        const allAnnouncements = await Announcement.find({
            raisedBy: teamId
        })
        .sort({createdAt: -1})
        .populate('raisedBy',"-password")
        .exec();

        // console.log("All Announcements: ",allAnnouncements)
        
        if(!allAnnouncements){
            return res.status(404).json({
                success: false,
                message: "Announcements not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Announcements fetched succesfully",
            data: allAnnouncements
        })

    } catch (err) {
        console.log("Could not fetch Announcements",err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

exports.fetchAllAnnouncements = async(req,res)=>{
    try {
 
        const allAnnouncements = await Announcement.find({})
        .sort({createdAt: -1})
        .populate('raisedBy',"-password")
        .exec();

        // console.log("All Announcements: ",allAnnouncements)

        if(!allAnnouncements){
            return res.status(404).json({
                success: false,
                message: "Announcements not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Announcements fetched succesfully",
            data: allAnnouncements
        })

    } catch (err) {
        console.log("Could not fetch Announcements",err);
        return re.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

exports.fetchCompleteAnnouncementDetails = async(req,res)=>{
    try {
        
        const { announcementId } = req.body;

        if(!announcementId){
            return res.status(404).json({
                success: false,
                message: "Required details not found"
            })
        }

        const completeAnnouncementDetails = await Announcement.findById(announcementId)
        .populate('raisedBy',"-password")
        .exec();

        // console.log("Complete Announcement Details: ",completeAnnouncementDetails)
        
        if(!completeAnnouncementDetails){
            return res.status(404).json({
                success: false,
                message: "Announcement details not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Announcement details fetched succesfully",
            data: completeAnnouncementDetails
        })

    } catch (err) {
        console.log("Could not fetch Announcement details",err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

exports.deleteAnnouncement = async(req,res)=>{
    try{

        const {announcementId} = req.body;

        if(!announcementId){
            return res.status(404).json({
                success: false,
                message: "Required details not found"
            })
        }

        //Delete Announcement
        await Announcement.findByIdAndDelete(announcementId);

        return res.status(200).json({
            success: true,
            message: "Announcement deleted successfully"
        });

    }catch(err){
        console.log("Announcement Error",err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}
