import express from 'express';
import { verifyToken } from '../utils/verifyUser.js'
import { create , getComments , likeComment ,editComment , deleteComment} from '../controllers/comments.controller.js';

const router = express.Router();


router.post('/create' , verifyToken , create);
router.get('/getPostsComments/:postId' , verifyToken , getComments)
router.put('/likeComment/:commentId' , verifyToken , likeComment)
router.put('/editComment/:commentId' , verifyToken , editComment)
router.delete('/deleteComment/:commentId' , verifyToken , deleteComment)
export default router;
