// components/VideoDescriptionManager.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  Paper,
  Chip,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Edit,
  Description,
  VideoLibrary,
  Refresh,
} from '@mui/icons-material';

import YouTubeApiService from '../services/youtubeApiD2';

import { config } from '../../dataD2';
const api = config.api;



const YouTubeVideoTitle = ({ isAuthenticated, onAuthRequired }) => {
// const VideoDescriptionManager = ({ isAuthenticated, onAuthRequired }) => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [title, setTitle] = useState('');
  const link=`https://www.youtube.com/watch?v=${selectedVideo?.id}`

  // videoId = localStorage.getItem('videoId');
  
  

  console.log(`selectedVideo: ${JSON.stringify(selectedVideo)}`)
  console.log(`title ${title}, description ${description}`);

  useEffect(() => {
    if (isAuthenticated) {
      loadMyVideos();
    }
  }, [isAuthenticated]);

  // useEffect(() => {
  //   localStorage.setItem('videoId',selectedVideo?.id);
  // }, [selectedVideo]);

  const loadMyVideos = async () => {
    if (!isAuthenticated) {
      onAuthRequired();
      return;
    }

    setLoading(true);
    try {
      // First get user's channel
      const channelResponse = await YouTubeApiService.getMyChannel();
      
      if (channelResponse.items && channelResponse.items.length > 0) {
        const channelId = channelResponse.items[0].id;
        const videosResponse = await YouTubeApiService.getChannelVideos(channelId, 25);
        setVideos(videosResponse.items || []);
      }
    } catch (error) {
      console.error('Error loading videos:', error);
      if (error.message === 'Authentication required') {
        onAuthRequired();
      } else {
        showSnackbar('Error loading videos', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVideoSelect = async (video) => {
    setSelectedVideo(video);
    setDescription(video.snippet.description || '');
    setTitle(video.snippet.title || '');
    localStorage.setItem('videoId',video.id);
  };

  const handleEditDescription = () => {
    if (!selectedVideo) return;
    setEditDialogOpen(true);
  };

  const handleUpdateDescriptionTitle = async () => {
    if (!selectedVideo || !isAuthenticated) {
      onAuthRequired();
      return;
    }

    setUpdating(true);
    try {
      await YouTubeApiService.updateVideoDescriptionTitle(selectedVideo.id, description, title);
      setEditDialogOpen(false);
      showSnackbar('Description updated successfully', 'success');
      
      // Refresh the videos list to get updated data
      loadMyVideos();
    } catch (error) {
      console.error('Error updating description:', error);
      if (error.message === 'Authentication required') {
        onAuthRequired();
      } else {
        showSnackbar('Error updating description', 'error');
      }
    } finally {
      setUpdating(false);
    }



    try {
      const res = await fetch(`${api}/description`, {
          headers: {
              'Content-Type': 'application/json',
              // 'Authorization': `Bearer ${token}`
          },
          method: 'POST',
          body: JSON.stringify({
            descriptionlog: {
                  requestAPI: 'description or title edit',
                  videoId: selectedVideo.id,
                  oldTitle: selectedVideo.snippet.title, 
                  oldDescription: selectedVideo.snippet.description,
                  newDescription: description,
                  newTitle: title,
                  
              },
              
          })
      })

      const data = await res.json()
      console.log('descriptionlog ',data)

  } catch (error) {
      console.error(error)
  }


  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatViewCount = (count) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 2 }}>
      {/* Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" gutterBottom>
              <VideoLibrary sx={{ verticalAlign: 'middle', mr: 1 }} />
              My Uploaded Videos
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={loadMyVideos}
              disabled={loading}
            >
              Refresh
            </Button>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Manage descriptions for your uploaded YouTube videos
          </Typography>
        </CardContent>
      </Card>

      {!isAuthenticated && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Authentication required to manage video descriptions.
        </Alert>
      )}

      {/* Videos List and Details */}
      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
        {/* Videos List */}
        <Paper sx={{ p: 2, flex: 1, maxHeight: 600, overflow: 'auto' }}>
          <Typography variant="h6" gutterBottom>
            My Videos ({videos.length})
          </Typography>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : videos.length === 0 ? (
            <Typography color="text.secondary" sx={{ textAlign: 'center', p: 3 }}>
              No videos found. Make sure you have uploaded videos to your YouTube channel.
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {videos.map((video) => (
                <Card
                  key={video.id}
                  sx={{
                    cursor: 'pointer',
                    border: selectedVideo?.id === video.id ? 2 : 1,
                    borderColor: selectedVideo?.id === video.id ? 'primary.main' : 'divider',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: 'action.hover',
                    },
                  }}
                  onClick={() => handleVideoSelect(video)}
                >
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <img
                        src={video.snippet.thumbnails.default.url}
                        alt={video.snippet.title}
                        style={{
                          width: 120,
                          height: 90,
                          objectFit: 'cover',
                          borderRadius: 4,
                        }}
                      />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="subtitle2"
                          fontWeight="bold"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {video.snippet.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {formatDate(video.snippet.publishedAt)}
                        </Typography>
                        {video.statistics && (
                          <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                            <Chip
                              size="small"
                              label={`${formatViewCount(video.statistics.viewCount)} views`}
                            />
                            <Chip
                              size="small"
                              label={`${formatViewCount(video.statistics.likeCount)} likes`}
                            />
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Paper>

        {/* Video Details */}
        <Paper sx={{ p: 3, flex: 1 }}>
          {selectedVideo ? (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="h6">
                  Video Details
                </Typography>
                <Tooltip title="Edit Description">
                  <IconButton
                    color="primary"
                    onClick={handleEditDescription}
                    disabled={!isAuthenticated}
                  >
                    <Edit />
                  </IconButton>
                </Tooltip>
              </Box>

              <Box sx={{ mb: 3 }}>
                <img
                  src={selectedVideo.snippet.thumbnails.medium?.url || selectedVideo.snippet.thumbnails.default.url}
                  alt={selectedVideo.snippet.title}
                  style={{
                    width: '100%',
                    maxWidth: 400,
                    height: 'auto',
                    borderRadius: 8,
                  }}
                />
              </Box>

              <Typography variant="h6" gutterBottom>
                {selectedVideo.snippet.title}     
              </Typography>

              {/* <span style={{fontWeight:'lighter', textSize:'10px'}}>videoId: {selectedVideo.id}</span> */}
              {/* <a href={link} target="_blank">video link</a><br /> */}
              

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  videoId: {selectedVideo.id}  <a href={link} target="_blank">video link</a><br />
                  Published: {formatDate(selectedVideo.snippet.publishedAt)}
                </Typography>
                {selectedVideo.statistics && (
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Chip
                      size="small"
                      label={`${formatViewCount(selectedVideo.statistics.viewCount)} views`}
                    />
                    <Chip
                      size="small"
                      label={`${formatViewCount(selectedVideo.statistics.likeCount)} likes`}
                    />
                    <Chip
                      size="small"
                      label={`${formatViewCount(selectedVideo.statistics.commentCount)} comments`}
                    />
                  </Box>
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                <Description sx={{ verticalAlign: 'middle', mr: 1 }} />
                Description
              </Typography>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  backgroundColor: 'grey.50',
                  maxHeight: 300,
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {selectedVideo.snippet.description || 'No description available'}
              </Paper>
            </>
          ) : (
            <Box sx={{ textAlign: 'center', p: 3 }}>
              <Description sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Select a video to view and edit its description
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>

      {/* Edit Description Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { height: '80vh' }
        }}
      >
        <DialogTitle>
          Edit Video Description
        </DialogTitle>
        <DialogContent>
          {selectedVideo && (
            <>
              <Typography variant="subtitle2" gutterBottom>
                Editing description for: {selectedVideo.snippet.title}
              </Typography>
              <TextField
                multiline
                rows={15}
                fullWidth
                variant="outlined"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter video title..."
                sx={{ mt: 2 }}
              />

              <TextField
                multiline
                rows={15}
                fullWidth
                variant="outlined"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter video description..."
                sx={{ mt: 2 }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Description length: {description.length} characters
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleUpdateDescriptionTitle}
            variant="contained"
            disabled={updating || !description.trim() || !title.trim()}
            startIcon={updating ? <CircularProgress size={16} /> : null}
          >
            {updating ? 'Updating...' : 'Update Description'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default YouTubeVideoTitle;












































































































// // import React from 'react'

// // const YouTubeVideoTitle = ({description}) => {

    

// //   return (
// //     <div>
// //       {JSON.stringify(description)}
// //     </div>
// //   )
// // }

// // export default YouTubeVideoTitle



// // components/YouTubeComments.jsx
// import React, { useState, useEffect } from 'react';
// import {
//     Box,
//     TextField,
//     Button,
//     Card,
//     CardContent,
//     Typography,
//     IconButton,
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     Snackbar,
//     Alert,
//     CircularProgress,
//     List,
//     ListItem,
//     Divider,
// } from '@mui/material';
// import {
//     Edit,
//     Delete,
//     Reply,
//     Send,
// } from '@mui/icons-material';

// import YouTubeApiService from '../services/youtubeApiD2';
// import getDescription from '../services/getDescription';



// // Update the YouTubeComments component to handle authentication
// const YouTubeVideoTitle = ({ videoId, isAuthenticated, onAuthRequired, description }) => {
//     // ... existing state ...

//     // const [comments, setComments] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [newDescription, setNewDescription] = useState('');
//     const [editingDescription, setEditingDescription] = useState(null);
//     const [editText, setEditText] = useState('');
//     const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

//     // const accessToken = youtubeApiWithAuth();
//     // console.log(accessToken);

//     // const [description, setDescription] = useState(description);

//     // useEffect(() => {
//     //     setDescription(description);
//     // }, [description]);

//     console.log(description);
//     console.log()
//     // videoTitle=description.videoTitle;


//     useEffect(() => {
//         loadDescription();
//     }, [videoId]);


//     const loadDescription = async () => {
//         if (!isAuthenticated) {
//             onAuthRequired();
//             return;
//         }

//         if (!videoId) return;

//         setLoading(true);
//         try {
//             const response = await getDescription.fetchVideoData(videoId);
//             setComments(response.items || []);
//         } catch (error) {

//             if (error.message === 'Authentication required') {
//                 onAuthRequired();
//             } else {
//                 showSnackbar('Error loading comments', 'error');
//             }
//         } finally {
//             setLoading(false);
//         }
//     };



    


//     const handleUpdateDescription = async () => {
//         if (!isAuthenticated) {
//             onAuthRequired();
//             return;
//         }

//         if (!editText.trim() || !editingDescription) return;

//         try {
//             const videoId = description..id;
//             await YouTubeApiService.updateComment(commentId, editText);
//             setEditingComment(null);
//             setEditText('');
//             showSnackbar('Comment updated successfully', 'success');
//             loadComments();
//         } catch (error) {
//             if (error.message === 'Authentication required') {
//                 onAuthRequired();
//             } else {
//                 showSnackbar('Error updating comment', 'error');
//             }
//         }
//     };

//     const handleAddComment = async () => {
//       if (!isAuthenticated) {
//           onAuthRequired();
//           return;
//       }

//       if (!newComment.trim()) return;

//       try {
//           await YouTubeApiService.addComment(videoId, newComment);
//           setNewComment('');
//           showSnackbar('Comment added successfully', 'success');
//           loadComments();
//       } catch (error) {
//           if (error.message === 'Authentication required') {
//               onAuthRequired();
//           } else {
//               showSnackbar('Error adding comment', 'error');
//           }
//       }
//   };


    


//     const startEditing = (comment) => {
//         setEditingComment(comment);
//         setEditText(comment.snippet.topLevelComment.snippet.textOriginal);
//       };
    
//       const showSnackbar = (message, severity) => {
//         setSnackbar({ open: true, message, severity });
//       };
    
//       const handleCloseSnackbar = () => {
//         setSnackbar({ ...snackbar, open: false });
//       };
    
//       const formatDate = (dateString) => {
//         return new Date(dateString).toLocaleDateString();
//       };

//     // Similar updates for updateComment and deleteComment methods

//     return (

//         <>
      
//             {!isAuthenticated && (
//                 <Alert severity="info" sx={{ mb: 2 }}>
//                     Login required to post, edit, or delete comments.
//                 </Alert>
//             )}
      

//       {/* <h3>videoTitle {JSON.stringify(description)}</h3> */}
      








//             <Box sx={{ maxWidth: 800, margin: '0 auto', p: 2 }}>





//             {loading ? (
//                     <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
//                         <CircularProgress />
//                     </Box>
//                 ) : (
//                     <List>
//                         {description.map((desc, index) => {
                            

//                             return (
//                                 <React.Fragment key={desc.id}>
//                                     <ListItem alignItems="flex-start" sx={{ flexDirection: 'column' }}>
//                                         <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
//                                             <Box sx={{ flex: 1 }}>
                                                
//                                                 <Typography variant="subtitle2" fontWeight="bold">
//                                                 <span style={{color:'blue'}}>Video Title: </span> {desc.videoTitle}
//                                                 </Typography>
//                                                 <Typography variant="caption" color="text.secondary">
//                                                 <span style={{color:'blue'}}>Release Date: </span> {formatDate(desc.releasedAt)}
//                                                 </Typography>&nbsp;&nbsp;
//                                                 <Typography variant="caption" sx={{ mt: 1, mb: 1 }}>
//                                                 <span style={{color:'blue'}}>Duration: </span>  {desc.duration.slice(2).replace("M", "M:")}
//                                                 </Typography>
//                                             </Box>

                                            
//                                         </Box>

                                        
                                        
//                                     </ListItem>
                                    
//                                 </React.Fragment>
//                             );
//                         })}
//                     </List>
//                 )}







//                 {/* Add Comment Section */}
//                 <Card sx={{ mb: 3 }}>
//                     <CardContent>
//                         <Typography variant="h6" gutterBottom>
//                             Update Description
//                         </Typography>
//                         <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
//                             <TextField
//                                 fullWidth
//                                 multiline
//                                 rows={3}
//                                 variant="outlined"
//                                 placeholder="Write your comment..."
//                                 value={newDescription}
//                                 onChange={(e) => setNewDescription(e.target.value)}
//                             />
//                             <Button
//                                 variant="contained"
//                                 endIcon={<Send />}
//                                 onClick={handleUpdateDescription}
//                                 disabled={!Description.trim()}
//                                 sx={{ minWidth: 100 }}
//                             >
//                                 Post
//                             </Button>
//                         </Box>
//                     </CardContent>
//                 </Card>

                

//                 {/* Edit Comment Dialog */}
//                 <Dialog
//                     open={!!editingComment}
//                     onClose={() => setEditingDescription(null)}
//                     maxWidth="sm"
//                     fullWidth
//                 >
//                     <DialogTitle>Edit Description</DialogTitle>
//                     <DialogContent>
//                         <TextField
//                             autoFocus
//                             multiline
//                             rows={4}
//                             fullWidth
//                             variant="outlined"
//                             value={editText}
//                             onChange={(e) => setEditText(e.target.value)}
//                             sx={{ mt: 1 }}
//                         />
//                     </DialogContent>
//                     <DialogActions>
//                         <Button onClick={() => setEditingDescription(null)}>Cancel</Button>
//                         <Button
//                             onClick={handleUpdateDescription}
//                             variant="contained"
//                             disabled={!editText.trim()}
//                         >
//                             Update
//                         </Button>
//                     </DialogActions>
//                 </Dialog>

//                 {/* Snackbar for notifications */}
//                 <Snackbar
//                     open={snackbar.open}
//                     autoHideDuration={4000}
//                     onClose={handleCloseSnackbar}
//                     anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
//                 >
//                     <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
//                         {snackbar.message}
//                     </Alert>
//                 </Snackbar>
//             </Box>

//         </>


//     );
// };



// export default YouTubeVideoTitle;
