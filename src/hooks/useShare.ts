import { useCallback, useState } from "react";

export interface ShareData {
  title?: string;
  text?: string;
  url?: string;
}

export type ShareChannel = "whatsapp" | "telegram" | "twitter" | "copy";

interface UseShareReturn {
  /** True if the browser supports the native share sheet (mostly mobile) */
  isNativeShareSupported: boolean;
  /** Opens the native OS share sheet if supported, otherwise returns false so you can show a fallback UI */
  share: (data: ShareData) => Promise<boolean>;
  /** Manually share to one specific channel — used for the desktop fallback menu */
  shareTo: (channel: ShareChannel, data: ShareData) => Promise<void>;
  /** True right after a successful copy-to-clipboard, useful for "کپی شد" feedback */
  copied: boolean;
}

const buildShareText = (data: ShareData): string =>
  [data.title, data.text].filter(Boolean).join(" — ");

export function useShare(): UseShareReturn {
  const [copied, setCopied] = useState(false);

  const isNativeShareSupported =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  const share = useCallback(async (data: ShareData): Promise<boolean> => {
    if (!isNativeShareSupported) return false;
    try {
      await navigator.share({
        title: data.title,
        text: data.text,
        url: data.url,
      });
      return true;
    } catch (err) {
      // AbortError fires when the user just closes the share sheet — not a real error
      if (err instanceof DOMException && err.name === "AbortError") return true;
      return false;
    }
  }, [isNativeShareSupported]);

  const copyToClipboard = useCallback(async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can fail on insecure contexts (non-HTTPS) — silently ignore
    }
  }, []);

  const shareTo = useCallback(async (channel: ShareChannel, data: ShareData) => {
    const url = data.url ?? window.location.href;
    const text = buildShareText(data);

    switch (channel) {
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, "_blank");
        break;
      case "telegram":
        window.open(
          `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
          "_blank",
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
          "_blank",
        );
        break;
      case "copy":
        await copyToClipboard(url);
        break;
    }
  }, [copyToClipboard]);

  return { isNativeShareSupported, share, shareTo, copied };
}