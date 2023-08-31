import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderItems: [
      {
        slug: { type: String, required: true },
        productName: { type: String, required: true },
        // category:{type:String, required:true},
        quantity: { type: Number, required: true },
        img: { type: String, required: true },
        price: { type: String, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],
    checkoutData: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      contactNumber: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true },
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_addredd: String,
    },
    itemsPrice: { type: String, required: true },
    shippingPrice: { type: String, required: true },
    moisture: { type: String, required: true },
    notes: { type: String },
    totalPrice: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Üser", required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
    isSent: { type: Boolean, default: false },
    sentAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
