import type { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'
import '../../styles/common/AppLayout.css'

type SharedLayoutProps = {
  children?: ReactNode
}

export default function SharedLayout({ children }: SharedLayoutProps) {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  )
}