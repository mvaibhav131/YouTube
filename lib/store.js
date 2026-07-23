import { createContext, useContext, useState, useEffect } from 'react';

const Ctx = createContext(null);
const KEY = 'yt-store';
const INIT = { likes: {}, subscriptions: {}, history: [] };

export function StoreProvider({ children }) {
  const [store, setStore] = useState(INIT);

  // Load from localStorage once on mount
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (saved) setStore({ ...INIT, ...saved });
    } catch {}
  }, []);

  const update = (fn) => {
    setStore((prev) => {
      const next = fn(prev);
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const toggleLike = (video) =>
    update((s) => {
      const likes = { ...s.likes };
      if (likes[video.id]) {
        delete likes[video.id];
      } else {
        likes[video.id] = {
          id: video.id,
          title: video.snippet?.title,
          thumbnail:
            video.snippet?.thumbnails?.medium?.url ||
            video.snippet?.thumbnails?.high?.url || '',
          channelTitle: video.snippet?.channelTitle || '',
          publishedAt: video.snippet?.publishedAt || '',
        };
      }
      return { ...s, likes };
    });

  const toggleSubscribe = (ch) =>
    update((s) => {
      const subscriptions = { ...s.subscriptions };
      if (subscriptions[ch.id]) {
        delete subscriptions[ch.id];
      } else {
        subscriptions[ch.id] = {
          id: ch.id,
          title: ch.title || ch.snippet?.title || '',
          thumbnail: ch.snippet?.thumbnails?.default?.url || '',
        };
      }
      return { ...s, subscriptions };
    });

  const addHistory = (video) =>
    update((s) => ({
      ...s,
      history: [
        {
          id: video.id,
          title: video.snippet?.title || '',
          thumbnail:
            video.snippet?.thumbnails?.medium?.url ||
            video.snippet?.thumbnails?.high?.url || '',
          channelTitle: video.snippet?.channelTitle || '',
          watchedAt: Date.now(),
        },
        ...(s.history || []).filter((v) => v.id !== video.id),
      ].slice(0, 100),
    }));

  const isLiked = (id) => !!store.likes[id];
  const isSubscribed = (id) => !!store.subscriptions[id];

  return (
    <Ctx.Provider
      value={{ ...store, toggleLike, toggleSubscribe, addHistory, isLiked, isSubscribed }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useStore = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
};
