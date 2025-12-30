import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import TransitionSection from '@/components/TransitionSection';
import ValuePropSection from '@/components/ValuePropSection';
import FinalCTASection from '@/components/FinalCTASection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="bg-background">
      <Header />
      <HeroSection />
      <TransitionSection />
      <ValuePropSection />
      <FinalCTASection />
      <Footer />
    </div>
  );
};

export default Index;
