import Header from "@/components/Header";
import FeatureButtons from "@/components/FeatureButtons";
import SocialLinks from "@/components/SocialLinks";
import Footer from "@/components/Footer";

const Home = () => {
  return (
    <div className="relative min-h-screen z-10 flex flex-col">
      <Header />

      <main className="flex-grow flex flex-col items-center justify-between px-4 md:px-8 pt-6 pb-24">
        {/* Advertisement Area (Top) */}
        <div className="w-full max-w-4xl mx-auto bg-cyber-dark-alt rounded-lg p-2 mb-8 border border-cyber-dark-light">
          <ins className="adsbygoogle"
              style={{ display: 'block', textAlign: 'center', width: '100%', maxWidth: '970px', height: '90px', margin: '0 auto' }}
              data-ad-client="ca-pub-9422653444872706"
              data-ad-slot="5846791848"
              data-ad-format="horizontal"
              data-full-width-responsive="true"></ins>
        </div>
        
        <FeatureButtons />
        <SocialLinks />
        
        {/* Advertisement Area (Bottom) */}
        <div className="w-full max-w-4xl mx-auto bg-cyber-dark-alt rounded-lg p-2 mt-8 border border-cyber-dark-light">
          <ins className="adsbygoogle"
              style={{ display: 'inline-block', width: '120px', height: '50px' }}
              data-ad-client="ca-pub-9422653444872706"
              data-ad-slot="3888178071"></ins>
        </div>
      </main>

      <Footer />

      {/* Animated Background Elements */}
      <div className="fixed top-0 left-0 w-full h-screen -z-10 overflow-hidden opacity-30">
        {/* Vertical Lines */}
        <div className="absolute h-full w-px bg-cyber-blue left-1/4 opacity-20"></div>
        <div className="absolute h-full w-px bg-cyber-pink left-1/2 opacity-20"></div>
        <div className="absolute h-full w-px bg-cyber-green left-3/4 opacity-20"></div>
        
        {/* Horizontal Lines */}
        <div className="absolute w-full h-px bg-cyber-blue top-1/4 opacity-20"></div>
        <div className="absolute w-full h-px bg-cyber-pink top-1/2 opacity-20"></div>
        <div className="absolute w-full h-px bg-cyber-green top-3/4 opacity-20"></div>
      </div>
    </div>
  );
};

export default Home;
