import { HttpError } from "../helpers/index.js";
import Contact from "../models/contact.js";

import ctrlWrapper from "../decorators/ctrlWrapper.js";

const getAllContact = async (req, res) => {
  const{_id:owner}=req.user
const {page = 1,limit = 10}=req.query
const skip = (page-1)*limit
  const result = await Contact.find({owner},"-createAt",{skip,limit}).populate("owner", "email")
  res.status(200).json( result );
};

const getContactById = async (req, res, ) => {
  const { contactId:_id } = req.params;
  const{_id:owner}=req.user

  const result = await Contact.findOne({_id, owner});
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(result );
};

const addContact = async (req, res) => {

  const{_id:owner}=req.user
  const result = await Contact.create({...req.body,owner});
  if (!result) {
    throw HttpError(400, "missing required name field");
  }
  res.status(201).json(result);
};

const removeContact = async (req, res) => {
  const { contactId:_id } = req.params;
  const{_id:owner}=req.user
  const result = await Contact.findOneAndDelete({_id,owner});
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json({"message": "contact deleted"});
};

const updateContact = async (req, res) => {
  const { contactId:_id } = req.params;
  const{_id:owner}=req.user
  const result = await Contact.findByIdAndUpdate({_id,owner}, req.body);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json( result);
};

const updateStatusContact =async (req, res) => {
  const { contactId } = req.params;

  const result = await Contact.findOneAndUpdate(contactId, req.body);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json( result);
};

export default {
  getAllContact: ctrlWrapper(getAllContact),
  getContactById: ctrlWrapper(getContactById),
  addContact: ctrlWrapper(addContact),
  removeContact: ctrlWrapper(removeContact),
  updateContact: ctrlWrapper(updateContact),
  updateStatusContact:ctrlWrapper(updateStatusContact)
};
