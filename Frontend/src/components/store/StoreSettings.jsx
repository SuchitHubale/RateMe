import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../Card"
import { Button } from "../Button"
import { Input } from "../Input"
import { Textarea } from "../Textarea"
import { Label } from "../Label"
import { Edit, Upload, Check, AlertCircle } from "lucide-react"

export default function StoreSettings({ 
  storeInfo, 
  setStoreInfo, 
  onUpdateStore,
  uploading,
  uploadProgress,
  uploadStatus,
  uploadError,
  selectedFile,
  onImageChange
}) {
  const [isEditingStore, setIsEditingStore] = useState(false)

  const handleUpdateStore = async () => {
    await onUpdateStore()
    setIsEditingStore(false)
  }

  const handleCancel = () => {
    setIsEditingStore(false)
    // Reset any upload states if needed
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-white">Store Information</CardTitle>
            <CardDescription className="text-gray-400">
              Manage your store details and settings
            </CardDescription>
          </div>
          <Button
            variant="outline"
            onClick={() => setIsEditingStore(!isEditingStore)}
            className="flex items-center gap-2 bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-600/50 hover:text-white"
          >
            <Edit className="h-4 w-4" />
            {isEditingStore ? "Cancel" : "Edit"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="storeName" className="text-gray-300">Store Name</Label>
              <Input
                id="storeName"
                value={storeInfo.name}
                onChange={(e) =>
                  setStoreInfo({ ...storeInfo, name: e.target.value })
                }
                disabled={!isEditingStore}
                className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 disabled:bg-gray-800/50 disabled:text-gray-400"
              />
            </div>
            <div>
              <Label htmlFor="category" className="text-gray-300">Category</Label>
              <Input
                id="category"
                value={storeInfo.category}
                onChange={(e) =>
                  setStoreInfo({ ...storeInfo, category: e.target.value })
                }
                disabled={!isEditingStore}
                className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 disabled:bg-gray-800/50 disabled:text-gray-400"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-gray-300">Phone</Label>
              <Input
                id="phone"
                value={storeInfo.phone}
                onChange={(e) =>
                  setStoreInfo({ ...storeInfo, phone: e.target.value })
                }
                disabled={!isEditingStore}
                className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 disabled:bg-gray-800/50 disabled:text-gray-400"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                value={storeInfo.email}
                onChange={(e) =>
                  setStoreInfo({ ...storeInfo, email: e.target.value })
                }
                disabled={!isEditingStore}
                className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 disabled:bg-gray-800/50 disabled:text-gray-400"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="address" className="text-gray-300">Address</Label>
              <Textarea
                id="address"
                value={storeInfo.address}
                onChange={(e) =>
                  setStoreInfo({ ...storeInfo, address: e.target.value })
                }
                disabled={!isEditingStore}
                rows={3}
                className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 disabled:bg-gray-800/50 disabled:text-gray-400"
              />
            </div>
            <div>
              <Label htmlFor="description" className="text-gray-300">Description</Label>
              <Textarea
                id="description"
                value={storeInfo.description}
                onChange={(e) =>
                  setStoreInfo({
                    ...storeInfo,
                    description: e.target.value,
                  })
                }
                disabled={!isEditingStore}
                rows={4}
                className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 disabled:bg-gray-800/50 disabled:text-gray-400"
              />
            </div>
            <div>
              <Label htmlFor="upload" className="text-gray-300">Store Image</Label>
              <div className="space-y-2">
                <Input
                  id="upload"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={onImageChange}
                  disabled={!isEditingStore || uploading}
                  className={`bg-gray-700/50 border-gray-600 text-gray-300 file:bg-gray-600 file:text-gray-200 file:border-0 file:rounded file:px-3 file:py-1 ${uploading ? "cursor-not-allowed" : ""}`}
                />
                
                {/* Upload Status Display */}
                {uploading && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-blue-400">
                      <Upload className="h-4 w-4 animate-pulse" />
                      <span>Uploading image...</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {Math.round(uploadProgress)}% complete
                    </div>
                  </div>
                )}

                {uploadStatus === 'success' && (
                  <div className="flex items-center gap-2 text-sm text-green-400 bg-green-900/20 p-2 rounded-md border border-green-700/50">
                    <Check className="h-4 w-4" />
                    <span>Image uploaded successfully!</span>
                  </div>
                )}

                {uploadStatus === 'error' && (
                  <div className="flex items-center gap-2 text-sm text-red-400 bg-red-900/20 p-2 rounded-md border border-red-700/50">
                    <AlertCircle className="h-4 w-4" />
                    <span>Upload failed. Please try again.</span>
                  </div>
                )}

                {uploadError && (
                  <div className="text-sm text-red-400 bg-red-900/20 p-2 rounded-md border border-red-700/50">
                    {uploadError}
                  </div>
                )}

                {selectedFile && !uploading && (
                  <div className="text-sm text-gray-400">
                    Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)}KB)
                  </div>
                )}

                {/* Current Image Preview */}
                {storeInfo.image_url && typeof storeInfo.image_url === 'string' && (
                  <div className="mt-2">
                    <Label className="text-sm text-gray-400 mb-2 block">Current Image:</Label>
                    <img 
                      src={storeInfo.image_url} 
                      alt="Store" 
                      className="w-24 h-24 object-cover rounded-lg border border-gray-600"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                <div className="text-xs text-gray-500">
                  Supported formats: JPG, PNG, GIF, WebP (max 5MB)
                </div>
              </div>
            </div>
          </div>
        </div>
        {isEditingStore && (
          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={uploading}
              className="bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-600/50 hover:text-white"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateStore}
              disabled={uploading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {uploading ? "Uploading..." : "Save Changes"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
