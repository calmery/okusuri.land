import React from "react";
import html from "~/static/blog-switch.html";

export const BlogSwitch = React.memo(() => (
  <div dangerouslySetInnerHTML={{ __html: html }} />
));
