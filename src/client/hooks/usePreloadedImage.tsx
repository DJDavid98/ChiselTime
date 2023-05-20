import { useEffect, useRef, useState } from 'react';

export const usePreloadedImage = (avatarUrl?: string | null) => {
  const preloaderRef = useRef<HTMLImageElement | null>(null);

  const [validatedAvatarUrl, setValidatedAvatarUrl] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!avatarUrl) {
      setValidatedAvatarUrl(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    if (!preloaderRef.current) {
      preloaderRef.current = new Image();
    }
    const handleLoad = () => {
      setLoading(false);
      setValidatedAvatarUrl(avatarUrl);
    };
    const handleError = () => {
      setLoading(false);
      setValidatedAvatarUrl(null);
    };

    preloaderRef.current.src = avatarUrl;
    preloaderRef.current.addEventListener('load', handleLoad);
    preloaderRef.current.addEventListener('error', handleError);
    return () => {
      preloaderRef.current?.removeEventListener('load', handleLoad);
      preloaderRef.current?.removeEventListener('error', handleError);
    };
  }, [avatarUrl]);

  return { loading, src: validatedAvatarUrl };
};
