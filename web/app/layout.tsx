import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PostAgentPro | AI Social Media for Contractors",
  description: "Automated social media posting for contractors. AI writes and publishes 3 posts per week to Google Business and Facebook. $10/month. Try free for 14 days.",
  keywords: ["contractor social media", "automated posting", "AI content generation", "small business marketing", "Google Business Profile", "Facebook for contractors"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
