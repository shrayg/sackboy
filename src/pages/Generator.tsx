import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import ImageUpload from "@/components/ImageUpload";
import GeneratedImage from "@/components/GeneratedImage";
import OpenAI from "openai";
import { supabase, supabaseAdmin } from '@/lib/supabaseClient'
import { Sparkles, Menu } from "lucide-react";


const Generator = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [appImage, setAppImage] = useState<any[]>([]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [done, setDone] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleImageUpload = (imageUrl: string) => {
    setUploadedImage(imageUrl);
    setGeneratedImage(null);
    setDone(false);

    // Convert the uploaded image to the format expected by your script
    fetch(imageUrl)
      .then(res => res.blob())
      .then(blob => {
        setAppImage([{ blob }]);
      });
  };

  const generateImage = async () => {
    if (!appImage || appImage.length === 0) {
      toast({
        title: "No image selected",
        description: "Please upload an image first",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const openai = new OpenAI({
        apiKey: import.meta.env.VITE_API_KEY,
        dangerouslyAllowBrowser: true
      });

      console.log("past key");

      const prompt = `Create a hyper-realistic Beyblade image inspired by the provided image, using it as the core source of personality, mood, and design influence. Seamlessly integrate the image as the central medallion as a polished, metalic circle or hexagonal shape at the center of the Beyblade. Generate 1:1 scale image that is 1024x1024 scale.

Surround the core with a custom-designed energy layer, featuring sharp, dynamic patterns and intricate mechanical details that reflect the energy, style, and personality of the supplied image.

Design outer forged metallic rings with detailed engravings and a layered, engineered structure, emphasizing performance and craftsmanship. Include premium, realistic surface textures—showing every scratch, reflection, and subtle material transition.

The Beyblade should look like a real, high-performance, tournament-grade top: use studio-quality, diffused lighting to highlight metallic finishes, glass reflections, and the complexity of the design.

Set the Beyblade on a neutral, softly textured background, slightly blurred to maintain focus on the object.

Render the scene as if photographed with a professional DSLR camera using a 50mm macro lens at a 30-degree downward angle, ensuring maximum depth, sharpness, and realism.

Do not mention or specify colors; instead, interpret the images mood and energy visually in the design choices, materials, and forms. Use the provided image to determine the coloring and components of the beyblade. The personality of the provided image should be reflected in the beyblade as a persona.`;

      // Use the first image from appImage array
      const imageObj = appImage[0];

      // Convert blob to base64
      const toBase64 = (blob) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            // Extract just the base64 part (after the comma)
            const base64 = (reader.result as string).split(',')[1];
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      };

      let base64Image = null;
      if (imageObj.blob) {
        base64Image = await toBase64(imageObj.blob);
      } else {
        toast({
          title: "Error",
          description: "Could not extract image data from uploaded file.",
          variant: "destructive",
        });
        setIsGenerating(false);
        return;
      }

      const response = await openai.responses.create({
        model: "gpt-4o",
        input: [
          {
            role: "user",
            content: [
              { type: "input_text", text: prompt },
              {
                type: "input_image",
                image_url: `data:image/png;base64,${base64Image}`,
                detail: "auto"

              },
            ],
          },
        ],
        tools: [{ type: "image_generation" }],
      });

      const imageData = response.output
        .filter((output) => output.type === "image_generation_call")
        .map((output) => output.result);

      // Assuming the generated image is returned as a base64 string in the message content:
      const generatedImageBase64 = imageData[0]; //response.choices[0].message.content.trim();
      if (generatedImageBase64) {
        setGeneratedImage(`data:image/png;base64,${generatedImageBase64}`);
        toast({
          title: "Image generated successfully!",
          description: "Your generated image is ready.",
        });

        // Save the generated image to Supabase
        const dataURL = `data:image/png;base64,${generatedImageBase64}`;

        // Convert to blob
        const res = await fetch(dataURL);
        const blob = await res.blob();

        // Upload to Supabase Storage
        const fileName = `beybladez-${Date.now()}.png`;
        const { error: upLoadErr } = await supabaseAdmin
          .storage
          .from('beybladez-images')
          .upload(fileName, blob, { contentType: 'image/png' });
        if (upLoadErr) {
          console.error("Storage upload error:", upLoadErr);
          console.error("Error message:", upLoadErr.message);
          throw upLoadErr;
        }

        // Get public URL of the uploaded image
        // 1) pull out both data and error
        const { data } = supabaseAdmin
          .storage
          .from('beybladez-images')
          .getPublicUrl(fileName);

        // 2) guard against missing data
        if (!data || !data.publicUrl) {
          console.error('getPublicUrl failed: Missing public URL');
          throw new Error('Failed to retrieve public URL');
        }

        // 3) now safely grab the URL
        const publicUrl = data.publicUrl;

        console.log("About to insert with URL:", publicUrl);
        console.log("User ID being used:", null); // Since we're not setting one

        // insert a row into the images table  
        const { error: dbErr } = await supabaseAdmin
          .from('images')
          .insert({
            url: publicUrl,
            user_id: null
          });
        if (dbErr) {
          console.error("Detailed insert error:", dbErr);
          console.error("Error code:", dbErr.code);
          console.error("Error message:", dbErr.message);
          console.error("Error details:", dbErr.details);
          throw dbErr;
        }

        //Image saved notifaation

        toast({ title: "Image saved to gallery!" });


      } else {
        toast({
          title: "Generation failed",
          description: "Failed to generate image.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        title: "Generation failed",
        description: "An error occurred while generating the image.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setDone(true);
    }
  };


  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Header */}
      <header className="p-6 flex-shrink-0">
        <div className="container mx-auto flex items-center justify-between">
          {/* Left: Back to Home (desktop only) */}
          <div className="hidden md:flex flex-shrink-0">
            <Button
              variant="ghost"
              onClick={() => navigate('/')} 
              className="text-white hover:bg-white/10"
            >
              ← Back to Home
            </Button>
          </div>

          {/* Center: Title */}
          <div className="flex-1 flex justify-center">
            <h1 className="text-2xl font-bold">beybladez Generator</h1>
          </div>

          {/* Right: Desktop Navigation */}
          <nav className="hidden md:flex gap-4 flex-shrink-0">
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

          {/* Mobile Menu Button - right aligned */}
          <div className="flex md:hidden justify-end">
            <Button
              variant="ghost"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-silver-300 hover:bg-gray-900 border border-gray-700 hover:border-silver-400"
            >
              <Menu size={24} />
            </Button>
          </div>
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
              onClick={() => navigate('/gallery')}
              className="w-full text-silver-300 hover:bg-gray-900 border border-gray-700 hover:border-silver-400"
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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 style={{lineHeight: "1.5"}} className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Create Your $beybladez
            </h2>
            <p className="text-gray-300 text-lg font-semibold">
              Upload any image and transform it into your personalized beybladez <br />
              <br />
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Upload Section */}
            <Card className="bg-black/40 backdrop-blur-sm border-white/10 p-6">
              <h3 className="text-xl font-semibold mb-6 text-white">Upload Image</h3>
              <ImageUpload onImageUpload={handleImageUpload} />

              <Button
                onClick={generateImage}
                disabled={!uploadedImage || isGenerating}
                className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 py-3 text-lg font-semibold disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isGenerating ? "Generating..." : "Generate beybladez"}
              </Button>
            </Card>

            {/* Result Section */}
            <Card className="bg-black/40 backdrop-blur-sm border-white/10 p-6">
              <h3 className="text-xl font-semibold mb-6 text-white">Generated Result</h3>
              <GeneratedImage
                imageUrl={generatedImage}
                isGenerating={isGenerating}
              />
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Generator;
