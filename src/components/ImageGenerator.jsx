import { useState } from 'react'

const API_KEY = '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'

export const useImageGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState(null)

  const generateSackboy = async (imageFile) => {
    setIsGenerating(true)
    setError(null)

    try {
      // Convert image to base64
      const base64Image = await fileToBase64(imageFile)
      
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: `Use this to design a sackboy from the video game, put the sackboy on a white background, studio lighting. 1:1 image. Based on the reference image: ${base64Image}`,
          n: 1,
          size: '1024x1024',
          quality: 'standard',
          response_format: 'url'
        }),
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.data && data.data[0] && data.data[0].url) {
        return data.data[0].url
      } else {
        throw new Error('No image URL in response')
      }
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsGenerating(false)
    }
  }

  return { generateSackboy, isGenerating, error }
}

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

