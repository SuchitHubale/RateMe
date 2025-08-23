import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/Tabs"
import { useStoreOwnerData } from "../hooks/useStoreOwnerData"
import { isAuthenticated } from "../Auth/auth"

import StoreOwnerHeader from "../components/store/StoreOwnerHeader"
import StoreStatsOverview from "../components/store/StoreStatsOverview"
import AnalyticsTab from "../components/store/AnalyticsTab"
import ReviewsManagement from "../components/store/ReviewsManagement"
import StoreSettings from "../components/store/StoreSettings"

const StoreOwnerDashboard = () => {
  // Authentication and authorization checks
  if (!isAuthenticated()) {
    window.location.href = "/login"
    return null
  }

  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null
  if (!user || user.role !== "OWNER") {
    window.location.href = "/unauthorized"
    return null
  }

  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("analytics")

  // Get owner ID from user object
  const ownerId = user.id

  // Use custom hook for all data and operations
  const {
    storeInfo,
    setStoreInfo,
    reviews,
    analytics,
    storeStats,
    loading,
    error,
    uploading,
    uploadProgress,
    uploadStatus,
    uploadError,
    selectedFile,
    updateStore,
    submitReviewResponse,
    handleImageChange
  } = useStoreOwnerData(ownerId)

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/login"
  }

  if (loading && !storeInfo.id) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400">Loading store information...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <StoreOwnerHeader 
        storeName={storeInfo.name || "Store Owner Dashboard"}
        onLogout={handleLogout}
      />

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-900/20 border border-red-700/50 rounded-md p-4 backdrop-blur-sm">
            <p className="text-red-300">{error}</p>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StoreStatsOverview stats={storeStats} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800 border-gray-700">
            <TabsTrigger 
              value="analytics" 
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300"
            >
              Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="reviews" 
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300"
            >
              Reviews
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300"
            >
              Store Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="mt-6">
            <AnalyticsTab analytics={analytics} reviews={reviews} />
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <ReviewsManagement 
              reviews={reviews}
              onSubmitResponse={submitReviewResponse}
            />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <StoreSettings
              storeInfo={storeInfo}
              setStoreInfo={setStoreInfo}
              onUpdateStore={updateStore}
              uploading={uploading}
              uploadProgress={uploadProgress}
              uploadStatus={uploadStatus}
              uploadError={uploadError}
              selectedFile={selectedFile}
              onImageChange={handleImageChange}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export { StoreOwnerDashboard }