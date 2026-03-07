import { useEffect } from 'react';
import { useStoreSettings } from '../features/catalogue/StoreSettingsContext';

export const FaviconManager = () => {
    const { settings } = useStoreSettings();

    const getDirectLink = (url: string) => {
        if (url.includes('drive.google.com')) {
            const matches = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
            if (matches && matches[1]) {
                return `https://drive.google.com/uc?export=view&id=${matches[1]}`;
            }
        }
        return url;
    };

    useEffect(() => {
        if (settings?.favicon_url) {
            let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
            if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.getElementsByTagName('head')[0].appendChild(link);
            }
            link.href = getDirectLink(settings.favicon_url);
        }
    }, [settings?.favicon_url]);

    return null;
};
