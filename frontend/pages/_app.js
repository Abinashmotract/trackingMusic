import '../styles/globals.css'
import '../styles/landing.css'
import '../styles/navbar.css'
import '../styles/footer.css'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

export default function App({ Component, pageProps }) {
  return (
    <div className="app-wrapper">
      <Navbar />
      <main className="main-content">
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  )
}
