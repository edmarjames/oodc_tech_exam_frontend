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

// internal imports
import AppContext                           from '../../utils/AppContext';


export default function ProductCard({ data }) {

  const { user } = useContext(AppContext);

  return (
    <Card className='w-auto h-100'>
      <CardHeader>
        <CardTitle>{data.name}</CardTitle>
        <CardDescription>{data.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Available: <span
          className={`font-bold ${data.in_stock ? 'text-green-500' : 'text-red-500'}` }>
          {data.in_stock ? 'In Stock': 'Out of Stock'}
          </span>
        </p>
      </CardContent>
      <CardFooter>
        {user.isAdmin && (
          <div className='flex items-center justify-between gap-2'>
            <Button variant='outline' size='icon'>
              <Trash2/>
            </Button>
            <Button variant='outline' size='icon'>
              <FilePenLine/>
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
