// react imports
import { useEffect, useState, useRef, useContext } from 'react';

// external imports
import { Button } from "@/components/ui/button";
import { Trash2, LogOut } from 'lucide-react';

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
}                                           from '@tanstack/react-query';
import { useNavigate }                      from 'react-router-dom';
import axios from 'axios';

// internal imports
import AppContext                           from '../../utils/AppContext';
import LoginModal from './LoginModal';
import ConfirmModal from './ConfirmModal';
import ProductCard from './ProductCard';
import AddProductModal from './AddProductModal';


export default function Products() {

  const [deleteId, setDeleteId] = useState(null);
  const [modalUsage, setModalUsage] = useState('logout');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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

  const deleteProductMutation = useMutation({
    mutationFn: async (deleteId) => {
      try {
        await axios.delete(`http://127.0.0.1:8000/products/${deleteId}/`);
      } catch (error) {
        throw new Error('Failed to delete product');
      }
    },
    onSuccess: (data, deleteId) => {
      queryClient.setQueryData(['products', 'infinite'], (oldData) => {
        if (!oldData || !oldData.pages) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            results: Array.isArray(page.results) ?
              page.results.filter((product) => product.id !== deleteId)
              : [],
          })),
        };
      });

      queryClient.invalidateQueries(['products', 'infinite'], { exact: true });
    },
    onError: (error) => {
      console.error('Error deleting product:', error);
    },
  });

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

  const handleDeleteProduct = (deleteId) => {
    setIsModalOpen(true);
    setModalUsage('delete');
    setDeleteId(deleteId);
  };
  const handleDelete = (deleteId) => {
    deleteProductMutation.mutate(deleteId);
  };

  const logoutTriggerElement = (
    <Button variant='outline' size='icon' onClick={() => setIsModalOpen(true)}>
      <LogOut />
    </Button>
  );

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
      <ConfirmModal
        usage='delete'
        clickEvent={() => handleDelete(deleteId)}
        isOpen={isModalOpen && modalUsage === 'delete'}
        onClose={(open) => setIsModalOpen(open)}
        triggerElement={null}
      />
      <div className='flex items-center justify-between gap-2'>
        <h1 className='text-2xl font-bold mt-5 ml-7'>Product Management Tool</h1>
        {user?.username === null ? (
          <LoginModal/>
        ) : (
          <div className='flex items-center gap-2 mt-5 mr-7'>
            <AddProductModal isModalOpen={isCreateModalOpen} setIsModalOpen={setIsCreateModalOpen}/>
            <ConfirmModal
              usage='logout'
              clickEvent={handleLogout}
              isOpen={isModalOpen && modalUsage === 'logout'}
              onClose={(open) => setIsModalOpen(open)}
              triggerElement={logoutTriggerElement}
            />
          </div>
        )}
      </div>
      <div className='h-screen'>
        <div className='m-7 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
          {flattenedData?.map((product) => (
            <ProductCard key={product.id} getProductId={handleDeleteProduct} data={product}/>
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
