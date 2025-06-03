
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
}

const ImageUpload = ({ onImageUpload }: ImageUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreview(result);
        onImageUpload(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <Card 
        className={`relative border-2 border-dashed transition-all duration-300 cursor-pointer
          ${dragActive 
            ? 'border-purple-400 bg-purple-400/10' 
            : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
          }
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <div className="p-8 text-center">
          {preview ? (
            <div className="space-y-4">
              <div className="aspect-square max-w-64 mx-auto rounded-lg overflow-hidden bg-white">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-green-400 font-medium">Image uploaded successfully!</p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  openFileDialog();
                }}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Upload Different Image
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-yellow-400 text-4xl mb-4">📁</div>
              <div>
                <p className="text-gray-300 text-lg font-medium mb-2">
                  Drop images here or click to select
                </p>
                <p className="text-gray-500 text-sm">
                  Supports: JPG, PNG, GIF, WebP, SVG
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;
