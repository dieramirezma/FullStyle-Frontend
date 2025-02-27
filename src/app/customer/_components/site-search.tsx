'use client'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form'

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
import { Input } from '../../../components/ui/input'
import { Button } from '../../../components/ui/button'
import { useState } from 'react'
import { useSearch } from '@/context/search-context'
import apiClient from '@/utils/apiClient'

export interface Site {
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
  address: z.string()
})

function SiteSearch () {
  // const [services, setServices] = useState<Service[]>([])
  const { setSites } = useSearch()
  const [isOpen, setIsOpen] = useState(false)

  // Form hook
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      address: ''
    }
  })

  // Action when the form is submitted
  async function onSubmit (values: z.infer<typeof formSchema>) {
    try {
      const response = await apiClient.get('site', {
        params: {
          name: values.name,
          address: values.address
        }
      })
      const data: Site[] = response.data
      setSites(data)
      setIsOpen(false)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const response = error.response
        const data: ErrorMessage = response?.data
        console.error(data.message)
        setSites([])
      }
      setIsOpen(false)
    }
  }

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
          <SheetTitle>Filtrar sitios de estética</SheetTitle>
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
                      <Input placeholder="Nombre del sitio" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Dirección" {...field} />
                    </FormControl>
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
                  Buscar
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default SiteSearch
