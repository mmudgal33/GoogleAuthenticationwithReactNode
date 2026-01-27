import video_id_given from '../assets/video id given.png';
import my_uploaded_videos from '../assets/my uploaded videos.png';
import my_uploaded_videos1 from '../assets/after click video title, description, edid option available. copy video id and paste to input.png';
import my_uploaded_videos2 from '../assets/after click video title, description, edid option available. copy video id and paste to input 2.png';
import my_uploaded_videos3 from '../assets/comments of that video id, option of edit, delete, reply.png';
import my_uploaded_videos4 from '../assets/change description and title.png';
import my_uploaded_videos5 from '../assets/add comment.png';
import my_uploaded_videos6 from '../assets/update comment.png';
import my_uploaded_videos7 from '../assets/reply comment.png';
import my_uploaded_videos8 from '../assets/comment added to youtube.png';



// const flexS = {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '36px',
//     flexWrap: 'nowrap', // Change to nowrap for horizontal scroll
//     flexDirection: 'row',
//     overflowX: 'auto', // Enable horizontal scrolling
//     overflowY: 'hidden', // Hide vertical scroll
//     padding: '10px 0',
//     // Optional: Hide scrollbar for cleaner look (webkit browsers)
//     scrollbarWidth: 'none', // Firefox
//     msOverflowStyle: 'none', // IE/Edge
//   };

const flexS = {
    display: 'flex',
    flexDirection: 'column', // Stack items vertically
    gap: '36px',
    alignItems: 'center', // Centers items horizontally
    overflowY: 'auto',     // Enable vertical scrolling
    overflowX: 'hidden',   // Prevent horizontal scrolling
    maxHeight: '400px',    // IMPORTANT: A vertical scroll needs a fixed height to work
    padding: '0 10px',

    // Hide scrollbar
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    WebkitOverflowScrolling: 'touch',
};

export default function PrivacyPolicy() {

    return (
        <>
            <h2>Images shows working of this app </h2>

            <div style={flexS}>
                <p><img src={video_id_given} width="800px" height="750px" title="video_id_given" alt="image not found" /></p><hr />
                <p><img src={my_uploaded_videos} width="1000px" height="750px" title="my_uploaded_videos" alt="image not found" /></p><hr />
                <p><img src={my_uploaded_videos1} width="1000px" height="750px" title="after click video title, description, edit option available. copy video id and paste to input" alt="image not found" /></p><hr />
                <p><img src={my_uploaded_videos2} width="1000px" height="750px" title="after click video title, description, edit option available. copy video id and paste to input" alt="image not found" /></p><hr />
                <p><img src={my_uploaded_videos3} width="1000px" height="750px" title="comments of that video id, option of edit, delete, reply" alt="image not found" /></p><hr />
                <p><img src={my_uploaded_videos4} width="1000px" height="750px" title="change description and title" alt="image not found" /></p><hr />
                <p><img src={my_uploaded_videos5} width="1000px" height="750px" title="add comment" alt="image not found" /></p><hr />
                <p><img src={my_uploaded_videos6} width="1000px" height="750px" title="update comment" alt="image not found" /></p><hr />
                <p><img src={my_uploaded_videos7} width="1000px" height="750px" title="reply comment" alt="image not found" /></p><hr />
                <p><img src={my_uploaded_videos8} width="1000px" height="750px" title="comment added to youtube" alt="image not found" /></p><hr />

            </div>


            <br />
            <div>
                <h2>More information about this app present in this video</h2>
                
                <iframe
                    width="1000px" 
                    height="650px"
                    src="https://www.youtube.com/embed/NRjkLc3KpKY"
                    title="YouTube video player"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerpolicy="strict-origin-when-cross-origin"
                    allowfullscreen>
                </iframe>
            </div>

            <div style={{ backgroundColor: 'warning.light' }}>
                <h2>Privacy Policy</h2>
                <h3>YouTube API Services used as shown above </h3>
                <p>Our app uses YouTube API Services to enable video sharing
                    and playback. By using our app, you agree to be bound by the
                    <a href="https://www.youtube.com/t/terms">YouTube Terms of Service</a>
                    and <a href="https://policies.google.com/privacy">Google Privacy Policy</a>.</p>

                <p>We may access and store certain information via YouTube API,
                    including but not limited to your uploaded videos, video titles,
                    descriptions, and public comments.</p>

                <p>Users can revoke our app's access to their YouTube data via
                    Google's security settings page:
                    <a href="https://security.google.com/settings/security/permissions">
                        https://security.google.com/settings/security/permissions</a></p>

                <br /><br />
            </div>
        </>
    );
}