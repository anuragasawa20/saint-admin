'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Plus, Pencil, Trash, Upload, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Size {
  id: number;
  type: string;
  value: string;
}

interface ProductSize {
  sku: string;
  sizes: Size[];
  stock: number;
  size_id: number;
}

interface RegionalPrice {
  price: number;
  region_id: number;
  region_name: string;
  currency_type: string;
}

interface Product {
  product_id: number;
  product_name: string;
  category_name: string;
  subcategory_name: string;
  regional_prices: RegionalPrice[];
  product_sizes: ProductSize[];
}

interface ApiResponse {
  code: number;
  data: Product[];
}

const server:string= 'http://localhost:8080/';

export default function ProductDashboard() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<unknown>(null);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${server}products/get-all`, {
        headers: {
          'x-access-token': 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZDk4YTAxYjYtZWY5MS00ODhlLThiOWItODM4ODYxMDZmYWI5Iiwicm9sZSI6IkFETUlOIiwicmVnaW9uX2lkIjoxLCJpYXQiOjE3MzE0MTcxNjcsImV4cCI6MTczNDAwOTE2N30.Rt7YXP6vJLajZRy2v-8Cgd7r9NbxEDlyBl98HZ7c9wE07vDWnZqDAN08jcNE1O07tC6i0jKrOnGG2v_5UwOiWw'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data: ApiResponse = await response.json();
      setProducts(data.data);
    } catch (err) {
      setError('An error occurred while fetching products');
      console.error('Error fetching products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first!');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('productFile', file);

    try {
      const response = await fetch(`${server}products/uploadProducts`, {
        method: 'POST',
        body: formData,
        headers:{
          'x-access-token':'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZDk4YTAxYjYtZWY5MS00ODhlLThiOWItODM4ODYxMDZmYWI5Iiwicm9sZSI6IkFETUlOIiwicmVnaW9uX2lkIjoxLCJpYXQiOjE3MzE0MTcxNjcsImV4cCI6MTczNDAwOTE2N30.Rt7YXP6vJLajZRy2v-8Cgd7r9NbxEDlyBl98HZ7c9wE07vDWnZqDAN08jcNE1O07tC6i0jKrOnGG2v_5UwOiWw'
        }
      });
  
      const result = await response.json();
      console.log(result);
      if (response.ok) {
        setUploadResult(result);
        setShowResultDialog(true);
        fetchProducts(); // Refresh the product list after successful upload
      } else {
        alert('File upload failed: ' + result.message);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('An error occurred while uploading the file.');
    } finally {
      setIsUploading(false);
      setFile(null);
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price);
  };

  const getTotalStock = (product: Product) => {
    return product.product_sizes?.reduce((total, size) => total + size.stock, 0);
  };

  const toggleRowExpansion = (productId: number) => {
    setExpandedRows(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card">
        <div className="p-6">
          <h1 className="text-2xl font-semibold text-primary">Saint G</h1>
          <p className="text-sm text-muted-foreground">Dashboard</p>
        </div>
        <nav className="space-y-1 px-3">
          {["Products", "Add Products", "Categories", "Coupons", "Notifications"].map((item) => (
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
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Product List</h2>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                <Input
                  placeholder="Search for product..."
                  className="w-[300px] pl-9"
                />
              </div>
              <div className="relative">
                <input
                  type="file"
                  id="excel-upload"
                  className="hidden"
                  accept=".xlsx, .xls"
                  onChange={handleFileChange}
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('excel-upload')?.click()}
                  disabled={isUploading}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Excel
                </Button>
                {file && (
                  <Button
                    variant="default"
                    className="ml-2"
                    onClick={handleUpload}
                    disabled={isUploading}
                  >
                    {isUploading ? 'Uploading...' : 'Process File'}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => router.push('/products/new')}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New Product
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Add Multiple Products
              </Button>
            </div>
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Add New Category
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Add Multiple Categories
              </Button>
            </div>
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Add New Collection
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Add Multiple Collections
              </Button>
            </div>
          </div>

          {/* Products Table */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">All Products</p>
              <p className="text-sm text-muted-foreground">
                {isLoading ? 'Loading...' : `1 - ${products.length} of ${products.length}`}
              </p>
            </div>
            <div className="rounded-lg border bg-card">
              {isLoading ? (
                <div className="p-4 text-center">Loading products...</div>
              ) : error ? (
                <div className="p-4 text-center text-red-500">{error}</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <input type="checkbox" className="rounded border-muted" />
                      </TableHead>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Subcategory</TableHead>
                      <TableHead>UK Price</TableHead>
                      <TableHead>US Price</TableHead>
                      <TableHead>India Price</TableHead>
                      <TableHead>Total Stock</TableHead>
                      <TableHead>ID No</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <>
                        <TableRow key={product.product_id}>
                          <TableCell>
                            <input type="checkbox" className="rounded border-muted" />
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-0"
                                onClick={() => toggleRowExpansion(product.product_id)}
                              >
                                {expandedRows.includes(product.product_id) ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                              <div className="h-8 w-8 rounded-full bg-muted" />
                              {product.product_name}
                            </div>
                          </TableCell>
                          <TableCell>{product.category_name}</TableCell>
                          <TableCell>{product.subcategory_name}</TableCell>
                          <TableCell>
                            {formatPrice(
                              product.regional_prices?.find(p => p.region_name === 'UK')?.price || 0,
                              'GBP'
                            )}
                          </TableCell>
                          <TableCell>
                            {formatPrice(
                              product.regional_prices?.find(p => p.region_name === 'US')?.price || 0,
                              'USD'
                            )}
                          </TableCell>
                          <TableCell>
                            {formatPrice(
                              product.regional_prices?.find(p => p.region_name === 'India')?.price || 0,
                              'INR'
                            )}
                          </TableCell>
                          <TableCell>{getTotalStock(product)}</TableCell>
                          <TableCell>{product.product_id}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        {expandedRows.includes(product.product_id) && (
                          <TableRow>
                            <TableCell colSpan={10}>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>SKU</TableHead>
                                    <TableHead>US Size</TableHead>
                                    <TableHead>UK Size</TableHead>
                                    <TableHead>EU Size</TableHead>
                                    <TableHead>Stock</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {product.product_sizes?.map((size) => (
                                    <TableRow key={size.sku}>
                                      <TableCell>{size.sku}</TableCell>
                                      <TableCell>{size.sizes.find(s => s.type === 'US')?.value || 'N/A'}</TableCell>
                                      <TableCell>{size.sizes.find(s => s.type === 'UK')?.value || 'N/A'}</TableCell>
                                      <TableCell>{size.sizes.find(s => s.type === 'EU')?.value || 'N/A'}</TableCell>
                                      <TableCell>{size.stock}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {isLoading ? 'Loading...' : `1 - ${products.length} of ${products.length}`}
              </p>
              <div className="flex items-center gap-2">
                <Select defaultValue="10">
                  <SelectTrigger className="w-[70px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Upload Result Dialog */}
      <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excel Upload Result</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground">
            {uploadResult && (
              <>
                <p>Total rows processed: {uploadResult.totalRows}</p>
                <p>Preview of first 5 rows:</p>
                <pre className="mt-2 max-h-60 overflow-auto rounded bg-muted p-2 text-sm">
                  {JSON.stringify(uploadResult.preview, null, 2)}
                </pre>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}