'use client'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'

import { Filter, X } from 'lucide-react'

import axios from 'axios'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useEffect, useState } from 'react'
import { useSearch } from '@/context/search-context'
import apiClient from '@/utils/apiClient'

interface Service {
  id: number
  category_id: number
  name: string
}

interface Category {
  id: number
  name: string
}

interface Site {
  id: number
  name: string
  address: string
  phone: string
  manager_id: number
}

export interface Detail {
  site_id: number
  site_name: string
  site_address: string
  category_id: number
  category_name: string
  service_id: number
  service_name: string
  price: number
  duration: number
  description: string
}

interface ErrorMessage {
  message: string
}

// Form schema using zod
const formSchema = z.object({
  name: z.string(),
  category_id: z.string().transform((val) => parseInt(val)).optional(),
  site_id: z.string().transform((val) => parseInt(val)).optional(),
  service_id: z.string().transform((val) => parseInt(val)).optional(),
  price: z.string().transform((val) => parseInt(val)).optional()

})

const prices = [10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000]

function ServiceSearch () {
  const [services, setServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [sites, setSites] = useState<Site[]>([])
  const { setDetails, setError } = useSearch()
  const [isOpen, setIsOpen] = useState(false)

  // Form hook
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      category_id: undefined,
      site_id: undefined,
      service_id: undefined,
      price: undefined
    }
  })

  // Action when the form is submitted
  async function onSubmit (values: z.infer<typeof formSchema>) {
    try {
      const response = await apiClient.get('detail', {
        params: {
          name: values.name,
          category_id: values.category_id === 0 ? undefined : values.category_id,
          site_id: values.site_id === 0 ? undefined : values.site_id,
          service_id: values.service_id === 0 ? undefined : values.service_id,
          price: values.price === 1 ? undefined : values.price
        }
      })
      console.log('Request URL:', response.config.url)
      const data: Detail[] = response.data
      console.log(data)
      setDetails(data)
      setError(null)
      setIsOpen(false)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const response = error.response
        const data: ErrorMessage = response?.data
        setError(data.message)
        setDetails([])
      }
      setIsOpen(false)
    }
  }

  // Fetch services, categories and sites from the API when the component is mounted
  useEffect(() => {
    // Get services from the API
    const fetchServices = async () => {
      const response = await apiClient.get('service')
      const data: Service[] = response.data
      setServices(data)
    }

    // Get categories from the API
    const fetchCategories = async () => {
      const response = await apiClient.get('category')
      const data: Category[] = response.data
      setCategories(data)
    }

    // Get sites from the API
    const fetchSites = async () => {
      const response = await apiClient.get('site')
      const data: Site[] = response.data
      setSites(data)
    }

    fetchCategories()
    fetchServices()
    fetchSites()
  }, [])

  const handleReset = () => {
    form.reset()
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filtros
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Filtrar Servicios</SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Nombre del servicio" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <Select onValueChange={field.onChange} value={field.value != null ? field.value.toString() : ''} >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Categoría" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="site_id"
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <Select onValueChange={field.onChange} value={field.value != null ? field.value.toString() : ''}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sitio" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sites.map((site) => (
                          <SelectItem key={site.id} value={site.id.toString()}>
                            {site.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="service_id"
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <Select onValueChange={field.onChange} value={field.value != null ? field.value.toString() : ''}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Servicio" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.id} value={service.id.toString()}>
                            {service.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <Select onValueChange={field.onChange} value={field.value != null ? field.value.toString() : ''}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Precio" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {prices.map((price) => (
                          <SelectItem key={price} value={price.toString()}>
                            ${price}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2 pt-4">
                <Button variant="outline" type="button" onClick={handleReset} className="flex-1">
                  <X className="h-4 w-4 mr-2" />
                  Limpiar
                </Button>
                <Button type="submit" className="flex-1">
                  Aplicar Filtros
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default ServiceSearch
