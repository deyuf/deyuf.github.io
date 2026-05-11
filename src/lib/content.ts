import {
  Cpu,
  Eye,
  Boxes,
  Wrench,
  Layers,
  Brain,
} from "lucide-react";
import type { SiteContent } from "./types";

// NOTE: The email is split into two halves so naive scraping bots cannot
// trivially harvest a complete address from the static HTML.
// The Contact component reassembles it client-side on user gesture.
export const siteContent: SiteContent = {
  name: "Deyu Fu",
  initials: "DF",
  eyebrow: "Robotics Software Engineer",
  tagline:
    "I bridge the gap between the digital and physical worlds, giving AI a tangible presence.",
  heroSubhead:
    "I build perception, learning and control systems for robots — from physical simulation to real-world deployment.",
  about: [
    "I'm a robotics software engineer based in Munich, working at the intersection of reinforcement learning, dexterous manipulation and physical simulation.",
    "My focus is closing the loop between high-fidelity simulation and the messy real world — the perception, control and policy stacks that let humanoid and manipulator systems act with intent.",
  ],
  quickFacts: [
    { label: "Based in", value: "Munich, Germany" },
    { label: "Focus", value: "Reinforcement Learning · Dexterous Manipulation · Sim2Real" },
    { label: "Stack", value: "Python · C++ · ROS · PyTorch · Linux" },
    { label: "Open to", value: "Collaboration · Open-source" },
  ],
  projects: [
    {
      slug: "warm-3d",
      title: "WARM-3D",
      tagline: "Weakly-supervised Sim2Real for roadside 3D detection",
      description:
        "A weakly-supervised Sim2Real domain adaptation framework for monocular 3D object detection on roadside infrastructure. Closes the simulation-to-reality gap with synthetic supervision and a domain-adaptive teacher–student loop.",
      tags: ["Sim2Real", "3D Detection", "PyTorch", "ITSC 2024"],
      links: {
        paper: "https://arxiv.org/abs/2407.20818",
        code: "https://github.com/deyuf/WARM-3D",
      },
      year: "2024",
      featured: true,
    },
    {
      slug: "urdf-studio",
      title: "URDF Studio",
      tagline: "A modern, browser-native URDF editor and viewer",
      description:
        "An interactive workspace for inspecting, editing and exporting URDF robot descriptions in the browser. Built for the workflow of building and iterating on physical robot models without leaving the tab.",
      tags: ["TypeScript", "Three.js", "URDF", "Robotics Tooling"],
      links: {
        code: "https://github.com/deyuf/urdf-studio",
      },
      year: "2025",
      featured: true,
    },
    {
      slug: "rosight",
      title: "Rosight",
      tagline: "A keyboard-driven TUI cockpit for ROS 2",
      description:
        "A terminal interface for ROS 2 — browse live message graphs, nodes, services, actions, parameters, TF frames and recorded bags, with live plotting of numeric fields. Auto-QoS negotiation, runtime domain switching, and a no-ROS dev mode. Built for SSH, tmux and headless robot consoles where the mouse isn't an option.",
      tags: ["ROS 2", "Python", "TUI", "Robotics Tooling"],
      links: {
        code: "https://github.com/deyuf/rosight",
      },
      year: "2025",
      featured: true,
    },
  ],
  experience: [
    {
      period: "Aug 2024 — Present",
      role: "Robotics Software Engineer",
      org: "Agile Robots SE",
      location: "Munich, Germany",
      summary:
        "Robot learning across reinforcement learning, dexterous manipulation and physical simulation. Building the policy and infrastructure layers behind the next generation of humanoid systems.",
      tags: ["Reinforcement Learning", "Manipulation", "Physical Simulation"],
    },
    {
      period: "Nov 2023 — Aug 2024",
      role: "Working Student · Robotics & AI",
      org: "Agile Robots SE",
      location: "Munich, Germany",
      summary:
        "Robot manipulation and motion planning. Bridged research prototypes and production-bound robot stacks.",
      tags: ["Motion Planning", "Manipulation"],
    },
  ],
  education: [
    {
      period: "Oct 2021 — 2023",
      institution: "Technical University of Munich",
      degree: "M.Sc.",
      field: "Robotics, Cognition, Intelligence",
      highlight: "Top of class · Deutschlandstipendium",
      location: "Munich, Germany",
    },
    {
      period: "Sep 2016 — Jun 2021",
      institution: "Tongji University",
      degree: "B.Eng.",
      field: "Vehicle Engineering",
      highlight: "Distinguished Graduate",
      location: "Shanghai, China",
    },
  ],
  publications: [
    {
      venue: "IEEE ITSC",
      year: "2024",
      title:
        "WARM-3D: A Weakly-Supervised Sim2Real Domain Adaptation Framework for Roadside Monocular 3D Object Detection",
      authors: "Deyu Fu et al.",
      tldr: "Weakly-supervised Sim2Real adaptation closes the synthetic-to-real gap for monocular 3D detection on roadside infrastructure cameras.",
      links: {
        arxiv: "https://arxiv.org/abs/2407.20818",
        code: "https://github.com/deyuf/WARM-3D",
      },
    },
  ],
  skills: [
    {
      title: "Robot Learning",
      description:
        "Reinforcement learning, imitation learning and policy training for manipulation and locomotion.",
      icon: Brain,
      items: ["Reinforcement Learning", "Imitation Learning", "Policy Training"],
    },
    {
      title: "Manipulation & Control",
      description:
        "Dexterous manipulation, motion planning and low-level control on real and simulated platforms.",
      icon: Boxes,
      items: ["Dexterous Manipulation", "Motion Planning", "ROS"],
    },
    {
      title: "Perception & Vision",
      description:
        "3D object detection, Sim2Real domain adaptation, Visual SLAM and scene understanding.",
      icon: Eye,
      items: ["3D Detection", "Visual SLAM", "Sim2Real"],
    },
    {
      title: "Physical Simulation",
      description:
        "High-fidelity physical simulation pipelines for training, validation and synthetic data.",
      icon: Cpu,
      items: ["Isaac Sim", "MuJoCo", "Synthetic Data"],
    },
    {
      title: "Deep Learning",
      description:
        "Deep learning frameworks and the model-training stack behind modern robotic perception and policy learning.",
      icon: Layers,
      items: ["PyTorch", "Deep Learning", "Machine Learning"],
    },
    {
      title: "Engineering",
      description:
        "Production-grade C++/Python, Linux toolchains, and the glue between research and product.",
      icon: Wrench,
      items: ["C++", "Python", "Linux"],
    },
  ],
  honors: [
    {
      title: "Deutschlandstipendium",
      org: "Technische Universität München",
      year: "2023",
    },
    {
      title: "Distinguished Graduate",
      org: "Tongji University",
      year: "2021",
    },
  ],
  languages: [
    { name: "English", level: "Professional · IELTS 8.0" },
    { name: "German", level: "Goethe B2" },
    { name: "Chinese", level: "Native" },
  ],
  contact: {
    emailParts: { user: "ZnVkZXl1MA==", domain: "Z21haWwuY29t" }, // base64 obfuscation
    github: [
      { handle: "deyuf", url: "https://github.com/deyuf", label: "Personal" },
    ],
    linkedin: "https://www.linkedin.com/in/deyu-fu",
  },
};
