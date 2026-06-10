const fs = require("fs");

const companies = [
  "Infosys",
  "TCS",
  "Wipro",
  "Accenture",
  "Capgemini",
  "Google",
  "Microsoft",
  "Amazon",
  "IBM",
  "Oracle"
];

const roles = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "React Developer",
  "Node.js Developer",
  "AI Engineer",
  "Data Analyst",
  "DevOps Engineer",
  "Software Engineer",
  "Cloud Engineer"
];

const locations = [
  "Bangalore",
  "Hyderabad",
  "Pune",
  "Mumbai",
  "Chennai",
  "Delhi"
];

const jobTypes = [
  "Full Time",
  "Remote",
  "Hybrid"
];

const jobs = [];

for (let i = 1; i <= 100; i++) {
  jobs.push({
    id: i,

    title:
      roles[Math.floor(Math.random() * roles.length)],

    company:
      companies[
        Math.floor(Math.random() * companies.length)
      ],

    location:
      locations[
        Math.floor(Math.random() * locations.length)
      ],

    salary:
      Math.floor(Math.random() * 20 + 5) + " LPA",

    experience:
      Math.floor(Math.random() * 5 + 1) +
      " Years",

    type:
      jobTypes[
        Math.floor(Math.random() * jobTypes.length)
      ],

    skills: [
      "React",
      "JavaScript",
      "Node.js",
      "MongoDB"
    ],

    description:
      "Work on modern web applications.",

    applyLink:
      "https://example.com/apply"
  });
}

fs.writeFileSync(
  "./datasets/jobs.json",
  JSON.stringify(jobs, null, 2)
);

console.log("100 jobs generated successfully");