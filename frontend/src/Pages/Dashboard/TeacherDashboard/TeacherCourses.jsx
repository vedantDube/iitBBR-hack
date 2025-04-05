import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Popup from './Popup';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Button, Card, Typography, Box, CircularProgress } from '@mui/material';

function TeacherCourses() {
  const [showPopup, setShowPopup] = useState(false);
  const [subject, setSubject] = useState('');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { ID } = useParams();
  const navigate = useNavigate();

  // Fetch teacher's courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`/api/course/teacher/${ID}/enrolled`, {
          withCredentials: true
        });
        setCourses(response.data.data || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error('Failed to load your courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [ID]);

  const createCourse = (sub) => {
    setShowPopup(true);
    setSubject(sub);
  };

  const handleManageCourse = () => {
    navigate(`/Teacher/Dashboard/${ID}/CourseDetails`);
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <CircularProgress />
        </div>
      ) : (
        <>
          {courses.length > 0 && (
            <div className="mb-8 ml-56 mt-6">
              <Typography variant="h5" component="h2" gutterBottom>
                Your Courses
              </Typography>
              <Card className="p-4 shadow-md">
                <Box className="mb-4">
                  <Typography variant="body1">
                    You have {courses.length} active {courses.length === 1 ? 'course' : 'courses'}.
                  </Typography>
                </Box>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleManageCourse}
                >
                  Manage Your Courses
                </Button>
              </Card>
            </div>
          )}

          <div className='flex gap-10 pl-48 mx-48 mt-8 flex-wrap justify-center'>
            <div className="subject cursor-pointer" onClick={() => createCourse("Physics")}>
              <img src="https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/8e9bf690d23d886f63466a814cfbec78187f91d2" alt="Physics" />
              <p>Physics</p>
            </div>
            <div className="subject cursor-pointer" onClick={() => createCourse("Chemistry")}>
              <img src="https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/3e546b344774eb0235acc6bf6dad7814a59d6e95" alt="Chemistry" />
              <p>Chemistry</p>
            </div>
            <div className="subject cursor-pointer" onClick={() => createCourse("Biology")}>
              <img src="https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/28ac70002ae0a676d9cfb0f298f3e453d12b5555" alt="Zoology" />
              <p>Biology</p>
            </div>
            <div className="subject cursor-pointer" onClick={() => createCourse("Math")}>
              <img src="https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/61930117e428a1f0f7268f888a84145f93aa0664" alt="Math" />
              <p>Math</p>
            </div>
            <div className="subject cursor-pointer" onClick={() => createCourse("Computer")}>
              <img src="https://www.figma.com/file/6b4R8evBkii6mI53IA4vSS/image/a64c93efe984ab29f1dfb9e8d8accd9ba449f272" alt="Computer" />
              <p>Computer</p>
            </div>
          </div>
        </>
      )}
      
      {showPopup && (
        <Popup onClose={() => setShowPopup(false)} subject={subject} />
      )}
    </>
  );
}

export default TeacherCourses;