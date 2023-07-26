import path from 'path';
import express from 'express';
import multer from 'multer';

const router = express.Router();

const storage = multer.diskStorage({
    // this is where we want to save
    destination(req, file, cb) {
        // cb(error, filepath)=> cb stands fro callback
        cb( null, 'uploads/');
    },
    // file name format
    filename(req, file, cb) {
        // file.fieldname ? path.extname -> jpg|png|. ? file.originalname ?
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    },
     
});

 // check to be file type
function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png /;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        
    const mimetype = filetypes.test(file.mimetype);
    if(extname && mimetype) {
            return cb(null, true)
    } else {
        cb("Images only!")
    }
}

const upload = multer({
    storage
})

// single -> sigle file/image
// image is file field name
router.post('/image', upload.single('image', (req, res) => {
    res.send({
        message: "Image uploaded",
        image: `/${req.file.path}`
    })
}))

export default router;
