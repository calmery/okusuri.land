import React from "react";
import { Page } from "~/components/Page";
import html from "~/static/about.html";

const About: React.FC = () => {
  return <Page>{html}</Page>;
};

export default About;
