import { Job } from '../models/jobModel.js';
export const postJob = async(req,res)=>{
    try{
        const {title, description, requirements, salary, location, jobType, experience, position, companyId} = req.body;
        const userId =req.id;
        if(!title || !description || !requirements || !salary || !location || !jobType || !position || !companyId){
            return res.status(400).json({
                message:"something is missing",
                success:false
            })
        };
        const newJob = await Job.create({
            title,
            description,
            requirements:requirements.split(","),
            salary:Number(salary),
            location,
            jobType,
            experienceLevel:experience,
            position,
            company:companyId,
            created_by:userId
        });
      return res.status(201).json({
        message:"New job created successfully.",
        job:newJob,
        success:true
      });
    } catch(error){
        console.log(error);
    }

}
export const getAllJobs = async (req,res)=>{
    try{
        const keyword=req.query.keyword || "";
        const query = {
            $or:[
                {title:{$regex:keyword, $options:"i"}},
                {description:{$regex:keyword, $options:"i"}},
            ]
        };
        const jobs = await Job.find(query).populate({
              path:"company"
        }).sort({createdAt:-1});
        if(!jobs){
             return res.status(404).json({
                message:"Jobs not found",
                success:false
            })
        };
        return res.status(200).json({
            jobs,
            success:true
        })
    } catch(error){
        console.log(error);
    }
}
export const getJobById = async(req,res)=>{
    try{
        const jobId = req.params.id.trim();
        const job = await Job.findById(jobId);
        if(!job){
             return res.status(404).json({
                message:"Jobs not found",
                success:false
            })
        };
        return res.status(200).json({
            job,
            success:true
        })

        }catch(error){
        console.log(error);
    }
}
export const getAdminJobs = async(req,res)=>{
    try{
        const adminId = req.id;
        const jobs = await Job.find({created_by:adminId});
        if(!Job){
             return res.status(404).json({
                message:"Jobs not found",
                success:false
            })
        };
        return res.status(200).json({
            jobs,
            success:true
        })
    }catch(error){
        console.log(error);
    }
}