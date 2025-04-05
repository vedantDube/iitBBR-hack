import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Card, 
  Typography, 
  Box, 
  CircularProgress, 
  Button, 
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import AudioFileIcon from '@mui/icons-material/AudioFile';
import LinkIcon from '@mui/icons-material/Link';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

const StudentMaterials = ({ courseId }) => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  
  // Fetch learning materials for this course
  useEffect(() => {
    const fetchMaterials = async () => {
      if (!courseId) return;
      
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

    fetchMaterials();
  }, [courseId]);

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

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredMaterials = filter === 'all' 
    ? materials 
    : materials.filter(material => material.type === filter);

  return (
    <div className="p-4">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h2">
          Learning Materials
        </Typography>
        
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Filter by</InputLabel>
          <Select
            value={filter}
            onChange={handleFilterChange}
            label="Filter by"
            size="small"
          >
            <MenuItem value="all">All Materials</MenuItem>
            <MenuItem value="pdf">PDF Documents</MenuItem>
            <MenuItem value="image">Images</MenuItem>
            <MenuItem value="audio">Audio</MenuItem>
            <MenuItem value="ppt">Presentations</MenuItem>
            <MenuItem value="link">Links</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : materials.length === 0 ? (
        <Typography variant="body1" color="textSecondary" align="center" py={4}>
          No learning materials available for this course yet
        </Typography>
      ) : filteredMaterials.length === 0 ? (
        <Typography variant="body1" color="textSecondary" align="center" py={4}>
          No {filter} materials available
        </Typography>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMaterials.map((material) => (
            <Card key={material._id} className="p-4 hover:shadow-lg transition-shadow duration-300">
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
              
              <Divider sx={{ my: 1.5 }} />
              
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="caption" color="textSecondary">
                  {new Date(material.uploadedAt).toLocaleDateString()}
                  {material.fileSize && ` • ${getFormattedSize(material.fileSize)}`}
                </Typography>
                
                <Button
                  variant="contained"
                  size="small"
                  href={material.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={getFileIcon(material.type)}
                  color={
                    material.type === 'pdf' ? 'error' :
                    material.type === 'image' ? 'primary' :
                    material.type === 'audio' ? 'success' :
                    material.type === 'link' ? 'secondary' : 'primary'
                  }
                >
                  {material.type === 'link' ? 'Visit' : 'Download'}
                </Button>
              </Box>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentMaterials;