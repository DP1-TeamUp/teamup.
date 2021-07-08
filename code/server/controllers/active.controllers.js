const Active = require('../models/active.model');
const ObjectId = require('mongodb').ObjectID;

const getOnline = async (req, res) => {
  let active = new Active(req.body);
  if (!req.body.image) {
    return res.status(401).json({
      success: false,
      message: 'The required information is not given',
    });
  }
  try {
    await active.save();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Something went wrong getting the actives',
    });
  }
  res
    .status(201)
    .json({ success: true, message: 'Successfully got online', active });
};

const getOffline = async (req, res) => {
  try {
    await Active.findOneAndRemove({
      projectId: ObjectId(req.body.projectId),
      image: req.body.image,
    });
  } catch (error) {
    console.log(error);
    return res.status(504).json({
      success: false,
      message: 'Something went wrong getting finding the user',
    });
  }
  return res.status(200).json({
    success: true,
    message: 'Got offline',
  });
};

const getActives = async (req, res) => {
  let actives;
  try {
    actives = await Active.find({
      projectId: ObjectId(req.params.projectId),
    });
  } catch (error) {
    console.log(error);
    return res.status(504).json({
      success: false,
      message: 'Something went wrong getting finding the user',
    });
  }
  if (!actives) {
    return res.status(404).json({
      success: false,
      message: 'user was never active',
    });
  }
  return res.status(200).json({
    success: true,
    message: 'Retrived actives',
    actives,
  });
};

module.exports = { getOnline, getOffline, getActives };
