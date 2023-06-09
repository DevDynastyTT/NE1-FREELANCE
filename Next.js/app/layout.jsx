//Whatever css is imported here, affects all of it's children
import '@styles/globals.css'
import Nav from '@components/Nav'
import Provider from '@components/Provider'
export const metadata = {
  title: 'Promptopia',
  description: 'Discover & Share AI Prompts',
}

// This is the root of the application. Think of it like the index.html
// All of the pages are rendered in here as "children"
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <div className="main">
        <div className="gradient" />
      </div>

      <main className="app">
        <Nav />
        {children}
      </main>
    </html>
  )
}