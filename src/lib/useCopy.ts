import { useCallback, useEffect, useRef, useState } from 'react';

/** 复制文本，返回复制状态；2 秒后自动复位 */
export function useCopy(resetMs = 1800) {
  const [copied, setCopied] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = useCallback(
    async (text: string, key: string) => {
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          const area = document.createElement('textarea');
          area.value = text;
          area.setAttribute('readonly', '');
          area.style.position = 'fixed';
          area.style.opacity = '0';
          document.body.appendChild(area);
          area.select();
          document.execCommand('copy');
          document.body.removeChild(area);
        }
        setCopied(key);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setCopied(null), resetMs);
      } catch {
        setCopied(null);
      }
    },
    [resetMs],
  );

  return { copied, copy };
}
