// react imports
import React from 'react'

// external imports
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Navigate,
  useNavigate,
  useParams,
}                                           from 'react-router-dom';
import { useQuery }                         from '@tanstack/react-query';
import axios from 'axios';
import { SquareArrowLeft } from 'lucide-react';
import { Link, NavLink }                          from 'react-router-dom';


export default function ProductView() {

  const { productId } = useParams();

  async function fetchProductData() {
    return axios.get(`http://127.0.0.1:8000/products/${productId}`)
    .then(res => res.data);
  };
  const productDataQuery = useQuery({
    queryKey: ['data', productId],
    queryFn: fetchProductData
  });

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  };
  const dateCreated = new Date(productDataQuery?.data?.created_at).toLocaleDateString('en-US', options) || '';
  const dateUpdated = new Date(productDataQuery?.data?.updated_at).toLocaleDateString('en-US', options) || '';

  return (
    <div className='h-screen p-5'>
      <div className='flex flex-col gap-2'>
        <Link className='self-end' to={'/'}>
          <Button variant='outline' size='icon'>
            <SquareArrowLeft/>
          </Button>
        </Link>
        <Card className='w-auto h-100'>
          <CardHeader>
            <CardTitle>{productDataQuery?.data?.name}</CardTitle>
            <CardDescription>{productDataQuery?.data?.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className='mt-2'><span>&#8369;</span>{productDataQuery?.data?.price}</p>
            <div className='flex items-center justify-between'>
              <p>Available: <span
                className={`font-bold ${productDataQuery?.data?.in_stock ? 'text-green-500' : 'text-red-500'}` }>
                {productDataQuery?.data?.in_stock ? 'In Stock': 'Out of Stock'}
                </span>
              </p>
              <p className='text-sm'>{productDataQuery?.data?.quantity} {productDataQuery?.data?.quantity <= 1 ? 'item': 'items'} left</p>
            </div>
          </CardContent>
          <CardFooter>
            <div className='flex items-center justify-between w-full'>
              <p className='text-sm text-gray-600'>Created: {dateCreated}</p>
              <p className='text-sm text-gray-600'>Updated: {dateUpdated}</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
