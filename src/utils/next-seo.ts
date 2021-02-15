import { DefaultSeoProps } from "next-seo";

export const defaultSeoProps: DefaultSeoProps = {
  canonical: "https://okusuri.land/",
  description:
    "おくすりランドは、処方されたおくすりを見ることができるサイトです。",
  title: "おくすりランド",

  // Twitter
  twitter: {
    cardType: "summary_large_image",
    handle: "@metanen0x0",
    site: "@metanen0x0",
  },

  // OGP
  openGraph: {
    description:
      "おくすりランドは、処方されたおくすりを見ることができるサイトです。",
    images: [
      {
        height: 630,
        url: "https://okusuri.land/og.png",
        width: 1200,
      },
    ],
    locale: "ja_JP",
    site_name: "おくすりランド",
    title: "おくすりランド",
    type: "website",
    url: "https://okusuri.land/",
  },
};
