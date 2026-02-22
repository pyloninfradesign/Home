import Link from 'next/link'

const footerLinks = {
  navigation: [
    { href: '/', label: 'Home' },
    { href: '/projects', label: 'Projects' },
    { href: '/firm', label: 'Firm' },
    { href: '/process', label: 'Process' },
    { href: '/contact', label: 'Contact' },
  ],
  services: [
    'Architectural Design',
    'Interior Design',
    'Structural Design',
    'Project Management',
    'Quantity Survey',
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-foreground text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold tracking-widest uppercase">
              Pylon
            </h3>
            <p className="mt-1 text-xs tracking-[0.2em] uppercase opacity-60">
              Infra Design
            </p>
            <p className="mt-6 max-w-xs text-sm leading-relaxed opacity-70">
              Contemporary architecture shaped by clarity, sustainability, and
              technical precision.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.2em] uppercase opacity-60">
              Navigation
            </h4>
            <nav className="mt-6 flex flex-col gap-3">
              {footerLinks.navigation.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm opacity-70 transition-opacity hover:opacity-100"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.2em] uppercase opacity-60">
              Services
            </h4>
            <ul className="mt-6 flex flex-col gap-3">
              {footerLinks.services.map((service) => (
                <li key={service} className="text-sm opacity-70">
                  {service}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-primary-foreground/10 pt-8 md:flex-row">
          <p className="text-xs opacity-50">
            {'© 2026 Pylon Infra Design. All rights reserved.'}
          </p>
          <div className="flex gap-6">
            <a
              href="mailto:info@pyloninfradesign.com"
              className="text-xs opacity-50 transition-opacity hover:opacity-100"
            >
              info@pyloninfradesign.com
            </a>
            <span className="text-xs opacity-50">
              +91 674 XXX XXXX
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
