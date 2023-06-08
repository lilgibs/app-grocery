const multer = require('multer');
const path = require('path');

// Multer configuration
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './src/uploads');  // path to your destination folder
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));  // Generate filename
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function(req, file, callback) { 
    var ext = path.extname(file.originalname);
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      return callback(new Error('Only images are allowed'))
    }
    callback(null, true)
  },
  limits:{
    fileSize: 1024 * 1024
  }
});

module.exports = upload;
