import { PedidoType } from '@/types/types';
import { useEffect, useState } from 'react';

const usePagination = (
  filteredClients: PedidoType[],
  itemsPerPage: number,
  animate?: boolean
) => {
  const [page, setPage] = useState(0);
  const [goingUp, setGoingUp] = useState(false);
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  useEffect(() => {
    if (page >= totalPages) setPage(totalPages - 1);
    if (page === -1 && totalPages > 0) setPage(0);
  }, [totalPages]);
  const handlePageChange = (newPage: number) => {
    setGoingUp(newPage > page ? true : false);
    setTimeout(() => {
      setPage(newPage);
      if (animate)
        window.scrollTo({
          top: 0,
          behavior: 'smooth', // Smooth scrolling animation
        });
    }, 1);
  };
  const paginatedClients = filteredClients.filter(
    (_, ind) =>
      ind >= page * itemsPerPage && ind < page * itemsPerPage + itemsPerPage
  );
  return { goingUp, page, paginatedClients, totalPages, handlePageChange };
};

export default usePagination;
