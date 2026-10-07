import React from 'react'
import { Loader2 } from 'lucide-react';
const Loading = () => {
  return (
   <div className="flex justify-center py-24">
            <div className="text-center">
              <Loader2
                size={35}
                aria-hidden="true"
                className="mx-auto animate-spin text-slate-500"
              />

              <p className="mt-4 text-sm text-slate-500">
                Loading classrooms...
              </p>
            </div>
          </div>
  )
}

export default Loading
