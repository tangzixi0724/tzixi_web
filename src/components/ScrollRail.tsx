import { useCallback, useEffect, useRef, useState } from 'react';

interface Props {
  /** 被观察的滚动容器 */
  targetRef: React.RefObject<HTMLElement | null>;
}

/**
 * 自绘的滚动指示条。
 *
 * 系统滚动条在 macOS 与 Chrome 的叠加模式下默认不显示，访客看不出
 * "这一栏还能往下翻"。这里用一条 3px 的常驻指示：滑块高度按可视比例、
 * 位置按滚动比例走；内容装得下时整条不出现。
 *
 * 它绝对定位在不滚动的外层容器上，所以不会跟着内容一起滚走。
 */
export function ScrollRail({ targetRef }: Props) {
  const [rail, setRail] = useState({ visible: false, top: 0, size: 0 });
  const frame = useRef<number | undefined>(undefined);

  const measure = useCallback(() => {
    const el = targetRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollHeight - clientHeight <= 1) {
      setRail((prev) => (prev.visible ? { visible: false, top: 0, size: 0 } : prev));
      return;
    }
    const size = Math.min(1, Math.max(0.12, clientHeight / scrollHeight));
    const maxTop = 1 - size;
    const ratio = scrollTop / (scrollHeight - clientHeight);
    setRail({ visible: true, top: ratio * maxTop, size });
  }, [targetRef]);

  const schedule = useCallback(() => {
    if (frame.current !== undefined) return;
    frame.current = window.requestAnimationFrame(() => {
      frame.current = undefined;
      measure();
    });
  }, [measure]);

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;

    measure();
    el.addEventListener('scroll', schedule, { passive: true });

    const observer = new ResizeObserver(schedule);
    observer.observe(el);
    for (const child of Array.from(el.children)) observer.observe(child);

    return () => {
      el.removeEventListener('scroll', schedule);
      observer.disconnect();
      if (frame.current !== undefined) window.cancelAnimationFrame(frame.current);
    };
  }, [measure, schedule, targetRef]);

  return (
    <div className="scroll-rail" aria-hidden="true" data-visible={rail.visible}>
      <span
        className="scroll-rail__thumb"
        style={{ top: `${rail.top * 100}%`, height: `${rail.size * 100}%` }}
      />
    </div>
  );
}
