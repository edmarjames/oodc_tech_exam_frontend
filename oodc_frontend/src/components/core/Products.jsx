// react imports
import { useEffect, useState, useRef, useContext } from 'react';

// external imports
import { Button } from "@/components/ui/button";


import {
  useInfiniteQuery,
  useQueryClient,
}                                           from '@tanstack/react-query';
import { useNavigate }                      from 'react-router-dom';
import axios from 'axios';

// internal imports
import AppContext                           from '../../utils/AppContext';
import LoginModal from './LoginModal';
import ConfirmModal from './ConfirmModal';
import ProductCard from './ProductCard';


export default function Products() {

  const queryClient = useQueryClient();
  const observerRef = useRef();
  const { user } = useContext(AppContext);
  const navigate = useNavigate();

  async function fetchProducts({ pageParam = 1 }) {
    return axios.get('http://127.0.0.1:8000/products/', {
      params: { page: pageParam },
    })
    .then(res => res.data);
  };
  function handleLogout() {
    navigate('/logout');
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
          <div className='flex items-center gap-2 mt-5 mr-7'>
            <Button>Add product</Button>
            <ConfirmModal usage='logout' clickEvent={handleLogout}/>
          </div>
        )}
      </div>
      <div className='h-screen'>
        <div className='m-7 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
          {flattenedData?.map((product) => (
            <ProductCard key={product.id} data={product}/>
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
