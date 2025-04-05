import React, { useState, useEffect } from 'react'
import Search from '../../Components/Searchbtn/Search'
import { useParams } from 'react-router-dom'

function SearchTeacher() {
  const [popup, setPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // all, math, physics, biology, chemistry, computer
  const { ID } = useParams();

  // Available subjects for filtering
  const subjects = [
    { value: 'all', label: 'All Subjects' },
    { value: 'math', label: 'Mathematics' },
    { value: 'physics', label: 'Physics' },
    { value: 'biology', label: 'Biology' },
    { value: 'chemistry', label: 'Chemistry' },
    { value: 'computer', label: 'Computer Science' },
  ];

  // Function to search teachers based on query and filter
  const searchTeachers = async () => {
    setLoading(true);
    try {
      // If a subject filter is selected, use it instead of the search query
      const endpoint = filter !== 'all' 
        ? `/api/course/${filter}`
        : `/api/course/${searchQuery.toLowerCase() || 'all'}`;
      
      const response = await fetch(endpoint);
      const data = await response.json();
      
      if (data.statusCode === 200) {
        setSearchResults(data.data);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching teachers:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Effect to perform search when filter changes
  useEffect(() => {
    if (filter) {
      searchTeachers();
    }
  }, [filter]);

  // Handle teacher selection for feedback
  const handleSelectTeacher = (teacher, course) => {
    setSelectedTeacher(teacher);
    setSelectedCourse(course);
    setPopup(true);
  };

  const closePopup = () => {
    setPopup(false);
    setSelectedTeacher(null);
    setSelectedCourse('');
  };

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    // You can implement feedback submission logic here
    alert('Thank you for your feedback!');
    closePopup();
  };

  return (
    <div className='ml-56'>
      {/* Enhanced search interface */}
      <div className="p-4 bg-white rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-bold mb-4">Find Teachers</h2>
        
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Search input */}
          <div className="flex-1">
            <div className="flex items-center border rounded-md overflow-hidden">
              <input
                type="text"
                className="p-3 w-full focus:outline-none"
                placeholder="Search by subject or teacher name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchTeachers()}
              />
              <button 
                className="bg-blue-600 text-white px-4 py-3 hover:bg-blue-700"
                onClick={searchTeachers}
              >
                Search
              </button>
            </div>
          </div>
          
          {/* Filter dropdown */}
          <div className="w-full md:w-64">
            <select 
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              {subjects.map(subject => (
                <option key={subject.value} value={subject.value}>
                  {subject.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Display search results */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-xl font-semibold mb-4">
          {loading ? 'Searching...' : 
            searchResults.length > 0 
              ? `Found ${searchResults.length} courses` 
              : 'No courses found'}
        </h3>

        {/* Results list */}
        <div className="space-y-4">
          {searchResults.map((course) => (
            <div 
              key={course._id}
              className="p-4 border rounded-lg hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-bold text-blue-700">{course.coursename.toUpperCase()}</h4>
                  <p className="text-gray-600 mt-1">
                    <span className="font-semibold">Teacher:</span> {course.enrolledteacher.Firstname} {course.enrolledteacher.Lastname}
                  </p>
                  <p className="text-gray-600 mt-1">
                    <span className="font-semibold">Description:</span> {course.description}
                  </p>
                  <p className="text-gray-600 mt-1">
                    <span className="font-semibold">Students:</span> {course.enrolledStudent.length}/20
                  </p>
                </div>
                
                <button
                  onClick={() => handleSelectTeacher(
                    {
                      id: course.enrolledteacher.Teacherdetails,
                      name: `${course.enrolledteacher.Firstname} ${course.enrolledteacher.Lastname}`
                    }, 
                    course.coursename
                  )}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Give Feedback
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Use the original Search component as a fallback */}
      {searchResults.length === 0 && !loading && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Browse All Courses</h3>
          <Search />
        </div>
      )}
        
      {popup && (
        <div className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center'>
          <div className='bg-[#5be0de] w-[70vw] px-14 py-10 rounded-sm'>
            <div className='absolute w-9 h-9 bg-white rounded-xl cursor-pointer flex items-center justify-center m-2' onClick={closePopup}>✖️</div>

            <p className='text-3xl'>Student Feedback Form</p>
            <p className='border-b-2 py-2'>Please help us improve our courses by filling out this student feedback form. We highly appreciate your involvement. Thank you!</p>

            <form onSubmit={handleSubmitFeedback}>
              <div className='flex flex-col gap-3 my-5 pb-5 border-b-2'>
                <label>Teacher / Instructor</label>
                <input 
                  type="text" 
                  className='p-2' 
                  placeholder='Teacher / Instructor Name'
                  value={selectedTeacher?.name || ''}
                  readOnly
                />
                <label>Course Name</label>
                <input 
                  type="text" 
                  className='p-2' 
                  placeholder='Course Name'
                  value={selectedCourse || ''}
                  readOnly
                />
                <label>What you like about this course?</label>
                <input type="text" className='p-2' placeholder='' required />
              </div>

              <p className='font-bold'>Please rate each following statement : </p>
              
              <div className='my-3'>
                <div className='flex gap-1'>
                  <p className='mr-[1.65rem]'>Level of effort invested in course</p>
                  <input name="group" type="radio" id='one'/> <label className='mr-3' htmlFor='one'>Very Good</label>
                  <input name="group" type="radio" id='two'/> <label className='mr-3' htmlFor='two'>Good</label>
                  <input name="group" type="radio" id='three'/> <label className='mr-3' htmlFor='three'>Fair</label>
                  <input name="group" type="radio" id='four'/> <label className='mr-3' htmlFor='four'>Poor</label>
                  <input name="group" type="radio" id='five'/> <label className='mr-3' htmlFor='five'>Very Poor</label>
                </div>
                <div className='flex gap-1 mt-1'>
                  <p className='mr-4'>Level of knowledge on the Subject</p>
                  <input name="group-0" type="radio" id='onec'/> <label className='mr-3' htmlFor='onec'>Very Good</label>
                  <input name="group-0" type="radio" id='twoc'/> <label className='mr-3' htmlFor='twoc'>Good</label>
                  <input name="group-0" type="radio" id='threec'/> <label className='mr-3' htmlFor='threec'>Fair</label>
                  <input name="group-0" type="radio" id='fourc'/> <label className='mr-3' htmlFor='fourc'>Poor</label>
                  <input name="group-0" type="radio" id='fivec'/> <label className='mr-3' htmlFor='fivec'>Very Poor</label>
                </div>
                <div className='flex gap-1 mt-1'>
                  <p className='mr-[5.48rem]'>Level of communication</p>
                  <input name="group-1" type="radio" id='oned'/> <label className='mr-3' htmlFor='oned'>Very Good</label>
                  <input name="group-1" type="radio" id='twod'/> <label className='mr-3' htmlFor='twod'>Good</label>
                  <input name="group-1" type="radio" id='threed'/> <label className='mr-3' htmlFor='threed'>Fair</label>
                  <input name="group-1" type="radio" id='fourd'/> <label className='mr-3' htmlFor='fourd'>Poor</label>
                  <input name="group-1" type="radio" id='fived'/> <label className='mr-3' htmlFor='fived'>Very Poor</label>
                </div>
              </div>

              <div className='py-3'>
                <p className='pb-3'>Would you recommend this course to other students?</p>
                <input name="radio-group" type="radio" id='yes' value="yes" required /> 
                <label htmlFor='yes'>Yes</label>
                <input name="radio-group" type="radio" id='no' className='ml-5' value="no" /> 
                <label htmlFor='no'>No</label>
              </div>

              <div className='flex justify-center'>
                <button type="submit" className='w-[10rem] bg-blue-600 text-white py-2 rounded hover:bg-blue-700'>
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div> 
  )
}

export default SearchTeacher