import { useState, useEffect } from "react"
import axios from "axios"
import toast from 'react-hot-toast'

export function useUserData() {
  const [user, setUser] = useState(
    localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null
  )
  const [stores, setStores] = useState([])
  const [userReviews, setUserReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [update, setUpdate] = useState(0)

  // Fetch stores from API
  const fetchStores = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await axios.get("http://localhost:4000/api/stores")
      const data = response.data

      // Transform the API data to match the component's expected format
      const transformedStores = data.stores.map((store) => ({
        id: store.store_id,
        name: store.name,
        category: store.category,
        address: store.address,
        description: store.description,
        image:
          store.image_url ||
          `https://www.freepik.com/free-vector/hand-drawn-people-supermarket_4182816.htm#fromView=keyword&page=1&position=10&uuid=3172c0db-7815-4a8d-a96e-19b51174d8d4&query=General+Store`,
        email: store.email,
        phone: store.phone,
        owner_id: store.owner_id,
        created_at: store.created_at,
        rating: store.average_rating ?? 4.0,
        reviewCount: store.review_count ?? 0,
      }))

      setStores(transformedStores)
    } catch (err) {
      console.error("Error fetching stores:", err)
      setError(err.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  // Fetch user ratings
  const fetchUserRatings = async () => {
    if (!user?.id) return

    try {
      const response = await axios.get(`http://localhost:4000/api/ratings/user/${user.id}`)
      const data = response.data
      
      const transformedRatings = data.ratings.map((rating) => ({
        id: rating.rating_id,
        storeId: rating.store_id,
        userId: rating.user_id,
        ratingValue: rating.rating_value,
        comment: rating.comment,
        createdAt: rating.created_at,
      }))
      
      setUserReviews(transformedRatings)
    } catch (err) {
      console.error("Error fetching user ratings:", err)
    }
  }

  // Submit a new review
  const submitReview = async (store, rating, comment) => {
    if (!user?.id) {
      toast.error("Please log in to submit a review")
      return
    }

    try {
      const response = await axios.post("http://localhost:4000/api/ratings", {
        user_id: user.id,
        store_id: store.id,
        rating_value: rating,
        comment: comment || "",
      })

      if (response.status === 201) {
        toast.success("Review submitted successfully!")
        setUpdate((prev) => prev + 1) // Trigger a re-fetch of data
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Failed to submit review")
      } else {
        toast.error("Network error. Please try again.")
      }
      console.error(error)
    }
  }

  // Effect to fetch data on component mount and when update changes
  useEffect(() => {
    fetchStores()
    fetchUserRatings()
  }, [update, user?.id])

  // Set document title
  useEffect(() => {
    document.title = "User Dashboard"
  }, [])

  return {
    user,
    stores,
    userReviews,
    loading,
    error,
    submitReview,
    refetchData: () => setUpdate(prev => prev + 1)
  }
}
