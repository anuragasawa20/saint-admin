'use client'

import { UploadCloud, X, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function CategoriesPage() {
  return (
    <div className="flex h-screen bg-zinc-950">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 bg-zinc-900">
        <div className="p-6">
          <h1 className="text-2xl font-semibold text-white">Saint G</h1>
          <p className="text-sm text-zinc-400">Dashboard</p>
        </div>
        <nav className="space-y-1 px-3">
          {["Products", "Categories", "Collections", "Coupons", "Notifications"].map((item) => (
            <a
              key={item}
              href={item.toLowerCase() === 'products' ? '/' : `/${item.toLowerCase()}`}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-zinc-800 ${
                item === "Categories" ? "bg-zinc-800 text-white" : "text-zinc-400"
              }`}
            >
              {item}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        <div className="mx-auto max-w-4xl space-y-8">
          <div>
            <h1 className="text-2xl font-semibold text-white">Upload Products</h1>
            <p className="text-sm text-zinc-400">
              Lorem ipsum dolor sit amet consectetur adipiscing.
            </p>
          </div>

          <form className="space-y-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="productName" className="text-white">Product Name</Label>
                <Input
                  id="productName"
                  placeholder="Enter Product Name"
                  className="border-zinc-700 bg-zinc-900 text-white placeholder:text-zinc-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-white">Category</Label>
                <Select>
                  <SelectTrigger className="border-zinc-700 bg-zinc-900 text-white">
                    <SelectValue placeholder="Select a Category, Multiple Categories, or Create a New Category" />
                  </SelectTrigger>
                  <SelectContent className="border-zinc-700 bg-zinc-900 text-white">
                    <SelectItem value="category1">Category 1</SelectItem>
                    <SelectItem value="category2">Category 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="collection" className="text-white">Collection</Label>
                <Select>
                  <SelectTrigger className="border-zinc-700 bg-zinc-900 text-white">
                    <SelectValue placeholder="Select a Collection, Multiple Collections, or Create a New Collection" />
                  </SelectTrigger>
                  <SelectContent className="border-zinc-700 bg-zinc-900 text-white">
                    <SelectItem value="collection1">Collection 1</SelectItem>
                    <SelectItem value="collection2">Collection 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Photo</Label>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-700 bg-zinc-900">
                    <UploadCloud className="mb-2 h-8 w-8 text-zinc-400" />
                    <p className="text-sm text-zinc-400">Click to upload photos</p>
                    <p className="text-xs text-zinc-400">or drag and drop</p>
                    <p className="mt-2 text-xs text-zinc-400">SVG, PNG, JPG or GIF</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i} className="group relative aspect-square rounded-lg bg-zinc-800">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="absolute -right-2 -top-2 hidden h-6 w-6 rounded-full bg-zinc-900 group-hover:flex"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">Product Description</Label>
                <Textarea
                  id="description"
                  placeholder="Write the description for the product.."
                  className="min-h-[100px] border-zinc-700 bg-zinc-900 text-white placeholder:text-zinc-400"
                />
              </div>

              <div className="space-y-4">
                <Label className="text-white">Size</Label>
                <div className="grid grid-cols-7 gap-2 md:grid-cols-13">
                  {[32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 56, 58].map((size) => (
                    <label
                      key={size}
                      className="flex h-10 cursor-pointer items-center justify-center rounded-md border border-zinc-700 bg-zinc-900 text-sm text-white hover:bg-zinc-800"
                    >
                      <input type="checkbox" className="sr-only" />
                      <span>{size}</span>
                    </label>
                  ))}
                </div>
                <div className="grid grid-cols-5 gap-2 md:grid-cols-10">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXL', 'XXXL', 'Free', 'N/A'].map((size) => (
                    <label
                      key={size}
                      className="flex h-10 cursor-pointer items-center justify-center rounded-md border border-zinc-700 bg-zinc-900 text-sm text-white hover:bg-zinc-800"
                    >
                      <input type="checkbox" className="sr-only" />
                      <span>{size}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-white">Colors</Label>
                <div className="flex flex-wrap gap-2">
                  {['#FFFFFF', '#000000', '#FF0000', '#00FF00'].map((color) => (
                    <div
                      key={color}
                      className="h-10 w-10 cursor-pointer rounded-md border border-zinc-700"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <Button
                    variant="outline"
                    className="h-10 w-10 rounded-md border-dashed border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800"
            >
              + Add a new section
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
