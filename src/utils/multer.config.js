const multer = require('multer');
const fs = require('fs');

let userID = '';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    userID = req.params.uid = req.params.uid || req.session?.passport?.user;

    let folder = '';
    switch (file.fieldname) {
      case 'profiles':
        folder = __dirname + '/../public/uploads/profiles/';
        break;
      case 'products':
        folder = __dirname + '/../public/uploads/products/';
        break;
      default:
        folder = __dirname + '/../public/uploads/documents/';
        break;
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

const upload = multer({ storage: storage }).fields([
  { name: 'profiles', maxCount: 1 },
  { name: 'products', maxCount: 1 },
  { name: 'documents', maxCount: 1 },
  { name: 'idDoc', maxCount: 1 },
  { name: 'addressDoc', maxCount: 1 },
  { name: 'accDoc', maxCount: 1 },
]);

module.exports = upload;
