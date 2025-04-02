// react imports
import { useEffect, useState, useRef, useContext } from 'react';

// external imports
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  useInfiniteQuery,
  useQueryClient,
}                                           from '@tanstack/react-query';

// internal imports
import AppContext                           from '../../utils/AppContext';
import LoginModal from './LoginModal';


export default function Products() {

  const queryClient = useQueryClient();
  const observerRef = useRef();
  const { user } = useContext(AppContext);

  function fetchProducts({ pageParam = 1 }) {
    return fetch(`http://127.0.0.1:8000/products/?page=${pageParam}`)
      .then(res => res.json())
  };

  const {
      data,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
  } = useInfiniteQuery({
      queryKey: ['products', 'infinite'],
      getNextPageParam: (lastPage) => {
          const nextPage = lastPage.next ? Number(new URL(lastPage.next).searchParams.get('page')) : undefined;
          return nextPage;
      },
      queryFn: ({ pageParam }) => fetchProducts({ pageParam }),
  });

  const flattenedData = data?.pages.flatMap(page => page.results) || [];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <>
      <div className='flex items-center justify-between gap-2'>
        <h1 className='text-2xl font-bold mt-5 ml-7'>Product Management Tool</h1>
        {user?.username === null ? (
          <LoginModal/>
        ) : (
          <Button className='my-2 mr-3'>Add product</Button>
        )}
      </div>
      <div className='h-screen'>
        <div className='m-7 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
          {flattenedData?.map((product) => (
            <Card key={product.id} className='w-auto h-100'>
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Card Content</p>
              </CardContent>
              <CardFooter>
                <p>Card Footer</p>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div
          ref={observerRef}
          id='observer-ref'
        >
          {/* This is the observer div */}
        </div>
        {isFetchingNextPage && (
          <div className='flex justify-center'>
            <p>Loading more products...</p>
          </div>
        )}
      </div>
    </>
  )
}
