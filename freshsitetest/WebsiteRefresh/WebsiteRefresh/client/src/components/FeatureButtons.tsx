const features = [
  {
    name: "Android Mods",
    href: "https://Why",
    className: "bg-blue-700 hover:bg-blue-600"
  },
  {
    name: "Link Generator",
    href: "https://ohnogen",
    className: "bg-red-600 hover:bg-red-500"
  },
  {
    name: "Social Boost",
    href: "https://soceleboos",
    className: "bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 hover:from-red-600 hover:via-yellow-600 hover:to-blue-600"
  }
];

const FeatureButtons = () => {
  return (
    <section className="w-full max-w-md mx-auto mb-8">
      <h2 className="text-xl font-orbitron font-semibold mb-4 text-center text-cyber-blue">Featured Services</h2>
      
      {features.map((feature, index) => (
        <a 
          key={index}
          href={feature.href} 
          target="_blank" 
          rel="noopener noreferrer"
          className={`feature-button block w-full ${feature.className} text-white font-orbitron font-semibold py-3 px-6 rounded-md mb-3 text-center transition-all shadow-lg hover:shadow-xl`}
        >
          {feature.name}
        </a>
      ))}
    </section>
  );
};

export default FeatureButtons;
