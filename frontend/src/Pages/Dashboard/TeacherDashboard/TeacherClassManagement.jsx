import React, { useState, useEffect } from 'react';
import Camera from '../Images/Camera.png';

function TeacherClassManagement({ courseId, courseName }) {
  const [loading, setLoading] = useState(false);
  const [scheduledClasses, setScheduledClasses] = useState([]);
  const [showAddClassForm, setShowAddClassForm] = useState(false);
  const [classData, setClassData] = useState({
    title: '',
    date: '',
    timing: '',
    link: '',
    status: 'upcoming'
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [teacherId, setTeacherId] = useState('');

  // Get teacher ID from local storage
  useEffect(() => {
    const teacher = JSON.parse(localStorage.getItem('teacher'));
    if (teacher && teacher._id) {
      setTeacherId(teacher._id);
    }
  }, []);

  // Fetch classes when a course is selected
  useEffect(() => {
    if (courseId && teacherId) {
      fetchClassesForCourse();
    }
  }, [courseId, teacherId]);

  const fetchClassesForCourse = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/course/classes/teacher/${teacherId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch classes');
      }

      const data = await response.json();
      
      // Filter classes for the selected course
      const filteredClasses = data.data.classes[0]?.liveClasses.filter(
        cls => cls.coursename === courseName
      ) || [];
      
      setScheduledClasses(filteredClasses);
    } catch (err) {
      setError('Error fetching classes: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'timing') {
      // Convert HH:MM format to minutes since midnight
      if (value) {
        const [hours, minutes] = value.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes;
        setClassData({
          ...classData,
          timing: totalMinutes
        });
      } else {
        setClassData({
          ...classData,
          timing: ''
        });
      }
    } else {
      setClassData({
        ...classData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess('');
    
    try {      
      if (!courseId) {
        throw new Error('Course ID not found');
      }
      
      const response = await fetch(`/api/course/${courseId}/teacher/${teacherId}/add-class`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(classData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add class');
      }
      
      setSuccess('Class added successfully!');
      setClassData({
        title: '',
        date: '',
        timing: '',
        link: '',
        status: 'upcoming'
      });
      setShowAddClassForm(false);
      
      // Refresh the classes list
      fetchClassesForCourse();
    } catch (err) {
      setError(err.message);
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

  // Convert minutes to HH:MM for input field
  const minutesToHHMM = (minutes) => {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      {error && (
        <div className="text-red-500 bg-red-100 p-4 mb-4 rounded-lg">{error}</div>
      )}
      
      {success && (
        <div className="bg-green-100 text-green-700 p-4 mb-4 rounded-lg">
          {success}
        </div>
      )}
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">{courseName ? courseName.toUpperCase() : ''} Classes</h2>
        <button
          onClick={() => setShowAddClassForm(!showAddClassForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          {showAddClassForm ? 'Cancel' : 'Add New Class'}
        </button>
      </div>
      
      {showAddClassForm && (
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-3">Add New Class</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Class Title</label>
              <input
                type="text"
                name="title"
                value={classData.title}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                placeholder="Introduction to Algebra"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={classData.date}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Time</label>
                <input
                  type="time"
                  name="timing"
                  value={minutesToHHMM(classData.timing)}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Meeting Link</label>
              <input
                type="url"
                name="link"
                value={classData.link}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                placeholder="https://meet.google.com/..."
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                value={classData.status}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="upcoming">Upcoming</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                Schedule Class
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
        {loading ? (
          <div className="text-center py-6">Loading classes...</div>
        ) : scheduledClasses.length === 0 ? (
          <div className="text-center py-8">
            <img src={Camera} alt="No Classes" className="mx-auto w-16 opacity-50 mb-3" />
            <p className="text-gray-500">No classes scheduled for this course yet.</p>
            <p className="text-gray-400 text-sm mt-1">Create your first class by clicking the "Add New Class" button.</p>
          </div>
        ) : (
          scheduledClasses.map((cls, index) => (
            <div
              key={index}
              className={`border-l-4 p-4 rounded-lg shadow-sm ${
                cls.status === 'in-progress' ? 'border-green-500 bg-green-50' :
                cls.status === 'upcoming' ? 'border-blue-500 bg-blue-50' :
                cls.status === 'completed' ? 'border-gray-500 bg-gray-50' :
                'border-red-500 bg-red-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{cls.title}</h3>
                  <p className="text-gray-600">
                    {formatDate(cls.date)} at {formatTime(cls.timing)}
                  </p>
                  <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                    cls.status === 'in-progress' ? 'bg-green-200 text-green-800' :
                    cls.status === 'upcoming' ? 'bg-blue-200 text-blue-800' :
                    cls.status === 'completed' ? 'bg-gray-200 text-gray-800' :
                    'bg-red-200 text-red-800'
                  }`}>
                    {cls.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </span>
                </div>
                
                <div className="space-x-2">
                  {cls.status !== 'completed' && (
                    <a
                      href={cls.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Join
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TeacherClassManagement;