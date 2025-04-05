import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DateTime from './DateTime';

function AddClass({ onClose }) {
  const { ID } = useParams();
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState([]);
  const [date, setDate] = useState("");
  const [link, setLink] = useState("");
  const [note, setNote] = useState("");
  const [CourseId, setCourseId] = useState('');
  const [allowedDays, setCurrData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const DAY = [
    "Sunday",    
    "Monday",    
    "Tuesday",   
    "Wednesday", 
    "Thursday",  
    "Friday",    
    "Saturday"   
  ];
  
  function setToMidnight(dateTimeString) {
    // Create a new Date object from the input string
    let date = new Date(dateTimeString);
    
    // Extract the time part
    let hours = date.getUTCHours();
    let minutes = date.getUTCMinutes();
    let seconds = date.getUTCSeconds();
    
    let totalMinutes = (hours * 60) + minutes;
    date.setUTCHours(0, 0, 0, 0);
    let modifiedDateTimeString = date.toISOString();
    
    const DATETIME = [totalMinutes, modifiedDateTimeString];
    
    return DATETIME;
  }

  useEffect(() => {
    const getCourses = async () => {
      try {
        const response = await fetch(`/api/course/Teacher/${ID}/enrolled`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include' // Add this to ensure cookies are sent
        });

        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }

        const res = await response.json();
        setCourses(res.data);
        if (res.data && res.data.length > 0) {
          setCourseId(res.data[0]._id);
        }
      } catch (error) {
        setError(error.message);
        console.error("Error fetching courses:", error);
      }
    };
    getCourses();
  }, [ID]); 

  useEffect(() => {
    const filteredData = courses.filter(course => course._id === CourseId);
    setCurrData(filteredData[0]?.schedule);
  }, [CourseId, courses]);
  

  const addCourses = async () => {
    const currentDate = new Date();
    const givenDate = new Date(date);

    if (currentDate > givenDate) {
      alert('Choose a valid future date!');
      return;
    } 
    
    if (note === '' || date === '' || link === '') {
      alert('All fields are required!');
      return;
    }

    // Prevent multiple submissions
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const modifyDate = setToMidnight(date);

      const data = {
        title: note,
        timing: modifyDate[0],
        date: modifyDate[1],
        link: link,
        status: 'upcoming',
      };

      const response = await fetch(`/api/course/${CourseId}/teacher/${ID}/add-class`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Add this to ensure cookies are sent
        body: JSON.stringify(data),
      });

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        
        // Try to parse as JSON, but handle the case where it's not JSON
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.message || 'Failed to schedule class');
        } catch (jsonError) {
          // If it's not valid JSON, use the status text
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
      }

      const res = await response.json();
      alert(res.message || 'Class scheduled successfully');
      
      if (res.statusCode === 200) {
        onClose();
      }
    } catch (error) {
      setError(error.message);
      alert(`Error: ${error.message}`);
      console.error("Error scheduling class:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center'>
      <div className='w-[60%] h-[70%] bg-blue-gray-700 text-white rounded-md'>
        <div className='absolute w-9 h-9 bg-[#E2B659] rounded-xl cursor-pointer flex items-center justify-center m-2' onClick={onClose}>✖️</div>
        
        <div className='flex justify-center mt-5 gap-10 border-b-2 py-5'>
          <p className='text-2xl'>Create next class</p>
          <select 
            value={CourseId} 
            onChange={(e) => setCourseId(e.target.value)} 
            className='text-gray-900 rounded-md w-28 px-2 border-0 outline-0'
            disabled={!courses || courses.length === 0}
          >
            {courses && courses.length > 0 ? (
              courses
                .filter((course) => course.isapproved)
                .map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.coursename.toUpperCase()} {'['} {course.schedule?.map(day => DAY[day.day]).join(', ')} {']'}
                  </option>
                ))
            ) : (
              <option value="">No courses available</option>
            )}
          </select>
        </div>

        <div className='flex items-center justify-around my-20 mx-5'>
          <div className='flex gap-5 text-black'>
            <label htmlFor="" className='text-xl text-white'>Date & Time:</label>
            <DateTime setDate={setDate} allowedDays={allowedDays}/>
          </div>
        </div>

        <div className='m-10 flex items-center justify-center gap-20 mb-20'>
          <div className='flex gap-5'>
            <label htmlFor="" className='text-xl'>Link:</label>
            <input value={link} onChange={(e) => setLink(e.target.value)} type="url" className='border-0 outline-0 text-gray-900 py-1 px-3 rounded-sm' />
          </div>

          <div className='flex gap-5'>
            <label htmlFor="" className='text-xl'>Title:</label>
            <input value={note} onChange={(e) => setNote(e.target.value)} type="text" className='border-0 outline-0 text-gray-900 py-1 px-3 rounded-sm' />
          </div>
        </div>

        <div className='flex items-center justify-center'>
          <button 
            onClick={addCourses} 
            disabled={isSubmitting}
            className={`bg-[#E2B659] w-32 text-center py-2 rounded-sm text-brown-900 text-xl cursor-pointer ${isSubmitting ? 'opacity-70' : ''}`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddClass;
