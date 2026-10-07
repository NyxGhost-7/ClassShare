import React from 'react'
// import ClassRoom from './ClassRoomNotFound';
import ClassRoomPageHeader from './ClassRoomHeader';
import ResourceHeader from './ResourceHeader';
import ResourceCard from '@/components/ResourceCard';
import EmptyState from './EmptyState';
const Main = ({classroom,copied,copyLink,resources,session ,setResources,classroomId}) => {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
         <ClassRoomPageHeader classroom={classroom} copied={copied} copyLink={copyLink} classroomId={classroomId} />

       <ResourceHeader  classroomId={classroomId} />

        {resources.length > 0 && (
          <div className="mt-8 flex items-center gap-3">

            <span className="h-px flex-1 bg-white/10" />

            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-500">
              {resources.length}{" "}
              {resources.length === 1
                ? "Resource"
                : "Resources"}
            </span>

            <span className="h-px flex-1 bg-white/10" />

          </div>
        )}

        <section className="mt-8">

          {resources.length === 0 ? (


           <EmptyState classroomId={classroomId}/>

          ) : (

          
            <div className="space-y-4">

              {resources.map((resource) => (
                <ResourceCard  key={resource._id} resource={resource} currentUserId={session?.user?.id} classroomHostId={
                    classroom.host?._id ||
                    classroom.host
                  }
                  onDelete={(resourceId) => {
                    setResources((previous) =>
                      previous.filter(
                        (resource) =>
                          resource._id !== resourceId
                      )
                    );
                  }}
                />
              ))}

            </div>

          )}

        </section>

      </main>
  )
}

export default Main
