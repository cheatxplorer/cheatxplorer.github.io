const socialLinks = [
  {
    name: "Discord",
    href: "https://dcCord",
    imgSrc: "https://i.imgur.com/ecPhcSo.png",
    borderColor: "border-cyber-blue"
  },
  {
    name: "YouTube",
    href: "https://yt",
    imgSrc: "https://i.imgur.com/mJ68wac.png",
    borderColor: "border-cyber-pink"
  },
  {
    name: "Ko-fi",
    href: "https://kapekape",
    imgSrc: "https://storage.ko-fi.com/cdn/logomarkLogo.png",
    borderColor: "border-cyber-green"
  }
];

const SocialLinks = () => {
  return (
    <section className="w-full max-w-lg mx-auto mt-auto">
      <h2 className="text-xl font-orbitron font-semibold mb-4 text-center text-cyber-pink">Connect With Us</h2>
      
      <div className="flex flex-wrap justify-center gap-4">
        {socialLinks.map((link, index) => (
          <a 
            key={index}
            href={link.href} 
            target="_blank"
            rel="noopener noreferrer" 
            className={`nav-button flex items-center justify-center bg-cyber-dark-alt hover:bg-cyber-dark-light border-2 ${link.borderColor} text-white px-5 py-3 rounded-md transition-all shadow-lg`}
          >
            <img src={link.imgSrc} alt={link.name} className="w-5 h-5 mr-2" />
            <span className="font-orbitron font-medium">{link.name}</span>
          </a>
        ))}
      </div>
    </section>
  );
};

export default SocialLinks;
