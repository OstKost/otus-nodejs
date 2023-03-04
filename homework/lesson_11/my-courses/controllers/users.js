import { UserModel } from '../models/UserModel.js';

export const getUsers = async (req, res) => {
  res.status(200).json(res.advancedResults);
};

export const getUser = async (req, res) => {
  const userId = req.params.id;
  const user = await UserModel.findById(userId);
  res.status(200).json({
    success: true,
    data: user,
  });
};

export const addUser = async (req, res) => {
  const user = await UserModel.create(req.body);
  res.status(201).json({
    success: true,
    data: user,
  });
};

export const updateUser = async (req, res) => {
  const userId = req.params.id;
  const user = await UserModel.findByIdAndUpdate(userId, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
};

export const deleteUser = async (req, res) => {
  const userId = req.params.id;
  await UserModel.findByIdAndDelete(userId);
  res.status(200).json({
    success: true,
    data: userId,
  });
};
