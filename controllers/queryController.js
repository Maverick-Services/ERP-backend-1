const Query = require('../models/Query-model');
const Reply = require('../models/Reply-model');
const { ROLE } = require('../utils/constants');

exports.createQuery = async(req,res)=>{
    try{

        const {employeeId,teamId,role,subject,description} = req.body;

        if(!role || !subject || !description || (!employeeId && !teamId)){
            return res.status(404).json({
                success: false,
                message: "Required details not found"
            })
        }

        //Raise new Query
        const newQuery = await Query.create({
            role,
            raisedBy: role === ROLE.EMPLOYEE ? employeeId: teamId,
            raisedByModel: role === ROLE.ADMIN || role === ROLE.EMPLOYEE ? "User" : "Team",
            subject,
            description
        });

        return res.status(200).json({
            success: true,
            message: "Query created successfully",
            data: newQuery
        });

    }catch(err){
        console.log("Query Error",err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

exports.addReply = async(req,res)=>{
    try{

        const {queryId,employeeId,adminId,teamId,role,message} = req.body;
        
        if((!employeeId && !teamId && !adminId) || !role || !queryId || !message){
            return res.status(404).json({
                success: false,
                message: "Required details not found"
            })
        }

        //Check if Query exist
        const existingQuery = await Query.findById(queryId);
        if(!existingQuery){
            return res.status(404).json({
                success: false,
                message: `Query with ${queryId} does not exist`
            });
        }

        //Add User message in Replies
        const newReply = await Reply.create({
            queryId: existingQuery?._id,
            replyBy: role === ROLE.TEAM ? teamId: (employeeId || adminId),
            replyByModel: role === ROLE.ADMIN || role === ROLE.EMPLOYEE ? "User" : "Team",
            message
        })

        //Add user message reply in query replies array
        const updatedQuery = await Query.findByIdAndUpdate(
            existingQuery?._id,
            {
                $push: {
                    replies: newReply?._id
                }
            },
            { new: true }
        )
        .populate({
            path:'replies',
            populate:{
                path:"replyBy",
                select: "-password"
            }
        })
        .populate('raisedBy',"-password")
        .exec();

        // console.log("edit",updatedQuery);

        return res.status(200).json({
            success: true,
            message: "Reply Added Successfully",
            data: updatedQuery
        });

    }catch(err){
        console.log("Query Error",err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

exports.updateQueryStatus = async(req,res)=>{
    try{

        const {queryId,status} = req.body;
        
        if(!queryId || !status){
            return res.status(404).json({
                success: false,
                message: "Required details not found"
            })
        }

        //Check if Query exist
        const existingQuery = await Query.findById(queryId);
        if(!existingQuery){
            return res.status(404).json({
                success: false,
                message: `Query with ${queryId} does not exist`
            });
        }

        //Add user message reply in query replies array
        const updatedQuery = await Query.findByIdAndUpdate(
            existingQuery?._id,
            {status},
            { new: true }
        )
        .populate({
            path:'replies',
            populate:{
                path:"replyBy",
                select: "-password"
            }
        })
        .populate('raisedBy',"-password")
        .exec();

        // console.log("edit",updatedQuery);

        return res.status(200).json({
            success: true,
            message: "Query Status Updated Successfully",
            data: updatedQuery
        });

    }catch(err){
        console.log("Query Error",err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

exports.fetchQueriesByEmployee = async(req,res)=>{
    try {
        
        const { employeeId } = req.body;

        if(!employeeId){
            return res.status(404).json({
                success: false,
                message: "Required details not found"
            })
        }

        const allQueries = await Query.find({
            raisedBy: employeeId
        })
        .sort({createdAt: -1})
        .populate({
            path:'replies',
            populate:{
                path:"replyBy",
                select: "-password"
            }
        })
        .populate('raisedBy',"-password")
        .exec();

        // console.log("All Queries: ",allQueries)

        if(!allQueries){
            return res.status(404).json({
                success: false,
                message: "Queries not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Queries fetched succesfully",
            data: allQueries
        })

    } catch (err) {
        console.log("Could not fetch Queries",err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

exports.fetchQueriesByTeam = async(req,res)=>{
    try {
        
        const { teamId } = req.body;

        if(!teamId){
            return res.status(404).json({
                success: false,
                message: "Required details not found"
            })
        }

        const allQueries = await Query.find({
            raisedBy: teamId
        })
        .sort({createdAt: -1})
        .populate({
            path:'replies',
            populate:{
                path:"replyBy",
                select: "-password"
            }
        })
        .populate('raisedBy',"-password")
        .exec();

        // console.log("All Queries: ",allQueries)
        
        if(!allQueries){
            return res.status(404).json({
                success: false,
                message: "Queries not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Queries fetched succesfully",
            data: allQueries
        })

    } catch (err) {
        console.log("Could not fetch Queries",err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

exports.fetchAllQueries = async(req,res)=>{
    try {
 
        const allQueries = await Query.find({})
        .sort({createdAt: -1})
        .populate({
            path:'replies',
            populate:{
                path:"replyBy",
                select: "-password"
            }
        })
        .populate('raisedBy',"-password")
        .exec();

        // console.log("All Queries: ",allQueries)

        if(!allQueries){
            return res.status(404).json({
                success: false,
                message: "Queries not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Queries fetched succesfully",
            data: allQueries
        })

    } catch (err) {
        console.log("Could not fetch Queries",err);
        return re.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

exports.fetchCompleteQueryDetails = async(req,res)=>{
    try {
        
        const { queryId } = req.body;

        if(!queryId){
            return res.status(404).json({
                success: false,
                message: "Required details not found"
            })
        }

        const completeQueryDetails = await Query.findById(queryId)
        .populate({
            path:'replies',
            populate:{
                path:"replyBy",
                select: "-password"
            }
        })
        .populate('raisedBy',"-password")
        .exec();

        // console.log("Complete Query Details: ",completeQueryDetails)
        
        if(!completeQueryDetails){
            return res.status(404).json({
                success: false,
                message: "Query details not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Query details fetched succesfully",
            data: completeQueryDetails
        })

    } catch (err) {
        console.log("Could not fetch Query details",err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}