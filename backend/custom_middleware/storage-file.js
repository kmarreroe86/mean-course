const multer = require('multer');


const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if (isValid) {
      error = null;
    }
    callback(error, 'backend/images'); // Call a callback func with whether or not are errors and path to save the file, which is relative to server.js file
  },
  filename: (req, file, callback) => {
    const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
    const extension = MIME_TYPE_MAP[file.mimetype];
    const finalName = name + '-' + Date.now() + '.' + extension;
    callback(null, finalName);
  }
});


module.exports = multer({ storage: storage }).single('image');
