import type { Metadata } from 'next'
import { Raleway, Poppins } from 'next/font/google'
import './globals.css'
import AppWrapper from './AppWrapper'

const raleway = Raleway({
  subsets: ['latin'],
  variable: '--font-raleway',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'Modern Silver Crafts Website',
  description: 'Premium silver articles manufacturer trusted by retailers across India. 20+ years of crafting excellence.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${raleway.variable} ${poppins.variable}`}>
      <body className={poppins.className}>
        <AppWrapper>{children}</AppWrapper>
      </body>
    </html>
  )
}

