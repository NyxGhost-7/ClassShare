import React from 'react'
import Middlebanner from './Middlebanner';
import Loading from './Loading';
import ErrorPage from './ErrorPage';
import NoClassroom from './NoClassroom';
import PublicClassroomCard from '@/components/PublicClassroomCard';
import { useRouter } from 'next/navigation';
const ClassesPage = ({loading , classrooms,error}) => {
    const router = useRouter();
  return (
     <section
        id="public-classrooms"
        className="relative z-10 mx-auto max-w-7xl scroll-mt-10 px-6 py-24 lg:px-8" >
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <Middlebanner/>

          {!loading && !error && (
            <div className="w-fit rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-400">
              {classrooms.length}{" "}
              {classrooms.length === 1
                ? "Classroom"
                : "Classrooms"}
            </div>
          )}
        </div>
      {loading && (
         <Loading/>
        )}

        {!loading && error && (
         <ErrorPage error={error} loadPublicClassrooms={loadPublicClassrooms} />
        )}


        {!loading &&
          !error &&
          classrooms.length === 0 && (
           <NoClassroom/>
          )}


        {!loading &&
          !error &&
          classrooms.length > 0 && (
            <div className="mt-10 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {classrooms.map((classroom) => (
                <PublicClassroomCard key={classroom._id}  classroom={classroom}    onOpen={() =>  router.push( `/classroom/${classroom._id}`
                    )
                  }
                />
              ))}
            </div>
          )}
      </section>
  )
}

export default ClassesPage
