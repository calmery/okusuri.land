import Head from "next/head";
import React from "react";
import { GOOGLE_ANALYTICS_ID } from "~/utils/google-analytics";

export const GoogleAnalytics: React.FC = () => (
  <Head>
    <script
      async
      src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`}
    />
    <script
      dangerouslySetInnerHTML={{
        __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date());gtag("config","${GOOGLE_ANALYTICS_ID}",{send_page_view:false})`,
      }}
    />
  </Head>
);
