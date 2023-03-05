const Category = require('../models/Category')
const { mapCategory } = require('../mappers/category')


module.exports.categoryList = async function categoryList(ctx, next) {
  const allCategories = await Category.find({})

  ctx.body = { allCategories: allCategories.map(mapCategory) }
};
