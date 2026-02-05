import Head from 'next/head';
import HeroSection from '../components/landing/HeroSection';
import StatsSection from '../components/landing/StatsSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import BenefitsSection from '../components/landing/BenefitsSection';
import CTASection from '../components/landing/CTASection';
import { stats, benefits } from '../utils/landingData';

export default function Home() {

  return (
    <>
      <Head>
        <title>Milking Tracker - Home</title>
        <meta name="description" content="Track milking sessions with relaxing music" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="landing-page">
        <HeroSection />
        <StatsSection stats={stats} />
        <FeaturesSection />
        <BenefitsSection benefits={benefits} />
        <CTASection />
      </div>
    </>
  );
}
