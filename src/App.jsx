import './App.css'
import { useState, useEffect, useRef } from 'react'
import { Button } from './components/ui/button'
import { Card } from './components/ui/card'
import { Upload, Download, Sparkles } from 'lucide-react'
import ImageUpload from './components/ImageUpload'
import GeneratedImage from './components/GeneratedImage'
import OpenAI from 'openai'
import { supabase, supabaseAdmin } from './lib/supabaseClient'
import { useToast } from './hooks/use-toast'

// Import the provided images
import sackboyzTitle from './assets/sackboyz_title_transparent.webp'
import homeButton from './assets/home_button-removebg-preview.png'
import generatorButton from './assets/generator_button-removebg-preview.png'
import galleryButton from './assets/gallery_button-removebg-preview.png'
import galleryTitle from './assets/sackboy_gallery_title-removebg-preview.png'
import createSackboyTitle from './assets/create_sackboy_title.png'

function App() {
  const [uploadedImage, setUploadedImage] = useState(null)
  const [appImage, setAppImage] = useState([])
  const [generatedImage, setGeneratedImage] = useState(null)
  const [images, setImages] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [done, setDone] = useState(false)
  const { toast } = useToast()

  const homeRef = useRef(null)
  const generatorRef = useRef(null)
  const galleryRef = useRef(null)

  const scrollToSection = (section) => {
    const refs = {
      home: homeRef,
      generator: generatorRef,
      gallery: galleryRef
    }
    refs[section]?.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await supabase
        .from('images')
        .select('id, url, created_at')
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
            timestamp: img.created_at
          }))
        )
      }
    }

    fetchImages()
  }, [])

  const handleImageUpload = (imageUrl) => {
    setUploadedImage(imageUrl)
    setGeneratedImage(null)
    setDone(false)

    fetch(imageUrl)
      .then(res => res.blob())
      .then(blob => {
        setAppImage([{ blob }])
      })
  }

  const generateImage = async () => {
    if (!appImage || appImage.length === 0) {
      toast({
        title: 'No image selected',
        description: 'Please upload an image first',
        variant: 'destructive',
      })
      return
    }

    setIsGenerating(true)
    try {
      const openai = new OpenAI({
        apiKey: import.meta.env.VITE_API_KEY,
        dangerouslyAllowBrowser: true
      })

      console.log('past key')

      const prompt = `Use this to design a sackboy from the video game, put the sackboy on a white background, studio lighting. 1:1 image .choose features from the original image and bring it to the sackboy in terms of coloring accessories and features make sure it has black beaded eyes. make sure it is stitch like like the original sackboy
`

      const imageObj = appImage[0]

      const toBase64 = (blob) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => {
            const base64 = (reader.result).split(',')[1]
            resolve(base64)
          }
          reader.onerror = reject
          reader.readAsDataURL(blob)
        })
      }

      let base64Image = null
      if (imageObj.blob) {
        base64Image = await toBase64(imageObj.blob)
      } else {
        toast({
          title: 'Error',
          description: 'Could not extract image data from uploaded file.',
          variant: 'destructive',
        })
        setIsGenerating(false)
        return
      }

      const response = await openai.responses.create({
        model: 'gpt-4o',
        input: [
          {
            role: 'user',
            content: [
              { type: 'input_text', text: prompt },
              {
                type: 'input_image',
                image_url: `data:image/png;base64,${base64Image}`,
                detail: 'auto'

              },
            ],
          },
        ],
        tools: [{ type: 'image_generation' }],
      })

      const imageData = response.output
        .filter((output) => output.type === 'image_generation_call')
        .map((output) => output.result)

      const generatedImageBase64 = imageData[0]
      if (generatedImageBase64) {
        setGeneratedImage(`data:image/png;base64,${generatedImageBase64}`)
        toast({
          title: 'Image generated successfully!',
          description: 'Your generated Sackboy is ready.',
        })

        const dataURL = `data:image/png;base64,${generatedImageBase64}`

        const res = await fetch(dataURL)
        const blob = await res.blob()

        const fileName = `sackboy-${Date.now()}.png`
        const { error: upLoadErr } = await supabaseAdmin
          .storage
          .from('beybladez-images')
          .upload(fileName, blob, { contentType: 'image/png' })
        if (upLoadErr) {
          console.error('Storage upload error:', upLoadErr)
          console.error('Error message:', upLoadErr.message)
          throw upLoadErr
        }

        const { data } = supabaseAdmin
          .storage
          .from('beybladez-images')
          .getPublicUrl(fileName)

        if (!data || !data.publicUrl) {
          console.error('getPublicUrl failed: Missing public URL')
          throw new Error('Failed to retrieve public URL')
        }

        const publicUrl = data.publicUrl

        console.log('About to insert with URL:', publicUrl)

        const { error: dbErr } = await supabaseAdmin
          .from('images')
          .insert({
            url: publicUrl,
            user_id: null
          })
        if (dbErr) {
          console.error('Detailed insert error:', dbErr)
          console.error('Error code:', dbErr.code)
          console.error('Error message:', dbErr.message)
          console.error('Error details:', dbErr.details)
          throw dbErr
        }

        toast({ title: 'Image saved to gallery!' })

      } else {
        toast({
          title: 'Generation failed',
          description: 'Failed to generate image.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error generating image:', error)
      toast({
        title: 'Generation failed',
        description: 'An error occurred while generating the image.',
        variant: 'destructive',
      })
    } finally {
      setIsGenerating(false)
      setDone(true)
    }
  }

  const downloadImage = async (imageUrl, id) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `sackboy-${id}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download failed:', err)
      alert('Failed to download image. Please try again.')
    }
  }

  return (
    <div className="sackboy-bg fabric-texture smooth-scroll">
      {/* Desktop Navigation */}
      <div className="desktop-nav">
        <button
          onClick={() => scrollToSection('home')}
          className="nav-button w-16 h-16 rounded-full overflow-hidden border-0 bg-transparent p-0"
          aria-label="Go to Home"
        >
          <img src={homeButton} alt="Home" className="w-full h-full object-cover" />
        </button>
        <button
          onClick={() => scrollToSection('generator')}
          className="nav-button w-16 h-16 rounded-full overflow-hidden border-0 bg-transparent p-0"
          aria-label="Go to Generator"
        >
          <img src={generatorButton} alt="Generator" className="w-full h-full object-cover" />
        </button>
        <button
          onClick={() => scrollToSection('gallery')}
          className="nav-button w-16 h-16 rounded-full overflow-hidden border-0 bg-transparent p-0"
          aria-label="Go to Gallery"
        >
          <img src={galleryButton} alt="Gallery" className="w-full h-full object-cover" />
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className="mobile-nav-container">
        <div className="mobile-nav flex gap-3">
          <button
            onClick={() => scrollToSection('home')}
            className="nav-button w-12 h-12 rounded-full overflow-hidden border-0 bg-transparent p-0"
            aria-label="Go to Home"
          >
            <img src={homeButton} alt="Home" className="w-full h-full object-cover" />
          </button>
          <button
            onClick={() => scrollToSection('generator')}
            className="nav-button w-12 h-12 rounded-full overflow-hidden border-0 bg-transparent p-0"
            aria-label="Go to Generator"
          >
            <img src={generatorButton} alt="Generator" className="w-full h-full object-cover" />
          </button>
          <button
            onClick={() => scrollToSection('gallery')}
            className="nav-button w-12 h-12 rounded-full overflow-hidden border-0 bg-transparent p-0"
            aria-label="Go to Gallery"
          >
            <img src={galleryButton} alt="Gallery" className="w-full h-full object-cover" />
          </button>
        </div>
      </div>

      {/* Home Section */}
      <section ref={homeRef} className="min-h-screen flex flex-col items-center justify-center section-padding">
        <div className="text-center max-w-4xl mx-auto w-full px-2">
          {/* Main Title */}
          <div className="mb-6 md:mb-8 lg:mb-12">
            <img 
              src={sackboyzTitle} 
              alt="Sackboyz" 
              className="mx-auto title-image drop-shadow-2xl"
            />
          </div>
          
          {/* Welcome Message */}
          <div className="stitched-border bg-card card-content mb-6 md:mb-8 lg:mb-12 max-w-2xl mx-auto">
            <h2 className="welcome-title font-bold text-primary mb-3 md:mb-4">
              Welcome to the magical world of Sackboyz!
            </h2>
            <p className="welcome-text text-muted-foreground">
              Create your very own Sackboy character with our AI generator! 
              <br />
              Upload any image and watch as it transforms into a unique Sackboy design.
              <br />
              Join our community and explore the gallery of amazing Sackboys created by others.
              <br />
              <br />
              <b>CA: 9YB4ej7L8h8WDmYKFakvwrD9nfemnkPd2jSns6yBpump</b>
              <br />


            </p>
          </div>
          <div className="stitched-border bg-card card-content mb-6 md:mb-8 lg:mb-12 max-w-2xl mx-auto">
            
            <p className="welcome-text text-muted-foreground">
               
              <b>Donation wallet:</b>
              <br /> 2CFRQx4sUwWz1jGrcN8eaHdQGoyLPiNYaN84RuEWSvUo
              <br/>
              
              <br /> This funds the costs to keep the API running so the website stays active.

            </p>
          </div>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Button
              onClick={() => scrollToSection('generator')}
              size="lg"
              className="generate-button action-button rounded-full"
            >
              <Sparkles className="mr-2" size={16} />
              Start Creating ✨
            </Button>
            <Button
              onClick={() => scrollToSection('gallery')}
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground action-button rounded-full"
            >
              View Gallery 🎨
            </Button>
            <Button
    asChild
    size="lg"
    variant="outline"
    className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white action-button rounded-full"
  >
    <a
      href="https://x.com/i/communities/1938308679163396370"
      target="_blank"
      rel="noopener noreferrer"
    >
      {/* You can use a Twitter icon here if you have one */}
      Twitter
    </a>
  </Button>
          </div>
        </div>
      </section>

      {/* Generator Section */}
      <section ref={generatorRef} className="min-h-screen flex flex-col items-center justify-center section-padding">
        <div className="max-w-6xl mx-auto w-full px-2">
          {/* Section Title */}
          <div className="text-center mb-6 md:mb-8 lg:mb-12">
            <img 
              src={createSackboyTitle} 
              alt="Create Your Sackboy" 
              className="mx-auto section-title-image drop-shadow-2xl mb-3 md:mb-4 lg:mb-6"
            />
            <p className="section-description text-muted-foreground max-w-2xl mx-auto px-2">
              Upload any image and transform it into your personalized Sackboy character
            </p>
          </div>

          <div className="generator-grid">
            {/* Upload Section */}
            <Card className="stitched-border bg-card card-content card-hover">
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-primary mb-3 md:mb-4 lg:mb-6 text-center">Upload Image</h3>
              
              {uploadedImage ? (
                <div className="space-y-3 md:space-y-4 text-center">
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded" 
                    className="mx-auto max-w-full h-24 md:h-32 lg:h-48 object-contain rounded-lg shadow-lg"
                  />
                  <Button
                    onClick={() => setUploadedImage(null)}
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground text-xs md:text-sm"
                  >
                    Choose Different Image
                  </Button>
                </div>
              ) : (
                <ImageUpload onImageUpload={handleImageUpload} />
              )}

              <Button
                onClick={generateImage}
                disabled={!uploadedImage || isGenerating}
                className="generate-button w-full mt-3 md:mt-4 lg:mt-6 py-2 md:py-3 lg:py-4 text-sm md:text-base lg:text-lg font-bold rounded-lg"
              >
                <Sparkles className="mr-2" size={14} />
                {isGenerating ? 'Generating Your Sackboy...' : 'Generate Sackboy'}
              </Button>
            </Card>

            {/* Result Section */}
            <Card className="stitched-border bg-card card-content card-hover">
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-primary mb-3 md:mb-4 lg:mb-6 text-center">Your Sackboy</h3>
              <GeneratedImage
                imageUrl={generatedImage}
                isGenerating={isGenerating}
              />
            </Card>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section ref={galleryRef} className="min-h-screen flex flex-col items-center justify-center section-padding">
        <div className="max-w-6xl mx-auto w-full px-2">
          {/* Section Title */}
          <div className="text-center mb-6 md:mb-8 lg:mb-12">
            <img 
              src={galleryTitle} 
              alt="Sackboy Gallery" 
              className="mx-auto gallery-title-image drop-shadow-2xl mb-3 md:mb-4 lg:mb-6"
            />
            <p className="section-description text-muted-foreground px-2">
              Explore all the amazing Sackboys created by our community
            </p>
          </div>

          {images.length === 0 ? (
            <Card className="stitched-border bg-card card-content text-center card-hover">
              <div className="text-muted-foreground mb-4 md:mb-6">
                <div className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 mx-auto mb-3 md:mb-4 bg-muted rounded-lg flex items-center justify-center">
                  <Sparkles size={20} className="md:w-6 md:h-6 lg:w-8 lg:h-8" />
                </div>
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold mb-2 text-primary">No Sackboys created yet</h3>
                <p className="text-xs md:text-sm lg:text-base">Start creating your first Sackboy!</p>
              </div>
              <Button
                onClick={() => scrollToSection('generator')}
                className="generate-button action-button rounded-lg font-bold"
              >
                Create Your First Sackboy
              </Button>
            </Card>
          ) : (
            <div className="gallery-grid">
              {images.map((image) => (
                <div key={image.id} className="gallery-item stitched-border">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={image.url}
                      alt={`Sackboy ${image.id}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-2 md:p-3 lg:p-4 flex justify-between items-center">
                    <span className="text-xs md:text-sm text-muted-foreground">
                      {new Date(image.timestamp).toLocaleDateString()}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => downloadImage(image.url, image.id)}
                      className="bg-green-600 hover:bg-green-700 text-white text-xs md:text-sm px-2 md:px-3 py-1 md:py-2"
                    >
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default App

