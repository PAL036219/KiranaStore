import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

 cloudinary.config({
    cloud_name: process.env.CLOURD_KEY_CLOUDING,
    api_key: process.env.CLOUDING_API_KEY,
    api_secret: process.env.API_SECRET_CODE,
});

const uploadProfileImage = async (image) => {



    try {
        const buffer =  image?.buffer || Buffer.from( await image.arrayBuffer());

        const uploadimage = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ folder : "Server"}, (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    return reject(error);
                }
                resolve(result);

            }).end(buffer);



        })
        return uploadimage;

        
    } catch (error) {
        console.error('Error uploading profile image:', error);
        throw new Error('Failed to upload profile image from utils error');
        
    }
}
export default uploadProfileImage;