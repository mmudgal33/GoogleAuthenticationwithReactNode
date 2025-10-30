// services/youtubeApi.js
import axios from 'axios';
import YouTubeAuthService from './YouTubeAuthService';


import { REACT_APP_YOUTUBE_API_KEY } from '../../dataD2'

// const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
const API_KEY = REACT_APP_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

class YouTubeApiService {
  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
    });
  }

  // Helper method to make authenticated requests
  async makeAuthenticatedRequest(config) {
    try {
      const accessToken = await YouTubeAuthService.getValidAccessToken();
      
      const response = await this.client({
        ...config,
        headers: {
          ...config.headers,
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        YouTubeAuthService.clearTokens();
        throw new Error('Authentication required');
      }
      throw error;
    }
  }

  // Get comments for a video (doesn't require auth for public videos)
  async getVideoComments(videoId, maxResults = 20) {
    try {
      const response = await this.client.get('/commentThreads', {
        params: {
          part: 'snippet,replies',
          videoId: videoId,
          maxResults: maxResults,
          order: 'relevance',
          key: API_KEY,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  }

  // Add a new comment (requires auth)
  async addComment(videoId, commentText) {
    return this.makeAuthenticatedRequest({
      method: 'POST',
      url: '/commentThreads',
      params: {
        part: 'snippet',
      },
      data: {
        snippet: {
          videoId: videoId,
          topLevelComment: {
            snippet: {
              textOriginal: commentText,
            },
          },
        },
      },
    });



  }

  // Update a comment (requires auth)
  async updateComment(commentId, commentText) {
    return this.makeAuthenticatedRequest({
      method: 'PUT',
      url: '/comments',
      params: {
        part: 'snippet',
      },
      data: {
        id: commentId,
        snippet: {
          textOriginal: commentText,
        },
      },
    });
  }

  // Delete a comment (requires auth)
  async deleteComment(commentId) {
    return this.makeAuthenticatedRequest({
      method: 'DELETE',
      url: '/comments',
      params: {
        id: commentId,
      },
    });
  }


    // === REPLY MANAGEMENT METHODS ===

  // Add a reply to a comment
  async addReply(parentCommentId, replyText) {
    return this.makeAuthenticatedRequest({
      method: 'POST',
      url: '/comments',
      params: {
        part: 'snippet',
      },
      data: {
        snippet: {
          parentId: parentCommentId,
          textOriginal: replyText,
        },
      },
    });
  }

  // Update a reply
  async updateReply(replyId, replyText) {
    // Replies are updated using the same endpoint as comments
    return this.updateComment(replyId, replyText);
  }

  // Delete a reply
  async deleteReply(replyId) {
    // Replies are deleted using the same endpoint as comments
    return this.deleteComment(replyId);
  }

  // Get all replies for a comment thread
  async getCommentReplies(parentId, maxResults = 20) {
    try {
      const response = await this.client.get('/comments', {
        params: {
          part: 'snippet',
          parentId: parentId,
          maxResults: maxResults,
          key: API_KEY,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching replies:', error);
      throw error;
    }
  }



  // Get user's channel info
  async getMyChannel() {
    return this.makeAuthenticatedRequest({
      method: 'GET',
      url: '/channels',
      params: {
        part: 'snippet',
        mine: true,
      },
    });
  }







  // Get video details including description
  async getVideoDetails(videoId) {
    try {
      const response = await this.client.get('/videos', {
        params: {
          part: 'snippet,statistics,contentDetails',
          id: videoId,
          key: API_KEY,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching video details:', error);
      throw error;
    }
  }







    // Update video description
    async updateVideoDescriptionTitle(videoId,  description, title) {
      try {
        // First get the current video details to preserve other fields
        const currentVideo = await this.getVideoDetails(videoId);
        
        if (!currentVideo.items || currentVideo.items.length === 0) {
          throw new Error('Video not found');
        }
  
        const currentSnippet = currentVideo.items[0].snippet;
  
        return this.makeAuthenticatedRequest({
          method: 'PUT',
          url: '/videos',
          params: {
            part: 'snippet',
          },
          data: {
            id: videoId,
            snippet: {
              // title: currentSnippet.title,
              title: title,
              description: description,
              categoryId: currentSnippet.categoryId,
              tags: currentSnippet.tags || [],
            },
          },
        });
      } catch (error) {
        console.error('Error updating video description:', error);
        throw error;
      }
    }



    









    // Get user's uploaded videos
  async getMyVideos(maxResults = 50) {
    return this.makeAuthenticatedRequest({
      method: 'GET',
      url: '/videos',
      params: {
        part: 'snippet,statistics,contentDetails',
        myRating: 'like',
        maxResults: maxResults,
        chart: 'mostPopular', // This gets videos from the authenticated user
      },
    });
  }


    // Get videos from user's channel
    async getChannelVideos(channelId, maxResults = 50) {
      try {
        // First get the uploads playlist ID
        const channelResponse = await this.client.get('/channels', {
          params: {
            part: 'contentDetails',
            id: channelId,
            key: API_KEY,
          },
        });
  
        if (!channelResponse.data.items || channelResponse.data.items.length === 0) {
          throw new Error('Channel not found');
        }
  
        const uploadsPlaylistId = channelResponse.data.items[0].contentDetails.relatedPlaylists.uploads;
  
        // Get videos from the uploads playlist
        const playlistResponse = await this.client.get('/playlistItems', {
          params: {
            part: 'snippet',
            playlistId: uploadsPlaylistId,
            maxResults: maxResults,
            key: API_KEY,
          },
        });
  
        // Get detailed information for each video
        if (playlistResponse.data.items && playlistResponse.data.items.length > 0) {
          const videoIds = playlistResponse.data.items.map(item => item.snippet.resourceId.videoId);
          
          const videosResponse = await this.client.get('/videos', {
            params: {
              part: 'snippet,statistics',
              id: videoIds.join(','),
              key: API_KEY,
            },
          });
  
          return videosResponse.data;
        }
  
        return { items: [] };
      } catch (error) {
        console.error('Error fetching channel videos:', error);
        throw error;
      }
    }






}

export default new YouTubeApiService();