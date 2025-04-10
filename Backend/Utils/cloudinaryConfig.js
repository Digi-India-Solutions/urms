const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'de9eigd4s',
    api_key: '673691544911287',
    api_secret: '9wIHOifcC2cNo4StcbQuCPs_Rgs',
});

const uploadImage = async (file) => {
    try {
        const ImageUrl = await cloudinary.uploader.upload(file)
        return ImageUrl.secure_url
    } catch (error) {
        console.log(error)
    }
}


const deleteImage = async (file) => {
    try {
        await cloudinary.uploader.destroy(file)
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    uploadImage, deleteImage
}