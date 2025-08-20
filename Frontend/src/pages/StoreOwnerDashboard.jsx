import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/Tabs";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Textarea } from "../components/Textarea";
import { Label } from "../components/Label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/Dialog";
import {
  Star,
  TrendingUp,
  Users,
  MessageSquare,
  Store,
  Edit,
  LogOut,
  Reply,
  Upload,
  Check,
  AlertCircle,
} from "lucide-react";

import { isAuthenticated } from "../Auth/auth";
import axios from "axios";

// Mock data for store owner (for initial state and fallback)
const mockStoreData = {
  id: 1,
  name: "Tech Paradise",
  category: "Electronics",
  address: "123 Tech Street, Digital City",
  description: "Your one-stop shop for all electronic gadgets and accessories.",
  phone: "+1 (555) 123-4567",
  email: "contact@techparadise.com",
  rating: 4.5,
};

const mockReviews = [
  {
    rating_id: 1,
    user_id: 101,
    store_id: 1,
    rating_value: 5,
    comment:
      "Excellent service and great product selection! The staff was very knowledgeable.",
    created_at: "2024-02-15T10:00:00Z",
    response: null,
  },
  {
    rating_id: 2,
    user_id: 102,
    store_id: 1,
    rating_value: 4,
    comment: "Good store with competitive prices. Could improve the checkout process.",
    created_at: "2024-02-14T11:30:00Z",
    response: "Thank you for your feedback! We're working on improving our checkout system.",
  },
  {
    rating_id: 3,
    user_id: 103,
    store_id: 1,
    rating_value: 5,
    comment: "Amazing experience! Found exactly what I was looking for.",
    created_at: "2024-02-13T12:00:00Z",
    response: null,
  },
  {
    rating_id: 4,
    user_id: 104,
    store_id: 1,
    rating_value: 3,
    comment: "Average experience. The store was a bit crowded and hard to navigate.",
    created_at: "2024-02-12T13:00:00Z",
    response: null,
  },
];

export function StoreOwnerDashboard() {
  // Authentication and authorization checks
  if (!isAuthenticated()) {
    window.location.href = "/login";
    return null;
  }

  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  if (!user || user.role !== "OWNER") {
    window.location.href = "/unauthorized";
    return null;
  }

  // State declarations
  const [storeInfo, setStoreInfo] = useState(mockStoreData);
  const [selectedReview, setSelectedReview] = useState(null);
  const [ownerId, setOwnerId] = useState(user.id);
  const [responseText, setResponseText] = useState("");
  const [isEditingStore, setIsEditingStore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState(mockReviews);
  const [error, setError] = useState(null);
  
  // Upload-specific states
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', or null
  const [uploadError, setUploadError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Fetch store information
  useEffect(() => {
    const fetchStoreInfo = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `http://localhost:4000/api/stores/${ownerId}`
        );
        const fetchedStoreInfo = response.data.stores[0];
        setStoreInfo({
          ...fetchedStoreInfo,
          id: fetchedStoreInfo.store_id, // Map store_id to id for consistency
        });
        console.log(
          "Store information fetched successfully:",
          fetchedStoreInfo
        );
      } catch (error) {
        console.error("Error fetching store information:", error);
        setError("Failed to load store information");
        setStoreInfo(mockStoreData);
      } finally {
        setLoading(false);
      }
    };

    if (ownerId) {
      fetchStoreInfo();
    }
  }, [ownerId]);

  // Fetch reviews based on storeInfo
  useEffect(() => {
    const fetchReviews = async () => {
      if (!storeInfo.id) return;
      console.log("Fetching reviews for store ID:", storeInfo.id);
      try {
        const response = await axios.get(
          `http://localhost:4000/api/ratings/${storeInfo.id}`
        );
        // Correctly handle review data and map 'rating_id' for consistency
        const reviewsData = response.data.ratings.map((review) => ({
          ...review,
          id: review.rating_id,
          rating: review.rating_value,
          customerName: review.user_id, // You might need to fetch user details for a real name
          comment: review.comment,
          date: new Date(review.created_at).toLocaleDateString(),
        }));
        setReviews(reviewsData);
        console.log("Reviews fetched successfully:", reviewsData);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviews(mockReviews);
      }
    };

    if (storeInfo.id && !loading) {
      fetchReviews();
    }
  }, [storeInfo.id, loading]);

  // Use useMemo to calculate analytics data from reviews
  const analytics = useMemo(() => {
    const totalReviews = reviews.length;
    let totalRatingSum = 0;
    const ratingDistribution = [
      { rating: 5, count: 0 },
      { rating: 4, count: 0 },
      { rating: 3, count: 0 },
      { rating: 2, count: 0 },
      { rating: 1, count: 0 },
    ];

    const weeklyRatings = []; // Placeholder for now, you need to implement this logic

    reviews.forEach((review) => {
      totalRatingSum += review.rating;
      const ratingIndex = 5 - review.rating;
      if (ratingIndex >= 0 && ratingIndex < ratingDistribution.length) {
        ratingDistribution[ratingIndex].count++;
      }
    });

    const averageRating = totalReviews > 0 ? (totalRatingSum / totalReviews).toFixed(1) : 0;

    return {
      totalReviews,
      averageRating,
      ratingDistribution,
      weeklyRatings, // Needs a more complex calculation based on review dates
    };
  }, [reviews]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const handleUpdateStore = async () => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/stores/${storeInfo.id}`,
        storeInfo
      );
      console.log("Store updated successfully:", response.data);
      setIsEditingStore(false);
      alert("Store information updated successfully!");
    } catch (error) {
      console.error("Error updating store:", error);
      alert("Failed to update store information");
    }
  };

  const handleSubmitResponse = async () => {
    if (responseText.trim() && selectedReview) {
      try {
        const response = await axios.post(
          `http://localhost:4000/api/reviews/${selectedReview.id}/respond`,
          {
            response: responseText,
          }
        );

        console.log("Response submitted:", response.data);

        // Update the local reviews state
        setReviews((prevReviews) =>
          prevReviews.map((review) =>
            review.id === selectedReview.id
              ? { ...review, response: responseText }
              : review
          )
        );

        setResponseText("");
        setSelectedReview(null);
        alert("Response submitted successfully!");
      } catch (error) {
        console.error("Error submitting response:", error);
        alert("Failed to submit response");
      }
    }
  };

  // Enhanced Cloudinary upload function with loading states
  const uploadImageToCloudinary = async (file, onUpload) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "posts123"); // Your Cloudinary upload preset
    data.append("cloud_name", "dgmnl7ox7");   // Your Cloudinary cloud name

    try {
      setUploading(true);
      setUploadStatus(null);
      setUploadError(null);
      setUploadProgress(0);

      // Simulate upload progress (since Cloudinary doesn't provide real progress)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 20;
        });
      }, 200);

      const res = await fetch(`https://api.cloudinary.com/v1_1/dgmnl7ox7/upload`, {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.secure_url) {
        console.log("Image uploaded successfully:", result.secure_url);
        setUploadStatus('success');
        onUpload(result.secure_url); // Send back uploaded URL
        
        // Clear success status after 3 seconds
        setTimeout(() => {
          setUploadStatus(null);
          setUploadProgress(0);
        }, 3000);
      } else {
        console.error("Cloudinary response missing secure_url", result);
        setUploadStatus('error');
        setUploadError("Upload failed: Invalid response from server");
      }
    } catch (error) {
      console.error("Upload failed", error);
      setUploadStatus('error');
      setUploadError(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setUploadError("Please select a valid image file (JPG, PNG, GIF, or WebP)");
        return;
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setUploadError("File size must be less than 5MB");
        return;
      }

      setSelectedFile(file);
      setUploadError(null);

      // Upload immediately
      uploadImageToCloudinary(
        file,
        (url) => setStoreInfo((prev) => ({ ...prev, image_url: url }))
      );
    }
  };
  
   useEffect(() => {
    document.title = "Store Owner Dashboard";
  }, []);

  
  const renderStars = (rating) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading store information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Store className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Store Owner Dashboard
                </h1>
                <p className="text-sm text-gray-600">{storeInfo.name}</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2 bg-transparent"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <p className="text-yellow-800">{error}</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Rating
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.averageRating}
              </div>
              <p className="text-xs text-muted-foreground">
                Based on all reviews
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Reviews
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalReviews}</div>
              <p className="text-xs text-muted-foreground">
                All-time customer reviews
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="store">Store Settings</TabsTrigger>
          </TabsList>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Rating Distribution</CardTitle>
                  <CardDescription>How customers rate your store</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.ratingDistribution.map((item) => (
                      <div key={item.rating} className="flex items-center gap-3">
                        <div className="flex items-center gap-1 w-12">
                          <span className="text-sm">{item.rating}</span>
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${(item.count / analytics.totalReviews) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground w-8">
                          {item.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Performance</CardTitle>
                  <CardDescription>Your store's rating trend over the past week</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* You need to implement logic to calculate recent ratings from the 'reviews' state */}
                  <p className="text-muted-foreground">
                    This section requires additional logic to process and display
                    recent performance data from your review timestamps.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
                <CardDescription>
                  Manage and respond to customer feedback
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold">
                            {`User id: ${review.user_id}`}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            {renderStars(review.rating)}
                            <span className="text-sm text-muted-foreground">
                              {review.date}
                            </span>
                          </div>
                        </div>
                        {!review.response && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedReview(review)}
                                className="flex items-center gap-2"
                              >
                                <Reply className="h-4 w-4" />
                                Reply
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle>Reply to Review</DialogTitle>
                                <DialogDescription>
                                  Respond to{" "}
                                  {review.customerName ||
                                    `User ${review.user_id}`}
                                  's review
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-center gap-2 mb-2">
                                    {renderStars(review.rating)}
                                    <span className="text-sm font-medium">
                                      {review.customerName ||
                                        `User ${review.user_id}`}
                                    </span>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {review.comment}
                                  </p>
                                </div>
                                <div>
                                  <Label htmlFor="response">
                                    Your Response
                                  </Label>
                                  <Textarea
                                    id="response"
                                    placeholder="Thank you for your feedback..."
                                    value={responseText}
                                    onChange={(e) =>
                                      setResponseText(e.target.value)
                                    }
                                    rows={4}
                                  />
                                </div>
                                <Button
                                  onClick={handleSubmitResponse}
                                  className="w-full"
                                  disabled={!responseText.trim()}
                                >
                                  Send Response
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-3">{review.comment}</p>
                      {review.response && (
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mt-3">
                          <p className="text-sm">
                            <span className="font-semibold">
                              Your response:
                            </span>{" "}
                            {review.response}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Store Settings Tab */}
          <TabsContent value="store">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Store Information</CardTitle>
                    <CardDescription>
                      Manage your store details and settings
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditingStore(!isEditingStore)}
                    className="flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    {isEditingStore ? "Cancel" : "Edit"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="storeName">Store Name</Label>
                      <Input
                        id="storeName"
                        value={storeInfo.name}
                        onChange={(e) =>
                          setStoreInfo({ ...storeInfo, name: e.target.value })
                        }
                        disabled={!isEditingStore}
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={storeInfo.category}
                        onChange={(e) =>
                          setStoreInfo({ ...storeInfo, category: e.target.value })
                        }
                        disabled={!isEditingStore}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={storeInfo.phone}
                        onChange={(e) =>
                          setStoreInfo({ ...storeInfo, phone: e.target.value })
                        }
                        disabled={!isEditingStore}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={storeInfo.email}
                        onChange={(e) =>
                          setStoreInfo({ ...storeInfo, email: e.target.value })
                        }
                        disabled={!isEditingStore}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        value={storeInfo.address}
                        onChange={(e) =>
                          setStoreInfo({ ...storeInfo, address: e.target.value })
                        }
                        disabled={!isEditingStore}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={storeInfo.description}
                        onChange={(e) =>
                          setStoreInfo({
                            ...storeInfo,
                            description: e.target.value,
                          })
                        }
                        disabled={!isEditingStore}
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label htmlFor="upload">Store Image</Label>
                      <div className="space-y-2">
                        <Input
                          id="upload"
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                          onChange={handleImageChange}
                          disabled={!isEditingStore || uploading}
                          className={uploading ? "cursor-not-allowed" : ""}
                        />
                        
                        {/* Upload Status Display */}
                        {uploading && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-blue-600">
                              <Upload className="h-4 w-4 animate-pulse" />
                              <span>Uploading image...</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                                style={{ width: `${uploadProgress}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-600">
                              {Math.round(uploadProgress)}% complete
                            </div>
                          </div>
                        )}

                        {uploadStatus === 'success' && (
                          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded-md">
                            <Check className="h-4 w-4" />
                            <span>Image uploaded successfully!</span>
                          </div>
                        )}

                        {uploadStatus === 'error' && (
                          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded-md">
                            <AlertCircle className="h-4 w-4" />
                            <span>Upload failed. Please try again.</span>
                          </div>
                        )}

                        {uploadError && (
                          <div className="text-sm text-red-600 bg-red-50 p-2 rounded-md">
                            {uploadError}
                          </div>
                        )}

                        {selectedFile && !uploading && (
                          <div className="text-sm text-gray-600">
                            Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)}KB)
                          </div>
                        )}

                        {/* Current Image Preview */}
                        {storeInfo.image_url && typeof storeInfo.image_url === 'string' && (
                          <div className="mt-2">
                            <Label className="text-sm text-gray-600 mb-2 block">Current Image:</Label>
                            <img 
                              src={storeInfo.image_url} 
                              alt="Store" 
                              className="w-24 h-24 object-cover rounded-lg border"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          </div>
                        )}

                        <div className="text-xs text-gray-500">
                          Supported formats: JPG, PNG, GIF, WebP (max 5MB)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {isEditingStore && (
                  <div className="flex justify-end gap-2 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditingStore(false);
                        setUploadError(null);
                        setSelectedFile(null);
                        setUploadStatus(null);
                      }}
                      disabled={uploading}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleUpdateStore}
                      disabled={uploading}
                    >
                      {uploading ? "Uploading..." : "Save Changes"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}