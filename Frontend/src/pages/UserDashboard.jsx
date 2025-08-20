import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/Card"
import { Button } from "../components/Button"
import { Input } from "../components/Input"
import { Badge } from "../components/Badge"
import { Textarea } from "../components/Textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/Dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/Select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/Tabs"
import { Star, Search, MapPin, LogOut, Filter, Loader2 } from "lucide-react"
import axios from "axios";

// Mock data for user reviews (you might want to fetch this from API too)
const mockUserReviews = [
  {
    id: 1,
    storeName: "Tech Paradise",
    rating: 5,
    comment: "Excellent service and great product selection!",
    date: "2024-02-15",
  },
  {
    id: 2,
    storeName: "Book Corner",
    rating: 5,
    comment: "Amazing collection of books. Staff is very helpful.",
    date: "2024-02-10",
  },
  {
    id: 3,
    storeName: "Coffee Beans",
    rating: 4,
    comment: "Great coffee, but can get crowded during peak hours.",
    date: "2024-02-05",
  },
]

export function UserDashboard() {

  const [user, setUser] = useState(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedStore, setSelectedStore] = useState(null)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [stores, setStores] = useState([])
  const [mockUserReviews, setMockUserReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [update, setUpdate] = useState(0);

  // Fetch stores from API
  useEffect(() => {
  const fetchStores = async () => {
    try {
      setLoading(true);
      setError(null);

      // Replace '/api/stores' with your actual API endpoint
      const response = await axios.get("http://localhost:4000/api/stores");

      // Axios automatically parses JSON, so no need for `response.json()`
      const data = response.data;

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
        rating: store.average_rating ?? 4.0, // Use DB rating if available, otherwise default
        reviewCount: store.review_count ?? 0, // Use DB reviewCount if available
      }));
      console.log("Fetched stores:", transformedStores);

      setStores(transformedStores);
    } catch (err) {
      console.error("Error fetching stores:", err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRatings = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/ratings/user/${user.id}`);
      const data = response.data;
      console.log("Fetched user ratings:", data);
      const transformedRatings = data.ratings.map((rating) => ({
        id: rating.rating_id,
        storeId: rating.store_id,
        userId: rating.user_id,
        ratingValue: rating.rating_value,
        comment: rating.comment,
        createdAt: rating.created_at,
      }));
      console.log("Transformed user ratings:", transformedRatings);
      setMockUserReviews(transformedRatings);
    } catch (err) {
      console.error("Error fetching user ratings:", err);
    }
  };

  fetchStores();
  fetchUserRatings();
  
}, [update]);

  // Get unique categories from fetched stores
  const categories = ["all", ...new Set(stores.map(store => store.category).filter(Boolean))]

  const filteredStores = stores.filter((store) => {
    const matchesSearch =
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || store.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleSubmitReview = async () => {
    if (rating > 0 && comment.trim()) {
      try {
        // You can implement the review submission API call here
        console.log("Review submitted:", { store: selectedStore?.id, rating, comment, user_id: user.id })

        try {
          const response = await axios.post("http://localhost:4000/api/ratings", {
            user_id: user.id,
            store_id: selectedStore.id,
      rating_value: rating,
      comment: comment || "",
    });

    if (response.status === 201) {
      alert("Review submitted successfully!");
      setUpdate((prev) => prev + 1); // Trigger a re-fetch of stores
      // Optionally reset form or refresh store ratings
    }
  } catch (error) {
    if (error.response) {
      alert(error.response.data.message || "Failed to submit review");
    } else {
      alert("Network error. Please try again.");
    }
    console.error(error);
  }
        
        setRating(0)
        setComment("")
        setSelectedStore(null)
      } catch (err) {
        console.error('Error submitting review:', err)
        alert('Error submitting review. Please try again.')
      }
    }
  }
  useEffect(() => {
    document.title = "User Dashboard";
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    window.location.href = "/login" // Redirect to login page
  }

   const getStoreNameById = (storeId) => {
    const store = stores.find(s => s.store_id === storeId || s._id === storeId || s.id === storeId);
    return store ? store.name : 'Unknown Store';
  }
  const renderStars = (rating, interactive = false, onStarClick) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} ${
              interactive ? "cursor-pointer hover:text-yellow-400" : ""
            }`}
            onClick={() => interactive && onStarClick?.(star)}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <header className="bg-gray-800/80 backdrop-blur-md border-b border-gray-700/50 sticky top-0 z-50 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg">
                <Star className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Store Rating Platform</h1>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout} 
              className="flex items-center gap-2 bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-red-600/20 hover:border-red-500 hover:text-red-300 cursor-pointer transition-all duration-300 backdrop-blur-sm"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800 border-gray-700">
            <TabsTrigger value="browse" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300">Browse Stores</TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300">My Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="browse">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search stores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all backdrop-blur-sm"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48 bg-gray-700/50 border-gray-600 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all backdrop-blur-sm">
                  <Filter className="h-4 w-4 mr-2 text-gray-400" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700/95 border-gray-600/50 backdrop-blur-md">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category} className="text-white hover:bg-gray-600/50 focus:bg-gray-600/50">
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2 text-lg text-gray-600">Loading stores...</span>
              </div>
            )}

            {error && (
              <div className="text-center py-12">
                <div className="text-red-600 text-lg mb-2">Error loading stores</div>
                <div className="text-gray-600 mb-4">{error}</div>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            )}

            {!loading && !error && filteredStores.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-600 text-lg">No stores found</div>
                <div className="text-gray-500">Try adjusting your search or filter criteria</div>
              </div>
            )}

            {!loading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStores.map((store) => (
                  <Card key={store.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-gray-800 border-gray-700 hover:shadow-blue-500/25">
                    <div className="aspect-video relative">
                      <img 
                        src={store.image} 
                        alt={store.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = `https://www.freepik.com/free-vector/hand-drawn-people-supermarket_4182816.htm#fromView=keyword&page=1&position=10&uuid=3172c0db-7815-4a8d-a96e-19b51174d8d4&query=General+Store`
                        }}
                      />
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg text-white">{store.name}</CardTitle>
                          <Badge variant="secondary" className="mt-1 bg-gradient-to-r from-gray-600 to-gray-500 text-white border-0 shadow-lg">
                            {store.category}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold text-white">{store.rating}</span>
                          </div>
                          <p className="text-sm text-gray-400">({store.reviewCount} reviews)</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-300 mb-3">{store.description}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                        <MapPin className="h-4 w-4" />
                        <span>{store.address}</span>
                      </div>
                      {store.phone && (
                        <div className="text-sm text-gray-400 mb-2">
                          Phone: {store.phone}
                        </div>
                      )}
                      {store.email && (
                        <div className="text-sm text-gray-400 mb-4">
                          Email: {store.email}
                        </div>
                      )}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setSelectedStore(store)}>
                            Rate This Store
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md bg-gray-800 border-gray-700">
                          <DialogHeader>
                            <DialogTitle className="text-white">Rate {selectedStore?.name}</DialogTitle>
                            <DialogDescription className="text-gray-400">Share your experience with other customers</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium mb-2 block text-gray-300">Your Rating</label>
                              {renderStars(rating, true, setRating)}
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-2 block text-gray-300">Your Review</label>
                              <Textarea
                                placeholder="Tell others about your experience..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={4}
                                className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all backdrop-blur-sm"
                              />
                            </div>
                            <Button onClick={handleSubmitReview} className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={rating === 0 || !comment.trim()}>
                              Submit Review
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reviews">
  <Card className="bg-gray-800 border-gray-700">
    <CardHeader>
      <CardTitle className="text-white">My Reviews</CardTitle>
      <CardDescription className="text-gray-400">Your rating history and reviews</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {mockUserReviews.map((review) => {
          // Find the store for this review
          const store = stores.find((s) => s.id === review.storeId);

          return (
            <div key={review.id} className="border border-gray-700 rounded-lg p-4 bg-gray-800/50">
              <div className="flex justify-between items-start mb-2">
                {/* Use store.name if found, otherwise fallback to the ID */}
                <h3 className="font-semibold text-white">
                  {getStoreNameById(review.storeId)}
                </h3>
                <div className="flex items-center gap-2">
                  {renderStars(review.ratingValue)}
                  <span className="text-sm text-gray-400">
                     {review.createdAt 
                                  ? new Date(review.createdAt).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'short', 
                                      day: 'numeric'
                                    })
                                  : review.createdAt || "N/A"
                                }
                  </span>
                </div>
              </div>
              <p className="text-gray-300">{review.comment}</p>
            </div>
          );
        })}
      </div>
    </CardContent>
  </Card>
</TabsContent>

        </Tabs>
      </div>
    </div>
  )
}