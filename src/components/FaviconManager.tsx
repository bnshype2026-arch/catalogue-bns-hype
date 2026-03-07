import { useEffect } from 'react';
import { useStoreSettings } from '../features/catalogue/StoreSettingsContext';

export const FaviconManager = () => {
    const { settings } = useStoreSettings();

    useEffect(() => {
        if (settings?.favicon_url) {
            let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
            if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                document.getElementsByTagName('head')[0].appendChild(link);
            }
            link.href = settings.favicon_url;
        }
    }, [settings?.favicon_url]);

    return null;
};
