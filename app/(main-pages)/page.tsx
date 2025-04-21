"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import PostCard from '../../components/homepage/postCard';
import CreatePostForm from '../../components/homepage/CreatePostForm';
import { useStore } from '../../store';
import { Icon } from '@iconify/react';

export default function HomePage() {
  const { posts, error, getHomePosts } = useStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [dataStilExist, setDataStilExist] = useState(true);
  const [oldDataLength, setOldDataLength] = useState(0);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    setOldDataLength(posts.length);
    getHomePosts(currentPage);
    if (oldDataLength !== 0 && oldDataLength === posts.length)
      setDataStilExist(false);
    setLoading(false);
  }, [getHomePosts, currentPage]);

  // Intersection Observer kurulumu
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [target] = entries;
    if (target.isIntersecting && !loading && dataStilExist) {
      setCurrentPage(prev => prev + 1);
    }
  }, [loading, dataStilExist]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '20px',
      threshold: 0.1
    });
    
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    
    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [handleObserver]);

  return (
    <main className="py-6 px-4 min-h-screen">
      <div className="w-full max-w-2xl mx-auto md:w-2/3 lg:w-1/2">
	  
        {/* Gönderi oluşturma formu */}
        <CreatePostForm />

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}
        
        {!loading && !error && posts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Henüz hiç gönderi yok.
          </div>
        ) : (
          <>
            {posts && posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}

            <div ref={loaderRef} className="text-center py-8">
              {loading && (
                <div className="flex justify-center items-center">
                  <Icon
                    icon="line-md:loading-loop"
                    width="32"
                    height="32"
                  />
                </div>
              )}
              {!dataStilExist && <div className="text-gray-500">Şimdilik bu kadar.</div>}
            </div>
          </>
        )}
      </div>
    </main>
  );
}