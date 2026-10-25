export interface SamplePreset {
  id: string;
  name: string;
  badge: string;
  badgeColor: string;
  title: string;
  company: string;
  channel: 'LinkedIn' | 'Telegram' | 'WhatsApp' | 'Email' | 'Campus Drive' | 'Internshala' | 'Company Portal' | 'Other';
  jobType: 'Internship' | 'Full-time' | 'Part-time' | 'Contract';
  workMode: 'Remote' | 'On-site' | 'Hybrid';
  salaryStipend: string;
  contactDetail: string;
  text: string;
}

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: 'scam-sample-1',
    name: 'Suspicious Telegram Data Entry Task',
    badge: 'High Risk Example',
    badgeColor: 'bg-rose-100 text-rose-700 border-rose-200',
    title: 'Work From Home Data Entry Assistant',
    company: 'Apex Global Business Solutions (Unverified)',
    channel: 'Telegram',
    jobType: 'Part-time',
    workMode: 'Remote',
    salaryStipend: '₹45,000 / month (Part-time 2 hrs/day)',
    contactDetail: 'hr_recruitment_apex@gmail.com / Telegram @ApexHiringDept',
    text: `URGENT HIRING!! Part Time Work from Home for Freshers & College Students!
Earn ₹1500 to ₹3000 daily just by typing scanned PDFs into Word files! No prior technical experience needed. 100% genuine company.

Selection Process:
- Direct offer letter issued within 30 minutes of submitting your Aadhaar copy.
- No technical interview or screening round required.

Mandatory Equipment & Security Policy:
We provide an official Dell Core-i7 laptop and internet router dispatched directly to your doorstep.
To dispatch your office laptop kit, candidates must transfer a refundable security deposit of ₹3,999/- via UPI to our accounts coordinator. This amount will be 100% refunded in your first week's salary paycheck!

Contact HR Department immediately on Telegram: @ApexHiringDept or email your resume to hr_recruitment_apex@gmail.com. Limited slots available! Act fast!`,
  },
  {
    id: 'legit-sample-1',
    name: 'Legitimate Junior Frontend Developer',
    badge: 'Low Risk Example',
    badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    title: 'Junior Frontend Developer (React / TypeScript)',
    company: 'NovaScale Technologies Ltd.',
    channel: 'LinkedIn',
    jobType: 'Full-time',
    workMode: 'Hybrid',
    salaryStipend: '₹6.5 - 8.5 LPA',
    contactDetail: 'careers@novascale.io (Official Domain)',
    text: `About NovaScale Technologies:
NovaScale is a B2B SaaS platform helping engineering teams monitor microservice telemetry. We are expanding our frontend web team in Bangalore.

Position: Junior Frontend Developer (Full-time)
Location: Bangalore (Hybrid - 3 days in office, 2 days remote)

Key Responsibilities:
- Build clean, responsive UI components using React, TypeScript, and Tailwind CSS.
- Integrate RESTful APIs and handle asynchronous application state using Redux Toolkit or React Query.
- Write maintainable, testable code with Jest and React Testing Library.
- Collaborate with product designers in Figma and review pull requests on GitHub.

Requirements:
- Bachelor's degree in Computer Science, IT, or equivalent practical experience (2024 / 2025 graduates welcome).
- Strong proficiency in JavaScript (ES6+), TypeScript, HTML5, and CSS3.
- Familiarity with Git version control and modern frontend tooling (Vite/Webpack).
- Solid understanding of web performance, browser APIs, and accessibility.

Interview Process:
1. 30-min Technical Recruiter Phone Screen
2. 60-min Live Coding / React Component Architecture pairing session
3. 45-min System discussion & culture fit with Engineering Director

Note: NovaScale will NEVER ask candidates for money, deposits, or processing fees at any stage of recruitment.
Apply directly via our career portal: https://novascale.io/careers/frontend-jr-2025 or email careers@novascale.io.`,
  },
  {
    id: 'ambiguous-sample-1',
    name: 'Unpaid / Commission Growth Trainee',
    badge: 'Medium Caution Example',
    badgeColor: 'bg-amber-100 text-amber-700 border-amber-200',
    title: 'Campus Growth & Tech Evangelist Intern',
    company: 'HyperViral Studios (Early Stage Stealth)',
    channel: 'WhatsApp',
    jobType: 'Internship',
    workMode: 'Remote',
    salaryStipend: 'Unpaid (Incentive / Commission based on conversions)',
    contactDetail: 'hyperviralinternships@yahoo.com',
    text: `Looking for rockstar college students to join our stealth growth rocketship!
Position: Campus Growth & Tech Evangelist Intern

What you'll do:
- Post promotional banners across your college WhatsApp groups and student clubs.
- Pitch our premium courses to fellow classmates and enroll at least 15 paid students per month.
- Occasional bug testing on our beta web portal and simple HTML edits.

Duration & Stipend:
- 3 months probationary internship.
- Fixed stipend: NIL / Unpaid during probation.
- High incentive: You will receive 10% commission on each student who purchases our ₹12,000 certification bootcamp!
- Top performers after 3 months may be evaluated for a full-time stipend based on gross revenue generated.

Perks: Certificate of Completion + Letter of Recommendation from our Founder.
Ping your resume on WhatsApp to 9876543210 or email hyperviralinternships@yahoo.com.`,
  },
  {
    id: 'backend-sample-1',
    name: 'Cloud & Backend Fresher Engineer',
    badge: 'Low Risk Example',
    badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    title: 'Associate Backend Engineer (Python / Cloud)',
    company: 'AetherData Systems',
    channel: 'Company Portal',
    jobType: 'Full-time',
    workMode: 'On-site',
    salaryStipend: '₹7.0 - 9.0 LPA',
    contactDetail: 'talent@aetherdata.com',
    text: `AetherData Systems is looking for an Associate Backend Engineer to work on our high-throughput data pipelines.

Requirements:
- Strong core foundation in Python and object-oriented programming.
- Hands-on experience or academic projects using FastAPI, Django, or Flask.
- Good understanding of relational databases (PostgreSQL/MySQL), SQL queries, and schema indexing.
- Familiarity with Docker containerization and basic Linux commands.
- Knowledge of cloud platforms like AWS (S3, EC2) is a strong plus.
- Good problem-solving skills and knowledge of basic Data Structures and Algorithms.

We offer comprehensive health insurance, learning allowances, and an inclusive mentorship program.
To apply, submit your resume and GitHub profile at https://aetherdata.com/careers.`,
  },
  {
    id: 'she-can-foundation-sample',
    name: 'She Can Foundation (NGO Outreach Intern)',
    badge: 'Real-World NGO Case',
    badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    title: 'Social Media & NGO Outreach Intern',
    company: 'She Can Foundation',
    channel: 'Internshala',
    jobType: 'Internship',
    workMode: 'Remote',
    salaryStipend: 'Performance-based (₹2,000 - ₹5,000 milestone incentive)',
    contactDetail: 'hr@shecanfoundation.org',
    text: `About She Can Foundation:
She Can Foundation is a non-profit organization focused on women empowerment, literacy drives, and community education programs. We are inviting proactive undergraduate students for an 8-week Virtual Winter Internship.

Position: Social Media & NGO Outreach Intern
Organization: She Can Foundation
Location: Remote / Work from Home
Duration: 8 Weeks

Key Responsibilities:
- Design engaging social media creatives and awareness posters using Canva and basic design tools.
- Drive student community outreach across university networks and student WhatsApp groups.
- Manage digital marketing updates, LinkedIn outreach posts, and awareness stories.
- Coordinate fundraising campaign drives (requires achieving a ₹10,000 peer outreach contribution milestone).

Requirements:
- Strong Communication Skills (written & verbal).
- Practical experience with Social Media Marketing, Content Writing, and Canva.
- Problem Solving ability and proactive peer outreach mindset.
- Preferred: Familiarity with Graphic Design and online event coordination.

Perks & Stipend:
- Performance-based stipend upon meeting outreach milestones (₹2,000 to ₹5,000).
- Certificate of Internship and Letter of Recommendation (LOR) for verified contributors.
- Note: There are NO registration fees, training fees, or upfront deposits required.

Apply by sending your resume and portfolio links to hr@shecanfoundation.org or through our Internshala posting.`,
  },
  {
    id: 'normal-python-internship',
    name: 'Normal Python Backend Internship',
    badge: 'Standard Internship',
    badgeColor: 'bg-sky-100 text-sky-700 border-sky-200',
    title: 'Python Backend Developer Intern',
    company: 'Kestrel Analytics Labs',
    channel: 'LinkedIn',
    jobType: 'Internship',
    workMode: 'Hybrid',
    salaryStipend: '₹25,000 - ₹35,000 / month',
    contactDetail: 'internships@kestrelanalytics.com',
    text: `About Kestrel Analytics:
Kestrel Analytics develops automated data extraction pipelines for enterprise logistics companies. We are hiring a Python Backend Intern for a 6-month duration in Bangalore.

Position: Python Backend Developer Intern
Organization: Kestrel Analytics Labs
Location: Bangalore (Hybrid - 3 days in office, 2 days remote)
Duration: 6 Months

Key Responsibilities:
- Build and maintain data ingestion APIs using Python and FastAPI.
- Write relational database queries using PostgreSQL and SQL.
- Write unit tests and maintain version control with Git & GitHub.
- Participate in weekly engineering standups and code reviews.

Requirements:
- Hands-on programming proficiency in Python.
- Understanding of SQL and database indexing.
- Experience with Git & GitHub version control.
- Preferred: Familiarity with Docker or Linux shell commands.

Interview Process:
1. 30-min Technical Phone Screen
2. Take-home Python coding exercise (FastAPI & SQL)
3. 45-min Pair programming review with senior backend engineer

Apply via careers@kestrelanalytics.com. We never ask for any processing or registration fees.`,
  },
  {
    id: 'incomplete-desc-sample',
    name: 'Incomplete / Vague Job Notice (<20 words)',
    badge: 'Incomplete Description',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    title: 'Urgent Online Assistant Needed',
    company: 'Online Services Group',
    channel: 'WhatsApp',
    jobType: 'Part-time',
    workMode: 'Remote',
    salaryStipend: 'High Pay',
    contactDetail: '+91 9988776655',
    text: `Urgent workers needed for online assistant tasks. High daily salary. Contact immediately on WhatsApp.`,
  },
  {
    id: 'all-skills-matched-sample',
    name: '100% Skill Match Role (Frontend)',
    badge: '100% Skill Match',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    title: 'Junior React Frontend Engineer',
    company: 'Veloce Digital Systems',
    channel: 'LinkedIn',
    jobType: 'Full-time',
    workMode: 'Remote',
    salaryStipend: '₹6.0 - 8.0 LPA',
    contactDetail: 'careers@velocedigital.com',
    text: `Veloce Digital Systems is hiring a Junior Frontend Engineer.

Position: Junior React Frontend Engineer
Organization: Veloce Digital Systems
Location: Remote

Key Requirements:
- Strong hands-on proficiency in React.
- Solid understanding of TypeScript for type-safe components.
- Practical experience styling modern responsive user interfaces with Tailwind CSS.
- High proficiency in HTML5/CSS3.
- Good understanding of SQL for data table schemas.

Preferred Qualifications:
- Familiarity with Git & GitHub collaboration workflows.

Interview Process:
1. Technical screen
2. React architecture walkthrough
3. Offer evaluation`,
  },
  {
    id: 'no-skills-matched-sample',
    name: '0% Skill Match Role (Kernel & Embedded)',
    badge: '0% Skill Match',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    title: 'Embedded Systems & Kernel Engineer',
    company: 'SiliconCore Semiconductor',
    channel: 'Company Portal',
    jobType: 'Full-time',
    workMode: 'On-site',
    salaryStipend: '₹12.0 - 15.0 LPA',
    contactDetail: 'engineering@siliconcore.io',
    text: `SiliconCore Semiconductor is seeking an Embedded Systems & Kernel Engineer to develop low-level device drivers for custom silicon chipsets.

Position: Embedded Systems & Kernel Engineer
Organization: SiliconCore Semiconductor
Location: Hyderabad (On-site)

Required Skills:
- Deep expertise in C++ (C++17/20) and low-level memory management.
- Strong proficiency in C and embedded assembly architecture.
- Systems programming with Go for distributed kernel telemetry.
- Hands-on experience with Kubernetes cluster node orchestration.

Candidates must have experience writing direct hardware drivers without high-level runtime engines.`,
  },
];
