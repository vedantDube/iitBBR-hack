import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import StudentMaterials from './StudentMaterials';
import { Tab, Tabs, Box, Typography, Card, CircularProgress } from '@mui/material';
import axios from 'axios';
import toast from 'react-hot-toast';

function StudentCourseDetails() {
  const { ID } = useParams();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(false);

  // Fetch student's enrolled courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`/api/course/student/${ID}/enrolled`, {
          withCredentials: true
        });

        setCourses(response.data.data || []);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch courses');
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
    fetchClassesForCourse(course.coursename);
  };

  const fetchClassesForCourse = async (courseName) => {
    setLoadingClasses(true);
    try {
      const response = await axios.get(`/api/course/classes/student/${ID}`, {
        withCredentials: true
      });

      // Filter classes for the selected course
      const filteredClasses = response.data.data.classes[0]?.liveClasses.filter(
        cls => cls.coursename === courseName
      ) || [];
      
      setClasses(filteredClasses);
    } catch (err) {
      toast.error('Error fetching classes');
      console.error(err);
    } finally {
      setLoadingClasses(false);
    }
  };

  // Format time (minutes since midnight) as HH:MM
  const formatTime = (minutes) => {
    if (typeof minutes !== 'number') return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}:${mins.toString().padStart(2, '0')}`;
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="ml-56 mt-10 text-black">
      <h1 className="text-2xl font-bold text-[#1671D8] mb-6">My Courses</h1>
      
      {loading ? (
        <div className="text-center py-10">Loading courses...</div>
      ) : error ? (
        <div className="text-red-500 bg-red-100 p-4 mb-4 rounded-lg">{error}</div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-1/3">
              <h2 className="text-xl font-semibold mb-4">Enrolled Courses</h2>
              
              {courses.length === 0 ? (
                <p className="text-gray-500">You haven't enrolled in any courses yet.</p>
              ) : (
                <div className="space-y-3">
                  <p className="text-gray-600 mb-2">Select a course to view:</p>
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
                      aria-label="course content tabs"
                    >
                      <Tab label="Live Classes" />
                      <Tab label="Learning Materials" />
                    </Tabs>
                  </Box>
                  
                  {/* Live Classes Tab */}
                  {tabValue === 0 && (
                    <div>
                      <Typography variant="h6" component="h3" gutterBottom>
                        Upcoming & Recent Classes
                      </Typography>
                      
                      {loadingClasses ? (
                        <Box display="flex" justifyContent="center" my={4}>
                          <CircularProgress />
                        </Box>
                      ) : classes.length === 0 ? (
                        <Typography variant="body1" color="textSecondary" align="center" py={4}>
                          No classes scheduled for this course yet
                        </Typography>
                      ) : (
                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                          {classes.map((cls, index) => (
                            <Card 
                              key={index}
                              className={`p-4 border-l-4 ${
                                cls.status === 'in-progress' ? 'border-green-500 bg-green-50' :
                                cls.status === 'upcoming' ? 'border-blue-500 bg-blue-50' :
                                'border-gray-500 bg-gray-50'
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <Typography variant="h6">{cls.title}</Typography>
                                  <Typography variant="body2" color="textSecondary">
                                    {formatDate(cls.date)} at {formatTime(cls.timing)}
                                  </Typography>
                                  <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                                    cls.status === 'in-progress' ? 'bg-green-200 text-green-800' :
                                    cls.status === 'upcoming' ? 'bg-blue-200 text-blue-800' :
                                    'bg-gray-200 text-gray-800'
                                  }`}>
                                    {cls.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                  </span>
                                </div>
                                
                                {(cls.status === 'upcoming' || cls.status === 'in-progress') && (
                                  <a
                                    href={cls.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                  >
                                    Join Class
                                  </a>
                                )}
                              </div>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Learning Materials Tab */}
                  {tabValue === 1 && (
                    <StudentMaterials courseId={selectedCourseId} />
                  )}
                </>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">Select a course to view its content</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default StudentCourseDetails;