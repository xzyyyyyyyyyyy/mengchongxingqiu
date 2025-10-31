const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Product = require('../models/Product');
const Service = require('../models/Service');
const Post = require('../models/Post');
const Pet = require('../models/Pet');

dotenv.config();

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

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('Clearing existing data...');
    await Product.deleteMany({});
    await Service.deleteMany({});
    
    // Find or create admin user
    let adminUser = await User.findOne({ email: 'admin@mengchong.com' });
    if (!adminUser) {
      adminUser = await User.create({
        username: 'admin',
        email: 'admin@mengchong.com',
        password: 'admin123',
        role: 'admin',
        bio: '萌宠星球管理员'
      });
      console.log('Admin user created');
    }

    // Seed data
    await seedProducts(adminUser._id);
    await seedServices(adminUser._id);

    console.log('\n✅ Database seeded successfully!');
    console.log('\nAdmin login credentials:');
    console.log('Email: admin@mengchong.com');
    console.log('Password: admin123');
    
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
