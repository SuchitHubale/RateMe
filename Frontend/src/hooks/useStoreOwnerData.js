import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

export const useStoreOwnerData = (ownerId) => {
  // Store data state
  const [storeInfo, setStoreInfo] = useState({})
  const [reviews, setReviews] = useState([])
  const [analytics, setAnalytics] = useState({})
  
  // Loading states
  const [loading, setLoading] = useState(true)
  const [errorState, setErrorState] = useState(null)
  
  // Upload states
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState(null)
  const [uploadError, setUploadError] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)

  // Fetch store information
  const fetchStoreInfo = async () => {
    if (!ownerId) return
    
    setLoading(true)
    setErrorState(null)
    
    try {
      const response = await axios.get(`http://localhost:4000/api/stores/${ownerId}`)
      const fetchedStoreInfo = response.data.stores[0]
      setStoreInfo({
        ...fetchedStoreInfo,
        id: fetchedStoreInfo.store_id, // Map store_id to id for consistency
      })
      console.log('Store information fetched successfully:', fetchedStoreInfo)
      toast.success('Store information fetched successfully!')
    } catch (err) {
      setErrorState('Failed to fetch store information')
      console.error('Error fetching store info:', err)
      // Fallback to mock data
      setStoreInfo({
        id: 1,
        name: "Tech Haven",
        category: "Electronics",
        address: "123 Tech Street, Silicon Valley, CA 94000",
        phone: "+1 (555) 123-4567",
        email: "contact@techhaven.com",
        description: "Your one-stop destination for the latest technology and gadgets.",
        image_url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        rating: 4.5,
        totalReviews: 156
      })
      toast.error('Failed to fetch store information. Using offline data.')
    } finally {
      setLoading(false)
    }
  }

  // Fetch reviews
  const fetchReviews = async () => {
    if (!ownerId || !storeInfo.id) return
    
    try {
      console.log("Fetching reviews for store ID:", storeInfo.id)
      const response = await axios.get(`http://localhost:4000/api/ratings/${storeInfo.id}`)
      
      // Correctly handle review data and map fields for consistency
      const reviewsData = response.data.ratings.map((review) => ({
        ...review,
        id: review.rating_id,
        rating: review.rating_value,
        customerName: review.user_id, // You might need to fetch user details for a real name
        comment: review.comment,
        date: new Date(review.created_at).toLocaleDateString(),
      }))
      setReviews(reviewsData)
      console.log("Reviews fetched successfully:", reviewsData)
      toast.success('Reviews fetched successfully!')
    } catch (err) {
      console.error('Error fetching reviews:', err)
      // Fallback to mock data
      setReviews([
        {
          id: 1,
          user_id: 101,
          customerName: "John Doe",
          rating: 5,
          comment: "Excellent service and great products! The staff was very helpful and knowledgeable.",
          date: "2024-01-15",
          response: null
        },
        {
          id: 2,
          user_id: 102,
          customerName: "Jane Smith",
          rating: 4,
          comment: "Good selection of electronics. Prices are competitive.",
          date: "2024-01-14",
          response: "Thank you for your feedback! We appreciate your business."
        }
      ])
      toast.error('Failed to fetch reviews. Using offline data.')
    }
  }

  // Calculate analytics from reviews
  const calculateAnalytics = (reviewsData) => {
    const totalReviews = reviewsData.length
    let totalRatingSum = 0
    const ratingDistribution = [
      { rating: 5, count: 0 },
      { rating: 4, count: 0 },
      { rating: 3, count: 0 },
      { rating: 2, count: 0 },
      { rating: 1, count: 0 },
    ]

    reviewsData.forEach((review) => {
      totalRatingSum += review.rating
      const ratingIndex = 5 - review.rating
      if (ratingIndex >= 0 && ratingIndex < ratingDistribution.length) {
        ratingDistribution[ratingIndex].count++
      }
    })

    const averageRating = totalReviews > 0 ? (totalRatingSum / totalReviews) : 0

    return {
      totalReviews,
      averageRating,
      ratingDistribution,
      monthlyGrowth: 12.5 // This would need more complex calculation based on dates
    }
  }

  // Update store information
  const updateStore = async () => {
    setLoading(true)
    setErrorState(null)
    
    try {
      const response = await axios.put(`http://localhost:4000/api/stores/${storeInfo.id}`, storeInfo)
      console.log("Store updated successfully:", response.data)
      setStoreInfo(response.data)
      toast.success('Store information updated successfully!')
    } catch (err) {
      setErrorState('Failed to update store information')
      console.error('Error updating store:', err)
      toast.error('Failed to update store information. Please try again.')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Submit review response
  const submitReviewResponse = async (review, responseText) => {
    try {
      const response = await axios.post(
        `http://localhost:4000/api/reviews/${review.id}/respond`,
        { response: responseText }
      )

      console.log("Response submitted:", response.data)

      // Update local state
      setReviews(prevReviews =>
        prevReviews.map(r =>
          r.id === review.id ? { ...r, response: responseText } : r
        )
      )
      
      toast.success('Response submitted successfully!')
    } catch (err) {
      console.error('Error submitting response:', err)
      toast.error('Failed to submit response. Please try again.')
      throw err
    }
  }

  // Enhanced Cloudinary upload function
  const uploadImageToCloudinary = async (file, onUpload) => {
    const data = new FormData()
    data.append("file", file)
    data.append("upload_preset", "posts123") // Your Cloudinary upload preset
    data.append("cloud_name", "dgmnl7ox7")   // Your Cloudinary cloud name

    try {
      setUploading(true)
      setUploadStatus(null)
      setUploadError(null)
      setUploadProgress(0)

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + Math.random() * 20
        })
      }, 200)

      const res = await fetch(`https://api.cloudinary.com/v1_1/dgmnl7ox7/upload`, {
        method: "POST",
        body: data,
      })

      const result = await res.json()
      clearInterval(progressInterval)
      setUploadProgress(100)

      if (result.secure_url) {
        console.log("Image uploaded successfully:", result.secure_url)
        setUploadStatus('success')
        onUpload(result.secure_url)
        toast.success('Image uploaded successfully!')
        
        // Clear success status after 3 seconds
        setTimeout(() => {
          setUploadStatus(null)
          setUploadProgress(0)
        }, 3000)
      } else {
        console.error("Cloudinary response missing secure_url", result)
        setUploadStatus('error')
        setUploadError("Upload failed: Invalid response from server")
        toast.error('Upload failed: Invalid response from server')
      }
    } catch (uploadError) {
      console.error("Upload failed", uploadError)
      setUploadStatus('error')
      setUploadError(`Upload failed: ${uploadError.message}`)
      toast.error(`Upload failed: ${uploadError.message}`)
    } finally {
      setUploading(false)
    }
  }

  // Handle image upload
  const handleImageChange = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Please select a valid image file (JPG, PNG, GIF, WebP)')
      toast.error('Please select a valid image file (JPG, PNG, GIF, WebP)')
      return
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB in bytes
    if (file.size > maxSize) {
      setUploadError('File size must be less than 5MB')
      toast.error('File size must be less than 5MB')
      return
    }

    setSelectedFile(file)
    setUploadError(null)

    // Upload immediately
    uploadImageToCloudinary(
      file,
      (url) => setStoreInfo((prev) => ({ ...prev, image_url: url }))
    )
  }

  // Calculate store statistics
  const getStoreStats = () => {
    const calculatedAnalytics = calculateAnalytics(reviews)
    return {
      totalReviews: calculatedAnalytics.totalReviews,
      averageRating: calculatedAnalytics.averageRating,
      monthlyGrowth: calculatedAnalytics.monthlyGrowth,
      responseRate: Math.round((reviews.filter(r => r.response).length / reviews.length) * 100) || 0
    }
  }

  // Initial data fetch
  useEffect(() => {
    if (ownerId) {
      fetchStoreInfo()
    }
  }, [ownerId])

  // Fetch reviews when store info is available
  useEffect(() => {
    if (storeInfo.id && !loading) {
      fetchReviews()
    }
  }, [storeInfo.id, loading])

  // Update analytics when reviews change
  useEffect(() => {
    if (reviews.length > 0) {
      const calculatedAnalytics = calculateAnalytics(reviews)
      setAnalytics(calculatedAnalytics)
    }
  }, [reviews])

  return {
    // Data
    storeInfo,
    setStoreInfo,
    reviews,
    analytics,
    
    // Computed data
    storeStats: getStoreStats(),
    
    // States
    loading,
    error: errorState,
    uploading,
    uploadProgress,
    uploadStatus,
    uploadError,
    selectedFile,
    
    // Actions
    fetchStoreInfo,
    fetchReviews,
    updateStore,
    submitReviewResponse,
    handleImageChange
  }
}
