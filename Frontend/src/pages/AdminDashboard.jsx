import React, { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/Tabs"
import { isAuthenticated } from "../Auth/auth"
import { useAdminData } from "../hooks/useAdminData"
import AdminHeader from "../components/admin/AdminHeader"
import StatsOverview from "../components/admin/StatsOverview"
import UserManagement from "../components/admin/UserManagement"
import StoreManagement from "../components/admin/StoreManagement"
import RatingManagement from "../components/admin/RatingManagement"

function AdminDashboard() {
  if (!isAuthenticated()) {
    // If not logged in, redirect to login page
    window.location.href = "/login";
    return null;
  } else if (localStorage.getItem("user") && JSON.parse(localStorage.getItem("user")).role !== "ADMIN") {
    window.location.href = "/unauthorized";
    return null;
  }

  const [searchTerm, setSearchTerm] = useState("")

  const {
    users,
    stores,
    ratings,
    loading,
    getUserId,
    getStoreId,
    getRatingId,
    getUserNameById,
    getStoreNameById,
    handleAddUser,
    handleAddStore,
    handleDeleteUser,
    handleDeleteStore,
    handleDeleteRating
  } = useAdminData()

  const handleLogout = () => {
    // Remove stored data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect to login page
    window.location.href = "/login";
  }

  useEffect(() => {
    document.title = "Admin Dashboard";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <AdminHeader onLogout={handleLogout} />

      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <StatsOverview users={users} stores={stores} ratings={ratings} />

        {/* Management Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800 border-gray-700">
            <TabsTrigger value="users" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300">User Management</TabsTrigger>
            <TabsTrigger value="stores" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300">Store Management</TabsTrigger>
            <TabsTrigger value="ratings" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300">Rating Management</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="duration-300 animate-in fade-in-50">
            <UserManagement
              users={users}
              loading={loading}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onAddUser={handleAddUser}
              onDeleteUser={handleDeleteUser}
              getUserId={getUserId}
            />
          </TabsContent>

          {/* Stores Tab */}
          <TabsContent value="stores">
            <StoreManagement
              stores={stores}
              users={users}
              loading={loading}
              onAddStore={handleAddStore}
              onDeleteStore={handleDeleteStore}
              getUserNameById={getUserNameById}
              getStoreId={getStoreId}
              getUserId={getUserId}
            />
          </TabsContent>

          {/* Ratings Tab */}
          <TabsContent value="ratings">
            <RatingManagement
              ratings={ratings}
              loading={loading}
              onDeleteRating={handleDeleteRating}
              getUserNameById={getUserNameById}
              getStoreNameById={getStoreNameById}
              getRatingId={getRatingId}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export { AdminDashboard }