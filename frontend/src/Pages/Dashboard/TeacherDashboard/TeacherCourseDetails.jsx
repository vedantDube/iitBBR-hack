import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TeacherClassManagement from './TeacherClassManagement';
import TeacherMaterials from './TeacherMaterials';
import { Tab, Tabs, Box } from '@mui/material';

function TeacherCourseDetails() {
  const { ID } = useParams();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState(null);

  // Fetch teacher's courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`/api/course/teacher/${ID}/enrolled`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }

        const data = await response.json();
        setCourses(data.data || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCourses();
  }, [ID]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCourseSelect = (course) => {
    setSelectedCourse(course.coursename);
    setSelectedCourseId(course._id);
  };

  return (
    <div className="ml-56 mt-10 text-black">
      <h1 className="text-2xl font-bold text-[#1671D8] mb-6">Course Management</h1>
      
      {loading ? (
        <div className="text-center py-10">Loading courses...</div>
      ) : error ? (
        <div className="text-red-500 bg-red-100 p-4 mb-4 rounded-lg">{error}</div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-1/3">
              <h2 className="text-xl font-semibold mb-4">Your Courses</h2>
              
              {courses.length === 0 ? (
                <p className="text-gray-500">You haven't created any courses yet.</p>
              ) : (
                <div className="space-y-3">
                  <p className="text-gray-600 mb-2">Select a course to manage:</p>
                  {courses.map((course) => (
                    <div 
                      key={course._id}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        selectedCourse === course.coursename 
                          ? 'bg-blue-100 border-l-4 border-blue-500' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => handleCourseSelect(course)}
                    >
                      <h3 className="font-medium">{course.coursename.toUpperCase()}</h3>
                      <p className="text-sm text-gray-600 truncate">{course.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md flex-1">
              {selectedCourse ? (
                <>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs 
                      value={tabValue} 
                      onChange={handleTabChange}
                      aria-label="course management tabs"
                    >
                      <Tab label="Live Classes" />
                      <Tab label="Learning Materials" />
                    </Tabs>
                  </Box>
                  
                  {tabValue === 0 && (
                    <TeacherClassManagement courseId={selectedCourseId} courseName={selectedCourse} />
                  )}
                  
                  {tabValue === 1 && (
                    <TeacherMaterials courseId={selectedCourseId} />
                  )}
                </>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">Select a course to view and manage its content</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default TeacherCourseDetails;