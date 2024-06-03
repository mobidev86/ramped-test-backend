import { errorNoJobAreFound, errorSomethingWentWrong, successJobListed } from "../../globals/constants";
import { sendErrorResponse, sendSuccessResponse } from "../../globals/error.handler";
import { convertReadableAmount, formateDate } from "../../globals/halper.service";
import JobPost from "../../models/job_posts";


export class DashboardService {
    constructor() { }
    //#region  job post listing api
    async getDashboardJobsList(query: any) {
        try {
            let { page = 1, limit = 10, keyword } = query;
            page = +(page ?? 1)
            limit = +(limit ?? 10)
            let filter = {}
            //apply filter 
            if (keyword) {
                const regexSearch = new RegExp(keyword.split('').join('.*'), 'i');
                filter = {
                    job_name: { $regex: regexSearch }
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
                            { $sort: { job_published_at: -1 } },
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
                rows: this.prepareReadableObject(jobPosts?.rows)
            };
            return sendSuccessResponse(successJobListed, 200, response)
        } catch (err) {
            return sendErrorResponse(errorSomethingWentWrong, 500, err)
        }
    }
    //#endregion

    //#region prepare array in readable
    prepareReadableObject(predefinedArray: any[]) {
        return predefinedArray.map(each => {
            return {
                _id: each?._id,
                post_id: each?.post_id,
                post_url: each?.post_url,
                post_apply_url: each?.post_apply_url,
                company_url: each?.company_url,
                post_html: each?.post_html,
                job_name: each?.job_name,
                company_name: each?.company_name,
                content: {
                    "Job Posted": formateDate(each?.job_published_at),
                    City: each?.city,
                    Region: each?.region,
                    Country: each?.country,
                    "Company Industry": each?.company_industry,
                    "Minimum Compensation": convertReadableAmount(each?.minimum_compensation),
                    "Maximum Compensation": convertReadableAmount(each?.maximum_compensation),
                    "Compensation Type": each?.compensation_type,
                    "Job Hours": each?.job_hours,
                    "Role Seniority": each?.role_seniority,
                    "Minimum Education": each?.minimum_education,
                    "Office Location": each?.office_location,
                    "Job Name": each?.job_name,
                    "Company Name": each?.company_name,
                    "Description": each?.job_full_text,
                }
            }
        })
    }
    //#endregion

}