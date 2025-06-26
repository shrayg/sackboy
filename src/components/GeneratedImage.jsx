import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const GeneratedImage = ({ imageUrl, isGenerating }) => {
  const downloadImage = (imageUrl) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `sackboy-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        <p className="text-gray-300 font-semibold">Creating your Sackboy...</p>
      </div>
    );
  }

  if (imageUrl) {
    return (
      <div className="space-y-4">
        <div className="aspect-square rounded-lg overflow-hidden bg-white">
          <img 
            src={imageUrl} 
            alt="Generated Sackboy" 
            className="w-full h-full object-cover"
          />
        </div>
        <Button
          onClick={() => downloadImage(imageUrl)}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
      <div className="w-16 h-16 mb-4 bg-gray-800 rounded-lg flex items-center justify-center">
        <div className="w-8 h-8 bg-gray-600 rounded"></div>
      </div>
      <p>Your generated Sackboy will appear here</p>
    </div>
  );
};

export default GeneratedImage;

