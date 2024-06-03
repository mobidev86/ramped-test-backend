import dotenv from 'dotenv';
dotenv.config();
const faker = require('faker')
import JobPost from '../models/job_posts';
import connectDB from './connection';


// Seed data from Excel file
const seedData = async (count: number) => {
    try {
        const jobPosts = [];
        for (let i = 0; i < count; i++) {
            jobPosts.push({
                post_id: faker.datatype.uuid(),
                job_name: faker.name.jobTitle(),
                company_name: faker.company.companyName(),
                job_full_text: faker.lorem.paragraphs(),
                post_url: faker.internet.url(),
                post_apply_url: faker.internet.url(),
                company_url: faker.internet.url(),
                company_industry: faker.commerce.department(),
                minimum_compensation: faker.datatype.number({ min: 30000, max: 70000 }),
                maximum_compensation: faker.datatype.number({ min: 80000, max: 150000 }),
                compensation_type: faker.random.arrayElement(['Annual', 'Monthly', 'Hourly']),
                job_hours: faker.random.arrayElement(['Full-time', 'Part-time']),
                role_seniority: faker.name.jobType(),
                minimum_education: faker.random.arrayElement(['High School', 'Bachelor', 'Master', 'PhD']),
                office_location: faker.address.streetAddress(),
                post_html: faker.lorem.paragraphs(),
                city: faker.address.city(),
                region: faker.address.state(),
                country: faker.address.country(),
                job_published_at: faker.date.past(),
                last_indexed: faker.date.recent()
            });
        }

        await JobPost.insertMany(jobPosts);
        process.exit(0);
    } catch (err) {
        process.exit(1);
    }
};

// Run the script
(async () => {
    await connectDB();
    await seedData(100);
})();
