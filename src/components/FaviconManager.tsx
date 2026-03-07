import { useEffect } from 'react';
import { useStoreSettings } from '../features/catalogue/StoreSettingsContext';

export const FaviconManager = () => {
    const { settings } = useStoreSettings();

    const getDirectLink = (url: string) => {
        if (!url) return '';

        // Handle Google Drive Links
        if (url.includes('drive.google.com')) {
            const matches = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
            if (matches && matches[1]) {
                const id = matches[1];
                // Using the thumbnail API is often more reliable for favicon usage than the uc/export endpoint
                // sz=w128 provides a high-quality 128px version that works well as a favicon
                return `https://drive.google.com/thumbnail?id=${id}&sz=w128`;
            }
        }

        return url;
    };

    useEffect(() => {
        if (!settings?.favicon_url) return;

        const finalUrl = getDirectLink(settings.favicon_url);
        if (!finalUrl) return;

        // Function to perform the actual update
        const updateFavicon = () => {
            try {
                // 1. Remove ALL existing icon links to prevent browser confusion
                const selectors = [
                    "link[rel='icon']",
                    "link[rel='shortcut icon']",
                    "link[rel='apple-touch-icon']",
                    "link[rel='mask-icon']"
                ];

                selectors.forEach(selector => {
                    const elements = document.querySelectorAll(selector);
                    elements.forEach(el => el.parentNode?.removeChild(el));
                });

                // 2. Create the primary icon link
                const link = document.createElement('link');
                link.type = 'image/x-icon'; // Try x-icon for maximum compatibility
                link.rel = 'icon';
                // Add a robust timestamp cache-buster
                const timestamp = new Date().getTime();
                link.href = `${finalUrl}${finalUrl.includes('?') ? '&' : '?'}v=${timestamp}`;

                // 3. Create a shortcut icon link (for older IE/Edge/Chrome behaviors)
                const shortcutLink = document.createElement('link');
                shortcutLink.rel = 'shortcut icon';
                shortcutLink.href = link.href;

                // 4. Append to head
                document.head.appendChild(link);
                document.head.appendChild(shortcutLink);

                console.log('[FaviconManager] Updated icon to:', link.href);
            } catch (err) {
                console.error('[FaviconManager] Failed to update favicon:', err);
            }
        };

        // Delay slightly to ensure any static head tags are fully processed
        const timer = setTimeout(updateFavicon, 100);
        return () => clearTimeout(timer);

    }, [settings?.favicon_url]);

    return null;
};
