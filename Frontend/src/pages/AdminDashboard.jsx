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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
            </div>
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2 bg-transparent cursor-pointer">
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">Total registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Stores</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stores.length}</div>
              <p className="text-xs text-muted-foreground">Currently active stores</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Ratings</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ratings.length}</div>
              <p className="text-xs text-muted-foreground">Total user ratings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {ratings.length > 0 
                  ? (ratings.reduce((acc, rating) => acc + rating.rating_value, 0) / ratings.length).toFixed(1)
                  : "0.0"
                }
              </div>
              <p className="text-xs text-muted-foreground">Average rating score</p>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        {/* make this responsive */}
        <Tabs defaultValue="users" className="space-y-6 ">
          <TabsList className="grid w-full grid-cols-3  ">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="stores">Store Management</TabsTrigger>
            <TabsTrigger value="ratings">Rating Management</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader className="flex justify-between items-center">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage all registered users</CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  {/* for small screen hide  */}
                  <div className="hidden sm:block relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-64"
                    />
                  </div>

                  <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2">
                        <Plus className="h-4 w-4" /> Add User
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                        <p>Create a new user account. Fill in all the required information.</p>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right">Name</Label>
                          <Input
                            value={newUser.name}
                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                            className="col-span-3"
                            placeholder="Enter full name"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right">Email</Label>
                          <Input
                            type="email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                            className="col-span-3"
                            placeholder="Enter email address"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right">Password</Label>
                          <Input
                            type="password"
                            value={newUser.password}
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            className="col-span-3"
                            placeholder="Enter password"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right">Address</Label>
                          <Textarea
                            value={newUser.address}
                            onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                            className="col-span-3"
                            rows={3}
                            placeholder="Enter address"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right">Role</Label>
                          <Select onValueChange={(val) => setNewUser({ ...newUser, role: val })}>
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select user role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ADMIN">Admin</SelectItem>
                              <SelectItem value="USER">User</SelectItem>
                              <SelectItem value="OWNER">Owner</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleAddUser}>Add User</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <p>Loading users...</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Join Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4">
                            No users found
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
                            <TableRow key={getUserId(user)}>
                              <TableCell className="font-medium">{user.name || 'N/A'}</TableCell>
                              <TableCell>{user.email || 'N/A'}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    user.role === "ADMIN" ? "default" : 
                                    user.role === "OWNER" ? "secondary" : "outline"
                                  }
                                >
                                  {user.role || 'USER'}
                                </Badge>
                              </TableCell>
                              <TableCell>
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
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>Edit User</DropdownMenuItem>
                                    <DropdownMenuItem>View Details</DropdownMenuItem>
                                    <DropdownMenuItem 
                                      className="text-red-600" 
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
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stores Tab - Updated */}
          <TabsContent value="stores">
            <Card>
              <CardHeader className="flex justify-between items-center">
                <div>
                  <CardTitle>Store Management</CardTitle>
                  <CardDescription>Manage all registered stores</CardDescription>
                </div>
                <Dialog open={isAddStoreOpen} onOpenChange={setIsAddStoreOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" /> Add Store
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add New Store</DialogTitle>
                      <p>Create a new store entry. Fill in all the required information.</p>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      {/* Store Name */}
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Name</Label>
                        <Input
                          value={newStore.name}
                          onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
                          className="col-span-3"
                          placeholder="Enter store name"
                        />
                      </div>

                      {/* Store Email */}
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Email</Label>
                        <Input
                          type="email"
                          value={newStore.email}
                          onChange={(e) => setNewStore({ ...newStore, email: e.target.value })}
                          className="col-span-3"
                          placeholder="Enter store email"
                        />
                      </div>

                      {/* Owner Selection */}
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Owner</Label>
                        <Select onValueChange={(val) => setNewStore({ ...newStore, owner_id: val })}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select store owner" />
                          </SelectTrigger>
                          <SelectContent>
                            {users.map((user) => (
                              user.role === "OWNER" && (
                              <SelectItem 
                                key={getUserId(user)} 
                                value={String(getUserId(user))}
                              >
                                {user.name} ({user.email})
                              </SelectItem>
                            ))
                          )}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Category */}
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Category</Label>
                        <Select onValueChange={(val) => setNewStore({ ...newStore, category: val })}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Electronics">Electronics</SelectItem>
                            <SelectItem value="Clothing">Clothing</SelectItem>
                            <SelectItem value="Books">Books</SelectItem>
                            <SelectItem value="Grocery">Grocery</SelectItem>
                            <SelectItem value="Cafe">Cafe</SelectItem>
                            <SelectItem value="Sports">Sports</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Address */}
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Address</Label>
                        <Textarea
                          value={newStore.address}
                          onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
                          className="col-span-3"
                          rows={3}
                          placeholder="Enter store address"
                        />
                      </div>

                      {/* Phone */}
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Phone</Label>
                        <Input
                          value={newStore.phone}
                          onChange={(e) => setNewStore({ ...newStore, phone: e.target.value })}
                          className="col-span-3"
                          placeholder="Enter phone number"
                        />
                      </div>

                      {/* Description */}
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Description</Label>
                        <Textarea
                          value={newStore.description}
                          onChange={(e) => setNewStore({ ...newStore, description: e.target.value })}
                          className="col-span-3"
                          rows={3}
                          placeholder="Store description"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleAddStore}>Add Store</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <p>Loading stores...</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Store Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Reviews</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stores.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-4">
                            No stores found
                          </TableCell>
                        </TableRow>
                      ) : (
                        stores.map((store) => (
                          <TableRow key={getStoreId(store)}>
                            <TableCell className="font-medium">{store.name}</TableCell>
                            <TableCell>{store.email}</TableCell>
                            <TableCell>{getUserNameById(store.owner_id)}</TableCell>
                            <TableCell>{store.category}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 ">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /> 
                                {store.average_rating || "0.0"}
                              </div>
                            </TableCell>
                            <TableCell>{store.review_count || store.reviewCount || 0}</TableCell>
                            <TableCell>
                              <Badge variant={"default"}>
                                {"active"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>Edit Store</DropdownMenuItem>
                                  <DropdownMenuItem>View Details</DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-red-600"
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
            <Card>
              <CardHeader className="flex justify-between items-center">
                <div>
                  <CardTitle>Rating Management</CardTitle>
                  <CardDescription>Manage all user ratings and reviews</CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search ratings..." className="pl-8 w-64" />
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <p>Loading ratings...</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Store</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Comment</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ratings.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-4">
                            No ratings found
                          </TableCell>
                        </TableRow>
                      ) : (
                        ratings.map((rating) => (
                          <TableRow key={getRatingId(rating)}>
                            <TableCell className="font-medium">
                              {getUserNameById(rating.user_id)}
                            </TableCell>
                            <TableCell>{getStoreNameById(rating.store_id)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`h-4 w-4 ${i < rating.rating_value ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} 
                                  />
                                ))}
                              </div>
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                              {rating.comment || rating.review || "No comment"}
                            </TableCell>
                            <TableCell>
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
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>View Details</DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-red-600"
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