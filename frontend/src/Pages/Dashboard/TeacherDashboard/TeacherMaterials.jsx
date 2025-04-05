import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Card, Button, Typography, Divider, Box, TextField, MenuItem, Select, InputLabel, FormControl, CircularProgress, Grid, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import AudioFileIcon from '@mui/icons-material/AudioFile';
import LinkIcon from '@mui/icons-material/Link';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

const TeacherMaterials = ({ courseId }) => {
  const { ID } = useParams(); // Get teacher ID from URL parameters
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'pdf',
    url: '',
    file: null
  });
  const [reload, setReload] = useState(false);

  // Fetch learning materials for this course
  useEffect(() => {
    const fetchMaterials = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/course/${courseId}/materials`, {
          withCredentials: true
        });
        setMaterials(res.data.data || []);
      } catch (error) {
        console.error('Error fetching materials:', error);
        toast.error('Failed to load learning materials');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchMaterials();
    }
  }, [courseId, reload]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      file: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title) {
      toast.error('Please provide a title for the material');
      return;
    }

    if (formData.type === 'link' && !formData.url) {
      toast.error('Please provide a URL for the link');
      return;
    }

    if (formData.type !== 'link' && !formData.file) {
      toast.error('Please select a file to upload');
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('type', formData.type);
    
    if (formData.type === 'link') {
      data.append('url', formData.url);
    } else {
      data.append('file', formData.file);
    }

    setUploading(true);
    try {
      // Update API endpoint to include teacherId
      const res = await axios.post(`/api/course/${courseId}/teacher/${ID}/materials`, data, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast.success('Learning material added successfully');
      setFormData({
        title: '',
        description: '',
        type: 'pdf',
        url: '',
        file: null
      });
      // Reload materials list
      setReload(!reload);
    } catch (error) {
      console.error('Error uploading material:', error);
      toast.error(error.response?.data?.message || 'Failed to upload material');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (materialId) => {
    if (!window.confirm('Are you sure you want to delete this learning material?')) {
      return;
    }

    try {
      // Update API endpoint to include teacherId
      await axios.delete(`/api/course/${courseId}/teacher/${ID}/materials/${materialId}`, {
        withCredentials: true
      });
      toast.success('Material deleted successfully');
      setMaterials(materials.filter(material => material._id !== materialId));
    } catch (error) {
      console.error('Error deleting material:', error);
      toast.error('Failed to delete material');
    }
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <PictureAsPdfIcon color="error" />;
      case 'image':
        return <ImageIcon color="primary" />;
      case 'audio':
        return <AudioFileIcon color="success" />;
      case 'ppt':
        return <InsertDriveFileIcon color="warning" />;
      case 'link':
        return <LinkIcon color="secondary" />;
      default:
        return <InsertDriveFileIcon />;
    }
  };

  const getFormattedSize = (bytes) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="p-4">
      <Typography variant="h5" component="h2" gutterBottom>
        Course Learning Materials
      </Typography>
      
      <Card className="p-4 mb-6">
        <Typography variant="h6" gutterBottom>
          Upload New Material
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Material Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  label="Material Type"
                >
                  <MenuItem value="pdf">PDF Document</MenuItem>
                  <MenuItem value="image">Image</MenuItem>
                  <MenuItem value="audio">Audio</MenuItem>
                  <MenuItem value="ppt">Presentation</MenuItem>
                  <MenuItem value="link">External Link</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description (Optional)"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                margin="normal"
                multiline
                rows={2}
              />
            </Grid>
            
            {formData.type === 'link' ? (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="URL"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                  placeholder="https://example.com"
                />
              </Grid>
            ) : (
              <Grid item xs={12}>
                <input
                  accept={
                    formData.type === 'pdf' ? '.pdf' :
                    formData.type === 'image' ? 'image/*' :
                    formData.type === 'audio' ? 'audio/*' :
                    formData.type === 'ppt' ? '.ppt,.pptx' : '*'
                  }
                  id="material-file"
                  type="file"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <label htmlFor="material-file">
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                    sx={{ mt: 2 }}
                  >
                    Choose File
                  </Button>
                  {formData.file && (
                    <Typography variant="body2" sx={{ ml: 2, display: 'inline' }}>
                      {formData.file.name}
                    </Typography>
                  )}
                </label>
              </Grid>
            )}
            
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={uploading}
                sx={{ mt: 2 }}
              >
                {uploading ? <CircularProgress size={24} /> : 'Upload Material'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Card>

      <Divider sx={{ my: 3 }} />
      
      <Typography variant="h6" gutterBottom>
        Available Materials
      </Typography>
      
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : materials.length === 0 ? (
        <Typography variant="body1" color="textSecondary" align="center" py={4}>
          No learning materials available for this course yet
        </Typography>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {materials.map((material) => (
            <Card key={material._id} className="p-4">
              <Box display="flex" alignItems="center" mb={2}>
                {getFileIcon(material.type)}
                <Typography variant="h6" sx={{ ml: 1 }}>
                  {material.title}
                </Typography>
              </Box>
              
              {material.description && (
                <Typography variant="body2" color="textSecondary" mb={2}>
                  {material.description}
                </Typography>
              )}
              
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="caption" color="textSecondary">
                  {new Date(material.uploadedAt).toLocaleDateString()}
                  {material.fileSize && ` • ${getFormattedSize(material.fileSize)}`}
                </Typography>
                
                <Box>
                  <Button
                    variant="outlined"
                    size="small"
                    href={material.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ mr: 1 }}
                  >
                    {material.type === 'link' ? 'Visit' : 'Download'}
                  </Button>
                  <IconButton 
                    size="small" 
                    color="error"
                    onClick={() => handleDelete(material._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherMaterials;