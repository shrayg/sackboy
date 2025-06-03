import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download } from 'lucide-react';
interface GeneratedImageProps {
  imageUrl: string | null;
  isGenerating: boolean;
}

const GeneratedImage = ({ imageUrl, isGenerating }: GeneratedImageProps) => {
  const downloadImage = () => {
    if (!imageUrl) return;
    
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `beybladez-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const loadingMessages = [
    "Charging the Bit-Beast...",
    "Calibrating the Attack Ring...", 
    "Polishing the Performance Tip...",
    "Aligning the Weight Disk...",
    "Fixing the Combobulator...",
    "Adjusting Spin Velocity...",
    "Engaging Battle Mode...",
    "Channeling Dragoon's Power...",
    "Consulting the Beyblade Spirits...",
    "Maximizing RPM Output...",
    "Stabilizing Gyro Systems...",
    "Let it R.I.P-ing...",
  ];

  const [loadingMessageIndex, setLoadingMessageIndex] = React.useState(0);

  React.useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  if (isGenerating) {
    return (
      <Card className="bg-gray-800/50 border-gray-600 p-3 text-center flex flex-col items-center justify-center gap-3">
        <svg className="w-full h-full rounded generating-content" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_386_47)">
            <rect width="800" height="800" fill="black" />
            <g filter="url(#filter0_f_386_47)">
              <ellipse id="ellipse0" cx="584.204" cy="238.999" rx="194.083" ry="202.219" fill="url(#paint0_linear_386_47)" />
              <ellipse id="ellipse1" cx="510.876" cy="460.161" rx="226.91" ry="116.139" fill="url(#paint1_linear_386_47)" />
              <ellipse id="ellipse2" cx="183.522" cy="576.159" rx="151.522" ry="209.159" fill="url(#paint2_linear_386_47)" />
              <ellipse id="ellipse3" cx="566.359" cy="647.632" rx="211.359" ry="201.632" fill="url(#paint3_linear_386_47)" />
              <ellipse id="ellipse4" cx="192.088" cy="159.74" rx="143.088" ry="222.74" fill="url(#paint4_linear_386_47)" />
            </g>
          </g>
          <defs>
            <filter id="filter0_f_386_47" x="-268" y="-363" width="1346.29" height="1512.26" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur stdDeviation="150" result="effect1_foregroundBlur_386_47" />
            </filter>
            <linearGradient id="paint0_linear_386_47" x1="390.12" y1="238.999" x2="778.287" y2="238.999" gradientUnits="userSpaceOnUse">
              <stop stop-color="#0499EA" />
              <stop offset="1" stop-color="#0499EA" stop-opacity="0.7" />
            </linearGradient>
            <linearGradient id="paint1_linear_386_47" x1="283.966" y1="460.161" x2="737.786" y2="460.161" gradientUnits="userSpaceOnUse">
              <stop stop-color="#02D79E" />
              <stop offset="1" stop-color="#02D79E" stop-opacity="0.7" />
            </linearGradient>
            <linearGradient id="paint2_linear_386_47" x1="32" y1="576.159" x2="335.045" y2="576.159" gradientUnits="userSpaceOnUse">
              <stop stop-color="#85F975" />
              <stop offset="1" stop-color="#85F975" stop-opacity="0.7" />
            </linearGradient>
            <linearGradient id="paint3_linear_386_47" x1="355" y1="647.632" x2="777.718" y2="647.632" gradientUnits="userSpaceOnUse">
              <stop stop-color="#93C9EB" />
              <stop offset="1" stop-color="#93C9EB" stop-opacity="0.7" />
            </linearGradient>
            <linearGradient id="paint4_linear_386_47" x1="49" y1="159.74" x2="335.176" y2="159.74" gradientUnits="userSpaceOnUse">
              <stop stop-color="#BB83F9" />
              <stop offset="1" stop-color="#BB83F9" stop-opacity="0.7" />
            </linearGradient>
            <clipPath id="clip0_386_47">
              <rect width="800" height="800" fill="white" />
            </clipPath>
          </defs>
        </svg>
        <p className="text-xl font-semibold">{loadingMessages[loadingMessageIndex]}</p>
      </Card>
    );
  }

  if (!imageUrl) {
    return (
      <Card className="bg-gray-800/50 border-gray-600 p-8 text-center">
        <div className="text-gray-400">
          <div className="text-4xl mb-4">🎯</div>
          <p className="text-gray-400">Your personalized <strong>beybladez</strong> will appear here</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/50 border-gray-600 p-4">
      <div className="space-y-4">
        <div className="aspect-square rounded-lg overflow-hidden bg-white">
          <img 
            src={imageUrl} 
            alt="Generated beybladez" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={downloadImage}
            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white border-0"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default GeneratedImage;
