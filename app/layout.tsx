import './globals.css'
import type {Metadata} from 'next'
import {Inter} from 'next/font/google'
import {Analytics} from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next"
import {ReactNode} from "react";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

const inter = Inter({subsets: ['latin']})

export const metadata: Metadata = {
  title: 'Norges Bondebridgeforbund',
  description: 'Det offisielle nettstedet til Norges Bondebridgeforbund',
}

export default function RootLayout({
                                     children,
                                   }: {
  children: ReactNode
}) {
  return (
    <html lang="en">
    <body className={inter.className}>
    <section className="min-h-screen bg-gray-900 text-white">
      <Navbar/>
      {children}
      <Footer/>
    </section>
    <Analytics/>
    <SpeedInsights/>
    </body>
    </html>
  )
}
