import React from 'react'

const StatCard = ({icon , value , label}) => {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:border-indigo-400/20 hover:bg-white/[0.06]">

      <div className="flex items-center justify-between">

        <div className="rounded-sm bg-indigo-500/10 p-3 text-indigo-300">
          {icon}
        </div>

        <span className="text-3xl font-bold">
          {value}
        </span>

      </div>

      <p className="mt-4 text-sm text-slate-500">
        {label}
      </p>

    </div>
  )
}

export default StatCard
