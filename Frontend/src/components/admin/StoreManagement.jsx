import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../Card"
import { Button } from "../Button"
import { Badge } from "../Badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../Table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../DropdownMenu"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../Dialog"
import { Label } from "../Label"
import { Input } from "../Input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Select"
import { Textarea } from "../Textarea"
import { Star, MoreHorizontal, Plus } from "lucide-react"

export default function StoreManagement({ 
  stores, 
  users, 
  loading, 
  onAddStore, 
  onDeleteStore, 
  getUserNameById, 
  getStoreId, 
  getUserId 
}) {
  const [isAddStoreOpen, setIsAddStoreOpen] = useState(false)
  const [newStore, setNewStore] = useState({ 
    name: "", 
    email: "", 
    owner_id: "", 
    category: "", 
    address: "", 
    phone: "", 
    description: "" 
  })

  const handleAddStore = async () => {
    await onAddStore(newStore)
    setIsAddStoreOpen(false)
    setNewStore({ 
      name: "", 
      email: "", 
      owner_id: "", 
      category: "", 
      address: "", 
      phone: "", 
      description: "" 
    })
  }

  return (
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
                            onClick={() => onDeleteStore(store)}
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
  )
}
