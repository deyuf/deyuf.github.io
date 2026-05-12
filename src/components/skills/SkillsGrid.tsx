import { siteContent } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { Marquee } from "@/components/ui/Marquee";

const KEYWORDS = [
  "Reinforcement Learning",
  "Manipulation",
  "Sim2Real",
  "Visual SLAM",
  "PyTorch",
  "ROS",
  "C++",
  "Python",
  "Linux",
  "3D Detection",
  "Motion Planning",
  "Physical Simulation",
];

export function SkillsGrid() {
  return (
    <section id="skills" className="section">
      <Reveal>
        <p className="eyebrow mb-4">Capabilities</p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="display mb-12 max-w-3xl text-4xl md:text-5xl">
          The stack I think and build in.
        </h2>
      </Reveal>
      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border md:grid-cols-2 lg:grid-cols-3">
        {siteContent.skills.map((skill, i) => {
          const Icon = skill.icon;
          return (
            <Reveal key={skill.title} delay={i * 0.04}>
              <div
                className="h-full bg-bg p-7 transition-colors hover:bg-surface"
                style={{ background: "var(--color-bg)" }}
              >
                <Icon
                  size={22}
                  strokeWidth={1.4}
                  style={{ color: "var(--color-accent)" }}
                />
                <h3 className="mt-5 text-lg font-medium">{skill.title}</h3>
                <p className="mt-2 text-sm leading-relaxed muted">
                  {skill.description}
                </p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {skill.items.map((it) => (
                    <li
                      key={it}
                      className="rounded border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider muted"
                    >
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          );
        })}
      </div>

      <div className="mt-20">
        <Marquee>
          {KEYWORDS.map((k) => (
            <span
              key={k}
              className="display whitespace-nowrap text-4xl text-fg-faint md:text-6xl"
              style={{ color: "var(--color-fg-faint)" }}
            >
              {k} <span style={{ color: "var(--color-accent)" }}>·</span>
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
