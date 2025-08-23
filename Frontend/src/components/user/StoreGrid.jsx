import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../Card"
import { Button } from "../Button"
import { Input } from "../Input"
import { Badge } from "../Badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Select"
import { Star, Search, MapPin, Filter, Loader2 } from "lucide-react"
import { ReviewDialog } from "./ReviewDialog"

export function StoreGrid({ 
  stores, 
  loading, 
  error, 
  searchTerm, 
  setSearchTerm, 
  selectedCategory, 
  setSelectedCategory,
  onRateStore 
}) {
  // Get unique categories from fetched stores
  const categories = ["all", ...new Set(stores.map(store => store.category).filter(Boolean))]

  const filteredStores = stores.filter((store) => {
    const matchesSearch =
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || store.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg text-gray-600">Loading stores...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg mb-2">Error loading stores</div>
        <div className="text-gray-600 mb-4">{error}</div>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
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

      {/* No Results Message */}
      {filteredStores.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-600 text-lg">No stores found</div>
          <div className="text-gray-500">Try adjusting your search or filter criteria</div>
        </div>
      )}

      {/* Store Grid */}
      {filteredStores.length > 0 && (
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
                <ReviewDialog store={store} onSubmitReview={onRateStore} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
