import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

const ImageUpload = ({ onImageUpload }) => {
  const [dragOver, setDragOver] = useState(false);

  const handleFileInput = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageUpload(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageUpload(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragOver(false);
  };

  return (
    <div 
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        dragOver 
          ? 'border-purple-400 bg-purple-400/10' 
          : 'border-gray-600 hover:border-gray-500'
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
      <div className="space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="cursor-pointer inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          <Upload size={16} />
          Choose Image
        </label>
        <p className="text-gray-400 text-sm">
          Drag and drop an image here, or click to browse
        </p>
      </div>
    </div>
  );
};

export default ImageUpload;

