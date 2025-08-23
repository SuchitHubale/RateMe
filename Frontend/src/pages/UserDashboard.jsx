import React, { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/Tabs"
import { UserHeader } from "../components/user/UserHeader"
import { StoreGrid } from "../components/user/StoreGrid"
import { UserReviews } from "../components/user/UserReviews"
import { useUserData } from "../hooks/useUserData"

export function UserDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  
  const {
    user,
    stores,
    userReviews,
    loading,
    error,
    submitReview
  } = useUserData()

  const handleRateStore = async (store, rating, comment) => {
    await submitReview(store, rating, comment)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <UserHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800 border-gray-700">
            <TabsTrigger 
              value="browse" 
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300"
            >
              Browse Stores
            </TabsTrigger>
            <TabsTrigger 
              value="reviews" 
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300"
            >
              My Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse">
            <StoreGrid
              stores={stores}
              loading={loading}
              error={error}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              onRateStore={handleRateStore}
            />
          </TabsContent>

          <TabsContent value="reviews">
            <UserReviews userReviews={userReviews} stores={stores} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}