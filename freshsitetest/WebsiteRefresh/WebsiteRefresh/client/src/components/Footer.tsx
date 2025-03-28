const Footer = () => {
  return (
    <footer className="absolute bottom-0 w-full py-4 bg-cyber-dark-alt border-t border-cyber-dark-light">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-gray-400">
          <a href="mailto:cheatxplorer@gmail.com" className="hover:text-cyber-blue transition-colors">
            cheatxplorer@gmail.com
          </a>
        </p>
        <p className="text-xs text-gray-600 mt-1">© {new Date().getFullYear()} CheatXplorer. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
