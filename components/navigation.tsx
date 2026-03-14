'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/firm', label: 'Firm' },
  { href: '/process', label: 'Process' },
  { href: '/contact', label: 'Contact' },
  { href: '/admin', label: 'Admin' } // added admin link
]

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // On the homepage, the nav overlays the dark hero — text should be white
  // On other pages or when scrolled, use a solid background with dark text
  const isHome = pathname === '/'
  const isTransparent = isHome && !isScrolled && !isMobileMenuOpen

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isTransparent
          ? 'bg-transparent'
          : 'bg-background/95 backdrop-blur-sm border-b border-border'
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div
            className={cn(
              'relative h-9 w-9 overflow-hidden rounded-sm transition-all duration-300',
              isTransparent && 'brightness-0 invert'
            )}
          >
            <Image
              src="/images/pylon-logo.jpg"
              alt="Pylon Infra Design"
              fill
              className="object-contain"
              sizes="36px"
            />
          </div>
          <div className="flex flex-col">
            <span
              className={cn(
                'text-base font-bold tracking-[0.2em] uppercase leading-tight transition-colors duration-300',
                isTransparent ? 'text-white' : 'text-foreground'
              )}
            >
              Pylon
            </span>
            <span
              className={cn(
                'hidden text-[10px] font-light tracking-[0.25em] uppercase leading-tight transition-colors duration-300 sm:inline',
                isTransparent ? 'text-white/70' : 'text-muted-foreground'
              )}
            >
              Infra Design
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-xs font-medium tracking-[0.15em] uppercase transition-colors duration-300',
                isTransparent
                  ? pathname === link.href
                    ? 'text-white'
                    : 'text-white/60 hover:text-white'
                  : pathname === link.href
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className={cn(
            'transition-colors duration-300 md:hidden',
            isTransparent ? 'text-white' : 'text-foreground'
          )}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out md:hidden',
          isMobileMenuOpen ? 'max-h-80' : 'max-h-0'
        )}
      >
        <div className="flex flex-col gap-1 border-t border-border bg-background px-6 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'py-3 text-sm font-medium tracking-[0.1em] uppercase transition-colors',
                pathname === link.href
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}