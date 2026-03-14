import { HeroSection } from '@/components/home/hero-section'
import { PhilosophySection } from '@/components/home/philosophy-section'
import { FeaturedProjectsSection } from '@/components/home/featured-projects-section'
import { ServicesSection } from '@/components/home/services-section'
import { ProcessSection } from '@/components/home/process-section'
import { TeamSection } from '@/components/home/team-section'
import { CTASection } from '@/components/home/cta-section'
import { getFeaturedProjects, getHeroProjects } from '@/lib/projects'

export default async function Home() {
  const [heroProjects, featuredProjects] = await Promise.all([
    getHeroProjects(),
    getFeaturedProjects(),
  ])

  return (
    <>
      <HeroSection projects={heroProjects} />
      <PhilosophySection />
      <FeaturedProjectsSection projects={featuredProjects} />
      <ServicesSection />
      <ProcessSection />
      <TeamSection />
      <CTASection />
    </>
  )
}
