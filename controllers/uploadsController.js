const path= require('path');
const {StatusCodes}= require('http-status-codes');
const AllErrors=require('../errors');
const cloudinary= require('cloudinary').v2;

const fs=require('fs');

const uploadProductImageLocal= async (req,res)=>{
    if(!req.files){
        throw new AllErrors.BadRequestError("Kindly Upload a file")
    }
    const productImage= req.files.image;
    if(!productImage.mimetype.startsWith('image')){
        throw new AllErrors.BadRequestError("file must only be image")
    }
    const maxSize= 1024*1024
    if(productImage.size> maxSize){
        throw new AllErrors.BadRequestError("image must not be gretaer than 1MB")
    }
    const imagePath=path.join(__dirname, `../public/uploads/${productImage.name}`)
    await productImage.mv(imagePath);
    return res.status(StatusCodes.OK).json({image:{src:`/uploads/${productImage.name}`}})
};

const uploadProductImage= async (req, res)=>{
const result= await cloudinary.uploader.upload(req.files.image.tempFilePath, {
    use_filename: true,
    folder: 'file_upload',
});

// console.log(result);
fs.unlinkSync(req.files.image.tempFilePath); //avoid saving the files here on the server
return res.status(StatusCodes.OK).json({image:{src:result.secure_url}})
}

module.exports= {uploadProductImage};

