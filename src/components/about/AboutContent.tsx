'use client';

import { AboutHero } from '@/components/about/AboutHero';
import { AboutStory } from '@/components/about/AboutStory';
import { AboutMissionVision } from '@/components/about/AboutMissionVision';
import { AboutWhyChooseUs } from '@/components/about/AboutWhyChooseUs';
import { AboutHowItWorks } from '@/components/about/AboutHowItWorks';
import { AboutStatistics } from '@/components/about/AboutStatistics';
import { AboutValues } from '@/components/about/AboutValues';
import { AboutCTA } from '@/components/about/AboutCTA';
import { aboutData } from '@/data/about';

export function AboutContent() {
  return (
    <main className="flex-1">
      <AboutHero data={aboutData.hero} />
      <AboutStory data={aboutData.story} />
      <AboutMissionVision data={aboutData.missionVision} />
      <AboutWhyChooseUs data={aboutData.whyChooseUs} />
      <AboutHowItWorks data={aboutData.howItWorks} />
      <AboutStatistics data={aboutData.statistics} />
      <AboutValues data={aboutData.values} />
      <AboutCTA data={aboutData.cta} />
    </main>
  );
}
