const express = require('express');
const {
  deleteUser,
  updateUser,
  getUserListing,
  getUser,
  addToFavourites,
  removeFromFavourites,
  getFavourites
} = require('../controllers/user_controller');
const { verifyToken } = require('../utils/verifyUser');

const router = express.Router();

router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);
router.get('/listing/:id', verifyToken, getUserListing);
router.get('/:id', verifyToken, getUser);



module.exports = router;
