// components/YouTubeComments.jsx
import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    Button,
    Card,
    CardContent,
    Typography,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert,
    CircularProgress,
    List,
    ListItem,
    Divider,
    Collapse,
    Chip,
    Avatar,
    Paper,
} from '@mui/material';
import {
    Edit,
    Delete,
    Reply as ReplyIcon,
    Send,
    ExpandMore,
    ExpandLess,
} from '@mui/icons-material';

import YouTubeApiService from '../services/youtubeApiD2';


import { config } from '../../dataD2';
const api = config.api;




// Update the YouTubeComments component to handle authentication
const YouTubeCommentsD2 = ({ videoId, isAuthenticated, onAuthRequired, description }) => {
    // ... existing state ...



    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [editingComment, setEditingComment] = useState(null);
    const [editText, setEditText] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [expandedReplies, setExpandedReplies] = useState({});

    const link = `https://www.youtube.com/watch?v=${videoId}`

    console.log(`comments: ${comments}`);

    setTimeout(() => {
        console.log('description ', description);
        console.log(`comments: ${JSON.stringify(comments)}`);
        console.log(`newComment: ${newComment}`);
    }, "5000");

    // console.log(accessToken);

    // useEffect(() => {
    //     setDescription(description);
    // }, [description]);

    // videoTitle=description.videoTitle;


    // useEffect(() => {
    //     loadComments();
    // }, [videoId]);

    useEffect(() => {
        if (videoId) {
            loadComments();
        }
    }, [videoId]);








    const loadComments = async () => {
        if (!isAuthenticated) {
            onAuthRequired();
            return;
        }

        if (!videoId) return;

        setLoading(true);
        try {
            const response = await YouTubeApiService.getVideoComments(videoId);
            setComments(response.items || []);

            console.log('comments', comments);

            // Initialize expanded state for replies
            const expandedState = {};
            response.items?.forEach(comment => {
                if (comment.replies && comment.replies.comments && comment.replies.comments.length > 0) {
                    expandedState[comment.id] = false;
                }
            });
            setExpandedReplies(expandedState);
        } catch (error) {

            if (error.message === 'Authentication required') {
                onAuthRequired();
            } else {
                showSnackbar('Error loading comments', 'error');
            }
        } finally {
            setLoading(false);
        }
    };




    const handleAddComment = async () => {
        if (!isAuthenticated) {
            onAuthRequired();
            return;
        }

        if (!newComment.trim()) return;

        try {
            await YouTubeApiService.addComment(videoId, newComment);
            setNewComment('');
            showSnackbar('Comment added successfully', 'success');
            loadComments();
        } catch (error) {
            if (error.message === 'Authentication required') {
                onAuthRequired();
            } else {
                showSnackbar('Error adding comment', 'error');
            }
        }


        try {
            const res = await fetch(`${api}/comment`, {
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${token}`
                },
                method: 'POST',
                body: JSON.stringify({
                    commentlog: {
                        requestAPI: 'addComment',
                        videoId,
                        newComment,
                    },
                    comments
                })
            })

            const data = await res.json()
            console.log(data)

        } catch (error) {
            console.error(error)
        }

    };






    const handleUpdateComment = async () => {
        if (!isAuthenticated) {
            onAuthRequired();
            return;
        }

        if (!editText.trim() || !editingComment) return;

        try {
            const commentId = editingComment.snippet.topLevelComment.id;
            await YouTubeApiService.updateComment(commentId, editText);
            setEditingComment(null);
            setEditText('');
            showSnackbar('Comment updated successfully', 'success');
            loadComments();
        } catch (error) {
            if (error.message === 'Authentication required') {
                onAuthRequired();
            } else {
                showSnackbar('Error updating comment', 'error');
            }
        }


        try {
            const commentId = editingComment.snippet.topLevelComment.id
            const res = await fetch(`${api}/comment`, {
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${token}`
                },
                method: 'POST',
                body: JSON.stringify({
                    commentlog: {
                        requestAPI: 'updateComment',
                        videoId,
                        commentId,
                        editText,
                    },
                    comments,
                })

            })

            const data = await res.json()
            console.log(data)

        } catch (error) {
            console.error(error)
        }

        // const commentId = editingComment.snippet.topLevelComment.id;
        // console.log('update comment ', JSON.stringify({requestAPI:'updateComment',videoId,commentId,editText}));


    };


    const handleDeleteComment = async (commentId, textOriginal) => {
        if (!isAuthenticated) {
            onAuthRequired();
            return;
        }

        if (!window.confirm('Are you sure you want to delete this comment?')) return;

        try {
            await YouTubeApiService.deleteComment(commentId);
            showSnackbar('Comment deleted successfully', 'success');
            loadComments();
        } catch (error) {
            if (error.message === 'Authentication required') {
                onAuthRequired();
            } else {
                showSnackbar('Error deleting comment', 'error');
            }
        }


        try {
            const res = await fetch(`${api}/comment`, {
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${token}`
                },
                method: 'POST',
                body: JSON.stringify({
                    commentlog: {
                        requestAPI: 'deleteComment',
                        videoId,
                        commentId,
                        textOriginal,
                    },
                    comments
                })
            })

            const data = await res.json()
            console.log(data)

        } catch (error) {
            console.error(error)
        }



    };

    // === REPLY HANDLERS ===

    const handleAddReply = async (parentCommentId) => {
        if (!isAuthenticated) {
            onAuthRequired();
            return;
        }

        if (!replyText.trim()) return;

        try {
            await YouTubeApiService.addReply(parentCommentId, replyText);
            setReplyingTo(null);
            setReplyText('');
            showSnackbar('Reply added successfully', 'success');
            loadComments();
        } catch (error) {
            if (error.message === 'Authentication required') {
                onAuthRequired();
            } else {
                showSnackbar('Error adding reply', 'error');
            }
        }


        try {
            const res = await fetch(`${api}/comment`, {
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${token}`
                },
                method: 'POST',
                body: JSON.stringify({
                    commentlog: {
                        requestAPI: 'addReply',
                        videoId,
                        parentCommentId,
                        replyText
                    },
                    comments,
                })
            })

            const data = await res.json()
            console.log(data)

        } catch (error) {
            console.error(error)
        }


    };

    const handleUpdateReply = async (replyId, currentText) => {
        if (!isAuthenticated) {
            onAuthRequired();
            return;
        }

        const newText = prompt('Edit your reply:', currentText);
        if (newText === null || !newText.trim()) return;

        try {
            await YouTubeApiService.updateReply(replyId, newText);
            showSnackbar('Reply updated successfully', 'success');
            loadComments();
        } catch (error) {
            if (error.message === 'Authentication required') {
                onAuthRequired();
            } else {
                showSnackbar('Error updating reply', 'error');
            }
        }



        try {
            const res = await fetch(`${api}/comment`, {
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${token}`
                },
                method: 'POST',
                body: JSON.stringify({
                    commentlog: {
                        requestAPI: 'updateReply',
                        videoId,
                        replyId,
                        currentText,
                        newText
                    },
                    comments,
                })
            })

            const data = await res.json()
            console.log(data)

        } catch (error) {
            console.error(error)
        }



    };

    const handleDeleteReply = async (replyId, currentText) => {
        if (!isAuthenticated) {
            onAuthRequired();
            return;
        }

        if (!window.confirm('Are you sure you want to delete this reply?')) return;

        try {
            await YouTubeApiService.deleteReply(replyId);
            showSnackbar('Reply deleted successfully', 'success');
            loadComments();
        } catch (error) {
            if (error.message === 'Authentication required') {
                onAuthRequired();
            } else {
                showSnackbar('Error deleting reply', 'error');
            }
        }


        try {
            const res = await fetch(`${api}/comment`, {
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${token}`
                },
                method: 'POST',
                body: JSON.stringify({
                    commentlog: {
                        requestAPI: 'deleteReply',
                        videoId,
                        replyId,
                        currentText
                    },
                    comments,
                })
            })

            const data = await res.json()
            console.log(data)

        } catch (error) {
            console.error(error)
        }


    };

    const toggleReplies = (commentId) => {
        setExpandedReplies(prev => ({
            ...prev,
            [commentId]: !prev[commentId]
        }));
    };

    const startReplying = (comment) => {
        setReplyingTo(comment);
        setReplyText('');
    };

    const cancelReply = () => {
        setReplyingTo(null);
        setReplyText('');
    };


    const startEditing = (comment) => {
        setEditingComment(comment);
        setEditText(comment.snippet.topLevelComment.snippet.textOriginal);
    };

    // const startEditingReply = (reply) => {
    //     setEditingComment(reply);
    //     // setEditText(comment.snippet.topLevelComment.snippet.textOriginal);
    //     // setEditText(comment.replies.comments);
    //     console.log('reply ',reply);
    //     // setEditText(reply.snippet.topLevelComment.snippet.textOriginal);
    //     console.log(reply.replies.comments.reply.snippet.textOriginal);

    // };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // const formatDate = (dateString) => {
    //     return new Date(dateString).toLocaleDateString();
    // };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const ReplyItem = ({ reply, parentCommentId }) => {
        const snippet = reply.snippet;

        return (
            <Box sx={{
                display: 'flex',
                gap: 2,
                p: 1.5,
                backgroundColor: 'grey.50',
                borderRadius: 2,
                mb: 1,
                position: 'relative'
            }}>
                <Avatar
                    src={snippet.authorProfileImageUrl}
                    sx={{ width: 32, height: 32 }}
                >
                    {snippet.authorDisplayName?.[0]}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                            {snippet.authorDisplayName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {formatDate(snippet.publishedAt)}
                        </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        {snippet.textOriginal}
                    </Typography>

                    {isAuthenticated && (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                size="small"
                                startIcon={<Edit />}
                                onClick={() => handleUpdateReply(reply.id, snippet.textOriginal)}
                                sx={{ minWidth: 'auto' }}
                            >
                                Edit
                            </Button>
                            <Button
                                size="small"
                                startIcon={<Delete />}
                                onClick={() => handleDeleteReply(reply.id, snippet.textOriginal)}
                                color="error"
                                sx={{ minWidth: 'auto' }}
                            >
                                Delete
                            </Button>
                        </Box>
                    )}
                </Box>
            </Box>
        );
    };

    // Similar updates for updateComment and deleteComment methods

    return (

        <>
            {/* ... JSX with authentication checks ... */}
            {!isAuthenticated && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    Login required to post, edit, or delete comments.
                </Alert>
            )}
            {/* ... rest of the component ... */}

            {/* <h3>videoTitle {JSON.stringify(description)}</h3> */}




            <Box sx={{ maxWidth: 800, margin: '0 auto', p: 2 }}>


                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <List>
                        {description?.map((desc) => {


                            return (
                                <React.Fragment >

                                    <ListItem alignItems="flex-start" sx={{ flexDirection: 'column' }}>
                                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <Box sx={{ flex: 1 }}>

                                                <Typography variant="subtitle2" fontWeight="bold">
                                                    <span style={{ color: 'blue' }}>Video Title: </span> {desc.videoTitle}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    <span style={{ color: 'blue' }}>Release Date: </span> {formatDate(desc.releasedAt)}
                                                </Typography>&nbsp;&nbsp;
                                                <Typography variant="caption" sx={{ mt: 1, mb: 1 }}>
                                                    <span style={{ color: 'blue' }}>Duration: </span>  {desc.duration.slice(2).replace("M", "M:")}
                                                </Typography>
                                            </Box>

                                        </Box>

                                    </ListItem>

                                </React.Fragment>
                            );
                        })}
                    </List>

                )}




                {/* Add Comment Section */}
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Add a Comment
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                variant="outlined"
                                placeholder="Write your comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                            <Button
                                variant="contained"
                                endIcon={<Send />}
                                onClick={handleAddComment}
                                disabled={!newComment.trim()}
                                sx={{ minWidth: 100 }}
                            >
                                Post
                            </Button>
                        </Box>
                    </CardContent>
                </Card>

                {/* Comments List */}
                <Typography variant="h6" gutterBottom>
                    Comments ({comments.length}) <br />
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    videoId: {videoId} <br /> <a href={link} target="_blank">video link</a><br />
                    {/* <span style={{ color: 'blue' }}>Video Title: </span> {description?.videoTitle}
                  <span style={{ color: 'blue' }}>Release Date: </span> {formatDate(description?.releasedAt)}
                  <span style={{ color: 'blue' }}>Duration: </span>  {description?.duration.slice(2).replace("M", "M:")} */}
                </Typography>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <List>
                        {comments.map((comment, index) => {
                            const topLevelComment = comment.snippet.topLevelComment;
                            const snippet = topLevelComment.snippet;
                            const hasReplies = comment.replies && comment.replies.comments && comment.replies.comments.length > 0;
                            const isExpanded = expandedReplies[comment.id];

                            return (
                                <React.Fragment key={comment.id}>
                                    <ListItem alignItems="flex-start" sx={{ flexDirection: 'column', px: 0 }}>
                                        {/* Main Comment */}
                                        <Box sx={{ width: '100%', display: 'flex', gap: 2 }}>
                                            <Avatar
                                                src={snippet.authorProfileImageUrl}
                                                sx={{ width: 40, height: 40 }}
                                            >
                                                {snippet.authorDisplayName?.[0]}
                                            </Avatar>
                                            <Box sx={{ flex: 1 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                                                    <Typography variant="subtitle1" fontWeight="bold">
                                                        {snippet.authorDisplayName}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {formatDate(snippet.publishedAt)}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body1" sx={{ mb: 1 }}>
                                                    {snippet.textOriginal}
                                                </Typography>

                                                {/* Comment Actions */}
                                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                    <Button
                                                        size="small"
                                                        startIcon={<ReplyIcon />}
                                                        onClick={() => startReplying(comment)}
                                                        disabled={!isAuthenticated}
                                                    >
                                                        Reply
                                                    </Button>

                                                    {isAuthenticated && (
                                                        <>
                                                            <Button
                                                                size="small"
                                                                startIcon={<Edit />}
                                                                onClick={() => startEditing(comment)}
                                                            >
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                size="small"
                                                                startIcon={<Delete />}
                                                                onClick={() => handleDeleteComment(topLevelComment.id, topLevelComment.snippet.textOriginal)}
                                                                color="error"
                                                            >
                                                                Delete
                                                            </Button>
                                                        </>
                                                    )}

                                                    {hasReplies && (
                                                        <Button
                                                            size="small"
                                                            startIcon={isExpanded ? <ExpandLess /> : <ExpandMore />}
                                                            onClick={() => toggleReplies(comment.id)}
                                                        >
                                                            {isExpanded ? 'Hide' : 'Show'} {comment.replies.comments.length} {comment.replies.comments.length === 1 ? 'reply' : 'replies'}
                                                        </Button>
                                                    )}
                                                </Box>

                                                {/* Reply Input */}
                                                {replyingTo?.id === comment.id && (
                                                    <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 2 }}>
                                                        <Typography variant="subtitle2" gutterBottom>
                                                            Replying to {snippet.authorDisplayName}
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                                                            <TextField
                                                                fullWidth
                                                                multiline
                                                                rows={2}
                                                                variant="outlined"
                                                                placeholder="Write your reply..."
                                                                value={replyText}
                                                                onChange={(e) => setReplyText(e.target.value)}
                                                                size="small"
                                                            />
                                                            <Button
                                                                variant="contained"
                                                                onClick={() => handleAddReply(topLevelComment.id)}
                                                                disabled={!replyText.trim()}
                                                                size="small"
                                                            >
                                                                Send
                                                            </Button>
                                                            <Button
                                                                variant="outlined"
                                                                onClick={cancelReply}
                                                                size="small"
                                                            >
                                                                Cancel
                                                            </Button>
                                                        </Box>
                                                    </Box>
                                                )}
                                            </Box>
                                        </Box>

                                        {/* Replies Section */}
                                        {hasReplies && (
                                            <Collapse in={isExpanded} sx={{ width: '100%', mt: 1 }}>
                                                <Box sx={{ ml: 6 }}>
                                                    <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                                                        Replies ({comment.replies.comments.length})
                                                    </Typography>
                                                    {comment.replies.comments.map((reply) => (
                                                        <ReplyItem
                                                            key={reply.id}
                                                            reply={reply}
                                                            parentCommentId={comment.id}
                                                        />
                                                    ))}
                                                </Box>
                                            </Collapse>
                                        )}
                                    </ListItem>
                                    {index < comments.length - 1 && <Divider sx={{ my: 2 }} />}
                                </React.Fragment>
                            );
                        })}
                    </List>
                )}

                {/* Edit Comment Dialog */}
                <Dialog
                    open={!!editingComment}
                    onClose={() => setEditingComment(null)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>Edit Comment</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            multiline
                            rows={4}
                            fullWidth
                            variant="outlined"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            sx={{ mt: 1 }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setEditingComment(null)}>Cancel</Button>
                        <Button
                            onClick={handleUpdateComment}
                            variant="contained"
                            disabled={!editText.trim()}
                        >
                            Update
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

        </>


    );
};



export default YouTubeCommentsD2;







{/* {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <List>
                            {comments.map((comment, index) => {
                                const topLevelComment = comment.snippet.topLevelComment;
                                const snippet = topLevelComment.snippet;

                                return (
                                    <React.Fragment key={comment.id}>
                                        <ListItem alignItems="flex-start" sx={{ flexDirection: 'column' }}>
                                            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography variant="subtitle2" fontWeight="bold">
                                                        {snippet.authorDisplayName}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {formatDate(snippet.publishedAt)}
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ mt: 1, mb: 1 }}>
                                                        {snippet.textOriginal}
                                                    </Typography>
                                                </Box>

                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => startEditing(comment)}
                                                        color="primary"
                                                    >
                                                        <Edit />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleDeleteComment(topLevelComment.id)}
                                                        color="error"
                                                    >
                                                        <Delete />
                                                    </IconButton>
                                                </Box>
                                            </Box>

                                            
                                            {comment.replies && comment.replies.comments && (
                                                <Box sx={{ ml: 3, mt: 1, width: '100%' }}>
                                                    {comment.replies.comments.map((reply) => (
                                                        <Box key={reply.id} sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                            
                                                            <Box sx={{ flex: 1 }}>
                                                                <Typography variant="subtitle2" fontWeight="bold">
                                                                    {reply.snippet.authorDisplayName}
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {formatDate(reply.snippet.publishedAt)}
                                                                </Typography>
                                                                <Typography variant="body2" sx={{ mt: 0.5 }}>
                                                                    {reply.snippet.textOriginal}
                                                                </Typography>
                                                            </Box>

                                                            <Box sx={{ display: 'flex', gap: 1 }}>

                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => startEditing(reply)}
                                                                    color="primary"
                                                                >
                                                                    <Edit />
                                                                </IconButton>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => handleDeleteComment(reply.id)}
                                                                    color="error"
                                                                >
                                                                    <Delete />
                                                                </IconButton>
                                                            </Box>

                                                        </Box>

                                                    ))}
                                                </Box>


                                            )}
                                        </ListItem>
                                        {index < comments.length - 1 && <Divider />}
                                    </React.Fragment>
                                );
                            })}
                        </List>
                    )} */}