
// services/getDescription.js
import { YouTube } from '@mui/icons-material';
import { REACT_APP_YOUTUBE_API_KEY } from '../../dataD2'

class getDescription {
    constructor() {
        // const API_KEY = 'AIzaSyC47h3QVkJtZS8hk9StR2G7xE5_uwZvrVo';
        this.API_KEY = REACT_APP_YOUTUBE_API_KEY;
        
        this.BASE_URL = 'https://youtube.googleapis.com/youtube/v3';

        this.params = {
            part: 'contentDetails,snippet,statistics',

            fields:
                'items(id,snippet(channelTitle,channelId,title,publishedAt,thumbnails,description),contentDetails(duration),statistics(viewCount,likeCount,commentCount))',
        };

        // const VIDEO_IDS = 
        // const VIDEO_IDS = ['IHQcma93fpE', 'zR_iuq2evXo', 'Q1owo3t6CZ8'];
        this.videoId = localStorage.getItem('videoId');

        // const URL = `${BASE_URL}/videos?part=${params.part}&fields=${params.fields}&id=${videoId.join('&id=')}&key=${API_KEY}`;
        // const URL = `${this.BASE_URL}/videos?part=${this.params.part}&fields=${this.params.fields}&id=${this.videoId}&key=${this.API_KEY}`;
    }

    async fetchVideoData() {
        console.log('videoId ', this.videoId);
        try {
            // const response = await fetch(URL);
            const response = await fetch(`${this.BASE_URL}/videos?part=${this.params.part}&fields=${this.params.fields}&id=${this.videoId}&key=${this.API_KEY}`);
    
            if (!response.ok) {
                console.error(
                    `Error fetching video data:\nStatus: ${response.status}, ${response.statusText}\n\n`
                );
    
                return;
            }
    
            const data = await response.json();
    
            if (data.items.length === 0) {
                console.warn(
                    // `No video data returned for the video ID(s): ${this.videoId.join(', ')}`
                    `No video data returned for the video ID(s): ${this.videoId}`
                );
    
                return;
            }

            console.log('data ',data);
    
            return data.items.map((video) => ({
                videoTitle: video.snippet.title,
                videoId: video.id,
                duration: video.contentDetails.duration,
                releasedAt: video.snippet.publishedAt,
                description: video.snippet.description,
                thumbnails: video.snippet.thumbnails,
                channelTitle: video.snippet.channelTitle,
                channelId: video.snippet.channelId,
                viewCount: video.statistics.viewCount,
                likeCount: video.statistics.likeCount,
                commentCount: video.statistics.commentCount,
                thumbnailMaxRes: video.snippet.thumbnails.maxres,
            }));
        } catch (error) {
            console.error('Error fetching video data:', error);
    
            return;
        }
    }


    getVideoDetails(videoId){
        var result =YouTube.Videos.list('snippet,statistics,contentDetails', {id,videoId});
        var obj = {
            id:videoId,
            title:result.items[0].snippet.title,
            categoryId:result.items[0].snippet.categoryId,
            viewCount:result.items[0].snippet.viewCount
        }
        return obj;
    }



    updateDetails(videoId){
        var videoData = this.getVideoDetails(videoId);
        var resource = {
            snippet : {
                title:"add this",
                categoryId:videoData.categoryId
            },
            // id:videoId.id
            id:videoData.id
        
        };
        YouTube.Videos.update(resource,"snippet.id");
    }
}

export default new getDescription();





// channelId
// : 
// "UCB02prXAnQy08iwHgTTnJcA"
// channelTitle
// : 
// "Mohit Mudgal"
// commentCount
// : 
// "3"
// duration
// : 
// "PT1M21S"
// likeCount
// : 
// "0"
// releasedAt
// : 
// "2025-10-17T06:34:17Z"
// thumbnailMaxRes
// : 
// height
// : 
// 720
// url
// : 
// "https://i.ytimg.com/vi/XB9mzX_j7B0/maxresdefault.jpg"
// width
// : 
// 1280
// [[Prototype]]
// : 
// Object
// thumbnails
// : 
// {default: {…}, medium: {…}, high: {…}, standard: {…}, maxres: {…}}
// videoId
// : 
// "XB9mzX_j7B0"
// videoTitle
// : 
// "Rashmika Mandanna The new face of Laxmipati Sarees   Laxmipati Sarees"
// viewCount
// : 
// "6"
// [[Prototype]]
// : 
// Object
// length
// : 
// 1
// [[Prototype]]
// : 
// Array(0)


// The duration PT1M21S represents a time span of one minute and twenty-one seconds according to the ISO 8601 standard.




















