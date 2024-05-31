import { errorNoJobAreFound, errorSomethingWentWrong, successJobListed } from "../../globals/constants";
import { sendErrorResponse, sendSuccessResponse } from "../../globals/error.handler";
import JobPost from "../../models/job_posts";


export class DashboardService {
    constructor() { }
    //#region  job post listing api
    async getDashboardJobsList(query: any) {
        try {
            const { page = 1, limit = 10, keyword } = query;
            let filter = {}
            //apply filter 
            if (keyword) {
                filter = {
                    $or: [
                        { job_name: { $regex: keyword, $options: 'i' } },
                        { company_name: { $regex: keyword, $options: 'i' } },
                        { job_full_text: { $regex: keyword, $options: 'i' } },
                    ],
                };
            }
            //get job list from collection
            const jobPostsResponse = await JobPost.aggregate([
                {
                    $match: filter
                },
                {
                    $facet: {
                        metadata: [{ $count: "total" }],
                        rows: [
                            { $skip: (page - 1) * limit },
                            { $limit: limit }]
                    }
                },
                {
                    $addFields: {
                        count: { $arrayElemAt: ["$metadata.total", 0] }
                    }
                },
                { $project: { metadata: 0 } }
            ])

            if (jobPostsResponse.length == 0) return sendErrorResponse(errorNoJobAreFound, 400)

            const jobPosts = jobPostsResponse[0]
            const totalData = jobPosts?.count;
            const totalPages = Math.ceil(totalData / limit);
            const response = {
                meta: {
                    perPage: limit,
                    page,
                    pages: totalPages,
                    total: totalData,
                },
                rows: jobPosts.rows
            };
            return sendSuccessResponse(successJobListed, 200, response)
        } catch (err) {
            return sendErrorResponse(errorSomethingWentWrong, 500, err)
        }
    }
    //#endregion
}