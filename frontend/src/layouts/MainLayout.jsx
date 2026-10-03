import Navbar from '../components/Navbar/Navbar'
import Footer from '../components/Footer/Footer'

function MainLayout({ children }) {
  return (
    <div className="app">
      <Navbar />

      <main>
        {children}
      </main>

      <Footer />
    </div>
  )
}

export default MainLayout