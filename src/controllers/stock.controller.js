import mongoose from "mongoose";
import Stock from "../models/Stock.js";


export const getAllStock = async (req, res) => {
  try {
    const allStock = await Stock.find();
    res.status(200).json(allStock);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};


export const updateStockByID = async (req, res) => {
  const { id } = req.params;
  const updatedFields = req.body; // Assuming you want to update all fields

  try {
    const updatedStock = await Stock.findByIdAndUpdate(
      id,
      updatedFields,
      { new: true }
    );

    res.json(updatedStock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const updateExistenciasByID = async (req, res) => {
  const { id } = req.params;
  const { Existencias } = req.body; // Assuming you want to update the Existencias field

  try {
    

    const updatedStock = await Stock.findByIdAndUpdate(
      id,
      { Existencias },
      { new: true }
    );

    res.json(updatedStock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createNewStock = async (req, res) => {
  const stockItem = req.body;
  const newStockItem = new Stock(stockItem);
  try {
    await newStockItem.save();
    res.status(201).json(newStockItem);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};


