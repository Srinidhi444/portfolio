// ============================================================
//  EDIT THIS FILE to update all site content
// ============================================================

export const profile = {
  name: "Srinidhi Kulkarni",
  title: "Full-Stack Engineer & Web3 Learner",
  tagline: "I build full-stack applications, think deeply about system design, and I am currently learning Ethereum-based web3 development.",
  location: "Pune, Maharashtra, IN",
  avatar: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=srinidhi&backgroundColor=0f0f0f",
  stats: [
    
    { label: "Experience", value: "6 mo" },
    { label: "Location", value: "Pune, IN" },
  ],
  links: {
    github:   "https://github.com/Srinidhi444",
    linkedin: "https://www.linkedin.com/in/srinidhi-kulkarni-1326a92b8/",
    medium:   "https://medium.com/@kulkarnisrinidhi85",
    twitter:  "https://x.com/Srinidhi_kul",
    email:    "kulkarnisrinidhi85@gmail.com"
  }
};

export const skills = [
  { category: "Languages",    items: ["C++", "Python", "JavaScript", "Solidity"] },
  { category: "Frameworks",   items: ["React.js", "Node.js", "Express.js", "Next.js", "Foundry"] },
  { category: "Technologies", items: ["WebSockets", "Redis", "Tailwind CSS", "Prisma", "Microservices"] },
  { category: "Databases",    items: ["PostgreSQL", "MongoDB"] },
  { category: "Tools",        items: ["Git", "GitHub", "Postman", "VS Code", "Docker"] }
];

export const experiences = [
  {
    role: "Frontend Developer Intern",
    company: "Voxket AI",
    period: "Oct 2025 – Apr 2026 · 6 months",
    desc: "Developed and optimised user-facing interfaces for an AI workforce platform using Next.js, React.js, TypeScript, and Tailwind CSS. Built reusable UI components, integrated frontend applications with backend APIs, improved application responsiveness, contributed to AI-powered voice, chat, and workflow automation features, and published an npm package used by SBI Bank's website.",
    tags: ["Next.js", "React.js", "TypeScript", "Tailwind CSS", "npm"]
  }
];

export const projects = [
  {
    id: 1,
    title: "Exchange Engine",
    subtitle: "Real-Time Crypto Exchange",
    date: "2025-11",
    tags: ["Node.js", "WebSockets", "Redis", "PostgreSQL"],
    desc: "A full-stack exchange project with live order books, real-time trade streams, matching flow design, and scalable service architecture for trading data and execution.",
    github: "https://github.com/Srinidhi444/Exchange",
    demo: { enabled: false, url: "" },
    image: "assets/image4.png",
    accent: "#ffffff"
  },
  {
    id: 2,
    title: "Fundraiser",
    subtitle: "Crowdfunding Platform",
    date: "2025-08",
    tags: ["React.js", "Node.js", "MongoDB", "Cloudinary"],
    desc: "A full-stack crowdfunding platform featuring fundraiser creation, secure authentication, donation tracking, user dashboards, and organiser engagement tools.",
    github: "https://github.com/Srinidhi444/Fundraiser",
    demo: { enabled: true, url: "https://fundraiser-hazel.vercel.app/" },
    image: "assets/image2.png",
    accent: "#ffffff"
  },
  {
    id: 3,
    title: "GradeX",
    subtitle: "Blockchain Evaluation Platform",
    date: "2025-10",
    tags: ["Next.js", "MongoDB", "Solidity", "MCP"],
    desc: "A blockchain-based evaluation platform designed for transparent academic workflows, secure result handling, and verifiable grading-related records.",
    github: "https://github.com/Srinidhi444/BlockChain-Based-Evaluation-Platform",
    demo: { enabled: true, url: "https://block-chain-based-evaluation-platfo.vercel.app/" },
    image: "assets/image3.png",
    accent: "#ffffff"
  },
  {
    id: 4,
    title: "FloatChat AI",
    subtitle: "ARGO Float Explorer",
    date: "2025-06",
    tags: ["Streamlit", "Python", "RAG"],
    desc: "An AI-powered oceanographic analysis platform that combines RAG-based querying with interactive visualisations for exploring ARGO float datasets.",
    github: "https://github.com/Srinidhi444/ARGO-Float-chatbot",
    demo: { enabled: false, url: "" },
    image: "assets/image.png",
    accent: "#ffffff"
  }
];

export const blogs = [
  {
    title: "Building a Low-Latency Exchange from Scratch",
    desc: "Deep dive into order books, live matching flow, trade broadcasts, and backend architecture decisions.",
    date: "2026-06",
    url: "https://medium.com/@kulkarnisrinidhi85/building-a-low-latency-exchange-architecture-orderbook-and-real-time-trading-flow-dc46398d4fc5"
  }
];