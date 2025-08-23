import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../Card"
import { Button } from "../Button"
import { Input } from "../Input"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../Select"
import { Textarea } from "../Textarea"
import { Users, Search, MoreHorizontal, Plus } from "lucide-react"

export default function UserManagement({ 
  users, 
  loading, 
  searchTerm, 
  setSearchTerm, 
  onAddUser, 
  onDeleteUser,
  getUserId 
}) {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", address: "", role: "" })

  const handleAddUser = async () => {
    await onAddUser(newUser)
    setIsAddUserOpen(false)
    setNewUser({ name: "", email: "", password: "", address: "", role: "" })
  }

  return (
    <Card className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 border-gray-700/50 backdrop-blur-sm shadow-2xl">
      <CardHeader className="flex justify-between items-center border-b border-gray-700/50 pb-6">
        <div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            User Management
          </CardTitle>
          <CardDescription className="text-gray-400 mt-2">Manage all registered users</CardDescription>
        </div>
        <div className="flex items-center gap-4">
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
                                onClick={() => onDeleteUser(user)}
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
  )
}
