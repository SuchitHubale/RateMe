import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/Card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/Tabs"
import { Button } from "../components/Button"
import { Input } from "../components/Input"
import { Badge } from "../components/Badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/Table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/DropdownMenu"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/Dialog"
import { Label } from "../components/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/Select"
import { Textarea } from "../components/Textarea"
import { Users, Store, Star, MoreHorizontal, Search, TrendingUp, Shield, LogOut, Plus } from "lucide-react"
import { isAuthenticated } from "../Auth/auth";
import axios from "axios"

export default function AdminDashboard() {
   if (!isAuthenticated()) {
    // If not logged in, redirect to login page
    window.location.href = "/login";
    return null;
  }else if (localStorage.getItem("user") && JSON.parse(localStorage.getItem("user")).role !== "ADMIN") {
      window.location.href = "/unauthorized";
      return null;
    }

  const [users, setUsers] = useState([])
  const [stores, setStores] = useState([])
  const [ratings, setRatings] = useState([])
  const [update, setUpdate] = useState(0)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddStoreOpen, setIsAddStoreOpen] = useState(false)
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  // Updated newStore state - removed owner, added owner_id and email
  const [newStore, setNewStore] = useState({ 
    name: "", 
    email: "", 
    owner_id: "", 
    category: "", 
    address: "", 
    phone: "", 
    description: "" 
  })
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", address: "", role: "" })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch users with better error handling
        try {
          const usersResponse = await axios.get("http://localhost:4000/api/users");
          console.log("Fetched users:", usersResponse.data);
          
          // Ensure users is always an array
          const usersData = Array.isArray(usersResponse.data) 
            ? usersResponse.data 
            : usersResponse.data?.users || [];
          
          setUsers(usersData);
        } catch (userError) {
          console.error("Error fetching users:", userError);
          setUsers([]);
          // You might want to show an error message to the user
          alert("Failed to load users. Please check if the server is running.");
        }
        
        // Fetch stores (assuming endpoint exists)
        try {
          const storesResponse = await axios.get("http://localhost:4000/api/stores");
          const storesData = Array.isArray(storesResponse.data) 
            ? storesResponse.data 
            : storesResponse.data?.stores || [];
          setStores(storesData);
        } catch (e) {
          console.log("Stores endpoint not available:", e);
          setStores([]);
        }
        
        // Fetch ratings (assuming endpoint exists)
        try {
          const ratingsResponse = await axios.get("http://localhost:4000/api/ratings");
          const ratingsData = Array.isArray(ratingsResponse.data) 
            ? ratingsResponse.data 
            : ratingsResponse.data?.ratings || [];
          setRatings(ratingsData);
        } catch (e) {
          console.log("Ratings endpoint not available:", e);
          setRatings([]);
        }
        
      } catch (e) {
        console.error("Critical error in fetchData:", e);
        // Fallback to empty arrays to prevent crashes
        setUsers([]);
        setStores([]);
        setRatings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [update])

  const handleLogout = () => {
  // Remove stored data
  localStorage.removeItem("token"); // or whatever key you stored
  localStorage.removeItem("user");
  
  // Or clear everything:
  // localStorage.clear();
  // sessionStorage.clear();

  // Redirect to login page
  window.location.href = "/login";
};

  // Updated handleAddStore function
  const handleAddStore = async () => {
    try {
      const storeData = {
        name: newStore.name,
        email: newStore.email,
        address: newStore.address,
        category: newStore.category,
        phone: newStore.phone,
        description: newStore.description,
        owner_id: parseInt(newStore.owner_id) // Convert to integer
      };

      console.log("Adding new store:", storeData);
      
      // Make API call to create store
      const response = await axios.post("http://localhost:4000/api/stores", storeData, {
        headers: { "Content-Type": "application/json" }
      });

      console.log("Store created successfully:", response.data);
      
      // Refresh stores list
      setUpdate(prev => prev + 1);
      
      // Close dialog and reset form
      setIsAddStoreOpen(false);
      setNewStore({ 
        name: "", 
        email: "", 
        owner_id: "", 
        category: "", 
        address: "", 
        phone: "", 
        description: "" 
      });
      
      alert("Store added successfully!");
      
    } catch (error) {
      console.error("Error adding store:", error);
      
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Failed to add store. Please try again.");
      }
    }
  }

  const handleAddUser = async() => {
    try {
      const res = await axios.post("http://localhost:4000/api/auth/signup", {
        name: newUser.name,
        email: newUser.email,
        address: newUser.address,
        password: newUser.password,
        role: newUser.role
      }, {
        headers: { "Content-Type": "application/json" }
      })

      console.log("Signup successful:", res.data)
      setUpdate(prev => prev + 1)

      // Refresh users list after successful addition
      
      
      // Close dialog and reset form
      setIsAddUserOpen(false)
      setNewUser({ name: "", email: "", password: "", address: "", role: "" })
      
      alert("User added successfully!")
     
    } catch (err) {
      console.error("Signup error:", err)

      if (err.response?.data?.message) {
        alert(err.response.data.message)
      } else {
        alert("Something went wrong. Please try again.")
      }
    }
  }

  // Helper function to get user name by ID
  const getUserNameById = (userId) => {
    const user = users.find(u => u.user_id === userId || u._id === userId || u.id === userId);
    return user ? user.name : 'Unknown User';
  }

  const getStoreNameById = (storeId) => {
    const store = stores.find(s => s.store_id === storeId || s._id === storeId || s.id === storeId);
    return store ? store.name : 'Unknown Store';
  }

  // CORRECTED DELETE FUNCTIONS

  // Get the correct ID for user
  const getUserId = (user) => {
    return user.user_id || user._id || user.id;
  }

  // Get the correct ID for store
  const getStoreId = (store) => {
    return store.store_id || store._id || store.id;
  }

  // Get the correct ID for rating
  const getRatingId = (rating) => {
    return rating.rating_id || rating._id || rating.id;
  }

  // Corrected handleDeleteUser function
  const handleDeleteUser = async (user) => {
    const userId = getUserId(user);
    const userName = user.name || 'Unknown User';
    
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      console.log(`Attempting to delete user with ID: ${userId}`);
      
      const response = await axios.delete(`http://localhost:4000/api/users/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if required
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      console.log("User deleted successfully:", response.data);
      
      // Refresh users list
      setUpdate(prev => prev + 1);
      
      alert("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      
      if (error.response?.status === 404) {
        alert("User not found. It may have already been deleted.");
      } else if (error.response?.data?.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert("Failed to delete user. Please try again.");
      }
    }
  }

  // New handleDeleteStore function
  const handleDeleteStore = async (store) => {
    const storeId = getStoreId(store);
    const storeName = store.name || 'Unknown Store';
    
    if (!window.confirm(`Are you sure you want to delete store "${storeName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      console.log(`Attempting to delete store with ID: ${storeId}`);
      
      const response = await axios.delete(`http://localhost:4000/api/stores/${storeId}`, {
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if required
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      console.log("Store deleted successfully:", response.data);
      
      // Refresh stores list
      setUpdate(prev => prev + 1);
      
      alert("Store deleted successfully!");
    } catch (error) {
      console.error("Error deleting store:", error);
      
      if (error.response?.status === 404) {
        alert("Store not found. It may have already been deleted.");
      } else if (error.response?.data?.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert("Failed to delete store. Please try again.");
      }
    }
  }

  // New handleDeleteRating function
  const handleDeleteRating = async (rating) => {
    const ratingId = getRatingId(rating);
    const userName = getUserNameById(rating.user_id);
    const storeName = getStoreNameById(rating.store_id);
    
    if (!window.confirm(`Are you sure you want to delete the rating by "${userName}" for "${storeName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      console.log(`Attempting to delete rating with ID: ${ratingId}`);
      
      const response = await axios.delete(`http://localhost:4000/api/ratings/${ratingId}`, {
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if required
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      console.log("Rating deleted successfully:", response.data);
      
      // Refresh ratings list
      setUpdate(prev => prev + 1);
      
      alert("Rating deleted successfully!");
    } catch (error) {
      console.error("Error deleting rating:", error);
      
      if (error.response?.status === 404) {
        alert("Rating not found. It may have already been deleted.");
      } else if (error.response?.data?.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert("Failed to delete rating. Please try again.");
      }
    }
  }

  useEffect(() => {
    document.title = "Admin Dashboard";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-800/80 backdrop-blur-md border-b border-gray-700/50 sticky top-0 z-50 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout} 
              className="flex items-center gap-2 bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-red-600/20 hover:border-red-500 hover:text-red-300 cursor-pointer transition-all duration-300 backdrop-blur-sm"
            >
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-200">Total Users</CardTitle>
              <Users className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{users.length}</div>
              <p className="text-xs text-gray-400">Total registered users</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-200">Active Stores</CardTitle>
              <Store className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stores.length}</div>
              <p className="text-xs text-gray-400">Currently active stores</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-200">Total Ratings</CardTitle>
              <Star className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{ratings.length}</div>
              <p className="text-xs text-gray-400">Total user ratings</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-200">Avg Rating</CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {ratings.length > 0 
                  ? (ratings.reduce((acc, rating) => acc + rating.rating_value, 0) / ratings.length).toFixed(1)
                  : "0.0"
                }
              </div>
              <p className="text-xs text-gray-400">Average rating score</p>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        {/* make this responsive */}
        <Tabs defaultValue="users" className="space-y-6 ">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800 border-gray-700">
            <TabsTrigger value="users" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300">User Management</TabsTrigger>
            <TabsTrigger value="stores" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300">Store Management</TabsTrigger>
            <TabsTrigger value="ratings" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300">Rating Management</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="animate-in fade-in-50 duration-300">
            <Card className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 border-gray-700/50 backdrop-blur-sm shadow-2xl">
              <CardHeader className="flex justify-between items-center border-b border-gray-700/50 pb-6">
                <div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    User Management
                  </CardTitle>
                  <CardDescription className="text-gray-400 mt-2">Manage all registered users</CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  {/* for small screen hide  */}
                  <div className="hidden sm:block relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64 bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all backdrop-blur-sm"
                    />
                  </div>

                  <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 hover:-translate-y-0.5">
                        <Plus className="h-4 w-4" /> Add User
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-gray-800/95 to-gray-900/95 border-gray-700/50 backdrop-blur-md shadow-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                          Add New User
                        </DialogTitle>
                        <p className="text-gray-400">Create a new user account. Fill in all the required information.</p>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right text-gray-300 font-medium">Name</Label>
                          <Input
                            value={newUser.name}
                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                            className="col-span-3 bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all backdrop-blur-sm"
                            placeholder="Enter full name"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right text-gray-300 font-medium">Email</Label>
                          <Input
                            type="email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            className="col-span-3 bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all backdrop-blur-sm"
                            placeholder="Enter email address"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right text-gray-300 font-medium">Password</Label>
                          <Input
                            type="password"
                            value={newUser.password}
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            className="col-span-3 bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all backdrop-blur-sm"
                            placeholder="Enter password"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right text-gray-300 font-medium">Address</Label>
                          <Textarea
                            value={newUser.address}
                            onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                            className="col-span-3 bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all backdrop-blur-sm resize-none"
                            rows={3}
                            placeholder="Enter address"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right text-gray-300 font-medium">Role</Label>
                          <Select onValueChange={(val) => setNewUser({ ...newUser, role: val })}>
                            <SelectTrigger className="col-span-3 bg-gray-700/50 border-gray-600/50 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all backdrop-blur-sm">
                              <SelectValue placeholder="Select user role" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-700/95 border-gray-600/50 backdrop-blur-md">
                              <SelectItem value="ADMIN" className="text-white hover:bg-gray-600/50 focus:bg-gray-600/50">Admin</SelectItem>
                              <SelectItem value="USER" className="text-white hover:bg-gray-600/50 focus:bg-gray-600/50">User</SelectItem>
                              <SelectItem value="OWNER" className="text-white hover:bg-gray-600/50 focus:bg-gray-600/50">Owner</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button 
                          onClick={handleAddUser} 
                          className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          Add User
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-gray-400">Loading users...</p>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-b-lg">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-700/50 bg-gray-800/50">
                          <TableHead className="text-gray-300 font-semibold">Name</TableHead>
                          <TableHead className="text-gray-300 font-semibold">Email</TableHead>
                          <TableHead className="text-gray-300 font-semibold">Role</TableHead>
                          <TableHead className="text-gray-300 font-semibold">Join Date</TableHead>
                          <TableHead className="text-right text-gray-300 font-semibold">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.length === 0 ? (
                          <TableRow className="border-gray-700/50">
                            <TableCell colSpan={5} className="text-center py-8 text-gray-400">
                              <div className="flex flex-col items-center gap-2">
                                <Users className="h-12 w-12 text-gray-600" />
                                <p>No users found</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          users
                            .filter(user => {
                              if (!user || (!user.name && !user.email)) return false;
                              const name = user.name || '';
                              const email = user.email || '';
                              return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                     email.toLowerCase().includes(searchTerm.toLowerCase());
                            })
                            .map((user) => (
                              <TableRow key={getUserId(user)} className="border-gray-700/50 hover:bg-gray-800/30 transition-all duration-200 group">
                                <TableCell className="font-medium text-white group-hover:text-blue-300 transition-colors">{user.name || 'N/A'}</TableCell>
                                <TableCell className="text-gray-300">{user.email || 'N/A'}</TableCell>
                                <TableCell>
                                  <Badge
                                    variant={
                                      user.role === "ADMIN" ? "default" : 
                                      user.role === "OWNER" ? "secondary" : "outline"
                                    }
                                    className={
                                      user.role === "ADMIN" ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white border-0 shadow-lg" :
                                      user.role === "OWNER" ? "bg-gradient-to-r from-green-600 to-green-500 text-white border-0 shadow-lg" : 
                                      "bg-gradient-to-r from-gray-600 to-gray-500 text-white border-0 shadow-lg"
                                    }
                                  >
                                    {user.role || 'USER'}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-gray-300">
                                  {user.created_at 
                                    ? new Date(user.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short', 
                                        day: 'numeric'
                                      })
                                    : user.joinDate || "N/A"
                                  }
                                </TableCell>
                                <TableCell className="text-right">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:bg-gray-700/50 hover:text-white transition-all duration-200">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="bg-gray-700/95 border-gray-600/50 backdrop-blur-md shadow-xl">
                                      <DropdownMenuItem className="text-gray-300 hover:bg-gray-600/50 hover:text-white focus:bg-gray-600/50 focus:text-white transition-all">Edit User</DropdownMenuItem>
                                      <DropdownMenuItem className="text-gray-300 hover:bg-gray-600/50 hover:text-white focus:bg-gray-600/50 focus:text-white transition-all">View Details</DropdownMenuItem>
                                      <DropdownMenuItem 
                                        className="text-red-400 hover:bg-red-600/20 hover:text-red-300 focus:bg-red-600/20 focus:text-red-300 transition-all" 
                                        onClick={() => handleDeleteUser(user)}
                                      >
                                        Delete User
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stores Tab - Updated */}
          <TabsContent value="stores">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-white">Store Management</CardTitle>
                  <CardDescription className="text-gray-400">Manage all registered stores</CardDescription>
                </div>
                <Dialog open={isAddStoreOpen} onOpenChange={setIsAddStoreOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus className="h-4 w-4" /> Add Store
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] bg-gray-800 border-gray-700">
                    <DialogHeader>
                      <DialogTitle className="text-white">Add New Store</DialogTitle>
                      <p className="text-gray-400">Create a new store entry. Fill in all the required information.</p>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      {/* Store Name */}
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right text-gray-300">Name</Label>
                        <Input
                          value={newStore.name}
                          onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
                          className="col-span-3 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          placeholder="Enter store name"
                        />
                      </div>

                      {/* Store Email */}
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right text-gray-300">Email</Label>
                        <Input
                          type="email"
                          value={newStore.email}
                          onChange={(e) => setNewStore({ ...newStore, email: e.target.value })}
                          className="col-span-3 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          placeholder="Enter store email"
                        />
                      </div>

                      {/* Owner Selection */}
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right text-gray-300">Owner</Label>
                        <Select onValueChange={(val) => setNewStore({ ...newStore, owner_id: val })}>
                          <SelectTrigger className="col-span-3 bg-gray-700 border-gray-600 text-white">
                            <SelectValue placeholder="Select store owner" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-700 border-gray-600">
                            {users.filter(user => user.role === "OWNER").length > 0 ? (
                              users
                                .filter(user => user.role === "OWNER")
                                .map((user) => (
                                  <SelectItem 
                                    key={getUserId(user)} 
                                    value={String(getUserId(user))}
                                    className="text-white hover:bg-gray-600"
                                  >
                                    {user.name} ({user.email})
                                  </SelectItem>
                                ))
                            ) : (
                              <>
                                <SelectItem value="no-owners" disabled className="text-gray-400">
                                  No owners available
                                </SelectItem>
                                {users.length > 0 && (
                                  <>
                                    <SelectItem value="separator" disabled className="text-gray-400">
                                      --- All Users ---
                                    </SelectItem>
                                    {users.map((user) => (
                                      <SelectItem 
                                        key={getUserId(user)} 
                                        value={String(getUserId(user))}
                                        className="text-white hover:bg-gray-600"
                                      >
                                        {user.name} ({user.email}) - {user.role || 'USER'}
                                      </SelectItem>
                                    ))}
                                  </>
                                )}
                              </>
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Category */}
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right text-gray-300">Category</Label>
                        <Select onValueChange={(val) => setNewStore({ ...newStore, category: val })}>
                          <SelectTrigger className="col-span-3 bg-gray-700 border-gray-600 text-white">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-700 border-gray-600">
                            <SelectItem value="Electronics" className="text-white hover:bg-gray-600">Electronics</SelectItem>
                            <SelectItem value="Clothing" className="text-white hover:bg-gray-600">Clothing</SelectItem>
                            <SelectItem value="Books" className="text-white hover:bg-gray-600">Books</SelectItem>
                            <SelectItem value="Grocery" className="text-white hover:bg-gray-600">Grocery</SelectItem>
                            <SelectItem value="Cafe" className="text-white hover:bg-gray-600">Cafe</SelectItem>
                            <SelectItem value="Sports" className="text-white hover:bg-gray-600">Sports</SelectItem>
                            <SelectItem value="Other" className="text-white hover:bg-gray-600">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Address */}
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right text-gray-300">Address</Label>
                        <Textarea
                          value={newStore.address}
                          onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
                          className="col-span-3 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          rows={3}
                          placeholder="Enter store address"
                        />
                      </div>

                      {/* Phone */}
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right text-gray-300">Phone</Label>
                        <Input
                          value={newStore.phone}
                          onChange={(e) => setNewStore({ ...newStore, phone: e.target.value })}
                          className="col-span-3 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          placeholder="Enter phone number"
                        />
                      </div>

                      {/* Description */}
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right text-gray-300">Description</Label>
                        <Textarea
                          value={newStore.description}
                          onChange={(e) => setNewStore({ ...newStore, description: e.target.value })}
                          className="col-span-3 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          rows={3}
                          placeholder="Store description"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleAddStore} className="bg-blue-600 hover:bg-blue-700 text-white">Add Store</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <p className="text-gray-400">Loading stores...</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700">
                        <TableHead className="text-gray-300">Store Name</TableHead>
                        <TableHead className="text-gray-300">Email</TableHead>
                        <TableHead className="text-gray-300">Owner</TableHead>
                        <TableHead className="text-gray-300">Category</TableHead>
                        <TableHead className="text-gray-300">Rating</TableHead>
                        <TableHead className="text-gray-300">Reviews</TableHead>
                        <TableHead className="text-gray-300">Status</TableHead>
                        <TableHead className="text-right text-gray-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stores.length === 0 ? (
                        <TableRow className="border-gray-700">
                          <TableCell colSpan={8} className="text-center py-4 text-gray-400">
                            No stores found
                          </TableCell>
                        </TableRow>
                      ) : (
                        stores.map((store) => (
                          <TableRow key={getStoreId(store)} className="border-gray-700 hover:bg-gray-750">
                            <TableCell className="font-medium text-white">{store.name}</TableCell>
                            <TableCell className="text-gray-300">{store.email}</TableCell>
                            <TableCell className="text-gray-300">{getUserNameById(store.owner_id)}</TableCell>
                            <TableCell className="text-gray-300">{store.category}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 ">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /> 
                                <span className="text-white">{store.average_rating || "0.0"}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-300">{store.review_count || store.reviewCount || 0}</TableCell>
                            <TableCell>
                              <Badge variant={"default"} className="bg-green-600 text-white">
                                {"active"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:bg-gray-700 hover:text-white">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-gray-700 border-gray-600">
                                  <DropdownMenuItem className="text-gray-300 hover:bg-gray-600 hover:text-white">Edit Store</DropdownMenuItem>
                                  <DropdownMenuItem className="text-gray-300 hover:bg-gray-600 hover:text-white">View Details</DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-red-400 hover:bg-gray-600 hover:text-red-300"
                                    onClick={() => handleDeleteStore(store)}
                                  >
                                    Delete Store
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ratings Tab */}
          <TabsContent value="ratings">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-white">Rating Management</CardTitle>
                  <CardDescription className="text-gray-400">Manage all user ratings and reviews</CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search ratings..." className="pl-8 w-64 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <p className="text-gray-400">Loading ratings...</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700">
                        <TableHead className="text-gray-300">User</TableHead>
                        <TableHead className="text-gray-300">Store</TableHead>
                        <TableHead className="text-gray-300">Rating</TableHead>
                        <TableHead className="text-gray-300">Comment</TableHead>
                        <TableHead className="text-gray-300">Date</TableHead>
                        <TableHead className="text-right text-gray-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ratings.length === 0 ? (
                        <TableRow className="border-gray-700">
                          <TableCell colSpan={6} className="text-center py-4 text-gray-400">
                            No ratings found
                          </TableCell>
                        </TableRow>
                      ) : (
                        ratings.map((rating) => (
                          <TableRow key={getRatingId(rating)} className="border-gray-700 hover:bg-gray-750">
                            <TableCell className="font-medium text-white">
                              {getUserNameById(rating.user_id)}
                            </TableCell>
                            <TableCell className="text-gray-300">{getStoreNameById(rating.store_id)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`h-4 w-4 ${i < rating.rating_value ? "fill-yellow-400 text-yellow-400" : "text-gray-500"}`} 
                                  />
                                ))}
                              </div>
                            </TableCell>
                            <TableCell className="max-w-xs truncate text-gray-300">
                              {rating.comment || rating.review || "No comment"}
                            </TableCell>
                            <TableCell className="text-gray-300">
                              {rating.created_at 
                                  ? new Date(rating.created_at).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'short', 
                                      day: 'numeric'
                                    })
                                  : rating.joinDate || "N/A"
                                }
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:bg-gray-700 hover:text-white">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-gray-700 border-gray-600">
                                  <DropdownMenuItem className="text-gray-300 hover:bg-gray-600 hover:text-white">View Details</DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-red-400 hover:bg-gray-600 hover:text-red-300"
                                    onClick={() => handleDeleteRating(rating)}
                                  >
                                    Delete Rating
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}