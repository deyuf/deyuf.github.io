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
    // To use a real avatar, drop the image at public/avatar.png and change this
    // value to "/avatar.png". A stylized SVG placeholder ships by default.
    avatar: "/avatar.png",
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
            longDescription: [
                "Roadside infrastructure cameras are critical for cooperative driving, but high-quality monocular 3D labels at scale are prohibitively expensive. WARM-3D leans on a synthetic twin of the TUM Traffic intersection (the TUMTraf Synthetic Dataset) and an off-the-shelf 2D detector to supervise a 3D student model in the real domain.",
                "The framework yields +12.40 % mAP3D over the baseline and reaches near-Oracle performance using only 2D ground truth as weak supervision. Built on top of MonoDETR; trained and evaluated on the real TUM Traffic deployment.",
            ],
            features: [
                "Synthetic dataset generation pipeline (TUMTraf Synthetic)",
                "Weak supervision from off-the-shelf 2D detectors",
                "Teacher–student domain adaptation loop",
                "+12.40 % mAP3D vs. baseline, near-Oracle accuracy",
                "Built on MonoDETR, evaluated on real roadside cameras",
            ],
            install:
                "git clone https://github.com/WARM-3D/WARM-3D && cd WARM-3D && pip install -r requirements.txt",
            meta: [
                { label: "Year", value: "2024" },
                { label: "Venue", value: "IEEE ITSC 2024" },
                { label: "Stack", value: "Python · PyTorch · CUDA · MonoDETR" },
                { label: "Role", value: "Lead author · M.Sc. thesis derivative" },
            ],
            coverImage:
                "https://raw.githubusercontent.com/deyuf/WARM-3D/main/Asset/TUMTraff-Synthetic.png",
            gallery: [
                {
                    src: "https://raw.githubusercontent.com/deyuf/WARM-3D/main/Asset/TUMTraff-Synthetic.png",
                    caption: "TUMTraf Synthetic Dataset — synthetic twin of the real roadside scene.",
                },
                {
                    src: "https://raw.githubusercontent.com/deyuf/WARM-3D/main/Asset/TUMTraff-Synthetic-distribution.png",
                    caption: "Class and pose distribution across the synthetic split.",
                },
                {
                    src: "https://raw.githubusercontent.com/deyuf/WARM-3D/main/Asset/2D_pesudo_label.png",
                    caption: "2D pseudo-label generation that drives the weak supervision signal.",
                },
                {
                    src: "https://raw.githubusercontent.com/deyuf/WARM-3D/main/Asset/matching1.png",
                    caption: "Cross-domain matching — stage 1.",
                },
                {
                    src: "https://raw.githubusercontent.com/deyuf/WARM-3D/main/Asset/matching2.png",
                    caption: "Cross-domain matching — stage 2.",
                },
                {
                    src: "https://raw.githubusercontent.com/deyuf/WARM-3D/main/Asset/matching3.png",
                    caption: "Cross-domain matching — stage 3.",
                },
            ],
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
            tagline: "Inspect, visualize and author URDF / xacro models inside VS Code",
            description:
                "A VS Code extension that brings interactive URDF and xacro visualization, joint control, semantic authoring (SRDF) and reachability analysis directly into the editor.",
            longDescription: [
                "URDF Studio collapses the gap between writing a robot description file and seeing the robot. Open any URDF or xacro in VS Code and a live 3D viewport — Three.js under the hood — opens beside the source. Drive joints, swap render modes, walk the link tree, and surface model issues as inline diagnostics.",
                "Beyond inspection, URDF Studio is built for authoring SRDF files: Monte-Carlo collision sampling to find self-collision pairs, workspace reachability clouds, pose bookmarking, and language services (hover, go-to-definition, document symbols, quick fixes) for URDF/SRDF/YAML.",
            ],
            features: [
                "Interactive 3D viewer with orbit/pan/zoom and preset angles",
                "Native URDF + xacro with on-the-fly expansion",
                "Joint sliders for revolute, continuous and prismatic joints",
                "ROS `package://` URI resolution",
                "Render modes (visual / collision / both, wireframe toggle)",
                "Link tree, TF frames, inertia ellipsoids",
                "Real-time diagnostics surfaced as VS Code issues",
                "SRDF / YAML support — joint groups, named states",
                "Monte-Carlo self-collision sampling",
                "Workspace reachability cloud generation",
                "Pose bookmarks + screenshot export",
                "Mesh formats: STL, COLLADA, OBJ, glTF / GLB",
            ],
            install: "Install from VS Code Marketplace — search \"URDF Studio\" or `deyuf.urdf-studio`",
            meta: [
                { label: "Year", value: "2025" },
                { label: "Platform", value: "VS Code extension" },
                { label: "Stack", value: "TypeScript · Three.js · esbuild · Playwright" },
                { label: "License", value: "MIT" },
            ],
            coverImage:
                "https://raw.githubusercontent.com/deyuf/urdf-studio/main/media/screenshots/viewer-joints.png",
            gallery: [
                {
                    src: "https://raw.githubusercontent.com/deyuf/urdf-studio/main/media/screenshots/viewer-joints.png",
                    caption: "Live 3D viewport with the Franka Research 3 loaded — toolbar, joint sliders and link / joint counts on the right.",
                },
                {
                    src: "https://raw.githubusercontent.com/deyuf/urdf-studio/main/media/screenshots/render-collision.png",
                    caption: "Collision-only render mode — FR3's self-collision primitives (capsules, cylinders) overlaid on the visual geometry.",
                },
                {
                    src: "https://raw.githubusercontent.com/deyuf/urdf-studio/main/media/screenshots/inspector-selected.png",
                    caption: "Inspector panel with `fr3_link4` selected — highlight bounding box, parent joint details, axis, limits, child joints, mesh paths.",
                },
            ],
            tags: ["TypeScript", "Three.js", "URDF", "VS Code"],
            links: {
                code: "https://github.com/deyuf/urdf-studio",
                marketplace:
                    "https://marketplace.visualstudio.com/items?itemName=deyuf.urdf-studio",
            },
            year: "2025",
            featured: true,
        },
        {
            slug: "rosight",
            title: "Rosight",
            tagline: "A keyboard-driven TUI cockpit for ROS 2",
            description:
                "Rosight = ROS + sight. A terminal cockpit that lets you browse the live ROS 2 graph — messages, nodes, services, actions, parameters, TF, bags, interfaces — and live-plot any numeric field, all from one screen without a mouse.",
            longDescription: [
                "Working with a real robot usually means SSH'ing into a headless box, running half a dozen `ros2 topic` / `ros2 service` / `ros2 bag` commands in different panes, and squinting at scrolling text. Rosight rolls all of that into a single Textual-based TUI that you drive from the keyboard.",
                "Nine tabs cover the surface area: live message stats (Hz / bandwidth / jitter), nodes and their pub/sub graph, services and actions, per-node parameters, multi-series plotting via plotext, the TF tree, bag recording / playback, and interface definitions. Auto-QoS negotiation matches publisher profiles, the runtime ROS_DOMAIN_ID can be swapped on the fly, and a `--no-ros` mode lets you develop the UI without a ROS install.",
            ],
            features: [
                "Messages — topic table, subscription, live Hz / bandwidth / jitter",
                "Nodes — discovery + publisher / subscriber / service relationships",
                "Services + Actions — listing with type info",
                "Parameters — per-node get / set",
                "Plot — multi-series live ANSI plotting with pause / export",
                "TF — auto-generated frame trees from `/tf`",
                "Bags — record, play, inspect",
                "Interfaces — message / service / action definitions",
                "Auto-QoS negotiation; runtime domain switch",
                "No-ROS UI development mode",
            ],
            install: "pip install rosight",
            meta: [
                { label: "Year", value: "2025" },
                { label: "Platform", value: "Linux · macOS (terminal / SSH / tmux)" },
                { label: "Stack", value: "Python ≥ 3.10 · Textual · rclpy · plotext" },
                { label: "License", value: "MIT" },
            ],
            coverImage:
                "https://raw.githubusercontent.com/deyuf/rosight/main/docs/screenshots/01-messages.png",
            gallery: [
                {
                    src: "https://raw.githubusercontent.com/deyuf/rosight/main/docs/screenshots/01-messages.png",
                    caption: "Messages tab — topic table, live subscription, Hz / bandwidth.",
                },
                {
                    src: "https://raw.githubusercontent.com/deyuf/rosight/main/docs/screenshots/02-nodes.png",
                    caption: "Nodes tab — discovery and pub / sub / service relationships.",
                },
                {
                    src: "https://raw.githubusercontent.com/deyuf/rosight/main/docs/screenshots/03-services.png",
                    caption: "Services tab — type information at a glance.",
                },
                {
                    src: "https://raw.githubusercontent.com/deyuf/rosight/main/docs/screenshots/04-actions.png",
                    caption: "Actions tab — action server browsing.",
                },
                {
                    src: "https://raw.githubusercontent.com/deyuf/rosight/main/docs/screenshots/06-bags.png",
                    caption: "Bags tab — recording / playback / info inspection.",
                },
            ],
            tags: ["ROS 2", "Python", "TUI", "Robotics Tooling"],
            links: {
                code: "https://github.com/deyuf/rosight",
                pypi: "https://pypi.org/project/rosight/",
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
