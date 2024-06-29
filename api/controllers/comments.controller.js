import { errorHandler } from "../utils/error.js";
import Comment from "../models/comment.model.js";

export const create = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;

    if (userId !== req.user.id) {
      return next(
        errorHandler(403, "No tienes permitido crear este comentario")
      );
    }

    const newComment = new Comment({
      content,
      postId,
      userId,
    });

    await newComment.save();
    res.status(200).json(newComment);

        
  } catch (error) {
    next(error);
  }
};

export const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });

    res.status(200).json(comments);

  } catch (error) {
    next(error);
  }
};


export const likeComment = async (req,res,next) => {
  try{
      const comment = await Comment.findById(req.params.commentId);

      if(!comment){
          return next(errorHandler(404,'No se encontró el comentario'));
      }
      const userIndex = comment.likes.indexOf(req.user.id);

      if(userIndex === -1){
        comment.numberOfLikes += 1;
          comment.likes.push(req.user.id);
          
      }else{
        comment.numberOfLikes -= 1;
        comment.likes.splice(userIndex, 1);
      }
      await comment.save();
      res.status(200).json(comment);
  }catch(error) {
    next(error);
  }
}

export const editComment = async (req,res,next) => {
  try{
      const comment = await Comment.findById(req.params.commentId);
      if(!comment){
        return next(errorHandler(404,'El comentario no se encontró'))
      }
      if(comment.userId !== req.user.id && !req.user.isAdmin ){
        return next(errorHandler(403,'No tienes permitido editar este comentario'))
      }
  const  editedComment = await Comment.findByIdAndUpdate(
    req.params.commentId,
    {
      content: req.body.content,
    },
    {new:true}
  );

  res.status(200).json(editedComment)
  }catch(error)
  {
    next(error);
  }
};


export const deleteComment = async (req,res,next) => {

  try {

    const comment = await Comment.findById(req.params.commentId);
    if(!comment){
      return next(errorHandler(404,'No se encontró el comentario'))
    }

    if(comment.userId !== req.user.id && !req.user.isAdmin){
      return next(errorHandler(403,'No tienes permitido eliminar este comentario')) 
    }

      await Comment.findByIdAndDelete(req.params.commentId);
      res.status(200).json('El comentario fue eliminado')
  }catch(error){
    next(error)
  }

  
}