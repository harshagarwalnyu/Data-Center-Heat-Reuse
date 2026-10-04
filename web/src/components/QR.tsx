"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

/** QR code for this site's own address, so it is correct wherever the app is deployed. */
export function SiteQR({ size = 112 }: { size?: number }) {
  const [svg, setSvg] = useState("");
  const [url, setUrl] = useState("");
  useEffect(() => {
    const target = new URLSearchParams(window.location.search).get("url") ?? `${window.location.origin}/`;
    setUrl(target);
    QRCode.toString(target, { type: "svg", margin: 0, errorCorrectionLevel: "M", color: { dark: "#0b0b0b", light: "#ffffff" } }).then(setSvg);
  }, []);
  return (
    <div className="flex items-center gap-3">
      <div
        role="img"
        aria-label={`QR code linking to ${url}`}
        style={{ width: size, height: size }}
        className="shrink-0 bg-white p-1"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <div className="text-sm">
        <div className="font-semibold">Explore the live model</div>
        <div className="break-all text-ink-2">{url}</div>
      </div>
    </div>
  );
}
