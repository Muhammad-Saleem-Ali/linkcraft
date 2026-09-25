'use client';

import { useState, useEffect } from 'react';
import { AffiliateLinkItem, UserPartner } from '@/server/store';

export function useRealtimeDashboard() {
  const [links, setLinks] = useState<AffiliateLinkItem[]>([]);
  const [user, setUser] = useState<UserPartner | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Fetch initial data
  const fetchInitialData = async () => {
    try {
      const res = await fetch('/api/links');
      const data = await res.json();
      if (data.success) {
        setLinks(data.links);
        setUser(data.user);
      }
    } catch (err) {
      console.error('Failed to fetch links:', err);
    }
  };

  useEffect(() => {
    fetchInitialData();

    // Subscribe to SSE stream
    const eventSource = new EventSource('/api/realtime');

    eventSource.onopen = () => {
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'LINK_CREATED') {
          setLinks((prev) => [data.link, ...prev]);
        } else if (data.type === 'CLICK_REGISTERED') {
          setLinks((prev) =>
            prev.map((item) =>
              item.shortSlug === data.slug ? { ...item, views: item.views + 1, clicks: item.clicks + 1 } : item
            )
          );
          if (data.updatedOwed && user) {
            setUser((prev) => prev ? { ...prev, currentlyOwed: data.updatedOwed } : prev);
          }
        } else if (data.type === 'LINK_REVOKED') {
          setLinks((prev) => prev.filter((item) => item.shortSlug !== data.slug));
        }
      } catch (err) {
        console.error('Error parsing SSE event:', err);
      }
    };

    eventSource.onerror = () => {
      setIsConnected(false);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return { links, user, isConnected, refreshData: fetchInitialData };
}
