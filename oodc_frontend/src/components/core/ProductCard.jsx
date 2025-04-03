// react imports
import React, { useContext } from 'react'

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
import { Trash2, FilePenLine } from 'lucide-react';
import { Link, NavLink }                          from 'react-router-dom';

// internal imports
import AppContext                           from '../../utils/AppContext';


export default function ProductCard({ data, getProductId }) {

  const { user } = useContext(AppContext);

  return (
    <Card className='w-auto h-100'>
      <CardHeader>
        <CardTitle>{data.name}</CardTitle>
        <CardDescription>{data.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex items-center justify-between'>
          <p>Available: <span
            className={`font-bold ${data.in_stock ? 'text-green-500' : 'text-red-500'}` }>
            {data.in_stock ? 'In Stock': 'Out of Stock'}
            </span>
          </p>
          <p className='text-sm'>{data.quantity} {data.quantity <= 1 ? 'item': 'items'} left</p>
        </div>
        <p className='mt-2'><span>&#8369;</span>{data.price}</p>
      </CardContent>
      <CardFooter>
        {user.isAdmin && (
          <div className='flex items-center justify-between gap-2'>
            <Button variant='outline' size='icon' onClick={() => getProductId(data.id)}>
              <Trash2/>
            </Button>
            <Link to={`/products/${data.id}`}>
              <Button variant='outline' size='icon'>
                <FilePenLine/>
              </Button>
            </Link>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
