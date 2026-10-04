"use client";
import { cloneElement, useEffect, useId, useLayoutEffect, useRef, useState, type ReactElement, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { placeTip, type Box } from "@/lib/interact";

/**
 * The card itself. Measures its own size, then sits next to `anchor` inside `bounds` (see placeTip).
 * `fixed` positions against the viewport (portal use); otherwise against the nearest positioned parent.
 */
export function TipCard({ id, anchor, bounds, fixed = false, children }: { id: string; anchor: Box; bounds: { w: number; h: number }; fixed?: boolean; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const p = placeTip(anchor, { w: el.offsetWidth, h: el.offsetHeight }, bounds);
    setPos({ left: p.left, top: p.top });
  }, [anchor, bounds]);
  return (
    <div ref={ref} id={id} role="tooltip" className="tip" style={{ position: fixed ? "fixed" : "absolute", left: pos?.left ?? 0, top: pos?.top ?? 0, visibility: pos ? "visible" : "hidden" }}>
      {children}
    </div>
  );
}

/**
 * Wrap one focusable element. Shows on hover and keyboard focus, toggles on tap (touch), Esc dismisses.
 * The child gets aria-describedby while the tip is open.
 */
export function Tooltip({ content, children }: { content: ReactNode; children: ReactElement<{ "aria-describedby"?: string }> }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<{ anchor: Box; bounds: { w: number; h: number } } | null>(null);
  const wrap = useRef<HTMLSpanElement>(null);
  const touch = useRef(false);

  const show = () => {
    const r = wrap.current?.getBoundingClientRect();
    if (!r) return;
    setView({ anchor: { x: r.left, y: r.top, w: r.width, h: r.height }, bounds: { w: window.innerWidth, h: window.innerHeight } });
    setOpen(true);
  };
  const hide = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => e.key === "Escape" && hide();
    const away = (e: PointerEvent) => { if (!wrap.current?.contains(e.target as Node)) hide(); };
    document.addEventListener("keydown", key);
    document.addEventListener("pointerdown", away);
    window.addEventListener("scroll", hide, { passive: true });
    window.addEventListener("resize", hide);
    return () => {
      document.removeEventListener("keydown", key);
      document.removeEventListener("pointerdown", away);
      window.removeEventListener("scroll", hide);
      window.removeEventListener("resize", hide);
    };
  }, [open]);

  return (
    <span
      ref={wrap}
      className="inline-flex"
      onPointerDown={(e) => { touch.current = e.pointerType !== "mouse"; }}
      onKeyDown={() => { touch.current = false; }}
      onPointerEnter={(e) => { if (e.pointerType === "mouse") show(); }}
      onPointerLeave={(e) => { if (e.pointerType === "mouse") hide(); }}
      onFocus={() => { if (!touch.current) show(); }}
      onBlur={hide}
      onClick={() => { if (touch.current) (open ? hide() : show()); }}
    >
      {cloneElement(children, open ? { "aria-describedby": id } : {})}
      {open && view && createPortal(<TipCard id={id} fixed anchor={view.anchor} bounds={view.bounds}>{content}</TipCard>, document.body)}
    </span>
  );
}

/** Small "how we got this" affordance: a 24px focusable i. */
export function Info({ tip, label = "How we got this" }: { tip: ReactNode; label?: string }) {
  return (
    <Tooltip content={tip}>
      <button type="button" className="info-btn" aria-label={label}>i</button>
    </Tooltip>
  );
}

/** A jargon term with a dotted underline and a plain-language definition. */
export function Term({ tip, children }: { tip: ReactNode; children: ReactNode }) {
  return (
    <Tooltip content={tip}>
      <span tabIndex={0} className="term">{children}</span>
    </Tooltip>
  );
}

/** Tooltip body helpers so every card reads the same: a title, a line, and the data key in small type. */
export function TipKey({ k }: { k: string }) {
  return <code className="tip-key">{k}</code>;
}
