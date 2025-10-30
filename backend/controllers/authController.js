const axios = require('axios');
const jwt = require('jsonwebtoken');
const { oauth2Client } = require('../utils/googleClient');
const User = require('../models/userModel');

/* GET Google Authentication API. */
exports.googleAuth = async (req, res, next) => {
    const code = req.query.code;
    console.log('code ',code);
    console.log('oauth2Client ',oauth2Client)
    try {
        const googleRes = await oauth2Client.getToken(code);
        console.log('googleRes ',googleRes);
        oauth2Client.setCredentials(googleRes.tokens);
        const userRes = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
        );
        
        const { email, name, picture } = userRes.data;
        console.log(userRes);
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                image: picture,
            });
        }
        const { _id } = user;
        const token = jwt.sign({ _id, email },
            process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_TIMEOUT,
        });
        res.status(200).json({
            message: 'success',
            token,
            user,
        });
    } 
    catch (err) {
        console.error('Error retrieving tokens:', err);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
    
};





































// const { google } = require('googleapis');
// const oauth2Client = new google.auth.OAuth2(
//     process.env.GOOGLE_CLIENT_ID,
//     process.env.GOOGLE_CLIENT_SECRET,
//     process.env.REDIRECT_URL
// );

// // Generate the authorization URL
// const scopes = ['https://www.googleapis.com/auth/userinfo.profile'];
// const url = oauth2Client.generateAuthUrl({
//   access_type: 'offline',
//   scope: scopes
// });

// // Handle the callback from Google
// exports.googleAuth = async (req, res, next) => {
// // app.get('/oauth2callback', async (req, res) => {
//   const { code } = req.query;
//   console.log('code ',code);
//   console.log('oauth2Client ',oauth2Client);
//   try {
//     const { tokens } = await oauth2Client.getToken(code);
//     oauth2Client.setCredentials(tokens);
//     // Now the client is authenticated and ready to make API calls
//     res.send('Authentication successful!');
//   } catch (error) {
//     console.error('Error retrieving tokens:', error);
//     res.status(500).send('Authentication failed');
//   }
// };

























