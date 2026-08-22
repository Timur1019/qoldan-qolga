import { useCallback, useState } from 'react';

import {
  fetchNotifications,
  markNotificationsRead,
  type NotificationItem,
} from '@/api/notifications';

const PAGE_SIZE = 20;

export function useNotificationsInbox() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const applyPage = useCallback((content: NotificationItem[], pageIndex: number, total: number) => {
    setItems((prev) => (pageIndex === 0 ? content : [...prev, ...content]));
    setPage(pageIndex);
    setHasMore((pageIndex + 1) * PAGE_SIZE < total);
  }, []);

  const load = useCallback(async (pageIndex = 0, asRefresh = false) => {
    if (pageIndex === 0) {
      if (asRefresh) setRefreshing(true);
      else setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);
    try {
      const res = await fetchNotifications(pageIndex, PAGE_SIZE);
      applyPage(res.content ?? [], pageIndex, res.totalElements ?? 0);
    } catch {
      setError('load_failed');
      if (pageIndex === 0) setItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, [applyPage]);

  const refresh = useCallback(() => load(0, true), [load]);

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore || loading) return;
    void load(page + 1);
  }, [hasMore, load, loading, loadingMore, page]);

  const markReadAndOpen = useCallback(async (item: NotificationItem) => {
    if (!item.isRead) {
      setItems((prev) =>
        prev.map((row) => (row.id === item.id ? { ...row, isRead: true } : row))
      );
      try {
        await markNotificationsRead([item.id]);
      } catch {
        /* optimistic UI */
      }
    }
  }, []);

  return {
    items,
    loading,
    refreshing,
    loadingMore,
    hasMore,
    error,
    load,
    refresh,
    loadMore,
    markReadAndOpen,
  };
}
