import mongoose, { Document, Schema } from 'mongoose';

interface IJobPost extends Document {
    post_id: string;
    job_name: string;
    company_name: string;
    job_full_text: string;
    post_url: string;
    post_apply_url: string;
    company_url: string;
    company_industry: string;
    minimum_compensation: number;
    maximum_compensation: number;
    compensation_type: string;
    job_hours: string;
    role_seniority: string;
    minimum_education: string;
    office_location: string;
    post_html: string;
    city: string;
    region: string;
    country: string;
    job_published_at: Date;
    last_indexed: Date;
}

const JobPostSchema: Schema = new Schema({
    post_id: { type: String, required: true, unique: true },
    job_name: { type: String, required: true },
    company_name: { type: String, required: true },
    job_full_text: { type: String, required: true },
    post_url: { type: String, required: true },
    post_apply_url: { type: String, required: true },
    company_url: { type: String, required: true },
    company_industry: { type: String, required: true },
    minimum_compensation: { type: Number, required: true },
    maximum_compensation: { type: Number, required: true },
    compensation_type: { type: String, required: true },
    job_hours: { type: String, required: true },
    role_seniority: { type: String, required: true },
    minimum_education: { type: String, required: true },
    office_location: { type: String, required: true },
    post_html: { type: String, required: true },
    city: { type: String, required: true },
    region: { type: String, required: true },
    country: { type: String, required: true },
    job_published_at: { type: Date, required: true },
    last_indexed: { type: Date, required: true }
}, { timestamps: true });

const JobPost = mongoose.model<IJobPost>('JobPost', JobPostSchema);

export default JobPost;
export { IJobPost };
