//cloudinary config

import {v2 as cloudinary} from 'cloudinary';// they have a variable v2 which we're calling as cloudinary
import { config } from 'dotenv'; 

config(); //inorder to access our environment variables

cloudinary.config({//this config is diff from above
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});

export default cloudinary;