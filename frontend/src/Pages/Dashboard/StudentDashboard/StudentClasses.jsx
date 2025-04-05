import React,{ useEffect, useState } from 'react'
import Camera from '../Images/Camera.png'
import Clock from '../Images/Clock.png'
import { NavLink, useParams } from 'react-router-dom'

function StudentClasses() {
    const { ID } = useParams();
    const [data, setdata] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [upcomingClass, setUpcomingClass] = useState(null);

    useEffect(() => {
        const getData = async () => {
          setLoading(true);
          try {
            const response = await fetch(`/api/course/classes/student/${ID}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
    
            if (!response.ok) {
              throw new Error('Failed to fetch data');
            }
    
            const user = await response.json();
            if (user.data?.classes?.length > 0) {
              const classes = user.data.classes[0].liveClasses || [];
              setdata(classes);
              
              // Find the next upcoming class
              const now = new Date();
              const upcoming = classes
                .filter(cls => new Date(cls.date.slice(0, 10)) >= now)
                .sort((a, b) => {
                  const dateA = new Date(a.date.slice(0, 10));
                  const dateB = new Date(b.date.slice(0, 10));
                  if (dateA.getTime() !== dateB.getTime()) {
                    return dateA - dateB;
                  }
                  return a.timing - b.timing;
                })[0];
              
              setUpcomingClass(upcoming);
            }
          } catch (error) {
            setError(error.message);
            console.error("Error fetching classes:", error);
          } finally {
            setLoading(false);
          }
        };
        getData();
    },[ID]);

    // Format date for display
    const formatDate = (dateString) => {
      const options = { weekday: 'short', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    };

    // Format time (minutes since midnight) as HH:MM
    const formatTime = (minutes) => {
      if (typeof minutes !== 'number') return '';
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}:${mins.toString().padStart(2, '0')}`;
    };

  return (
    <div className='ml-60 mt-20 text-white flex flex-col'>
      <h1 className='text-[#1671D8] text-2xl mb-6 font-semibold'>Your Classes</h1>
      
      {loading ? (
        <div className="text-black text-center py-10">Loading classes...</div>
      ) : error ? (
        <div className="text-red-500 text-center py-10">Error: {error}</div>
      ) : (
        <div className='flex justify-between mr-60'>
          <div className='flex flex-col'>
            <h2 className='text-[#1671D8] text-xl mb-4 font-semibold'>Weekly Schedule</h2>
            <div className='h-[25rem] w-[35rem] overflow-auto pr-4'>
              {data.length === 0 ? (
                <div className="text-black p-4 bg-gray-100 rounded-lg">
                  No classes scheduled for this week. Check back later!
                </div>
              ) : (
                data.filter(clas => {
                  const classDate = new Date(clas.date.slice(0, 10));
                  const today = new Date();
                  const oneWeekFromNow = new Date(today);
                  oneWeekFromNow.setDate(today.getDate() + 7);
                  return classDate >= today && classDate <= oneWeekFromNow;
                }).map((clas, index) => (
                  <div key={`${clas.coursename}-${index}`} className='flex items-center mb-5 bg-white text-black p-4 rounded-lg shadow-sm hover:shadow-md transition-all'>
                    <img src="https://www.pngall.com/wp-content/uploads/5/Profile-Male-PNG.png" alt="profile_img" width={40} className="rounded-full" />
                    <div className='ml-5 mr-10 flex-1'>
                      <div className="flex justify-between">
                        <p className='text-lg font-bold'>{clas.coursename}</p>
                        <span className='text-blue-700 bg-blue-100 px-3 py-1 rounded-full text-sm'>{clas.status}</span>
                      </div>
                      <p className='text-gray-500 text-sm'>
                        {formatDate(clas.date.slice(0, 10))} at {formatTime(clas.timing)}
                      </p>
                      <p className='text-blue-500 text-sm mt-1'>{clas.title}</p>
                    </div>
                    {clas.link && (
                      <NavLink to={clas.link} target='_blank' className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Join
                      </NavLink>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
          
          {upcomingClass ? (
            <NavLink to={upcomingClass.link} target='_blank' className="block">
              <div className='bg-white p-6 h-60 w-80 cursor-pointer rounded-lg text-black shadow-lg hover:shadow-xl transition-all'>
                <h3 className="text-[#1671D8] font-bold mb-3">Next Class</h3>
                <div className='flex gap-3 items-center mb-5'>
                  <img src={Clock} alt="clock" width={40} />
                  <div>
                    <span className='text-[#4E84C1] text-xl font-semibold block'>
                      {formatDate(upcomingClass.date.slice(0,10))}
                    </span> 
                    <span className='text-[#018280] text-lg'>
                      {formatTime(upcomingClass.timing)}
                    </span>
                  </div>
                </div>
                <div className='flex justify-between items-center'>
                  <div>
                    <p className='text-[#018280] text-2xl font-semibold'>{upcomingClass.coursename}</p>
                    <p className='text-gray-600 mt-1'>{upcomingClass.title}</p>
                  </div>
                  <img src={Camera} alt="Camera" width={60} className="ml-2"/>
                </div>
              </div>
            </NavLink>
          ) : (
            <div className='bg-white p-6 h-60 w-80 rounded-lg text-black shadow-lg flex flex-col justify-center items-center'>
              <img src={Camera} alt="Camera" width={70} className="opacity-50 mb-4"/>
              <p className="text-center text-gray-500">No upcoming classes</p>
              <p className="text-center text-gray-400 text-sm mt-2">Check back later for your next class</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default StudentClasses