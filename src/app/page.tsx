import { Nav } from "@/components/nav/Nav";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/about/About";
import { Projects } from "@/components/projects/Projects";
import { Timeline } from "@/components/experience/Timeline";
import { Publications } from "@/components/publications/Publications";
import { SkillsGrid } from "@/components/skills/SkillsGrid";
import { Contact } from "@/components/contact/Contact";
import { Footer } from "@/components/footer/Footer";
import { SectionIndicator } from "@/components/ui/SectionIndicator";
import { NoiseOverlay } from "@/components/ui/NoiseOverlay";

export default function Home() {
  return (
    <>
      <NoiseOverlay />
      <Nav />
      <SectionIndicator />
      <main className="relative">
        <Hero />
        <About />
        <Projects />
        <Timeline />
        <Publications />
        <SkillsGrid />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
