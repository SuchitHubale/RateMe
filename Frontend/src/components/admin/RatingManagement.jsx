import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../Card"
import { Button } from "../Button"
import { Input } from "../Input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../Table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../DropdownMenu"
import { Star, Search, MoreHorizontal } from "lucide-react"

export default function RatingManagement({ 
  ratings, 
  loading, 
  onDeleteRating, 
  getUserNameById, 
  getStoreNameById, 
  getRatingId 
}) {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="flex justify-between items-center">
        <div>
          <CardTitle className="text-white">Rating Management</CardTitle>
          <CardDescription className="text-gray-400">Manage all user ratings and reviews</CardDescription>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search ratings..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-64 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500" 
          />
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
                ratings
                  .filter(rating => {
                    if (!searchTerm) return true;
                    const userName = getUserNameById(rating.user_id).toLowerCase();
                    const storeName = getStoreNameById(rating.store_id).toLowerCase();
                    const comment = (rating.comment || rating.review || "").toLowerCase();
                    return userName.includes(searchTerm.toLowerCase()) ||
                           storeName.includes(searchTerm.toLowerCase()) ||
                           comment.includes(searchTerm.toLowerCase());
                  })
                  .map((rating) => (
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
                              onClick={() => onDeleteRating(rating)}
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
  )
}
