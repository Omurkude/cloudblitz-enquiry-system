import mongoose from "mongoose";
import Enquiry from "../models/Enquiry.js";
import User from "../models/User.js";

export const createEnquiry = async (req, res, next) => {
  try {
    const { customerName, email, phone, message, status, assignedTo } =
      req.body;

    let assigneeId = null;
    if (assignedTo) {
      if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
        return res.status(400).json({
          success: false,
          message: "Invalid assigned user ID",
        });
      }
      const userExists = await User.findById(assignedTo);
      if (!userExists) {
        return res.status(400).json({
          success: false,
          message: "Assigned user does not exist",
        });
      }
      assigneeId = assignedTo;
    }

    const enquiry = await Enquiry.create({
      customerName: customerName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      message: message.trim(),
      status: status || "New",
      assignedTo: assigneeId,
    });

    const populatedEnquiry = await Enquiry.findById(enquiry._id).populate(
      "assignedTo",
      "name email role",
    );

    return res.status(201).json({
      success: true,
      message: "Enquiry created successfully",
      enquiry: populatedEnquiry,
    });
  } catch (error) {
    next(error);
  }
};

export const getEnquiries = async (req, res, next) => {
  try {
    const { status, search, assignedTo } = req.query;

    const query = { isDeleted: false };

    if (status && status !== "All") {
      query.status = status;
    }

    if (assignedTo) {
      if (mongoose.Types.ObjectId.isValid(assignedTo)) {
        query.assignedTo = assignedTo;
      }
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [
        { customerName: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
      ];
    }

    const enquiries = await Enquiry.find(query)
      .populate("assignedTo", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: enquiries.length,
      enquiries,
    });
  } catch (error) {
    next(error);
  }
};

export const getEnquiryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid enquiry ID",
      });
    }

    const enquiry = await Enquiry.findOne({
      _id: id,
      isDeleted: false,
    }).populate("assignedTo", "name email role");

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    return res.status(200).json({
      success: true,
      enquiry,
    });
  } catch (error) {
    next(error);
  }
};

export const updateEnquiry = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid enquiry ID",
      });
    }

    const enquiry = await Enquiry.findOne({ _id: id, isDeleted: false });
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    const { customerName, email, phone, message, status, assignedTo } =
      req.body;

    if (customerName !== undefined) enquiry.customerName = customerName.trim();
    if (email !== undefined) enquiry.email = email.toLowerCase().trim();
    if (phone !== undefined) enquiry.phone = phone.trim();
    if (message !== undefined) enquiry.message = message.trim();
    if (status !== undefined) enquiry.status = status;

    if (assignedTo !== undefined) {
      if (assignedTo === null || assignedTo === "") {
        enquiry.assignedTo = null;
      } else {
        if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
          return res.status(400).json({
            success: false,
            message: "Invalid assigned user ID",
          });
        }
        const userExists = await User.findById(assignedTo);
        if (!userExists) {
          return res.status(400).json({
            success: false,
            message: "Assigned user does not exist",
          });
        }
        enquiry.assignedTo = assignedTo;
      }
    }

    await enquiry.save();

    const updatedEnquiry = await Enquiry.findById(enquiry._id).populate(
      "assignedTo",
      "name email role",
    );

    return res.status(200).json({
      success: true,
      message: "Enquiry updated successfully",
      enquiry: updatedEnquiry,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEnquiry = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid enquiry ID",
      });
    }

    const enquiry = await Enquiry.findOne({ _id: id, isDeleted: false });

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    // Soft delete
    enquiry.isDeleted = true;
    enquiry.deletedAt = new Date();
    await enquiry.save();

    return res.status(200).json({
      success: true,
      message: "Enquiry deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getAssignees = async (req, res, next) => {
  try {
    const users = await User.find().select("name email role").sort({ name: 1 });

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    next(error);
  }
};
