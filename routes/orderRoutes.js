import express from "express";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import { isAdmin, isAuth } from "../utils.js";
import expressAsyncHandler from "express-async-handler";
import e from "express";
import Product from "../models/productModel.js";

//placing order
const orderRouter = express.Router();
orderRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const orderItems = req.body.orderItems;

      for (let i = 0; i < orderItems.length; i++) {
        const product = await Product.findById(orderItems[i]._id);
        if (!product) {
          throw new Error("Product not found");
        } else {
          if (product.countInStock <= 0) {
            throw new Error("Product is out of stock");
          }
        }
      }

      const newOrder = new Order({
        orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })),
        checkoutData: req.body.checkoutData,
        paymentMethod: req.body.paymentMethod,
        itemsPrice: req.body.itemsPrice,
        shippingPrice: req.body.shippingPrice,
        moisture: req.body.moisture,
        totalPrice: req.body.totalPrice,
        notes: req.body.notes,
        user: req.user._id,
      });

      const order = await newOrder.save();

      for (let i = 0; i < order.orderItems.length; i++) {
        const product = await Product.findById(order.orderItems[i].product);
        if (product) {
          product.countInStock -= order.orderItems[i].quantity;
          await product.save();
        }
      }

      res.status(201).send({ message: "New Order Created", order });
    } catch (error) {
      res
        .status(500)
        .send({ message: "Error occured", message: error.message });
      next();
    }
  })
);

//Admin view of all orders
orderRouter.get(
  "/admin",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || 30;

    const orders = await Order.find()
      .sort({ paidAt: -1 })
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countOrders = await Order.countDocuments();
    res.send({
      orders,
      countOrders,
      page,
      pages: Math.ceil(countOrders / pageSize),
    });
  })
);

//get relavent order details
orderRouter.get(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({
        message: "Order Not Found",
      });
    }
  })
);

//dashboard
orderRouter.get(
  "/admin/dashboard/summary",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    //total sale summary card
    const orders = await Order.aggregate([
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);

    //total customers summary card
    const users = await User.aggregate([
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 },
        },
      },
    ]);

    //monthly orders chart
    const dailyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          orders: { $sum: 1 },
          sales: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    //daily orders summary card
    const dailySales = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%d", date: "$createdAt" } },
          orders: { $sum: 1 },
          sales: { $sum: "$totalPrice" },
        },
      },
    ]);

    //Product wise sale chart
    const productCategories = await Order.aggregate([
      {
        $group: {
          _id: "$orderItems.slug",
          count: { $sum: "$totalPrice" },
        },
      },
    ]);
    res.send({ users, orders, dailyOrders, productCategories, dailySales });
  })
);

//Admin report based on product
orderRouter.get(
  "/admin/report",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const productOrders = await Order.aggregate([
      { $unwind: "$orderItems" },
      {
        $lookup: {
          from: "products",
          localField: "orderItems._id",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $addFields: {
          productName: { $arrayElemAt: ["$product.productName", 0] },
          rating: { $arrayElemAt: ["$product.rating", 0] },
        },
      },
      {
        $group: {
          _id: "$orderItems._id",
          quantity: { $sum: "$orderItems.quantity" },
          sales: { $sum: "$totalPrice" },
          productName: { $first: "$productName" },
          rating: { $first: "$product.rating" },
        },
      },
      { $sort: { "_id.month": 1, "_id.product": 1 } },
    ]);
    res.send({ productOrders });
    console.log(productOrders);
  })
);

//customer order history
orderRouter.get(
  "/orderhistory/mine",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.send(orders);
  })
);

//is delivered
orderRouter.put(
  "/:id/deliver",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      await order.save();
      res.send({ message: "Orders Delivered" });
    } else {
      es.status(404).send({
        message: "Order Not Found",
      });
    }
  })
);

//is sent
orderRouter.put(
  "/:id/sent/check",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isSent = true;
      order.sentAt = Date.now();
      await order.save();
      res.send({ message: "Order Sent" });
    } else {
      es.status(404).send({
        message: "Order Not Found",
      });
    }
  })
);

//is paid
orderRouter.put(
  "/:id/pay",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };

      const updateOrder = await order.save();
      res.send({ message: "Order Paid", order: updateOrder });
    } else {
      res.status(404).send({
        message: "Order Not Found",
      });
    }
  })
);

//deleting an order
orderRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      await order.remove();
      res.send({ message: "Order Deleted" });
    } else {
      res.status(404).send({ message: "Order Not Found" });
    }
  })
);
export default orderRouter;
