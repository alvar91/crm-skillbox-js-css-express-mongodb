import asyncHandler from "express-async-handler";
import Client from "../models/clientModel.js";

import { whiteListProps } from "./whiteListProps.js";
import { groupStringProps, groupContactProps } from "./groupProps.js";

const parseData = (reqBody) => {
  const parsedData = {
    contacts: [],
  };

  const bodyValues = Object.values(reqBody);

  for (const { name, value } of bodyValues) {
    if (!whiteListProps.includes(name)) continue;

    if (groupStringProps.includes(name)) {
      parsedData[name] = value;
    }

    if (groupContactProps.includes(name)) {
      parsedData.contacts.push({ type: name, value });
    }
  }

  return parsedData;
};

// @desc    Register a new client
// @route   POST /api/clients
// @access  Public
const registerClient = asyncHandler(async (req, res) => {
  const parsedData = parseData(req.body);

  // const clientExists = await Client.findById(req.params.id);

  // if (clientExists) {
  //   res.status(400);
  //   throw new Error("Client already exists");
  // }

  const client = await Client.create(parsedData);

  if (client) {
    res.status(201).json({
      _id: client._id,
      name: client.name,
      surname: client.surname,
      lastname: client.lastname,
      contacts: client.contacts,
    });
  } else {
    res.status(400);
    throw new Error("Invalid client data");
  }
});

// @desc    Get all clients by pages
// @route   GET /api/clients?pageNumber=1
// @access  Public
const getClients = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const clients = await Client.find({})
    .sort({ updatedAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  const count = await Client.countDocuments({});

  res.json({ clients, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Get all clients by keyword
// @route   GET /api/clients/find?keyword
// @access  Public
const getKeywordClients = asyncHandler(async (req, res) => {
  // const pageSize = 10;
  // const page = Number(req.query.pageNumber) || 1;

  const lowerKeyword = req.query.keyword?.toLowerCase();
  const keyword = lowerKeyword
    ? {
        $or: [
          {
            name: {
              $regex: lowerKeyword,
              $options: "i",
            },
          },
          {
            surname: {
              $regex: lowerKeyword,
              $options: "i",
            },
          },
          {
            lastname: {
              $regex: lowerKeyword,
              $options: "i",
            },
          },
        ],
      }
    : {};

  //const count = await Client.countDocuments({ ...keyword });
  const clients = await Client.find({ ...keyword });
  // .limit(pageSize)
  // .skip(pageSize * (page - 1));

  res.json({ clients });
});

// @desc    Delete client
// @route   DELETE /api/client/:id
// @access  Public
const deleteClient = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);

  if (client) {
    await client.remove();
    res.json({ message: "Client removed" });
  } else {
    res.status(404);
    throw new Error("Client not found");
  }
});

// @desc    Get client by ID
// @route   GET /api/client/:id
// @access  Public
const getClientById = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);
  if (client) {
    res.json(client);
  } else {
    res.status(404);
    throw new Error("Client not found");
  }
});

// @desc    Update client
// @route   PUT /api/client/:id
// @access  Public
const updateClient = asyncHandler(async (req, res) => {
  try {
    let client = await Client.findById(req.params.id);

    if (client) {
      const parsedData = parseData(req.body);

      await Client.findByIdAndUpdate(req.params.id, parsedData);

      const updatedClient = await Client.findById(req.params.id);
      res.json(updatedClient);
    } else {
      res.status(404);
      throw new Error("Client not found");
    }
  } catch (e) {
    console.error(e.message);
  }
});

export {
  registerClient,
  getClients,
  deleteClient,
  getClientById,
  updateClient,
  getKeywordClients,
};
