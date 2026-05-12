import "./globals.css";

export const metadata = {
  title: "PN Das Telecaller",
  description: "Internal Lead Management for PN Das Academy",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
