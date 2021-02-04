import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export const IFrame: React.FC<
  React.DetailedHTMLProps<
    React.IframeHTMLAttributes<HTMLIFrameElement>,
    HTMLIFrameElement
  >
> = (props) => {
  const ref = useRef<HTMLIFrameElement>(null);
  const [body, setBody] = useState<HTMLElement | undefined>(undefined);

  useEffect(() => {
    setBody(ref.current?.contentWindow?.document?.body);
  }, [ref]);

  return (
    <iframe {...props} ref={ref}>
      {body && createPortal(props.children, body)}
    </iframe>
  );
};
