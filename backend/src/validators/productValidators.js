const { body } = require('express-validator');

exports.createProductValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('商品名称不能为空')
    .isLength({ min: 2, max: 100 })
    .withMessage('商品名称长度应在2-100个字符之间'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('商品描述不能为空')
    .isLength({ min: 10, max: 1000 })
    .withMessage('商品描述长度应在10-1000个字符之间'),
  
  body('category.main')
    .notEmpty()
    .withMessage('商品分类不能为空')
    .isIn(['food', 'supplies', 'health', 'grooming', 'toys', 'clothing', 'other'])
    .withMessage('无效的商品分类'),
  
  body('pricing.currentPrice')
    .notEmpty()
    .withMessage('商品价格不能为空')
    .isFloat({ min: 0 })
    .withMessage('商品价格必须大于等于0'),
  
  body('pricing.originalPrice')
    .notEmpty()
    .withMessage('商品原价不能为空')
    .isFloat({ min: 0 })
    .withMessage('商品原价必须大于等于0'),
  
  body('inventory.stock')
    .notEmpty()
    .withMessage('库存数量不能为空')
    .isInt({ min: 0 })
    .withMessage('库存数量必须大于等于0')
];

exports.updateProductValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('商品名称长度应在2-100个字符之间'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('商品描述长度应在10-1000个字符之间'),
  
  body('category.main')
    .optional()
    .isIn(['food', 'supplies', 'health', 'grooming', 'toys', 'clothing', 'other'])
    .withMessage('无效的商品分类'),
  
  body('pricing.currentPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('商品价格必须大于等于0'),
  
  body('inventory.stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('库存数量必须大于等于0')
];
