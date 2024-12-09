'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {  X, Plus, ArrowLeft } from 'lucide-react'
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface Subcategory {
  subcategory_id: number;
  subcategory_name: string;
  subcategory_image: string;
  category_id: number;
  category_name: string;
}

interface Category {
  category_id: number;
  category_name: string;
  subcategories: Subcategory[];
}

interface Brand {
  brand_id: number;
  brand_name: string;
}

interface ProductFormData {
  product_name: string;
  description: string;
  brand_id: number;
  category_id: number;
  subcategory_id: number;
  gender: string;
  images: { image_url: string; preference: number }[];
  colors: { color_name: string; color_code: string }[];
  specifications: { label: string; content: string }[];
  more_info: { label: string; content: string }[];
  care: { type: string; content: string }[];
  tags: string[];
  size: {
    sku: string;
    sizes: { value: string; type: string }[];
  };
}

export default function NewProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<ProductFormData>({
    product_name: '',
    description: '',
    brand_id: 0,
    category_id: 0,
    subcategory_id: 0,
    gender: '',
    images: [{image_url:'',preference:0}],
    colors: [{ color_name: '', color_code: '' }],
    specifications: [{ label: '', content: '' }],
    more_info: [{ label: '', content: '' }],
    care: [{ type: '', content: '' }],
    tags: [],
    size: {
      sku: '',
      sizes: [
        { value: '', type: 'EU' },
        { value: '', type: 'UK' },
        { value: '', type: 'US' },
      ],
    },
  })

  useEffect(() => {
    fetchCategoriesBrandsAndSubcategories()
  }, [])

  const fetchCategoriesBrandsAndSubcategories = async () => {
    setIsLoading(true)
    try {
      const [categoriesResponse, brandsResponse, subcategoriesResponse] = await Promise.all([
        fetch( `${process.env.server}categories/get`),
        fetch( `${process.env.server}brands/get`),
       fetch( `${process.env.server}subcategories/get`)
      ])

      const categoriesData = await categoriesResponse.json()
      const brandsData = await brandsResponse.json()
      const subcategoriesData = await subcategoriesResponse.json()

      setCategories(categoriesData.data)
      setBrands(brandsData.data)
      setSubcategories(subcategoriesData.data)

      console.log(subcategories);
      // Group subcategories by category
      const categoriesWithSubcategories = categoriesData.data.map((category: Category) => ({
        ...category,
        subcategories: subcategoriesData.data.filter((subcategory: Subcategory) => subcategory.category_id === category.category_id)
      }))
      setCategories(categoriesWithSubcategories)
      console.log(categories)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    if (name === 'category_id') {
      setFormData(prev => ({ ...prev, subcategory_id: 0 })) // Reset subcategory when category changes
    }
  }

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     // Handle image upload logic here
//   }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.server}products/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZDk4YTAxYjYtZWY5MS00ODhlLThiOWItODM4ODYxMDZmYWI5Iiwicm9sZSI6IkFETUlOIiwicmVnaW9uX2lkIjoxLCJpYXQiOjE3MzE0MTcxNjcsImV4cCI6MTczNDAwOTE2N30.Rt7YXP6vJLajZRy2v-8Cgd7r9NbxEDlyBl98HZ7c9wE07vDWnZqDAN08jcNE1O07tC6i0jKrOnGG2v_5UwOiWw'
        },
        body: JSON.stringify(formData)
      })
      if (response.ok) {
        router.push('/')
      } else {
        throw new Error('Failed to create product')
      }
    } catch (error) {
      console.error('Error creating product:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card">
        <div className="p-6">
          <h1 className="text-2xl font-semibold text-primary">Saint G</h1>
          <p className="text-sm text-muted-foreground">Dashboard</p>
        </div>
        <nav className="space-y-1 px-3">
          {["Products", "Categories", "Collections", "Coupons", "Notifications"].map((item) => (
            <a
              key={item}
              href={item.toLowerCase() === 'products' ? '/' : `/${item.toLowerCase()}`}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-accent ${
                item === "Products" ? "bg-accent" : ""
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Add New Product</h1>
              <p className="text-sm text-muted-foreground">
                Fill in the details to add a new product.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Products
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="product_name">Product Name</Label>
                <Input
                  id="product_name"
                  name="product_name"
                  value={formData.product_name}
                  onChange={handleInputChange}
                  placeholder="Enter Product Name"
                  className="bg-muted"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Product Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Write the description for the product.."
                  className="min-h-[100px] bg-muted"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand_id">Brand</Label>
                <Select onValueChange={(value) => handleSelectChange('brand_id', value)}>
                  <SelectTrigger className="bg-muted">
                    <SelectValue placeholder="Select a Brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.brand_id} value={brand.brand_id.toString()}>
                        {brand.brand_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category_id">Category</Label>
                <Select onValueChange={(value) => handleSelectChange('category_id', value)}>
                  <SelectTrigger className="bg-muted">
                    <SelectValue placeholder="Select a Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.category_id} value={category.category_id.toString()}>
                        {category.category_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subcategory_id">Subcategory</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange('subcategory_id', value)}
                  disabled={!formData.category_id}
                >
                  <SelectTrigger className="bg-muted">
                    <SelectValue placeholder="Select a Subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories
                      .find((cat) => cat.category_id === Number(formData.category_id))
                      ?.subcategories.map((subcat) => (
                        <SelectItem key={subcat.subcategory_id} value={subcat.subcategory_id.toString()}>
                          {subcat.subcategory_name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {/* <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="Enter stock quantity"
                  className="bg-muted"
                  required
                />
              </div> */}

              <div className="space-y-2">
                <Label>Gender</Label>
                <RadioGroup onValueChange={(value) => handleSelectChange('gender', value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="men" id="gender-men" />
                    <Label htmlFor="gender-men">Men</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="women" id="gender-women" />
                    <Label htmlFor="gender-women">Women</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="unisex" id="gender-unisex" />
                    <Label htmlFor="gender-unisex">Unisex</Label>
                  </div>
                </RadioGroup>
              </div>

             <div className="space-y-2">
                <Label>Images</Label>
                <div className="space-y-2">
                  {formData.images.map((image, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={image.image_url}
                        onChange={(e) => {
                          const newImages = [...formData.images];
                         newImages[index].image_url = e.target.value;
                          setFormData(prev => ({ ...prev, images: newImages }));
                        }}
                        placeholder="Enter image URL"
                        className="bg-muted flex-grow"
                      />
                      <Input
                        value={image.preference}
                        type="number"
                        onChange={(e) => {
                          const newImages = [...formData.images];
                         newImages[index].preference= Number(e.target.value);
                          setFormData(prev => ({ ...prev, images: newImages }));
                        }}
                        placeholder="Enter preference"
                        className="bg-muted flex-grow"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const newImages = formData.images.filter((_, i) => i !== index);
                          setFormData(prev => ({ ...prev, images: newImages }));
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {/* <Button
                    variant="outline"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        images: [...prev.images, '']
                      }));
                    }}
                  >
                    Add Image Link
                  </Button> */}
                </div>
                {/* <div className="grid grid-cols-3 gap-2 mt-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative aspect-square rounded-lg bg-muted overflow-hidden">
                      {image && (
                        <img
                          src={image}
                          alt={`Product image ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                  ))}
                </div> */}
              </div>

              <div className="space-y-2">
                <Label>Colors</Label>
                <div className="space-y-2">
                  {formData.colors.map((color, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder="Color Name"
                        value={color.color_name}
                        onChange={(e) => {
                          const newColors = [...formData.colors];
                          newColors[index].color_name = e.target.value;
                          setFormData(prev => ({ ...prev, colors: newColors }));
                        }}
                        className="bg-muted flex-grow"
                      />
                      <Input
                        placeholder="Color Code"
                        value={color.color_code}
                        onChange={(e) => {
                          const newColors = [...formData.colors];
                          newColors[index].color_code = e.target.value;
                          setFormData(prev => ({ ...prev, colors: newColors }));
                        }}
                        className="bg-muted flex-grow"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const newColors = formData.colors.filter((_, i) => i !== index);
                          setFormData(prev => ({ ...prev, colors: newColors }));
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        colors: [...prev.colors, { color_name: '', color_code: '' }]
                      }));
                    }}
                  >
                    Add Color
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Specifications</Label>
                {formData.specifications.map((spec, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Label"
                      value={spec.label}
                      onChange={(e) => {
                       const specifications = [...formData.specifications];
                        specifications[index].label = e.target.value;
                        setFormData(prev => ({ ...prev, specifications: specifications }));
                      }}
                      className="bg-muted"
                    />
                    <Input
                      placeholder="Content"
                      value={spec.content}
                      onChange={(e) => {
                        const specifications = [...formData.specifications];
                        specifications[index].content = e.target.value;
                        setFormData(prev => ({ ...prev, specifications: specifications }));                      }}
                      className="bg-muted"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        // Remove specification
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() => {
                    // Add new specification
                  }}
                >
                  Add Specification
                </Button>
              </div>

              <div className="space-y-2">
                <Label>More Info</Label>
                {formData.more_info.map((info, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Label"
                      value={info.label}
                      onChange={(e) => {
                        const newMoreInfo = [...formData.more_info];
                        newMoreInfo[index].label = e.target.value;
                        setFormData(prev => ({ ...prev, more_info: newMoreInfo }));
                      }}
                      className="bg-muted"
                    />
                    <Input
                      placeholder="Content"
                      value={info.content}
                      onChange={(e) => {
                        const newMoreInfo = [...formData.more_info];
                        newMoreInfo[index].content = e.target.value;
                        setFormData(prev => ({ ...prev, more_info: newMoreInfo }));
                      }}
                      className="bg-muted"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const newMoreInfo = formData.more_info.filter((_, i) => i !== index);
                        setFormData(prev => ({ ...prev, more_info: newMoreInfo }));
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      more_info: [...prev.more_info, { label: '', content: '' }]
                    }));
                  }}
                >
                  Add More Info
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Care Instructions</Label>
                {formData.care.map((care, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Type"
                      value={care.type}
                      onChange={(e) => {
                        const newCare = [...formData.care];
                        newCare[index].type = e.target.value;
                        setFormData(prev => ({ ...prev, care: newCare }));
                      }}
                      className="bg-muted"
                    />
                    <Input
                      placeholder="Content"
                      value={care.content}
                      onChange={(e) => {
                        const newCare = [...formData.care];
                        newCare[index].content = e.target.value;
                        setFormData(prev => ({ ...prev, care: newCare }));
                      }}
                      className="bg-muted"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const newCare = formData.care.filter((_, i) => i !== index);
                        setFormData(prev => ({ ...prev, care: newCare }));
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      care: [...prev.care, { type: '', content: '' }]
                    }));
                  }}
                >
                  Add Care Instruction
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <div key={index} className="flex items-center gap-1 bg-muted rounded-full px-3 py-1">
                      <span>{tag}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 rounded-full"
                        onClick={() => {
                          const newTags = formData.tags.filter((_, i) => i !== index);
                          setFormData(prev => ({ ...prev, tags: newTags }));
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  <Input
                    placeholder="Add tag"
                    className="w-24 bg-muted"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const newTag = e.currentTarget.value.trim();
                        if (newTag && !formData.tags.includes(newTag)) {
                          setFormData(prev => ({
                            ...prev,
                            tags: [...prev.tags, newTag]
                          }));
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                  />
                </div>
                <Plus/>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  name="sku"
                  value={formData.size.sku}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      size: { ...prev.size, sku: e.target.value }
                    }));
                  }}
                  placeholder="Enter SKU"
                  className="bg-muted"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Sizes</Label>
                {formData.size.sizes.map((size, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Value"
                      value={size.value}
                      onChange={(e) => {
                        const newSizes = [...formData.size.sizes];
                        newSizes[index].value = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          size: { ...prev.size, sizes: newSizes }
                        }));
                      }}
                      className="bg-muted"
                    />
                    <Select
                      value={size.type}
                      onValueChange={(value) => {
                        const newSizes = [...formData.size.sizes];
                        newSizes[index].type = value;
                        setFormData(prev => ({
                          ...prev,
                          size: { ...prev.size, sizes: newSizes }
                        }));
                      }}
                    >
                      <SelectTrigger className="bg-muted">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EU">EU</SelectItem>
                        <SelectItem value="UK">UK</SelectItem>
                        <SelectItem value="US">US</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating Product...' : 'Create Product'}
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}

