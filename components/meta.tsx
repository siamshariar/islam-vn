import { useEffect } from 'react';

interface MetaProps {
  title?: string;
  description?: string;
  url?: string;
  type?: string;
}

export default function Meta({ title, description, url, type = 'website' }: MetaProps) {
  useEffect(() => {
    if (title) {
      document.title = title;
    }

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const attribute = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;

      if (element) {
        element.content = content;
      } else {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        element.content = content;
        document.head.appendChild(element);
      }
    };

    if (title) {
      updateMetaTag('og:title', title, true);
    }

    if (description) {
      updateMetaTag('description', description);
      updateMetaTag('og:description', description, true);
    }

    if (url) {
      updateMetaTag('og:url', url, true);
    }

    if (type) {
      updateMetaTag('og:type', type, true);
    }

    updateMetaTag('og:site_name', 'Islam VN', true);
  }, [title, description, url, type]);

  return null;
}