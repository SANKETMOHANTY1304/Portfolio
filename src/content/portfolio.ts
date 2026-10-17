import {
  type Portfolio,
  type Project,
  publishedPortfolio,
} from "@/lib/content-schema";
const section = (title: string, body: string) => ({ title, body });
const projectDefaults = {
  cover: "",
  coverAlt: "",
  repositoryUrl: "",
  demoUrl: "",
  workRelated: false,
  allowRepository: true,
  allowImages: true,
  featured: true,
  published: true,
  images: [],
};
const projects: Project[] = [
  {
    ...projectDefaults,
    id: "chapter-rag",
    slug: "chapter-aware-multimodal-rag",
    title: "Chapter-aware multimodal RAG",
    summary:
      "Turning educational PDFs into a connected, chapter-aware learning experience—with grounded answers, summaries, and knowledge graphs.",
    category: "Generative AI",
    visual: "graph",
    displayOrder: 0,
    workRelated: true,
    allowRepository: false,
    allowImages: false,
    technologies: [
      "Python",
      "FastAPI",
      "Qwen",
      "Qdrant",
      "Neo4j",
      "PostgreSQL",
    ],
    sections: [
      section(
        "Overview",
        "KNOI is a work project within Bandhure Solution LLP (Aivi.in). My work focuses on chapter-aware document intelligence and multilingual educational responses. This case study describes my responsibilities at a high level; proprietary code and implementation artifacts are not shared.",
      ),
      section(
        "The problem",
        "Educational PDFs carry meaning through chapter structure, headings, images, and surrounding context. Retrieval that ignores these boundaries can combine unrelated passages and produce answers that are difficult to trace to the textbook.",
      ),
      section(
        "Practical motivation",
        "Help learners explore a chapter, identify its topics, ask relevant questions, and obtain summaries grounded in the source material.",
      ),
      section(
        "System architecture",
        "Conceptual workflow: PDF input → document extraction → chapter identification → chapter-scoped chunks → embeddings and vector retrieval → grounded language-model response. Graph relationships and image context supplement retrieval. This is an explanatory overview, not a disclosure of the deployed architecture.",
      ),
      section(
        "Workflow",
        "Identify chapter boundaries from bookmarks, tables of contents, and headings. Keep chapter context attached to extracted material. Retrieve relevant passages and image context, then generate source-grounded answers or summaries.",
      ),
      section(
        "Technical implementation",
        "Responsibilities include PDF chapter detection, chapter-local knowledge graphs, topic discovery, smart-question generation, and grounded summaries. Backend work uses Python and FastAPI, with Qwen models and retrieval workflows involving Qdrant, Neo4j, and PostgreSQL.",
      ),
      section(
        "Engineering challenges",
        "OCR variations and ambiguous headings complicate chapter boundaries. Multilingual responses require careful grammar and textbook terminology. Retrieved images must be relevant to the question rather than merely close in the document.",
      ),
      section(
        "Design decisions",
        "Use chapter context as a retrieval constraint, refine prompts around source grounding, and evaluate text and image relevance together. Work also includes response caching and inference-latency optimization.",
      ),
      section(
        "Results and evaluation",
        "The work covers chapter-detection refinements and multilingual response improvements. No quantitative benchmark is published here. Evaluation focuses on chapter alignment, source grounding, response language, and relevance.",
      ),
      section(
        "Future improvements",
        "Potential next steps include a curated evaluation set for ambiguous chapter layouts, stronger multilingual grounding checks, and clearer evidence tracing for image-supported answers.",
      ),
    ],
  },
  {
    ...projectDefaults,
    id: "fraud-risk",
    slug: "fraud-risk-scoring",
    title: "Fraud detection & risk scoring",
    summary:
      "A cost-sensitive machine-learning workflow that translates transaction risk into approve, review, and block decisions.",
    category: "AI/ML",
    visual: "fraud",
    displayOrder: 1,
    repositoryUrl:
      "https://github.com/SANKETMOHANTY1304/Fraud-Risk-Scoring-System-using-ML-Algorithms",
    technologies: ["Python", "scikit-learn", "Pandas", "NumPy"],
    sections: [
      section(
        "Overview",
        "An end-to-end fraud detection and risk-scoring project. The public repository identifies cost-sensitive machine learning as its focus; the supplied resume describes a comparison of Logistic Regression and Random Forest.",
      ),
      section(
        "The problem",
        "Fraudulent transactions are rare, so a model can appear accurate while missing costly fraud. A useful system must consider class imbalance and the consequences of false positives and false negatives.",
      ),
      section(
        "Practical motivation",
        "Make model outputs useful for transaction review by converting fraud probabilities into operational decisions.",
      ),
      section(
        "System architecture",
        "Transaction records → preprocessing and feature scaling → classification models → risk probability → threshold policy → approve, review, or block.",
      ),
      section(
        "Workflow",
        "Prepare transaction features, train and compare classification models, examine precision and recall, and select decision thresholds based on the tradeoff between missed fraud and unnecessary review.",
      ),
      section(
        "Technical implementation",
        "Python, Pandas, NumPy, and scikit-learn support preprocessing and modeling. The supplied resume documents Logistic Regression, Random Forest, and a rule-based decision engine.",
      ),
      section(
        "Engineering challenges",
        "Severe class imbalance makes overall accuracy a weak guide. Threshold selection must reflect the intended review process and the cost of mistakes.",
      ),
      section(
        "Design decisions",
        "Treat risk probability and the action threshold as separate concerns. Use precision-recall analysis and confusion matrices to inspect model behavior before setting a policy.",
      ),
      section(
        "Results and evaluation",
        "The resume reports model and financial-loss evaluations; this public case study does not present those numbers as independently reproduced benchmarks. Consult the repository notebook for the underlying experiment.",
      ),
      section(
        "Future improvements",
        "Potential extensions include probability calibration, drift checks, and evaluation on temporally separated data before considering real-world use.",
      ),
    ],
  },
  {
    ...projectDefaults,
    id: "activity-recognition",
    slug: "human-activity-recognition",
    title: "Human activity recognition",
    summary:
      "Learning patterns in smartphone sensor sequences with LSTM and GRU networks to classify everyday movement.",
    category: "Deep Learning",
    visual: "activity",
    displayOrder: 2,
    repositoryUrl:
      "https://github.com/SANKETMOHANTY1304/Human-Activity-Recognition-using-DL-models",
    technologies: ["Python", "TensorFlow", "Keras", "LSTM / GRU"],
    sections: [
      section(
        "Overview",
        "A comparative study of LSTM and GRU models for human activity recognition. The public repository describes classification of six activities from smartphone accelerometer and gyroscope sequences.",
      ),
      section(
        "The problem",
        "Individual sensor readings provide limited context. Recognizing movement requires patterns across a time window.",
      ),
      section(
        "Practical motivation",
        "Explore sequence modeling for activity-aware applications in fitness, healthcare research, and smart devices.",
      ),
      section(
        "System architecture",
        "Sensor time windows → preprocessing → recurrent network (LSTM or GRU) → activity probabilities → predicted activity.",
      ),
      section(
        "Workflow",
        "Prepare multivariate sensor windows, train recurrent models, and compare predictions using classification metrics and confusion matrices.",
      ),
      section(
        "Technical implementation",
        "The resume identifies Python, TensorFlow, Keras, scikit-learn, Pandas, and NumPy. The repository confirms LSTM and GRU comparisons using accelerometer and gyroscope data.",
      ),
      section(
        "Engineering challenges",
        "Similar movements can produce overlapping sensor patterns. Sequence preparation and consistent evaluation are important when comparing recurrent architectures.",
      ),
      section(
        "Design decisions",
        "Compare two recurrent architectures on the same task and inspect per-class performance, rather than selecting a model from a single aggregate metric.",
      ),
      section(
        "Results and evaluation",
        "The repository describes accuracy, precision, recall, F1, and confusion-matrix evaluation. The supplied resume names the UCI HAR dataset. No independently reproduced performance score is claimed here.",
      ),
      section(
        "Future improvements",
        "Potential extensions include testing robustness across users and devices, and measuring inference cost for on-device deployment.",
      ),
    ],
  },
  {
    ...projectDefaults,
    id: "heart-sounds",
    slug: "heart-sound-analysis",
    title: "Digital stethoscope / heart sound analysis",
    summary:
      "Phonocardiogram-based heart sound analysis. Implementation and publication details await owner confirmation.",
    category: "Deep Learning",
    visual: "audio",
    displayOrder: 4,
    published: false,
    featured: false,
    technologies: ["Python"],
    sections: [
      section(
        "Overview",
        "Draft: confirm signal preprocessing, modeling approach, evaluation, and any publication details before publishing.",
      ),
    ],
  },
  {
    ...projectDefaults,
    id: "retail-analysis",
    slug: "sales-customer-segmentation",
    title: "Sales & customer intelligence",
    summary:
      "A retail data pipeline and Power BI dashboards connecting sales trends with RFM-based customer segmentation.",
    category: "Data Science",
    visual: "data",
    displayOrder: 3,
    featured: false,
    technologies: ["Python", "Pandas", "Power BI", "RFM"],
    sections: [
      section(
        "Overview",
        "A sales-performance and customer-segmentation project documented in the supplied resume.",
      ),
      section(
        "The problem",
        "Raw retail transactions do not immediately reveal sales trends or customer behavior.",
      ),
      section(
        "Practical motivation",
        "Create analytical tables and dashboards that make retail performance and customer segments easier to explore.",
      ),
      section(
        "System architecture",
        "Retail transactions → cleaning and feature engineering → analytical tables → RFM segments → Power BI dashboards.",
      ),
      section(
        "Workflow",
        "Clean transaction records, derive monthly and category-level tables, calculate recency, frequency, and monetary features, and present findings in dashboards.",
      ),
      section(
        "Technical implementation",
        "Python and Pandas support data preparation. Power BI presents time-series trends, KPIs, and customer insights.",
      ),
      section(
        "Engineering challenges",
        "Consistent aggregation and customer-level feature construction are necessary to make segments interpretable.",
      ),
      section(
        "Design decisions",
        "Separate reusable analytical tables from dashboard presentation and use RFM to describe customer behavior.",
      ),
      section(
        "Results and evaluation",
        "The resume documents an end-to-end pipeline, analytical tables, dashboards, and identification of high-value, repeat, and at-risk customers. Source code and a public demo have not been supplied.",
      ),
      section(
        "Future improvements",
        "Potential extensions include scheduled refreshes, cohort analysis, and validation of segment stability over time.",
      ),
    ],
  },
];
export const seedPortfolio: Portfolio = {
  profile: {
    id: "owner",
    name: "Sanket Mohanty",
    designation:
      "AI Engineer · Generative AI Developer · Python Backend Developer",
    headline: "Building intelligent systems for the real world.",
    introduction:
      "I turn complex data into useful intelligence. My focus is on generative AI, document understanding, and the backend systems that bring them to life.",
    about:
      "I'm a computer science graduate and software engineering intern working at the intersection of AI and practical software development. I enjoy taking a problem from exploration to a working application—connecting models, data, and thoughtful engineering.",
    focus:
      "Chapter-aware multimodal RAG, multilingual AI, and reliable Python backends.",
    focusTitle: "Multimodal RAG",
    specializations: [
      {
        title: "Generative AI",
        body: "Useful applications, grounded in context.",
      },
      {
        title: "Document intelligence",
        body: "Making complex information accessible.",
      },
      {
        title: "Knowledge graphs",
        body: "Connecting ideas and their relationships.",
      },
      {
        title: "Backend APIs",
        body: "Reliable services that bring it all together.",
      },
      {
        title: "Multimodal RAG",
        body: "Retrieving meaning across text and images.",
      },
      {
        title: "Data-driven systems",
        body: "Turning analysis into practical decisions.",
      },
    ],
    goals:
      "Build reliable AI applications that help people make sense of complex information.",
    email: "sanketmohanty1304@gmail.com",
    phone: "",
    showPhone: false,
    location: "",
    image: "/images/sanket.png",
    resumeUrl: "/documents/Sanket_M_Resume.pdf",
  },
  projects,
  experience: [
    {
      id: "bandhure",
      company: "Bandhure Solution LLP",
      position: "SDE Intern",
      employmentType: "Internship",
      location: "Bengaluru, India",
      startDate: "Feb 2026",
      endDate: "Present",
      description:
        "Building educational AI and software experiences at Aivi.in, including the KNOI document-intelligence project.",
      technologies: [
        "Python",
        "FastAPI",
        "Qwen",
        "Qdrant",
        "Neo4j",
        "Playwright",
      ],
      link: "",
      published: true,
      displayOrder: 0,
      highlights: [
        "Refining chapter detection across headings, page structures, OCR variations, and ambiguous document boundaries.",
        "Improving multilingual educational responses with prompt engineering, textbook terminology, and source grounding.",
        "Working on chapter-aware retrieval, knowledge graphs, topic discovery, smart questions, and grounded summaries for KNOI.",
        "Developing the frontend of an Intelligent Attendance Management System.",
        "Automating core end-to-end user workflows with Playwright and Python.",
      ],
    },
    {
      id: "nalco",
      company: "National Aluminium Company Limited",
      position: "Data Analysis Intern",
      employmentType: "Internship",
      location: "Bhubaneswar, India",
      startDate: "Jun 2024",
      endDate: "Jul 2024",
      description:
        "Exploring commodity price data and building interactive reporting workflows at NALCO.",
      technologies: ["Power BI", "DAX", "Data modeling"],
      link: "",
      published: true,
      displayOrder: 1,
      highlights: [
        "Analyzed historical LME steel and aluminium price data.",
        "Designed interactive Power BI dashboards for reporting.",
        "Applied DAX formulas and data modeling to support analysis.",
      ],
    },
  ],
  skills: Object.entries({
    Programming: ["Python", "SQL", "Java", "C"],
    "AI & machine learning": [
      "Generative AI",
      "RAG",
      "Multimodal RAG",
      "Prompt engineering",
      "Knowledge graphs",
      "scikit-learn",
    ],
    "Deep learning": ["TensorFlow", "Keras", "LSTM", "GRU", "CNN"],
    "Backend & data": [
      "FastAPI",
      "PostgreSQL",
      "Qdrant",
      "Neo4j",
      "Pandas",
      "NumPy",
    ],
    "Tools & analytics": [
      "GitHub",
      "Playwright",
      "Power BI",
      "Excel",
      "Matplotlib",
      "Seaborn",
    ],
  }).flatMap(([category, names], ci) =>
    names.map((name, i) => ({
      id: `skill-${ci}-${i}`,
      name,
      category,
      icon: "",
      evidenceUrl: "",
      projectIds: [],
      published: true,
      displayOrder: ci * 10 + i,
    })),
  ),
  certifications: [
    {
      id: "itil",
      title: "ITIL V4 Introduction to Service Management Concepts",
      issuer: "",
      issueDate: "",
      credentialId: "",
      verificationUrl: "",
      previewUrl: "",
      category: "Service management",
      skills: [],
      published: false,
      displayOrder: 0,
    },
  ],
  education: [
    {
      id: "btech",
      degree: "Bachelor of Technology",
      institution: "Parala Maharaja Engineering College",
      location: "Berhampur, Odisha",
      startDate: "Nov 2022",
      endDate: "Jun 2026",
      specialization: "Computer Science",
      grade: "",
      coursework: [],
      achievements: "",
      published: true,
      displayOrder: 0,
    },
    {
      id: "secondary",
      degree: "Higher Secondary (12th Grade)",
      institution: "Stewart Science College",
      location: "Cuttack, Odisha",
      startDate: "Jul 2021",
      endDate: "Aug 2022",
      specialization: "",
      grade: "",
      coursework: [],
      achievements: "",
      published: true,
      displayOrder: 1,
    },
    {
      id: "school",
      degree: "Secondary Education (10th Grade)",
      institution: "Queen Mary's High School",
      location: "Cuttack, Odisha",
      startDate: "Apr 2019",
      endDate: "Jul 2020",
      specialization: "",
      grade: "",
      coursework: [],
      achievements: "",
      published: true,
      displayOrder: 2,
    },
  ],
  achievements: [],
  social: [
    {
      id: "github",
      label: "GitHub",
      url: "https://github.com/SANKETMOHANTY1304",
      published: true,
      displayOrder: 0,
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/sanketmohanty/",
      published: true,
      displayOrder: 1,
    },
  ],
  settings: {
    id: "site",
    title: "Sanket Mohanty — AI Engineer & Python Developer",
    description:
      "Explore Sanket Mohanty's work in generative AI, multimodal RAG, machine learning, and Python backend development.",
    showCertifications: true,
  },
};
export const fallbackPortfolio = publishedPortfolio(seedPortfolio);
