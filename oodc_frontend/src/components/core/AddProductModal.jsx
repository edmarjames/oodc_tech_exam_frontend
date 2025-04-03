// react imports
import React, { useState, useContext, useRef, useEffect } from 'react'

// external imports
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from 'axios';

import {
  useMutation,
  useQueryClient,
}                                           from '@tanstack/react-query';

export default function AddProductModal({ isModalOpen, setIsModalOpen}) {

  const [productData, setProductData] = useState({});
  const [error, setError] = useState({});

  const queryClient = useQueryClient();

  const handleSave = () => {
    const keys = ['name', 'description', 'price'];
    for (let k of keys) {
      if (!productData.hasOwnProperty(k)) {
        setIsModalOpen(true);
        setError((prevState) => ({...prevState, [k]: `${k[0].toUpperCase() + k.slice(1)} is required.`}))
      }
    };
    createProductMutation.mutate();
  };
  const validateErrors = (key) => {
    if (key in error) {
      setError((prevError) => {
        const newError = { ...prevError };
        delete newError[key];
        return newError;
      });
    };
  };
  const handleChangeData = (e, key) => {
    validateErrors(key);
    setProductData((prevState) => ({...prevState, [key]: e.target.value}))
  };
  const handleChangePrice = (e) => {
    validateErrors('price');
    let value = e.target.value;
    if (value !== '' && !isNaN(value)) {
      value = parseFloat(value).toFixed(2);
    };
    setProductData((prevState) => ({...prevState, price: value}))
  };
  const resetStates = () => {
    setProductData({});
    setError({});
    setIsModalOpen(false);
  };

  const createProduct = async () => {
    try {
      const res = await axios.post('http://127.0.0.1:8000/products/', {
        name: productData?.name,
        description: productData?.description,
        price: productData?.price,
        quantity: productData?.quantity
      });
      const data = res.data;
      resetStates();
    } catch (error) {
      console.error('Something went wrong', error);
      const errorMessage = error?.response?.data?.name[0];
      if (errorMessage == 'product with this name already exists.') setError((prevState) => ({...prevState, existing: errorMessage}));
    }
  };
  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: (data) => {
      queryClient.setQueryData(['products', 'infinite'], (oldData) => {
        if (!oldData || !oldData.pages) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page, index) => {
            if (index === 0) {
              return {
                ...page,
                results: [...page.results],
              };
            }
            return page;
          }),
        };
      });

      queryClient.invalidateQueries(['products', 'infinite'], { exact: true });
    },
    onError: (error) => {
      console.error('Error creating product:', error);
    },
  });

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && resetStates()}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsModalOpen(true)}>Add product</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add product</DialogTitle>
          <DialogDescription className={error?.existing && 'text-red-500'}>
            {error?.existing ? error.existing : 'Enter the product details'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="name" className="text-right">
              Name*
            </Label>
            <div className='flex flex-col gap-1 col-span-3'>
              <Input id="name" onChange={(e) => handleChangeData(e, 'name')} value={productData?.name}/>
              {error?.name && <p className='text-sm text-red-500'>{error?.name}</p>}
            </div>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right">
              Description*
            </Label>
            <div className='flex flex-col gap-1 col-span-3'>
              <Textarea id="description" placeholder='Type product description here.' onChange={(e) => handleChangeData(e, 'description')} value={productData?.description}/>
              {error?.description && <p className='text-sm text-red-500'>{error?.description}</p>}
            </div>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="price" className="text-right">
              Price*
            </Label>
            <div className='flex flex-col gap-1 col-span-3'>
              <Input id="price" type='number' onChange={handleChangePrice} value={productData?.price}/>
              {error?.price && <p className='text-sm text-red-500'>{error?.price}</p>}
            </div>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="quantity" className="text-right">
              Quantity
            </Label>
            <div className='flex flex-col gap-1 col-span-3'>
              <Input id="quantity" type='number' onChange={(e) => handleChangeData(e, 'quantity')} value={productData?.quantity}/>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
