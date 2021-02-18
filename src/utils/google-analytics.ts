export const GOOGLE_ANALYTICS_ID =
  process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || "";

// Helper Functions

const gtag = () => {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (window as any).gtag;
  }

  return console.log;
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const sendEvent = (
  action: string,
  {
    category,
    label,
    value,
  }: { category: string; label?: string; value?: string }
) => {
  gtag()("event", action, {
    event_category: category,
    event_label: label,
    value,
  });
};

// Main

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const changeRoute = (url: string) => {
  gtag()("event", "page_view", {
    page_path: url,
    send_to: GOOGLE_ANALYTICS_ID,
  });
};

export const shareMyPage = (screenName: string) =>
  sendEvent("share", {
    category: "mypage",
    label: screenName,
  });
