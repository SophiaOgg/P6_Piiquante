const Sauce = require('../models/sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {  
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new Sauce({
      ...sauceObject,
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: [],
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });

  sauce.save()
  .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
  .catch(error => { res.status(400).json( { error })})
};



exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};



exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete sauceObject._userId;

  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      if (sauce.userId != req.auth.userId) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      // Supprimer l'ancienne image si une nouvelle a été ajoutée
      if (req.file) {
        const filename = sauce.imageUrl.split('/').pop();
        fs.unlink(`images/${filename}`, err => {
          if (err) console.error(err);
        });
      }

      Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Object modifié !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};




exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})
      .then(sauce=> {
          if (sauce.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'});
          } else {
              const filename = sauce.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                  Sauce.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
};

exports.getAllSauce = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};



exports.likeSauce = (req, res) => { console.log(req.body)
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      if (req.body.like === 1 && !sauce.usersLiked.includes(req.auth.userId)) {
        if (sauce.usersDisliked.includes(req.auth.userId)) {
          Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: 1, dislikes: -1 }, $push: { usersLiked: req.auth.userId }, $pull: { usersDisliked: req.auth.userId } })
            .then(() => res.status(200).json({ message: 'Like ajouté !' }))
            .catch(error => res.status(400).json({ error }));
        } else {
          Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: 1 }, $push: { usersLiked: req.auth.userId } })
            .then(() => res.status(200).json({ message: 'Like ajouté !' }))
            .catch(error => res.status(400).json({ error }));
        }
      } else if (req.body.like === -1 && !sauce.usersDisliked.includes(req.auth.userId)) {
        if (sauce.usersLiked.includes(req.auth.userId)) {
          Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: 1, likes: -1 }, $push: { usersDisliked: req.auth.userId }, $pull: { usersLiked: req.auth.userId } })
            .then(() => res.status(200).json({ message: 'Dislike ajouté !' }))
            .catch(error => res.status(400).json({ error }));
        } else {
          Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: 1 }, $push: { usersDisliked: req.auth.userId } })
            .then(() => res.status(200).json({ message: 'Dislike ajouté !' }))
            .catch(error => res.status(400).json({ error }));
        }
      } else if (req.body.like === 0) {
        if (sauce.usersLiked.includes(req.auth.userId)) {
          Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.auth.userId }, $inc: { likes: -1 } })
            .then(() => { res.status(200).json({ message: 'Like supprimé !' }) })
            .catch(error => res.status(400).json({ error }));
        } else if (sauce.usersDisliked.includes(req.auth.userId)) {
          Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.auth.userId }, $inc: { dislikes: -1 } })
            .then(() => { res.status(200).json({ message: 'Dislike supprimé !' }) })
            .catch(error => res.status(400).json({ error }));
        } else {
          res.status(401).json({error: 'Aucune réaction de l\'utilisateur sur cette sauce'});
        }
      } else {
        res.status(400).json({error: 'Valeur de like non valide'});
      }
    })
    .catch(error => res.status(400).json({ error }));
};
