'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { MouseEvent as ReactMouseEvent, ReactNode, RefObject } from 'react';

interface PopoverProps {
  triggerRef: RefObject<HTMLElement | null>;
  open: boolean;
  children: ReactNode;
  /** 面板样式类名（如 .time-panel / .cal-panel / .settings-panel） */
  className: string;
  align?: 'start' | 'end';
  offset?: number;
  minWidth?: number;
  role?: string;
  ariaLabel?: string;
}

/**
 * 通用下拉面板：渲染到 document.body，彻底规避层叠上下文遮挡与溢出裁剪，
 * 自动跟随触发元素定位，空间不足时自动翻转，滚动/缩放时跟随。
 */
export default function Popover({
  triggerRef,
  open,
  children,
  className,
  align = 'start',
  offset = 6,
  minWidth,
  role,
  ariaLabel,
}: PopoverProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  useLayoutEffect(() => {
    if (!open) return;

    const update = () => {
      const trigger = triggerRef.current;
      const panel = panelRef.current;
      if (!trigger || !panel) return;

      const tr = trigger.getBoundingClientRect();
      const pw = panel.offsetWidth;
      const ph = panel.offsetHeight;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const margin = 8;

      let left = align === 'end' ? tr.right - pw : tr.left;
      left = Math.min(Math.max(margin, left), Math.max(margin, vw - pw - margin));

      let top = tr.bottom + offset;
      if (tr.bottom + ph + offset > vh - margin) {
        top = tr.top - ph - offset;
      }
      top = Math.max(margin, top);

      setPos({ top, left });
    };

    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [open, triggerRef, align, offset]);

  if (!open) return null;

  return createPortal(
    <div
      ref={panelRef}
      className={`${className} popover-fixed`}
      style={{
        top: pos?.top ?? -9999,
        left: pos?.left ?? -9999,
        ...(minWidth ? { minWidth } : {}),
      }}
      role={role}
      aria-label={ariaLabel}
      // 阻止冒泡到 document，避免被 useClickOutside 误判为"外部点击"而关闭
      onMouseDown={(e: ReactMouseEvent) => e.stopPropagation()}
    >
      {children}
    </div>,
    document.body,
  );
}
