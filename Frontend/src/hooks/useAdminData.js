import { useState, useEffect } from "react"
import axios from "axios"
import toast from 'react-hot-toast'

export function useAdminData() {
  const [users, setUsers] = useState([])
  const [stores, setStores] = useState([])
  const [ratings, setRatings] = useState([])
  const [update, setUpdate] = useState(0)
  const [loading, setLoading] = useState(true)

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
          toast.error("Failed to load users. Please check if the server is running.");
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

  // Helper functions
  const getUserId = (user) => {
    return user.user_id || user._id || user.id;
  }

  const getStoreId = (store) => {
    return store.store_id || store._id || store.id;
  }

  const getRatingId = (rating) => {
    return rating.rating_id || rating._id || rating.id;
  }

  const getUserNameById = (userId) => {
    const user = users.find(u => u.user_id === userId || u._id === userId || u.id === userId);
    return user ? user.name : 'Unknown User';
  }

  const getStoreNameById = (storeId) => {
    const store = stores.find(s => s.store_id === storeId || s._id === storeId || s.id === storeId);
    return store ? store.name : 'Unknown Store';
  }

  // CRUD operations
  const handleAddUser = async (newUser) => {
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
      toast.success("User added successfully!")
     
    } catch (err) {
      console.error("Signup error:", err)

      if (err.response?.data?.message) {
        toast.error(err.response.data.message)
      } else {
        toast.error("Something went wrong. Please try again.")
      }
    }
  }

  const handleAddStore = async (newStore) => {
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
      toast.success("Store added successfully!");
      
    } catch (error) {
      console.error("Error adding store:", error);
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to add store. Please try again.");
      }
    }
  }

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
        }
      });
      
      console.log("User deleted successfully:", response.data);
      
      // Refresh users list
      setUpdate(prev => prev + 1);
      
      toast.success("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      
      if (error.response?.status === 404) {
        toast.error("User not found. It may have already been deleted.");
      } else if (error.response?.data?.message) {
        toast.error(`Error: ${error.response.data.message}`);
      } else {
        toast.error("Failed to delete user. Please try again.");
      }
    }
  }

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
        }
      });
      
      console.log("Store deleted successfully:", response.data);
      
      // Refresh stores list
      setUpdate(prev => prev + 1);
      
      toast.success("Store deleted successfully!");
    } catch (error) {
      console.error("Error deleting store:", error);
      
      if (error.response?.status === 404) {
        toast.error("Store not found. It may have already been deleted.");
      } else if (error.response?.data?.message) {
        toast.error(`Error: ${error.response.data.message}`);
      } else {
        toast.error("Failed to delete store. Please try again.");
      }
    }
  }

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
        }
      });
      
      console.log("Rating deleted successfully:", response.data);
      
      // Refresh ratings list
      setUpdate(prev => prev + 1);
      
      toast.success("Rating deleted successfully!");
    } catch (error) {
      console.error("Error deleting rating:", error);
      
      if (error.response?.status === 404) {
        toast.error("Rating not found. It may have already been deleted.");
      } else if (error.response?.data?.message) {
        toast.error(`Error: ${error.response.data.message}`);
      } else {
        toast.error("Failed to delete rating. Please try again.");
      }
    }
  }

  return {
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
  }
}
