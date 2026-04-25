export const metadata = {
  title: 'Virtual Try-On Studio',
  description: 'AI-powered virtual try-on application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* This script magically makes all the Tailwind styling work */}
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>{children}</body>
    </html>
  )
}
