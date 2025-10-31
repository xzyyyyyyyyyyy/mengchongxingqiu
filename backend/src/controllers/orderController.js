const Order = require('../models/Order');
const Product = require('../models/Product');

// Generate unique order number
const generateOrderNumber = () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `MC${year}${month}${day}${random}`;
};

// @desc    Get all orders for user
// @route   GET /api/orders
// @access  Private
exports.getOrders = async (req, res, next) => {
  try {
    const { status, startDate, endDate } = req.query;

    const query = { user: req.user.id };

    if (status) {
      query.status = status;
    }

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const orders = await Order.find(query)
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name images pricing')
      .populate('user', 'username email phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: '订单不存在'
      });
    }

    // Make sure user owns order or is admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: '无权限查看此订单'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: '订单中没有商品'
      });
    }

    // Validate products and calculate pricing
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `商品不存在: ${item.product}`
        });
      }

      if (product.inventory.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `商品 ${product.name} 库存不足`
        });
      }

      const itemTotal = product.pricing.currentPrice * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0]?.url || '',
        quantity: item.quantity,
        price: product.pricing.currentPrice,
        variant: item.variant || ''
      });

      // Update product stock and sales
      product.inventory.stock -= item.quantity;
      product.salesCount += item.quantity;
      await product.save();
    }

    // Calculate shipping (free shipping for orders over 99)
    const shipping = subtotal >= 99 ? 0 : 10;
    const total = subtotal + shipping;

    // Create order
    const order = await Order.create({
      user: req.user.id,
      orderNumber: generateOrderNumber(),
      items: orderItems,
      shippingAddress,
      pricing: {
        subtotal,
        shipping,
        discount: 0,
        total
      },
      payment: {
        method: paymentMethod,
        status: 'pending'
      },
      status: 'pending',
      statusHistory: [{
        status: 'pending',
        note: '订单已创建'
      }]
    });

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order payment status
// @route   PUT /api/orders/:id/payment
// @access  Private
exports.updatePayment = async (req, res, next) => {
  try {
    const { status, transactionId } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: '订单不存在'
      });
    }

    // Make sure user owns order
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: '无权限更新此订单'
      });
    }

    order.payment.status = status;
    if (transactionId) {
      order.payment.transactionId = transactionId;
    }
    
    if (status === 'paid') {
      order.payment.paidAt = Date.now();
      order.status = 'confirmed';
      order.statusHistory.push({
        status: 'confirmed',
        note: '订单已确认，等待发货'
      });
    }

    await order.save();

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Admin)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note, trackingNumber, carrier } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: '订单不存在'
      });
    }

    order.status = status;
    order.statusHistory.push({
      status,
      note: note || ''
    });

    if (status === 'shipped' && trackingNumber) {
      order.shipping.carrier = carrier;
      order.shipping.trackingNumber = trackingNumber;
      order.shipping.shippedAt = Date.now();
    }

    if (status === 'delivered') {
      order.shipping.deliveredAt = Date.now();
    }

    await order.save();

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res, next) => {
  try {
    const { reason } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: '订单不存在'
      });
    }

    // Make sure user owns order
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: '无权限取消此订单'
      });
    }

    if (order.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: '订单已取消'
      });
    }

    if (['shipped', 'delivered'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: '订单已发货或已送达，无法取消'
      });
    }

    // Restore product stock
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.inventory.stock += item.quantity;
        product.salesCount -= item.quantity;
        await product.save();
      }
    }

    order.status = 'cancelled';
    order.cancellation = {
      reason,
      cancelledAt: Date.now()
    };
    order.statusHistory.push({
      status: 'cancelled',
      note: reason
    });

    await order.save();

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};
