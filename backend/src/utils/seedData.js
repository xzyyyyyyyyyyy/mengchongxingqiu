const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Product = require('../models/Product');
const Service = require('../models/Service');
const Post = require('../models/Post');
const Pet = require('../models/Pet');
const Booking = require('../models/Booking');
const Feedback = require('../models/Feedback');
const HealthLog = require('../models/HealthLog');
const Order = require('../models/Order');
const Photo = require('../models/Photo');

// Load environment variables from backend root directory
dotenv.config({ path: path.join(__dirname, '../../.env') });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedProducts = async (userId) => {
  const products = [
    {
      seller: userId,
      name: '皇家猫粮 全价成猫粮 2kg',
      description: '专为成年猫设计的营养均衡猫粮，含有丰富的蛋白质和必需营养素。',
      category: { main: 'food' },
      brand: '皇家',
      images: [{ url: '/uploads/products/cat-food-1.jpg', isMain: true }],
      pricing: { originalPrice: 228, currentPrice: 188 },
      inventory: { stock: 100 },
      petTypes: ['cat'],
      ageGroups: ['adult'],
      salesCount: 1234,
      rating: { average: 4.8, count: 324 },
      isFeatured: true,
      shipping: { isFreeShipping: true }
    },
    {
      seller: userId,
      name: '宠物自动饮水机 2L大容量',
      description: '智能循环过滤饮水机，保持水质新鲜，鼓励宠物多喝水。',
      category: { main: 'supplies' },
      brand: '小佩',
      images: [{ url: '/uploads/products/water-fountain.jpg', isMain: true }],
      pricing: { originalPrice: 129, currentPrice: 89 },
      inventory: { stock: 50 },
      petTypes: ['all'],
      ageGroups: ['all'],
      salesCount: 856,
      rating: { average: 4.9, count: 567 },
      isFeatured: true,
      shipping: { isFreeShipping: true }
    },
    {
      seller: userId,
      name: '逗猫棒羽毛玩具套装',
      description: '多款羽毛玩具组合，激发猫咪狩猎天性，增加运动量。',
      category: { main: 'toys' },
      images: [{ url: '/uploads/products/cat-toys.jpg', isMain: true }],
      pricing: { originalPrice: 49.9, currentPrice: 29.9 },
      inventory: { stock: 200 },
      petTypes: ['cat'],
      ageGroups: ['all'],
      salesCount: 2341,
      rating: { average: 4.7, count: 892 },
      shipping: { isFreeShipping: false }
    },
    {
      seller: userId,
      name: '宠物除毛梳 不锈钢针梳',
      description: '专业除毛梳，有效去除浮毛和死毛，保持宠物毛发健康。',
      category: { main: 'grooming' },
      images: [{ url: '/uploads/products/brush.jpg', isMain: true }],
      pricing: { originalPrice: 59, currentPrice: 39 },
      inventory: { stock: 150 },
      petTypes: ['all'],
      ageGroups: ['all'],
      salesCount: 678,
      rating: { average: 4.6, count: 234 }
    },
    {
      seller: userId,
      name: '狗狗营养膏 120g',
      description: '富含维生素和矿物质的营养膏，帮助狗狗补充营养。',
      category: { main: 'health' },
      images: [{ url: '/uploads/products/nutrition-paste.jpg', isMain: true }],
      pricing: { originalPrice: 68, currentPrice: 45 },
      inventory: { stock: 80 },
      petTypes: ['dog'],
      ageGroups: ['all'],
      salesCount: 543,
      rating: { average: 4.8, count: 189 }
    },
    {
      seller: userId,
      name: '萌宠卫衣 春秋款',
      description: '舒适保暖的宠物卫衣，适合春秋季节穿着。',
      category: { main: 'clothing' },
      images: [{ url: '/uploads/products/pet-hoodie.jpg', isMain: true }],
      pricing: { originalPrice: 88, currentPrice: 58 },
      inventory: { stock: 60 },
      petTypes: ['all'],
      ageGroups: ['all'],
      salesCount: 432,
      rating: { average: 4.9, count: 156 }
    }
  ];

  await Product.insertMany(products);
  console.log('Products seeded successfully');
};

const seedServices = async (userId) => {
  const services = [
    {
      provider: userId,
      name: '爱宠宠物医院',
      category: 'hospital',
      description: '24小时营业的专业宠物医院，配备先进医疗设备和经验丰富的兽医团队。',
      images: ['/uploads/services/hospital-1.jpg'],
      location: {
        address: '朝阳区建国路88号',
        city: '北京',
        province: '北京',
        coordinates: [116.4, 39.9]
      },
      pricing: {
        currency: 'CNY',
        priceRange: { min: 100, max: 500 }
      },
      features: ['24小时营业', '专业医师', '设备先进'],
      rating: { average: 4.8, count: 324 },
      isVerified: true,
      isActive: true
    },
    {
      provider: userId,
      name: '萌萌宠物美容',
      category: 'grooming',
      description: '专业的宠物美容服务，提供洗澡、剪毛、造型等全方位服务。',
      images: ['/uploads/services/grooming-1.jpg'],
      location: {
        address: '海淀区中关村大街1号',
        city: '北京',
        province: '北京',
        coordinates: [116.3, 39.98]
      },
      pricing: {
        currency: 'CNY',
        priceRange: { min: 80, max: 200 }
      },
      features: ['专业美容师', '环境舒适', '价格实惠'],
      rating: { average: 4.9, count: 567 },
      isVerified: true,
      isActive: true
    },
    {
      provider: userId,
      name: '安心宠物寄养',
      category: 'boarding',
      description: '提供温馨舒适的寄养环境，配备24小时监控和专业看护。',
      images: ['/uploads/services/boarding-1.jpg'],
      location: {
        address: '东城区王府井大街100号',
        city: '北京',
        province: '北京',
        coordinates: [116.41, 39.91]
      },
      pricing: {
        currency: 'CNY',
        priceRange: { min: 50, max: 150 }
      },
      features: ['独立空间', '实时监控', '专人照顾'],
      rating: { average: 4.7, count: 189 },
      isVerified: true,
      isActive: true
    },
    {
      provider: userId,
      name: '汪星人训练营',
      category: 'training',
      description: '专业的宠物行为训练服务，帮助改善宠物行为问题。',
      images: ['/uploads/services/training-1.jpg'],
      location: {
        address: '西城区西单北大街50号',
        city: '北京',
        province: '北京',
        coordinates: [116.38, 39.92]
      },
      pricing: {
        currency: 'CNY',
        priceRange: { min: 200, max: 800 }
      },
      features: ['专业训导', '小班教学', '效果显著'],
      rating: { average: 4.6, count: 234 },
      isVerified: true,
      isActive: true
    }
  ];

  await Service.insertMany(services);
  console.log('Services seeded successfully');
};

const seedPosts = async (userId, petId) => {
  const posts = [
    {
      author: userId,
      pet: petId,
      content: '今天带着我家小猫咪去体检了，医生说一切健康！😊',
      category: 'daily',
      hashtags: ['猫咪日常', '健康检查', '新手养猫'],
      likesCount: 45,
      commentsCount: 8,
      views: 230
    },
    {
      author: userId,
      content: '分享一个超好用的宠物美食食谱，我家狗狗超爱吃！',
      category: 'food',
      hashtags: ['宠物美食', '狗狗', '食谱分享'],
      likesCount: 67,
      commentsCount: 12,
      views: 345
    },
    {
      author: userId,
      content: '第一次训练成功啦！坐下、握手都学会了 🐾',
      category: 'training',
      hashtags: ['训练技巧', '狗狗训练', '新手养狗'],
      likesCount: 89,
      commentsCount: 15,
      views: 456
    },
    {
      author: userId,
      content: '猫咪今天特别活泼，玩了一下午的逗猫棒 😺',
      category: 'funny',
      hashtags: ['萌宠日常', '猫咪', '搞笑瞬间'],
      likesCount: 123,
      commentsCount: 20,
      views: 567
    },
    {
      author: userId,
      content: '周末带狗狗去公园，遇到了好多小伙伴！',
      category: 'daily',
      hashtags: ['宠物旅行', '户外活动', '狗狗社交'],
      likesCount: 78,
      commentsCount: 10,
      views: 289
    },
    {
      author: userId,
      content: '新手养宠必看！这些事情一定要注意⚠️',
      category: 'other',
      hashtags: ['新手养宠', '养宠知识', '必看攻略'],
      likesCount: 156,
      commentsCount: 25,
      views: 789
    }
  ];

  await Post.insertMany(posts);
  console.log('Posts seeded successfully');
};

const seedHealthLogs = async (pets) => {
  const healthLogs = [];
  
  // Create health logs for each pet
  for (const pet of pets) {
    // Recent health log (today)
    healthLogs.push({
      pet: pet._id,
      date: new Date(),
      weight: pet.appearance.weight || 4.5,
      temperature: 38.5,
      diet: {
        foodAmount: 200,
        waterAmount: 150,
        appetite: 'good',
        meals: [
          { time: '08:00', food: '干粮', amount: '100g' },
          { time: '18:00', food: '罐头', amount: '100g' }
        ]
      },
      bowelMovement: {
        frequency: 2,
        consistency: 'normal',
        notes: '正常'
      },
      energy: {
        level: 'normal',
        playfulness: 8,
        notes: '活力充沛'
      },
      mood: 'happy',
      symptoms: [],
      activities: ['玩耍30分钟', '散步20分钟'],
      notes: '今天状态很好，食欲和精神都不错'
    });

    // Health log from 3 days ago
    healthLogs.push({
      pet: pet._id,
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      weight: (pet.appearance.weight || 4.5) - 0.1,
      temperature: 38.3,
      diet: {
        foodAmount: 180,
        waterAmount: 140,
        appetite: 'fair'
      },
      bowelMovement: {
        frequency: 2,
        consistency: 'normal'
      },
      energy: {
        level: 'normal',
        playfulness: 7
      },
      mood: 'normal',
      symptoms: [],
      notes: '正常日常记录'
    });

    // Health log with some concerns from 7 days ago
    healthLogs.push({
      pet: pet._id,
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      weight: (pet.appearance.weight || 4.5) - 0.2,
      temperature: 38.8,
      diet: {
        foodAmount: 150,
        waterAmount: 120,
        appetite: 'poor'
      },
      bowelMovement: {
        frequency: 1,
        consistency: 'soft',
        notes: '有点软便'
      },
      energy: {
        level: 'low',
        playfulness: 5,
        notes: '精神不太好'
      },
      mood: 'anxious',
      symptoms: ['食欲不振', '精神萎靡'],
      medications: [
        { name: '益生菌', dosage: '1包', time: '09:00', taken: true }
      ],
      notes: '食欲不太好，给了益生菌调理',
      alerts: [
        {
          type: 'attention',
          message: '食欲下降',
          suggestion: '建议关注饮食情况，必要时就医'
        }
      ]
    });
  }

  await HealthLog.insertMany(healthLogs);
  console.log('Health logs seeded successfully');
};

const seedBookings = async (users, services, pets) => {
  const bookings = [
    {
      user: users[0]._id,
      service: services[0]._id,
      pet: pets[0]._id,
      serviceType: '健康检查',
      scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      scheduledTime: '14:00',
      duration: 60,
      notes: {
        specialNeeds: '第一次体检，希望全面检查',
        petHabits: '比较怕陌生人，需要温柔对待',
        allergies: '无'
      },
      status: 'confirmed',
      payment: {
        amount: 300,
        deposit: 100,
        status: 'deposit-paid',
        method: 'wechat'
      }
    },
    {
      user: users[0]._id,
      service: services[1]._id,
      pet: pets[1]._id,
      serviceType: '美容洗澡',
      scheduledDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      scheduledTime: '10:00',
      duration: 90,
      notes: {
        specialNeeds: '需要修剪毛发',
        petHabits: '喜欢水，洗澡很乖',
        allergies: '无'
      },
      status: 'pending',
      payment: {
        amount: 150,
        status: 'unpaid'
      }
    },
    {
      user: users[1] ? users[1]._id : users[0]._id,
      service: services[2]._id,
      pet: pets[2] ? pets[2]._id : pets[0]._id,
      serviceType: '宠物寄养',
      scheduledDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      scheduledTime: '09:00',
      duration: 4320, // 3 days
      notes: {
        specialNeeds: '需要喂特定的猫粮',
        petHabits: '比较安静，喜欢独处',
        allergies: '无'
      },
      status: 'confirmed',
      payment: {
        amount: 450,
        deposit: 150,
        status: 'deposit-paid',
        method: 'alipay'
      }
    },
    {
      user: users[0]._id,
      service: services[1]._id,
      pet: pets[0]._id,
      serviceType: '美容造型',
      scheduledDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      scheduledTime: '15:00',
      duration: 120,
      status: 'completed',
      payment: {
        amount: 200,
        status: 'paid',
        method: 'wechat',
        paidAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      progress: [
        {
          status: '已到店',
          description: '宠物已到达门店',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 1000)
        },
        {
          status: '服务中',
          description: '正在进行美容服务',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 60000)
        },
        {
          status: '已完成',
          description: '服务已完成，宠物状态良好',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 7200000)
        }
      ],
      rating: {
        score: 5,
        comment: '服务非常好，美容师很专业，我家猫咪很喜欢！',
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
      }
    },
    {
      user: users[0]._id,
      service: services[3]._id,
      pet: pets[1]._id,
      serviceType: '基础训练',
      scheduledDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      scheduledTime: '10:00',
      duration: 180,
      status: 'cancelled',
      payment: {
        amount: 400,
        status: 'refunded',
        method: 'alipay'
      },
      cancellation: {
        reason: '临时有事，无法参加',
        cancelledBy: 'user',
        cancelledAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000)
      }
    }
  ];

  await Booking.insertMany(bookings);
  console.log('Bookings seeded successfully');
};

const seedOrders = async (users, products) => {
  const orders = [
    {
      user: users[0]._id,
      orderNumber: 'ORD' + Date.now() + '001',
      items: [
        {
          product: products[0]._id,
          name: products[0].name,
          image: products[0].images[0].url,
          quantity: 2,
          price: products[0].pricing.currentPrice
        },
        {
          product: products[2]._id,
          name: products[2].name,
          image: products[2].images[0].url,
          quantity: 1,
          price: products[2].pricing.currentPrice
        }
      ],
      shippingAddress: {
        recipient: '张三',
        phone: '13800138000',
        province: '北京',
        city: '北京',
        district: '朝阳区',
        address: '建国路88号',
        postalCode: '100000'
      },
      pricing: {
        subtotal: products[0].pricing.currentPrice * 2 + products[2].pricing.currentPrice,
        shipping: 0,
        discount: 20,
        total: products[0].pricing.currentPrice * 2 + products[2].pricing.currentPrice - 20
      },
      payment: {
        method: 'alipay',
        status: 'paid',
        transactionId: 'TXN' + Date.now(),
        paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      status: 'shipped',
      shipping: {
        carrier: '顺丰速运',
        trackingNumber: 'SF' + Date.now(),
        shippedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        estimatedDelivery: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
      },
      statusHistory: [
        {
          status: 'pending',
          note: '订单已创建',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        },
        {
          status: 'confirmed',
          note: '订单已确认',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        },
        {
          status: 'processing',
          note: '商品配货中',
          timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000)
        },
        {
          status: 'shipped',
          note: '订单已发货',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        }
      ]
    },
    {
      user: users[0]._id,
      orderNumber: 'ORD' + Date.now() + '002',
      items: [
        {
          product: products[1]._id,
          name: products[1].name,
          image: products[1].images[0].url,
          quantity: 1,
          price: products[1].pricing.currentPrice
        }
      ],
      shippingAddress: {
        recipient: '张三',
        phone: '13800138000',
        province: '北京',
        city: '北京',
        district: '朝阳区',
        address: '建国路88号',
        postalCode: '100000'
      },
      pricing: {
        subtotal: products[1].pricing.currentPrice,
        shipping: 0,
        discount: 0,
        total: products[1].pricing.currentPrice
      },
      payment: {
        method: 'wechat',
        status: 'paid',
        transactionId: 'TXN' + (Date.now() + 1),
        paidAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      status: 'delivered',
      shipping: {
        carrier: '中通快递',
        trackingNumber: 'ZTO' + Date.now(),
        shippedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        estimatedDelivery: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        deliveredAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
      },
      statusHistory: [
        {
          status: 'pending',
          note: '订单已创建',
          timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
        },
        {
          status: 'confirmed',
          note: '订单已确认',
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        },
        {
          status: 'shipped',
          note: '订单已发货',
          timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
        },
        {
          status: 'delivered',
          note: '订单已送达',
          timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
        }
      ],
      review: {
        hasReviewed: true,
        reviewedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      }
    },
    {
      user: users[1] ? users[1]._id : users[0]._id,
      orderNumber: 'ORD' + Date.now() + '003',
      items: [
        {
          product: products[3]._id,
          name: products[3].name,
          image: products[3].images[0].url,
          quantity: 3,
          price: products[3].pricing.currentPrice
        }
      ],
      shippingAddress: {
        recipient: '李四',
        phone: '13900139000',
        province: '上海',
        city: '上海',
        district: '浦东新区',
        address: '世纪大道1号',
        postalCode: '200000'
      },
      pricing: {
        subtotal: products[3].pricing.currentPrice * 3,
        shipping: 10,
        discount: 0,
        total: products[3].pricing.currentPrice * 3 + 10
      },
      payment: {
        method: 'alipay',
        status: 'pending',
        transactionId: 'TXN' + (Date.now() + 2)
      },
      status: 'pending',
      statusHistory: [
        {
          status: 'pending',
          note: '订单已创建，等待付款',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000)
        }
      ]
    }
  ];

  await Order.insertMany(orders);
  console.log('Orders seeded successfully');
};

const seedPhotos = async (users, pets) => {
  const photos = [
    {
      owner: users[0]._id,
      pet: pets[0]._id,
      url: '/uploads/photos/cat-photo1.jpg',
      thumbnail: '/uploads/photos/cat-photo1-thumb.jpg',
      caption: '小橘第一次晒太阳 🌞',
      aiAnalysis: {
        tags: [
          { name: '猫咪', confidence: 0.98 },
          { name: '橘猫', confidence: 0.95 },
          { name: '室内', confidence: 0.88 }
        ],
        scene: '室内阳光',
        behavior: '休息放松',
        emotion: '愉悦',
        quality: {
          score: 92,
          isWellComposed: true,
          isGoodExpression: true
        }
      },
      milestones: ['first_walk'],
      albumCategory: 'milestone',
      takenAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      isPrivate: false,
      isFeatured: true
    },
    {
      owner: users[0]._id,
      pet: pets[0]._id,
      url: '/uploads/photos/cat-photo2.jpg',
      thumbnail: '/uploads/photos/cat-photo2-thumb.jpg',
      caption: '今天心情很好呢',
      aiAnalysis: {
        tags: [
          { name: '猫咪', confidence: 0.97 },
          { name: '玩耍', confidence: 0.92 }
        ],
        scene: '客厅',
        behavior: '玩耍',
        emotion: '兴奋',
        quality: {
          score: 85,
          isWellComposed: true,
          isGoodExpression: true
        }
      },
      albumCategory: 'daily',
      takenAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      isPrivate: false
    },
    {
      owner: users[0]._id,
      pet: pets[1]._id,
      url: '/uploads/photos/dog-photo1.jpg',
      thumbnail: '/uploads/photos/dog-photo1-thumb.jpg',
      caption: '旺财的生日派对 🎂',
      aiAnalysis: {
        tags: [
          { name: '狗', confidence: 0.99 },
          { name: '金毛', confidence: 0.96 },
          { name: '派对', confidence: 0.89 }
        ],
        scene: '室内派对',
        behavior: '兴奋',
        emotion: '快乐',
        quality: {
          score: 95,
          isWellComposed: true,
          isGoodExpression: true
        }
      },
      milestones: ['birthday'],
      albumCategory: 'special',
      storyTimeline: {
        chapter: '成长的时光',
        order: 1,
        storyText: '旺财的第三个生日，充满欢乐和惊喜'
      },
      takenAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      isPrivate: false,
      isFeatured: true
    },
    {
      owner: users[1] ? users[1]._id : users[0]._id,
      pet: pets[2] ? pets[2]._id : pets[0]._id,
      url: '/uploads/photos/cat-photo3.jpg',
      thumbnail: '/uploads/photos/cat-photo3-thumb.jpg',
      caption: '慵懒的下午时光',
      aiAnalysis: {
        tags: [
          { name: '猫咪', confidence: 0.98 },
          { name: '休息', confidence: 0.94 }
        ],
        scene: '沙发',
        behavior: '休息',
        emotion: '平静',
        quality: {
          score: 88,
          isWellComposed: true,
          isGoodExpression: false
        }
      },
      albumCategory: 'daily',
      takenAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      isPrivate: false
    },
    {
      owner: users[0]._id,
      pet: pets[1]._id,
      url: '/uploads/photos/dog-photo2.jpg',
      thumbnail: '/uploads/photos/dog-photo2-thumb.jpg',
      caption: '公园里遇到了好朋友',
      aiAnalysis: {
        tags: [
          { name: '狗', confidence: 0.98 },
          { name: '户外', confidence: 0.91 },
          { name: '社交', confidence: 0.87 }
        ],
        scene: '公园',
        behavior: '社交玩耍',
        emotion: '兴奋',
        quality: {
          score: 90,
          isWellComposed: true,
          isGoodExpression: true
        }
      },
      albumCategory: 'weekly',
      takenAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      isPrivate: false
    }
  ];

  await Photo.insertMany(photos);
  console.log('Photos seeded successfully');
};

const seedFeedback = async (users) => {
  const feedback = [
    {
      user: users[0]._id,
      type: 'suggestion',
      content: '希望能添加宠物社交功能，让附近的宠物主人可以互相认识和交流',
      contact: 'admin@mengchong.com',
      status: 'processing',
      response: '感谢您的建议，我们已经在开发宠物社交功能，预计下个版本发布'
    },
    {
      user: users[1] ? users[1]._id : users[0]._id,
      type: 'bug',
      content: '在订单页面点击"查看详情"时偶尔会出现加载失败的情况',
      contact: 'catprince@example.com',
      status: 'resolved',
      response: '该问题已修复，感谢您的反馈'
    },
    {
      user: users[2] ? users[2]._id : users[0]._id,
      type: 'question',
      content: '请问如何修改宠物的健康记录？找不到编辑按钮',
      contact: 'doglover@example.com',
      status: 'resolved',
      response: '在宠物详情页面，点击健康记录卡片即可进入编辑模式'
    },
    {
      user: users[0]._id,
      type: 'suggestion',
      content: '建议增加宠物成长相册功能，可以记录宠物的成长轨迹',
      contact: '',
      status: 'pending'
    },
    {
      user: users[3] ? users[3]._id : users[0]._id,
      type: 'bug',
      content: '上传照片时如果选择的图片太大，会导致上传失败但没有提示',
      contact: 'photographer@example.com',
      status: 'processing',
      response: '我们正在优化上传功能，会添加文件大小检查和友好的错误提示'
    },
    {
      user: users[1] ? users[1]._id : users[0]._id,
      type: 'other',
      content: '平台做得很棒！希望能继续保持更新和优化',
      status: 'closed',
      response: '感谢您的支持和鼓励！'
    }
  ];

  await Feedback.insertMany(feedback);
  console.log('Feedback seeded successfully');
};

const seedUsers = async () => {
  const users = [
    {
      username: 'admin',
      email: 'admin@mengchong.com',
      password: 'admin123',
      role: 'admin',
      bio: '萌宠星球管理员',
      avatar: '/uploads/avatars/admin.jpg',
      location: {
        city: '北京',
        province: '北京'
      },
      points: 5000
    },
    {
      username: '猫咪小王子',
      email: 'catprince@example.com',
      password: 'user123',
      role: 'user',
      bio: '资深铲屎官，养猫10年经验',
      avatar: '/uploads/avatars/user1.jpg',
      location: {
        city: '上海',
        province: '上海'
      },
      points: 1200
    },
    {
      username: '狗狗达人',
      email: 'doglover@example.com',
      password: 'user123',
      role: 'user',
      bio: '专注狗狗训练和营养',
      avatar: '/uploads/avatars/user2.jpg',
      location: {
        city: '广州',
        province: '广东'
      },
      points: 850
    },
    {
      username: '萌宠摄影师',
      email: 'photographer@example.com',
      password: 'user123',
      role: 'user',
      bio: '记录每一个温馨瞬间📷',
      avatar: '/uploads/avatars/user3.jpg',
      location: {
        city: '深圳',
        province: '广东'
      },
      points: 640
    }
  ];

  const createdUsers = await User.insertMany(users);
  console.log('Users seeded successfully');
  return createdUsers;
};

const seedPets = async (userId, otherUsers = []) => {
  const pets = [
    {
      owner: userId,
      name: '小橘',
      species: 'cat',
      breed: '橘猫',
      gender: 'male',
      birthDate: new Date('2022-03-15'),
      avatar: '/uploads/pets/cat1.jpg',
      appearance: {
        color: '橘色',
        weight: 4.5
      },
      personality: {
        temperament: '活泼好动',
        traits: ['粘人', '爱玩', '食欲好'],
        energy: 'high'
      },
      habits: {
        diet: {
          foodType: '干粮+湿粮',
          feedingSchedule: ['08:00', '18:00'],
          allergies: [],
          favorites: ['三文鱼罐头', '鸡肉条']
        }
      },
      health: {
        vaccinations: [
          {
            name: '狂犬疫苗',
            date: new Date('2023-03-15'),
            nextDue: new Date('2024-03-15')
          }
        ]
      }
    },
    {
      owner: userId,
      name: '旺财',
      species: 'dog',
      breed: '金毛',
      gender: 'male',
      birthDate: new Date('2021-06-20'),
      avatar: '/uploads/pets/dog1.jpg',
      appearance: {
        color: '金黄色',
        weight: 28
      },
      personality: {
        temperament: '温顺友好',
        traits: ['聪明', '听话', '忠诚'],
        energy: 'high'
      },
      habits: {
        diet: {
          foodType: '狗粮',
          feedingSchedule: ['07:00', '19:00'],
          allergies: ['鸡肉'],
          favorites: ['牛肉', '胡萝卜']
        }
      },
      health: {
        vaccinations: [
          {
            name: '六联疫苗',
            date: new Date('2023-06-20'),
            nextDue: new Date('2024-06-20')
          }
        ]
      }
    }
  ];

  // Add pets for other users
  if (otherUsers.length > 0) {
    pets.push({
      owner: otherUsers[0]._id,
      name: '咪咪',
      species: 'cat',
      breed: '英国短毛猫',
      gender: 'female',
      birthDate: new Date('2023-01-10'),
      avatar: '/uploads/pets/cat2.jpg',
      appearance: {
        color: '蓝灰色',
        weight: 3.8
      },
      personality: {
        temperament: '安静温顺',
        traits: ['独立', '优雅', '慵懒'],
        energy: 'low'
      }
    });

    if (otherUsers.length > 1) {
      pets.push({
        owner: otherUsers[1]._id,
        name: '豆豆',
        species: 'dog',
        breed: '柯基',
        gender: 'male',
        birthDate: new Date('2022-08-15'),
        avatar: '/uploads/pets/dog2.jpg',
        appearance: {
          color: '棕白相间',
          weight: 12
        },
        personality: {
          temperament: '活泼可爱',
          traits: ['好奇', '精力充沛', '爱社交'],
          energy: 'high'
        }
      });
    }
  }

  const createdPets = await Pet.insertMany(pets);
  console.log('Pets seeded successfully');
  return createdPets;
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Service.deleteMany({});
    await Post.deleteMany({});
    await Pet.deleteMany({});
    await Booking.deleteMany({});
    await Feedback.deleteMany({});
    await HealthLog.deleteMany({});
    await Order.deleteMany({});
    await Photo.deleteMany({});
    
    console.log('Creating seed data...\n');
    
    // Create users (including admin)
    const users = await seedUsers();
    const adminUser = users[0]; // First user is admin
    const regularUsers = users.slice(1); // Rest are regular users
    
    console.log(`✓ Created ${users.length} users`);
    
    // Create pets for users
    const pets = await seedPets(adminUser._id, regularUsers);
    console.log(`✓ Created ${pets.length} pets`);
    
    // Create products
    await seedProducts(adminUser._id);
    const products = await Product.find();
    console.log(`✓ Created ${products.length} products`);
    
    // Create services
    await seedServices(adminUser._id);
    const services = await Service.find();
    console.log(`✓ Created ${services.length} services`);
    
    // Create posts
    if (pets && pets.length > 0) {
      await seedPosts(adminUser._id, pets[0]._id);
      const posts = await Post.find();
      console.log(`✓ Created ${posts.length} posts`);
    }
    
    // Create health logs
    await seedHealthLogs(pets);
    const healthLogs = await HealthLog.find();
    console.log(`✓ Created ${healthLogs.length} health logs`);
    
    // Create bookings
    await seedBookings(users, services, pets);
    const bookings = await Booking.find();
    console.log(`✓ Created ${bookings.length} bookings`);
    
    // Create orders
    await seedOrders(users, products);
    const orders = await Order.find();
    console.log(`✓ Created ${orders.length} orders`);
    
    // Create photos
    await seedPhotos(users, pets);
    const photos = await Photo.find();
    console.log(`✓ Created ${photos.length} photos`);
    
    // Create feedback
    await seedFeedback(users);
    const feedbacks = await Feedback.find();
    console.log(`✓ Created ${feedbacks.length} feedback entries`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n='.repeat(50));
    console.log('📊 SEED DATA SUMMARY');
    console.log('='.repeat(50));
    console.log(`👥 Users: ${users.length}`);
    console.log(`🐾 Pets: ${pets.length}`);
    console.log(`📦 Products: ${products.length}`);
    console.log(`🏥 Services: ${services.length}`);
    console.log(`📝 Posts: ${(await Post.find()).length}`);
    console.log(`💊 Health Logs: ${healthLogs.length}`);
    console.log(`📅 Bookings: ${bookings.length}`);
    console.log(`🛒 Orders: ${orders.length}`);
    console.log(`📸 Photos: ${photos.length}`);
    console.log(`💬 Feedback: ${feedbacks.length}`);
    console.log('='.repeat(50));
    console.log('\n🔑 LOGIN CREDENTIALS');
    console.log('='.repeat(50));
    console.log('Admin Account:');
    console.log('  Email: admin@mengchong.com');
    console.log('  Password: admin123');
    console.log('\nRegular User Accounts:');
    console.log('  Email: catprince@example.com');
    console.log('  Password: user123');
    console.log('  ---');
    console.log('  Email: doglover@example.com');
    console.log('  Password: user123');
    console.log('  ---');
    console.log('  Email: photographer@example.com');
    console.log('  Password: user123');
    console.log('='.repeat(50));
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed if called directly
if (require.main === module) {
  seedData();
}

module.exports = seedData;
