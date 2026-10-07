import React from 'react'

const Footer = () => {
  return (
      <footer className="relative z-10 border-t border-white/10 px-6 py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} ClassShare.
        <span className="mx-1">•</span>
        Learn. Share. Grow.
      </footer>
  )
}

export default Footer
