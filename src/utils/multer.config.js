const multer = require('multer');
const fs = require('fs');

let userID = '';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    userID = req.params.uid = req.params.uid || req.session?.passport?.user;

    let folder = '';
    if (file.fieldname === 'profiles') {
      folder = __dirname + '/../public/uploads/profiles/';
    } else if (file.fieldname === 'products') {
      folder = __dirname + '/../public/uploads/products/';
    } else {
      folder = __dirname + '/../public/uploads/documents/';
    }
    // Crea la carpeta de destino si no existe
    fs.mkdir(folder, { recursive: true }, function (err) {
      if (err) {
        console.log(err);
        cb(err, null);
      } else {
        cb(null, folder);
      }
    });
  },
  filename: function (req, file, cb) {
    cb(null, userID + '_' + file.originalname);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
