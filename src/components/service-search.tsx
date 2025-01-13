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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import { ChevronsUpDown } from 'lucide-react'

import axios from 'axios'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useEffect, useState } from 'react'
import { useSearch } from '@/context/search-context'

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
      const response = await axios.get('http://localhost:5000/api/detail', {
        params: {
          name: values.name,
          category_id: values.category_id === 0 ? undefined : values.category_id,
          site_id: values.site_id === 0 ? undefined : values.site_id,
          service_id: values.service_id === 0 ? undefined : values.service_id,
          price: values.price === 1 ? undefined : values.price
        }
      })

      const data: Detail[] = response.data
      console.log(values)
      console.log(data)
      setDetails(data)
      setError(null)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const response = error.response
        const data: ErrorMessage = response?.data
        console.log(data)
        setError(data.message)
        setDetails([])
      }
    }
  }

  // Fetch services, categories and sites from the API when the component is mounted
  useEffect(() => {
    // Get services from the API
    const fetchServices = async () => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}service`)
      const data: Service[] = response.data
      console.log(data)
      setServices(data)
    }

    // Get categories from the API
    const fetchCategories = async () => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}category`)
      const data: Category[] = response.data
      console.log(data)
      setCategories(data)
    }

    // Get sites from the API
    const fetchSites = async () => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}site`)
      const data: Site[] = response.data
      console.log(data)
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
    <Collapsible className="w-full sm:w-[400px] shadow-md rounded-lg mb-4 space-y-2 pb-2">
      <div className="flex items-center justify-between space-x-4 px-4">
        <h4 className="text-sm font-semibold">
          Filtros
        </h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col justify-center sm:flex-row gap-10">
            <div className='flex flex-col items-center justify-center flex-wrap gap-2'>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormControl>
                      <Input
                        placeholder="Nombre del servicio"
                        {...field}
                      />
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
                        {
                          categories.map((category) => (
                            <SelectItem key={ category.id } value={ category.id.toString() } >
                              { category.name }
                            </SelectItem>
                          ))
                        }
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
                        {
                          sites.map((site) => (
                            <SelectItem key={ site.id } value={ site.id.toString() }>
                              { site.name }
                            </SelectItem>
                          ))
                        }
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
                        {
                          services.map((service) => (
                            <SelectItem key={ service.id } value={ service.id.toString() }>
                              { service.name }
                            </SelectItem>
                          ))
                        }
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
                        {
                          prices.map((price) => (
                            <SelectItem key={ price} value={ price.toString() }>
                              { price }
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='flex flex-col gap-4'>
              <Button
                variant='outline'
                type='button'
                onClick={handleReset}
              >
                Limpiar filtros
              </Button>
              <Button
                variant='default'
                type="submit"
              >
                Buscar
              </Button>
            </div>
          </form>
        </Form>
      </CollapsibleContent>
    </Collapsible>
  )
}

export default ServiceSearch
