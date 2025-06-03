import { Button } from "@/components/ui/button";
import { Copy, Sparkles, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Beams from '@/components/beams';
import { useState } from "react";

const Index = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleCopy = () => {
    const textToCopy = "soon";
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[rgba(0,0,0,0.9)] text-white">
      <div style={{
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -1,
        pointerEvents: 'none'
      }}>
        <Beams
          beamWidth={2}
          beamHeight={15}
          beamNumber={12}
          lightColor="#ffffff"
          speed={2}
          noiseIntensity={1.4}
          scale={0.2}
          rotation={30}
        />
      </div>

      {/* Header */}
      <header className="p-4 md:p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold text-silver-400">$beybladez</h1>
          
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-silver-300 hover:bg-gray-900 border border-gray-700 hover:border-silver-400"
          >
            <Menu size={24} />
          </Button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/generator')}
              className="text-silver-300 hover:bg-gray-900 border border-gray-700 hover:border-silver-400"
            >
              Generator
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate('/gallery')}
              className="text-silver-300 hover:bg-gray-900 border border-gray-700 hover:border-silver-400"
            >
              Gallery
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate('/beyblade')}
              className="text-silver-300 hover:bg-gray-900 border border-gray-700 hover:border-silver-400"
            >
              Let it rip.
            </Button>
            <Button
              asChild
              variant="ghost"
              className="text-silver-300 hover:bg-gray-900 border border-gray-700 hover:border-silver-400"
            >
              <a
                href="https://x.com/i/communities/1928460541435273435"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 300 301" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M178.57 127.044L290.27 0H263.81L166.78 110.288L89.34 0H0L117.13 166.791L0 300H26.46L128.86 183.507L210.66 300H300M36.01 19.5237H76.66L263.79 281.435H223.13" fill="currentColor" />
                </svg>
                <span>Community</span>
              </a>
            </Button>
          </nav>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 flex flex-col gap-2 animate-fade-in">
            <Button
              variant="ghost"
              onClick={() => navigate('/generator')}
              className="w-full text-silver-300 hover:bg-gray-900 border border-gray-700 hover:border-silver-400"
            >
              Generator
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate('/beyblade')}
              className="text-silver-300 hover:bg-gray-900 border border-gray-700 hover:border-silver-400"
            >
              Let it rip.
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate('/gallery')}
              className="w-full text-silver-300 hover:bg-gray-900 border border-gray-700 hover:border-silver-400"
            >
              Gallery
            </Button>
            <Button
              asChild
              variant="ghost"
              className="w-full text-silver-300 hover:bg-gray-900 border border-gray-700 hover:border-silver-400"
            >
              <a
                href="https://x.com/i/communities/1928460541435273435"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 300 301" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M178.57 127.044L290.27 0H263.81L166.78 110.288L89.34 0H0L117.13 166.791L0 300H26.46L128.86 183.507L210.66 300H300M36.01 19.5237H76.66L263.79 281.435H223.13" fill="currentColor" />
                </svg>
                <span>Community</span>
              </a>
            </Button>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-6 py-12 md:py-20 text-center">
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          <div className="flex flex-col animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <h1 style={{ color: 'transparent', backgroundClip: 'text', backgroundImage: 'linear-gradient(to right, #218bff, #c084fc, #db2777)', lineHeight: '140%' }} className="text-5xl md:text-7xl lg:text-8xl font-bold title-animate">
              $beybladez
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-400 mb-8 md:mb-12 leading-relaxed">
              Let it rip!
            </p>
          </div>

          <div className="flex flex-col gap-4 p-6 md:p-10 rounded-lg shadow-lg bg-gradient-to-r from-gray-800 to-gray-700 gap-2 hover:bg-[length:200%_200%] hover:bg-right text-silver-300 border border-gray-600 transition-all duration-700 group animate-fade-in" style={{ backgroundSize: '200% 200%', backgroundPosition: 'left', animationDelay: '0.6s' }}>
            <h1 className="text-lg md:text-xg font-semibold text-gray-300">Official Contract Address (CA):</h1>
            <code className="flex flex-col md:flex-row justify-between items-center text-silver-300 font-mono text-sm md:text-base break-all bg-black/20 p-2 rounded-lg border border-white/10 transition-all duration-300 group-hover:border-white/30 group-hover:bg-black/30">
              <span className="flex-1 text-center mb-2 md:mb-0">soon</span>
              <div
                onClick={handleCopy}
                className="p-1 cursor-pointer flex flex-col gap-4 rounded border-[1px] border-white/10 hover:bg-white/10 transition-colors relative"
              >
                <Copy width={18} height={18} />
                {copied && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-sm whitespace-nowrap">
                    Copied!
                  </div>
                )}
              </div>
            </code>
          </div>

          <Button
            onClick={() => navigate('/generator')}
            className="text-lg md:text-xl font-semibold px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 cursor-pointer items-center w-full md:w-fit mx-auto flex gap-2 rounded-lg shadow-lg hover:shadow-blue-500/20 animate-fade-in"
            style={{ animationDelay: '0.8s' }}
          >
            <Sparkles size={24} className="md:w-8 md:h-8" />
            Start Generating
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-4 md:bottom-6 left-4 md:left-6 text-xs md:text-sm text-gray-500 animate-fade-in" style={{ animationDelay: '1s' }}>
        <p>Refresh if there are any issues.</p>
      </footer>
    </div>
  );
};

export default Index;

// Add this at the end of the file
const styles = `
@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(15px) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes titleReveal {
  0% {
    opacity: 0;
    transform: translateY(15px) scale(0.98);
    letter-spacing: -0.1em;
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
    letter-spacing: normal;
  }
}

.animate-fade-in {
  opacity: 0;
  animation: fadeIn 0.9s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.title-animate {
  opacity: 0;
  animation: titleReveal 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
`;

// Add the styles to the document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}
