import { errorJobDetailsNotFound, errorNoJobAreFound, errorSomethingWentWrong, successJobFound, successJobListed } from "../../globals/constants";
import { sendErrorResponse, sendSuccessResponse } from "../../globals/error.handler";
import JobPost from "../../models/job_posts";


export class DashboardService {
    constructor() { }
    escapeRegex(text: string) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    };
    //#region  job post listing api
    async getDashboardJobsList(query: any) {
        try {
            let { page = 1, limit = 10, keyword } = query;
            page = +(page ?? 1)
            limit = +(limit ?? 10)

            let filter = {}
            //apply filter 
            if (keyword) {
                const regexSearch = this.escapeRegex(keyword)
                filter = {
                    job_name: { $regex: regexSearch, $options: 'i' }
                };
                // filter = {
                //     job_name: { $regex: regexSearch, $options: 'i' }
                // };
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
            console.log({ err })
            return sendErrorResponse(errorSomethingWentWrong, 500, err)
        }
    }
    //#endregion

    //#region  get job details
    async getJobDetails(body: any) {
        try {
            const { jobId } = body
            //get job details
            const jobPostsResponse = await JobPost.findOne({ _id: jobId })
            if (!jobPostsResponse) return sendErrorResponse(errorJobDetailsNotFound, 400)
            return sendSuccessResponse(successJobFound, 200, jobPostsResponse)

        } catch (err) {
            return sendErrorResponse(errorSomethingWentWrong, 500, err)

        }
    }
    //#endregion
}