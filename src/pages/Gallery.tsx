import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";

import { supabase } from '@/lib/supabaseClient'

interface GeneratedImage {
  id: number;
  url: string;
  timestamp: string;
}

const Gallery = () => {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // wrap in an async fn because useEffect callbacks can't be `async` directly
    const fetchImages = async () => {
      const { data, error } = await supabase
        .from('images')
        .select<'id, url, created_at'>('id, url, created_at')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Failed to fetch images:', error)
        return
      }

      if (data) {
        setImages(
          data.map(img => ({
            id: img.id,
            url: img.url,
            // our table column is `created_at`
            timestamp: img.created_at
          }))
        )
      }
    }

    fetchImages()
  }, [])


  const downloadImage = (imageUrl: string, id: number) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `beybladez-${id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Header */}
      <header className="p-6 flex-shrink-0">
        <div className="container mx-auto grid grid-cols-3 items-center">
          {/* Left navigation - hidden on mobile */}
          <div className="hidden md:flex justify-start">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-white hover:bg-white/10"
            >
              ← Back to Home
            </Button>
          </div>

          {/* Centered title */}
          <div className="flex justify-center">
            <h1 className="text-2xl text-center font-bold">Gallery</h1>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-silver-300 hover:bg-gray-900 border border-gray-700 hover:border-silver-400"
          >
            <Menu size={24} />
          </Button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex justify-end gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/generator')}
              className="text-silver-300 hover:bg-gray-900 border border-gray-700 hover:border-silver-400"
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
              onClick={() => navigate('/')}
              className="w-full text-silver-300 hover:bg-gray-900 border border-gray-700 hover:border-silver-400"
            >
              ← Back to Home
            </Button>
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
      <main className="flex-grow container mx-auto px-6 py-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-5">
              Generated beybladez Gallery
            </h2>
            <p className="text-gray-300 text-lg">
              Explore all the amazing beybladez created by our community
            </p>
          </div>

          {images.length === 0 ? (
            <Card className="bg-black/40 backdrop-blur-sm border-white/10 p-12 text-center">
              <div className="text-gray-400 mb-6">
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-xl font-semibold mb-2">No images generated yet</h3>
                <p className="text-gray-500">Start creating your first beybladez!</p>
              </div>
              <Button
                onClick={() => navigate('/generator')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 px-8 py-3"
              >
                Create Your <strong>beybladez</strong>
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {images.map((image) => (
                <Card key={image.id} className="bg-black/40 backdrop-blur-sm border-white/10 p-4 hover:border-purple-400/30 transition-all duration-300 group">
                  <div className="aspect-square rounded-lg overflow-hidden mb-4 bg-white">
                    <img
                      src={image.url}
                      alt={`Generated beybladez ${image.id}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">
                      {new Date(image.timestamp).toLocaleDateString()}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => downloadImage(image.url, image.id)}
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white border-0"
                    >
                      Download
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Gallery;
