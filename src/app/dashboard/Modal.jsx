import React from 'react'
import { X } from 'lucide-react';
const Modal = ({onClose, title, subtitle, children}) => {
  return (
   <div className="fixed inset-0 z-50 flex items-center justify-center px-4">

      {/* BACKDROP */}

      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      {/* MODAL */}

      <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg border border-white/10 bg-black p-7 shadow-2xl">

        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-lg p-2 text-slate-500 transition hover:bg-white/10 hover:text-white"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold">
          {title}
        </h2>

        <p className="mt-2 pr-6 text-sm leading-relaxed text-slate-400">
          {subtitle}
        </p>

        {children}

      </div>

    </div>
  )
}

export default Modal
