/* eslint-disable max-lines */
const async = require('async');
const mongoClient = require('mongodb').MongoClient;
const { env, url } = require('../../config');

const connect = (next) => {
  mongoClient.connect(url, (err, client) => {
    console.log('Connected successfully to server');
    next(err, client, client.db(env).collection('recipes'));
  });
};

const selectAllRecipes = (client, collection, next) => {
  collection.find({}).toArray((err, items) => {
    client.close(() => next(err, items));
  });
};

const selectRecipeById = (client, collection, id, next) => {
  collection.findOne({ id }, (err, item) => {
    client.close(() => next(err, item));
  });
};

const selectRecipesByIds = (client, collection, ids, next) => {
  collection.find({ id: { $in: ids } }).toArray((err, item) => {
    console.log({ item });
    client.close(() => next(err, item));
  });
};

const filterRecipeIds = (client, collection, ids, next) => {
  collection.find(
    { id: { $in: ids } },
    { projection: { id: 1, _id: 0 } },
  ).toArray(
    (err, items) => client.close(() => next(err, items.map(item => item.id))),
  );
};

module.exports.selectRecipeById = (id, callback) => {
  async.waterfall([
    connect,
    (client, collection, next) => selectRecipeById(client, collection, parseInt(id, 10), next),
  ], callback);
};

module.exports.selectRecipesByIds = (ids, callback) => {
  async.waterfall([
    connect,
    ids.length === 0
      ? selectAllRecipes
      : (client, collection, next) => selectRecipesByIds(client, collection, ids, next),
  ], callback);
};

module.exports.filterRecipeIds = (ids, callback) => {
  async.waterfall([
    connect,
    (client, collection, next) => filterRecipeIds(client, collection, ids, next),
  ], callback);
};

const searchRecipesCollection = (client, collection, query, next) => {
  collection.find(query).toArray((err, items) => {
    client.close(() => next(err, items));
  });
};

const dropRecipeTable = (client, collection, next) => {
  collection.drop(() => client.close(next));
};

module.exports.clean = (callback) => {
  async.waterfall([
    connect, dropRecipeTable,
  ], callback);
};

const createSearchIndex = (client, collection, next) => {
  collection.createIndex({
    '$**': 'text',
  }, next);
};

module.exports.search = (query, callback) => {
  async.waterfall([
    connect, (client, collection, next) => searchRecipesCollection(client, collection, query, next),
  ], callback);
};

/* eslint-disable sort-keys */
module.exports.setup = (callback) => {
  console.log('setting up recipes');
  async.waterfall([
    connect,
    function tempInsert(client, collection, next) {
      collection.insertMany([{
        title: "Deb's Spicy Summer Evening Mushrooms",
        nutrition: {
          calories: {
            name: 'Calories', amount: 67.67107, unit: 'kcal', displayValue: '68', dailyValue: '68', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 0.4163184, unit: 'g', displayValue: '0.4', dailyValue: '0.4', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 0.0, unit: 'mg', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 3615.615, unit: 'mg', displayValue: '3616', dailyValue: '3616', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 10.78141, unit: 'g', displayValue: '10.8', dailyValue: '10.8', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 7.538084, unit: 'g', displayValue: '7.5', dailyValue: '7.5', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 27.13009, unit: 'mcg', displayValue: '27', dailyValue: '27', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 37.90461, unit: 'mg', displayValue: '38', dailyValue: '38', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.213526, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 7.063933, unit: 'mg', displayValue: '7', dailyValue: '7', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.1247343, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 1.825728, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 15.89408, unit: 'mg', displayValue: '16', dailyValue: '16', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 2.413144, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 5.977219, unit: 'IU', displayValue: '6', dailyValue: '6', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 2.961628, unit: 'g', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 533.2303, unit: 'mg', displayValue: '533', dailyValue: '533', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 0.05302178, unit: 'g', displayValue: '0.1', dailyValue: '0.1', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 3.746865, unit: 'kcal', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 1.666506, unit: 'g', displayValue: '1.7', dailyValue: '1.7', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 2882, displayValue: '2 cups soy sauce', grams: 512.0, displayType: 'Normal',
        },
        {
          ingredientID: 18888, displayValue: '1 cup red wine vinegar', grams: 257.14285, displayType: 'Normal',
        },
        {
          ingredientID: 16406, displayValue: '1/4 teaspoon ground black pepper', grams: 0.525, displayType: 'Normal',
        },
        {
          ingredientID: 5593, displayValue: '3 drops hot pepper sauce', grams: 2.82, displayType: 'Normal',
        },
        {
          ingredientID: 4378, displayValue: '2 pounds whole fresh mushrooms', grams: 908.0, displayType: 'Normal',
        }],
        servings: 8,
        prepMinutes: 5,
        cookMinutes: 10,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/1017962.jpg',
        id: 25449,
      },
      {
        title: 'Loaded Queso Fundido',
        nutrition: {
          calories: {
            name: 'Calories', amount: 718.8193, unit: 'kcal', displayValue: '719', dailyValue: '719', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 56.3928, unit: 'g', displayValue: '56.4', dailyValue: '56.4', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 174.855, unit: 'mg', displayValue: '175', dailyValue: '175', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 2284.446, unit: 'mg', displayValue: '2284', dailyValue: '2284', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 7.352343, unit: 'g', displayValue: '7.4', dailyValue: '7.4', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 46.05419, unit: 'g', displayValue: '46.1', dailyValue: '46.1', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 33.32487, unit: 'mcg', displayValue: '33', dailyValue: '33', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 58.903, unit: 'mg', displayValue: '59', dailyValue: '59', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.4549378, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 15.68183, unit: 'mg', displayValue: '16', dailyValue: '16', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.2627932, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 1.391849, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 847.6423, unit: 'mg', displayValue: '848', dailyValue: '848', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 8.856376, unit: 'mg', displayValue: '9', dailyValue: '9', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 1753.224, unit: 'IU', displayValue: '1753', dailyValue: '1753', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 3.208681, unit: 'g', displayValue: '3.2', dailyValue: '3.2', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 602.7574, unit: 'mg', displayValue: '603', dailyValue: '603', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 32.09063, unit: 'g', displayValue: '32.1', dailyValue: '32.1', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 507.5352, unit: 'kcal', displayValue: '508', dailyValue: '508', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 1.232927, unit: 'g', displayValue: '1.2', dailyValue: '1.2', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 16133, displayValue: '1 cup chicken broth', grams: 198.0, displayType: 'Normal',
        },
        {
          ingredientID: 16248, displayValue: '2 pounds shredded American cheese', grams: 908.0, displayType: 'Normal',
        },
        {
          ingredientID: 6307, displayValue: '1 tablespoon olive oil', grams: 13.5, displayType: 'Normal',
        },
        {
          ingredientID: 6494, displayValue: '2 skinless, boneless chicken breast halves - cut into cubes', grams: 236.0, displayType: 'Normal',
        },
        {
          ingredientID: 5821, displayValue: '3 links Mexican chorizo, casing removed and meat crumbled', grams: 180.0, displayType: 'Normal',
        },
        {
          ingredientID: 4378, displayValue: '1 (10 ounce) package sliced button mushrooms', grams: 280.0, displayType: 'Normal',
        },
        {
          ingredientID: 4572, displayValue: '2 tomatoes, seeded and diced', grams: 296.0, displayType: 'Normal',
        },
        {
          ingredientID: 4397, displayValue: '1/2 yellow onion, diced', grams: 113.5, displayType: 'Normal',
        },
        {
          ingredientID: 3725, displayValue: '2 jalapenos, seeded and diced', grams: 28.0, displayType: 'Normal',
        },
        {
          ingredientID: 4405, displayValue: '2 green onions, diced', grams: 30.0, displayType: 'Normal',
        },
        {
          ingredientID: 4342, displayValue: '1 clove garlic, or to taste, minced', grams: 3.0, displayType: 'Normal',
        },
        {
          ingredientID: 16215, displayValue: '8 ounces shredded Cheddar cheese', grams: 226.8, displayType: 'Normal',
        }],
        servings: 8,
        prepMinutes: 15,
        cookMinutes: 20,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/1810432.jpg',
        id: 237491,
      },
      {
        title: 'Bacon Jalapeno Popper Puffs',
        nutrition: {
          calories: {
            name: 'Calories', amount: 290.6031, unit: 'kcal', displayValue: '291', dailyValue: '291', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 25.08788, unit: 'g', displayValue: '25.1', dailyValue: '25.1', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 98.26211, unit: 'mg', displayValue: '98', dailyValue: '98', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 488.2495, unit: 'mg', displayValue: '488', dailyValue: '488', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 9.436511, unit: 'g', displayValue: '9.4', dailyValue: '9.4', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 7.643674, unit: 'g', displayValue: '7.6', dailyValue: '7.6', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 32.07149, unit: 'mcg', displayValue: '32', dailyValue: '32', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 10.16132, unit: 'mg', displayValue: '10', dailyValue: '10', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.08159002, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 2.223676, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.1354421, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 1.10212, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 75.60432, unit: 'mg', displayValue: '76', dailyValue: '76', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 3.011412, unit: 'mg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 536.8799, unit: 'IU', displayValue: '537', dailyValue: '537', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.6436284, unit: 'g', displayValue: '0.6', dailyValue: '0.6', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 98.79222, unit: 'mg', displayValue: '99', dailyValue: '99', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 11.62264, unit: 'g', displayValue: '11.6', dailyValue: '11.6', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 225.791, unit: 'kcal', displayValue: '226', dailyValue: '226', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.51118, unit: 'g', displayValue: '0.5', dailyValue: '0.5', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 5375, displayValue: '4 strips bacon', grams: 113.6, displayType: 'Normal',
        },
        {
          ingredientID: 0, displayValue: 'Dipping Sauce:', grams: 0.0, displayType: 'Heading',
        },
        {
          ingredientID: 16223, displayValue: '1/2 cup cream cheese, softened', grams: 116.0, displayType: 'Normal',
        },
        {
          ingredientID: 20573, displayValue: '1/4 cup creme fraiche or sour cream', grams: 57.0, displayType: 'Normal',
        },
        {
          ingredientID: 4405, displayValue: '2 tablespoons minced green onions, plus some for garnish', grams: 12.0, displayType: 'Normal',
        },
        {
          ingredientID: 5112, displayValue: '1 teaspoon fresh lime juice', grams: 5.125, displayType: 'Normal',
        },
        {
          ingredientID: 0, displayValue: '', grams: 0.0, displayType: 'BlankLine',
        },
        {
          ingredientID: 0, displayValue: 'Dough:', grams: 0.0, displayType: 'Heading',
        },
        {
          ingredientID: 2496, displayValue: '2/3 cup water', grams: 158.0, displayType: 'Normal',
        },
        {
          ingredientID: 16157, displayValue: '3 tablespoons butter', grams: 42.6, displayType: 'Normal',
        },
        {
          ingredientID: 7184, displayValue: '1 tablespoon bacon fat', grams: 14.0, displayType: 'Normal',
        },
        {
          ingredientID: 18866, displayValue: '1 teaspoon kosher salt', grams: 4.8, displayType: 'Normal',
        },
        {
          ingredientID: 1684, displayValue: '2/3 cup all-purpose flour', grams: 83.333336, displayType: 'Normal',
        },
        {
          ingredientID: 0, displayValue: '', grams: 0.0, displayType: 'BlankLine',
        },
        {
          ingredientID: 16317, displayValue: '2 eggs', grams: 100.0, displayType: 'Normal',
        },
        {
          ingredientID: 20474, displayValue: '2 ounces shredded extra-sharp white Cheddar cheese', grams: 56.7, displayType: 'Normal',
        },
        {
          ingredientID: 3725, displayValue: '1/2 cup finely diced jalapeno peppers', grams: 45.0, displayType: 'Normal',
        },
        {
          ingredientID: 16407, displayValue: '1 pinch cayenne pepper', grams: 0.2, displayType: 'Normal',
        },
        {
          ingredientID: 16406, displayValue: '1 pinch freshly ground black pepper', grams: 1.0, displayType: 'Normal',
        },
        {
          ingredientID: 20482, displayValue: '2 cups vegetable oil for deep frying, or as needed', grams: 440.0, displayType: 'Normal',
        }],
        servings: 8,
        prepMinutes: 15,
        cookMinutes: 30,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/3345433.jpg',
        id: 246256,
      },
      {
        title: 'Super Nachos',
        nutrition: {
          calories: {
            name: 'Calories', amount: 432.1232, unit: 'kcal', displayValue: '432', dailyValue: '432', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 24.45912, unit: 'g', displayValue: '24.5', dailyValue: '24.5', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 44.1625, unit: 'mg', displayValue: '44', dailyValue: '44', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 1081.15, unit: 'mg', displayValue: '1081', dailyValue: '1081', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 39.71766, unit: 'g', displayValue: '39.7', dailyValue: '39.7', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 15.23602, unit: 'g', displayValue: '15.2', dailyValue: '15.2', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 23.89333, unit: 'mcg', displayValue: '24', dailyValue: '24', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 89.87063, unit: 'mg', displayValue: '90', dailyValue: '90', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.2750925, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 4.839902, unit: 'mg', displayValue: '5', dailyValue: '5', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.07597917, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 3.403642, unit: 'mg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 211.4619, unit: 'mg', displayValue: '211', dailyValue: '211', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 4.835917, unit: 'mg', displayValue: '5', dailyValue: '5', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 585.3884, unit: 'IU', displayValue: '585', dailyValue: '585', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 2.057296, unit: 'g', displayValue: '2.1', dailyValue: '2.1', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 399.3673, unit: 'mg', displayValue: '399', dailyValue: '399', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 7.93238, unit: 'g', displayValue: '7.9', dailyValue: '7.9', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 220.132, unit: 'kcal', displayValue: '220', dailyValue: '220', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 5.6075, unit: 'g', displayValue: '5.6', dailyValue: '5.6', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 3103, displayValue: '1 pound ground beef', grams: 454.0, displayType: 'Normal',
        },
        {
          ingredientID: 18765, displayValue: '1 (1.25 ounce) package taco seasoning mix', grams: 35.5, displayType: 'Normal',
        },
        {
          ingredientID: 2496, displayValue: '3/4 cup water', grams: 177.75, displayType: 'Normal',
        },
        {
          ingredientID: 1320, displayValue: '1 (18 ounce) package restaurant-style tortilla chips', grams: 504.0, displayType: 'Normal',
        },
        {
          ingredientID: 16215, displayValue: '1 cup shredded sharp Cheddar cheese, or more to taste', grams: 113.0, displayType: 'Normal',
        },
        {
          ingredientID: 2863, displayValue: '1 (15.5 ounce) can refried beans', grams: 434.0, displayType: 'Normal',
        },
        {
          ingredientID: 5588, displayValue: '1 cup salsa', grams: 259.0, displayType: 'Normal',
        },
        {
          ingredientID: 16261, displayValue: '1 cup sour cream, or more to taste', grams: 230.0, displayType: 'Normal',
        },
        {
          ingredientID: 5133, displayValue: '1 (10 ounce) can pitted black olives, drained and chopped', grams: 280.0, displayType: 'Normal',
        },
        {
          ingredientID: 4405, displayValue: '4 green onions, diced', grams: 60.0, displayType: 'Normal',
        },
        {
          ingredientID: 4634, displayValue: '1 (4 ounce) can sliced jalapeno peppers, drained', grams: 112.0, displayType: 'Normal',
        }],
        servings: 12,
        prepMinutes: 30,
        cookMinutes: 20,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/829002.jpg',
        id: 51147,
      },
      {
        title: 'Mini Philly Cheesesteaks',
        nutrition: {
          calories: {
            name: 'Calories', amount: 280.2366, unit: 'kcal', displayValue: '280', dailyValue: '280', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 9.933566, unit: 'g', displayValue: '9.9', dailyValue: '9.9', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 18.16275, unit: 'mg', displayValue: '18', dailyValue: '18', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 488.7691, unit: 'mg', displayValue: '489', dailyValue: '489', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 34.8157, unit: 'g', displayValue: '34.8', dailyValue: '34.8', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 12.89247, unit: 'g', displayValue: '12.9', dailyValue: '12.9', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 92.10966, unit: 'mcg', displayValue: '92', dailyValue: '92', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 24.4348, unit: 'mg', displayValue: '24', dailyValue: '24', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.1566652, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 5.860651, unit: 'mg', displayValue: '6', dailyValue: '6', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.3317542, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 2.435745, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 109.9185, unit: 'mg', displayValue: '110', dailyValue: '110', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 6.021325, unit: 'mg', displayValue: '6', dailyValue: '6', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 305.882, unit: 'IU', displayValue: '306', dailyValue: '306', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 2.836842, unit: 'g', displayValue: '2.8', dailyValue: '2.8', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 171.8475, unit: 'mg', displayValue: '172', dailyValue: '172', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 3.996346, unit: 'g', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 89.40209, unit: 'kcal', displayValue: '89', dailyValue: '89', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 1.579514, unit: 'g', displayValue: '1.6', dailyValue: '1.6', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 0, displayValue: 'Cheese Sauce:', grams: 0.0, displayType: 'Heading',
        },
        {
          ingredientID: 16157, displayValue: '2 tablespoons butter, or as needed', grams: 28.4, displayType: 'Normal',
        },
        {
          ingredientID: 1684, displayValue: '2 tablespoons all-purpose flour, or as needed', grams: 15.625, displayType: 'Normal',
        },
        {
          ingredientID: 16278, displayValue: '1 cup cold milk', grams: 244.0, displayType: 'Normal',
        },
        {
          ingredientID: 16241, displayValue: '2 ounces shredded provolone cheese, or more to taste', grams: 56.7, displayType: 'Normal',
        },
        {
          ingredientID: 16401, displayValue: '1 pinch ground nutmeg', grams: 1.0, displayType: 'Normal',
        },
        {
          ingredientID: 16407, displayValue: '1 pinch cayenne pepper', grams: 0.2, displayType: 'Normal',
        },
        {
          ingredientID: 16421, displayValue: 'salt to taste', grams: 0.4, displayType: 'HideAmounts',
        },
        {
          ingredientID: 0, displayValue: '', grams: 0.0, displayType: 'BlankLine',
        },
        {
          ingredientID: 26706, displayValue: '1 (12 ounce) skirt steak', grams: 340.0, displayType: 'Normal',
        },
        {
          ingredientID: 16421, displayValue: 'salt and freshly ground black pepper to taste', grams: 0.4, displayType: 'HideAmounts',
        },
        {
          ingredientID: 6307, displayValue: '3 tablespoons olive oil, divided, or as needed', grams: 40.5, displayType: 'Normal',
        },
        {
          ingredientID: 2496, displayValue: '1/4 cup water', grams: 59.25, displayType: 'Normal',
        },
        {
          ingredientID: 4397, displayValue: '1/3 cup diced onion', grams: 53.333336, displayType: 'Normal',
        },
        {
          ingredientID: 4786, displayValue: '1/3 cup diced sweet peppers', grams: 51.90167, displayType: 'Normal',
        },
        {
          ingredientID: 20414, displayValue: '2 baguettes, or as needed, cut into 48 1/2-inch thick slices', grams: 680.0, displayType: 'Normal',
        },
        {
          ingredientID: 16241, displayValue: '1/4 cup shredded provolone cheese, or as needed', grams: 33.0, displayType: 'Normal',
        }],
        servings: 12,
        prepMinutes: 30,
        cookMinutes: 30,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/2805818.jpg',
        id: 241000,
      },
      {
        title: "Big Ray's Mexican Monkey Bread",
        nutrition: {
          calories: {
            name: 'Calories', amount: 194.819, unit: 'kcal', displayValue: '195', dailyValue: '195', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 11.4375, unit: 'g', displayValue: '11.4', dailyValue: '11.4', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 19.33471, unit: 'mg', displayValue: '19', dailyValue: '19', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 481.4401, unit: 'mg', displayValue: '481', dailyValue: '481', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 17.02101, unit: 'g', displayValue: '17', dailyValue: '17', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 6.137563, unit: 'g', displayValue: '6.1', dailyValue: '6.1', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 26.776, unit: 'mcg', displayValue: '27', dailyValue: '27', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 11.49046, unit: 'mg', displayValue: '11', dailyValue: '11', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.06325272, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 2.462035, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.1636225, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 1.096363, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 124.2258, unit: 'mg', displayValue: '124', dailyValue: '124', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 2.526866, unit: 'mg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 239.3176, unit: 'IU', displayValue: '239', dailyValue: '239', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 3.089215, unit: 'g', displayValue: '3.1', dailyValue: '3.1', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 88.87998, unit: 'mg', displayValue: '89', dailyValue: '89', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 5.278427, unit: 'g', displayValue: '5.3', dailyValue: '5.3', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 102.9375, unit: 'kcal', displayValue: '103', dailyValue: '103', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.4233949, unit: 'g', displayValue: '0.4', dailyValue: '0.4', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 10536, displayValue: 'cooking spray', grams: 0.266, displayType: 'HideAmounts',
        },
        {
          ingredientID: 16157, displayValue: '2 tablespoons butter, melted', grams: 28.4, displayType: 'Normal',
        },
        {
          ingredientID: 2061, displayValue: '1 (16.3 ounce) package refrigerated buttermilk biscuit dough, separated and each portion cut into quarters', grams: 456.4, displayType: 'Normal',
        },
        {
          ingredientID: 16215, displayValue: '1 1/4 cups shredded Cheddar cheese, divided', grams: 141.25, displayType: 'Normal',
        },
        {
          ingredientID: 3725, displayValue: '3/4 cup jalapeno pepper slices, divided', grams: 67.5, displayType: 'Normal',
        },
        {
          ingredientID: 16405, displayValue: '3/4 teaspoon dried parsley flakes, divided', grams: 0.3441735, displayType: 'Normal',
        },
        {
          ingredientID: 16234, displayValue: '1/4 cup shredded mozzarella cheese', grams: 28.25, displayType: 'Normal',
        }],
        servings: 12,
        prepMinutes: 10,
        cookMinutes: 40,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/2336354.jpg',
        id: 237835,
      },
      {
        title: 'Best Spinach Dip Ever',
        nutrition: {
          calories: {
            name: 'Calories', amount: 681.9874, unit: 'kcal', displayValue: '682', dailyValue: '682', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 47.40307, unit: 'g', displayValue: '47.4', dailyValue: '47.4', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 48.264, unit: 'mg', displayValue: '48', dailyValue: '48', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 1183.385, unit: 'mg', displayValue: '1183', dailyValue: '1183', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 53.21023, unit: 'g', displayValue: '53.2', dailyValue: '53.2', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 13.34167, unit: 'g', displayValue: '13.3', dailyValue: '13.3', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 159.0473, unit: 'mcg', displayValue: '159', dailyValue: '159', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 52.12333, unit: 'mg', displayValue: '52', dailyValue: '52', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.3548774, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 6.392315, unit: 'mg', displayValue: '6', dailyValue: '6', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.4603666, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 3.500807, unit: 'mg', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 168.0153, unit: 'mg', displayValue: '168', dailyValue: '168', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 3.453267, unit: 'mg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 3371.008, unit: 'IU', displayValue: '3371', dailyValue: '3371', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 2.697273, unit: 'g', displayValue: '2.7', dailyValue: '2.7', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 336.3227, unit: 'mg', displayValue: '336', dailyValue: '336', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 15.07642, unit: 'g', displayValue: '15.1', dailyValue: '15.1', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 426.6277, unit: 'kcal', displayValue: '427', dailyValue: '427', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 2.8974, unit: 'g', displayValue: '2.9', dailyValue: '2.9', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 6294, displayValue: '1 cup mayonnaise', grams: 220.0, displayType: 'Normal',
        },
        {
          ingredientID: 16261, displayValue: '1 (16 ounce) container sour cream', grams: 454.4, displayType: 'Normal',
        },
        {
          ingredientID: 5528, displayValue: '1 (1.8 ounce) package dry leek soup mix', grams: 50.4, displayType: 'Normal',
        },
        {
          ingredientID: 4607, displayValue: '1 (4 ounce) can water chestnuts, drained and chopped', grams: 28.0, displayType: 'Normal',
        },
        {
          ingredientID: 4520, displayValue: '1/2 (10 ounce) package frozen chopped spinach, thawed and drained', grams: 142.0, displayType: 'Normal',
        },
        {
          ingredientID: 20487, displayValue: '1 (1 pound) loaf round sourdough bread', grams: 448.0, displayType: 'Normal',
        }],
        servings: 6,
        prepMinutes: 15,
        cookMinutes: 0,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/748478.jpg',
        id: 22617,
      },
      {
        title: 'Baked Crab and Artichoke Dip',
        nutrition: {
          calories: {
            name: 'Calories', amount: 414.4747, unit: 'kcal', displayValue: '414', dailyValue: '414', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 25.04629, unit: 'g', displayValue: '25', dailyValue: '25', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 92.11797, unit: 'mg', displayValue: '92', dailyValue: '92', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 754.3748, unit: 'mg', displayValue: '754', dailyValue: '754', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 27.5489, unit: 'g', displayValue: '27.5', dailyValue: '27.5', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 20.92701, unit: 'g', displayValue: '20.9', dailyValue: '20.9', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 86.18597, unit: 'mcg', displayValue: '86', dailyValue: '86', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 43.09868, unit: 'mg', displayValue: '43', dailyValue: '43', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.1999312, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 7.323806, unit: 'mg', displayValue: '7', dailyValue: '7', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.2440474, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 2.277903, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 203.0533, unit: 'mg', displayValue: '203', dailyValue: '203', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 20.04706, unit: 'mg', displayValue: '20', dailyValue: '20', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 1078.478, unit: 'IU', displayValue: '1078', dailyValue: '1078', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 1.559838, unit: 'g', displayValue: '1.6', dailyValue: '1.6', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 319.7342, unit: 'mg', displayValue: '320', dailyValue: '320', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 13.53696, unit: 'g', displayValue: '13.5', dailyValue: '13.5', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 225.4166, unit: 'kcal', displayValue: '225', dailyValue: '225', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 2.278245, unit: 'g', displayValue: '2.3', dailyValue: '2.3', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 16223, displayValue: '2 (8 ounce) packages cream cheese, softened', grams: 448.0, displayType: 'Normal',
        },
        {
          ingredientID: 2740, displayValue: '1 pound lump crabmeat, drained', grams: 454.0, displayType: 'Normal',
        },
        {
          ingredientID: 126, displayValue: '1 (14 ounce) can artichoke bottoms, drained and chopped', grams: 240.0, displayType: 'Normal',
        },
        {
          ingredientID: 16215, displayValue: '6 ounces shredded white Cheddar cheese', grams: 170.1, displayType: 'Normal',
        },
        {
          ingredientID: 4786, displayValue: '1/2 cup finely diced red bell pepper', grams: 74.5, displayType: 'Normal',
        },
        {
          ingredientID: 4405, displayValue: '1/3 cup chopped green onions', grams: 33.333332, displayType: 'Normal',
        },
        {
          ingredientID: 16261, displayValue: '1/2 cup sour cream', grams: 115.0, displayType: 'Normal',
        },
        {
          ingredientID: 6294, displayValue: '1/4 cup mayonnaise', grams: 55.0, displayType: 'Normal',
        },
        {
          ingredientID: 4342, displayValue: '3 cloves garlic, minced', grams: 9.0, displayType: 'Normal',
        },
        {
          ingredientID: 5106, displayValue: '1 lemon, zested and juiced', grams: 112.0, displayType: 'Normal',
        },
        {
          ingredientID: 18774, displayValue: '2 teaspoons chopped fresh tarragon', grams: 4.0, displayType: 'Normal',
        },
        {
          ingredientID: 7428, displayValue: '1 teaspoon Worcestershire sauce', grams: 5.6666665, displayType: 'Normal',
        },
        {
          ingredientID: 16407, displayValue: '1 pinch cayenne pepper, or more to taste', grams: 0.2, displayType: 'Normal',
        },
        {
          ingredientID: 16421, displayValue: 'salt and freshly ground black pepper to taste', grams: 0.4, displayType: 'HideAmounts',
        },
        {
          ingredientID: 20487, displayValue: '1 round loaf sourdough bread', grams: 454.0, displayType: 'Normal',
        },
        {
          ingredientID: 16215, displayValue: '2 tablespoons shredded white Cheddar cheese', grams: 16.638655, displayType: 'Normal',
        }],
        servings: 12,
        prepMinutes: 30,
        cookMinutes: 30,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/1866265.jpg',
        id: 231170,
      },
      {
        title: 'Cheesy Burrito Game Day Dip',
        nutrition: {
          calories: {
            name: 'Calories', amount: 595.299, unit: 'kcal', displayValue: '595', dailyValue: '595', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 41.00536, unit: 'g', displayValue: '41', dailyValue: '41', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 137.9463, unit: 'mg', displayValue: '138', dailyValue: '138', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 1270.585, unit: 'mg', displayValue: '1271', dailyValue: '1271', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 24.18284, unit: 'g', displayValue: '24.2', dailyValue: '24.2', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 32.91967, unit: 'g', displayValue: '32.9', dailyValue: '32.9', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 20.83125, unit: 'mcg', displayValue: '21', dailyValue: '21', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 48.6975, unit: 'mg', displayValue: '49', dailyValue: '49', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.2767738, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 6.008617, unit: 'mg', displayValue: '6', dailyValue: '6', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.05675375, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 3.008375, unit: 'mg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 88.065, unit: 'mg', displayValue: '88', dailyValue: '88', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 6.97875, unit: 'mg', displayValue: '7', dailyValue: '7', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 376.4225, unit: 'IU', displayValue: '376', dailyValue: '376', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 1.072769, unit: 'g', displayValue: '1.1', dailyValue: '1.1', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 472.1075, unit: 'mg', displayValue: '472', dailyValue: '472', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 25.31359, unit: 'g', displayValue: '25.3', dailyValue: '25.3', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 369.0482, unit: 'kcal', displayValue: '369', dailyValue: '369', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 5.936, unit: 'g', displayValue: '5.9', dailyValue: '5.9', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 10536, displayValue: 'cooking spray', grams: 0.266, displayType: 'HideAmounts',
        },
        {
          ingredientID: 3103, displayValue: '1 pound ground beef', grams: 454.0, displayType: 'Normal',
        },
        {
          ingredientID: 2863, displayValue: '2 (16 ounce) cans refried beans', grams: 896.0, displayType: 'Normal',
        },
        {
          ingredientID: 578, displayValue: '4 cups shredded Colby-Monterey Jack cheese, divided', grams: 540.0, displayType: 'Normal',
        },
        {
          ingredientID: 16261, displayValue: '1 cup sour cream', grams: 230.0, displayType: 'Normal',
        },
        {
          ingredientID: 16223, displayValue: '1 (4 ounce) package cream cheese, softened', grams: 113.0, displayType: 'Normal',
        },
        {
          ingredientID: 18765, displayValue: '1 (1.25 ounce) package taco seasoning mix', grams: 35.5, displayType: 'Normal',
        }],
        servings: 8,
        prepMinutes: 15,
        cookMinutes: 30,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/1119769.jpg',
        id: 234476,
      },
      {
        title: 'Pressure Cooker Hard-Boiled Eggs',
        nutrition: {
          calories: {
            name: 'Calories', amount: 143.0, unit: 'kcal', displayValue: '143', dailyValue: '143', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 9.94, unit: 'g', displayValue: '9.9', dailyValue: '9.9', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 372.0, unit: 'mg', displayValue: '372', dailyValue: '372', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 157.775, unit: 'mg', displayValue: '158', dailyValue: '158', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 0.77, unit: 'g', displayValue: '0.8', dailyValue: '0.8', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 12.58, unit: 'g', displayValue: '12.6', dailyValue: '12.6', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 47.0, unit: 'mcg', displayValue: '47', dailyValue: '47', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 17.925, unit: 'mg', displayValue: '18', dailyValue: '18', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.143, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 2.788715, unit: 'mg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.062, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 1.83, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 70.77499, unit: 'mg', displayValue: '71', dailyValue: '71', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 0.0, unit: 'mg', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 487.0, unit: 'IU', displayValue: '487', dailyValue: '487', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.77, unit: 'g', displayValue: '0.8', dailyValue: '0.8', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 139.925, unit: 'mg', displayValue: '140', dailyValue: '140', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 3.099, unit: 'g', displayValue: '3.1', dailyValue: '3.1', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 89.46, unit: 'kcal', displayValue: '89', dailyValue: '89', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.0, unit: 'g', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 2496, displayValue: '2 cups water, or as needed', grams: 474.0, displayType: 'Normal',
        },
        {
          ingredientID: 16317, displayValue: '8 fresh eggs', grams: 400.0, displayType: 'Normal',
        },
        {
          ingredientID: 0, displayValue: '', grams: 0.0, displayType: 'BlankLine',
        },
        {
          ingredientID: 2496, displayValue: '4 cups cold water', grams: 948.0, displayType: 'Normal',
        },
        {
          ingredientID: 20382, displayValue: '4 cups ice cubes', grams: 948.0, displayType: 'Normal',
        }],
        servings: 4,
        prepMinutes: 5,
        cookMinutes: 6,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/3603605.jpg',
        id: 237562,
      },
      {
        title: 'Guacamole',
        nutrition: {
          calories: {
            name: 'Calories', amount: 261.503, unit: 'kcal', displayValue: '262', dailyValue: '262', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 22.2388, unit: 'g', displayValue: '22.2', dailyValue: '22.2', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 0.0, unit: 'mg', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 595.7334, unit: 'mg', displayValue: '596', dailyValue: '596', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 18.0465, unit: 'g', displayValue: '18', dailyValue: '18', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 3.721503, unit: 'g', displayValue: '3.7', dailyValue: '3.7', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 133.3084, unit: 'mcg', displayValue: '133', dailyValue: '133', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 50.95913, unit: 'mg', displayValue: '51', dailyValue: '51', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.4565128, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 3.615157, unit: 'mg', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.1974474, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 1.114241, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 34.46319, unit: 'mg', displayValue: '34', dailyValue: '34', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 26.20504, unit: 'mg', displayValue: '26', dailyValue: '26', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 653.4717, unit: 'IU', displayValue: '653', dailyValue: '653', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 2.972255, unit: 'g', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 866.0605, unit: 'mg', displayValue: '866', dailyValue: '866', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 3.228265, unit: 'g', displayValue: '3.2', dailyValue: '3.2', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 200.1492, unit: 'kcal', displayValue: '200', dailyValue: '200', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 11.36993, unit: 'g', displayValue: '11.4', dailyValue: '11.4', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 5012, displayValue: '3 avocados - peeled, pitted, and mashed', grams: 603.0, displayType: 'Normal',
        },
        {
          ingredientID: 5111, displayValue: '1 lime, juiced', grams: 67.0, displayType: 'Normal',
        },
        {
          ingredientID: 16421, displayValue: '1 teaspoon salt', grams: 6.0, displayType: 'Normal',
        },
        {
          ingredientID: 4397, displayValue: '1/2 cup diced onion', grams: 80.0, displayType: 'Normal',
        },
        {
          ingredientID: 3717, displayValue: '3 tablespoons chopped fresh cilantro', grams: 8.625, displayType: 'Normal',
        },
        {
          ingredientID: 20453, displayValue: '2 roma (plum) tomatoes, diced', grams: 124.0, displayType: 'Normal',
        },
        {
          ingredientID: 4342, displayValue: '1 teaspoon minced garlic', grams: 2.8, displayType: 'Normal',
        },
        {
          ingredientID: 16407, displayValue: '1 pinch ground cayenne pepper (optional)', grams: 0.2, displayType: 'OptionalIngredient',
        }],
        servings: 4,
        prepMinutes: 10,
        cookMinutes: 0,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/811729.jpg',
        id: 14231,
      },
      {
        title: 'Buffalo Chicken Dip',
        nutrition: {
          calories: {
            name: 'Calories', amount: 283.6421, unit: 'kcal', displayValue: '284', dailyValue: '284', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 22.59276, unit: 'g', displayValue: '22.6', dailyValue: '22.6', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 54.14675, unit: 'mg', displayValue: '54', dailyValue: '54', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 551.7513, unit: 'mg', displayValue: '552', dailyValue: '552', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 8.551398, unit: 'g', displayValue: '8.6', dailyValue: '8.6', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 11.11299, unit: 'g', displayValue: '11.1', dailyValue: '11.1', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 15.44779, unit: 'mcg', displayValue: '15', dailyValue: '15', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 11.08014, unit: 'mg', displayValue: '11', dailyValue: '11', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.1478769, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 3.756186, unit: 'mg', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.02551129, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.9415082, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 98.21149, unit: 'mg', displayValue: '98', dailyValue: '98', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 1.805167, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 683.4869, unit: 'IU', displayValue: '683', dailyValue: '683', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 1.752749, unit: 'g', displayValue: '1.8', dailyValue: '1.8', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 160.8481, unit: 'mg', displayValue: '161', dailyValue: '161', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 8.863464, unit: 'g', displayValue: '8.9', dailyValue: '8.9', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 203.3349, unit: 'kcal', displayValue: '203', dailyValue: '203', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.8411928, unit: 'g', displayValue: '0.8', dailyValue: '0.8', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 5429, displayValue: '2 (10 ounce) cans chunk chicken, drained', grams: 560.0, displayType: 'Normal',
        },
        {
          ingredientID: 16223, displayValue: '2 (8 ounce) packages cream cheese, softened', grams: 448.0, displayType: 'Normal',
        },
        {
          ingredientID: 6345, displayValue: '1 cup Ranch dressing', grams: 232.0, displayType: 'Normal',
        },
        {
          ingredientID: 5593, displayValue: "3/4 cup pepper sauce (such as Frank's Red Hot®)", grams: 167.79001, displayType: 'Normal',
        },
        {
          ingredientID: 16215, displayValue: '1 1/2 cups shredded Cheddar cheese', grams: 169.5, displayType: 'Normal',
        },
        {
          ingredientID: 0, displayValue: '', grams: 0.0, displayType: 'BlankLine',
        },
        {
          ingredientID: 4292, displayValue: '1 bunch celery, cleaned and cut into 4 inch pieces', grams: 544.8, displayType: 'Normal',
        },
        {
          ingredientID: 22911, displayValue: '1 (8 ounce) box chicken-flavored crackers', grams: 227.2, displayType: 'Normal',
        }],
        servings: 20,
        prepMinutes: 5,
        cookMinutes: 40,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/3095600.jpg',
        id: 68461,
      },
      {
        title: "Annie's Fruit Salsa and Cinnamon Chips",
        nutrition: {
          calories: {
            name: 'Calories', amount: 311.9591, unit: 'kcal', displayValue: '312', dailyValue: '312', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 5.920525, unit: 'g', displayValue: '5.9', dailyValue: '5.9', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 0.0, unit: 'mg', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 461.6786, unit: 'mg', displayValue: '462', dailyValue: '462', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 59.00695, unit: 'g', displayValue: '59', dailyValue: '59', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 6.751983, unit: 'g', displayValue: '6.8', dailyValue: '6.8', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 97.27707, unit: 'mcg', displayValue: '97', dailyValue: '97', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 29.75411, unit: 'mg', displayValue: '30', dailyValue: '30', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.0811763, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 4.34459, unit: 'mg', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.4011885, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 2.860219, unit: 'mg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 113.2978, unit: 'mg', displayValue: '113', dailyValue: '113', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 47.9184, unit: 'mg', displayValue: '48', dailyValue: '48', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 56.438, unit: 'IU', displayValue: '56', dailyValue: '56', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 15.59935, unit: 'g', displayValue: '15.6', dailyValue: '15.6', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 288.4714, unit: 'mg', displayValue: '288', dailyValue: '288', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 1.373873, unit: 'g', displayValue: '1.4', dailyValue: '1.4', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 53.28473, unit: 'kcal', displayValue: '53', dailyValue: '53', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 5.66945, unit: 'g', displayValue: '5.7', dailyValue: '5.7', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 5103, displayValue: '2 kiwis, peeled and diced', grams: 148.0, displayType: 'Normal',
        },
        {
          ingredientID: 11042, displayValue: '2 Golden Delicious apples - peeled, cored and diced', grams: 276.0, displayType: 'Normal',
        },
        {
          ingredientID: 5222, displayValue: '8 ounces raspberries', grams: 224.0, displayType: 'Normal',
        },
        {
          ingredientID: 5233, displayValue: '1 pound strawberries', grams: 454.0, displayType: 'Normal',
        },
        {
          ingredientID: 1526, displayValue: '2 tablespoons white sugar', grams: 25.0, displayType: 'Normal',
        },
        {
          ingredientID: 1525, displayValue: '1 tablespoon brown sugar', grams: 13.568282, displayType: 'Normal',
        },
        {
          ingredientID: 1503, displayValue: '3 tablespoons fruit preserves, any flavor', grams: 59.5, displayType: 'Normal',
        },
        {
          ingredientID: 0, displayValue: '', grams: 0.0, displayType: 'BlankLine',
        },
        {
          ingredientID: 2352, displayValue: '10 (10 inch) flour tortillas', grams: 720.0, displayType: 'Normal',
        },
        {
          ingredientID: 111, displayValue: 'butter flavored cooking spray', grams: 0.0, displayType: 'HideAmounts',
        },
        {
          ingredientID: 20708, displayValue: '2 tablespoons cinnamon sugar', grams: 24.669603, displayType: 'Normal',
        }],
        servings: 10,
        prepMinutes: 15,
        cookMinutes: 10,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/4536841.jpg',
        id: 26692,
      },
      {
        title: 'Mouth-Watering Stuffed Mushrooms',
        nutrition: {
          calories: {
            name: 'Calories', amount: 87.84326, unit: 'kcal', displayValue: '88', dailyValue: '88', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 8.20479, unit: 'g', displayValue: '8.2', dailyValue: '8.2', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 22.0, unit: 'mg', displayValue: '22', dailyValue: '22', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 81.80962, unit: 'mg', displayValue: '82', dailyValue: '82', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 1.470564, unit: 'g', displayValue: '1.5', dailyValue: '1.5', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 2.66471, unit: 'g', displayValue: '2.7', dailyValue: '2.7', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 5.611053, unit: 'mcg', displayValue: '6', dailyValue: '6', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 3.743326, unit: 'mg', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.03854137, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 1.124004, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.02187484, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.3575538, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 35.62731, unit: 'mg', displayValue: '36', dailyValue: '36', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 0.640348, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 274.4175, unit: 'IU', displayValue: '274', dailyValue: '274', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.3760031, unit: 'g', displayValue: '0.4', dailyValue: '0.4', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 86.05817, unit: 'mg', displayValue: '86', dailyValue: '86', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 4.547126, unit: 'g', displayValue: '4.5', dailyValue: '4.5', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 73.84311, unit: 'kcal', displayValue: '74', dailyValue: '74', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.2189659, unit: 'g', displayValue: '0.2', dailyValue: '0.2', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 4378, displayValue: '12 whole fresh mushrooms', grams: 216.0, displayType: 'Normal',
        },
        {
          ingredientID: 6379, displayValue: '1 tablespoon vegetable oil', grams: 13.75, displayType: 'Normal',
        },
        {
          ingredientID: 4342, displayValue: '1 tablespoon minced garlic', grams: 8.387665, displayType: 'Normal',
        },
        {
          ingredientID: 16223, displayValue: '1 (8 ounce) package cream cheese, softened', grams: 224.0, displayType: 'Normal',
        },
        {
          ingredientID: 16238, displayValue: '1/4 cup grated Parmesan cheese', grams: 20.0, displayType: 'Normal',
        },
        {
          ingredientID: 16406, displayValue: '1/4 teaspoon ground black pepper', grams: 0.525, displayType: 'Normal',
        },
        {
          ingredientID: 16402, displayValue: '1/4 teaspoon onion powder', grams: 0.525, displayType: 'Normal',
        },
        {
          ingredientID: 16407, displayValue: '1/4 teaspoon ground cayenne pepper', grams: 0.45, displayType: 'Normal',
        }],
        servings: 12,
        prepMinutes: 25,
        cookMinutes: 20,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/414837.jpg',
        id: 15184,
      },
      {
        title: 'Loaded Baked Potato Dip',
        nutrition: {
          calories: {
            name: 'Calories', amount: 134.8071, unit: 'kcal', displayValue: '135', dailyValue: '135', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 11.69805, unit: 'g', displayValue: '11.7', dailyValue: '11.7', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 28.47108, unit: 'mg', displayValue: '28', dailyValue: '28', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 262.8388, unit: 'mg', displayValue: '263', dailyValue: '263', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 1.984389, unit: 'g', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 5.678643, unit: 'g', displayValue: '5.7', dailyValue: '5.7', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 6.881187, unit: 'mcg', displayValue: '7', dailyValue: '7', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 7.488312, unit: 'mg', displayValue: '7', dailyValue: '7', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.04084489, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 1.805126, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.07816511, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.2374771, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 73.04597, unit: 'mg', displayValue: '73', dailyValue: '73', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 1.273881, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 318.9068, unit: 'IU', displayValue: '319', dailyValue: '319', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.1720194, unit: 'g', displayValue: '0.2', dailyValue: '0.2', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 110.956, unit: 'mg', displayValue: '111', dailyValue: '111', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 6.028578, unit: 'g', displayValue: '6', dailyValue: '6', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 105.2824, unit: 'kcal', displayValue: '105', dailyValue: '105', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.1445083, unit: 'g', displayValue: '0.1', dailyValue: '0.1', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 5375, displayValue: '3 pounds bacon, cut into 1/2-inch pieces', grams: 1362.0, displayType: 'Normal',
        },
        {
          ingredientID: 16261, displayValue: '6 cups sour cream', grams: 1380.0, displayType: 'Normal',
        },
        {
          ingredientID: 13890, displayValue: '1/2 pound shredded extra-sharp Cheddar cheese', grams: 227.0, displayType: 'Normal',
        },
        {
          ingredientID: 4405, displayValue: '1 cup chopped green onion', grams: 104.5, displayType: 'Normal',
        },
        {
          ingredientID: 16407, displayValue: '1 pinch cayenne pepper', grams: 0.2, displayType: 'Normal',
        },
        {
          ingredientID: 16406, displayValue: 'freshly ground black pepper to taste', grams: 1.0, displayType: 'HideAmounts',
        },
        {
          ingredientID: 16261, displayValue: '1/4 cup sour cream, or as needed', grams: 57.5, displayType: 'Normal',
        },
        {
          ingredientID: 4405, displayValue: '1 1/2 cups chopped green onion, green parts only, or more as needed', grams: 150.0, displayType: 'Normal',
        }],
        servings: 48,
        prepMinutes: 20,
        cookMinutes: 10,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/2377270.jpg',
        id: 241080,
      },
      {
        title: 'Jalapeno Popper Spread',
        nutrition: {
          calories: {
            name: 'Calories', amount: 110.205, unit: 'kcal', displayValue: '110', dailyValue: '110', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 11.07506, unit: 'g', displayValue: '11.1', dailyValue: '11.1', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 20.2125, unit: 'mg', displayValue: '20', dailyValue: '20', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 189.0125, unit: 'mg', displayValue: '189', dailyValue: '189', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 0.9526001, unit: 'g', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 2.127975, unit: 'g', displayValue: '2.1', dailyValue: '2.1', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 3.00875, unit: 'mcg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 2.61125, unit: 'mg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.05615375, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 0.42687, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.0049575, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.256025, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 40.05375, unit: 'mg', displayValue: '40', dailyValue: '40', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 2.555, unit: 'mg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 273.725, unit: 'IU', displayValue: '274', dailyValue: '274', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.2714, unit: 'g', displayValue: '0.3', dailyValue: '0.3', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 30.5325, unit: 'mg', displayValue: '31', dailyValue: '31', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 4.326906, unit: 'g', displayValue: '4.3', dailyValue: '4.3', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 99.67557, unit: 'kcal', displayValue: '100', dailyValue: '100', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.091, unit: 'g', displayValue: '0.1', dailyValue: '0.1', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 16223, displayValue: '2 (8 ounce) packages cream cheese, softened', grams: 448.0, displayType: 'Normal',
        },
        {
          ingredientID: 6294, displayValue: '1 cup mayonnaise', grams: 220.0, displayType: 'Normal',
        },
        {
          ingredientID: 4431, displayValue: '1 (4 ounce) can chopped green chilies, drained', grams: 112.0, displayType: 'Normal',
        },
        {
          ingredientID: 4634, displayValue: '2 ounces canned diced jalapeno peppers, drained', grams: 56.0, displayType: 'Normal',
        },
        {
          ingredientID: 16238, displayValue: '1 cup grated Parmesan cheese', grams: 80.0, displayType: 'Normal',
        }],
        servings: 32,
        prepMinutes: 10,
        cookMinutes: 3,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/265544.jpg',
        id: 139012,
      },
      {
        title: 'Restaurant-Style Buffalo Chicken Wings',
        nutrition: {
          calories: {
            name: 'Calories', amount: 363.8077, unit: 'kcal', displayValue: '364', dailyValue: '364', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 32.41526, unit: 'g', displayValue: '32.4', dailyValue: '32.4', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 44.1665, unit: 'mg', displayValue: '44', dailyValue: '44', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 496.5397, unit: 'mg', displayValue: '497', dailyValue: '497', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 10.71405, unit: 'g', displayValue: '10.7', dailyValue: '10.7', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 7.898755, unit: 'g', displayValue: '7.9', dailyValue: '7.9', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 25.59094, unit: 'mcg', displayValue: '26', dailyValue: '26', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 9.027078, unit: 'mg', displayValue: '9', dailyValue: '9', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.136792, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 3.883431, unit: 'mg', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.1190522, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 1.039095, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 10.59493, unit: 'mg', displayValue: '11', dailyValue: '11', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 8.594972, unit: 'mg', displayValue: '9', dailyValue: '9', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 430.4447, unit: 'IU', displayValue: '430', dailyValue: '430', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.2524815, unit: 'g', displayValue: '0.3', dailyValue: '0.3', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 84.62457, unit: 'mg', displayValue: '85', dailyValue: '85', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 9.576858, unit: 'g', displayValue: '9.6', dailyValue: '9.6', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 291.7374, unit: 'kcal', displayValue: '292', dailyValue: '292', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.5353896, unit: 'g', displayValue: '0.5', dailyValue: '0.5', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 1684, displayValue: '1/2 cup all-purpose flour', grams: 62.5, displayType: 'Normal',
        },
        {
          ingredientID: 16404, displayValue: '1/4 teaspoon paprika', grams: 0.5702083, displayType: 'Normal',
        },
        {
          ingredientID: 16407, displayValue: '1/4 teaspoon cayenne pepper', grams: 0.45, displayType: 'Normal',
        },
        {
          ingredientID: 16421, displayValue: '1/4 teaspoon salt', grams: 1.5, displayType: 'Normal',
        },
        {
          ingredientID: 6531, displayValue: '10 chicken wings', grams: 490.0, displayType: 'Normal',
        },
        {
          ingredientID: 20482, displayValue: 'oil for deep frying', grams: 880.0, displayType: 'HideAmounts',
        },
        {
          ingredientID: 16157, displayValue: '1/4 cup butter', grams: 56.75, displayType: 'Normal',
        },
        {
          ingredientID: 5592, displayValue: '1/4 cup hot sauce', grams: 55.93, displayType: 'Normal',
        },
        {
          ingredientID: 16406, displayValue: '1 dash ground black pepper', grams: 1.0, displayType: 'Normal',
        },
        {
          ingredientID: 16396, displayValue: '1 dash garlic powder', grams: 1.0, displayType: 'Normal',
        }],
        servings: 5,
        prepMinutes: 15,
        cookMinutes: 15,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/445293.jpg',
        id: 24087,
      },
      {
        title: 'Double Tomato Bruschetta',
        nutrition: {
          calories: {
            name: 'Calories', amount: 215.353, unit: 'kcal', displayValue: '215', dailyValue: '215', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 8.913733, unit: 'g', displayValue: '8.9', dailyValue: '8.9', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 12.05333, unit: 'mg', displayValue: '12', dailyValue: '12', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 425.5959, unit: 'mg', displayValue: '426', dailyValue: '426', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 24.84507, unit: 'g', displayValue: '24.8', dailyValue: '24.8', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 9.608933, unit: 'g', displayValue: '9.6', dailyValue: '9.6', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 64.01504, unit: 'mcg', displayValue: '64', dailyValue: '64', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 22.88175, unit: 'mg', displayValue: '23', dailyValue: '23', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.1012065, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 3.984445, unit: 'mg', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.2290346, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 1.719824, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 173.1167, unit: 'mg', displayValue: '173', dailyValue: '173', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 9.093113, unit: 'mg', displayValue: '9', dailyValue: '9', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 454.1659, unit: 'IU', displayValue: '454', dailyValue: '454', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 2.375308, unit: 'g', displayValue: '2.4', dailyValue: '2.4', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 217.6433, unit: 'mg', displayValue: '218', dailyValue: '218', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 2.811093, unit: 'g', displayValue: '2.8', dailyValue: '2.8', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 80.22359, unit: 'kcal', displayValue: '80', dailyValue: '80', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 1.587193, unit: 'g', displayValue: '1.6', dailyValue: '1.6', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 20453, displayValue: '6 roma (plum) tomatoes, chopped', grams: 372.0, displayType: 'Normal',
        },
        {
          ingredientID: 3703, displayValue: '1/2 cup sun-dried tomatoes, packed in oil', grams: 55.0, displayType: 'Normal',
        },
        {
          ingredientID: 4342, displayValue: '3 cloves minced garlic', grams: 9.0, displayType: 'Normal',
        },
        {
          ingredientID: 6307, displayValue: '1/4 cup olive oil', grams: 54.0, displayType: 'Normal',
        },
        {
          ingredientID: 18930, displayValue: '2 tablespoons balsamic vinegar', grams: 30.0, displayType: 'Normal',
        },
        {
          ingredientID: 16159, displayValue: '1/4 cup fresh basil, stems removed', grams: 10.511666, displayType: 'Normal',
        },
        {
          ingredientID: 16421, displayValue: '1/4 teaspoon salt', grams: 1.5, displayType: 'Normal',
        },
        {
          ingredientID: 16406, displayValue: '1/4 teaspoon ground black pepper', grams: 0.525, displayType: 'Normal',
        },
        {
          ingredientID: 20414, displayValue: '1 French baguette', grams: 454.0, displayType: 'Normal',
        },
        {
          ingredientID: 16234, displayValue: '2 cups shredded mozzarella cheese', grams: 226.0, displayType: 'Normal',
        }],
        servings: 12,
        prepMinutes: 15,
        cookMinutes: 7,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/4542188.jpg',
        id: 20669,
      },
      {
        title: 'Artichoke & Spinach Dip Restaurant Style',
        nutrition: {
          calories: {
            name: 'Calories', amount: 152.879, unit: 'kcal', displayValue: '153', dailyValue: '153', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 12.30354, unit: 'g', displayValue: '12.3', dailyValue: '12.3', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 27.65749, unit: 'mg', displayValue: '28', dailyValue: '28', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 484.812, unit: 'mg', displayValue: '485', dailyValue: '485', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 5.198187, unit: 'g', displayValue: '5.2', dailyValue: '5.2', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 6.609835, unit: 'g', displayValue: '6.6', dailyValue: '6.6', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 36.62972, unit: 'mcg', displayValue: '37', dailyValue: '37', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 21.57028, unit: 'mg', displayValue: '22', dailyValue: '22', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.06512389, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 1.29047, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.02616167, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.6170167, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 138.0894, unit: 'mg', displayValue: '138', dailyValue: '138', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 4.185095, unit: 'mg', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 3027.415, unit: 'IU', displayValue: '3027', dailyValue: '3027', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 1.061596, unit: 'g', displayValue: '1.1', dailyValue: '1.1', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 107.6911, unit: 'mg', displayValue: '108', dailyValue: '108', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 6.03203, unit: 'g', displayValue: '6', dailyValue: '6', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 110.7318, unit: 'kcal', displayValue: '111', dailyValue: '111', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 1.421619, unit: 'g', displayValue: '1.4', dailyValue: '1.4', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 4342, displayValue: '4 cloves garlic', grams: 12.0, displayType: 'Normal',
        },
        {
          ingredientID: 4520, displayValue: '1 (10 ounce) package frozen chopped spinach, thawed and drained', grams: 284.0, displayType: 'Normal',
        },
        {
          ingredientID: 126, displayValue: '1 (14 ounce) can artichoke hearts, drained and chopped', grams: 240.0, displayType: 'Normal',
        },
        {
          ingredientID: 13705, displayValue: '1 (10 ounce) container Alfredo-style pasta sauce', grams: 280.0, displayType: 'Normal',
        },
        {
          ingredientID: 16234, displayValue: '1 cup shredded mozzarella cheese', grams: 113.0, displayType: 'Normal',
        },
        {
          ingredientID: 16238, displayValue: '1/3 cup grated Parmesan cheese', grams: 26.666664, displayType: 'Normal',
        },
        {
          ingredientID: 16223, displayValue: '1/2 (8 ounce) package cream cheese, softened', grams: 112.0, displayType: 'Normal',
        }],
        servings: 12,
        prepMinutes: 15,
        cookMinutes: 30,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/2073139.jpg',
        id: 33474,
      },
      {
        title: 'Hot Baked Reuben Dip',
        nutrition: {
          calories: {
            name: 'Calories', amount: 138.0081, unit: 'kcal', displayValue: '138', dailyValue: '138', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 9.880857, unit: 'g', displayValue: '9.9', dailyValue: '9.9', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 33.08192, unit: 'mg', displayValue: '33', dailyValue: '33', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 441.3225, unit: 'mg', displayValue: '441', dailyValue: '441', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 5.092404, unit: 'g', displayValue: '5.1', dailyValue: '5.1', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 7.452711, unit: 'g', displayValue: '7.5', dailyValue: '7.5', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 3.703097, unit: 'mcg', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 5.428403, unit: 'mg', displayValue: '5', dailyValue: '5', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.02847023, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 1.728136, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.0248419, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.9292466, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 103.0427, unit: 'mg', displayValue: '103', dailyValue: '103', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 1.055863, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 262.516, unit: 'IU', displayValue: '263', dailyValue: '263', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 1.399537, unit: 'g', displayValue: '1.4', dailyValue: '1.4', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 103.3227, unit: 'mg', displayValue: '103', dailyValue: '103', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 4.868414, unit: 'g', displayValue: '4.9', dailyValue: '4.9', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 88.92772, unit: 'kcal', displayValue: '89', dailyValue: '89', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.3056535, unit: 'g', displayValue: '0.3', dailyValue: '0.3', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 16223, displayValue: '1 (8 ounce) package cream cheese, softened', grams: 224.0, displayType: 'Normal',
        },
        {
          ingredientID: 5952, displayValue: '1 pound deli sliced corned beef or pastrami, cut into 1-inch pieces', grams: 454.4, displayType: 'Normal',
        },
        {
          ingredientID: 4504, displayValue: '1 cup sauerkraut, drained well, squeezed very dry', grams: 142.0, displayType: 'Normal',
        },
        {
          ingredientID: 3692, displayValue: '1/4 cup sweet pickle relish', grams: 61.25, displayType: 'Normal',
        },
        {
          ingredientID: 6294, displayValue: '2 tablespoons mayonnaise', grams: 27.6, displayType: 'Normal',
        },
        {
          ingredientID: 16261, displayValue: '2 tablespoons sour cream', grams: 28.75, displayType: 'Normal',
        },
        {
          ingredientID: 3686, displayValue: '1 tablespoon ketchup', grams: 15.0, displayType: 'Normal',
        },
        {
          ingredientID: 18873, displayValue: '1 tablespoon Dijon mustard', grams: 15.625, displayType: 'Normal',
        },
        {
          ingredientID: 7428, displayValue: '1 teaspoon Worcestershire sauce', grams: 5.6666665, displayType: 'Normal',
        },
        {
          ingredientID: 16406, displayValue: '1 teaspoon freshly ground black pepper', grams: 2.1, displayType: 'Normal',
        },
        {
          ingredientID: 16407, displayValue: '1 pinch cayenne pepper, or to taste', grams: 0.2, displayType: 'Normal',
        },
        {
          ingredientID: 16229, displayValue: '4 ounces shredded Gruyere cheese', grams: 113.4, displayType: 'Normal',
        },
        {
          ingredientID: 16246, displayValue: '4 ounces shredded Emmenthaler cheese', grams: 113.4, displayType: 'Normal',
        },
        {
          ingredientID: 9615, displayValue: 'Crackers and bread for serving', grams: 112.0, displayType: 'HideAmounts',
        }],
        servings: 24,
        prepMinutes: 15,
        cookMinutes: 25,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/3253532.jpg',
        id: 246255,
      },
      {
        title: 'Hot Artichoke and Spinach Dip II',
        nutrition: {
          calories: {
            name: 'Calories', amount: 133.9589, unit: 'kcal', displayValue: '134', dailyValue: '134', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 11.7067, unit: 'g', displayValue: '11.7', dailyValue: '11.7', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 27.82667, unit: 'mg', displayValue: '28', dailyValue: '28', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 315.1425, unit: 'mg', displayValue: '315', dailyValue: '315', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 3.393551, unit: 'g', displayValue: '3.4', dailyValue: '3.4', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 4.429709, unit: 'g', displayValue: '4.4', dailyValue: '4.4', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 12.65065, unit: 'mcg', displayValue: '13', dailyValue: '13', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 8.336521, unit: 'mg', displayValue: '8', dailyValue: '8', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.05754188, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 0.7895979, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.01122438, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.4201639, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 88.32954, unit: 'mg', displayValue: '88', dailyValue: '88', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 3.007685, unit: 'mg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 1130.472, unit: 'IU', displayValue: '1130', dailyValue: '1130', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.1912833, unit: 'g', displayValue: '0.2', dailyValue: '0.2', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 54.00764, unit: 'mg', displayValue: '54', dailyValue: '54', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 5.598741, unit: 'g', displayValue: '5.6', dailyValue: '5.6', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 105.3603, unit: 'kcal', displayValue: '105', dailyValue: '105', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.9227177, unit: 'g', displayValue: '0.9', dailyValue: '0.9', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 16223, displayValue: '1 (8 ounce) package cream cheese, softened', grams: 224.0, displayType: 'Normal',
        },
        {
          ingredientID: 6294, displayValue: '1/4 cup mayonnaise', grams: 55.0, displayType: 'Normal',
        },
        {
          ingredientID: 16238, displayValue: '1/4 cup grated Parmesan cheese', grams: 20.0, displayType: 'Normal',
        },
        {
          ingredientID: 16244, displayValue: '1/4 cup grated Romano cheese', grams: 29.75, displayType: 'Normal',
        },
        {
          ingredientID: 4342, displayValue: '1 clove garlic, peeled and minced', grams: 3.0, displayType: 'Normal',
        },
        {
          ingredientID: 18681, displayValue: '1/2 teaspoon dried basil', grams: 0.4416667, displayType: 'Normal',
        },
        {
          ingredientID: 18740, displayValue: '1/4 teaspoon garlic salt', grams: 1.375, displayType: 'Normal',
        },
        {
          ingredientID: 16421, displayValue: 'salt and pepper to taste', grams: 0.0, displayType: 'HideAmounts',
        },
        {
          ingredientID: 126, displayValue: '1 (14 ounce) can artichoke hearts, drained and chopped', grams: 240.0, displayType: 'Normal',
        },
        {
          ingredientID: 4520, displayValue: '1/2 cup frozen chopped spinach, thawed and drained', grams: 78.0, displayType: 'Normal',
        },
        {
          ingredientID: 16234, displayValue: '1/4 cup shredded mozzarella cheese', grams: 28.25, displayType: 'Normal',
        }],
        servings: 12,
        prepMinutes: 15,
        cookMinutes: 25,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/3391875.jpg',
        id: 26819,
      },
      {
        title: 'Seven Layer Taco Dip',
        nutrition: {
          calories: {
            name: 'Calories', amount: 65.59263, unit: 'kcal', displayValue: '66', dailyValue: '66', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 4.897413, unit: 'g', displayValue: '4.9', dailyValue: '4.9', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 12.84779, unit: 'mg', displayValue: '13', dailyValue: '13', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 178.065, unit: 'mg', displayValue: '178', dailyValue: '178', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 3.474792, unit: 'g', displayValue: '3.5', dailyValue: '3.5', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 2.323737, unit: 'g', displayValue: '2.3', dailyValue: '2.3', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 8.288286, unit: 'mcg', displayValue: '8', dailyValue: '8', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 8.002857, unit: 'mg', displayValue: '8', dailyValue: '8', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.04411947, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 0.5346221, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.01825218, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.4495114, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 53.81957, unit: 'mg', displayValue: '54', dailyValue: '54', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 3.771021, unit: 'mg', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 286.5185, unit: 'IU', displayValue: '287', dailyValue: '287', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.7272035, unit: 'g', displayValue: '0.7', dailyValue: '0.7', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 96.43139, unit: 'mg', displayValue: '96', dailyValue: '96', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 2.876228, unit: 'g', displayValue: '2.9', dailyValue: '2.9', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 44.07672, unit: 'kcal', displayValue: '44', dailyValue: '44', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.8940089, unit: 'g', displayValue: '0.9', dailyValue: '0.9', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 18765, displayValue: '1 (1 ounce) package taco seasoning mix', grams: 28.4, displayType: 'Normal',
        },
        {
          ingredientID: 2863, displayValue: '1 (16 ounce) can refried beans', grams: 448.0, displayType: 'Normal',
        },
        {
          ingredientID: 16223, displayValue: '1 (8 ounce) package cream cheese, softened', grams: 224.0, displayType: 'Normal',
        },
        {
          ingredientID: 16261, displayValue: '1 (16 ounce) container sour cream', grams: 454.4, displayType: 'Normal',
        },
        {
          ingredientID: 5588, displayValue: '1 (16 ounce) jar salsa', grams: 448.0, displayType: 'Normal',
        },
        {
          ingredientID: 4572, displayValue: '1 large tomato, chopped', grams: 182.0, displayType: 'Normal',
        },
        {
          ingredientID: 4432, displayValue: '1 green bell pepper, chopped', grams: 119.0, displayType: 'Normal',
        },
        {
          ingredientID: 4405, displayValue: '1 bunch chopped green onions', grams: 225.0, displayType: 'Normal',
        },
        {
          ingredientID: 4372, displayValue: '1 small head iceberg lettuce, shredded', grams: 324.0, displayType: 'Normal',
        },
        {
          ingredientID: 5133, displayValue: '1 (6 ounce) can sliced black olives, drained', grams: 170.4, displayType: 'Normal',
        },
        {
          ingredientID: 16215, displayValue: '2 cups shredded Cheddar cheese', grams: 226.0, displayType: 'Normal',
        }],
        servings: 56,
        prepMinutes: 30,
        cookMinutes: 0,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/246196.jpg',
        id: 19673,
      },
      {
        title: 'Brown Sugar Smokies',
        nutrition: {
          calories: {
            name: 'Calories', amount: 355.69, unit: 'kcal', displayValue: '356', dailyValue: '356', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 27.23213, unit: 'g', displayValue: '27.2', dailyValue: '27.2', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 49.24667, unit: 'mg', displayValue: '49', dailyValue: '49', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 696.2317, unit: 'mg', displayValue: '696', dailyValue: '696', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 18.86753, unit: 'g', displayValue: '18.9', dailyValue: '18.9', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 9.04, unit: 'g', displayValue: '9', dailyValue: '9', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 0.94, unit: 'mcg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 12.53667, unit: 'mg', displayValue: '13', dailyValue: '13', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.08696666, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 2.080065, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.1406933, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.7485666, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 21.22, unit: 'mg', displayValue: '21', dailyValue: '21', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 0.0, unit: 'mg', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 13.99833, unit: 'IU', displayValue: '14', dailyValue: '14', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 18.38433, unit: 'g', displayValue: '18.4', dailyValue: '18.4', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 170.2767, unit: 'mg', displayValue: '170', dailyValue: '170', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 9.174219, unit: 'g', displayValue: '9.2', dailyValue: '9.2', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 245.0892, unit: 'kcal', displayValue: '245', dailyValue: '245', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.0, unit: 'g', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 5375, displayValue: '1 pound bacon', grams: 454.0, displayType: 'Normal',
        },
        {
          ingredientID: 5916, displayValue: '1 (16 ounce) package little smokie sausages', grams: 448.0, displayType: 'Normal',
        },
        {
          ingredientID: 1525, displayValue: '1 cup brown sugar, or to taste', grams: 220.0, displayType: 'Normal',
        }],
        servings: 12,
        prepMinutes: 10,
        cookMinutes: 20,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/580591.jpg',
        id: 14939,
      },
      {
        title: 'Baked Kale Chips',
        nutrition: {
          calories: {
            name: 'Calories', amount: 58.00333, unit: 'kcal', displayValue: '58', dailyValue: '58', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 2.786933, unit: 'g', displayValue: '2.8', dailyValue: '2.8', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 0.0, unit: 'mg', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 185.085, unit: 'mg', displayValue: '185', dailyValue: '185', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 7.6448, unit: 'g', displayValue: '7.6', dailyValue: '7.6', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 2.480667, unit: 'g', displayValue: '2.5', dailyValue: '2.5', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 21.69427, unit: 'mcg', displayValue: '22', dailyValue: '22', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 25.70533, unit: 'mg', displayValue: '26', dailyValue: '26', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.2063933, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 1.255444, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.08213333, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 1.303667, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 103.9825, unit: 'mg', displayValue: '104', dailyValue: '104', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 89.65267, unit: 'mg', displayValue: '90', dailyValue: '90', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 11521.15, unit: 'IU', displayValue: '11521', dailyValue: '11521', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.0, unit: 'g', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 337.1891, unit: 'mg', displayValue: '337', dailyValue: '337', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 0.3802734, unit: 'g', displayValue: '0.4', dailyValue: '0.4', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 25.0824, unit: 'kcal', displayValue: '25', dailyValue: '25', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 1.510133, unit: 'g', displayValue: '1.5', dailyValue: '1.5', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 4357, displayValue: '1 bunch kale', grams: 448.0, displayType: 'Normal',
        },
        {
          ingredientID: 6307, displayValue: '1 tablespoon olive oil', grams: 13.5, displayType: 'Normal',
        },
        {
          ingredientID: 18741, displayValue: '1 teaspoon seasoned salt', grams: 4.0, displayType: 'Normal',
        }],
        servings: 6,
        prepMinutes: 10,
        cookMinutes: 10,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/490832.jpg',
        id: 176957,
      },
      {
        title: "Di's Delicious Deluxe Deviled Eggs",
        nutrition: {
          calories: {
            name: 'Calories', amount: 69.835, unit: 'kcal', displayValue: '70', dailyValue: '70', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 6.129425, unit: 'g', displayValue: '6.1', dailyValue: '6.1', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 94.74167, unit: 'mg', displayValue: '95', dailyValue: '95', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 62.98417, unit: 'mg', displayValue: '63', dailyValue: '63', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 0.5976501, unit: 'g', displayValue: '0.6', dailyValue: '0.6', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 3.223575, unit: 'g', displayValue: '3.2', dailyValue: '3.2', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 13.0075, unit: 'mcg', displayValue: '13', dailyValue: '13', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 3.464167, unit: 'mg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.06625751, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 0.723843, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.01723833, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.4766083, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 14.765, unit: 'mg', displayValue: '15', dailyValue: '15', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 0.2219167, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 143.4783, unit: 'IU', displayValue: '143', dailyValue: '143', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.3639179, unit: 'g', displayValue: '0.4', dailyValue: '0.4', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 41.775, unit: 'mg', displayValue: '42', dailyValue: '42', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 1.321213, unit: 'g', displayValue: '1.3', dailyValue: '1.3', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 55.16483, unit: 'kcal', displayValue: '55', dailyValue: '55', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.06184038, unit: 'g', displayValue: '0.1', dailyValue: '0.1', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 16317, displayValue: '6 eggs', grams: 300.0, displayType: 'Normal',
        },
        {
          ingredientID: 4292, displayValue: '1/2 stalk celery, finely chopped', grams: 20.0, displayType: 'Normal',
        },
        {
          ingredientID: 4397, displayValue: '1/4 onion, finely chopped', grams: 27.5, displayType: 'Normal',
        },
        {
          ingredientID: 6294, displayValue: '1/4 cup mayonnaise', grams: 55.0, displayType: 'Normal',
        },
        {
          ingredientID: 16421, displayValue: 'salt to taste', grams: 0.0, displayType: 'HideAmounts',
        },
        {
          ingredientID: 5593, displayValue: '1 dash hot pepper sauce', grams: 1.0, displayType: 'Normal',
        },
        {
          ingredientID: 16404, displayValue: 'paprika, for garnish', grams: 0.0, displayType: 'HideAmounts',
        }],
        servings: 12,
        prepMinutes: 20,
        cookMinutes: 15,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/34099.jpg',
        id: 25532,
      },
      {
        title: 'Asian Lettuce Wraps',
        nutrition: {
          calories: {
            name: 'Calories', amount: 388.0127, unit: 'kcal', displayValue: '388', dailyValue: '388', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 22.28075, unit: 'g', displayValue: '22.3', dailyValue: '22.3', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 68.936, unit: 'mg', displayValue: '69', dailyValue: '69', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 579.5887, unit: 'mg', displayValue: '580', dailyValue: '580', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 24.32978, unit: 'g', displayValue: '24.3', dailyValue: '24.3', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 23.36795, unit: 'g', displayValue: '23.4', dailyValue: '23.4', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 101.9043, unit: 'mcg', displayValue: '102', dailyValue: '102', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 47.833, unit: 'mg', displayValue: '48', dailyValue: '48', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.4803848, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 9.103194, unit: 'mg', displayValue: '9', dailyValue: '9', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.1346322, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 4.205057, unit: 'mg', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 90.28983, unit: 'mg', displayValue: '90', dailyValue: '90', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 16.90447, unit: 'mg', displayValue: '17', dailyValue: '17', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 2579.891, unit: 'IU', displayValue: '2580', dailyValue: '2580', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 9.583812, unit: 'g', displayValue: '9.6', dailyValue: '9.6', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 699.218, unit: 'mg', displayValue: '699', dailyValue: '699', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 7.169603, unit: 'g', displayValue: '7.2', dailyValue: '7.2', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 200.5267, unit: 'kcal', displayValue: '201', dailyValue: '201', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 4.714183, unit: 'g', displayValue: '4.7', dailyValue: '4.7', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 4370, displayValue: '16 Boston Bibb or butter lettuce leaves', grams: 240.0, displayType: 'Normal',
        },
        {
          ingredientID: 4147, displayValue: '1 pound lean ground beef', grams: 454.0, displayType: 'Normal',
        },
        {
          ingredientID: 6305, displayValue: '1 tablespoon cooking oil', grams: 13.625, displayType: 'Normal',
        },
        {
          ingredientID: 4397, displayValue: '1 large onion, chopped', grams: 150.0, displayType: 'Normal',
        },
        {
          ingredientID: 5595, displayValue: '1/4 cup hoisin sauce', grams: 63.466667, displayType: 'Normal',
        },
        {
          ingredientID: 4342, displayValue: '2 cloves fresh garlic, minced', grams: 6.0, displayType: 'Normal',
        },
        {
          ingredientID: 2882, displayValue: '1 tablespoon soy sauce', grams: 16.0, displayType: 'Normal',
        },
        {
          ingredientID: 18868, displayValue: '1 tablespoon rice wine vinegar', grams: 15.884933, displayType: 'Normal',
        },
        {
          ingredientID: 18865, displayValue: '2 teaspoons minced pickled ginger', grams: 10.0, displayType: 'Normal',
        },
        {
          ingredientID: 7818, displayValue: '1 dash Asian chile pepper sauce, or to taste (optional)', grams: 1.0, displayType: 'OptionalIngredient',
        },
        {
          ingredientID: 4607, displayValue: '1 (8 ounce) can water chestnuts, drained and finely chopped', grams: 224.0, displayType: 'Normal',
        },
        {
          ingredientID: 4405, displayValue: '1 bunch green onions, chopped', grams: 225.0, displayType: 'Normal',
        },
        {
          ingredientID: 9722, displayValue: '2 teaspoons Asian (dark) sesame oil', grams: 10.0, displayType: 'Normal',
        }],
        servings: 4,
        prepMinutes: 20,
        cookMinutes: 15,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/2630776.jpg',
        id: 71722,
      },
      {
        title: 'Hummus III',
        nutrition: {
          calories: {
            name: 'Calories', amount: 77.07314, unit: 'kcal', displayValue: '77', dailyValue: '77', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 4.341336, unit: 'g', displayValue: '4.3', dailyValue: '4.3', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 0.0, unit: 'mg', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 236.4481, unit: 'mg', displayValue: '236', dailyValue: '236', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 8.083277, unit: 'g', displayValue: '8.1', dailyValue: '8.1', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 2.57082, unit: 'g', displayValue: '2.6', dailyValue: '2.6', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 20.79188, unit: 'mcg', displayValue: '21', dailyValue: '21', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 9.180939, unit: 'mg', displayValue: '9', dailyValue: '9', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.1510584, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 0.5592117, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.01106406, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.5815063, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 16.8125, unit: 'mg', displayValue: '17', dailyValue: '17', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 3.159094, unit: 'mg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 47.53687, unit: 'IU', displayValue: '48', dailyValue: '48', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.1023766, unit: 'g', displayValue: '0.1', dailyValue: '0.1', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 79.105, unit: 'mg', displayValue: '79', dailyValue: '79', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 0.5945919, unit: 'g', displayValue: '0.6', dailyValue: '0.6', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 39.07203, unit: 'kcal', displayValue: '39', dailyValue: '39', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 1.863141, unit: 'g', displayValue: '1.9', dailyValue: '1.9', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 2819, displayValue: '2 cups canned garbanzo beans, drained', grams: 480.0, displayType: 'Normal',
        },
        {
          ingredientID: 10841, displayValue: '1/3 cup tahini', grams: 84.99999, displayType: 'Normal',
        },
        {
          ingredientID: 5107, displayValue: '1/4 cup lemon juice', grams: 61.0, displayType: 'Normal',
        },
        {
          ingredientID: 16421, displayValue: '1 teaspoon salt', grams: 6.0, displayType: 'Normal',
        },
        {
          ingredientID: 4342, displayValue: '2 cloves garlic, halved', grams: 6.0, displayType: 'Normal',
        },
        {
          ingredientID: 6307, displayValue: '1 tablespoon olive oil', grams: 13.5, displayType: 'Normal',
        },
        {
          ingredientID: 16404, displayValue: '1 pinch paprika', grams: 1.0, displayType: 'Normal',
        },
        {
          ingredientID: 4409, displayValue: '1 teaspoon minced fresh parsley', grams: 1.25, displayType: 'Normal',
        }],
        servings: 16,
        prepMinutes: 10,
        cookMinutes: 0,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/414663.jpg',
        id: 14830,
      },
      {
        title: 'Sugar Coated Pecans',
        nutrition: {
          calories: {
            name: 'Calories', amount: 327.5011, unit: 'kcal', displayValue: '328', dailyValue: '328', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 27.22984, unit: 'g', displayValue: '27.2', dailyValue: '27.2', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 0.0, unit: 'mg', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 150.0094, unit: 'mg', displayValue: '150', dailyValue: '150', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 22.00458, unit: 'g', displayValue: '22', dailyValue: '22', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 3.776524, unit: 'g', displayValue: '3.8', dailyValue: '3.8', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 8.440417, unit: 'mcg', displayValue: '8', dailyValue: '8', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 46.15807, unit: 'mg', displayValue: '46', dailyValue: '46', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.07974058, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 1.086691, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.2499408, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.9702874, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 27.93205, unit: 'mg', displayValue: '28', dailyValue: '28', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 0.4198083, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 21.46938, unit: 'IU', displayValue: '21', dailyValue: '21', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 18.17549, unit: 'g', displayValue: '18.2', dailyValue: '18.2', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 160.4422, unit: 'mg', displayValue: '160', dailyValue: '160', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 2.338431, unit: 'g', displayValue: '2.3', dailyValue: '2.3', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 245.0686, unit: 'kcal', displayValue: '245', dailyValue: '245', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 3.682888, unit: 'g', displayValue: '3.7', dailyValue: '3.7', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 16318, displayValue: '1 egg white', grams: 33.4, displayType: 'Normal',
        },
        {
          ingredientID: 2496, displayValue: '1 tablespoon water', grams: 14.785, displayType: 'Normal',
        },
        {
          ingredientID: 3810, displayValue: '1 pound pecan halves', grams: 454.0, displayType: 'Normal',
        },
        {
          ingredientID: 1526, displayValue: '1 cup white sugar', grams: 200.0, displayType: 'Normal',
        },
        {
          ingredientID: 16421, displayValue: '3/4 teaspoon salt', grams: 4.5, displayType: 'Normal',
        },
        {
          ingredientID: 16386, displayValue: '1/2 teaspoon ground cinnamon', grams: 1.15, displayType: 'Normal',
        }],
        servings: 12,
        prepMinutes: 0,
        cookMinutes: 0,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/403891.jpg',
        id: 13838,
      },
      {
        title: 'Coconut Shrimp I',
        nutrition: {
          calories: {
            name: 'Calories', amount: 316.5829, unit: 'kcal', displayValue: '317', dailyValue: '317', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 19.30086, unit: 'g', displayValue: '19.3', dailyValue: '19.3', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 67.48, unit: 'mg', displayValue: '67', dailyValue: '67', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 240.8175, unit: 'mg', displayValue: '241', dailyValue: '241', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 26.30671, unit: 'g', displayValue: '26.3', dailyValue: '26.3', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 8.437467, unit: 'g', displayValue: '8.4', dailyValue: '8.4', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 35.64787, unit: 'mcg', displayValue: '36', dailyValue: '36', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 27.88545, unit: 'mg', displayValue: '28', dailyValue: '28', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.06401211, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 3.619894, unit: 'mg', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.1436204, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 1.960688, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 90.64605, unit: 'mg', displayValue: '91', dailyValue: '91', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 0.48, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 83.78334, unit: 'IU', displayValue: '84', dailyValue: '84', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 9.171354, unit: 'g', displayValue: '9.2', dailyValue: '9.2', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 169.1106, unit: 'mg', displayValue: '169', dailyValue: '169', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 8.268031, unit: 'g', displayValue: '8.3', dailyValue: '8.3', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 173.7077, unit: 'kcal', displayValue: '174', dailyValue: '174', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 2.866175, unit: 'g', displayValue: '2.9', dailyValue: '2.9', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 16317, displayValue: '1 egg', grams: 50.0, displayType: 'Normal',
        },
        {
          ingredientID: 1684, displayValue: '1/2 cup all-purpose flour', grams: 62.5, displayType: 'Normal',
        },
        {
          ingredientID: 3452, displayValue: '2/3 cup beer', grams: 167.7449, displayType: 'Normal',
        },
        {
          ingredientID: 2356, displayValue: '1 1/2 teaspoons baking powder', grams: 6.8999996, displayType: 'Normal',
        },
        {
          ingredientID: 1684, displayValue: '1/4 cup all-purpose flour', grams: 31.25, displayType: 'Normal',
        },
        {
          ingredientID: 3789, displayValue: '2 cups flaked coconut', grams: 148.0, displayType: 'Normal',
        },
        {
          ingredientID: 2664, displayValue: '24 shrimp', grams: 144.0, displayType: 'Normal',
        },
        {
          ingredientID: 20482, displayValue: '3 cups oil for frying', grams: 660.0, displayType: 'Normal',
        }],
        servings: 6,
        prepMinutes: 10,
        cookMinutes: 20,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/3494547.jpg',
        id: 17753,
      },
      {
        title: 'Best Guacamole',
        nutrition: {
          calories: {
            name: 'Calories', amount: 56.2925, unit: 'kcal', displayValue: '56', dailyValue: '56', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 5.3822, unit: 'g', displayValue: '5.4', dailyValue: '5.4', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 0.0, unit: 'mg', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 74.615, unit: 'mg', displayValue: '75', dailyValue: '75', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 2.621037, unit: 'g', displayValue: '2.6', dailyValue: '2.6', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 0.55675, unit: 'g', displayValue: '0.6', dailyValue: '0.6', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 20.825, unit: 'mcg', displayValue: '21', dailyValue: '21', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 7.818125, unit: 'mg', displayValue: '8', dailyValue: '8', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.06975, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 0.5524767, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.0293475, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.1745062, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 5.423125, unit: 'mg', displayValue: '5', dailyValue: '5', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 5.20375, unit: 'mg', displayValue: '5', dailyValue: '5', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 37.72, unit: 'IU', displayValue: '38', dailyValue: '38', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.218825, unit: 'g', displayValue: '0.2', dailyValue: '0.2', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 128.6069, unit: 'mg', displayValue: '129', dailyValue: '129', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 0.7690088, unit: 'g', displayValue: '0.8', dailyValue: '0.8', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 48.4398, unit: 'kcal', displayValue: '48', dailyValue: '48', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 1.86325, unit: 'g', displayValue: '1.9', dailyValue: '1.9', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 5012, displayValue: '2 avocados', grams: 402.0, displayType: 'Normal',
        },
        {
          ingredientID: 5106, displayValue: '1/2 lemon, juiced', grams: 54.0, displayType: 'Normal',
        },
        {
          ingredientID: 4397, displayValue: '2 tablespoons chopped onion', grams: 20.0, displayType: 'Normal',
        },
        {
          ingredientID: 16421, displayValue: '1/2 teaspoon salt', grams: 3.0, displayType: 'Normal',
        },
        {
          ingredientID: 6307, displayValue: '2 tablespoons olive oil', grams: 27.0, displayType: 'Normal',
        }],
        servings: 16,
        prepMinutes: 5,
        cookMinutes: 0,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/363326.jpg',
        id: 14837,
      },
      {
        title: 'Playgroup Granola Bars',
        nutrition: {
          calories: {
            name: 'Calories', amount: 160.5231, unit: 'kcal', displayValue: '161', dailyValue: '161', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 5.497594, unit: 'g', displayValue: '5.5', dailyValue: '5.5', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 7.75, unit: 'mg', displayValue: '8', dailyValue: '8', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 79.19896, unit: 'mg', displayValue: '79', dailyValue: '79', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 26.55082, unit: 'g', displayValue: '26.6', dailyValue: '26.6', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 2.433183, unit: 'g', displayValue: '2.4', dailyValue: '2.4', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 19.87483, unit: 'mcg', displayValue: '20', dailyValue: '20', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 18.93521, unit: 'mg', displayValue: '19', dailyValue: '19', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.05685974, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 1.152698, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.1452305, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.9013613, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 15.84283, unit: 'mg', displayValue: '16', dailyValue: '16', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 0.1566375, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 10.35787, unit: 'IU', displayValue: '10', dailyValue: '10', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 15.666, unit: 'g', displayValue: '15.7', dailyValue: '15.7', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 106.4662, unit: 'mg', displayValue: '106', dailyValue: '106', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 0.9014966, unit: 'g', displayValue: '0.9', dailyValue: '0.9', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 49.47834, unit: 'kcal', displayValue: '49', dailyValue: '49', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 1.381697, unit: 'g', displayValue: '1.4', dailyValue: '1.4', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 6057, displayValue: '2 cups rolled oats', grams: 162.0, displayType: 'Normal',
        },
        {
          ingredientID: 1525, displayValue: '3/4 cup packed brown sugar', grams: 165.0, displayType: 'Normal',
        },
        {
          ingredientID: 1682, displayValue: '1/2 cup wheat germ', grams: 57.5, displayType: 'Normal',
        },
        {
          ingredientID: 16386, displayValue: '3/4 teaspoon ground cinnamon', grams: 1.7249999, displayType: 'Normal',
        },
        {
          ingredientID: 1684, displayValue: '1 cup all-purpose flour', grams: 125.0, displayType: 'Normal',
        },
        {
          ingredientID: 5219, displayValue: '3/4 cup raisins (optional)', grams: 123.75, displayType: 'OptionalIngredient',
        },
        {
          ingredientID: 16421, displayValue: '3/4 teaspoon salt', grams: 4.5, displayType: 'Normal',
        },
        {
          ingredientID: 1502, displayValue: '1/2 cup honey', grams: 169.5, displayType: 'Normal',
        },
        {
          ingredientID: 16317, displayValue: '1 egg, beaten', grams: 50.0, displayType: 'Normal',
        },
        {
          ingredientID: 6305, displayValue: '1/2 cup vegetable oil', grams: 109.0, displayType: 'Normal',
        },
        {
          ingredientID: 16424, displayValue: '2 teaspoons vanilla extract', grams: 8.666667, displayType: 'Normal',
        }],
        servings: 24,
        prepMinutes: 15,
        cookMinutes: 35,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/125805.jpg',
        id: 81298,
      },
      {
        title: 'Cocktail Meatballs',
        nutrition: {
          calories: {
            name: 'Calories', amount: 193.2175, unit: 'kcal', displayValue: '193', dailyValue: '193', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 10.20398, unit: 'g', displayValue: '10.2', dailyValue: '10.2', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 52.65, unit: 'mg', displayValue: '53', dailyValue: '53', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 84.94669, unit: 'mg', displayValue: '85', dailyValue: '85', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 15.21971, unit: 'g', displayValue: '15.2', dailyValue: '15.2', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 9.763652, unit: 'g', displayValue: '9.8', dailyValue: '9.8', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 12.67237, unit: 'mcg', displayValue: '13', dailyValue: '13', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 12.26605, unit: 'mg', displayValue: '12', dailyValue: '12', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.1348874, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 4.374909, unit: 'mg', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.0720804, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 1.437355, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 19.02131, unit: 'mg', displayValue: '19', dailyValue: '19', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 9.140838, unit: 'mg', displayValue: '9', dailyValue: '9', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 33.97923, unit: 'IU', displayValue: '34', dailyValue: '34', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 10.32584, unit: 'g', displayValue: '10.3', dailyValue: '10.3', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 183.3158, unit: 'mg', displayValue: '183', dailyValue: '183', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 3.996824, unit: 'g', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 91.83582, unit: 'kcal', displayValue: '92', dailyValue: '92', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.5212247, unit: 'g', displayValue: '0.5', dailyValue: '0.5', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 4147, displayValue: '1 pound lean ground beef', grams: 454.0, displayType: 'Normal',
        },
        {
          ingredientID: 16317, displayValue: '1 egg', grams: 50.0, displayType: 'Normal',
        },
        {
          ingredientID: 2496, displayValue: '2 tablespoons water', grams: 29.57, displayType: 'Normal',
        },
        {
          ingredientID: 2112, displayValue: '1/2 cup bread crumbs', grams: 54.0, displayType: 'Normal',
        },
        {
          ingredientID: 4397, displayValue: '3 tablespoons minced onion', grams: 30.0, displayType: 'Normal',
        },
        {
          ingredientID: 0, displayValue: '', grams: 0.0, displayType: 'BlankLine',
        },
        {
          ingredientID: 5045, displayValue: '1 (8 ounce) can jellied cranberry sauce', grams: 224.0, displayType: 'Normal',
        },
        {
          ingredientID: 18901, displayValue: '3/4 cup chili sauce', grams: 102.0, displayType: 'Normal',
        },
        {
          ingredientID: 1525, displayValue: '1 tablespoon brown sugar', grams: 13.568282, displayType: 'Normal',
        },
        {
          ingredientID: 5107, displayValue: '1 1/2 teaspoons lemon juice', grams: 8.061674, displayType: 'Normal',
        }],
        servings: 10,
        prepMinutes: 20,
        cookMinutes: 85,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/1066728.jpg',
        id: 15206,
      },
      {
        title: 'Bacon Wrapped Smokies',
        nutrition: {
          calories: {
            name: 'Calories', amount: 163.1241, unit: 'kcal', displayValue: '163', dailyValue: '163', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 10.51329, unit: 'g', displayValue: '10.5', dailyValue: '10.5', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 25.65075, unit: 'mg', displayValue: '26', dailyValue: '26', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 458.3058, unit: 'mg', displayValue: '458', dailyValue: '458', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 10.73327, unit: 'g', displayValue: '10.7', dailyValue: '10.7', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 6.50585, unit: 'g', displayValue: '6.5', dailyValue: '6.5', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 3.022875, unit: 'mcg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 7.72875, unit: 'mg', displayValue: '8', dailyValue: '8', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.03672875, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 1.534383, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.0652675, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.6421938, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 12.31725, unit: 'mg', displayValue: '12', dailyValue: '12', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 0.0, unit: 'mg', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 3.445625, unit: 'IU', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 10.35309, unit: 'g', displayValue: '10.4', dailyValue: '10.4', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 109.3217, unit: 'mg', displayValue: '109', dailyValue: '109', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 4.075069, unit: 'g', displayValue: '4.1', dailyValue: '4.1', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 94.61959, unit: 'kcal', displayValue: '95', dailyValue: '95', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.0, unit: 'g', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 5375, displayValue: '1 pound sliced bacon, cut into thirds', grams: 454.0, displayType: 'Normal',
        },
        {
          ingredientID: 5917, displayValue: '1 (14 ounce) package beef cocktail wieners', grams: 397.6, displayType: 'Normal',
        },
        {
          ingredientID: 1525, displayValue: '3/4 cup brown sugar, or to taste', grams: 165.0, displayType: 'Normal',
        }],
        servings: 16,
        prepMinutes: 45,
        cookMinutes: 45,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/581356.jpg',
        id: 69919,
      },
      {
        title: 'Southwestern Egg Rolls',
        nutrition: {
          calories: {
            name: 'Calories', amount: 419.1858, unit: 'kcal', displayValue: '419', dailyValue: '419', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 31.24528, unit: 'g', displayValue: '31.2', dailyValue: '31.2', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 28.7735, unit: 'mg', displayValue: '29', dailyValue: '29', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 575.111, unit: 'mg', displayValue: '575', dailyValue: '575', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 21.82087, unit: 'g', displayValue: '21.8', dailyValue: '21.8', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 13.64485, unit: 'g', displayValue: '13.6', dailyValue: '13.6', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 58.81135, unit: 'mcg', displayValue: '59', dailyValue: '59', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 30.22916, unit: 'mg', displayValue: '30', dailyValue: '30', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.2227106, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 6.87267, unit: 'mg', displayValue: '7', dailyValue: '7', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.2260791, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 2.031861, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 186.1321, unit: 'mg', displayValue: '186', dailyValue: '186', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 7.781115, unit: 'mg', displayValue: '8', dailyValue: '8', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 942.5014, unit: 'IU', displayValue: '943', dailyValue: '943', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 1.401779, unit: 'g', displayValue: '1.4', dailyValue: '1.4', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 229.7563, unit: 'mg', displayValue: '230', dailyValue: '230', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 7.04276, unit: 'g', displayValue: '7', dailyValue: '7', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 281.2075, unit: 'kcal', displayValue: '281', dailyValue: '281', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 2.557664, unit: 'g', displayValue: '2.6', dailyValue: '2.6', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 6305, displayValue: '2 tablespoons vegetable oil', grams: 27.25, displayType: 'Normal',
        },
        {
          ingredientID: 6494, displayValue: '1 skinless, boneless chicken breast half', grams: 118.0, displayType: 'Normal',
        },
        {
          ingredientID: 4405, displayValue: '2 tablespoons minced green onion', grams: 12.0, displayType: 'Normal',
        },
        {
          ingredientID: 4786, displayValue: '2 tablespoons minced red bell pepper', grams: 18.6, displayType: 'Normal',
        },
        {
          ingredientID: 4317, displayValue: '1/3 cup frozen corn kernels', grams: 54.666664, displayType: 'Normal',
        },
        {
          ingredientID: 2779, displayValue: '1/4 cup black beans, rinsed and drained', grams: 60.0, displayType: 'Normal',
        },
        {
          ingredientID: 4520, displayValue: '2 tablespoons frozen chopped spinach, thawed and drained', grams: 19.5, displayType: 'Normal',
        },
        {
          ingredientID: 4634, displayValue: '2 tablespoons diced jalapeno peppers', grams: 17.142857, displayType: 'Normal',
        },
        {
          ingredientID: 4409, displayValue: '1/2 tablespoon minced fresh parsley', grams: 1.875, displayType: 'Normal',
        },
        {
          ingredientID: 20551, displayValue: '1/2 teaspoon ground cumin', grams: 1.05, displayType: 'Normal',
        },
        {
          ingredientID: 16385, displayValue: '1/2 teaspoon chili powder', grams: 1.3237444, displayType: 'Normal',
        },
        {
          ingredientID: 16421, displayValue: '1/3 teaspoon salt', grams: 1.9999999, displayType: 'Normal',
        },
        {
          ingredientID: 16407, displayValue: '1 pinch ground cayenne pepper', grams: 0.2, displayType: 'Normal',
        },
        {
          ingredientID: 16231, displayValue: '3/4 cup shredded Monterey Jack cheese', grams: 84.75, displayType: 'Normal',
        },
        {
          ingredientID: 20467, displayValue: '5 (6 inch) flour tortillas', grams: 160.0, displayType: 'Normal',
        },
        {
          ingredientID: 20482, displayValue: '1 quart oil for deep frying', grams: 880.0, displayType: 'Normal',
        }],
        servings: 5,
        prepMinutes: 20,
        cookMinutes: 12,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/1119294.jpg',
        id: 25502,
      },
      {
        title: 'Sausage-Stuffed Cherry Pepper Poppers ',
        nutrition: {
          calories: {
            name: 'Calories', amount: 52.48769, unit: 'kcal', displayValue: '52', dailyValue: '52', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 1.629028, unit: 'g', displayValue: '1.6', dailyValue: '1.6', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 2.77875, unit: 'mg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 125.0191, unit: 'mg', displayValue: '125', dailyValue: '125', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 7.65251, unit: 'g', displayValue: '7.7', dailyValue: '7.7', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 0.9332601, unit: 'g', displayValue: '0.9', dailyValue: '0.9', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 0.303125, unit: 'mcg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 0.8970312, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.01612266, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 0.3346621, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.03040485, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.07379957, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 1.08063, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 0.05682813, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 4.850625, unit: 'IU', displayValue: '5', dailyValue: '5', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 6.657258, unit: 'g', displayValue: '6.7', dailyValue: '6.7', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 15.03938, unit: 'mg', displayValue: '15', dailyValue: '15', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 0.5059418, unit: 'g', displayValue: '0.5', dailyValue: '0.5', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 14.66125, unit: 'kcal', displayValue: '15', dailyValue: '15', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.833039, unit: 'g', displayValue: '0.8', dailyValue: '0.8', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 5838, displayValue: '1/2 pound Italian sausage, casings removed', grams: 227.0, displayType: 'Normal',
        },
        {
          ingredientID: 24885, displayValue: '2 (14 ounce) jars pickled red peppers (such as Peppadew®), drained', grams: 793.8, displayType: 'Normal',
        },
        {
          ingredientID: 6307, displayValue: '2 teaspoons olive oil, divided', grams: 9.515418, displayType: 'Normal',
        },
        {
          ingredientID: 4409, displayValue: '1 teaspoon chopped fresh parsley (optional)', grams: 1.25, displayType: 'OptionalIngredient',
        }],
        servings: 32,
        prepMinutes: 15,
        cookMinutes: 20,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/1059554.jpg',
        id: 234940,
      },
      {
        title: 'Spicy Bean Salsa',
        nutrition: {
          calories: {
            name: 'Calories', amount: 155.0314, unit: 'kcal', displayValue: '155', dailyValue: '155', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 6.448238, unit: 'g', displayValue: '6.4', dailyValue: '6.4', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 0.0, unit: 'mg', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 948.8672, unit: 'mg', displayValue: '949', dailyValue: '949', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 20.40184, unit: 'g', displayValue: '20.4', dailyValue: '20.4', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 5.023839, unit: 'g', displayValue: '5', dailyValue: '5', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 36.11463, unit: 'mcg', displayValue: '36', dailyValue: '36', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 18.40888, unit: 'mg', displayValue: '18', dailyValue: '18', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.09685667, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 0.8458322, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.05101917, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 1.843196, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 25.30594, unit: 'mg', displayValue: '25', dailyValue: '25', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 11.55982, unit: 'mg', displayValue: '12', dailyValue: '12', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 340.8413, unit: 'IU', displayValue: '341', dailyValue: '341', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 4.130286, unit: 'g', displayValue: '4.1', dailyValue: '4.1', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 155.8554, unit: 'mg', displayValue: '156', dailyValue: '156', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 1.002652, unit: 'g', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 58.03414, unit: 'kcal', displayValue: '58', dailyValue: '58', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 4.415023, unit: 'g', displayValue: '4.4', dailyValue: '4.4', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 2825, displayValue: '1 (15 ounce) can black-eyed peas', grams: 420.0, displayType: 'Normal',
        },
        {
          ingredientID: 10046, displayValue: '1 (15 ounce) can black beans, rinsed and drained', grams: 420.0, displayType: 'Normal',
        },
        {
          ingredientID: 4314, displayValue: '1 (15 ounce) can whole kernel corn, drained', grams: 420.0, displayType: 'Normal',
        },
        {
          ingredientID: 4397, displayValue: '1/2 cup chopped onion', grams: 80.0, displayType: 'Normal',
        },
        {
          ingredientID: 4432, displayValue: '1/2 cup chopped green bell pepper', grams: 74.5, displayType: 'Normal',
        },
        {
          ingredientID: 4634, displayValue: '1 (4 ounce) can diced jalapeno peppers', grams: 112.0, displayType: 'Normal',
        },
        {
          ingredientID: 10214, displayValue: '1 (14.5 ounce) can diced tomatoes, drained', grams: 392.0, displayType: 'Normal',
        },
        {
          ingredientID: 6344, displayValue: '1 cup Italian-style salad dressing', grams: 235.0, displayType: 'Normal',
        },
        {
          ingredientID: 18740, displayValue: '1/2 teaspoon garlic salt', grams: 2.75, displayType: 'Normal',
        }],
        servings: 12,
        prepMinutes: 10,
        cookMinutes: 0,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/792466.jpg',
        id: 14861,
      },
      {
        title: 'Grilled Marinated Shrimp',
        nutrition: {
          calories: {
            name: 'Calories', amount: 447.1133, unit: 'kcal', displayValue: '447', dailyValue: '447', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 37.45007, unit: 'g', displayValue: '37.5', dailyValue: '37.5', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 230.425, unit: 'mg', displayValue: '230', dailyValue: '230', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 799.9728, unit: 'mg', displayValue: '800', dailyValue: '800', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 3.722218, unit: 'g', displayValue: '3.7', dailyValue: '3.7', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 25.32825, unit: 'g', displayValue: '25.3', dailyValue: '25.3', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 11.84092, unit: 'mcg', displayValue: '12', dailyValue: '12', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 47.36982, unit: 'mg', displayValue: '47', dailyValue: '47', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.210867, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 9.042083, unit: 'mg', displayValue: '9', dailyValue: '9', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.05873884, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 4.586741, unit: 'mg', displayValue: '5', dailyValue: '5', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 74.58617, unit: 'mg', displayValue: '75', dailyValue: '75', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 24.65487, unit: 'mg', displayValue: '25', dailyValue: '25', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 566.3735, unit: 'IU', displayValue: '566', dailyValue: '566', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.4471373, unit: 'g', displayValue: '0.4', dailyValue: '0.4', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 308.3603, unit: 'mg', displayValue: '308', dailyValue: '308', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 5.345896, unit: 'g', displayValue: '5.3', dailyValue: '5.3', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 337.0506, unit: 'kcal', displayValue: '337', dailyValue: '337', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 1.391638, unit: 'g', displayValue: '1.4', dailyValue: '1.4', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 6307, displayValue: '1 cup olive oil', grams: 216.0, displayType: 'Normal',
        },
        {
          ingredientID: 4409, displayValue: '1/4 cup chopped fresh parsley', grams: 15.0, displayType: 'Normal',
        },
        {
          ingredientID: 5106, displayValue: '1 lemon, juiced', grams: 108.0, displayType: 'Normal',
        },
        {
          ingredientID: 5592, displayValue: '2 tablespoons hot pepper sauce', grams: 27.965, displayType: 'Normal',
        },
        {
          ingredientID: 4342, displayValue: '3 cloves garlic, minced', grams: 9.0, displayType: 'Normal',
        },
        {
          ingredientID: 3640, displayValue: '1 tablespoon tomato paste', grams: 16.23009, displayType: 'Normal',
        },
        {
          ingredientID: 16403, displayValue: '2 teaspoons dried oregano', grams: 3.0, displayType: 'Normal',
        },
        {
          ingredientID: 16421, displayValue: '1 teaspoon salt', grams: 6.0, displayType: 'Normal',
        },
        {
          ingredientID: 16406, displayValue: '1 teaspoon ground black pepper', grams: 2.1, displayType: 'Normal',
        },
        {
          ingredientID: 2664, displayValue: '2 pounds large shrimp, peeled and deveined with tails attached', grams: 908.0, displayType: 'Normal',
        },
        {
          ingredientID: 23043, displayValue: 'skewers', grams: 6.0, displayType: 'HideAmounts',
        }],
        servings: 6,
        prepMinutes: 30,
        cookMinutes: 10,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/667049.jpg',
        id: 19484,
      },
      {
        title: 'Kettle Corn',
        nutrition: {
          calories: {
            name: 'Calories', amount: 209.266, unit: 'kcal', displayValue: '209', dailyValue: '209', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 11.8635, unit: 'g', displayValue: '11.9', dailyValue: '11.9', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 0.0, unit: 'mg', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 0.615, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 24.7785, unit: 'g', displayValue: '24.8', dailyValue: '24.8', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 2.4395, unit: 'g', displayValue: '2.4', dailyValue: '2.4', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 0.0, unit: 'mcg', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 0.0, unit: 'mg', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.0, unit: 'mg', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 0.0, unit: 'mg', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.0, unit: 'mg', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.51895, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 2.15, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 0.0, unit: 'mg', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 0.0, unit: 'IU', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 10.2575, unit: 'g', displayValue: '10.3', dailyValue: '10.3', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 58.42, unit: 'mg', displayValue: '58', dailyValue: '58', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 1.8022, unit: 'g', displayValue: '1.8', dailyValue: '1.8', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 106.7715, unit: 'kcal', displayValue: '107', dailyValue: '107', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 2.911, unit: 'g', displayValue: '2.9', dailyValue: '2.9', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 6305, displayValue: '1/4 cup vegetable oil', grams: 54.5, displayType: 'Normal',
        },
        {
          ingredientID: 1526, displayValue: '1/4 cup white sugar', grams: 50.0, displayType: 'Normal',
        },
        {
          ingredientID: 6767, displayValue: '1/2 cup unpopped popcorn kernels', grams: 102.5, displayType: 'Normal',
        }],
        servings: 5,
        prepMinutes: 5,
        cookMinutes: 15,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/699723.jpg',
        id: 20808,
      },
      {
        title: 'Japanese Chicken Wings',
        nutrition: {
          calories: {
            name: 'Calories', amount: 675.3232, unit: 'kcal', displayValue: '675', dailyValue: '675', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 44.28141, unit: 'g', displayValue: '44.3', dailyValue: '44.3', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 158.2417, unit: 'mg', displayValue: '158', dailyValue: '158', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 1112.459, unit: 'mg', displayValue: '1112', dailyValue: '1112', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 51.44283, unit: 'g', displayValue: '51.4', dailyValue: '51.4', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 18.85894, unit: 'g', displayValue: '18.9', dailyValue: '18.9', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 47.70129, unit: 'mcg', displayValue: '48', dailyValue: '48', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 20.7648, unit: 'mg', displayValue: '21', dailyValue: '21', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.2731945, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 8.738461, unit: 'mg', displayValue: '9', dailyValue: '9', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.2073449, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 2.002463, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 27.62189, unit: 'mg', displayValue: '28', dailyValue: '28', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 0.04165, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 1056.872, unit: 'IU', displayValue: '1057', dailyValue: '1057', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 33.63868, unit: 'g', displayValue: '33.6', dailyValue: '33.6', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 163.5665, unit: 'mg', displayValue: '164', dailyValue: '164', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 23.15948, unit: 'g', displayValue: '23.2', dailyValue: '23.2', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 398.5327, unit: 'kcal', displayValue: '399', dailyValue: '399', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.7060742, unit: 'g', displayValue: '0.7', dailyValue: '0.7', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 6531, displayValue: '3 pounds chicken wings', grams: 1362.0, displayType: 'Normal',
        },
        {
          ingredientID: 16317, displayValue: '1 egg, lightly beaten', grams: 50.0, displayType: 'Normal',
        },
        {
          ingredientID: 1684, displayValue: '1 cup all-purpose flour for coating', grams: 125.0, displayType: 'Normal',
        },
        {
          ingredientID: 16157, displayValue: '1 cup butter', grams: 227.0, displayType: 'Normal',
        },
        {
          ingredientID: 0, displayValue: 'SAUCE', grams: 0.0, displayType: 'Heading',
        },
        {
          ingredientID: 2882, displayValue: '3 tablespoons soy sauce', grams: 48.0, displayType: 'Normal',
        },
        {
          ingredientID: 2496, displayValue: '3 tablespoons water', grams: 44.355, displayType: 'Normal',
        },
        {
          ingredientID: 1526, displayValue: '1 cup white sugar', grams: 200.0, displayType: 'Normal',
        },
        {
          ingredientID: 7842, displayValue: '1/2 cup white vinegar', grams: 120.0, displayType: 'Normal',
        },
        {
          ingredientID: 16396, displayValue: '1/2 teaspoon garlic powder, or to taste', grams: 1.3883333, displayType: 'Normal',
        },
        {
          ingredientID: 16421, displayValue: '1 teaspoon salt', grams: 6.0, displayType: 'Normal',
        }],
        servings: 6,
        prepMinutes: 15,
        cookMinutes: 45,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/4154813.jpg',
        id: 23312,
      },
      {
        title: 'Grilled Bacon Jalapeno Wraps',
        nutrition: {
          calories: {
            name: 'Calories', amount: 390.9734, unit: 'kcal', displayValue: '391', dailyValue: '391', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 38.32734, unit: 'g', displayValue: '38.3', dailyValue: '38.3', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 79.14667, unit: 'mg', displayValue: '79', dailyValue: '79', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 577.1267, unit: 'mg', displayValue: '577', dailyValue: '577', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 2.188667, unit: 'g', displayValue: '2.2', dailyValue: '2.2', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 9.503667, unit: 'g', displayValue: '9.5', dailyValue: '9.5', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 12.55333, unit: 'mcg', displayValue: '13', dailyValue: '13', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 11.62, unit: 'mg', displayValue: '12', dailyValue: '12', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.2062667, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 3.679528, unit: 'mg', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.2325867, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.8148, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 34.62667, unit: 'mg', displayValue: '35', dailyValue: '35', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 6.202, unit: 'mg', displayValue: '6', dailyValue: '6', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 635.0867, unit: 'IU', displayValue: '635', dailyValue: '635', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.5312098, unit: 'g', displayValue: '0.5', dailyValue: '0.5', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 191.0067, unit: 'mg', displayValue: '191', dailyValue: '191', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 16.6054, unit: 'g', displayValue: '16.6', dailyValue: '16.6', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 344.946, unit: 'kcal', displayValue: '345', dailyValue: '345', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.3694569, unit: 'g', displayValue: '0.4', dailyValue: '0.4', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 3725, displayValue: '6 fresh jalapeno peppers, halved lengthwise and seeded', grams: 84.0, displayType: 'Normal',
        },
        {
          ingredientID: 16223, displayValue: '1 (8 ounce) package cream cheese', grams: 224.0, displayType: 'Normal',
        },
        {
          ingredientID: 5375, displayValue: '12 slices bacon', grams: 336.0, displayType: 'Normal',
        }],
        servings: 6,
        prepMinutes: 10,
        cookMinutes: 10,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/805457.jpg',
        id: 87076,
      },
      {
        title: 'Bacon Cheddar Deviled Eggs',
        nutrition: {
          calories: {
            name: 'Calories', amount: 186.512, unit: 'kcal', displayValue: '187', dailyValue: '187', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 16.96218, unit: 'g', displayValue: '17', dailyValue: '17', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 197.2859, unit: 'mg', displayValue: '197', dailyValue: '197', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 223.0072, unit: 'mg', displayValue: '223', dailyValue: '223', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 0.8224984, unit: 'g', displayValue: '0.8', dailyValue: '0.8', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 7.856568, unit: 'g', displayValue: '7.9', dailyValue: '7.9', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 24.48452, unit: 'mcg', displayValue: '24', dailyValue: '24', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 8.22949, unit: 'mg', displayValue: '8', dailyValue: '8', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.1458272, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 2.001495, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.06637632, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 1.008797, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 38.44395, unit: 'mg', displayValue: '38', dailyValue: '38', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 0.01927312, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 287.4255, unit: 'IU', displayValue: '287', dailyValue: '287', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.50226, unit: 'g', displayValue: '0.5', dailyValue: '0.5', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 90.64529, unit: 'mg', displayValue: '91', dailyValue: '91', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 4.333943, unit: 'g', displayValue: '4.3', dailyValue: '4.3', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 152.6596, unit: 'kcal', displayValue: '153', dailyValue: '153', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.04240087, unit: 'g', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 16317, displayValue: '12 eggs', grams: 600.0, displayType: 'Normal',
        },
        {
          ingredientID: 6294, displayValue: '1/2 cup mayonnaise', grams: 110.0, displayType: 'Normal',
        },
        {
          ingredientID: 5375, displayValue: '4 slices bacon', grams: 112.0, displayType: 'Normal',
        },
        {
          ingredientID: 16215, displayValue: '2 tablespoons finely shredded Cheddar cheese', grams: 16.638655, displayType: 'Normal',
        },
        {
          ingredientID: 16420, displayValue: '1 tablespoon mustard', grams: 15.4185, displayType: 'Normal',
        }],
        servings: 12,
        prepMinutes: 30,
        cookMinutes: 10,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/207662.jpg',
        id: 69084,
      },
      {
        title: 'Chocolate Chip Cheese Ball',
        nutrition: {
          calories: {
            name: 'Calories', amount: 101.6889, unit: 'kcal', displayValue: '102', dailyValue: '102', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 8.375745, unit: 'g', displayValue: '8.4', dailyValue: '8.4', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 15.32578, unit: 'mg', displayValue: '15', dailyValue: '15', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 41.8659, unit: 'mg', displayValue: '42', dailyValue: '42', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 6.864325, unit: 'g', displayValue: '6.9', dailyValue: '6.9', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 0.9642481, unit: 'g', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 2.114027, unit: 'mcg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 8.325384, unit: 'mg', displayValue: '8', dailyValue: '8', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.01053688, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 0.2201027, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.01829985, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.2829041, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 10.274, unit: 'mg', displayValue: '10', dailyValue: '10', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 0.02810156, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 184.287, unit: 'IU', displayValue: '184', dailyValue: '184', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 6.03202, unit: 'g', displayValue: '6', dailyValue: '6', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 35.69183, unit: 'mg', displayValue: '36', dailyValue: '36', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 4.237745, unit: 'g', displayValue: '4.2', dailyValue: '4.2', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 75.38171, unit: 'kcal', displayValue: '75', dailyValue: '75', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.4844766, unit: 'g', displayValue: '0.5', dailyValue: '0.5', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 16223, displayValue: '1 (8 ounce) package cream cheese, softened', grams: 224.0, displayType: 'Normal',
        },
        {
          ingredientID: 16157, displayValue: '1/2 cup butter, softened', grams: 113.5, displayType: 'Normal',
        },
        {
          ingredientID: 1527, displayValue: "3/4 cup confectioners' sugar", grams: 94.05, displayType: 'Normal',
        },
        {
          ingredientID: 1525, displayValue: '2 tablespoons brown sugar', grams: 27.136564, displayType: 'Normal',
        },
        {
          ingredientID: 16424, displayValue: '1/4 teaspoon vanilla extract', grams: 1.0833334, displayType: 'Normal',
        },
        {
          ingredientID: 8610, displayValue: '3/4 cup miniature semisweet chocolate chips', grams: 129.75, displayType: 'Normal',
        },
        {
          ingredientID: 3810, displayValue: '3/4 cup finely chopped pecans', grams: 81.75, displayType: 'Normal',
        }],
        servings: 32,
        prepMinutes: 20,
        cookMinutes: 0,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/254954.jpg',
        id: 26740,
      },
      {
        title: 'Baked Buffalo Wings',
        nutrition: {
          calories: {
            name: 'Calories', amount: 125.441, unit: 'kcal', displayValue: '125', dailyValue: '125', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 9.153723, unit: 'g', displayValue: '9.2', dailyValue: '9.2', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 31.52125, unit: 'mg', displayValue: '32', dailyValue: '32', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 257.6333, unit: 'mg', displayValue: '258', dailyValue: '258', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 3.75427, unit: 'g', displayValue: '3.8', dailyValue: '3.8', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 6.755847, unit: 'g', displayValue: '6.8', dailyValue: '6.8', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 9.823043, unit: 'mcg', displayValue: '10', dailyValue: '10', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 5.904562, unit: 'mg', displayValue: '6', dailyValue: '6', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.1107571, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 3.046013, unit: 'mg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.04922519, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.5434954, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 6.120698, unit: 'mg', displayValue: '6', dailyValue: '6', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 4.230439, unit: 'mg', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 205.9434, unit: 'IU', displayValue: '206', dailyValue: '206', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.1080543, unit: 'g', displayValue: '0.1', dailyValue: '0.1', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 58.43412, unit: 'mg', displayValue: '58', dailyValue: '58', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 4.180368, unit: 'g', displayValue: '4.2', dailyValue: '4.2', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 82.38351, unit: 'kcal', displayValue: '82', dailyValue: '82', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.1624538, unit: 'g', displayValue: '0.2', dailyValue: '0.2', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 1684, displayValue: '3/4 cup all-purpose flour', grams: 93.75, displayType: 'Normal',
        },
        {
          ingredientID: 16407, displayValue: '1/2 teaspoon cayenne pepper', grams: 0.9, displayType: 'Normal',
        },
        {
          ingredientID: 16396, displayValue: '1/2 teaspoon garlic powder', grams: 1.3883333, displayType: 'Normal',
        },
        {
          ingredientID: 16421, displayValue: '1/2 teaspoon salt', grams: 3.0, displayType: 'Normal',
        },
        {
          ingredientID: 6531, displayValue: '20 chicken wings', grams: 1840.0, displayType: 'Normal',
        },
        {
          ingredientID: 16157, displayValue: '1/2 cup melted butter', grams: 113.5, displayType: 'Normal',
        },
        {
          ingredientID: 5592, displayValue: "1/2 cup hot pepper sauce (such as Frank's RedHot®)", grams: 111.86, displayType: 'Normal',
        }],
        servings: 20,
        prepMinutes: 15,
        cookMinutes: 45,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/1132784.jpg',
        id: 166638,
      },
      {
        title: 'Spinach Brownies',
        nutrition: {
          calories: {
            name: 'Calories', amount: 92.20638, unit: 'kcal', displayValue: '92', dailyValue: '92', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 6.037269, unit: 'g', displayValue: '6', dailyValue: '6', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 32.45438, unit: 'mg', displayValue: '32', dailyValue: '32', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 216.3993, unit: 'mg', displayValue: '216', dailyValue: '216', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 5.634476, unit: 'g', displayValue: '5.6', dailyValue: '5.6', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 4.086236, unit: 'g', displayValue: '4.1', dailyValue: '4.1', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 36.48396, unit: 'mcg', displayValue: '36', dailyValue: '36', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 14.72109, unit: 'mg', displayValue: '15', dailyValue: '15', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.04703854, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 1.281539, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.06037521, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.6846414, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 109.9773, unit: 'mg', displayValue: '110', dailyValue: '110', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 3.637834, unit: 'mg', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 1296.657, unit: 'IU', displayValue: '1297', dailyValue: '1297', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.8735833, unit: 'g', displayValue: '0.9', dailyValue: '0.9', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 107.2212, unit: 'mg', displayValue: '107', dailyValue: '107', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 3.647519, unit: 'g', displayValue: '3.6', dailyValue: '3.6', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 54.33542, unit: 'kcal', displayValue: '54', dailyValue: '54', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.4754911, unit: 'g', displayValue: '0.5', dailyValue: '0.5', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 4516, displayValue: '1 (10 ounce) package spinach, rinsed and chopped', grams: 280.0, displayType: 'Normal',
        },
        {
          ingredientID: 1684, displayValue: '1 cup all-purpose flour', grams: 125.0, displayType: 'Normal',
        },
        {
          ingredientID: 16421, displayValue: '1 teaspoon salt', grams: 6.0, displayType: 'Normal',
        },
        {
          ingredientID: 7785, displayValue: '1 teaspoon baking powder', grams: 3.392857, displayType: 'Normal',
        },
        {
          ingredientID: 16317, displayValue: '2 eggs', grams: 100.0, displayType: 'Normal',
        },
        {
          ingredientID: 16278, displayValue: '1 cup milk', grams: 244.0, displayType: 'Normal',
        },
        {
          ingredientID: 16157, displayValue: '1/2 cup butter, melted', grams: 113.5, displayType: 'Normal',
        },
        {
          ingredientID: 4397, displayValue: '1 onion, chopped', grams: 110.0, displayType: 'Normal',
        },
        {
          ingredientID: 16234, displayValue: '1 (8 ounce) package shredded mozzarella cheese', grams: 224.0, displayType: 'Normal',
        }],
        servings: 24,
        prepMinutes: 20,
        cookMinutes: 35,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/3239956.jpg',
        id: 26972,
      },
      {
        title: 'Florentine Artichoke Dip',
        nutrition: {
          calories: {
            name: 'Calories', amount: 193.6009, unit: 'kcal', displayValue: '194', dailyValue: '194', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 17.11378, unit: 'g', displayValue: '17.1', dailyValue: '17.1', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 38.9125, unit: 'mg', displayValue: '39', dailyValue: '39', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 379.4919, unit: 'mg', displayValue: '379', dailyValue: '379', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 4.936373, unit: 'g', displayValue: '4.9', dailyValue: '4.9', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 6.141873, unit: 'g', displayValue: '6.1', dailyValue: '6.1', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 30.60766, unit: 'mcg', displayValue: '31', dailyValue: '31', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 17.68974, unit: 'mg', displayValue: '18', dailyValue: '18', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.09432746, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 1.228866, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.02417182, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.7529768, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 116.2411, unit: 'mg', displayValue: '116', dailyValue: '116', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 5.167037, unit: 'mg', displayValue: '5', dailyValue: '5', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 2593.047, unit: 'IU', displayValue: '2593', dailyValue: '2593', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.3526454, unit: 'g', displayValue: '0.4', dailyValue: '0.4', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 107.9606, unit: 'mg', displayValue: '108', dailyValue: '108', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 8.056664, unit: 'g', displayValue: '8.1', dailyValue: '8.1', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 154.024, unit: 'kcal', displayValue: '154', dailyValue: '154', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 1.409087, unit: 'g', displayValue: '1.4', dailyValue: '1.4', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 4520, displayValue: '1 (10 ounce) package frozen chopped spinach - thawed, drained and squeezed dry', grams: 284.0, displayType: 'Normal',
        },
        {
          ingredientID: 126, displayValue: '1 (14 ounce) can artichoke hearts, drained and chopped', grams: 240.0, displayType: 'Normal',
        },
        {
          ingredientID: 4342, displayValue: '3 cloves garlic, minced', grams: 9.0, displayType: 'Normal',
        },
        {
          ingredientID: 6294, displayValue: '1/2 cup mayonnaise', grams: 110.0, displayType: 'Normal',
        },
        {
          ingredientID: 16223, displayValue: '2 (8 ounce) packages cream cheese, softened', grams: 448.0, displayType: 'Normal',
        },
        {
          ingredientID: 5107, displayValue: '2 tablespoons lemon juice', grams: 30.096916, displayType: 'Normal',
        },
        {
          ingredientID: 16238, displayValue: '1 cup grated Parmesan cheese', grams: 80.0, displayType: 'Normal',
        }],
        servings: 16,
        prepMinutes: 10,
        cookMinutes: 25,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/286350.jpg',
        id: 14930,
      },
      {
        title: 'Spiced Pumpkin Seeds',
        nutrition: {
          calories: {
            name: 'Calories', amount: 90.24912, unit: 'kcal', displayValue: '90', dailyValue: '90', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 5.090436, unit: 'g', displayValue: '5.1', dailyValue: '5.1', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 0.0, unit: 'mg', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 213.689, unit: 'mg', displayValue: '214', dailyValue: '214', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 8.907258, unit: 'g', displayValue: '8.9', dailyValue: '8.9', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 2.992373, unit: 'g', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 1.585683, unit: 'mcg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 42.21339, unit: 'mg', displayValue: '42', dailyValue: '42', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.008754575, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 0.8180443, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.00568675, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.6063505, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 11.18922, unit: 'mg', displayValue: '11', dailyValue: '11', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 0.2371171, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 99.15359, unit: 'IU', displayValue: '99', dailyValue: '99', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.1642992, unit: 'g', displayValue: '0.2', dailyValue: '0.2', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 159.5875, unit: 'mg', displayValue: '160', dailyValue: '160', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 0.9326835, unit: 'g', displayValue: '0.9', dailyValue: '0.9', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 45.81392, unit: 'kcal', displayValue: '46', dailyValue: '46', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.6242458, unit: 'g', displayValue: '0.6', dailyValue: '0.6', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 6311, displayValue: '1 1/2 tablespoons margarine, melted', grams: 19.74, displayType: 'Normal',
        },
        {
          ingredientID: 16421, displayValue: '1/2 teaspoon salt', grams: 3.0, displayType: 'Normal',
        },
        {
          ingredientID: 18740, displayValue: '1/8 teaspoon garlic salt', grams: 0.6875, displayType: 'Normal',
        },
        {
          ingredientID: 7428, displayValue: '2 teaspoons Worcestershire sauce', grams: 11.333333, displayType: 'Normal',
        },
        {
          ingredientID: 20916, displayValue: '2 cups raw whole pumpkin seeds', grams: 128.0, displayType: 'Normal',
        }],
        servings: 8,
        prepMinutes: 10,
        cookMinutes: 60,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/4569239.jpg',
        id: 13839,
      },
      {
        title: 'Fruit Dip II',
        nutrition: {
          calories: {
            name: 'Calories', amount: 117.74, unit: 'kcal', displayValue: '118', dailyValue: '118', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 6.558066, unit: 'g', displayValue: '6.6', dailyValue: '6.6', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 20.53333, unit: 'mg', displayValue: '21', dailyValue: '21', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 68.32, unit: 'mg', displayValue: '68', dailyValue: '68', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 13.39987, unit: 'g', displayValue: '13.4', dailyValue: '13.4', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 1.54, unit: 'g', displayValue: '1.5', dailyValue: '1.5', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 2.59, unit: 'mcg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 1.446667, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.0091, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 0.2296476, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.003336667, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.2599334, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 15.42333, unit: 'mg', displayValue: '15', dailyValue: '15', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 0.0, unit: 'mg', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 251.4167, unit: 'IU', displayValue: '251', dailyValue: '251', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 7.681334, unit: 'g', displayValue: '7.7', dailyValue: '7.7', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 23.03, unit: 'mg', displayValue: '23', dailyValue: '23', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 4.109467, unit: 'g', displayValue: '4.1', dailyValue: '4.1', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 59.0226, unit: 'kcal', displayValue: '59', dailyValue: '59', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.01633333, unit: 'g', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 16223, displayValue: '1 (8 ounce) package cream cheese, softened', grams: 224.0, displayType: 'Normal',
        }, {
          ingredientID: 1542, displayValue: '1 (7 ounce) jar marshmallow creme', grams: 196.0, displayType: 'Normal',
        }],
        servings: 12,
        prepMinutes: 5,
        cookMinutes: 0,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/819035.jpg',
        id: 16570,
      },
      {
        title: "D's Famous Salsa",
        nutrition: {
          calories: {
            name: 'Calories', amount: 16.02911, unit: 'kcal', displayValue: '16', dailyValue: '16', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 0.1098531, unit: 'g', displayValue: '0.1', dailyValue: '0.1', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 0.0, unit: 'mg', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 282.8833, unit: 'mg', displayValue: '283', dailyValue: '283', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 3.869182, unit: 'g', displayValue: '3.9', dailyValue: '3.9', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 0.5560308, unit: 'g', displayValue: '0.6', dailyValue: '0.6', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 3.910094, unit: 'mcg', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 7.044531, unit: 'mg', displayValue: '7', dailyValue: '7', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.01986852, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 0.4692112, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.02653148, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.7191352, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 19.65323, unit: 'mg', displayValue: '20', dailyValue: '20', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 6.518054, unit: 'mg', displayValue: '7', dailyValue: '7', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 140.1186, unit: 'IU', displayValue: '140', dailyValue: '140', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 2.040274, unit: 'g', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 119.7209, unit: 'mg', displayValue: '120', dailyValue: '120', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 0.01554309, unit: 'g', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 0.9886781, unit: 'kcal', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.6709563, unit: 'g', displayValue: '0.7', dailyValue: '0.7', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 4575, displayValue: '2 (14.5 ounce) cans stewed tomatoes', grams: 812.0, displayType: 'Normal',
        },
        {
          ingredientID: 4397, displayValue: '1/2 onion, finely diced', grams: 55.0, displayType: 'Normal',
        },
        {
          ingredientID: 4342, displayValue: '1 teaspoon minced garlic', grams: 2.8, displayType: 'Normal',
        },
        {
          ingredientID: 5111, displayValue: '1/2 lime, juiced', grams: 33.5, displayType: 'Normal',
        },
        {
          ingredientID: 16421, displayValue: '1 teaspoon salt', grams: 6.0, displayType: 'Normal',
        },
        {
          ingredientID: 4431, displayValue: '1/4 cup canned sliced green chiles, or to taste', grams: 34.0, displayType: 'Normal',
        },
        {
          ingredientID: 3717, displayValue: '3 tablespoons chopped fresh cilantro', grams: 8.625, displayType: 'Normal',
        }],
        servings: 16,
        prepMinutes: 10,
        cookMinutes: 0,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/866636.jpg',
        id: 16259,
      },
      {
        title: 'Best Ever Jalapeno Poppers',
        nutrition: {
          calories: {
            name: 'Calories', amount: 149.2268, unit: 'kcal', displayValue: '149', dailyValue: '149', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 12.00626, unit: 'g', displayValue: '12', dailyValue: '12', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 19.81063, unit: 'mg', displayValue: '20', dailyValue: '20', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 109.8279, unit: 'mg', displayValue: '110', dailyValue: '110', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 6.758925, unit: 'g', displayValue: '6.8', dailyValue: '6.8', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 3.886863, unit: 'g', displayValue: '3.9', dailyValue: '3.9', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 18.718, unit: 'mcg', displayValue: '19', dailyValue: '19', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 7.74225, unit: 'mg', displayValue: '8', dailyValue: '8', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.07221669, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 1.302106, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.07827388, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.595225, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 75.70844, unit: 'mg', displayValue: '76', dailyValue: '76', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 4.66675, unit: 'mg', displayValue: '5', dailyValue: '5', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 311.5429, unit: 'IU', displayValue: '312', dailyValue: '312', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.9767167, unit: 'g', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 64.31837, unit: 'mg', displayValue: '64', dailyValue: '64', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 4.674838, unit: 'g', displayValue: '4.7', dailyValue: '4.7', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 108.0564, unit: 'kcal', displayValue: '108', dailyValue: '108', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.5344364, unit: 'g', displayValue: '0.5', dailyValue: '0.5', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 16223, displayValue: '12 ounces cream cheese, softened', grams: 340.2, displayType: 'Normal',
        },
        {
          ingredientID: 16215, displayValue: '1 (8 ounce) package shredded Cheddar cheese', grams: 224.0, displayType: 'Normal',
        },
        {
          ingredientID: 18907, displayValue: '1 tablespoon bacon bits', grams: 7.0, displayType: 'Normal',
        },
        {
          ingredientID: 3725, displayValue: '12 ounces jalapeno peppers, seeded and halved', grams: 336.0, displayType: 'Normal',
        },
        {
          ingredientID: 16278, displayValue: '1 cup milk', grams: 244.0, displayType: 'Normal',
        },
        {
          ingredientID: 1684, displayValue: '1 cup all-purpose flour', grams: 125.0, displayType: 'Normal',
        },
        {
          ingredientID: 2112, displayValue: '1 cup dry bread crumbs', grams: 108.0, displayType: 'Normal',
        },
        {
          ingredientID: 20482, displayValue: '2 quarts oil for frying', grams: 1760.0, displayType: 'Normal',
        }],
        servings: 32,
        prepMinutes: 45,
        cookMinutes: 15,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/963639.jpg',
        id: 20858,
      },
      {
        title: 'BLT Dip',
        nutrition: {
          calories: {
            name: 'Calories', amount: 181.2519, unit: 'kcal', displayValue: '181', dailyValue: '181', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 17.83526, unit: 'g', displayValue: '17.8', dailyValue: '17.8', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 21.79375, unit: 'mg', displayValue: '22', dailyValue: '22', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 301.2219, unit: 'mg', displayValue: '301', dailyValue: '301', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 1.482831, unit: 'g', displayValue: '1.5', dailyValue: '1.5', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 4.095, unit: 'g', displayValue: '4.1', dailyValue: '4.1', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 3.608125, unit: 'mcg', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 5.6375, unit: 'mg', displayValue: '6', dailyValue: '6', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.1202881, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 1.717935, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.07400937, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.1937312, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 19.43062, unit: 'mg', displayValue: '19', dailyValue: '19', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 1.105688, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 199.1325, unit: 'IU', displayValue: '199', dailyValue: '199', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.3736813, unit: 'g', displayValue: '0.4', dailyValue: '0.4', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 93.185, unit: 'mg', displayValue: '93', dailyValue: '93', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 4.791291, unit: 'g', displayValue: '4.8', dailyValue: '4.8', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 160.5174, unit: 'kcal', displayValue: '161', dailyValue: '161', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.09225, unit: 'g', displayValue: '0.1', dailyValue: '0.1', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 5375, displayValue: '1 pound bacon', grams: 454.0, displayType: 'Normal',
        },
        {
          ingredientID: 6294, displayValue: '1 cup mayonnaise', grams: 220.0, displayType: 'Normal',
        },
        {
          ingredientID: 16261, displayValue: '1 cup sour cream', grams: 230.0, displayType: 'Normal',
        },
        {
          ingredientID: 4572, displayValue: '1 tomato - peeled, seeded and diced', grams: 123.0, displayType: 'Normal',
        }],
        servings: 16,
        prepMinutes: 5,
        cookMinutes: 10,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/665563.jpg',
        id: 14944,
      },
      {
        title: 'Avocado, Tomato and Mango Salsa',
        nutrition: {
          calories: {
            name: 'Calories', amount: 158.3396, unit: 'kcal', displayValue: '158', dailyValue: '158', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 11.97071, unit: 'g', displayValue: '12', dailyValue: '12', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 0.0, unit: 'mg', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 397.2728, unit: 'mg', displayValue: '397', dailyValue: '397', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 13.79341, unit: 'g', displayValue: '13.8', dailyValue: '13.8', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 1.874258, unit: 'g', displayValue: '1.9', dailyValue: '1.9', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 49.6195, unit: 'mcg', displayValue: '50', dailyValue: '50', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 24.77167, unit: 'mg', displayValue: '25', dailyValue: '25', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.2443225, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 1.671809, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.11437, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.6205258, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 23.814, unit: 'mg', displayValue: '24', dailyValue: '24', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 27.9102, unit: 'mg', displayValue: '28', dailyValue: '28', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 1276.048, unit: 'IU', displayValue: '1276', dailyValue: '1276', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 7.990139, unit: 'g', displayValue: '8', dailyValue: '8', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 457.9534, unit: 'mg', displayValue: '458', dailyValue: '458', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 1.696634, unit: 'g', displayValue: '1.7', dailyValue: '1.7', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 107.7363, unit: 'kcal', displayValue: '108', dailyValue: '108', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 4.188843, unit: 'g', displayValue: '4.2', dailyValue: '4.2', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 5121, displayValue: '1 mango - peeled, seeded and diced', grams: 207.0, displayType: 'Normal',
        },
        {
          ingredientID: 5012, displayValue: '1 avocado - peeled, pitted, and diced', grams: 201.0, displayType: 'Normal',
        },
        {
          ingredientID: 4572, displayValue: '4 medium tomatoes, diced', grams: 492.0, displayType: 'Normal',
        },
        {
          ingredientID: 3725, displayValue: '1 jalapeno pepper, seeded and minced', grams: 14.0, displayType: 'Normal',
        },
        {
          ingredientID: 3717, displayValue: '1/2 cup chopped fresh cilantro', grams: 23.0, displayType: 'Normal',
        },
        {
          ingredientID: 4342, displayValue: '3 cloves garlic, minced', grams: 9.0, displayType: 'Normal',
        },
        {
          ingredientID: 16421, displayValue: '1 teaspoon salt', grams: 6.0, displayType: 'Normal',
        },
        {
          ingredientID: 5112, displayValue: '2 tablespoons fresh lime juice', grams: 30.75, displayType: 'Normal',
        },
        {
          ingredientID: 20269, displayValue: '1/4 cup chopped red onion', grams: 41.8, displayType: 'Normal',
        },
        {
          ingredientID: 6307, displayValue: '3 tablespoons olive oil', grams: 40.5, displayType: 'Normal',
        }],
        servings: 6,
        prepMinutes: 15,
        cookMinutes: 0,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/21539.jpg',
        id: 74694,
      },
      {
        title: 'Real Hummus',
        nutrition: {
          calories: {
            name: 'Calories', amount: 54.16462, unit: 'kcal', displayValue: '54', dailyValue: '54', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 2.465472, unit: 'g', displayValue: '2.5', dailyValue: '2.5', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 0.0, unit: 'mg', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 198.7773, unit: 'mg', displayValue: '199', dailyValue: '199', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 6.776945, unit: 'g', displayValue: '6.8', dailyValue: '6.8', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 1.621027, unit: 'g', displayValue: '1.6', dailyValue: '1.6', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 19.94686, unit: 'mcg', displayValue: '20', dailyValue: '20', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 9.507782, unit: 'mg', displayValue: '10', dailyValue: '10', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.1350903, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 0.4252725, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.02762711, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.5130329, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 15.86278, unit: 'mg', displayValue: '16', dailyValue: '16', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 2.503298, unit: 'mg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 8.109138, unit: 'IU', displayValue: '8', dailyValue: '8', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.0825826, unit: 'g', displayValue: '0.1', dailyValue: '0.1', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 57.58812, unit: 'mg', displayValue: '58', dailyValue: '58', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 0.3314464, unit: 'g', displayValue: '0.3', dailyValue: '0.3', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 22.18925, unit: 'kcal', displayValue: '22', dailyValue: '22', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 1.344959, unit: 'g', displayValue: '1.3', dailyValue: '1.3', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 4342, displayValue: '1 clove garlic', grams: 3.0, displayType: 'Normal',
        },
        {
          ingredientID: 2819, displayValue: '1 (19 ounce) can garbanzo beans, half the liquid reserved', grams: 539.6, displayType: 'Normal',
        },
        {
          ingredientID: 5107, displayValue: '4 tablespoons lemon juice', grams: 60.193832, displayType: 'Normal',
        },
        {
          ingredientID: 3823, displayValue: '2 tablespoons tahini', grams: 30.0, displayType: 'Normal',
        },
        {
          ingredientID: 4342, displayValue: '1 clove garlic, chopped', grams: 3.0, displayType: 'Normal',
        },
        {
          ingredientID: 16421, displayValue: '1 teaspoon salt', grams: 6.0, displayType: 'Normal',
        },
        {
          ingredientID: 16406, displayValue: 'black pepper to taste', grams: 0.0, displayType: 'HideAmounts',
        },
        {
          ingredientID: 6307, displayValue: '2 tablespoons olive oil', grams: 27.0, displayType: 'Normal',
        }],
        servings: 20,
        prepMinutes: 15,
        cookMinutes: 0,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/4524208.jpg',
        id: 26921,
      },
      {
        title: 'Pumpkin Fluff Dip ',
        nutrition: {
          calories: {
            name: 'Calories', amount: 65.32794, unit: 'kcal', displayValue: '65', dailyValue: '65', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 3.613619, unit: 'g', displayValue: '3.6', dailyValue: '3.6', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 0.0, unit: 'mg', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 98.6545, unit: 'mg', displayValue: '99', dailyValue: '99', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 8.405161, unit: 'g', displayValue: '8.4', dailyValue: '8.4', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 0.3244975, unit: 'g', displayValue: '0.3', dailyValue: '0.3', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 1.624594, unit: 'mcg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 3.457875, unit: 'mg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.007798751, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 0.1151639, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.003439594, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.2175647, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 5.188563, unit: 'mg', displayValue: '5', dailyValue: '5', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 0.5890563, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 2091.983, unit: 'IU', displayValue: '2092', dailyValue: '2092', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 6.94731, unit: 'g', displayValue: '6.9', dailyValue: '6.9', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 30.82097, unit: 'mg', displayValue: '31', dailyValue: '31', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 3.0769, unit: 'g', displayValue: '3.1', dailyValue: '3.1', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 32.52257, unit: 'kcal', displayValue: '33', dailyValue: '33', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.3983, unit: 'g', displayValue: '0.4', dailyValue: '0.4', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 16272, displayValue: '1 (16 ounce) container frozen whipped topping, thawed', grams: 448.0, displayType: 'Normal',
        },
        {
          ingredientID: 1442, displayValue: '1 (5 ounce) package instant vanilla pudding mix', grams: 140.0, displayType: 'Normal',
        },
        {
          ingredientID: 4808, displayValue: '1 (15 ounce) can solid pack pumpkin', grams: 426.0, displayType: 'Normal',
        },
        {
          ingredientID: 16411, displayValue: '1 teaspoon pumpkin pie spice', grams: 1.7, displayType: 'Normal',
        }],
        servings: 32,
        prepMinutes: 5,
        cookMinutes: 0,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/25114.jpg',
        id: 24740,
      },
      {
        title: 'Bacon and Tomato Cups',
        nutrition: {
          calories: {
            name: 'Calories', amount: 216.0709, unit: 'kcal', displayValue: '216', dailyValue: '216', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 15.08461, unit: 'g', displayValue: '15.1', dailyValue: '15.1', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 18.15773, unit: 'mg', displayValue: '18', dailyValue: '18', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 429.6061, unit: 'mg', displayValue: '430', dailyValue: '430', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 14.95481, unit: 'g', displayValue: '15', dailyValue: '15', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 5.332437, unit: 'g', displayValue: '5.3', dailyValue: '5.3', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 3.437933, unit: 'mcg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 5.8658, unit: 'mg', displayValue: '6', dailyValue: '6', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.0928381, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 1.254241, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.06370153, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 1.012693, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 50.06117, unit: 'mg', displayValue: '50', dailyValue: '50', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 1.58152, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 164.1323, unit: 'IU', displayValue: '164', dailyValue: '164', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 1.9706, unit: 'g', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 68.2487, unit: 'mg', displayValue: '68', dailyValue: '68', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 4.123117, unit: 'g', displayValue: '4.1', dailyValue: '4.1', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 135.7615, unit: 'kcal', displayValue: '136', dailyValue: '136', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.5685334, unit: 'g', displayValue: '0.6', dailyValue: '0.6', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 5375, displayValue: '8 slices bacon', grams: 224.0, displayType: 'Normal',
        },
        {
          ingredientID: 4572, displayValue: '1 tomato, chopped', grams: 148.0, displayType: 'Normal',
        },
        {
          ingredientID: 4397, displayValue: '1/2 onion, chopped', grams: 55.0, displayType: 'Normal',
        },
        {
          ingredientID: 16246, displayValue: '3 ounces shredded Swiss cheese', grams: 85.05, displayType: 'Normal',
        },
        {
          ingredientID: 6294, displayValue: '1/2 cup mayonnaise', grams: 110.0, displayType: 'Normal',
        },
        {
          ingredientID: 16379, displayValue: '1 teaspoon dried basil', grams: 1.4, displayType: 'Normal',
        },
        {
          ingredientID: 17969, displayValue: '1 (16 ounce) can refrigerated buttermilk biscuit dough', grams: 448.0, displayType: 'Normal',
        }],
        servings: 15,
        prepMinutes: 30,
        cookMinutes: 12,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/2309946.jpg',
        id: 14967,
      },
      {
        title: 'Chicken Puffs',
        nutrition: {
          calories: {
            name: 'Calories', amount: 398.5178, unit: 'kcal', displayValue: '399', dailyValue: '399', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 25.89073, unit: 'g', displayValue: '25.9', dailyValue: '25.9', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 42.07167, unit: 'mg', displayValue: '42', dailyValue: '42', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 645.3468, unit: 'mg', displayValue: '645', dailyValue: '645', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 28.35811, unit: 'g', displayValue: '28.4', dailyValue: '28.4', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 10.73358, unit: 'g', displayValue: '10.7', dailyValue: '10.7', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 3.317167, unit: 'mcg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 6.926166, unit: 'mg', displayValue: '7', dailyValue: '7', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.1272222, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 3.288189, unit: 'mg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.01905167, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 2.12902, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 16.99983, unit: 'mg', displayValue: '17', dailyValue: '17', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 0.655, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 370.1165, unit: 'IU', displayValue: '370', dailyValue: '370', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 5.14576, unit: 'g', displayValue: '5.1', dailyValue: '5.1', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 75.1715, unit: 'mg', displayValue: '75', dailyValue: '75', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 10.53899, unit: 'g', displayValue: '10.5', dailyValue: '10.5', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 233.0165, unit: 'kcal', displayValue: '233', dailyValue: '233', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.05825, unit: 'g', displayValue: '0.1', dailyValue: '0.1', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 6494, displayValue: '2 skinless, boneless chicken breast halves - cubed', grams: 236.0, displayType: 'Normal',
        },
        {
          ingredientID: 4397, displayValue: '3 tablespoons chopped onion', grams: 30.0, displayType: 'Normal',
        },
        {
          ingredientID: 4342, displayValue: '3 cloves garlic, peeled and minced', grams: 9.0, displayType: 'Normal',
        },
        {
          ingredientID: 16223, displayValue: '3/4 (8 ounce) package cream cheese', grams: 168.0, displayType: 'Normal',
        },
        {
          ingredientID: 16157, displayValue: '6 tablespoons butter', grams: 85.2, displayType: 'Normal',
        },
        {
          ingredientID: 17977, displayValue: '3 (10 ounce) cans refrigerated crescent roll dough', grams: 840.0, displayType: 'Normal',
        }],
        servings: 12,
        prepMinutes: 20,
        cookMinutes: 15,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/2050417.jpg',
        id: 26738,
      },
      {
        title: 'Toasted Garlic Bread',
        nutrition: {
          calories: {
            name: 'Calories', amount: 212.843, unit: 'kcal', displayValue: '213', dailyValue: '213', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 10.09998, unit: 'g', displayValue: '10.1', dailyValue: '10.1', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 22.497, unit: 'mg', displayValue: '22', dailyValue: '22', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 376.1545, unit: 'mg', displayValue: '376', dailyValue: '376', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 23.41146, unit: 'g', displayValue: '23.4', dailyValue: '23.4', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 6.87067, unit: 'g', displayValue: '6.9', dailyValue: '6.9', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 88.382, unit: 'mcg', displayValue: '88', dailyValue: '88', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 15.629, unit: 'mg', displayValue: '16', dailyValue: '16', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.042845, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 3.400867, unit: 'mg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.2194425, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 1.44234, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 129.475, unit: 'mg', displayValue: '129', dailyValue: '129', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 0.3558, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 242.2175, unit: 'IU', displayValue: '242', dailyValue: '242', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.523905, unit: 'g', displayValue: '0.5', dailyValue: '0.5', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 67.2485, unit: 'mg', displayValue: '67', dailyValue: '67', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 5.313637, unit: 'g', displayValue: '5.3', dailyValue: '5.3', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 90.8998, unit: 'kcal', displayValue: '91', dailyValue: '91', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 1.3089, unit: 'g', displayValue: '1.3', dailyValue: '1.3', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 2077, displayValue: '1 (1 pound) loaf Italian bread', grams: 454.0, displayType: 'Normal',
        },
        {
          ingredientID: 16157, displayValue: '5 tablespoons butter, softened', grams: 71.0, displayType: 'Normal',
        },
        {
          ingredientID: 9725, displayValue: '2 teaspoons extra virgin olive oil', grams: 9.333333, displayType: 'Normal',
        },
        {
          ingredientID: 4342, displayValue: '3 cloves garlic, crushed', grams: 9.0, displayType: 'Normal',
        },
        {
          ingredientID: 16403, displayValue: '1 teaspoon dried oregano', grams: 1.5, displayType: 'Normal',
        },
        {
          ingredientID: 16421, displayValue: 'salt and pepper to taste', grams: 0.0, displayType: 'HideAmounts',
        },
        {
          ingredientID: 16234, displayValue: '1 cup shredded mozzarella cheese', grams: 113.0, displayType: 'Normal',
        }],
        servings: 10,
        prepMinutes: 10,
        cookMinutes: 5,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/272203.jpg',
        id: 21060,
      },
      {
        title: "Amy's Cilantro Cream Sauce",
        nutrition: {
          calories: {
            name: 'Calories', amount: 230.218, unit: 'kcal', displayValue: '230', dailyValue: '230', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 20.48459, unit: 'g', displayValue: '20.5', dailyValue: '20.5', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 63.18125, unit: 'mg', displayValue: '63', dailyValue: '63', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 867.6671, unit: 'mg', displayValue: '868', dailyValue: '868', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 7.0787, unit: 'g', displayValue: '7.1', dailyValue: '7.1', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 5.02376, unit: 'g', displayValue: '5', dailyValue: '5', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 16.8462, unit: 'mcg', displayValue: '17', dailyValue: '17', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 11.54255, unit: 'mg', displayValue: '12', dailyValue: '12', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.09295955, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 0.9192728, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.02905696, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 1.366142, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 68.15567, unit: 'mg', displayValue: '68', dailyValue: '68', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 7.212132, unit: 'mg', displayValue: '7', dailyValue: '7', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 1728.681, unit: 'IU', displayValue: '1729', dailyValue: '1729', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 2.182391, unit: 'g', displayValue: '2.2', dailyValue: '2.2', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 300.7823, unit: 'mg', displayValue: '301', dailyValue: '301', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 12.78684, unit: 'g', displayValue: '12.8', dailyValue: '12.8', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 184.3613, unit: 'kcal', displayValue: '184', dailyValue: '184', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.7115076, unit: 'g', displayValue: '0.7', dailyValue: '0.7', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 16223, displayValue: '1 (8 ounce) package cream cheese, softened', grams: 224.0, displayType: 'Normal',
        },
        {
          ingredientID: 16261, displayValue: '1 tablespoon sour cream', grams: 14.375, displayType: 'Normal',
        },
        {
          ingredientID: 18898, displayValue: '1 (7 ounce) can tomatillo salsa', grams: 196.0, displayType: 'Normal',
        },
        {
          ingredientID: 16406, displayValue: '1 teaspoon freshly ground black pepper', grams: 2.1, displayType: 'Normal',
        },
        {
          ingredientID: 18738, displayValue: '1 teaspoon celery salt', grams: 4.5, displayType: 'Normal',
        },
        {
          ingredientID: 20551, displayValue: '1/2 teaspoon ground cumin', grams: 1.05, displayType: 'Normal',
        },
        {
          ingredientID: 16396, displayValue: '2 teaspoons garlic powder', grams: 5.5533333, displayType: 'Normal',
        },
        {
          ingredientID: 3717, displayValue: '1 bunch fresh cilantro, chopped', grams: 56.0, displayType: 'Normal',
        },
        {
          ingredientID: 5112, displayValue: '1 tablespoon fresh lime juice', grams: 15.375, displayType: 'Normal',
        }],
        servings: 4,
        prepMinutes: 10,
        cookMinutes: 0,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/395077.jpg',
        id: 20446,
      },
      {
        title: 'Party Pinwheels',
        nutrition: {
          calories: {
            name: 'Calories', amount: 228.538, unit: 'kcal', displayValue: '229', dailyValue: '229', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 14.505, unit: 'g', displayValue: '14.5', dailyValue: '14.5', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 36.80833, unit: 'mg', displayValue: '37', dailyValue: '37', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 477.1683, unit: 'mg', displayValue: '477', dailyValue: '477', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 18.59599, unit: 'g', displayValue: '18.6', dailyValue: '18.6', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 5.924043, unit: 'g', displayValue: '5.9', dailyValue: '5.9', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 42.01333, unit: 'mcg', displayValue: '42', dailyValue: '42', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 11.296, unit: 'mg', displayValue: '11', dailyValue: '11', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.05139367, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 2.273014, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.1780963, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 1.60825, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 97.972, unit: 'mg', displayValue: '98', dailyValue: '98', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 6.876033, unit: 'mg', displayValue: '7', dailyValue: '7', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 648.199, unit: 'IU', displayValue: '648', dailyValue: '648', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.988003, unit: 'g', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 123.6243, unit: 'mg', displayValue: '124', dailyValue: '124', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 7.999897, unit: 'g', displayValue: '8', dailyValue: '8', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 130.545, unit: 'kcal', displayValue: '131', dailyValue: '131', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 1.293913, unit: 'g', displayValue: '1.3', dailyValue: '1.3', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 16223, displayValue: '2 (8 ounce) packages cream cheese, softened', grams: 448.0, displayType: 'Normal',
        },
        {
          ingredientID: 11444, displayValue: '1 (1 ounce) package ranch dressing mix', grams: 28.0, displayType: 'Normal',
        },
        {
          ingredientID: 4405, displayValue: '2 green onions, minced', grams: 30.0, displayType: 'Normal',
        },
        {
          ingredientID: 2352, displayValue: '4 (12 inch) flour tortillas', grams: 468.0, displayType: 'Normal',
        },
        {
          ingredientID: 4786, displayValue: '1/2 cup red bell pepper, diced', grams: 74.5, displayType: 'Normal',
        },
        {
          ingredientID: 4292, displayValue: '1/2 cup diced celery', grams: 60.0, displayType: 'Normal',
        },
        {
          ingredientID: 5133, displayValue: '1 (2 ounce) can sliced black olives', grams: 56.0, displayType: 'Normal',
        },
        {
          ingredientID: 16215, displayValue: '1/2 cup shredded Cheddar cheese', grams: 56.5, displayType: 'Normal',
        }],
        servings: 15,
        prepMinutes: 10,
        cookMinutes: 5,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/19872.jpg',
        id: 14961,
      },
      {
        title: 'My Crab Cakes',
        nutrition: {
          calories: {
            name: 'Calories', amount: 318.3169, unit: 'kcal', displayValue: '318', dailyValue: '318', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 22.05488, unit: 'g', displayValue: '22.1', dailyValue: '22.1', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 72.9244, unit: 'mg', displayValue: '73', dailyValue: '73', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 406.7296, unit: 'mg', displayValue: '407', dailyValue: '407', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 21.96343, unit: 'g', displayValue: '22', dailyValue: '22', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 10.53853, unit: 'g', displayValue: '10.5', dailyValue: '10.5', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 26.97695, unit: 'mcg', displayValue: '27', dailyValue: '27', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 14.27865, unit: 'mg', displayValue: '14', dailyValue: '14', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.090901, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 3.800783, unit: 'mg', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.04079913, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 1.632692, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 62.32533, unit: 'mg', displayValue: '62', dailyValue: '62', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 2.79394, unit: 'mg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 255.591, unit: 'IU', displayValue: '256', dailyValue: '256', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 1.688263, unit: 'g', displayValue: '1.7', dailyValue: '1.7', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 150.8233, unit: 'mg', displayValue: '151', dailyValue: '151', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 3.726033, unit: 'g', displayValue: '3.7', dailyValue: '3.7', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 198.4939, unit: 'kcal', displayValue: '198', dailyValue: '198', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.761269, unit: 'g', displayValue: '0.8', dailyValue: '0.8', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 6307, displayValue: '2 tablespoons olive oil', grams: 27.0, displayType: 'Normal',
        },
        {
          ingredientID: 4405, displayValue: '6 green onions, chopped', grams: 90.0, displayType: 'Normal',
        },
        {
          ingredientID: 6307, displayValue: '3/8 cup olive oil', grams: 81.0, displayType: 'Normal',
        },
        {
          ingredientID: 2656, displayValue: '1 (16 ounce) can canned crabmeat, drained', grams: 447.888, displayType: 'Normal',
        },
        {
          ingredientID: 16317, displayValue: '1 egg', grams: 50.0, displayType: 'Normal',
        },
        {
          ingredientID: 6294, displayValue: '1 tablespoon mayonnaise', grams: 13.8, displayType: 'Normal',
        },
        {
          ingredientID: 18805, displayValue: '1 teaspoon dry mustard', grams: 3.0, displayType: 'Normal',
        },
        {
          ingredientID: 9615, displayValue: '8 ounces buttery round crackers, crushed', grams: 224.0, displayType: 'Normal',
        },
        {
          ingredientID: 16407, displayValue: '1/2 teaspoon ground cayenne pepper', grams: 0.9, displayType: 'Normal',
        },
        {
          ingredientID: 16396, displayValue: '1 teaspoon garlic powder', grams: 2.7766666, displayType: 'Normal',
        },
        {
          ingredientID: 20235, displayValue: '1/4 teaspoon Old Bay Seasoning TM', grams: 0.6, displayType: 'Normal',
        },
        {
          ingredientID: 16421, displayValue: 'salt to taste', grams: 0.0, displayType: 'HideAmounts',
        },
        {
          ingredientID: 16406, displayValue: 'ground black pepper to taste', grams: 0.0, displayType: 'HideAmounts',
        },
        {
          ingredientID: 22318, displayValue: '1 cup panko (Japanese bread crumbs) or regular dry bread crumbs', grams: 100.0, displayType: 'Normal',
        }],
        servings: 10,
        prepMinutes: 20,
        cookMinutes: 10,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/2432529.jpg',
        id: 19490,
      },
      {
        title: "Ken's Perfect Hard Boiled Egg (And I Mean Perfect)",
        nutrition: {
          calories: {
            name: 'Calories', amount: 71.65, unit: 'kcal', displayValue: '72', dailyValue: '72', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 4.97, unit: 'g', displayValue: '5', dailyValue: '5', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 186.0, unit: 'mg', displayValue: '186', dailyValue: '186', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 947.3876, unit: 'mg', displayValue: '947', dailyValue: '947', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 0.385, unit: 'g', displayValue: '0.4', dailyValue: '0.4', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 6.29, unit: 'g', displayValue: '6.3', dailyValue: '6.3', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 23.5, unit: 'mcg', displayValue: '24', dailyValue: '24', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 7.8, unit: 'mg', displayValue: '8', dailyValue: '8', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.0715, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 1.394358, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.031, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.922425, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 32.3725, unit: 'mg', displayValue: '32', dailyValue: '32', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 0.0, unit: 'mg', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 243.5, unit: 'IU', displayValue: '244', dailyValue: '244', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.385, unit: 'g', displayValue: '0.4', dailyValue: '0.4', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 68.9575, unit: 'mg', displayValue: '69', dailyValue: '69', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 1.5495, unit: 'g', displayValue: '1.5', dailyValue: '1.5', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 44.73, unit: 'kcal', displayValue: '45', dailyValue: '45', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.0, unit: 'g', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 16421, displayValue: '1 tablespoon salt', grams: 18.0, displayType: 'Normal',
        },
        {
          ingredientID: 7842, displayValue: '1/4 cup distilled white vinegar', grams: 60.0, displayType: 'Normal',
        },
        {
          ingredientID: 2496, displayValue: '6 cups water', grams: 1422.0, displayType: 'Normal',
        },
        {
          ingredientID: 16317, displayValue: '8 eggs', grams: 400.0, displayType: 'Normal',
        }],
        servings: 8,
        prepMinutes: 5,
        cookMinutes: 20,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/377646.jpg',
        id: 213737,
      },
      {
        title: 'Creamy Dill Cucumber Toasties',
        nutrition: {
          calories: {
            name: 'Calories', amount: 247.365, unit: 'kcal', displayValue: '247', dailyValue: '247', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 14.50443, unit: 'g', displayValue: '14.5', dailyValue: '14.5', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 24.01667, unit: 'mg', displayValue: '24', dailyValue: '24', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 618.9833, unit: 'mg', displayValue: '619', dailyValue: '619', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 23.6657, unit: 'g', displayValue: '23.7', dailyValue: '23.7', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 6.07885, unit: 'g', displayValue: '6.1', dailyValue: '6.1', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 60.045, unit: 'mcg', displayValue: '60', dailyValue: '60', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 14.72333, unit: 'mg', displayValue: '15', dailyValue: '15', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.109015, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 2.839115, unit: 'mg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.2046033, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 1.745483, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 37.86167, unit: 'mg', displayValue: '38', dailyValue: '38', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 0.6256667, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 304.17, unit: 'IU', displayValue: '304', dailyValue: '304', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 2.211533, unit: 'g', displayValue: '2.2', dailyValue: '2.2', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 101.7533, unit: 'mg', displayValue: '102', dailyValue: '102', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 5.384367, unit: 'g', displayValue: '5.4', dailyValue: '5.4', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 130.5399, unit: 'kcal', displayValue: '131', dailyValue: '131', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 1.014, unit: 'g', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 16223, displayValue: '1 (8 ounce) package cream cheese, softened', grams: 224.0, displayType: 'Normal',
        },
        {
          ingredientID: 11440, displayValue: '1 (.7 ounce) package dry Italian-style salad dressing mix', grams: 19.88, displayType: 'Normal',
        },
        {
          ingredientID: 6294, displayValue: '1/2 cup mayonnaise', grams: 110.0, displayType: 'Normal',
        },
        {
          ingredientID: 20414, displayValue: '1 French baguette, cut into 1/2 inch thick circles', grams: 454.0, displayType: 'Normal',
        },
        {
          ingredientID: 4335, displayValue: '1 cucumber, sliced', grams: 200.0, displayType: 'Normal',
        },
        {
          ingredientID: 16393, displayValue: '2 teaspoons dried dill weed', grams: 2.0, displayType: 'Normal',
        }],
        servings: 12,
        prepMinutes: 15,
        cookMinutes: 0,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/29940.jpg',
        id: 14811,
      },
      {
        title: 'Potato Chips',
        nutrition: {
          calories: {
            name: 'Calories', amount: 80.24875, unit: 'kcal', displayValue: '80', dailyValue: '80', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 3.454, unit: 'g', displayValue: '3.5', dailyValue: '3.5', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 0.0, unit: 'mg', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 294.505, unit: 'mg', displayValue: '295', dailyValue: '295', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 11.5746, unit: 'g', displayValue: '11.6', dailyValue: '11.6', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 1.1651, unit: 'g', displayValue: '1.2', dailyValue: '1.2', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 5.73, unit: 'mcg', displayValue: '6', dailyValue: '6', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 12.9, unit: 'mg', displayValue: '13', dailyValue: '13', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.16426, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 1.119987, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.0573, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.5962781, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 5.4325, unit: 'mg', displayValue: '5', dailyValue: '5', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 7.21025, unit: 'mg', displayValue: '7', dailyValue: '7', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 0.0, unit: 'IU', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.0, unit: 'g', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 213.5025, unit: 'mg', displayValue: '214', dailyValue: '214', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 0.5454931, unit: 'g', displayValue: '0.5', dailyValue: '0.5', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 31.086, unit: 'kcal', displayValue: '31', dailyValue: '31', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 1.09825, unit: 'g', displayValue: '1.1', dailyValue: '1.1', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 6305, displayValue: '1 tablespoon vegetable oil', grams: 13.625, displayType: 'Normal',
        },
        {
          ingredientID: 4442, displayValue: '1 potato, sliced paper thin (peel optional)', grams: 213.0, displayType: 'Normal',
        },
        {
          ingredientID: 16421, displayValue: '1/2 teaspoon salt, or to taste', grams: 3.0, displayType: 'Normal',
        }],
        servings: 4,
        prepMinutes: 30,
        cookMinutes: 5,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/969840.jpg',
        id: 66646,
      },
      {
        title: 'Chicken and Broccoli Braid',
        nutrition: {
          calories: {
            name: 'Calories', amount: 580.0427, unit: 'kcal', displayValue: '580', dailyValue: '580', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 36.26603, unit: 'g', displayValue: '36.3', dailyValue: '36.3', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 99.075, unit: 'mg', displayValue: '99', dailyValue: '99', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 755.5439, unit: 'mg', displayValue: '756', dailyValue: '756', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 36.32227, unit: 'g', displayValue: '36.3', dailyValue: '36.3', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 26.71566, unit: 'g', displayValue: '26.7', dailyValue: '26.7', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 22.77045, unit: 'mcg', displayValue: '23', dailyValue: '23', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 29.16761, unit: 'mg', displayValue: '29', dailyValue: '29', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.4564837, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 10.94287, unit: 'mg', displayValue: '11', dailyValue: '11', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.06168321, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 2.901353, unit: 'mg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 214.4965, unit: 'mg', displayValue: '214', dailyValue: '214', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 29.76708, unit: 'mg', displayValue: '30', dailyValue: '30', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 751.7304, unit: 'IU', displayValue: '752', dailyValue: '752', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 2.718443, unit: 'g', displayValue: '2.7', dailyValue: '2.7', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 249.8586, unit: 'mg', displayValue: '250', dailyValue: '250', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 14.21253, unit: 'g', displayValue: '14.2', dailyValue: '14.2', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 326.3943, unit: 'kcal', displayValue: '326', dailyValue: '326', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 3.527302, unit: 'g', displayValue: '3.5', dailyValue: '3.5', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 6549, displayValue: '2 cups diced, cooked chicken meat', grams: 280.0, displayType: 'Normal',
        },
        {
          ingredientID: 4252, displayValue: '1 cup fresh broccoli, chopped', grams: 88.0, displayType: 'Normal',
        },
        {
          ingredientID: 4786, displayValue: '1/2 cup red bell pepper, chopped', grams: 74.5, displayType: 'Normal',
        },
        {
          ingredientID: 4342, displayValue: '1 clove crushed garlic', grams: 3.0, displayType: 'Normal',
        },
        {
          ingredientID: 16215, displayValue: '1 cup shredded Cheddar cheese', grams: 113.0, displayType: 'Normal',
        },
        {
          ingredientID: 6294, displayValue: '1/2 cup mayonnaise', grams: 110.0, displayType: 'Normal',
        },
        {
          ingredientID: 16393, displayValue: '2 teaspoons dried dill weed', grams: 2.0, displayType: 'Normal',
        },
        {
          ingredientID: 16421, displayValue: '1/4 teaspoon salt', grams: 1.5, displayType: 'Normal',
        },
        {
          ingredientID: 3767, displayValue: '2 tablespoons slivered almonds', grams: 11.97479, displayType: 'Normal',
        },
        {
          ingredientID: 4397, displayValue: '1/4 cup diced onion', grams: 41.8, displayType: 'Normal',
        },
        {
          ingredientID: 18173, displayValue: '2 (8 ounce) packages refrigerated crescent rolls', grams: 448.0, displayType: 'Normal',
        },
        {
          ingredientID: 16318, displayValue: '1 egg white, beaten', grams: 33.4, displayType: 'Normal',
        }],
        servings: 6,
        prepMinutes: 20,
        cookMinutes: 28,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/584518.jpg',
        id: 15028,
      },
      {
        title: 'Boneless Buffalo Wings',
        nutrition: {
          calories: {
            name: 'Calories', amount: 709.9154, unit: 'kcal', displayValue: '710', dailyValue: '710', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 46.85619, unit: 'g', displayValue: '46.9', dailyValue: '46.9', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 135.8433, unit: 'mg', displayValue: '136', dailyValue: '136', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 2334.474, unit: 'mg', displayValue: '2334', dailyValue: '2334', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 43.65352, unit: 'g', displayValue: '43.7', dailyValue: '43.7', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 28.01628, unit: 'g', displayValue: '28', dailyValue: '28', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 88.54784, unit: 'mcg', displayValue: '89', dailyValue: '89', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 41.15263, unit: 'mg', displayValue: '41', dailyValue: '41', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.4570498, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 15.23549, unit: 'mg', displayValue: '15', dailyValue: '15', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.4671406, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 3.500216, unit: 'mg', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 130.8022, unit: 'mg', displayValue: '131', dailyValue: '131', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 14.72251, unit: 'mg', displayValue: '15', dailyValue: '15', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 750.8976, unit: 'IU', displayValue: '751', dailyValue: '751', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 4.285873, unit: 'g', displayValue: '4.3', dailyValue: '4.3', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 389.2056, unit: 'mg', displayValue: '389', dailyValue: '389', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 10.40461, unit: 'g', displayValue: '10.4', dailyValue: '10.4', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 421.7057, unit: 'kcal', displayValue: '422', dailyValue: '422', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 1.748359, unit: 'g', displayValue: '1.7', dailyValue: '1.7', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 20482, displayValue: 'oil for deep frying', grams: 880.0, displayType: 'HideAmounts',
        },
        {
          ingredientID: 1767, displayValue: '1 cup unbleached all-purpose flour', grams: 125.0, displayType: 'Normal',
        },
        {
          ingredientID: 16421, displayValue: '2 teaspoons salt', grams: 12.0, displayType: 'Normal',
        },
        {
          ingredientID: 16406, displayValue: '1/2 teaspoon ground black pepper', grams: 1.05, displayType: 'Normal',
        },
        {
          ingredientID: 16407, displayValue: '1/2 teaspoon cayenne pepper', grams: 0.9, displayType: 'Normal',
        },
        {
          ingredientID: 16396, displayValue: '1/4 teaspoon garlic powder', grams: 0.69416666, displayType: 'Normal',
        },
        {
          ingredientID: 16404, displayValue: '1/2 teaspoon paprika', grams: 1.1404166, displayType: 'Normal',
        },
        {
          ingredientID: 16317, displayValue: '1 egg', grams: 44.0, displayType: 'Normal',
        },
        {
          ingredientID: 16278, displayValue: '1 cup milk', grams: 244.0, displayType: 'Normal',
        },
        {
          ingredientID: 6494, displayValue: '3 skinless, boneless chicken breasts, cut into 1/2-inch strips', grams: 340.5, displayType: 'Normal',
        },
        {
          ingredientID: 5592, displayValue: '1/4 cup hot pepper sauce', grams: 55.93, displayType: 'Normal',
        },
        {
          ingredientID: 16157, displayValue: '1 tablespoon butter', grams: 14.2, displayType: 'Normal',
        }],
        servings: 3,
        prepMinutes: 10,
        cookMinutes: 20,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/4468777.jpg',
        id: 151266,
      },
      {
        title: 'Balsamic Bruschetta',
        nutrition: {
          calories: {
            name: 'Calories', amount: 194.1063, unit: 'kcal', displayValue: '194', dailyValue: '194', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 2.49334, unit: 'g', displayValue: '2.5', dailyValue: '2.5', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 2.2, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 470.9183, unit: 'mg', displayValue: '471', dailyValue: '471', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 35.18819, unit: 'g', displayValue: '35.2', dailyValue: '35.2', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 8.29261, unit: 'g', displayValue: '8.3', dailyValue: '8.3', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 94.76038, unit: 'mcg', displayValue: '95', dailyValue: '95', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 25.09606, unit: 'mg', displayValue: '25', dailyValue: '25', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.1197761, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 4.518278, unit: 'mg', displayValue: '5', dailyValue: '5', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.334832, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 2.355294, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 64.21992, unit: 'mg', displayValue: '64', dailyValue: '64', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 8.560945, unit: 'mg', displayValue: '9', dailyValue: '9', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 620.1888, unit: 'IU', displayValue: '620', dailyValue: '620', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 3.395263, unit: 'g', displayValue: '3.4', dailyValue: '3.4', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 233.2129, unit: 'mg', displayValue: '233', dailyValue: '233', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 0.8160795, unit: 'g', displayValue: '0.8', dailyValue: '0.8', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 22.44006, unit: 'kcal', displayValue: '22', dailyValue: '22', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 2.167172, unit: 'g', displayValue: '2.2', dailyValue: '2.2', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 20453, displayValue: '8 roma (plum) tomatoes, diced', grams: 496.0, displayType: 'Normal',
        },
        {
          ingredientID: 16159, displayValue: '1/3 cup chopped fresh basil', grams: 14.015554, displayType: 'Normal',
        },
        {
          ingredientID: 16238, displayValue: '1/4 cup shredded Parmesan cheese', grams: 20.0, displayType: 'Normal',
        },
        {
          ingredientID: 4342, displayValue: '2 cloves garlic, minced', grams: 6.0, displayType: 'Normal',
        },
        {
          ingredientID: 18930, displayValue: '1 tablespoon balsamic vinegar', grams: 15.0, displayType: 'Normal',
        },
        {
          ingredientID: 6307, displayValue: '1 teaspoon olive oil', grams: 4.757709, displayType: 'Normal',
        },
        {
          ingredientID: 18866, displayValue: '1/4 teaspoon kosher salt', grams: 1.2, displayType: 'Normal',
        },
        {
          ingredientID: 16406, displayValue: '1/4 teaspoon freshly ground black pepper', grams: 0.525, displayType: 'Normal',
        },
        {
          ingredientID: 2073, displayValue: '1 loaf French bread, toasted and sliced', grams: 454.0, displayType: 'Normal',
        }],
        servings: 8,
        prepMinutes: 15,
        cookMinutes: 0,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/866248.jpg',
        id: 54165,
      },
      {
        title: 'Sausage Stuffed Jalapenos',
        nutrition: {
          calories: {
            name: 'Calories', amount: 361.595, unit: 'kcal', displayValue: '362', dailyValue: '362', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 34.27602, unit: 'g', displayValue: '34.3', dailyValue: '34.3', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 57.54, unit: 'mg', displayValue: '58', dailyValue: '58', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 601.3133, unit: 'mg', displayValue: '601', dailyValue: '601', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 4.2746, unit: 'g', displayValue: '4.3', dailyValue: '4.3', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 9.177466, unit: 'g', displayValue: '9.2', dailyValue: '9.2', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 22.38833, unit: 'mcg', displayValue: '22', dailyValue: '22', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 15.00333, unit: 'mg', displayValue: '15', dailyValue: '15', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.2988167, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 2.359634, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.266845, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.9279167, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 105.0667, unit: 'mg', displayValue: '105', dailyValue: '105', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 17.5555, unit: 'mg', displayValue: '18', dailyValue: '18', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 590.355, unit: 'IU', displayValue: '590', dailyValue: '590', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 2.10442, unit: 'g', displayValue: '2.1', dailyValue: '2.1', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 198.5417, unit: 'mg', displayValue: '199', dailyValue: '199', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 12.33699, unit: 'g', displayValue: '12.3', dailyValue: '12.3', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 308.4841, unit: 'kcal', displayValue: '308', dailyValue: '308', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 1.056413, unit: 'g', displayValue: '1.1', dailyValue: '1.1', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 5861, displayValue: '1 pound ground pork sausage', grams: 454.0, displayType: 'Normal',
        },
        {
          ingredientID: 16223, displayValue: '1 (8 ounce) package cream cheese, softened', grams: 224.0, displayType: 'Normal',
        },
        {
          ingredientID: 16238, displayValue: '1 cup shredded Parmesan cheese', grams: 80.0, displayType: 'Normal',
        },
        {
          ingredientID: 3725, displayValue: '1 pound large fresh jalapeno peppers, halved lengthwise and seeded', grams: 454.0, displayType: 'Normal',
        },
        {
          ingredientID: 6345, displayValue: '1 (8 ounce) bottle Ranch dressing (optional)', grams: 232.0, displayType: 'OptionalIngredient',
        }],
        servings: 12,
        prepMinutes: 25,
        cookMinutes: 20,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/3289946.jpg',
        id: 83500,
      },
      {
        title: 'Easy Guacamole',
        nutrition: {
          calories: {
            name: 'Calories', amount: 44.86938, unit: 'kcal', displayValue: '45', dailyValue: '45', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 3.712387, unit: 'g', displayValue: '3.7', dailyValue: '3.7', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 0.0, unit: 'mg', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 2.43375, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 3.356488, unit: 'g', displayValue: '3.4', dailyValue: '3.4', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 0.6595125, unit: 'g', displayValue: '0.7', dailyValue: '0.7', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 22.67625, unit: 'mcg', displayValue: '23', dailyValue: '23', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 8.8675, unit: 'mg', displayValue: '9', dailyValue: '9', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.0800875, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 0.623626, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.03513938, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.1964438, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 6.51125, unit: 'mg', displayValue: '7', dailyValue: '7', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 5.089625, unit: 'mg', displayValue: '5', dailyValue: '5', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 102.9175, unit: 'IU', displayValue: '103', dailyValue: '103', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.62615, unit: 'g', displayValue: '0.6', dailyValue: '0.6', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 151.4863, unit: 'mg', displayValue: '151', dailyValue: '151', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 0.5392356, unit: 'g', displayValue: '0.5', dailyValue: '0.5', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 33.41149, unit: 'kcal', displayValue: '33', dailyValue: '33', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 1.971188, unit: 'g', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 5012, displayValue: '2 avocados', grams: 402.0, displayType: 'Normal',
        },
        {
          ingredientID: 4397, displayValue: '1 small onion, finely chopped', grams: 70.0, displayType: 'Normal',
        },
        {
          ingredientID: 4342, displayValue: '1 clove garlic, minced', grams: 3.0, displayType: 'Normal',
        },
        {
          ingredientID: 4572, displayValue: '1 ripe tomato, chopped', grams: 123.0, displayType: 'Normal',
        },
        {
          ingredientID: 5111, displayValue: '1 lime, juiced', grams: 67.0, displayType: 'Normal',
        },
        {
          ingredientID: 16421, displayValue: 'salt and pepper to taste', grams: 0.0, displayType: 'HideAmounts',
        }],
        servings: 16,
        prepMinutes: 10,
        cookMinutes: 0,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/4127982.jpg',
        id: 14064,
      },
      {
        title: 'Cream Cheese Penguins',
        nutrition: {
          calories: {
            name: 'Calories', amount: 57.08444, unit: 'kcal', displayValue: '57', dailyValue: '57', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 5.524071, unit: 'g', displayValue: '5.5', dailyValue: '5.5', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 13.68889, unit: 'mg', displayValue: '14', dailyValue: '14', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 104.1662, unit: 'mg', displayValue: '104', dailyValue: '104', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 1.247876, unit: 'g', displayValue: '1.2', dailyValue: '1.2', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 1.003636, unit: 'g', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 2.377778, unit: 'mcg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 1.354667, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.01165689, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 0.1896676, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.006091556, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.2669334, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 14.09156, unit: 'mg', displayValue: '14', dailyValue: '14', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 0.2648, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 848.6383, unit: 'IU', displayValue: '849', dailyValue: '849', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.2144889, unit: 'g', displayValue: '0.2', dailyValue: '0.2', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 27.86489, unit: 'mg', displayValue: '28', dailyValue: '28', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 2.780307, unit: 'g', displayValue: '2.8', dailyValue: '2.8', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 49.71664, unit: 'kcal', displayValue: '50', dailyValue: '50', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.2144, unit: 'g', displayValue: '0.2', dailyValue: '0.2', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 10445, displayValue: '18 jumbo black olives, pitted', grams: 84.0, displayType: 'Normal',
        },
        {
          ingredientID: 16223, displayValue: '1 (8 ounce) package cream cheese, softened', grams: 224.0, displayType: 'Normal',
        },
        {
          ingredientID: 5133, displayValue: '18 small black olives', grams: 57.600002, displayType: 'Normal',
        },
        {
          ingredientID: 4279, displayValue: '1 carrot', grams: 72.0, displayType: 'Normal',
        }],
        servings: 18,
        prepMinutes: 30,
        cookMinutes: 0,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/580469.jpg',
        id: 19687,
      },
      {
        title: 'Chewy Granola Bars',
        nutrition: {
          calories: {
            name: 'Calories', amount: 299.1823, unit: 'kcal', displayValue: '299', dailyValue: '299', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 13.97442, unit: 'g', displayValue: '14', dailyValue: '14', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 18.07593, unit: 'mg', displayValue: '18', dailyValue: '18', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 123.3541, unit: 'mg', displayValue: '123', dailyValue: '123', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 42.92887, unit: 'g', displayValue: '42.9', dailyValue: '42.9', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 4.292315, unit: 'g', displayValue: '4.3', dailyValue: '4.3', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 22.16852, unit: 'mcg', displayValue: '22', dailyValue: '22', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 52.33037, unit: 'mg', displayValue: '52', dailyValue: '52', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.03427852, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 1.725732, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.2031117, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 1.854949, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 23.71352, unit: 'mg', displayValue: '24', dailyValue: '24', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 0.04708333, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 210.1011, unit: 'IU', displayValue: '210', dailyValue: '210', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 22.41647, unit: 'g', displayValue: '22.4', dailyValue: '22.4', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 163.5859, unit: 'mg', displayValue: '164', dailyValue: '164', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 7.966224, unit: 'g', displayValue: '8', dailyValue: '8', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 125.7697, unit: 'kcal', displayValue: '126', dailyValue: '126', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 3.385695, unit: 'g', displayValue: '3.4', dailyValue: '3.4', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 6057, displayValue: '4 1/2 cups rolled oats', grams: 364.5, displayType: 'Normal',
        },
        {
          ingredientID: 1684, displayValue: '1 cup all-purpose flour', grams: 125.0, displayType: 'Normal',
        },
        {
          ingredientID: 2359, displayValue: '1 teaspoon baking soda', grams: 4.6, displayType: 'Normal',
        },
        {
          ingredientID: 16424, displayValue: '1 teaspoon vanilla extract', grams: 4.3333335, displayType: 'Normal',
        },
        {
          ingredientID: 16157, displayValue: '2/3 cup butter, softened', grams: 151.33334, displayType: 'Normal',
        },
        {
          ingredientID: 1502, displayValue: '1/2 cup honey', grams: 169.5, displayType: 'Normal',
        },
        {
          ingredientID: 1525, displayValue: '1/3 cup packed brown sugar', grams: 73.33333, displayType: 'Normal',
        },
        {
          ingredientID: 8610, displayValue: '2 cups miniature semisweet chocolate chips', grams: 346.0, displayType: 'Normal',
        }],
        servings: 18,
        prepMinutes: 0,
        cookMinutes: 0,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/3546347.jpg',
        id: 11382,
      },
      {
        title: 'Easy Granola Bars',
        nutrition: {
          calories: {
            name: 'Calories', amount: 178.9624, unit: 'kcal', displayValue: '179', dailyValue: '179', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 8.070976, unit: 'g', displayValue: '8.1', dailyValue: '8.1', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 8.097501, unit: 'mg', displayValue: '8', dailyValue: '8', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 37.78683, unit: 'mg', displayValue: '38', dailyValue: '38', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 24.75254, unit: 'g', displayValue: '24.8', dailyValue: '24.8', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 3.874262, unit: 'g', displayValue: '3.9', dailyValue: '3.9', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 7.249667, unit: 'mcg', displayValue: '7', dailyValue: '7', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 39.19715, unit: 'mg', displayValue: '39', dailyValue: '39', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.02712383, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 1.164553, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.09913625, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.9163437, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 64.39817, unit: 'mg', displayValue: '64', dailyValue: '64', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 0.4246667, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 73.57733, unit: 'IU', displayValue: '74', dailyValue: '74', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 16.19502, unit: 'g', displayValue: '16.2', dailyValue: '16.2', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 164.8012, unit: 'mg', displayValue: '165', dailyValue: '165', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 3.863121, unit: 'g', displayValue: '3.9', dailyValue: '3.9', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 72.63879, unit: 'kcal', displayValue: '73', dailyValue: '73', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 2.346513, unit: 'g', displayValue: '2.3', dailyValue: '2.3', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 22082, displayValue: '3 cups quick-cooking oats', grams: 243.0, displayType: 'Normal',
        },
        {
          ingredientID: 16294, displayValue: '1 (14 ounce) can sweetened condensed milk', grams: 392.0, displayType: 'Normal',
        },
        {
          ingredientID: 16157, displayValue: '2 tablespoons butter, melted', grams: 28.4, displayType: 'Normal',
        },
        {
          ingredientID: 3789, displayValue: '1 cup flaked coconut', grams: 74.0, displayType: 'Normal',
        },
        {
          ingredientID: 3767, displayValue: '1 cup sliced almonds', grams: 95.0, displayType: 'Normal',
        },
        {
          ingredientID: 8610, displayValue: '1 cup miniature semisweet chocolate chips', grams: 173.0, displayType: 'Normal',
        },
        {
          ingredientID: 11026, displayValue: '1/2 cup sweetened dried cranberries', grams: 60.60606, displayType: 'Normal',
        }],
        servings: 24,
        prepMinutes: 5,
        cookMinutes: 20,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/466805.jpg',
        id: 25794,
      },
      {
        title: "Lana's Sweet and Sour Meatballs",
        nutrition: {
          calories: {
            name: 'Calories', amount: 427.0187, unit: 'kcal', displayValue: '427', dailyValue: '427', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 16.47437, unit: 'g', displayValue: '16.5', dailyValue: '16.5', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 123.9675, unit: 'mg', displayValue: '124', dailyValue: '124', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 479.3006, unit: 'mg', displayValue: '479', dailyValue: '479', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 42.08243, unit: 'g', displayValue: '42.1', dailyValue: '42.1', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 27.41927, unit: 'g', displayValue: '27.4', dailyValue: '27.4', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 40.82301, unit: 'mcg', displayValue: '41', dailyValue: '41', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 41.29879, unit: 'mg', displayValue: '41', dailyValue: '41', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.3752162, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 10.85516, unit: 'mg', displayValue: '11', dailyValue: '11', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.2387041, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 3.630599, unit: 'mg', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 74.81457, unit: 'mg', displayValue: '75', dailyValue: '75', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 23.87863, unit: 'mg', displayValue: '24', dailyValue: '24', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 2413.695, unit: 'IU', displayValue: '2414', dailyValue: '2414', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 27.12719, unit: 'g', displayValue: '27.1', dailyValue: '27.1', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 473.8709, unit: 'mg', displayValue: '474', dailyValue: '474', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 6.216463, unit: 'g', displayValue: '6.2', dailyValue: '6.2', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 148.2693, unit: 'kcal', displayValue: '148', dailyValue: '148', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 2.092681, unit: 'g', displayValue: '2.1', dailyValue: '2.1', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 4147, displayValue: '2 pounds lean ground beef', grams: 908.0, displayType: 'Normal',
        },
        {
          ingredientID: 16317, displayValue: '2 eggs', grams: 100.0, displayType: 'Normal',
        },
        {
          ingredientID: 2112, displayValue: '1 cup dry bread crumbs', grams: 108.0, displayType: 'Normal',
        },
        {
          ingredientID: 4397, displayValue: '1/2 cup finely chopped onion', grams: 83.6, displayType: 'Normal',
        },
        {
          ingredientID: 16397, displayValue: '1/2 teaspoon ground ginger', grams: 0.9, displayType: 'Normal',
        },
        {
          ingredientID: 18741, displayValue: '1 teaspoon seasoning salt', grams: 4.0, displayType: 'Normal',
        },
        {
          ingredientID: 16406, displayValue: '1/2 teaspoon ground black pepper', grams: 1.05, displayType: 'Normal',
        },
        {
          ingredientID: 7428, displayValue: '2 teaspoons Worcestershire sauce', grams: 11.333333, displayType: 'Normal',
        },
        {
          ingredientID: 1526, displayValue: '2 teaspoons granulated sugar', grams: 8.333333, displayType: 'Normal',
        },
        {
          ingredientID: 0, displayValue: '', grams: 0.0, displayType: 'BlankLine',
        },
        {
          ingredientID: 22117, displayValue: '1 (20 ounce) can pineapple chunks, drained with juice reserved', grams: 560.0, displayType: 'Normal',
        },
        {
          ingredientID: 2496, displayValue: '1/3 cup water', grams: 78.99999, displayType: 'Normal',
        },
        {
          ingredientID: 7842, displayValue: '3 tablespoons distilled white vinegar', grams: 44.40529, displayType: 'Normal',
        },
        {
          ingredientID: 2882, displayValue: '1 tablespoon soy sauce', grams: 16.0, displayType: 'Normal',
        },
        {
          ingredientID: 1525, displayValue: '1/2 cup packed brown sugar', grams: 110.0, displayType: 'Normal',
        },
        {
          ingredientID: 1636, displayValue: '3 tablespoons cornstarch', grams: 24.0, displayType: 'Normal',
        },
        {
          ingredientID: 16397, displayValue: '1/2 teaspoon ground ginger', grams: 0.9, displayType: 'Normal',
        },
        {
          ingredientID: 18741, displayValue: '1/2 teaspoon seasoning salt', grams: 2.0, displayType: 'Normal',
        },
        {
          ingredientID: 4279, displayValue: '1 large carrot, diced', grams: 72.0, displayType: 'Normal',
        },
        {
          ingredientID: 4432, displayValue: '1 large green bell pepper, cut into 1/2 inch pieces', grams: 164.0, displayType: 'Normal',
        }],
        servings: 8,
        prepMinutes: 20,
        cookMinutes: 35,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/666917.jpg',
        id: 26616,
      },
      {
        title: 'Grilled Shrimp Scampi',
        nutrition: {
          calories: {
            name: 'Calories', amount: 173.0952, unit: 'kcal', displayValue: '173', dailyValue: '173', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 10.00204, unit: 'g', displayValue: '10', dailyValue: '10', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 172.575, unit: 'mg', displayValue: '173', dailyValue: '173', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 199.8853, unit: 'mg', displayValue: '200', dailyValue: '200', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 1.585727, unit: 'g', displayValue: '1.6', dailyValue: '1.6', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 18.71317, unit: 'g', displayValue: '18.7', dailyValue: '18.7', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 7.894855, unit: 'mcg', displayValue: '8', dailyValue: '8', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 32.34674, unit: 'mg', displayValue: '32', dailyValue: '32', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.1398921, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 6.662091, unit: 'mg', displayValue: '7', dailyValue: '7', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.03498876, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 2.963117, unit: 'mg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 41.00182, unit: 'mg', displayValue: '41', dailyValue: '41', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 9.66745, unit: 'mg', displayValue: '10', dailyValue: '10', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 411.5083, unit: 'IU', displayValue: '412', dailyValue: '412', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.2874019, unit: 'g', displayValue: '0.3', dailyValue: '0.3', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 193.379, unit: 'mg', displayValue: '193', dailyValue: '193', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 1.507137, unit: 'g', displayValue: '1.5', dailyValue: '1.5', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 90.01838, unit: 'kcal', displayValue: '90', dailyValue: '90', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.189086, unit: 'g', displayValue: '0.2', dailyValue: '0.2', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 6307, displayValue: '1/4 cup olive oil', grams: 54.0, displayType: 'Normal',
        },
        {
          ingredientID: 5107, displayValue: '1/4 cup lemon juice', grams: 61.0, displayType: 'Normal',
        },
        {
          ingredientID: 4409, displayValue: '3 tablespoons chopped fresh parsley', grams: 11.25, displayType: 'Normal',
        },
        {
          ingredientID: 4342, displayValue: '1 tablespoon minced garlic', grams: 8.387665, displayType: 'Normal',
        },
        {
          ingredientID: 16406, displayValue: 'ground black pepper to taste', grams: 0.525, displayType: 'HideAmounts',
        },
        {
          ingredientID: 20244, displayValue: 'crushed red pepper flakes to taste (optional)', grams: 0.75, displayType: 'OptionalHideAmounts',
        },
        {
          ingredientID: 2664, displayValue: '1 1/2 pounds medium shrimp, peeled and deveined', grams: 681.0, displayType: 'Normal',
        }],
        servings: 6,
        prepMinutes: 30,
        cookMinutes: 6,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/3214.jpg',
        id: 12771,
      },
      {
        title: 'Easy Cheese Ball II',
        nutrition: {
          calories: {
            name: 'Calories', amount: 557.3972, unit: 'kcal', displayValue: '557', dailyValue: '557', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 52.50129, unit: 'g', displayValue: '52.5', dailyValue: '52.5', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 112.775, unit: 'mg', displayValue: '113', dailyValue: '113', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 720.0579, unit: 'mg', displayValue: '720', dailyValue: '720', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 7.456271, unit: 'g', displayValue: '7.5', dailyValue: '7.5', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 17.02278, unit: 'g', displayValue: '17', dailyValue: '17', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 20.72286, unit: 'mcg', displayValue: '21', dailyValue: '21', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 43.40214, unit: 'mg', displayValue: '43', dailyValue: '43', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.1089943, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 3.392055, unit: 'mg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.1759336, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 1.633364, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 358.525, unit: 'mg', displayValue: '359', dailyValue: '359', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 0.2569286, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 1278.899, unit: 'IU', displayValue: '1279', dailyValue: '1279', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 1.265136, unit: 'g', displayValue: '1.3', dailyValue: '1.3', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 231.4743, unit: 'mg', displayValue: '231', dailyValue: '231', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 24.01384, unit: 'g', displayValue: '24', dailyValue: '24', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 472.5116, unit: 'kcal', displayValue: '473', dailyValue: '473', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 2.242286, unit: 'g', displayValue: '2.2', dailyValue: '2.2', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 16223, displayValue: '2 (8 ounce) packages cream cheese, softened', grams: 448.0, displayType: 'Normal',
        },
        {
          ingredientID: 11444, displayValue: '1 (1 ounce) package ranch dressing mix', grams: 28.0, displayType: 'Normal',
        },
        {
          ingredientID: 16215, displayValue: '2 1/2 cups shredded Cheddar cheese', grams: 282.5, displayType: 'Normal',
        },
        {
          ingredientID: 3810, displayValue: '1 1/2 cups chopped pecans', grams: 163.5, displayType: 'Normal',
        }],
        servings: 7,
        prepMinutes: 5,
        cookMinutes: 0,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/3412205.jpg',
        id: 14927,
      },
      {
        title: 'Chicken Wing Dip',
        nutrition: {
          calories: {
            name: 'Calories', amount: 239.8721, unit: 'kcal', displayValue: '240', dailyValue: '240', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 21.78538, unit: 'g', displayValue: '21.8', dailyValue: '21.8', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 57.03731, unit: 'mg', displayValue: '57', dailyValue: '57', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 357.1999, unit: 'mg', displayValue: '357', dailyValue: '357', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 1.606047, unit: 'g', displayValue: '1.6', dailyValue: '1.6', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 9.392221, unit: 'g', displayValue: '9.4', dailyValue: '9.4', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 5.821694, unit: 'mcg', displayValue: '6', dailyValue: '6', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 9.202375, unit: 'mg', displayValue: '9', dailyValue: '9', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.08643951, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 3.080403, unit: 'mg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.01761854, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.7033723, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 92.29764, unit: 'mg', displayValue: '92', dailyValue: '92', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 0.5009094, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 655.1097, unit: 'IU', displayValue: '655', dailyValue: '655', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.6944634, unit: 'g', displayValue: '0.7', dailyValue: '0.7', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 93.44703, unit: 'mg', displayValue: '93', dailyValue: '93', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 9.53299, unit: 'g', displayValue: '9.5', dailyValue: '9.5', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 196.0684, unit: 'kcal', displayValue: '196', dailyValue: '196', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.1064213, unit: 'g', displayValue: '0.1', dailyValue: '0.1', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 16223, displayValue: '2 (8 ounce) packages cream cheese, softened', grams: 448.0, displayType: 'Normal',
        },
        {
          ingredientID: 5593, displayValue: "3/4 cup pepper sauce (such as Frank's Red Hot®)", grams: 167.79001, displayType: 'Normal',
        },
        {
          ingredientID: 6345, displayValue: '1 cup Ranch-style salad dressing', grams: 232.0, displayType: 'Normal',
        },
        {
          ingredientID: 6493, displayValue: '2 cups diced cooked chicken', grams: 280.0, displayType: 'Normal',
        },
        {
          ingredientID: 16215, displayValue: '1 cup shredded Cheddar cheese', grams: 137.94, displayType: 'Normal',
        }],
        servings: 16,
        prepMinutes: 10,
        cookMinutes: 30,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/349675.jpg',
        id: 90544,
      },
      {
        title: 'Hot Pizza Dip',
        nutrition: {
          calories: {
            name: 'Calories', amount: 115.3779, unit: 'kcal', displayValue: '115', dailyValue: '115', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 9.536527, unit: 'g', displayValue: '9.5', dailyValue: '9.5', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 29.005, unit: 'mg', displayValue: '29', dailyValue: '29', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 271.4052, unit: 'mg', displayValue: '271', dailyValue: '271', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 1.899315, unit: 'g', displayValue: '1.9', dailyValue: '1.9', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 5.606032, unit: 'g', displayValue: '5.6', dailyValue: '5.6', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 3.315438, unit: 'mcg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 5.287833, unit: 'mg', displayValue: '5', dailyValue: '5', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.02789188, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 1.488034, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.01789564, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.5629487, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 105.2217, unit: 'mg', displayValue: '105', dailyValue: '105', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 2.222921, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 348.1398, unit: 'IU', displayValue: '348', dailyValue: '348', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.6763338, unit: 'g', displayValue: '0.7', dailyValue: '0.7', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 42.19235, unit: 'mg', displayValue: '42', dailyValue: '42', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 5.397878, unit: 'g', displayValue: '5.4', dailyValue: '5.4', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 85.82874, unit: 'kcal', displayValue: '86', dailyValue: '86', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.3366439, unit: 'g', displayValue: '0.3', dailyValue: '0.3', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 16223, displayValue: '1 (8 ounce) package cream cheese, softened', grams: 224.0, displayType: 'Normal',
        },
        {
          ingredientID: 16403, displayValue: '1/2 teaspoon dried oregano', grams: 0.75, displayType: 'Normal',
        },
        {
          ingredientID: 16405, displayValue: '1/2 teaspoon dried parsley', grams: 0.229449, displayType: 'Normal',
        },
        {
          ingredientID: 16379, displayValue: '1/4 teaspoon dried basil', grams: 0.35, displayType: 'Normal',
        },
        {
          ingredientID: 16232, displayValue: '1 cup shredded mozzarella cheese', grams: 112.0, displayType: 'Normal',
        },
        {
          ingredientID: 16238, displayValue: '1 cup grated Parmesan cheese', grams: 80.0, displayType: 'Normal',
        },
        {
          ingredientID: 13638, displayValue: '1 cup pizza sauce', grams: 244.0, displayType: 'Normal',
        },
        {
          ingredientID: 4432, displayValue: '2 tablespoons chopped green bell pepper', grams: 18.6, displayType: 'Normal',
        },
        {
          ingredientID: 5855, displayValue: '2 ounces pepperoni sausage, chopped', grams: 56.0, displayType: 'Normal',
        },
        {
          ingredientID: 5133, displayValue: '2 tablespoons sliced black olives', grams: 16.8, displayType: 'Normal',
        }],
        servings: 16,
        prepMinutes: 10,
        cookMinutes: 5,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/2640972.jpg',
        id: 14803,
      },
      {
        title: 'Avocado Feta Salsa',
        nutrition: {
          calories: {
            name: 'Calories', amount: 66.11848, unit: 'kcal', displayValue: '66', dailyValue: '66', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 5.629379, unit: 'g', displayValue: '5.6', dailyValue: '5.6', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 8.410501, unit: 'mg', displayValue: '8', dailyValue: '8', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 107.5455, unit: 'mg', displayValue: '108', dailyValue: '108', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 2.785907, unit: 'g', displayValue: '2.8', dailyValue: '2.8', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 1.843277, unit: 'g', displayValue: '1.8', dailyValue: '1.8', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 19.28583, unit: 'mcg', displayValue: '19', dailyValue: '19', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 8.62175, unit: 'mg', displayValue: '9', dailyValue: '9', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.09893093, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 0.8585891, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.03950842, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.21869, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 52.878, unit: 'mg', displayValue: '53', dailyValue: '53', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 3.963725, unit: 'mg', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 183.5778, unit: 'IU', displayValue: '184', dailyValue: '184', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.9216713, unit: 'g', displayValue: '0.9', dailyValue: '0.9', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 122.4065, unit: 'mg', displayValue: '122', dailyValue: '122', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 1.928833, unit: 'g', displayValue: '1.9', dailyValue: '1.9', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 50.66441, unit: 'kcal', displayValue: '51', dailyValue: '51', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 1.321029, unit: 'g', displayValue: '1.3', dailyValue: '1.3', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 20453, displayValue: '2 plum tomatoes, chopped', grams: 124.0, displayType: 'Normal',
        },
        {
          ingredientID: 5012, displayValue: '1 ripe avocado - peeled, pitted and chopped', grams: 201.0, displayType: 'Normal',
        },
        {
          ingredientID: 20269, displayValue: '1/4 cup finely chopped red onion', grams: 41.8, displayType: 'Normal',
        },
        {
          ingredientID: 4342, displayValue: '1 clove garlic, minced', grams: 3.0, displayType: 'Normal',
        },
        {
          ingredientID: 4409, displayValue: '1 tablespoon snipped fresh parsley', grams: 3.75, displayType: 'Normal',
        },
        {
          ingredientID: 18766, displayValue: '1 tablespoon chopped fresh oregano', grams: 6.0, displayType: 'Normal',
        },
        {
          ingredientID: 6307, displayValue: '1 tablespoon olive oil', grams: 13.5, displayType: 'Normal',
        },
        {
          ingredientID: 18888, displayValue: '1 tablespoon red or white wine vinegar', grams: 16.071428, displayType: 'Normal',
        },
        {
          ingredientID: 16225, displayValue: '4 ounces crumbled feta cheese', grams: 113.4, displayType: 'Normal',
        }],
        servings: 12,
        prepMinutes: 20,
        cookMinutes: 0,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/1073749.jpg',
        id: 87678,
      },
      {
        title: 'Luscious Spinach Artichoke Dip',
        nutrition: {
          calories: {
            name: 'Calories', amount: 50.44898, unit: 'kcal', displayValue: '50', dailyValue: '50', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 4.034194, unit: 'g', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 6.926667, unit: 'mg', displayValue: '7', dailyValue: '7', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 141.1346, unit: 'mg', displayValue: '141', dailyValue: '141', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 2.395035, unit: 'g', displayValue: '2.4', dailyValue: '2.4', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 1.548651, unit: 'g', displayValue: '1.5', dailyValue: '1.5', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 9.622645, unit: 'mcg', displayValue: '10', dailyValue: '10', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 5.648021, unit: 'mg', displayValue: '6', dailyValue: '6', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.02671594, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 0.2755905, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.007574895, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.1587823, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 28.52654, unit: 'mg', displayValue: '29', dailyValue: '29', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 2.477642, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 827.2635, unit: 'IU', displayValue: '827', dailyValue: '827', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.08504896, unit: 'g', displayValue: '0.1', dailyValue: '0.1', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 31.7055, unit: 'mg', displayValue: '32', dailyValue: '32', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 1.642985, unit: 'g', displayValue: '1.6', dailyValue: '1.6', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 36.30774, unit: 'kcal', displayValue: '36', dailyValue: '36', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.7555292, unit: 'g', displayValue: '0.8', dailyValue: '0.8', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 126, displayValue: '1 (14 ounce) can artichoke hearts, drained and chopped', grams: 240.0, displayType: 'Normal',
        },
        {
          ingredientID: 4520, displayValue: '1/2 (10 ounce) package frozen chopped spinach, thawed', grams: 142.0, displayType: 'Normal',
        },
        {
          ingredientID: 16261, displayValue: '1/2 cup sour cream', grams: 115.0, displayType: 'Normal',
        },
        {
          ingredientID: 6294, displayValue: '1/4 cup mayonnaise', grams: 55.0, displayType: 'Normal',
        },
        {
          ingredientID: 16223, displayValue: '1/4 cup cream cheese', grams: 58.0, displayType: 'Normal',
        },
        {
          ingredientID: 16244, displayValue: '1/4 cup grated Romano cheese', grams: 29.75, displayType: 'Normal',
        },
        {
          ingredientID: 4342, displayValue: '1/4 teaspoon minced garlic', grams: 0.7, displayType: 'Normal',
        }],
        servings: 24,
        prepMinutes: 10,
        cookMinutes: 25,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/1116968.jpg',
        id: 15141,
      },
      {
        title: 'Quick Baked Zucchini Chips',
        nutrition: {
          calories: {
            name: 'Calories', amount: 92.08835, unit: 'kcal', displayValue: '92', dailyValue: '92', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 1.715789, unit: 'g', displayValue: '1.7', dailyValue: '1.7', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 2.35, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 339.6259, unit: 'mg', displayValue: '340', dailyValue: '340', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 13.82244, unit: 'g', displayValue: '13.8', dailyValue: '13.8', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 6.094286, unit: 'g', displayValue: '6.1', dailyValue: '6.1', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 47.19456, unit: 'mcg', displayValue: '47', dailyValue: '47', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 26.47431, unit: 'mg', displayValue: '26', dailyValue: '26', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.2415731, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 2.535706, unit: 'mg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.09479853, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 1.135799, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 71.18079, unit: 'mg', displayValue: '71', dailyValue: '71', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 17.07878, unit: 'mg', displayValue: '17', dailyValue: '17', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 236.1962, unit: 'IU', displayValue: '236', dailyValue: '236', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 2.69789, unit: 'g', displayValue: '2.7', dailyValue: '2.7', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 322.5822, unit: 'mg', displayValue: '323', dailyValue: '323', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 0.6780781, unit: 'g', displayValue: '0.7', dailyValue: '0.7', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 15.44211, unit: 'kcal', displayValue: '15', dailyValue: '15', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 1.830391, unit: 'g', displayValue: '1.8', dailyValue: '1.8', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 4529, displayValue: '2 medium zucchini, cut into 1/4-inch slices', grams: 392.0, displayType: 'Normal',
        },
        {
          ingredientID: 2363, displayValue: '1/2 cup seasoned dry bread crumbs', grams: 60.0, displayType: 'Normal',
        },
        {
          ingredientID: 16406, displayValue: '1/8 teaspoon ground black pepper', grams: 0.2625, displayType: 'Normal',
        },
        {
          ingredientID: 16238, displayValue: '2 tablespoons grated Parmesan cheese', grams: 10.0, displayType: 'Normal',
        },
        {
          ingredientID: 16318, displayValue: '2 egg whites', grams: 66.8, displayType: 'Normal',
        }],
        servings: 4,
        prepMinutes: 5,
        cookMinutes: 10,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/679473.jpg',
        id: 89452,
      },
      {
        title: 'Antipasto Squares',
        nutrition: {
          calories: {
            name: 'Calories', amount: 452.0132, unit: 'kcal', displayValue: '452', dailyValue: '452', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 29.09233, unit: 'g', displayValue: '29.1', dailyValue: '29.1', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 103.9797, unit: 'mg', displayValue: '104', dailyValue: '104', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 1291.389, unit: 'mg', displayValue: '1291', dailyValue: '1291', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 25.30166, unit: 'g', displayValue: '25.3', dailyValue: '25.3', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 20.01021, unit: 'g', displayValue: '20', dailyValue: '20', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 9.812, unit: 'mcg', displayValue: '10', dailyValue: '10', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 14.3207, unit: 'mg', displayValue: '14', dailyValue: '14', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.136939, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 3.72252, unit: 'mg', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.11913, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 2.543652, unit: 'mg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 206.4084, unit: 'mg', displayValue: '206', dailyValue: '206', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 18.8167, unit: 'mg', displayValue: '19', dailyValue: '19', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 1670.594, unit: 'IU', displayValue: '1671', dailyValue: '1671', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 5.283216, unit: 'g', displayValue: '5.3', dailyValue: '5.3', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 122.1535, unit: 'mg', displayValue: '122', dailyValue: '122', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 10.70624, unit: 'g', displayValue: '10.7', dailyValue: '10.7', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 261.831, unit: 'kcal', displayValue: '262', dailyValue: '262', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.2495514, unit: 'g', displayValue: '0.2', dailyValue: '0.2', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 17977, displayValue: '2 (10 ounce) cans refrigerated crescent dinner rolls', grams: 560.0, displayType: 'Normal',
        },
        {
          ingredientID: 9356, displayValue: '1/4 pound thinly sliced boiled ham', grams: 113.5, displayType: 'Normal',
        },
        {
          ingredientID: 16241, displayValue: '1/4 pound thinly sliced provolone cheese', grams: 113.5, displayType: 'Normal',
        },
        {
          ingredientID: 16246, displayValue: '1/4 pound thinly sliced Swiss cheese', grams: 112.0, displayType: 'Normal',
        },
        {
          ingredientID: 5869, displayValue: '1/4 pound thinly sliced Genoa salami', grams: 113.5, displayType: 'Normal',
        },
        {
          ingredientID: 5855, displayValue: '1/4 pound thinly sliced pepperoni sausage', grams: 113.5, displayType: 'Normal',
        },
        {
          ingredientID: 12338, displayValue: '1 (12 ounce) jar roasted red peppers, drained, cut into thin strips', grams: 336.0, displayType: 'Normal',
        },
        {
          ingredientID: 16317, displayValue: '3 eggs', grams: 150.0, displayType: 'Normal',
        },
        {
          ingredientID: 16238, displayValue: '3 tablespoons grated Parmesan cheese', grams: 15.0, displayType: 'Normal',
        },
        {
          ingredientID: 16406, displayValue: '1/2 teaspoon ground black pepper', grams: 1.05, displayType: 'Normal',
        }],
        servings: 10,
        prepMinutes: 15,
        cookMinutes: 45,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/40199.jpg',
        id: 57808,
      },
      {
        title: 'Fried Mozzarella Cheese Sticks',
        nutrition: {
          calories: {
            name: 'Calories', amount: 400.1678, unit: 'kcal', displayValue: '400', dailyValue: '400', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 22.50724, unit: 'g', displayValue: '22.5', dailyValue: '22.5', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 82.82, unit: 'mg', displayValue: '83', dailyValue: '83', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 805.4517, unit: 'mg', displayValue: '805', dailyValue: '805', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 29.52239, unit: 'g', displayValue: '29.5', dailyValue: '29.5', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 19.43862, unit: 'g', displayValue: '19.4', dailyValue: '19.4', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 30.0757, unit: 'mcg', displayValue: '30', dailyValue: '30', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 17.20404, unit: 'mg', displayValue: '17', dailyValue: '17', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.07263333, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 4.150623, unit: 'mg', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.09973583, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 1.943719, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 482.4739, unit: 'mg', displayValue: '482', dailyValue: '482', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 6.1875E-5, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 333.8425, unit: 'IU', displayValue: '334', dailyValue: '334', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 1.51565, unit: 'g', displayValue: '1.5', dailyValue: '1.5', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 76.39114, unit: 'mg', displayValue: '76', dailyValue: '76', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 7.54083, unit: 'g', displayValue: '7.5', dailyValue: '7.5', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 202.5652, unit: 'kcal', displayValue: '203', dailyValue: '203', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 1.080233, unit: 'g', displayValue: '1.1', dailyValue: '1.1', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 16317, displayValue: '2 eggs, beaten', grams: 100.0, displayType: 'Normal',
        },
        {
          ingredientID: 2496, displayValue: '1/4 cup water', grams: 59.25, displayType: 'Normal',
        },
        {
          ingredientID: 18111, displayValue: '1 1/2 cups Italian seasoned bread crumbs', grams: 168.0, displayType: 'Normal',
        },
        {
          ingredientID: 18740, displayValue: '1/2 teaspoon garlic salt', grams: 2.75, displayType: 'Normal',
        },
        {
          ingredientID: 1684, displayValue: '2/3 cup all-purpose flour', grams: 83.333336, displayType: 'Normal',
        },
        {
          ingredientID: 1636, displayValue: '1/3 cup cornstarch', grams: 42.666664, displayType: 'Normal',
        },
        {
          ingredientID: 20482, displayValue: '1 quart oil for deep frying', grams: 880.0, displayType: 'Normal',
        },
        {
          ingredientID: 16234, displayValue: '1 (16 ounce) package mozzarella cheese sticks', grams: 454.0, displayType: 'Normal',
        }],
        servings: 8,
        prepMinutes: 15,
        cookMinutes: 15,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/462522.jpg',
        id: 23596,
      },
      {
        title: 'Mahogany Chicken Wings',
        nutrition: {
          calories: {
            name: 'Calories', amount: 773.4618, unit: 'kcal', displayValue: '773', dailyValue: '773', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 43.55634, unit: 'g', displayValue: '43.6', dailyValue: '43.6', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 209.748, unit: 'mg', displayValue: '210', dailyValue: '210', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 1649.667, unit: 'mg', displayValue: '1650', dailyValue: '1650', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 43.09157, unit: 'g', displayValue: '43.1', dailyValue: '43.1', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 51.85029, unit: 'g', displayValue: '51.9', dailyValue: '51.9', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 15.3344, unit: 'mcg', displayValue: '15', dailyValue: '15', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 101.3684, unit: 'mg', displayValue: '101', dailyValue: '101', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 1.127148, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 26.17771, unit: 'mg', displayValue: '26', dailyValue: '26', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.1490016, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 4.132817, unit: 'mg', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 75.7956, unit: 'mg', displayValue: '76', dailyValue: '76', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 5.19859, unit: 'mg', displayValue: '5', dailyValue: '5', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 401.0652, unit: 'IU', displayValue: '401', dailyValue: '401', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 37.39845, unit: 'g', displayValue: '37.4', dailyValue: '37.4', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 759.4634, unit: 'mg', displayValue: '759', dailyValue: '759', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 12.2158, unit: 'g', displayValue: '12.2', dailyValue: '12.2', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 392.0071, unit: 'kcal', displayValue: '392', dailyValue: '392', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.3428, unit: 'g', displayValue: '0.3', dailyValue: '0.3', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 6531, displayValue: '3 pounds chicken wings, split and tips discarded', grams: 1362.0, displayType: 'Normal',
        },
        {
          ingredientID: 2882, displayValue: '1/2 cup soy sauce', grams: 128.0, displayType: 'Normal',
        },
        {
          ingredientID: 1502, displayValue: '1/2 cup honey', grams: 169.5, displayType: 'Normal',
        },
        {
          ingredientID: 1507, displayValue: '1/4 cup molasses', grams: 82.0, displayType: 'Normal',
        },
        {
          ingredientID: 18901, displayValue: '2 tablespoons chile sauce', grams: 17.142857, displayType: 'Normal',
        },
        {
          ingredientID: 16397, displayValue: '1 teaspoon ground ginger', grams: 1.8, displayType: 'Normal',
        },
        {
          ingredientID: 4342, displayValue: '2 cloves garlic, finely chopped', grams: 6.0, displayType: 'Normal',
        }],
        servings: 5,
        prepMinutes: 15,
        cookMinutes: 50,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/501441.jpg',
        id: 25505,
      },
      {
        title: 'Fresh Tomato Salsa',
        nutrition: {
          calories: {
            name: 'Calories', amount: 51.45875, unit: 'kcal', displayValue: '51', dailyValue: '51', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 0.2361938, unit: 'g', displayValue: '0.2', dailyValue: '0.2', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 0.0, unit: 'mg', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 592.1197, unit: 'mg', displayValue: '592', dailyValue: '592', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 9.679738, unit: 'g', displayValue: '9.7', dailyValue: '9.7', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 2.143788, unit: 'g', displayValue: '2.1', dailyValue: '2.1', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 21.45875, unit: 'mcg', displayValue: '21', dailyValue: '21', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 13.8625, unit: 'mg', displayValue: '14', dailyValue: '14', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.1073412, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 0.7760812, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.0669625, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.4001063, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 18.39625, unit: 'mg', displayValue: '18', dailyValue: '18', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 61.5295, unit: 'mg', displayValue: '62', dailyValue: '62', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 1158.134, unit: 'IU', displayValue: '1158', dailyValue: '1158', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 3.367506, unit: 'g', displayValue: '3.4', dailyValue: '3.4', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 283.3859, unit: 'mg', displayValue: '283', dailyValue: '283', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 0.03524, unit: 'g', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 2.125744, unit: 'kcal', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 3.6995, unit: 'g', displayValue: '3.7', dailyValue: '3.7', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 4572, displayValue: '3 tomatoes, chopped', grams: 369.0, displayType: 'Normal',
        },
        {
          ingredientID: 4397, displayValue: '1/2 cup finely diced onion', grams: 80.0, displayType: 'Normal',
        },
        {
          ingredientID: 10568, displayValue: '5 serrano chiles, finely chopped', grams: 225.0, displayType: 'Normal',
        },
        {
          ingredientID: 3717, displayValue: '1/2 cup chopped fresh cilantro', grams: 23.0, displayType: 'Normal',
        },
        {
          ingredientID: 16421, displayValue: '1 teaspoon salt', grams: 6.0, displayType: 'Normal',
        },
        {
          ingredientID: 5112, displayValue: '2 teaspoons lime juice', grams: 10.25, displayType: 'Normal',
        }],
        servings: 4,
        prepMinutes: 10,
        cookMinutes: 0,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/1043867.jpg',
        id: 14088,
      },
      {
        title: 'Corn Fritters',
        nutrition: {
          calories: {
            name: 'Calories', amount: 132.7058, unit: 'kcal', displayValue: '133', dailyValue: '133', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 7.77107, unit: 'g', displayValue: '7.8', dailyValue: '7.8', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 17.52167, unit: 'mg', displayValue: '18', dailyValue: '18', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 224.4989, unit: 'mg', displayValue: '224', dailyValue: '224', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 13.96573, unit: 'g', displayValue: '14', dailyValue: '14', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 2.729218, unit: 'g', displayValue: '2.7', dailyValue: '2.7', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 33.90783, unit: 'mcg', displayValue: '34', dailyValue: '34', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 8.290506, unit: 'mg', displayValue: '8', dailyValue: '8', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.033365, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 1.246388, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.09748284, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.8053548, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 34.01039, unit: 'mg', displayValue: '34', dailyValue: '34', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 0.2191333, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 62.37, unit: 'IU', displayValue: '62', dailyValue: '62', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 1.488596, unit: 'g', displayValue: '1.5', dailyValue: '1.5', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 70.93912, unit: 'mg', displayValue: '71', dailyValue: '71', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 1.337156, unit: 'g', displayValue: '1.3', dailyValue: '1.3', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 69.93964, unit: 'kcal', displayValue: '70', dailyValue: '70', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.8214155, unit: 'g', displayValue: '0.8', dailyValue: '0.8', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 20482, displayValue: '3 cups oil for frying', grams: 660.0, displayType: 'Normal',
        },
        {
          ingredientID: 1684, displayValue: '1 cup sifted all-purpose flour', grams: 125.0, displayType: 'Normal',
        },
        {
          ingredientID: 7785, displayValue: '1 teaspoon baking powder', grams: 3.392857, displayType: 'Normal',
        },
        {
          ingredientID: 16421, displayValue: '1/2 teaspoon salt', grams: 3.0, displayType: 'Normal',
        },
        {
          ingredientID: 1526, displayValue: '1/4 teaspoon white sugar', grams: 1.0416666, displayType: 'Normal',
        },
        {
          ingredientID: 16317, displayValue: '1 egg, lightly beaten', grams: 50.0, displayType: 'Normal',
        },
        {
          ingredientID: 16278, displayValue: '1/2 cup milk', grams: 122.0, displayType: 'Normal',
        },
        {
          ingredientID: 6300, displayValue: '1 tablespoon shortening, melted', grams: 12.8, displayType: 'Normal',
        },
        {
          ingredientID: 4314, displayValue: '1 (12 ounce) can whole kernel corn, drained', grams: 340.8, displayType: 'Normal',
        }],
        servings: 12,
        prepMinutes: 10,
        cookMinutes: 20,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/4538052.jpg',
        id: 18040,
      },
      {
        title: 'Roasted Pumpkin Seeds',
        nutrition: {
          calories: {
            name: 'Calories', amount: 83.31, unit: 'kcal', displayValue: '83', dailyValue: '83', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 4.455833, unit: 'g', displayValue: '4.5', dailyValue: '4.5', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 3.583334, unit: 'mg', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 12.48, unit: 'mg', displayValue: '12', dailyValue: '12', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 8.601001, unit: 'g', displayValue: '8.6', dailyValue: '8.6', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 2.982166, unit: 'g', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 1.49, unit: 'mcg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 41.95333, unit: 'mg', displayValue: '42', dailyValue: '42', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.00597, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 0.8064193, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.005523333, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.5299333, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 9.2, unit: 'mg', displayValue: '9', dailyValue: '9', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 0.048, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 51.57, unit: 'IU', displayValue: '52', dailyValue: '52', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.001, unit: 'g', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 147.44, unit: 'mg', displayValue: '147', dailyValue: '147', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 1.443333, unit: 'g', displayValue: '1.4', dailyValue: '1.4', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 40.1025, unit: 'kcal', displayValue: '40', dailyValue: '40', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.624, unit: 'g', displayValue: '0.6', dailyValue: '0.6', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 20916, displayValue: '1 1/2 cups raw whole pumpkin seeds', grams: 96.0, displayType: 'Normal',
        },
        {
          ingredientID: 16157, displayValue: '2 teaspoons butter, melted', grams: 10.0, displayType: 'Normal',
        },
        {
          ingredientID: 16421, displayValue: '1 pinch salt', grams: 0.4, displayType: 'Normal',
        }],
        servings: 6,
        prepMinutes: 0,
        cookMinutes: 0,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/729337.jpg',
        id: 13768,
      },
      {
        title: 'Spiced Sweet Roasted Red Pepper Hummus',
        nutrition: {
          calories: {
            name: 'Calories', amount: 64.20198, unit: 'kcal', displayValue: '64', dailyValue: '64', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 2.160236, unit: 'g', displayValue: '2.2', dailyValue: '2.2', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 0.0, unit: 'mg', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 370.2651, unit: 'mg', displayValue: '370', dailyValue: '370', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 9.649426, unit: 'g', displayValue: '9.6', dailyValue: '9.6', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 2.48904, unit: 'g', displayValue: '2.5', dailyValue: '2.5', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 27.27974, unit: 'mcg', displayValue: '27', dailyValue: '27', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 13.00996, unit: 'mg', displayValue: '13', dailyValue: '13', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.2017283, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 0.6020579, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.01768933, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.7940592, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 23.24409, unit: 'mg', displayValue: '23', dailyValue: '23', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 11.27235, unit: 'mg', displayValue: '11', dailyValue: '11', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 170.328, unit: 'IU', displayValue: '170', dailyValue: '170', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.1577561, unit: 'g', displayValue: '0.2', dailyValue: '0.2', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 106.6032, unit: 'mg', displayValue: '107', dailyValue: '107', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 0.2876722, unit: 'g', displayValue: '0.3', dailyValue: '0.3', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 19.44213, unit: 'kcal', displayValue: '19', dailyValue: '19', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 2.05986, unit: 'g', displayValue: '2.1', dailyValue: '2.1', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 2819, displayValue: '1 (15 ounce) can garbanzo beans, drained', grams: 280.0, displayType: 'Normal',
        },
        {
          ingredientID: 3669, displayValue: '1 (4 ounce) jar roasted red peppers', grams: 112.0, displayType: 'Normal',
        },
        {
          ingredientID: 5107, displayValue: '3 tablespoons lemon juice', grams: 45.145374, displayType: 'Normal',
        },
        {
          ingredientID: 10841, displayValue: '1 1/2 tablespoons tahini', grams: 22.5, displayType: 'Normal',
        },
        {
          ingredientID: 4342, displayValue: '1 clove garlic, minced', grams: 3.0, displayType: 'Normal',
        },
        {
          ingredientID: 20551, displayValue: '1/2 teaspoon ground cumin', grams: 1.05, displayType: 'Normal',
        },
        {
          ingredientID: 16407, displayValue: '1/2 teaspoon cayenne pepper', grams: 0.9, displayType: 'Normal',
        },
        {
          ingredientID: 16421, displayValue: '1/4 teaspoon salt', grams: 1.5, displayType: 'Normal',
        },
        {
          ingredientID: 4409, displayValue: '1 tablespoon chopped fresh parsley', grams: 3.75, displayType: 'Normal',
        }],
        servings: 8,
        prepMinutes: 15,
        cookMinutes: 0,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/782898.jpg',
        id: 15006,
      },
      {
        title: 'The Best Sweet and Sour Meatballs',
        nutrition: {
          calories: {
            name: 'Calories', amount: 516.3181, unit: 'kcal', displayValue: '516', dailyValue: '516', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 16.7974, unit: 'g', displayValue: '16.8', dailyValue: '16.8', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 122.37, unit: 'mg', displayValue: '122', dailyValue: '122', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 815.046, unit: 'mg', displayValue: '815', dailyValue: '815', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 67.08014, unit: 'g', displayValue: '67.1', dailyValue: '67.1', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 24.5045, unit: 'g', displayValue: '24.5', dailyValue: '24.5', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 37.90266, unit: 'mcg', displayValue: '38', dailyValue: '38', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 33.06281, unit: 'mg', displayValue: '33', dailyValue: '33', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.3081306, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 9.996922, unit: 'mg', displayValue: '10', dailyValue: '10', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.1420836, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 3.615225, unit: 'mg', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 84.93266, unit: 'mg', displayValue: '85', dailyValue: '85', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 1.43, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 61.425, unit: 'IU', displayValue: '61', dailyValue: '61', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 55.39632, unit: 'g', displayValue: '55.4', dailyValue: '55.4', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 374.4633, unit: 'mg', displayValue: '374', dailyValue: '374', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 6.40886, unit: 'g', displayValue: '6.4', dailyValue: '6.4', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 151.1766, unit: 'kcal', displayValue: '151', dailyValue: '151', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.9429531, unit: 'g', displayValue: '0.9', dailyValue: '0.9', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 3103, displayValue: '1 pound ground beef', grams: 454.0, displayType: 'Normal',
        },
        {
          ingredientID: 16317, displayValue: '1 egg', grams: 50.0, displayType: 'Normal',
        },
        {
          ingredientID: 2112, displayValue: '1/4 cup dry bread crumbs', grams: 27.0, displayType: 'Normal',
        },
        {
          ingredientID: 4397, displayValue: '1 onion, diced', grams: 110.0, displayType: 'Normal',
        },
        {
          ingredientID: 0, displayValue: '', grams: 0.0, displayType: 'BlankLine',
        },
        {
          ingredientID: 1525, displayValue: '1 cup packed brown sugar', grams: 220.0, displayType: 'Normal',
        },
        {
          ingredientID: 1684, displayValue: '3 tablespoons all-purpose flour', grams: 23.4375, displayType: 'Normal',
        },
        {
          ingredientID: 2496, displayValue: '1 1/2 cups water', grams: 355.5, displayType: 'Normal',
        },
        {
          ingredientID: 7842, displayValue: '1/4 cup distilled white vinegar', grams: 60.0, displayType: 'Normal',
        },
        {
          ingredientID: 2882, displayValue: '3 tablespoons soy sauce', grams: 48.0, displayType: 'Normal',
        }],
        servings: 4,
        prepMinutes: 20,
        cookMinutes: 30,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/550246.jpg',
        id: 26673,
      },
      {
        title: 'Black Bean Hummus',
        nutrition: {
          calories: {
            name: 'Calories', amount: 81.18179, unit: 'kcal', displayValue: '81', dailyValue: '81', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 3.118414, unit: 'g', displayValue: '3.1', dailyValue: '3.1', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 0.0, unit: 'mg', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 426.8688, unit: 'mg', displayValue: '427', dailyValue: '427', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 10.27108, unit: 'g', displayValue: '10.3', dailyValue: '10.3', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 3.918767, unit: 'g', displayValue: '3.9', dailyValue: '3.9', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 33.06144, unit: 'mcg', displayValue: '33', dailyValue: '33', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 19.8549, unit: 'mg', displayValue: '20', dailyValue: '20', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.04086851, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 1.128924, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.07813425, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 1.275433, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 26.46816, unit: 'mg', displayValue: '26', dailyValue: '26', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 3.390759, unit: 'mg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 69.21703, unit: 'IU', displayValue: '69', dailyValue: '69', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.1116566, unit: 'g', displayValue: '0.1', dailyValue: '0.1', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 186.385, unit: 'mg', displayValue: '186', dailyValue: '186', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 0.4281169, unit: 'g', displayValue: '0.4', dailyValue: '0.4', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 28.06572, unit: 'kcal', displayValue: '28', dailyValue: '28', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 4.050709, unit: 'g', displayValue: '4.1', dailyValue: '4.1', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 4342, displayValue: '1 clove garlic', grams: 3.0, displayType: 'Normal',
        },
        {
          ingredientID: 2779, displayValue: '1 (15 ounce) can black beans; drain and reserve liquid', grams: 425.0, displayType: 'Normal',
        },
        {
          ingredientID: 5107, displayValue: '2 tablespoons lemon juice', grams: 30.096916, displayType: 'Normal',
        },
        {
          ingredientID: 10841, displayValue: '1 1/2 tablespoons tahini', grams: 22.5, displayType: 'Normal',
        },
        {
          ingredientID: 20551, displayValue: '3/4 teaspoon ground cumin', grams: 1.5749999, displayType: 'Normal',
        },
        {
          ingredientID: 16421, displayValue: '1/2 teaspoon salt', grams: 3.0, displayType: 'Normal',
        },
        {
          ingredientID: 16407, displayValue: '1/4 teaspoon cayenne pepper', grams: 0.45, displayType: 'Normal',
        },
        {
          ingredientID: 16404, displayValue: '1/4 teaspoon paprika', grams: 0.5702083, displayType: 'Normal',
        },
        {
          ingredientID: 12341, displayValue: '10 Greek olives', grams: 37.5, displayType: 'Normal',
        }],
        servings: 8,
        prepMinutes: 5,
        cookMinutes: 0,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/342529.jpg',
        id: 13930,
      },
      {
        title: 'Outrageous Warm Chicken Nacho Dip',
        nutrition: {
          calories: {
            name: 'Calories', amount: 232.2727, unit: 'kcal', displayValue: '232', dailyValue: '232', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 13.55464, unit: 'g', displayValue: '13.6', dailyValue: '13.6', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 60.17778, unit: 'mg', displayValue: '60', dailyValue: '60', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 790.3851, unit: 'mg', displayValue: '790', dailyValue: '790', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 8.678838, unit: 'g', displayValue: '8.7', dailyValue: '8.7', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 18.59973, unit: 'g', displayValue: '18.6', dailyValue: '18.6', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 21.37577, unit: 'mcg', displayValue: '21', dailyValue: '21', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 31.58373, unit: 'mg', displayValue: '32', dailyValue: '32', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.1858096, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 7.106782, unit: 'mg', displayValue: '7', dailyValue: '7', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.05904196, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 1.057564, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 240.199, unit: 'mg', displayValue: '240', dailyValue: '240', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 3.462236, unit: 'mg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 513.9177, unit: 'IU', displayValue: '514', dailyValue: '514', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 3.054137, unit: 'g', displayValue: '3.1', dailyValue: '3.1', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 287.9419, unit: 'mg', displayValue: '288', dailyValue: '288', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 7.176923, unit: 'g', displayValue: '7.2', dailyValue: '7.2', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 121.9917, unit: 'kcal', displayValue: '122', dailyValue: '122', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 1.790448, unit: 'g', displayValue: '1.8', dailyValue: '1.8', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 4577, displayValue: '1 (14 ounce) can diced tomatoes with green chile peppers (such as RO*TEL®), drained', grams: 397.6, displayType: 'Normal',
        },
        {
          ingredientID: 20324, displayValue: '1 (1 pound) loaf processed cheese food (such as Velveeta®), cubed', grams: 448.0, displayType: 'Normal',
        },
        {
          ingredientID: 6493, displayValue: '2 large cooked skinless, boneless chicken breast halves, shredded', grams: 440.0, displayType: 'Normal',
        },
        {
          ingredientID: 16261, displayValue: '1/3 cup sour cream', grams: 76.666664, displayType: 'Normal',
        },
        {
          ingredientID: 4405, displayValue: '1/4 cup diced green onion', grams: 25.0, displayType: 'Normal',
        },
        {
          ingredientID: 18765, displayValue: '1 1/2 tablespoons taco seasoning mix', grams: 13.5, displayType: 'Normal',
        },
        {
          ingredientID: 3725, displayValue: '2 tablespoons minced jalapeno pepper, or to taste (optional)', grams: 11.344538, displayType: 'OptionalIngredient',
        },
        {
          ingredientID: 2779, displayValue: '1 cup black beans, rinsed and drained', grams: 240.0, displayType: 'Normal',
        }],
        servings: 12,
        prepMinutes: 20,
        cookMinutes: 75,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/2333962.jpg',
        id: 157940,
      },
      {
        title: 'Hot Artichoke Spinach Dip',
        nutrition: {
          calories: {
            name: 'Calories', amount: 81.78297, unit: 'kcal', displayValue: '82', dailyValue: '82', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 6.032708, unit: 'g', displayValue: '6', dailyValue: '6', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 19.16375, unit: 'mg', displayValue: '19', dailyValue: '19', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 202.6673, unit: 'mg', displayValue: '203', dailyValue: '203', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 3.122633, unit: 'g', displayValue: '3.1', dailyValue: '3.1', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 4.3354, unit: 'g', displayValue: '4.3', dailyValue: '4.3', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 27.51762, unit: 'mcg', displayValue: '28', dailyValue: '28', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 17.36354, unit: 'mg', displayValue: '17', dailyValue: '17', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.03935958, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 1.323599, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.02122125, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.4039021, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 110.2071, unit: 'mg', displayValue: '110', dailyValue: '110', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 3.026559, unit: 'mg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 2317.54, unit: 'IU', displayValue: '2318', dailyValue: '2318', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.2346521, unit: 'g', displayValue: '0.2', dailyValue: '0.2', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 84.84921, unit: 'mg', displayValue: '85', dailyValue: '85', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 3.648324, unit: 'g', displayValue: '3.6', dailyValue: '3.6', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 54.29437, unit: 'kcal', displayValue: '54', dailyValue: '54', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 1.052302, unit: 'g', displayValue: '1.1', dailyValue: '1.1', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 126, displayValue: '1 (14 ounce) can artichoke hearts, drained', grams: 240.0, displayType: 'Normal',
        },
        {
          ingredientID: 16244, displayValue: '1/3 cup grated Romano cheese', grams: 39.666664, displayType: 'Normal',
        },
        {
          ingredientID: 16238, displayValue: '1/4 cup grated Parmesan cheese', grams: 20.0, displayType: 'Normal',
        },
        {
          ingredientID: 4342, displayValue: '1/2 teaspoon minced garlic', grams: 1.4, displayType: 'Normal',
        },
        {
          ingredientID: 4520, displayValue: '1 (10 ounce) package frozen chopped spinach, thawed and drained', grams: 284.0, displayType: 'Normal',
        },
        {
          ingredientID: 16258, displayValue: '1/3 cup heavy cream', grams: 79.33333, displayType: 'Normal',
        },
        {
          ingredientID: 16261, displayValue: '1/2 cup sour cream', grams: 115.0, displayType: 'Normal',
        },
        {
          ingredientID: 16232, displayValue: '1 cup shredded mozzarella cheese', grams: 112.0, displayType: 'Normal',
        }],
        servings: 16,
        prepMinutes: 20,
        cookMinutes: 25,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/515229.jpg',
        id: 14814,
      },
      {
        title: 'Crab Dip',
        nutrition: {
          calories: {
            name: 'Calories', amount: 198.4943, unit: 'kcal', displayValue: '198', dailyValue: '198', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 11.47604, unit: 'g', displayValue: '11.5', dailyValue: '11.5', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 41.76844, unit: 'mg', displayValue: '42', dailyValue: '42', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 318.0079, unit: 'mg', displayValue: '318', dailyValue: '318', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 15.26662, unit: 'g', displayValue: '15.3', dailyValue: '15.3', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 8.368324, unit: 'g', displayValue: '8.4', dailyValue: '8.4', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 66.80734, unit: 'mcg', displayValue: '67', dailyValue: '67', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 17.5139, unit: 'mg', displayValue: '18', dailyValue: '18', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.08505148, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 3.269766, unit: 'mg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.1562657, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 1.263784, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 60.26048, unit: 'mg', displayValue: '60', dailyValue: '60', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 0.8946546, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 275.5563, unit: 'IU', displayValue: '276', dailyValue: '276', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.51184, unit: 'g', displayValue: '0.5', dailyValue: '0.5', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 140.0902, unit: 'mg', displayValue: '140', dailyValue: '140', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 5.091244, unit: 'g', displayValue: '5.1', dailyValue: '5.1', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 103.2843, unit: 'kcal', displayValue: '103', dailyValue: '103', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.8426476, unit: 'g', displayValue: '0.8', dailyValue: '0.8', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 16223, displayValue: '11 ounces cream cheese, softened', grams: 311.85, displayType: 'Normal',
        },
        {
          ingredientID: 4397, displayValue: '1 small onion, finely chopped', grams: 70.0, displayType: 'Normal',
        },
        {
          ingredientID: 6294, displayValue: '5 tablespoons mayonnaise', grams: 69.0, displayType: 'Normal',
        },
        {
          ingredientID: 2656, displayValue: '2 (6 ounce) cans crabmeat, drained and flaked', grams: 336.0, displayType: 'Normal',
        },
        {
          ingredientID: 16396, displayValue: '1/8 teaspoon garlic powder', grams: 0.34708333, displayType: 'Normal',
        },
        {
          ingredientID: 16421, displayValue: 'salt and pepper to taste', grams: 0.0, displayType: 'HideAmounts',
        },
        {
          ingredientID: 2077, displayValue: '1 (1 pound) loaf round, crusty Italian bread', grams: 454.0, displayType: 'Normal',
        }],
        servings: 16,
        prepMinutes: 15,
        cookMinutes: 30,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/326528.jpg',
        id: 12799,
      },
      {
        title: 'Hot Bean Dip',
        nutrition: {
          calories: {
            name: 'Calories', amount: 195.955, unit: 'kcal', displayValue: '196', dailyValue: '196', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 13.99373, unit: 'g', displayValue: '14', dailyValue: '14', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 42.692, unit: 'mg', displayValue: '43', dailyValue: '43', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 356.8476, unit: 'mg', displayValue: '357', dailyValue: '357', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 8.616164, unit: 'g', displayValue: '8.6', dailyValue: '8.6', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 9.256881, unit: 'g', displayValue: '9.3', dailyValue: '9.3', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 12.76715, unit: 'mcg', displayValue: '13', dailyValue: '13', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 23.51325, unit: 'mg', displayValue: '24', dailyValue: '24', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.09084216, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 1.985742, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.02375943, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 1.198561, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 205.2737, unit: 'mg', displayValue: '205', dailyValue: '205', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 3.215606, unit: 'mg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 454.5215, unit: 'IU', displayValue: '455', dailyValue: '455', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.4146886, unit: 'g', displayValue: '0.4', dailyValue: '0.4', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 178.6964, unit: 'mg', displayValue: '179', dailyValue: '179', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 8.67147, unit: 'g', displayValue: '8.7', dailyValue: '8.7', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 125.9435, unit: 'kcal', displayValue: '126', dailyValue: '126', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 2.451624, unit: 'g', displayValue: '2.5', dailyValue: '2.5', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 16223, displayValue: '1 (8 ounce) package cream cheese, softened', grams: 224.0, displayType: 'Normal',
        },
        {
          ingredientID: 16261, displayValue: '1 cup sour cream', grams: 230.0, displayType: 'Normal',
        },
        {
          ingredientID: 2863, displayValue: '2 (16 ounce) cans refried beans', grams: 896.0, displayType: 'Normal',
        },
        {
          ingredientID: 18765, displayValue: '1/2 (1 ounce) package taco seasoning mix', grams: 14.2, displayType: 'Normal',
        },
        {
          ingredientID: 5593, displayValue: '5 drops hot pepper sauce', grams: 4.7, displayType: 'Normal',
        },
        {
          ingredientID: 16405, displayValue: '2 tablespoons dried parsley', grams: 2.7533882, displayType: 'Normal',
        },
        {
          ingredientID: 4405, displayValue: '1/4 cup chopped green onions', grams: 26.125, displayType: 'Normal',
        },
        {
          ingredientID: 16215, displayValue: '1 (8 ounce) package shredded Cheddar cheese', grams: 224.0, displayType: 'Normal',
        },
        {
          ingredientID: 16231, displayValue: '1 (8 ounce) package shredded Monterey Jack cheese', grams: 224.0, displayType: 'Normal',
        }],
        servings: 20,
        prepMinutes: 10,
        cookMinutes: 30,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/1393941.jpg',
        id: 22163,
      },
      {
        title: 'Extra Easy Hummus',
        nutrition: {
          calories: {
            name: 'Calories', amount: 118.19, unit: 'kcal', displayValue: '118', dailyValue: '118', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 4.410585, unit: 'g', displayValue: '4.4', dailyValue: '4.4', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 0.0, unit: 'mg', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 501.944, unit: 'mg', displayValue: '502', dailyValue: '502', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 16.53947, unit: 'g', displayValue: '16.5', dailyValue: '16.5', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 3.699705, unit: 'g', displayValue: '3.7', dailyValue: '3.7', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 47.0275, unit: 'mcg', displayValue: '47', dailyValue: '47', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 24.338, unit: 'mg', displayValue: '24', dailyValue: '24', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.34493, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 0.7181796, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.028394, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 1.675905, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 33.74675, unit: 'mg', displayValue: '34', dailyValue: '34', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 2.97485, unit: 'mg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 30.2025, unit: 'IU', displayValue: '30', dailyValue: '30', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.031125, unit: 'g', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 142.2753, unit: 'mg', displayValue: '142', dailyValue: '142', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 0.5654051, unit: 'g', displayValue: '0.6', dailyValue: '0.6', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 39.69527, unit: 'kcal', displayValue: '40', dailyValue: '40', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 3.206, unit: 'g', displayValue: '3.2', dailyValue: '3.2', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 2819, displayValue: '1 (15 ounce) can garbanzo beans, drained, liquid reserved', grams: 280.0, displayType: 'Normal',
        },
        {
          ingredientID: 4342, displayValue: '1 clove garlic, crushed', grams: 3.0, displayType: 'Normal',
        },
        {
          ingredientID: 20551, displayValue: '2 teaspoons ground cumin', grams: 4.2, displayType: 'Normal',
        },
        {
          ingredientID: 16421, displayValue: '1/2 teaspoon salt', grams: 3.0, displayType: 'Normal',
        },
        {
          ingredientID: 6307, displayValue: '1 tablespoon olive oil', grams: 13.5, displayType: 'Normal',
        }],
        servings: 4,
        prepMinutes: 5,
        cookMinutes: 0,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/521586.jpg',
        id: 20797,
      },
      {
        title: 'Vietnamese Fresh Spring Rolls',
        nutrition: {
          calories: {
            name: 'Calories', amount: 82.36115, unit: 'kcal', displayValue: '82', dailyValue: '82', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 0.680658, unit: 'g', displayValue: '0.7', dailyValue: '0.7', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 10.82, unit: 'mg', displayValue: '11', dailyValue: '11', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 305.428, unit: 'mg', displayValue: '305', dailyValue: '305', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 15.79878, unit: 'g', displayValue: '15.8', dailyValue: '15.8', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 3.295546, unit: 'g', displayValue: '3.3', dailyValue: '3.3', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 7.210573, unit: 'mcg', displayValue: '7', dailyValue: '7', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 13.72183, unit: 'mg', displayValue: '14', dailyValue: '14', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.0404917, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 1.069747, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.009551615, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.4336043, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 12.74959, unit: 'mg', displayValue: '13', dailyValue: '13', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 2.29671, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 139.8296, unit: 'IU', displayValue: '140', dailyValue: '140', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 5.203021, unit: 'g', displayValue: '5.2', dailyValue: '5.2', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 61.95722, unit: 'mg', displayValue: '62', dailyValue: '62', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 0.1208654, unit: 'g', displayValue: '0.1', dailyValue: '0.1', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 6.125922, unit: 'kcal', displayValue: '6', dailyValue: '6', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.5812733, unit: 'g', displayValue: '0.6', dailyValue: '0.6', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 21058, displayValue: '2 ounces rice vermicelli', grams: 56.0, displayType: 'Normal',
        },
        {
          ingredientID: 20975, displayValue: '8 rice wrappers (8.5 inch diameter)', grams: 44.0, displayType: 'Normal',
        },
        {
          ingredientID: 2664, displayValue: '8 large cooked shrimp - peeled, deveined and cut in half', grams: 56.0, displayType: 'Normal',
        },
        {
          ingredientID: 16159, displayValue: '1 1/3 tablespoons chopped fresh Thai basil', grams: 3.5333326, displayType: 'Normal',
        },
        {
          ingredientID: 18860, displayValue: '3 tablespoons chopped fresh mint leaves', grams: 4.8, displayType: 'Normal',
        },
        {
          ingredientID: 3717, displayValue: '3 tablespoons chopped fresh cilantro', grams: 8.625, displayType: 'Normal',
        },
        {
          ingredientID: 4372, displayValue: '2 leaves lettuce, chopped', grams: 16.0, displayType: 'Normal',
        },
        {
          ingredientID: 0, displayValue: '', grams: 0.0, displayType: 'BlankLine',
        },
        {
          ingredientID: 5597, displayValue: '4 teaspoons fish sauce', grams: 18.9, displayType: 'Normal',
        },
        {
          ingredientID: 2496, displayValue: '1/4 cup water', grams: 59.25, displayType: 'Normal',
        },
        {
          ingredientID: 5112, displayValue: '2 tablespoons fresh lime juice', grams: 30.75, displayType: 'Normal',
        },
        {
          ingredientID: 4342, displayValue: '1 clove garlic, minced', grams: 3.0, displayType: 'Normal',
        },
        {
          ingredientID: 1526, displayValue: '2 tablespoons white sugar', grams: 25.0, displayType: 'Normal',
        },
        {
          ingredientID: 12057, displayValue: '1/2 teaspoon garlic chili sauce', grams: 2.857143, displayType: 'Normal',
        },
        {
          ingredientID: 0, displayValue: '', grams: 0.0, displayType: 'BlankLine',
        },
        {
          ingredientID: 5595, displayValue: '3 tablespoons hoisin sauce', grams: 48.0, displayType: 'Normal',
        },
        {
          ingredientID: 2940, displayValue: '1 teaspoon finely chopped peanuts', grams: 3.0416665, displayType: 'Normal',
        }],
        servings: 8,
        prepMinutes: 45,
        cookMinutes: 5,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/3647841.jpg',
        id: 24239,
      },
      {
        title: 'Seven Layer Dip I',
        nutrition: {
          calories: {
            name: 'Calories', amount: 277.468, unit: 'kcal', displayValue: '277', dailyValue: '277', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 19.52824, unit: 'g', displayValue: '19.5', dailyValue: '19.5', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 63.2912, unit: 'mg', displayValue: '63', dailyValue: '63', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 447.2805, unit: 'mg', displayValue: '447', dailyValue: '447', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 9.257454, unit: 'g', displayValue: '9.3', dailyValue: '9.3', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 16.78094, unit: 'g', displayValue: '16.8', dailyValue: '16.8', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 18.77642, unit: 'mcg', displayValue: '19', dailyValue: '19', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 26.42584, unit: 'mg', displayValue: '26', dailyValue: '26', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.1920728, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 4.117107, unit: 'mg', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.03702467, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 1.678066, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 44.68005, unit: 'mg', displayValue: '45', dailyValue: '45', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 5.564095, unit: 'mg', displayValue: '6', dailyValue: '6', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 334.8811, unit: 'IU', displayValue: '335', dailyValue: '335', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.8537679, unit: 'g', displayValue: '0.9', dailyValue: '0.9', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 343.0538, unit: 'mg', displayValue: '343', dailyValue: '343', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 10.93359, unit: 'g', displayValue: '10.9', dailyValue: '10.9', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 175.7541, unit: 'kcal', displayValue: '176', dailyValue: '176', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 2.737252, unit: 'g', displayValue: '2.7', dailyValue: '2.7', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 3103, displayValue: '1 1/2 pounds ground beef', grams: 681.0, displayType: 'Normal',
        },
        {
          ingredientID: 2863, displayValue: '1 (16 ounce) can refried beans', grams: 448.0, displayType: 'Normal',
        },
        {
          ingredientID: 454, displayValue: '4 cups shredded Cheddar-Monterey Jack cheese blend', grams: 416.0, displayType: 'Normal',
        },
        {
          ingredientID: 16261, displayValue: '1 (8 ounce) container sour cream', grams: 227.2, displayType: 'Normal',
        },
        {
          ingredientID: 7441, displayValue: '1 cup guacamole', grams: 233.0, displayType: 'Normal',
        },
        {
          ingredientID: 5588, displayValue: '1 cup salsa', grams: 259.0, displayType: 'Normal',
        },
        {
          ingredientID: 5133, displayValue: '1 (2.25 ounce) can black olives, chopped', grams: 63.0, displayType: 'Normal',
        },
        {
          ingredientID: 4572, displayValue: '1/2 cup chopped tomatoes', grams: 90.0, displayType: 'Normal',
        },
        {
          ingredientID: 4405, displayValue: '1/2 cup chopped green onions', grams: 50.0, displayType: 'Normal',
        }],
        servings: 15,
        prepMinutes: 15,
        cookMinutes: 0,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/672622.jpg',
        id: 16845,
      },
      {
        title: 'Best Egg Rolls',
        nutrition: {
          calories: {
            name: 'Calories', amount: 333.5312, unit: 'kcal', displayValue: '334', dailyValue: '334', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 20.5433, unit: 'g', displayValue: '20.5', dailyValue: '20.5', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 39.6575, unit: 'mg', displayValue: '40', dailyValue: '40', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 220.1528, unit: 'mg', displayValue: '220', dailyValue: '220', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 22.6433, unit: 'g', displayValue: '22.6', dailyValue: '22.6', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 14.15583, unit: 'g', displayValue: '14.2', dailyValue: '14.2', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 44.57391, unit: 'mcg', displayValue: '45', dailyValue: '45', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 27.71376, unit: 'mg', displayValue: '28', dailyValue: '28', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.2246674, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 6.678267, unit: 'mg', displayValue: '7', dailyValue: '7', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.4926929, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 2.139852, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 55.8472, unit: 'mg', displayValue: '56', dailyValue: '56', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 7.1701, unit: 'mg', displayValue: '7', dailyValue: '7', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 1194.713, unit: 'IU', displayValue: '1195', dailyValue: '1195', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.9957922, unit: 'g', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 239.5235, unit: 'mg', displayValue: '240', dailyValue: '240', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 5.094293, unit: 'g', displayValue: '5.1', dailyValue: '5.1', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 184.8897, unit: 'kcal', displayValue: '185', dailyValue: '185', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 1.590221, unit: 'g', displayValue: '1.6', dailyValue: '1.6', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 4176, displayValue: '1 pound ground pork', grams: 454.0, displayType: 'Normal',
        },
        {
          ingredientID: 16397, displayValue: '1 teaspoon ground ginger', grams: 1.8, displayType: 'Normal',
        },
        {
          ingredientID: 16396, displayValue: '1 teaspoon garlic powder', grams: 2.7766666, displayType: 'Normal',
        },
        {
          ingredientID: 21126, displayValue: '1 quart peanut oil for frying', grams: 866.5042, displayType: 'Normal',
        },
        {
          ingredientID: 1684, displayValue: '2 tablespoons all-purpose flour', grams: 15.625, displayType: 'Normal',
        },
        {
          ingredientID: 2496, displayValue: '2 tablespoons water', grams: 29.57, displayType: 'Normal',
        },
        {
          ingredientID: 4267, displayValue: '2 cups shredded cabbage', grams: 140.0, displayType: 'Normal',
        },
        {
          ingredientID: 4279, displayValue: '2 ounces shredded carrots', grams: 56.0, displayType: 'Normal',
        },
        {
          ingredientID: 2355, displayValue: '8 (7 inch square) egg roll wrappers', grams: 256.0, displayType: 'Normal',
        },
        {
          ingredientID: 3752, displayValue: '2 tablespoons sesame seeds (optional)', grams: 18.0, displayType: 'OptionalIngredient',
        }],
        servings: 8,
        prepMinutes: 0,
        cookMinutes: 0,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/5174296.jpg',
        id: 14704,
      },
      {
        title: 'Nacho Cheese Sauce',
        nutrition: {
          calories: {
            name: 'Calories', amount: 281.6726, unit: 'kcal', displayValue: '282', dailyValue: '282', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 22.5027, unit: 'g', displayValue: '22.5', dailyValue: '22.5', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 66.78075, unit: 'mg', displayValue: '67', dailyValue: '67', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 1095.399, unit: 'mg', displayValue: '1095', dailyValue: '1095', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 6.633719, unit: 'g', displayValue: '6.6', dailyValue: '6.6', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 13.46603, unit: 'g', displayValue: '13.5', dailyValue: '13.5', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 14.38044, unit: 'mcg', displayValue: '14', dailyValue: '14', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 21.11425, unit: 'mg', displayValue: '21', dailyValue: '21', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.06033662, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 3.413714, unit: 'mg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.06820444, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.2977087, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 347.7009, unit: 'mg', displayValue: '348', dailyValue: '348', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 0.122, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 769.4951, unit: 'IU', displayValue: '769', dailyValue: '769', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 3.122631, unit: 'g', displayValue: '3.1', dailyValue: '3.1', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 181.2888, unit: 'mg', displayValue: '181', dailyValue: '181', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 14.19064, unit: 'g', displayValue: '14.2', dailyValue: '14.2', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 202.5243, unit: 'kcal', displayValue: '203', dailyValue: '203', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.1054688, unit: 'g', displayValue: '0.1', dailyValue: '0.1', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 16157, displayValue: '2 tablespoons butter', grams: 28.4, displayType: 'Normal',
        },
        {
          ingredientID: 1684, displayValue: '2 tablespoons all-purpose flour', grams: 15.625, displayType: 'Normal',
        },
        {
          ingredientID: 16278, displayValue: '1 cup milk', grams: 244.0, displayType: 'Normal',
        },
        {
          ingredientID: 16248, displayValue: '7 slices processed American cheese', grams: 198.45, displayType: 'Normal',
        },
        {
          ingredientID: 16421, displayValue: '1/2 teaspoon salt', grams: 3.0, displayType: 'Normal',
        }],
        servings: 4,
        prepMinutes: 10,
        cookMinutes: 15,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/587862.jpg',
        id: 24738,
      },
      {
        title: 'Southern Pimento Cheese',
        nutrition: {
          calories: {
            name: 'Calories', amount: 207.8121, unit: 'kcal', displayValue: '208', dailyValue: '208', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 19.88929, unit: 'g', displayValue: '19.9', dailyValue: '19.9', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 44.20279, unit: 'mg', displayValue: '44', dailyValue: '44', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 228.9556, unit: 'mg', displayValue: '229', dailyValue: '229', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 2.100145, unit: 'g', displayValue: '2.1', dailyValue: '2.1', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 6.296722, unit: 'g', displayValue: '6.3', dailyValue: '6.3', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 4.137199, unit: 'mcg', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 2.15126, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.09091903, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 0.3435318, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.00705511, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.4175692, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 149.562, unit: 'mg', displayValue: '150', dailyValue: '150', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 8.486327, unit: 'mg', displayValue: '8', dailyValue: '8', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 818.5121, unit: 'IU', displayValue: '819', dailyValue: '819', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.4612355, unit: 'g', displayValue: '0.5', dailyValue: '0.5', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 42.65071, unit: 'mg', displayValue: '43', dailyValue: '43', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 8.568913, unit: 'g', displayValue: '8.6', dailyValue: '8.6', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 179.0036, unit: 'kcal', displayValue: '179', dailyValue: '179', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.226542, unit: 'g', displayValue: '0.2', dailyValue: '0.2', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 13890, displayValue: '2 cups shredded extra-sharp Cheddar cheese', grams: 226.0, displayType: 'Normal',
        },
        {
          ingredientID: 16223, displayValue: '8 ounces cream cheese, softened', grams: 226.8, displayType: 'Normal',
        },
        {
          ingredientID: 6294, displayValue: '1/2 cup mayonnaise', grams: 110.0, displayType: 'Normal',
        },
        {
          ingredientID: 16396, displayValue: '1/4 teaspoon garlic powder', grams: 0.69416666, displayType: 'Normal',
        },
        {
          ingredientID: 16407, displayValue: '1/4 teaspoon ground cayenne pepper (optional)', grams: 0.45, displayType: 'OptionalIngredient',
        },
        {
          ingredientID: 16402, displayValue: '1/4 teaspoon onion powder', grams: 0.525, displayType: 'Normal',
        },
        {
          ingredientID: 3725, displayValue: '1 jalapeno pepper, seeded and minced (optional)', grams: 14.0, displayType: 'OptionalIngredient',
        },
        {
          ingredientID: 3690, displayValue: '1 (4 ounce) jar diced pimento, drained', grams: 112.0, displayType: 'Normal',
        },
        {
          ingredientID: 16421, displayValue: 'salt and black pepper to taste', grams: 0.4, displayType: 'HideAmounts',
        }],
        servings: 12,
        prepMinutes: 10,
        cookMinutes: 0,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/645301.jpg',
        id: 189930,
      },
      {
        title: 'Apple Dip',
        nutrition: {
          calories: {
            name: 'Calories', amount: 136.8375, unit: 'kcal', displayValue: '137', dailyValue: '137', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 9.764574, unit: 'g', displayValue: '9.8', dailyValue: '9.8', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 30.8, unit: 'mg', displayValue: '31', dailyValue: '31', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 85.56374, unit: 'mg', displayValue: '86', dailyValue: '86', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 9.839768, unit: 'g', displayValue: '9.8', dailyValue: '9.8', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 2.12585, unit: 'g', displayValue: '2.1', dailyValue: '2.1', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 3.730625, unit: 'mcg', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 2.690625, unit: 'mg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.01729812, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 0.3427263, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.00566375, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.4022938, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 30.10062, unit: 'mg', displayValue: '30', dailyValue: '30', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 0.0, unit: 'mg', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 376.88, unit: 'IU', displayValue: '377', dailyValue: '377', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 9.054, unit: 'g', displayValue: '9.1', dailyValue: '9.1', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 47.77813, unit: 'mg', displayValue: '48', dailyValue: '48', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 6.150642, unit: 'g', displayValue: '6.2', dailyValue: '6.2', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 87.88116, unit: 'kcal', displayValue: '88', dailyValue: '88', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.0, unit: 'g', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 16223, displayValue: '1 (8 ounce) package cream cheese', grams: 224.0, displayType: 'Normal',
        },
        {
          ingredientID: 1525, displayValue: '1/2 cup brown sugar', grams: 72.5, displayType: 'Normal',
        },
        {
          ingredientID: 16424, displayValue: '1 tablespoon vanilla extract', grams: 13.0, displayType: 'Normal',
        }],
        servings: 8,
        prepMinutes: 5,
        cookMinutes: 0,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/783116.jpg',
        id: 14978,
      },
      {
        title: "Dawn's Candied Walnuts",
        nutrition: {
          calories: {
            name: 'Calories', amount: 238.297, unit: 'kcal', displayValue: '238', dailyValue: '238', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 18.61972, unit: 'g', displayValue: '18.6', dailyValue: '18.6', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 0.4575, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 39.30094, unit: 'mg', displayValue: '39', dailyValue: '39', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 16.92131, unit: 'g', displayValue: '16.9', dailyValue: '16.9', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 4.521865, unit: 'g', displayValue: '4.5', dailyValue: '4.5', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 28.11069, unit: 'mcg', displayValue: '28', dailyValue: '28', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 45.6675, unit: 'mg', displayValue: '46', dailyValue: '46', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.1550715, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 1.144048, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.09924023, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.8532325, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 37.55648, unit: 'mg', displayValue: '38', dailyValue: '38', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 0.3912375, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 17.33156, unit: 'IU', displayValue: '17', dailyValue: '17', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 13.53747, unit: 'g', displayValue: '13.5', dailyValue: '13.5', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 135.6093, unit: 'mg', displayValue: '136', dailyValue: '136', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 1.811156, unit: 'g', displayValue: '1.8', dailyValue: '1.8', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 167.5775, unit: 'kcal', displayValue: '168', dailyValue: '168', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 2.053787, unit: 'g', displayValue: '2.1', dailyValue: '2.1', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 3819, displayValue: '1 pound walnut halves', grams: 454.0, displayType: 'Normal',
        },
        {
          ingredientID: 1526, displayValue: '1 cup white sugar', grams: 200.0, displayType: 'Normal',
        },
        {
          ingredientID: 16386, displayValue: '2 teaspoons ground cinnamon', grams: 4.6, displayType: 'Normal',
        },
        {
          ingredientID: 16421, displayValue: '1/4 teaspoon salt', grams: 1.5, displayType: 'Normal',
        },
        {
          ingredientID: 16278, displayValue: '6 tablespoons milk', grams: 91.5, displayType: 'Normal',
        },
        {
          ingredientID: 16424, displayValue: '1 teaspoon vanilla extract', grams: 4.3333335, displayType: 'Normal',
        }],
        servings: 16,
        prepMinutes: 10,
        cookMinutes: 20,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/2405917.jpg',
        id: 9443,
      },
      {
        title: "Vicki's Hush Puppies",
        nutrition: {
          calories: {
            name: 'Calories', amount: 277.2375, unit: 'kcal', displayValue: '277', dailyValue: '277', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 12.93131, unit: 'g', displayValue: '12.9', dailyValue: '12.9', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 46.5, unit: 'mg', displayValue: '46', dailyValue: '46', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 406.855, unit: 'mg', displayValue: '407', dailyValue: '407', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 36.65958, unit: 'g', displayValue: '36.7', dailyValue: '36.7', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 4.586762, unit: 'g', displayValue: '4.6', dailyValue: '4.6', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 75.595, unit: 'mcg', displayValue: '76', dailyValue: '76', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 19.45875, unit: 'mg', displayValue: '19', dailyValue: '19', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.1305375, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 2.594738, unit: 'mg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.22174, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 1.877463, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 118.9275, unit: 'mg', displayValue: '119', dailyValue: '119', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 1.3875, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 132.7725, unit: 'IU', displayValue: '133', dailyValue: '133', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 13.41438, unit: 'g', displayValue: '13.4', dailyValue: '13.4', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 102.6375, unit: 'mg', displayValue: '103', dailyValue: '103', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 1.889207, unit: 'g', displayValue: '1.9', dailyValue: '1.9', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 116.3818, unit: 'kcal', displayValue: '116', dailyValue: '116', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 1.762375, unit: 'g', displayValue: '1.8', dailyValue: '1.8', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 16317, displayValue: '2 eggs, beaten', grams: 100.0, displayType: 'Normal',
        },
        {
          ingredientID: 1526, displayValue: '1/2 cup white sugar', grams: 100.0, displayType: 'Normal',
        },
        {
          ingredientID: 4397, displayValue: '1 large onion, diced', grams: 150.0, displayType: 'Normal',
        },
        {
          ingredientID: 1685, displayValue: '1 cup self-rising flour', grams: 125.0, displayType: 'Normal',
        },
        {
          ingredientID: 1633, displayValue: '1 cup self-rising cornmeal', grams: 122.0, displayType: 'Normal',
        },
        {
          ingredientID: 20482, displayValue: '1 quart oil for frying', grams: 880.0, displayType: 'Normal',
        }],
        servings: 8,
        prepMinutes: 10,
        cookMinutes: 30,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/1400328.jpg',
        id: 25241,
      },
      {
        title: "Gary's Stuffed Mushrooms",
        nutrition: {
          calories: {
            name: 'Calories', amount: 413.1075, unit: 'kcal', displayValue: '413', dailyValue: '413', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 37.9234, unit: 'g', displayValue: '37.9', dailyValue: '37.9', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 105.7423, unit: 'mg', displayValue: '106', dailyValue: '106', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 693.4775, unit: 'mg', displayValue: '693', dailyValue: '693', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 14.35643, unit: 'g', displayValue: '14.4', dailyValue: '14.4', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 5.874866, unit: 'g', displayValue: '5.9', dailyValue: '5.9', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 7.256667, unit: 'mcg', displayValue: '7', dailyValue: '7', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 12.20583, unit: 'mg', displayValue: '12', dailyValue: '12', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.064595, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 2.287109, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.03281834, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 1.110642, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 36.0475, unit: 'mg', displayValue: '36', dailyValue: '36', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 0.639, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 1196.753, unit: 'IU', displayValue: '1197', dailyValue: '1197', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 2.186825, unit: 'g', displayValue: '2.2', dailyValue: '2.2', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 161.4033, unit: 'mg', displayValue: '161', dailyValue: '161', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 23.71084, unit: 'g', displayValue: '23.7', dailyValue: '23.7', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 341.3106, unit: 'kcal', displayValue: '341', dailyValue: '341', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.9790833, unit: 'g', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 4378, displayValue: '12 large fresh mushrooms, stems removed', grams: 276.0, displayType: 'Normal',
        },
        {
          ingredientID: 17989, displayValue: '1 (6 ounce) package chicken flavored dry stuffing mix', grams: 168.0, displayType: 'Normal',
        },
        {
          ingredientID: 16223, displayValue: '1 (8 ounce) package cream cheese, softened', grams: 224.0, displayType: 'Normal',
        },
        {
          ingredientID: 2653, displayValue: '1/2 pound imitation crabmeat, flaked', grams: 227.0, displayType: 'Normal',
        },
        {
          ingredientID: 16157, displayValue: '2 cups butter', grams: 454.0, displayType: 'Normal',
        },
        {
          ingredientID: 4342, displayValue: '2 cloves garlic, peeled and minced', grams: 6.0, displayType: 'Normal',
        },
        {
          ingredientID: 16421, displayValue: 'salt and pepper to taste', grams: 0.0, displayType: 'HideAmounts',
        },
        {
          ingredientID: 16396, displayValue: 'garlic powder to taste', grams: 0.0, displayType: 'HideAmounts',
        },
        {
          ingredientID: 20244, displayValue: 'crushed red pepper to taste', grams: 0.0, displayType: 'HideAmounts',
        }],
        servings: 12,
        prepMinutes: 30,
        cookMinutes: 12,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/142809.jpg',
        id: 24174,
      },
      {
        title: 'Baked Chicken Wings',
        nutrition: {
          calories: {
            name: 'Calories', amount: 532.1374, unit: 'kcal', displayValue: '532', dailyValue: '532', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 43.10577, unit: 'g', displayValue: '43.1', dailyValue: '43.1', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 96.6, unit: 'mg', displayValue: '97', dailyValue: '97', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 122.5706, unit: 'mg', displayValue: '123', dailyValue: '123', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 3.944275, unit: 'g', displayValue: '3.9', dailyValue: '3.9', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 31.73302, unit: 'g', displayValue: '31.7', dailyValue: '31.7', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 6.260255, unit: 'mcg', displayValue: '6', dailyValue: '6', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 28.28096, unit: 'mg', displayValue: '28', dailyValue: '28', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.6765548, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 13.49536, unit: 'mg', displayValue: '13', dailyValue: '13', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.07300937, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 2.065846, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 34.06819, unit: 'mg', displayValue: '34', dailyValue: '34', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 3.35094, unit: 'mg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 967.0854, unit: 'IU', displayValue: '967', dailyValue: '967', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.5727195, unit: 'g', displayValue: '0.6', dailyValue: '0.6', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 295.8589, unit: 'mg', displayValue: '296', dailyValue: '296', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 9.147679, unit: 'g', displayValue: '9.1', dailyValue: '9.1', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 387.9519, unit: 'kcal', displayValue: '388', dailyValue: '388', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 1.137386, unit: 'g', displayValue: '1.1', dailyValue: '1.1', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 6307, displayValue: '3 tablespoons olive oil', grams: 40.5, displayType: 'Normal',
        },
        {
          ingredientID: 4342, displayValue: '3 cloves garlic, pressed', grams: 9.0, displayType: 'Normal',
        },
        {
          ingredientID: 16385, displayValue: '2 teaspoons chili powder', grams: 5.2949777, displayType: 'Normal',
        },
        {
          ingredientID: 16396, displayValue: '1 teaspoon garlic powder', grams: 2.7766666, displayType: 'Normal',
        },
        {
          ingredientID: 16421, displayValue: 'salt and ground black pepper to taste', grams: 0.4, displayType: 'HideAmounts',
        },
        {
          ingredientID: 6531, displayValue: '10 chicken wings', grams: 920.0, displayType: 'Normal',
        }],
        servings: 2,
        prepMinutes: 10,
        cookMinutes: 60,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/4496634.jpg',
        id: 187822,
      },
      {
        title: "Ali's Amazing Bruschetta",
        nutrition: {
          calories: {
            name: 'Calories', amount: 175.6972, unit: 'kcal', displayValue: '176', dailyValue: '176', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 7.170984, unit: 'g', displayValue: '7.2', dailyValue: '7.2', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 3.666667, unit: 'mg', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 288.4142, unit: 'mg', displayValue: '288', dailyValue: '288', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 22.44741, unit: 'g', displayValue: '22.4', dailyValue: '22.4', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 5.605546, unit: 'g', displayValue: '5.6', dailyValue: '5.6', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 84.25344, unit: 'mcg', displayValue: '84', dailyValue: '84', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 20.22089, unit: 'mg', displayValue: '20', dailyValue: '20', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.08033819, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 3.106725, unit: 'mg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.2208666, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 1.38855, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 87.87392, unit: 'mg', displayValue: '88', dailyValue: '88', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 9.413668, unit: 'mg', displayValue: '9', dailyValue: '9', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 580.3193, unit: 'IU', displayValue: '580', dailyValue: '580', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 2.3397, unit: 'g', displayValue: '2.3', dailyValue: '2.3', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 210.076, unit: 'mg', displayValue: '210', dailyValue: '210', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 1.687157, unit: 'g', displayValue: '1.7', dailyValue: '1.7', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 64.53886, unit: 'kcal', displayValue: '65', dailyValue: '65', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 1.921439, unit: 'g', displayValue: '1.9', dailyValue: '1.9', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 4572, displayValue: '2 large tomatoes, coarsely chopped', grams: 364.0, displayType: 'Normal',
        },
        {
          ingredientID: 20415, displayValue: '1/2 sweet onion, chopped', grams: 55.0, displayType: 'Normal',
        },
        {
          ingredientID: 6307, displayValue: '2 tablespoons olive oil', grams: 27.0, displayType: 'Normal',
        },
        {
          ingredientID: 18766, displayValue: '1 tablespoon chopped fresh oregano', grams: 6.0, displayType: 'Normal',
        },
        {
          ingredientID: 16159, displayValue: '1 teaspoon chopped fresh basil', grams: 0.8833333, displayType: 'Normal',
        },
        {
          ingredientID: 4409, displayValue: '2 teaspoons chopped fresh parsley', grams: 2.5, displayType: 'Normal',
        },
        {
          ingredientID: 2077, displayValue: '1/2 (1 pound) loaf Italian bread, cut into 1 inch slices', grams: 227.0, displayType: 'Normal',
        },
        {
          ingredientID: 16238, displayValue: '1/4 cup freshly grated Parmesan cheese', grams: 20.0, displayType: 'Normal',
        }],
        servings: 6,
        prepMinutes: 15,
        cookMinutes: 0,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/15578.jpg',
        id: 48156,
      },
      {
        title: 'Restaurant Style Chicken Nachos',
        nutrition: {
          calories: {
            name: 'Calories', amount: 406.9417, unit: 'kcal', displayValue: '407', dailyValue: '407', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 25.7277, unit: 'g', displayValue: '25.7', dailyValue: '25.7', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 54.16667, unit: 'mg', displayValue: '54', dailyValue: '54', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 669.6083, unit: 'mg', displayValue: '670', dailyValue: '670', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 24.4185, unit: 'g', displayValue: '24.4', dailyValue: '24.4', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 21.36053, unit: 'g', displayValue: '21.4', dailyValue: '21.4', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 20.33167, unit: 'mcg', displayValue: '20', dailyValue: '20', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 60.34, unit: 'mg', displayValue: '60', dailyValue: '60', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.2751483, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 5.722023, unit: 'mg', displayValue: '6', dailyValue: '6', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.07249834, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 1.46545, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 279.2683, unit: 'mg', displayValue: '279', dailyValue: '279', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 5.878333, unit: 'mg', displayValue: '6', dailyValue: '6', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 832.9316, unit: 'IU', displayValue: '833', dailyValue: '833', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 2.359283, unit: 'g', displayValue: '2.4', dailyValue: '2.4', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 335.0267, unit: 'mg', displayValue: '335', dailyValue: '335', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 8.091902, unit: 'g', displayValue: '8.1', dailyValue: '8.1', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 231.5493, unit: 'kcal', displayValue: '232', dailyValue: '232', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 2.767667, unit: 'g', displayValue: '2.8', dailyValue: '2.8', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 4342, displayValue: '2 cloves garlic, crushed', grams: 6.0, displayType: 'Normal',
        },
        {
          ingredientID: 4405, displayValue: '6 green onions, sliced, white parts and tops separated', grams: 90.0, displayType: 'Normal',
        },
        {
          ingredientID: 6420, displayValue: '3 tablespoons canola oil', grams: 42.0, displayType: 'Normal',
        },
        {
          ingredientID: 6493, displayValue: '1 shredded, cooked, whole chicken breast', grams: 220.0, displayType: 'Normal',
        },
        {
          ingredientID: 16421, displayValue: 'salt and pepper to taste', grams: 0.0, displayType: 'HideAmounts',
        },
        {
          ingredientID: 5588, displayValue: '1 cup salsa', grams: 259.0, displayType: 'Normal',
        },
        {
          ingredientID: 1320, displayValue: '1/2 (12 ounce) package tortilla chips', grams: 168.0, displayType: 'Normal',
        },
        {
          ingredientID: 440, displayValue: '1 (8 ounce) package shredded Cheddar/Monterey Jack cheese blend', grams: 224.0, displayType: 'Normal',
        },
        {
          ingredientID: 4572, displayValue: '1/2 large tomato, diced', grams: 91.0, displayType: 'Normal',
        }],
        servings: 6,
        prepMinutes: 30,
        cookMinutes: 10,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/745665.jpg',
        id: 26924,
      },
      {
        title: 'Best Bruschetta Ever',
        nutrition: {
          calories: {
            name: 'Calories', amount: 47.05708, unit: 'kcal', displayValue: '47', dailyValue: '47', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 4.156607, unit: 'g', displayValue: '4.2', dailyValue: '4.2', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 2.2, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 39.94234, unit: 'mg', displayValue: '40', dailyValue: '40', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 1.483875, unit: 'g', displayValue: '1.5', dailyValue: '1.5', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 1.284769, unit: 'g', displayValue: '1.3', dailyValue: '1.3', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 4.87375, unit: 'mcg', displayValue: '5', dailyValue: '5', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 4.42625, unit: 'mg', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.03045625, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 0.4218242, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.0200175, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.1882164, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 34.23978, unit: 'mg', displayValue: '34', dailyValue: '34', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 4.024458, unit: 'mg', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 278.5268, unit: 'IU', displayValue: '279', dailyValue: '279', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.8349751, unit: 'g', displayValue: '0.8', dailyValue: '0.8', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 81.6254, unit: 'mg', displayValue: '82', dailyValue: '82', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 0.9074888, unit: 'g', displayValue: '0.9', dailyValue: '0.9', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 37.40946, unit: 'kcal', displayValue: '37', dailyValue: '37', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.4199374, unit: 'g', displayValue: '0.4', dailyValue: '0.4', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 4572, displayValue: '2 tomatoes, cubed', grams: 246.0, displayType: 'Normal',
        },
        {
          ingredientID: 18681, displayValue: '1 teaspoon dried basil', grams: 0.8833334, displayType: 'Normal',
        },
        {
          ingredientID: 16238, displayValue: '4 tablespoons grated Parmesan cheese', grams: 20.0, displayType: 'Normal',
        },
        {
          ingredientID: 6307, displayValue: '2 tablespoons olive oil', grams: 27.0, displayType: 'Normal',
        },
        {
          ingredientID: 4342, displayValue: '1 clove garlic, crushed', grams: 3.0, displayType: 'Normal',
        },
        {
          ingredientID: 18741, displayValue: 'seasoning salt to taste', grams: 0.0, displayType: 'HideAmounts',
        },
        {
          ingredientID: 16406, displayValue: 'ground black pepper to taste', grams: 0.0, displayType: 'HideAmounts',
        }],
        servings: 8,
        prepMinutes: 20,
        cookMinutes: 0,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/482428.jpg',
        id: 27192,
      },
      {
        title: 'Baked Ham and Cheese Party Sandwiches',
        nutrition: {
          calories: {
            name: 'Calories', amount: 208.3097, unit: 'kcal', displayValue: '208', dailyValue: '208', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 14.04917, unit: 'g', displayValue: '14', dailyValue: '14', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 43.3778, unit: 'mg', displayValue: '43', dailyValue: '43', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 439.2009, unit: 'mg', displayValue: '439', dailyValue: '439', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 10.83125, unit: 'g', displayValue: '10.8', dailyValue: '10.8', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 9.76652, unit: 'g', displayValue: '9.8', dailyValue: '9.8', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 19.4199, unit: 'mcg', displayValue: '19', dailyValue: '19', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 17.23403, unit: 'mg', displayValue: '17', dailyValue: '17', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.09180791, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 2.86967, unit: 'mg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.2569058, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.8353828, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 182.5292, unit: 'mg', displayValue: '183', dailyValue: '183', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 0.9448733, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 332.5122, unit: 'IU', displayValue: '333', dailyValue: '333', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.4126079, unit: 'g', displayValue: '0.4', dailyValue: '0.4', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 101.9036, unit: 'mg', displayValue: '102', dailyValue: '102', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 7.84245, unit: 'g', displayValue: '7.8', dailyValue: '7.8', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 126.4426, unit: 'kcal', displayValue: '126', dailyValue: '126', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.8230333, unit: 'g', displayValue: '0.8', dailyValue: '0.8', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 16157, displayValue: '3/4 cup melted butter', grams: 170.25, displayType: 'Normal',
        },
        {
          ingredientID: 18873, displayValue: '1 1/2 tablespoons Dijon mustard', grams: 23.4375, displayType: 'Normal',
        },
        {
          ingredientID: 7428, displayValue: '1 1/2 teaspoons Worcestershire sauce', grams: 8.5, displayType: 'Normal',
        },
        {
          ingredientID: 16409, displayValue: '1 1/2 tablespoons poppy seeds', grams: 12.599999, displayType: 'Normal',
        },
        {
          ingredientID: 4399, displayValue: '1 tablespoon dried minced onion', grams: 3.5, displayType: 'Normal',
        },
        {
          ingredientID: 22041, displayValue: '24 mini sandwich rolls', grams: 408.96002, displayType: 'Normal',
        },
        {
          ingredientID: 5831, displayValue: '1 pound thinly sliced cooked deli ham', grams: 454.0, displayType: 'Normal',
        },
        {
          ingredientID: 16246, displayValue: '1 pound thinly sliced Swiss cheese', grams: 448.0, displayType: 'Normal',
        }],
        servings: 24,
        prepMinutes: 15,
        cookMinutes: 20,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/1081745.jpg',
        id: 216756,
      },
      {
        title: 'Cheese Fondue',
        nutrition: {
          calories: {
            name: 'Calories', amount: 669.8359, unit: 'kcal', displayValue: '670', dailyValue: '670', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 28.86153, unit: 'g', displayValue: '28.9', dailyValue: '28.9', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 91.156, unit: 'mg', displayValue: '91', dailyValue: '91', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 939.8198, unit: 'mg', displayValue: '940', dailyValue: '940', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 56.90214, unit: 'g', displayValue: '56.9', dailyValue: '56.9', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 36.49294, unit: 'g', displayValue: '36.5', dailyValue: '36.5', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 146.1686, unit: 'mcg', displayValue: '146', dailyValue: '146', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 64.41946, unit: 'mg', displayValue: '64', dailyValue: '64', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.1901653, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 11.97157, unit: 'mg', displayValue: '12', dailyValue: '12', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.5300657, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 3.704768, unit: 'mg', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 858.1013, unit: 'mg', displayValue: '858', dailyValue: '858', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 0.1837, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 802.3849, unit: 'IU', displayValue: '802', dailyValue: '802', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 3.579585, unit: 'g', displayValue: '3.6', dailyValue: '3.6', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 225.3398, unit: 'mg', displayValue: '225', dailyValue: '225', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 17.04056, unit: 'g', displayValue: '17', dailyValue: '17', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 259.7538, unit: 'kcal', displayValue: '260', dailyValue: '260', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 2.265975, unit: 'g', displayValue: '2.3', dailyValue: '2.3', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 3474, displayValue: '1 cup dry white wine', grams: 249.92294, displayType: 'Normal',
        },
        {
          ingredientID: 16246, displayValue: '1/2 pound shredded Swiss cheese', grams: 224.0, displayType: 'Normal',
        },
        {
          ingredientID: 16229, displayValue: '1/2 pound shredded Gruyere cheese', grams: 227.0, displayType: 'Normal',
        },
        {
          ingredientID: 1684, displayValue: '2 tablespoons all-purpose flour', grams: 15.625, displayType: 'Normal',
        },
        {
          ingredientID: 16421, displayValue: '1/4 teaspoon salt', grams: 1.5, displayType: 'Normal',
        },
        {
          ingredientID: 16401, displayValue: '1/4 teaspoon ground nutmeg', grams: 0.75, displayType: 'Normal',
        },
        {
          ingredientID: 2073, displayValue: '1 (1 pound) loaf French bread, cut into 1 inch cubes', grams: 448.0, displayType: 'Normal',
        }],
        servings: 5,
        prepMinutes: 0,
        cookMinutes: 0,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/3219684.jpg',
        id: 13714,
      },
      {
        title: 'Chicken Flautas',
        nutrition: {
          calories: {
            name: 'Calories', amount: 126.8362, unit: 'kcal', displayValue: '127', dailyValue: '127', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 5.450458, unit: 'g', displayValue: '5.5', dailyValue: '5.5', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 20.34978, unit: 'mg', displayValue: '20', dailyValue: '20', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 134.5722, unit: 'mg', displayValue: '135', dailyValue: '135', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 12.10966, unit: 'g', displayValue: '12.1', dailyValue: '12.1', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 7.722981, unit: 'g', displayValue: '7.7', dailyValue: '7.7', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 3.886125, unit: 'mcg', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 24.77171, unit: 'mg', displayValue: '25', dailyValue: '25', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.1014758, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 2.688316, unit: 'mg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.03629092, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.5294223, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 116.0468, unit: 'mg', displayValue: '116', dailyValue: '116', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 0.001122917, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 114.2838, unit: 'IU', displayValue: '114', dailyValue: '114', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.5049437, unit: 'g', displayValue: '0.5', dailyValue: '0.5', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 92.64108, unit: 'mg', displayValue: '93', dailyValue: '93', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 2.796911, unit: 'g', displayValue: '2.8', dailyValue: '2.8', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 49.05412, unit: 'kcal', displayValue: '49', dailyValue: '49', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 1.72042, unit: 'g', displayValue: '1.7', dailyValue: '1.7', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 6497, displayValue: '4 skinless, boneless chicken breast halves - cooked and shredded', grams: 380.0, displayType: 'Normal',
        },
        {
          ingredientID: 12084, displayValue: '1 (8 ounce) jar picante sauce', grams: 224.0, displayType: 'Normal',
        },
        {
          ingredientID: 20551, displayValue: '1/4 teaspoon ground cumin', grams: 0.525, displayType: 'Normal',
        },
        {
          ingredientID: 16231, displayValue: '8 ounces shredded Monterey Jack cheese', grams: 226.8, displayType: 'Normal',
        },
        {
          ingredientID: 16215, displayValue: '8 ounces shredded Cheddar cheese', grams: 226.8, displayType: 'Normal',
        },
        {
          ingredientID: 2351, displayValue: '36 (6 inch) corn tortillas', grams: 936.0, displayType: 'Normal',
        },
        {
          ingredientID: 6305, displayValue: '1 tablespoon vegetable oil', grams: 13.625, displayType: 'Normal',
        }],
        servings: 36,
        prepMinutes: 0,
        cookMinutes: 0,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/355157.jpg',
        id: 8878,
      },
      {
        title: 'Chicken Enchilada Dip',
        nutrition: {
          calories: {
            name: 'Calories', amount: 128.1945, unit: 'kcal', displayValue: '128', dailyValue: '128', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 11.45947, unit: 'g', displayValue: '11.5', dailyValue: '11.5', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 27.55723, unit: 'mg', displayValue: '28', dailyValue: '28', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 162.7923, unit: 'mg', displayValue: '163', dailyValue: '163', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 0.7514374, unit: 'g', displayValue: '0.8', dailyValue: '0.8', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 5.678986, unit: 'g', displayValue: '5.7', dailyValue: '5.7', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 3.691931, unit: 'mcg', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 6.168731, unit: 'mg', displayValue: '6', dailyValue: '6', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.1217051, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 2.524431, unit: 'mg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.01180779, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.28451, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 62.16837, unit: 'mg', displayValue: '62', dailyValue: '62', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 2.7454, unit: 'mg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 229.2998, unit: 'IU', displayValue: '229', dailyValue: '229', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.2672501, unit: 'g', displayValue: '0.3', dailyValue: '0.3', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 51.0757, unit: 'mg', displayValue: '51', dailyValue: '51', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 4.218248, unit: 'g', displayValue: '4.2', dailyValue: '4.2', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 103.1352, unit: 'kcal', displayValue: '103', dailyValue: '103', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.06084856, unit: 'g', displayValue: '0.1', dailyValue: '0.1', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 6494, displayValue: '1 pound skinless, boneless chicken breast halves', grams: 454.4, displayType: 'Normal',
        },
        {
          ingredientID: 16223, displayValue: '1 (8 ounce) package cream cheese, softened', grams: 224.0, displayType: 'Normal',
        },
        {
          ingredientID: 6294, displayValue: '1 (8 ounce) jar mayonnaise', grams: 227.2, displayType: 'Normal',
        },
        {
          ingredientID: 16215, displayValue: '1 (8 ounce) package shredded Cheddar cheese', grams: 224.0, displayType: 'Normal',
        },
        {
          ingredientID: 4431, displayValue: '1 (4 ounce) can diced green chile peppers', grams: 112.0, displayType: 'Normal',
        },
        {
          ingredientID: 3725, displayValue: '1 jalapeno pepper, finely diced', grams: 14.0, displayType: 'Normal',
        }],
        servings: 30,
        prepMinutes: 15,
        cookMinutes: 50,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/963772.jpg',
        id: 24643,
      },
      {
        title: 'Grill Master Chicken Wings',
        nutrition: {
          calories: {
            name: 'Calories', amount: 181.1624, unit: 'kcal', displayValue: '181', dailyValue: '181', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 14.57889, unit: 'g', displayValue: '14.6', dailyValue: '14.6', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 40.76125, unit: 'mg', displayValue: '41', dailyValue: '41', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 1154.148, unit: 'mg', displayValue: '1154', dailyValue: '1154', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 2.34122, unit: 'g', displayValue: '2.3', dailyValue: '2.3', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 10.09094, unit: 'g', displayValue: '10.1', dailyValue: '10.1', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 3.39203, unit: 'mcg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 12.93755, unit: 'mg', displayValue: '13', dailyValue: '13', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.1785297, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 4.400807, unit: 'mg', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.02241773, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.7910753, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 10.26464, unit: 'mg', displayValue: '10', dailyValue: '10', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 4.183564, unit: 'mg', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 208.8289, unit: 'IU', displayValue: '209', dailyValue: '209', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 1.278087, unit: 'g', displayValue: '1.3', dailyValue: '1.3', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 106.542, unit: 'mg', displayValue: '107', dailyValue: '107', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 5.297403, unit: 'g', displayValue: '5.3', dailyValue: '5.3', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 131.21, unit: 'kcal', displayValue: '131', dailyValue: '131', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.123419, unit: 'g', displayValue: '0.1', dailyValue: '0.1', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 0, displayValue: 'Wings:', grams: 0.0, displayType: 'Heading',
        },
        {
          ingredientID: 2882, displayValue: '1/2 cup soy sauce', grams: 128.0, displayType: 'Normal',
        },
        {
          ingredientID: 6344, displayValue: '1/2 cup Italian-style salad dressing', grams: 117.5, displayType: 'Normal',
        },
        {
          ingredientID: 6531, displayValue: '3 pounds chicken wings, cut apart at joints, wing tips discarded', grams: 1362.0, displayType: 'Normal',
        },
        {
          ingredientID: 0, displayValue: '', grams: 0.0, displayType: 'BlankLine',
        },
        {
          ingredientID: 0, displayValue: 'Sauce:', grams: 0.0, displayType: 'Heading',
        },
        {
          ingredientID: 16157, displayValue: '1/4 cup butter', grams: 56.75, displayType: 'Normal',
        },
        {
          ingredientID: 2882, displayValue: '1 teaspoon soy sauce', grams: 5.3, displayType: 'Normal',
        },
        {
          ingredientID: 5592, displayValue: "1/4 cup hot pepper sauce (such as Frank's RedHot®), or to taste", grams: 55.93, displayType: 'Normal',
        }],
        servings: 10,
        prepMinutes: 10,
        cookMinutes: 20,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/1311361.jpg',
        id: 213068,
      },
      {
        title: 'Artichoke Spinach Dip',
        nutrition: {
          calories: {
            name: 'Calories', amount: 79.83895, unit: 'kcal', displayValue: '80', dailyValue: '80', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 7.450693, unit: 'g', displayValue: '7.5', dailyValue: '7.5', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 19.37651, unit: 'mg', displayValue: '19', dailyValue: '19', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 89.73441, unit: 'mg', displayValue: '90', dailyValue: '90', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 1.637059, unit: 'g', displayValue: '1.6', dailyValue: '1.6', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 2.012019, unit: 'g', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 10.35197, unit: 'mcg', displayValue: '10', dailyValue: '10', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 6.631839, unit: 'mg', displayValue: '7', dailyValue: '7', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.01580983, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 0.4407496, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.01199353, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.214647, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 47.85336, unit: 'mg', displayValue: '48', dailyValue: '48', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 0.9760061, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 854.462, unit: 'IU', displayValue: '854', dailyValue: '854', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.08839517, unit: 'g', displayValue: '0.1', dailyValue: '0.1', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 52.46521, unit: 'mg', displayValue: '52', dailyValue: '52', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 4.644417, unit: 'g', displayValue: '4.6', dailyValue: '4.6', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 67.05624, unit: 'kcal', displayValue: '67', dailyValue: '67', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.3001327, unit: 'g', displayValue: '0.3', dailyValue: '0.3', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 16157, displayValue: '1/4 cup butter', grams: 56.75, displayType: 'Normal',
        },
        {
          ingredientID: 4520, displayValue: '1 (10 ounce) package frozen chopped spinach, partially thawed', grams: 284.0, displayType: 'Normal',
        },
        {
          ingredientID: 126, displayValue: '1 (14 ounce) can artichoke hearts, drained and chopped', grams: 240.0, displayType: 'Normal',
        },
        {
          ingredientID: 16223, displayValue: '2 (8 ounce) packages cream cheese, softened', grams: 448.0, displayType: 'Normal',
        },
        {
          ingredientID: 16261, displayValue: '2 (16 ounce) containers sour cream', grams: 908.8, displayType: 'Normal',
        },
        {
          ingredientID: 16238, displayValue: '1 cup grated Parmesan cheese', grams: 80.0, displayType: 'Normal',
        },
        {
          ingredientID: 18740, displayValue: 'garlic salt to taste', grams: 0.0, displayType: 'HideAmounts',
        }],
        servings: 56,
        prepMinutes: 15,
        cookMinutes: 20,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/2781831.jpg',
        id: 26699,
      },
      {
        title: 'Hot Mexican Spinach Dip',
        nutrition: {
          calories: {
            name: 'Calories', amount: 40.04421, unit: 'kcal', displayValue: '40', dailyValue: '40', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 3.118871, unit: 'g', displayValue: '3.1', dailyValue: '3.1', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 9.296785, unit: 'mg', displayValue: '9', dailyValue: '9', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 99.80428, unit: 'mg', displayValue: '100', dailyValue: '100', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 1.389508, unit: 'g', displayValue: '1.4', dailyValue: '1.4', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 1.913136, unit: 'g', displayValue: '1.9', dailyValue: '1.9', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 9.28, unit: 'mcg', displayValue: '9', dailyValue: '9', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 7.458214, unit: 'mg', displayValue: '7', dailyValue: '7', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.03014232, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 0.4529843, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.01089411, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.2553822, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 54.74357, unit: 'mg', displayValue: '55', dailyValue: '55', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 0.5265536, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 717.9291, unit: 'IU', displayValue: '718', dailyValue: '718', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.7577428, unit: 'g', displayValue: '0.8', dailyValue: '0.8', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 63.34806, unit: 'mg', displayValue: '63', dailyValue: '63', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 1.874941, unit: 'g', displayValue: '1.9', dailyValue: '1.9', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 28.06984, unit: 'kcal', displayValue: '28', dailyValue: '28', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.3110715, unit: 'g', displayValue: '0.3', dailyValue: '0.3', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 5588, displayValue: '1 (16 ounce) jar salsa', grams: 448.0, displayType: 'Normal',
        },
        {
          ingredientID: 4520, displayValue: '1 (10 ounce) package frozen chopped spinach, thawed and drained', grams: 284.0, displayType: 'Normal',
        },
        {
          ingredientID: 16231, displayValue: '2 cups shredded Monterey Jack cheese', grams: 226.0, displayType: 'Normal',
        },
        {
          ingredientID: 16223, displayValue: '1 (8 ounce) package cream cheese, diced and softened', grams: 224.0, displayType: 'Normal',
        },
        {
          ingredientID: 16347, displayValue: '1 cup evaporated milk', grams: 252.0, displayType: 'Normal',
        },
        {
          ingredientID: 5133, displayValue: '1 (2.25 ounce) can chopped black olives, drained', grams: 63.0, displayType: 'Normal',
        },
        {
          ingredientID: 18888, displayValue: '1 tablespoon red wine vinegar', grams: 16.071428, displayType: 'Normal',
        },
        {
          ingredientID: 16421, displayValue: 'salt and pepper to taste', grams: 0.0, displayType: 'HideAmounts',
        }],
        servings: 56,
        prepMinutes: 15,
        cookMinutes: 15,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/3141482.jpg',
        id: 24191,
      },
      {
        title: 'Pita Chips',
        nutrition: {
          calories: {
            name: 'Calories', amount: 125.2581, unit: 'kcal', displayValue: '125', dailyValue: '125', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 5.335823, unit: 'g', displayValue: '5.3', dailyValue: '5.3', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 0.0, unit: 'mg', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 245.8857, unit: 'mg', displayValue: '246', dailyValue: '246', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 17.68339, unit: 'g', displayValue: '17.7', dailyValue: '17.7', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 3.156557, unit: 'g', displayValue: '3.2', dailyValue: '3.2', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 11.37326, unit: 'mcg', displayValue: '11', dailyValue: '11', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 22.40433, unit: 'mg', displayValue: '22', dailyValue: '22', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.09282457, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 1.700787, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.1086658, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 1.03841, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 6.104021, unit: 'mg', displayValue: '6', dailyValue: '6', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 0.03957875, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 4.327688, unit: 'IU', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.2631788, unit: 'g', displayValue: '0.3', dailyValue: '0.3', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 57.57627, unit: 'mg', displayValue: '58', dailyValue: '58', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 0.7531905, unit: 'g', displayValue: '0.8', dailyValue: '0.8', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 48.02241, unit: 'kcal', displayValue: '48', dailyValue: '48', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 2.394887, unit: 'g', displayValue: '2.4', dailyValue: '2.4', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 2085, displayValue: '12 pita bread pockets', grams: 768.0, displayType: 'Normal',
        },
        {
          ingredientID: 6307, displayValue: '1/2 cup olive oil', grams: 108.0, displayType: 'Normal',
        },
        {
          ingredientID: 16406, displayValue: '1/2 teaspoon ground black pepper', grams: 1.05, displayType: 'Normal',
        },
        {
          ingredientID: 18740, displayValue: '1 teaspoon garlic salt', grams: 5.5, displayType: 'Normal',
        },
        {
          ingredientID: 16379, displayValue: '1/2 teaspoon dried basil', grams: 0.7, displayType: 'Normal',
        },
        {
          ingredientID: 16384, displayValue: '1 teaspoon dried chervil', grams: 0.6, displayType: 'Normal',
        }],
        servings: 24,
        prepMinutes: 10,
        cookMinutes: 7,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/37529.jpg',
        id: 14827,
      },
      {
        title: 'Roasted Garlic Bread',
        nutrition: {
          calories: {
            name: 'Calories', amount: 322.1981, unit: 'kcal', displayValue: '322', dailyValue: '322', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 17.33506, unit: 'g', displayValue: '17.3', dailyValue: '17.3', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 31.60313, unit: 'mg', displayValue: '32', dailyValue: '32', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 436.1525, unit: 'mg', displayValue: '436', dailyValue: '436', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 35.40654, unit: 'g', displayValue: '35.4', dailyValue: '35.4', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 6.944866, unit: 'g', displayValue: '6.9', dailyValue: '6.9', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 110.2856, unit: 'mcg', displayValue: '110', dailyValue: '110', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 21.56563, unit: 'mg', displayValue: '22', dailyValue: '22', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.28805, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 3.982411, unit: 'mg', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.3121025, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 2.0875, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 100.2231, unit: 'mg', displayValue: '100', dailyValue: '100', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 7.175437, unit: 'mg', displayValue: '7', dailyValue: '7', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 401.4481, unit: 'IU', displayValue: '401', dailyValue: '401', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.7047719, unit: 'g', displayValue: '0.7', dailyValue: '0.7', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 154.2331, unit: 'mg', displayValue: '154', dailyValue: '154', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 8.474638, unit: 'g', displayValue: '8.5', dailyValue: '8.5', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 156.0155, unit: 'kcal', displayValue: '156', dailyValue: '156', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 1.988719, unit: 'g', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 4342, displayValue: '3 heads garlic', grams: 168.0, displayType: 'Normal',
        },
        {
          ingredientID: 6307, displayValue: '2 tablespoons olive oil', grams: 27.0, displayType: 'Normal',
        },
        {
          ingredientID: 2077, displayValue: '1 (1 pound) loaf Italian bread', grams: 454.0, displayType: 'Normal',
        },
        {
          ingredientID: 16157, displayValue: '1/2 cup butter', grams: 113.5, displayType: 'Normal',
        },
        {
          ingredientID: 4409, displayValue: '1 tablespoon chopped fresh parsley (optional)', grams: 3.75, displayType: 'OptionalIngredient',
        },
        {
          ingredientID: 16238, displayValue: '2 tablespoons grated Parmesan cheese (optional)', grams: 10.0, displayType: 'OptionalIngredient',
        }],
        servings: 8,
        prepMinutes: 15,
        cookMinutes: 35,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/797993.jpg',
        id: 75133,
      },
      {
        title: 'Divine Hard-Boiled Eggs',
        nutrition: {
          calories: {
            name: 'Calories', amount: 71.5, unit: 'kcal', displayValue: '72', dailyValue: '72', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 4.97, unit: 'g', displayValue: '5', dailyValue: '5', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 186.0, unit: 'mg', displayValue: '186', dailyValue: '186', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 70.0, unit: 'mg', displayValue: '70', dailyValue: '70', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 0.385, unit: 'g', displayValue: '0.4', dailyValue: '0.4', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 6.29, unit: 'g', displayValue: '6.3', dailyValue: '6.3', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 23.5, unit: 'mcg', displayValue: '24', dailyValue: '24', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 6.0, unit: 'mg', displayValue: '6', dailyValue: '6', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.0715, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 1.394358, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.031, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.915, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 26.5, unit: 'mg', displayValue: '26', dailyValue: '26', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 0.0, unit: 'mg', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 243.5, unit: 'IU', displayValue: '244', dailyValue: '244', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.385, unit: 'g', displayValue: '0.4', dailyValue: '0.4', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 67.0, unit: 'mg', displayValue: '67', dailyValue: '67', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 1.5495, unit: 'g', displayValue: '1.5', dailyValue: '1.5', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 44.73, unit: 'kcal', displayValue: '45', dailyValue: '45', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.0, unit: 'g', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 16317, displayValue: '12 eggs', grams: 600.0, displayType: 'Normal',
        }],
        servings: 12,
        prepMinutes: 5,
        cookMinutes: 15,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/191512.jpg',
        id: 176229,
      },
      {
        title: 'Pumpkin Dip',
        nutrition: {
          calories: {
            name: 'Calories', amount: 60.86921, unit: 'kcal', displayValue: '61', dailyValue: '61', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 2.511124, unit: 'g', displayValue: '2.5', dailyValue: '2.5', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 7.7, unit: 'mg', displayValue: '8', dailyValue: '8', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 52.99961, unit: 'mg', displayValue: '53', dailyValue: '53', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 9.434918, unit: 'g', displayValue: '9.4', dailyValue: '9.4', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 0.69804, unit: 'g', displayValue: '0.7', dailyValue: '0.7', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 2.896276, unit: 'mcg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 3.912115, unit: 'mg', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.01207413, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 0.1692614, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.00529799, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.3236909, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 12.55285, unit: 'mg', displayValue: '13', dailyValue: '13', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 0.8632401, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 2167.838, unit: 'IU', displayValue: '2168', dailyValue: '2168', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 8.214364, unit: 'g', displayValue: '8.2', dailyValue: '8.2', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 39.2463, unit: 'mg', displayValue: '39', dailyValue: '39', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 1.570809, unit: 'g', displayValue: '1.6', dailyValue: '1.6', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 22.60012, unit: 'kcal', displayValue: '23', dailyValue: '23', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.5279385, unit: 'g', displayValue: '0.5', dailyValue: '0.5', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 16223, displayValue: '1 (8 ounce) package cream cheese, softened', grams: 224.0, displayType: 'Normal',
        },
        {
          ingredientID: 1527, displayValue: "2 cups confectioners' sugar", grams: 250.8, displayType: 'Normal',
        },
        {
          ingredientID: 4808, displayValue: '1 (15 ounce) can solid pack pumpkin', grams: 426.0, displayType: 'Normal',
        },
        {
          ingredientID: 16386, displayValue: '1 tablespoon ground cinnamon', grams: 6.9, displayType: 'Normal',
        },
        {
          ingredientID: 16411, displayValue: '1 tablespoon pumpkin pie spice', grams: 5.6, displayType: 'Normal',
        },
        {
          ingredientID: 5143, displayValue: '1 teaspoon frozen orange juice concentrate', grams: 5.9166665, displayType: 'Normal',
        }],
        servings: 32,
        prepMinutes: 15,
        cookMinutes: 0,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/742503.jpg',
        id: 26498,
      },
      {
        title: 'Tomatillo Salsa Verde',
        nutrition: {
          calories: {
            name: 'Calories', amount: 24.258, unit: 'kcal', displayValue: '24', dailyValue: '24', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 0.6423718, unit: 'g', displayValue: '0.6', dailyValue: '0.6', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 0.0, unit: 'mg', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 439.4999, unit: 'mg', displayValue: '439', dailyValue: '439', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 4.614221, unit: 'g', displayValue: '4.6', dailyValue: '4.6', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 0.7504625, unit: 'g', displayValue: '0.8', dailyValue: '0.8', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 6.602625, unit: 'mcg', displayValue: '7', dailyValue: '7', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 14.31875, unit: 'mg', displayValue: '14', dailyValue: '14', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.054135, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 1.118417, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.03174781, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.4898344, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 13.16937, unit: 'mg', displayValue: '13', dailyValue: '13', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 8.406281, unit: 'mg', displayValue: '8', dailyValue: '8', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 132.3733, unit: 'IU', displayValue: '132', dailyValue: '132', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 2.712046, unit: 'g', displayValue: '2.7', dailyValue: '2.7', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 180.3251, unit: 'mg', displayValue: '180', dailyValue: '180', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 0.08614819, unit: 'g', displayValue: '0.1', dailyValue: '0.1', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 5.781346, unit: 'kcal', displayValue: '6', dailyValue: '6', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 1.322259, unit: 'g', displayValue: '1.3', dailyValue: '1.3', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 3701, displayValue: '1 pound tomatillos, husked', grams: 454.0, displayType: 'Normal',
        },
        {
          ingredientID: 4397, displayValue: '1/2 cup finely chopped onion', grams: 83.6, displayType: 'Normal',
        },
        {
          ingredientID: 4342, displayValue: '1 teaspoon minced garlic', grams: 2.8, displayType: 'Normal',
        },
        {
          ingredientID: 3723, displayValue: '1 serrano chile peppers, minced', grams: 6.1, displayType: 'Normal',
        },
        {
          ingredientID: 3717, displayValue: '2 tablespoons chopped cilantro', grams: 5.75, displayType: 'Normal',
        },
        {
          ingredientID: 18766, displayValue: '1 tablespoon chopped fresh oregano', grams: 6.0, displayType: 'Normal',
        },
        {
          ingredientID: 20551, displayValue: '1/2 teaspoon ground cumin', grams: 1.05, displayType: 'Normal',
        },
        {
          ingredientID: 16421, displayValue: '1 1/2 teaspoons salt, or to taste', grams: 9.0, displayType: 'Normal',
        },
        {
          ingredientID: 2496, displayValue: '2 cups water', grams: 474.0, displayType: 'Normal',
        }],
        servings: 8,
        prepMinutes: 10,
        cookMinutes: 15,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/818535.jpg',
        id: 94028,
      },
      {
        title: 'Slow Cooker Reuben Dip',
        nutrition: {
          calories: {
            name: 'Calories', amount: 297.8058, unit: 'kcal', displayValue: '298', dailyValue: '298', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 22.85395, unit: 'g', displayValue: '22.9', dailyValue: '22.9', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 76.20084, unit: 'mg', displayValue: '76', dailyValue: '76', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 636.4367, unit: 'mg', displayValue: '636', dailyValue: '636', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 5.54325, unit: 'g', displayValue: '5.5', dailyValue: '5.5', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 17.89932, unit: 'g', displayValue: '17.9', dailyValue: '17.9', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 15.67167, unit: 'mcg', displayValue: '16', dailyValue: '16', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 24.175, unit: 'mg', displayValue: '24', dailyValue: '24', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.1166267, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 3.958647, unit: 'mg', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.02389833, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 1.26015, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 350.2567, unit: 'mg', displayValue: '350', dailyValue: '350', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 5.5615, unit: 'mg', displayValue: '6', dailyValue: '6', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 595.5967, unit: 'IU', displayValue: '596', dailyValue: '596', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 2.252508, unit: 'g', displayValue: '2.3', dailyValue: '2.3', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 143.91, unit: 'mg', displayValue: '144', dailyValue: '144', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 12.88198, unit: 'g', displayValue: '12.9', dailyValue: '12.9', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 205.6855, unit: 'kcal', displayValue: '206', dailyValue: '206', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 1.003392, unit: 'g', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 4504, displayValue: '1 (16 ounce) jar sauerkraut, drained', grams: 454.0, displayType: 'Normal',
        },
        {
          ingredientID: 16223, displayValue: '1 (8 ounce) package cream cheese, softened', grams: 224.0, displayType: 'Normal',
        },
        {
          ingredientID: 16246, displayValue: '2 cups shredded Swiss cheese', grams: 488.0, displayType: 'Normal',
        },
        {
          ingredientID: 3140, displayValue: '2 cups shredded cooked corned beef', grams: 230.0, displayType: 'Normal',
        },
        {
          ingredientID: 9764, displayValue: '1/4 cup thousand island dressing', grams: 63.75, displayType: 'Normal',
        }],
        servings: 12,
        prepMinutes: 4,
        cookMinutes: 45,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/2212506.jpg',
        id: 89707,
      },
      {
        title: 'Special Deviled Eggs',
        nutrition: {
          calories: {
            name: 'Calories', amount: 151.3217, unit: 'kcal', displayValue: '151', dailyValue: '151', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 12.4063, unit: 'g', displayValue: '12.4', dailyValue: '12.4', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 189.4833, unit: 'mg', displayValue: '189', dailyValue: '189', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 220.0417, unit: 'mg', displayValue: '220', dailyValue: '220', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 4.034718, unit: 'g', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 6.578715, unit: 'g', displayValue: '6.6', dailyValue: '6.6', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 26.27155, unit: 'mcg', displayValue: '26', dailyValue: '26', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 8.734178, unit: 'mg', displayValue: '9', dailyValue: '9', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.1329606, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 1.476594, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.03391057, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 1.05672, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 31.02379, unit: 'mg', displayValue: '31', dailyValue: '31', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 0.9827129, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 362.4579, unit: 'IU', displayValue: '362', dailyValue: '362', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 3.031933, unit: 'g', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 84.53792, unit: 'mg', displayValue: '85', dailyValue: '85', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 2.653031, unit: 'g', displayValue: '2.7', dailyValue: '2.7', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 111.6567, unit: 'kcal', displayValue: '112', dailyValue: '112', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.3064684, unit: 'g', displayValue: '0.3', dailyValue: '0.3', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 16317, displayValue: '6 eggs', grams: 300.0, displayType: 'Normal',
        },
        {
          ingredientID: 6294, displayValue: '1/4 cup mayonnaise', grams: 55.0, displayType: 'Normal',
        },
        {
          ingredientID: 4397, displayValue: '2 tablespoons finely chopped onion', grams: 20.0, displayType: 'Normal',
        },
        {
          ingredientID: 3692, displayValue: '3 tablespoons sweet pickle relish', grams: 45.0, displayType: 'Normal',
        },
        {
          ingredientID: 16428, displayValue: '1 tablespoon prepared horseradish', grams: 15.0, displayType: 'Normal',
        },
        {
          ingredientID: 16420, displayValue: '1 tablespoon prepared mustard', grams: 15.418502, displayType: 'Normal',
        },
        {
          ingredientID: 16404, displayValue: 'paprika, for garnish', grams: 0.0, displayType: 'HideAmounts',
        },
        {
          ingredientID: 16421, displayValue: 'salt and pepper to taste', grams: 0.0, displayType: 'HideAmounts',
        }],
        servings: 6,
        prepMinutes: 10,
        cookMinutes: 12,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/4526971.jpg',
        id: 22390,
      },
      {
        title: 'Baba Ghanoush',
        nutrition: {
          calories: {
            name: 'Calories', amount: 65.99042, unit: 'kcal', displayValue: '66', dailyValue: '66', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 5.187417, unit: 'g', displayValue: '5.2', dailyValue: '5.2', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 0.0, unit: 'mg', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 6.95, unit: 'mg', displayValue: '7', dailyValue: '7', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 4.609413, unit: 'g', displayValue: '4.6', dailyValue: '4.6', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 1.621217, unit: 'g', displayValue: '1.6', dailyValue: '1.6', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 17.03667, unit: 'mcg', displayValue: '17', dailyValue: '17', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 16.79875, unit: 'mg', displayValue: '17', dailyValue: '17', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.06636542, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 1.073653, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.09862833, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.7910959, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 41.13521, unit: 'mg', displayValue: '41', dailyValue: '41', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 3.499, unit: 'mg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 16.84875, unit: 'IU', displayValue: '17', dailyValue: '17', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 1.219631, unit: 'g', displayValue: '1.2', dailyValue: '1.2', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 140.906, unit: 'mg', displayValue: '141', dailyValue: '141', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 0.7266496, unit: 'g', displayValue: '0.7', dailyValue: '0.7', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 46.68675, unit: 'kcal', displayValue: '47', dailyValue: '47', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 2.208124, unit: 'g', displayValue: '2.2', dailyValue: '2.2', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 4339, displayValue: '1 eggplant', grams: 548.0, displayType: 'Normal',
        },
        {
          ingredientID: 5107, displayValue: '1/4 cup lemon juice', grams: 61.0, displayType: 'Normal',
        },
        {
          ingredientID: 3823, displayValue: '1/4 cup tahini', grams: 59.5, displayType: 'Normal',
        },
        {
          ingredientID: 3752, displayValue: '2 tablespoons sesame seeds', grams: 18.0, displayType: 'Normal',
        },
        {
          ingredientID: 4342, displayValue: '2 cloves garlic, minced', grams: 6.0, displayType: 'Normal',
        },
        {
          ingredientID: 16421, displayValue: 'salt and pepper to taste', grams: 0.0, displayType: 'HideAmounts',
        },
        {
          ingredientID: 6307, displayValue: '1 1/2 tablespoons olive oil', grams: 20.25, displayType: 'Normal',
        }],
        servings: 12,
        prepMinutes: 5,
        cookMinutes: 40,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/874781.jpg',
        id: 14859,
      },
      {
        title: 'Pico De Gallo',
        nutrition: {
          calories: {
            name: 'Calories', amount: 20.96716, unit: 'kcal', displayValue: '21', dailyValue: '21', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 0.1430022, unit: 'g', displayValue: '0.1', dailyValue: '0.1', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 0.0, unit: 'mg', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 76.34537, unit: 'mg', displayValue: '76', dailyValue: '76', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 4.715921, unit: 'g', displayValue: '4.7', dailyValue: '4.7', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 0.828971, unit: 'g', displayValue: '0.8', dailyValue: '0.8', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 12.7485, unit: 'mcg', displayValue: '13', dailyValue: '13', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 8.145496, unit: 'mg', displayValue: '8', dailyValue: '8', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.08354238, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 0.435804, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.03675144, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.2680029, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 13.44695, unit: 'mg', displayValue: '13', dailyValue: '13', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 7.229257, unit: 'mg', displayValue: '7', dailyValue: '7', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 392.6137, unit: 'IU', displayValue: '393', dailyValue: '393', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 2.349554, unit: 'g', displayValue: '2.3', dailyValue: '2.3', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 143.8151, unit: 'mg', displayValue: '144', dailyValue: '144', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 0.02070669, unit: 'g', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 1.28702, unit: 'kcal', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.984434, unit: 'g', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 4572, displayValue: '1 medium tomato, diced', grams: 123.0, displayType: 'Normal',
        },
        {
          ingredientID: 4397, displayValue: '1 onion, finely chopped', grams: 110.0, displayType: 'Normal',
        },
        {
          ingredientID: 3725, displayValue: '1/2 fresh jalapeno pepper, seeded and chopped', grams: 7.0, displayType: 'Normal',
        },
        {
          ingredientID: 3717, displayValue: '2 sprigs fresh cilantro, finely chopped', grams: 5.0, displayType: 'Normal',
        },
        {
          ingredientID: 4405, displayValue: '1 green onion, finely chopped', grams: 15.0, displayType: 'Normal',
        },
        {
          ingredientID: 16396, displayValue: '1/2 teaspoon garlic powder', grams: 1.3883333, displayType: 'Normal',
        },
        {
          ingredientID: 16421, displayValue: '1/8 teaspoon salt', grams: 0.75, displayType: 'Normal',
        },
        {
          ingredientID: 16406, displayValue: '1/8 teaspoon pepper', grams: 0.2625, displayType: 'Normal',
        }],
        servings: 4,
        prepMinutes: 20,
        cookMinutes: 0,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/377426.jpg',
        id: 35304,
      },
      {
        title: 'Garlic Bread Fantastique',
        nutrition: {
          calories: {
            name: 'Calories', amount: 398.8235, unit: 'kcal', displayValue: '399', dailyValue: '399', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 20.92495, unit: 'g', displayValue: '20.9', dailyValue: '20.9', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 43.88551, unit: 'mg', displayValue: '44', dailyValue: '44', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 846.6049, unit: 'mg', displayValue: '847', dailyValue: '847', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 43.87982, unit: 'g', displayValue: '43.9', dailyValue: '43.9', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 9.906686, unit: 'g', displayValue: '9.9', dailyValue: '9.9', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 114.4632, unit: 'mcg', displayValue: '114', dailyValue: '114', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 24.43867, unit: 'mg', displayValue: '24', dailyValue: '24', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.1291157, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 5.379156, unit: 'mg', displayValue: '5', dailyValue: '5', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.4002782, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 3.081459, unit: 'mg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 68.60025, unit: 'mg', displayValue: '69', dailyValue: '69', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 0.915529, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 529.8683, unit: 'IU', displayValue: '530', dailyValue: '530', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 2.049667, unit: 'g', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 120.944, unit: 'mg', displayValue: '121', dailyValue: '121', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 10.94664, unit: 'g', displayValue: '10.9', dailyValue: '10.9', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 188.3246, unit: 'kcal', displayValue: '188', dailyValue: '188', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 2.119629, unit: 'g', displayValue: '2.1', dailyValue: '2.1', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 16157, displayValue: '1/2 cup butter, softened', grams: 113.5, displayType: 'Normal',
        },
        {
          ingredientID: 6294, displayValue: '2 tablespoons mayonnaise', grams: 27.6, displayType: 'Normal',
        },
        {
          ingredientID: 16414, displayValue: '1/4 teaspoon sage', grams: 0.175, displayType: 'Normal',
        },
        {
          ingredientID: 4342, displayValue: '3 cloves garlic, chopped', grams: 9.0, displayType: 'Normal',
        },
        {
          ingredientID: 16403, displayValue: '2 teaspoons dried oregano', grams: 3.0, displayType: 'Normal',
        },
        {
          ingredientID: 16421, displayValue: '1/2 teaspoon salt', grams: 3.0, displayType: 'Normal',
        },
        {
          ingredientID: 16406, displayValue: '1/2 teaspoon black pepper', grams: 1.05, displayType: 'Normal',
        },
        {
          ingredientID: 20414, displayValue: '1 French baguette, halved lengthwise', grams: 454.0, displayType: 'Normal',
        },
        {
          ingredientID: 16238, displayValue: '2 tablespoons grated Parmesan cheese, or to taste', grams: 10.0, displayType: 'Normal',
        }],
        servings: 6,
        prepMinutes: 10,
        cookMinutes: 5,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/622264.jpg',
        id: 27055,
      },
      {
        title: 'Baked Tortilla Chips',
        nutrition: {
          calories: {
            name: 'Calories', amount: 147.3266, unit: 'kcal', displayValue: '147', dailyValue: '147', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 4.086613, unit: 'g', displayValue: '4.1', dailyValue: '4.1', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 0.0, unit: 'mg', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 417.9783, unit: 'mg', displayValue: '418', dailyValue: '418', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 26.04171, unit: 'g', displayValue: '26', dailyValue: '26', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 3.340719, unit: 'g', displayValue: '3.3', dailyValue: '3.3', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 4.044998, unit: 'mcg', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 42.97612, unit: 'mg', displayValue: '43', dailyValue: '43', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.1432776, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 1.288986, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.06799546, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.9941567, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 51.16142, unit: 'mg', displayValue: '51', dailyValue: '51', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 2.61604, unit: 'mg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 140.2388, unit: 'IU', displayValue: '140', dailyValue: '140', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.6623195, unit: 'g', displayValue: '0.7', dailyValue: '0.7', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 127.9467, unit: 'mg', displayValue: '128', dailyValue: '128', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 0.4445476, unit: 'g', displayValue: '0.4', dailyValue: '0.4', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 36.77951, unit: 'kcal', displayValue: '37', dailyValue: '37', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 3.746407, unit: 'g', displayValue: '3.7', dailyValue: '3.7', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 2351, displayValue: '1 (12 ounce) package corn tortillas', grams: 336.0, displayType: 'Normal',
        },
        {
          ingredientID: 6420, displayValue: '1 tablespoon vegetable oil', grams: 14.0, displayType: 'Normal',
        },
        {
          ingredientID: 5112, displayValue: '3 tablespoons lime juice', grams: 46.125, displayType: 'Normal',
        },
        {
          ingredientID: 20551, displayValue: '1 teaspoon ground cumin', grams: 2.1, displayType: 'Normal',
        },
        {
          ingredientID: 16385, displayValue: '1 teaspoon chili powder', grams: 2.6474888, displayType: 'Normal',
        },
        {
          ingredientID: 16421, displayValue: '1 teaspoon salt', grams: 6.0, displayType: 'Normal',
        }],
        servings: 6,
        prepMinutes: 10,
        cookMinutes: 15,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/176568.jpg',
        id: 20482,
      },
      {
        title: 'Great Garlic Bread',
        nutrition: {
          calories: {
            name: 'Calories', amount: 332.2972, unit: 'kcal', displayValue: '332', dailyValue: '332', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 17.97083, unit: 'g', displayValue: '18', dailyValue: '18', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 48.42313, unit: 'mg', displayValue: '48', dailyValue: '48', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 587.6439, unit: 'mg', displayValue: '588', dailyValue: '588', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 30.38365, unit: 'g', displayValue: '30.4', dailyValue: '30.4', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 12.20837, unit: 'g', displayValue: '12.2', dailyValue: '12.2', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 111.6791, unit: 'mcg', displayValue: '112', dailyValue: '112', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 23.38063, unit: 'mg', displayValue: '23', dailyValue: '23', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.09490906, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 5.046668, unit: 'mg', displayValue: '5', dailyValue: '5', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.2817512, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 1.944243, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 270.4057, unit: 'mg', displayValue: '270', dailyValue: '270', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 0.4910833, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 506.7509, unit: 'IU', displayValue: '507', dailyValue: '507', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 1.187984, unit: 'g', displayValue: '1.2', dailyValue: '1.2', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 113.0941, unit: 'mg', displayValue: '113', dailyValue: '113', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 10.60727, unit: 'g', displayValue: '10.6', dailyValue: '10.6', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 161.7374, unit: 'kcal', displayValue: '162', dailyValue: '162', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 1.73919, unit: 'g', displayValue: '1.7', dailyValue: '1.7', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 16157, displayValue: '1/2 cup butter', grams: 113.5, displayType: 'Normal',
        },
        {
          ingredientID: 16396, displayValue: '1 1/2 tablespoons garlic powder', grams: 12.495, displayType: 'Normal',
        },
        {
          ingredientID: 16405, displayValue: '1 tablespoon dried parsley', grams: 1.3766941, displayType: 'Normal',
        },
        {
          ingredientID: 2077, displayValue: '1 (1 pound) loaf Italian bread, cut into 1/2 inch slices', grams: 454.0, displayType: 'Normal',
        },
        {
          ingredientID: 16234, displayValue: '1 (8 ounce) package shredded mozzarella cheese', grams: 224.0, displayType: 'Normal',
        }],
        servings: 8,
        prepMinutes: 10,
        cookMinutes: 15,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/403388.jpg',
        id: 21080,
      },
      {
        title: 'Roasted Chickpeas',
        nutrition: {
          calories: {
            name: 'Calories', amount: 161.3415, unit: 'kcal', displayValue: '161', dailyValue: '161', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 7.7302, unit: 'g', displayValue: '7.7', dailyValue: '7.7', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 0.0, unit: 'mg', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 337.268, unit: 'mg', displayValue: '337', dailyValue: '337', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 19.31928, unit: 'g', displayValue: '19.3', dailyValue: '19.3', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 4.229704, unit: 'g', displayValue: '4.2', dailyValue: '4.2', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 57.15932, unit: 'mcg', displayValue: '57', dailyValue: '57', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 24.8755, unit: 'mg', displayValue: '25', dailyValue: '25', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.411821, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 0.8037866, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.024872, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 1.19315, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 27.531, unit: 'mg', displayValue: '28', dailyValue: '28', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 3.275845, unit: 'mg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 41.253, unit: 'IU', displayValue: '41', dailyValue: '41', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.00517, unit: 'g', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 148.0485, unit: 'mg', displayValue: '148', dailyValue: '148', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 1.034304, unit: 'g', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 69.5718, unit: 'kcal', displayValue: '70', dailyValue: '70', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 3.763115, unit: 'g', displayValue: '3.8', dailyValue: '3.8', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 2819, displayValue: '1 (12 ounce) can chickpeas (garbanzo beans), drained', grams: 340.8, displayType: 'Normal',
        },
        {
          ingredientID: 6307, displayValue: '2 tablespoons olive oil', grams: 27.0, displayType: 'Normal',
        },
        {
          ingredientID: 16421, displayValue: 'salt (optional)', grams: 1.0, displayType: 'OptionalHideAmounts',
        },
        {
          ingredientID: 18740, displayValue: 'garlic salt (optional)', grams: 1.0, displayType: 'OptionalHideAmounts',
        },
        {
          ingredientID: 16407, displayValue: 'cayenne pepper (optional)', grams: 0.2, displayType: 'OptionalHideAmounts',
        }],
        servings: 4,
        prepMinutes: 5,
        cookMinutes: 40,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/170143.jpg',
        id: 81548,
      },
      {
        title: 'The Best Fresh Tomato Salsa',
        nutrition: {
          calories: {
            name: 'Calories', amount: 4.957659, unit: 'kcal', displayValue: '5', dailyValue: '5', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 0.04431007, unit: 'g', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 0.0, unit: 'mg', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 25.10333, unit: 'mg', displayValue: '25', dailyValue: '25', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 1.121634, unit: 'g', displayValue: '1.1', dailyValue: '1.1', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 0.2003757, unit: 'g', displayValue: '0.2', dailyValue: '0.2', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 3.358997, unit: 'mcg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 2.410165, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.02191899, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 0.1292911, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.01176365, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.08372404, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 3.176824, unit: 'mg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 3.924873, unit: 'mg', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 141.2105, unit: 'IU', displayValue: '141', dailyValue: '141', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.5996984, unit: 'g', displayValue: '0.6', dailyValue: '0.6', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 44.98053, unit: 'mg', displayValue: '45', dailyValue: '45', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 0.007500696, unit: 'g', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 0.3987907, unit: 'kcal', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.2907915, unit: 'g', displayValue: '0.3', dailyValue: '0.3', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 4572, displayValue: '3 cups chopped tomatoes', grams: 540.0, displayType: 'Normal',
        },
        {
          ingredientID: 4432, displayValue: '1/2 cup chopped green bell pepper', grams: 74.5, displayType: 'Normal',
        },
        {
          ingredientID: 4397, displayValue: '1 cup onion, diced', grams: 167.2, displayType: 'Normal',
        },
        {
          ingredientID: 3717, displayValue: '1/4 cup minced fresh cilantro', grams: 11.5, displayType: 'Normal',
        },
        {
          ingredientID: 5112, displayValue: '2 tablespoons fresh lime juice', grams: 30.75, displayType: 'Normal',
        },
        {
          ingredientID: 3725, displayValue: '4 teaspoons chopped fresh jalapeno pepper (including seeds)', grams: 7.9295154, displayType: 'Normal',
        },
        {
          ingredientID: 20551, displayValue: '1/2 teaspoon ground cumin', grams: 1.05, displayType: 'Normal',
        },
        {
          ingredientID: 18866, displayValue: '1/2 teaspoon kosher salt', grams: 2.4, displayType: 'Normal',
        },
        {
          ingredientID: 16406, displayValue: '1/2 teaspoon ground black pepper', grams: 1.05, displayType: 'Normal',
        }],
        servings: 40,
        prepMinutes: 20,
        cookMinutes: 0,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/431683.jpg',
        id: 214893,
      },
      {
        title: 'Jalapeno Poppers I',
        nutrition: {
          calories: {
            name: 'Calories', amount: 186.6128, unit: 'kcal', displayValue: '187', dailyValue: '187', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 13.82661, unit: 'g', displayValue: '13.8', dailyValue: '13.8', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 58.34067, unit: 'mg', displayValue: '58', dailyValue: '58', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 235.4471, unit: 'mg', displayValue: '235', dailyValue: '235', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 9.822029, unit: 'g', displayValue: '9.8', dailyValue: '9.8', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 6.489975, unit: 'g', displayValue: '6.5', dailyValue: '6.5', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 42.88475, unit: 'mcg', displayValue: '43', dailyValue: '43', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 8.629916, unit: 'mg', displayValue: '9', dailyValue: '9', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.2617392, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 2.729249, unit: 'mg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.03106225, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 3.058966, unit: 'mg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 125.4007, unit: 'mg', displayValue: '125', dailyValue: '125', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 7.903017, unit: 'mg', displayValue: '8', dailyValue: '8', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 647.8554, unit: 'IU', displayValue: '648', dailyValue: '648', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 1.528787, unit: 'g', displayValue: '1.5', dailyValue: '1.5', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 72.64117, unit: 'mg', displayValue: '73', dailyValue: '73', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 7.087447, unit: 'g', displayValue: '7.1', dailyValue: '7.1', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 124.4395, unit: 'kcal', displayValue: '124', dailyValue: '124', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.4402902, unit: 'g', displayValue: '0.4', dailyValue: '0.4', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 16223, displayValue: '1 (8 ounce) package cream cheese, softened', grams: 224.0, displayType: 'Normal',
        },
        {
          ingredientID: 16215, displayValue: '1 (8 ounce) package shredded sharp Cheddar cheese', grams: 224.0, displayType: 'Normal',
        },
        {
          ingredientID: 6294, displayValue: '1/4 cup mayonnaise', grams: 55.0, displayType: 'Normal',
        },
        {
          ingredientID: 3725, displayValue: '15 fresh jalapeno peppers, halved lengthwise and seeded', grams: 210.0, displayType: 'Normal',
        },
        {
          ingredientID: 16317, displayValue: '2 eggs, beaten', grams: 100.0, displayType: 'Normal',
        },
        {
          ingredientID: 16278, displayValue: '1/2 tablespoon milk', grams: 7.625, displayType: 'Normal',
        },
        {
          ingredientID: 16642, displayValue: '1 1/2 cups crushed corn flake cereal', grams: 140.25, displayType: 'Normal',
        }],
        servings: 15,
        prepMinutes: 30,
        cookMinutes: 30,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/430715.jpg',
        id: 26835,
      },
      {
        title: "Veronica's Hot Spinach, Artichoke and Chile Dip",
        nutrition: {
          calories: {
            name: 'Calories', amount: 314.154, unit: 'kcal', displayValue: '314', dailyValue: '314', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 28.8001, unit: 'g', displayValue: '28.8', dailyValue: '28.8', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 60.5, unit: 'mg', displayValue: '60', dailyValue: '60', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 681.882, unit: 'mg', displayValue: '682', dailyValue: '682', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 7.77368, unit: 'g', displayValue: '7.8', dailyValue: '7.8', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 9.035601, unit: 'g', displayValue: '9', dailyValue: '9', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 50.11, unit: 'mcg', displayValue: '50', dailyValue: '50', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 29.44, unit: 'mg', displayValue: '29', dailyValue: '29', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.163338, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 1.933468, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.039094, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 1.29848, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 163.644, unit: 'mg', displayValue: '164', dailyValue: '164', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 18.406, unit: 'mg', displayValue: '18', dailyValue: '18', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 4149.44, unit: 'IU', displayValue: '4149', dailyValue: '4149', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.93712, unit: 'g', displayValue: '0.9', dailyValue: '0.9', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 193.394, unit: 'mg', displayValue: '193', dailyValue: '193', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 12.54842, unit: 'g', displayValue: '12.5', dailyValue: '12.5', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 259.2009, unit: 'kcal', displayValue: '259', dailyValue: '259', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 2.3784, unit: 'g', displayValue: '2.4', dailyValue: '2.4', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 16223, displayValue: '2 (8 ounce) packages cream cheese, softened', grams: 448.0, displayType: 'Normal',
        },
        {
          ingredientID: 6294, displayValue: '1/2 cup mayonnaise', grams: 110.0, displayType: 'Normal',
        },
        {
          ingredientID: 4431, displayValue: '1 (4.5 ounce) can chopped green chiles, drained', grams: 128.0, displayType: 'Normal',
        },
        {
          ingredientID: 16238, displayValue: '1 cup freshly grated Parmesan cheese', grams: 80.0, displayType: 'Normal',
        },
        {
          ingredientID: 10896, displayValue: '1 (12 ounce) jar marinated artichoke hearts, drained and chopped', grams: 364.0, displayType: 'Normal',
        },
        {
          ingredientID: 4634, displayValue: '1/4 cup canned chopped jalapeno peppers, drained', grams: 34.0, displayType: 'Normal',
        },
        {
          ingredientID: 4520, displayValue: '1 (10 ounce) box frozen chopped spinach, thawed and drained', grams: 284.0, displayType: 'Normal',
        }],
        servings: 10,
        prepMinutes: 10,
        cookMinutes: 30,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/1646097.jpg',
        id: 60357,
      },
      {
        title: 'Mango Salsa',
        nutrition: {
          calories: {
            name: 'Calories', amount: 20.9837, unit: 'kcal', displayValue: '21', dailyValue: '21', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 0.1046719, unit: 'g', displayValue: '0.1', dailyValue: '0.1', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 0.0, unit: 'mg', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 1.447561, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 5.432754, unit: 'g', displayValue: '5.4', dailyValue: '5.4', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 0.274598, unit: 'g', displayValue: '0.3', dailyValue: '0.3', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 8.861412, unit: 'mcg', displayValue: '9', dailyValue: '9', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 4.202239, unit: 'mg', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.06174684, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 0.2977341, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.02341775, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.1104049, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 5.589799, unit: 'mg', displayValue: '6', dailyValue: '6', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 16.45363, unit: 'mg', displayValue: '16', dailyValue: '16', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 427.2065, unit: 'IU', displayValue: '427', dailyValue: '427', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 4.233795, unit: 'g', displayValue: '4.2', dailyValue: '4.2', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 69.70157, unit: 'mg', displayValue: '70', dailyValue: '70', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 0.02042781, unit: 'g', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 0.9420469, unit: 'kcal', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.6972969, unit: 'g', displayValue: '0.7', dailyValue: '0.7', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 5121, displayValue: '1 mango - peeled, seeded, and chopped', grams: 207.0, displayType: 'Normal',
        },
        {
          ingredientID: 4786, displayValue: '1/4 cup finely chopped red bell pepper', grams: 37.25, displayType: 'Normal',
        },
        {
          ingredientID: 4405, displayValue: '1 green onion, chopped', grams: 15.0, displayType: 'Normal',
        },
        {
          ingredientID: 3717, displayValue: '2 tablespoons chopped cilantro', grams: 5.75, displayType: 'Normal',
        },
        {
          ingredientID: 3725, displayValue: '1 fresh jalapeno chile pepper, finely chopped', grams: 14.0, displayType: 'Normal',
        },
        {
          ingredientID: 5112, displayValue: '2 tablespoons lime juice', grams: 30.75, displayType: 'Normal',
        },
        {
          ingredientID: 5107, displayValue: '1 tablespoon lemon juice', grams: 15.048458, displayType: 'Normal',
        }],
        servings: 8,
        prepMinutes: 15,
        cookMinutes: 0,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/4509377.jpg',
        id: 48032,
      },
      {
        title: 'Sausage Jalapeno Poppers',
        nutrition: {
          calories: {
            name: 'Calories', amount: 188.838, unit: 'kcal', displayValue: '189', dailyValue: '189', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 18.20141, unit: 'g', displayValue: '18.2', dailyValue: '18.2', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 40.147, unit: 'mg', displayValue: '40', dailyValue: '40', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 256.41, unit: 'mg', displayValue: '256', dailyValue: '256', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 1.98736, unit: 'g', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 4.6217, unit: 'g', displayValue: '4.6', dailyValue: '4.6', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 13.238, unit: 'mcg', displayValue: '13', dailyValue: '13', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 8.07, unit: 'mg', displayValue: '8', dailyValue: '8', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.164928, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 1.796257, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.117941, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.52589, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 21.392, unit: 'mg', displayValue: '21', dailyValue: '21', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 9.302999, unit: 'mg', displayValue: '9', dailyValue: '9', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 477.693, unit: 'IU', displayValue: '478', dailyValue: '478', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.7296147, unit: 'g', displayValue: '0.7', dailyValue: '0.7', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 119.211, unit: 'mg', displayValue: '119', dailyValue: '119', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 8.349775, unit: 'g', displayValue: '8.3', dailyValue: '8.3', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 163.8127, unit: 'kcal', displayValue: '164', dailyValue: '164', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.5541853, unit: 'g', displayValue: '0.6', dailyValue: '0.6', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 5863, displayValue: '2 (12 ounce) packages ground sausage', grams: 2.0, displayType: 'Normal',
        },
        {
          ingredientID: 16223, displayValue: '2 (8 ounce) packages cream cheese, softened', grams: 448.0, displayType: 'Normal',
        },
        {
          ingredientID: 3725, displayValue: '30 jalapeno chile peppers', grams: 420.0, displayType: 'Normal',
        },
        {
          ingredientID: 5375, displayValue: '1 pound sliced bacon, cut in half', grams: 454.0, displayType: 'Normal',
        }],
        servings: 20,
        prepMinutes: 60,
        cookMinutes: 20,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/2604212.jpg',
        id: 25539,
      },
      {
        title: 'Reuben Dip',
        nutrition: {
          calories: {
            name: 'Calories', amount: 392.7971, unit: 'kcal', displayValue: '393', dailyValue: '393', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 31.72626, unit: 'g', displayValue: '31.7', dailyValue: '31.7', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 76.57143, unit: 'mg', displayValue: '77', dailyValue: '77', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 830.1716, unit: 'mg', displayValue: '830', dailyValue: '830', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 7.261565, unit: 'g', displayValue: '7.3', dailyValue: '7.3', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 20.87145, unit: 'g', displayValue: '20.9', dailyValue: '20.9', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 15.58178, unit: 'mcg', displayValue: '16', dailyValue: '16', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 26.85645, unit: 'mg', displayValue: '27', dailyValue: '27', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.1770653, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 3.186491, unit: 'mg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.02334689, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 1.65541, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 416.814, unit: 'mg', displayValue: '417', dailyValue: '417', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 7.317333, unit: 'mg', displayValue: '7', dailyValue: '7', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 490.8078, unit: 'IU', displayValue: '491', dailyValue: '491', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 3.539134, unit: 'g', displayValue: '3.5', dailyValue: '3.5', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 139.758, unit: 'mg', displayValue: '140', dailyValue: '140', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 12.45425, unit: 'g', displayValue: '12.5', dailyValue: '12.5', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 285.5363, unit: 'kcal', displayValue: '286', dailyValue: '286', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 1.421969, unit: 'g', displayValue: '1.4', dailyValue: '1.4', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 6294, displayValue: '1/2 cup mayonnaise', grams: 110.0, displayType: 'Normal',
        },
        {
          ingredientID: 6288, displayValue: '1/2 cup Thousand Island dressing', grams: 125.0, displayType: 'Normal',
        },
        {
          ingredientID: 4504, displayValue: '16 ounces sauerkraut, rinsed and squeezed dry', grams: 448.0, displayType: 'Normal',
        },
        {
          ingredientID: 9396, displayValue: '8 ounces shredded corned beef', grams: 224.0, displayType: 'Normal',
        },
        {
          ingredientID: 16246, displayValue: '16 ounces shredded Swiss cheese', grams: 453.6, displayType: 'Normal',
        }],
        servings: 9,
        prepMinutes: 5,
        cookMinutes: 25,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/198245.jpg',
        id: 14865,
      },
      {
        title: 'Deviled Eggs I',
        nutrition: {
          calories: {
            name: 'Calories', amount: 106.5364, unit: 'kcal', displayValue: '107', dailyValue: '107', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 8.73603, unit: 'g', displayValue: '8.7', dailyValue: '8.7', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 187.748, unit: 'mg', displayValue: '188', dailyValue: '188', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 96.20818, unit: 'mg', displayValue: '96', dailyValue: '96', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 0.7450069, unit: 'g', displayValue: '0.7', dailyValue: '0.7', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 6.437045, unit: 'g', displayValue: '6.4', dailyValue: '6.4', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 24.16792, unit: 'mcg', displayValue: '24', dailyValue: '24', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 7.324739, unit: 'mg', displayValue: '7', dailyValue: '7', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.1070206, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 1.485658, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.03391528, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 1.001006, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 28.77931, unit: 'mg', displayValue: '29', dailyValue: '29', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 0.1444727, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 356.806, unit: 'IU', displayValue: '357', dailyValue: '357', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.4754576, unit: 'g', displayValue: '0.5', dailyValue: '0.5', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 74.12901, unit: 'mg', displayValue: '74', dailyValue: '74', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 2.104744, unit: 'g', displayValue: '2.1', dailyValue: '2.1', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 78.62427, unit: 'kcal', displayValue: '79', dailyValue: '79', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.1168193, unit: 'g', displayValue: '0.1', dailyValue: '0.1', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 16317, displayValue: '6 eggs', grams: 300.0, displayType: 'Normal',
        },
        {
          ingredientID: 16404, displayValue: '1/2 teaspoon paprika', grams: 1.1404166, displayType: 'Normal',
        },
        {
          ingredientID: 6294, displayValue: '2 tablespoons mayonnaise', grams: 27.6, displayType: 'Normal',
        },
        {
          ingredientID: 16400, displayValue: '1/2 teaspoon mustard powder', grams: 1.8666667, displayType: 'Normal',
        }],
        servings: 6,
        prepMinutes: 20,
        cookMinutes: 0,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/210576.jpg',
        id: 15368,
      },
      {
        title: 'Savory Crab Stuffed Mushrooms',
        nutrition: {
          calories: {
            name: 'Calories', amount: 176.4013, unit: 'kcal', displayValue: '176', dailyValue: '176', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 11.78373, unit: 'g', displayValue: '11.8', dailyValue: '11.8', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 64.58469, unit: 'mg', displayValue: '65', dailyValue: '65', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 233.3172, unit: 'mg', displayValue: '233', dailyValue: '233', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 7.321677, unit: 'g', displayValue: '7.3', dailyValue: '7.3', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 9.839208, unit: 'g', displayValue: '9.8', dailyValue: '9.8', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 29.18606, unit: 'mcg', displayValue: '29', dailyValue: '29', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 22.74101, unit: 'mg', displayValue: '23', dailyValue: '23', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.1173255, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 5.118828, unit: 'mg', displayValue: '5', dailyValue: '5', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.1173643, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.9349888, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 111.3456, unit: 'mg', displayValue: '111', dailyValue: '111', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 2.363781, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 369.9853, unit: 'IU', displayValue: '370', dailyValue: '370', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 1.541969, unit: 'g', displayValue: '1.5', dailyValue: '1.5', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 285.4716, unit: 'mg', displayValue: '285', dailyValue: '285', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 6.9058, unit: 'g', displayValue: '6.9', dailyValue: '6.9', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 106.0535, unit: 'kcal', displayValue: '106', dailyValue: '106', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.8939372, unit: 'g', displayValue: '0.9', dailyValue: '0.9', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 16157, displayValue: '3 tablespoons butter, melted', grams: 42.6, displayType: 'Normal',
        },
        {
          ingredientID: 4378, displayValue: '24 fresh mushrooms', grams: 432.0, displayType: 'Normal',
        },
        {
          ingredientID: 16157, displayValue: '2 tablespoons butter', grams: 28.4, displayType: 'Normal',
        },
        {
          ingredientID: 4405, displayValue: '2 tablespoons minced green onions', grams: 12.0, displayType: 'Normal',
        },
        {
          ingredientID: 5107, displayValue: '1 teaspoon lemon juice', grams: 5.3744493, displayType: 'Normal',
        },
        {
          ingredientID: 2740, displayValue: '1 cup diced cooked crabmeat', grams: 135.0, displayType: 'Normal',
        },
        {
          ingredientID: 2112, displayValue: '1/2 cup soft bread crumbs', grams: 54.0, displayType: 'Normal',
        },
        {
          ingredientID: 16317, displayValue: '1 egg, beaten', grams: 50.0, displayType: 'Normal',
        },
        {
          ingredientID: 16393, displayValue: '1/2 teaspoon dried dill weed', grams: 0.5, displayType: 'Normal',
        },
        {
          ingredientID: 16231, displayValue: '3/4 cup shredded Monterey Jack cheese, divided', grams: 84.75, displayType: 'Normal',
        },
        {
          ingredientID: 3474, displayValue: '1/4 cup dry white wine', grams: 62.480736, displayType: 'Normal',
        }],
        servings: 8,
        prepMinutes: 25,
        cookMinutes: 20,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/12457.jpg',
        id: 25497,
      },
      {
        title: 'Crab Rangoon III',
        nutrition: {
          calories: {
            name: 'Calories', amount: 203.1993, unit: 'kcal', displayValue: '203', dailyValue: '203', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 11.74738, unit: 'g', displayValue: '11.7', dailyValue: '11.7', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 38.71466, unit: 'mg', displayValue: '39', dailyValue: '39', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 268.4074, unit: 'mg', displayValue: '268', dailyValue: '268', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 15.75994, unit: 'g', displayValue: '15.8', dailyValue: '15.8', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 8.316082, unit: 'g', displayValue: '8.3', dailyValue: '8.3', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 34.15754, unit: 'mcg', displayValue: '34', dailyValue: '34', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 15.03592, unit: 'mg', displayValue: '15', dailyValue: '15', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.05445739, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 3.472362, unit: 'mg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.1568771, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 1.266477, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 47.03638, unit: 'mg', displayValue: '47', dailyValue: '47', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 0.6616391, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 224.2386, unit: 'IU', displayValue: '224', dailyValue: '224', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.08491786, unit: 'g', displayValue: '0.1', dailyValue: '0.1', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 126.2037, unit: 'mg', displayValue: '126', dailyValue: '126', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 4.151549, unit: 'g', displayValue: '4.2', dailyValue: '4.2', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 105.7264, unit: 'kcal', displayValue: '106', dailyValue: '106', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.5220648, unit: 'g', displayValue: '0.5', dailyValue: '0.5', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 20482, displayValue: '1 quart oil for deep frying', grams: 880.0, displayType: 'Normal',
        },
        {
          ingredientID: 16223, displayValue: '1 (8 ounce) package cream cheese, softened', grams: 224.0, displayType: 'Normal',
        },
        {
          ingredientID: 2656, displayValue: '2 (6 ounce) cans crabmeat, drained and flaked', grams: 336.0, displayType: 'Normal',
        },
        {
          ingredientID: 16396, displayValue: '1/2 teaspoon garlic powder', grams: 1.3883333, displayType: 'Normal',
        },
        {
          ingredientID: 16404, displayValue: '1/4 teaspoon paprika', grams: 0.5702083, displayType: 'Normal',
        },
        {
          ingredientID: 4607, displayValue: '2 tablespoons water chestnuts, drained and chopped', grams: 17.647058, displayType: 'Normal',
        },
        {
          ingredientID: 2355, displayValue: '1 (14 ounce) package wonton wrappers', grams: 392.0, displayType: 'Normal',
        }],
        servings: 15,
        prepMinutes: 25,
        cookMinutes: 20,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/75734.jpg',
        id: 25536,
      },
      {
        title: 'Mini Ham And Cheese Rolls',
        nutrition: {
          calories: {
            name: 'Calories', amount: 145.4158, unit: 'kcal', displayValue: '145', dailyValue: '145', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 9.00659, unit: 'g', displayValue: '9', dailyValue: '9', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 17.5596, unit: 'mg', displayValue: '18', dailyValue: '18', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 276.4501, unit: 'mg', displayValue: '276', dailyValue: '276', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 10.21715, unit: 'g', displayValue: '10.2', dailyValue: '10.2', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 5.653959, unit: 'g', displayValue: '5.7', dailyValue: '5.7', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 17.94378, unit: 'mcg', displayValue: '18', dailyValue: '18', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 8.098158, unit: 'mg', displayValue: '8', dailyValue: '8', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.04941916, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 2.109059, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.06997086, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.6662841, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 87.14, unit: 'mg', displayValue: '87', dailyValue: '87', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 0.2586775, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 243.8647, unit: 'IU', displayValue: '244', dailyValue: '244', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 1.734451, unit: 'g', displayValue: '1.7', dailyValue: '1.7', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 49.80066, unit: 'mg', displayValue: '50', dailyValue: '50', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 3.008771, unit: 'g', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 81.05931, unit: 'kcal', displayValue: '81', dailyValue: '81', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.7975209, unit: 'g', displayValue: '0.8', dailyValue: '0.8', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 4399, displayValue: '2 tablespoons dried minced onion', grams: 7.0, displayType: 'Normal',
        },
        {
          ingredientID: 16420, displayValue: '1 tablespoon prepared mustard', grams: 15.418502, displayType: 'Normal',
        },
        {
          ingredientID: 16409, displayValue: '2 tablespoons poppy seeds', grams: 16.8, displayType: 'Normal',
        },
        {
          ingredientID: 6311, displayValue: '1/2 cup margarine, melted', grams: 111.49105, displayType: 'Normal',
        },
        {
          ingredientID: 18058, displayValue: '24 dinner rolls', grams: 424.0, displayType: 'Normal',
        },
        {
          ingredientID: 5829, displayValue: '1/2 pound chopped ham', grams: 226.8, displayType: 'Normal',
        },
        {
          ingredientID: 16246, displayValue: '1/2 pound thinly sliced Swiss cheese', grams: 224.0, displayType: 'Normal',
        }],
        servings: 24,
        prepMinutes: 15,
        cookMinutes: 20,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/5082723.jpg',
        id: 15018,
      },
      {
        title: 'Grilled Portobello Mushrooms',
        nutrition: {
          calories: {
            name: 'Calories', amount: 217.0933, unit: 'kcal', displayValue: '217', dailyValue: '217', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 18.96067, unit: 'g', displayValue: '19', dailyValue: '19', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 0.0, unit: 'mg', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 12.92, unit: 'mg', displayValue: '13', dailyValue: '13', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 11.0248, unit: 'g', displayValue: '11', dailyValue: '11', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 3.2424, unit: 'g', displayValue: '3.2', dailyValue: '3.2', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 26.66, unit: 'mcg', displayValue: '27', dailyValue: '27', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 14.32, unit: 'mg', displayValue: '14', dailyValue: '14', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.1734, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 5.7256, unit: 'mg', displayValue: '6', dailyValue: '6', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.09844, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.9190001, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 24.62, unit: 'mg', displayValue: '25', dailyValue: '25', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 2.098, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 0.56, unit: 'IU', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 5.426, unit: 'g', displayValue: '5.4', dailyValue: '5.4', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 588.72, unit: 'mg', displayValue: '589', dailyValue: '589', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 1.41168, unit: 'g', displayValue: '1.4', dailyValue: '1.4', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 170.646, unit: 'kcal', displayValue: '171', dailyValue: '171', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 1.934, unit: 'g', displayValue: '1.9', dailyValue: '1.9', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 4381, displayValue: '3 portobello mushrooms', grams: 336.0, displayType: 'Normal',
        },
        {
          ingredientID: 6420, displayValue: '1/4 cup canola oil', grams: 56.0, displayType: 'Normal',
        },
        {
          ingredientID: 4397, displayValue: '3 tablespoons chopped onion', grams: 30.0, displayType: 'Normal',
        },
        {
          ingredientID: 4342, displayValue: '4 cloves garlic, minced', grams: 12.0, displayType: 'Normal',
        },
        {
          ingredientID: 18930, displayValue: '4 tablespoons balsamic vinegar', grams: 60.0, displayType: 'Normal',
        }],
        servings: 3,
        prepMinutes: 10,
        cookMinutes: 10,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/16730.jpg',
        id: 13913,
      },
      {
        title: 'Bacon and Cheddar Stuffed Mushrooms',
        nutrition: {
          calories: {
            name: 'Calories', amount: 109.962, unit: 'kcal', displayValue: '110', dailyValue: '110', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 9.680922, unit: 'g', displayValue: '9.7', dailyValue: '9.7', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 22.07969, unit: 'mg', displayValue: '22', dailyValue: '22', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 170.4706, unit: 'mg', displayValue: '170', dailyValue: '170', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 0.9179531, unit: 'g', displayValue: '0.9', dailyValue: '0.9', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 4.678332, unit: 'g', displayValue: '4.7', dailyValue: '4.7', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 2.407625, unit: 'mcg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 4.38675, unit: 'mg', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.03144262, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 1.10851, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.04211406, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.2682747, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 77.72444, unit: 'mg', displayValue: '78', dailyValue: '78', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 0.0925, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 154.4166, unit: 'IU', displayValue: '154', dailyValue: '154', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.1091525, unit: 'g', displayValue: '0.1', dailyValue: '0.1', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 34.47287, unit: 'mg', displayValue: '34', dailyValue: '34', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 4.721005, unit: 'g', displayValue: '4.7', dailyValue: '4.7', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 87.1283, unit: 'kcal', displayValue: '87', dailyValue: '87', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.4180754, unit: 'g', displayValue: '0.4', dailyValue: '0.4', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 5375, displayValue: '3 slices bacon', grams: 84.0, displayType: 'Normal',
        },
        {
          ingredientID: 10107, displayValue: '8 crimini mushrooms', grams: 144.0, displayType: 'Normal',
        },
        {
          ingredientID: 16157, displayValue: '1 tablespoon butter', grams: 14.2, displayType: 'Normal',
        },
        {
          ingredientID: 4397, displayValue: '1 tablespoon chopped onion', grams: 10.0, displayType: 'Normal',
        },
        {
          ingredientID: 16215, displayValue: '3/4 cup shredded Cheddar cheese', grams: 84.75, displayType: 'Normal',
        }],
        servings: 8,
        prepMinutes: 15,
        cookMinutes: 15,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/1118005.jpg',
        id: 21061,
      },
      {
        title: 'Bacon Wrapped Barbeque Shrimp',
        nutrition: {
          calories: {
            name: 'Calories', amount: 160.3533, unit: 'kcal', displayValue: '160', dailyValue: '160', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 10.47967, unit: 'g', displayValue: '10.5', dailyValue: '10.5', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 83.31667, unit: 'mg', displayValue: '83', dailyValue: '83', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 627.0601, unit: 'mg', displayValue: '627', dailyValue: '627', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 0.3479667, unit: 'g', displayValue: '0.3', dailyValue: '0.3', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 15.07697, unit: 'g', displayValue: '15.1', dailyValue: '15.1', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 1.646667, unit: 'mcg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 17.89, unit: 'mg', displayValue: '18', dailyValue: '18', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.1217533, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 6.134579, unit: 'mg', displayValue: '6', dailyValue: '6', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.1773767, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 1.2465, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 13.98667, unit: 'mg', displayValue: '14', dailyValue: '14', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 0.638, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 74.25333, unit: 'IU', displayValue: '74', dailyValue: '74', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.0, unit: 'g', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 190.2633, unit: 'mg', displayValue: '190', dailyValue: '190', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 3.426967, unit: 'g', displayValue: '3.4', dailyValue: '3.4', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 94.317, unit: 'kcal', displayValue: '94', dailyValue: '94', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.0, unit: 'g', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 2664, displayValue: '16 large shrimp, peeled and deveined', grams: 112.0, displayType: 'Normal',
        },
        {
          ingredientID: 5375, displayValue: '8 slices bacon', grams: 224.0, displayType: 'Normal',
        },
        {
          ingredientID: 20962, displayValue: 'barbeque seasoning, to taste', grams: 0.0, displayType: 'HideAmounts',
        }],
        servings: 3,
        prepMinutes: 20,
        cookMinutes: 15,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/1344901.jpg',
        id: 16647,
      },
      {
        title: 'Microwave Popcorn',
        nutrition: {
          calories: {
            name: 'Calories', amount: 137.0661, unit: 'kcal', displayValue: '137', dailyValue: '137', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 3.119722, unit: 'g', displayValue: '3.1', dailyValue: '3.1', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 0.0, unit: 'mg', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 388.605, unit: 'mg', displayValue: '389', dailyValue: '389', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 24.63417, unit: 'g', displayValue: '24.6', dailyValue: '24.6', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 4.065833, unit: 'g', displayValue: '4.1', dailyValue: '4.1', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 0.0, unit: 'mcg', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 0.01, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.0, unit: 'mg', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 0.0, unit: 'mg', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.0, unit: 'mg', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.8582236, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 3.656667, unit: 'mg', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 0.0, unit: 'mg', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 0.0, unit: 'IU', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.4441667, unit: 'g', displayValue: '0.4', dailyValue: '0.4', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 97.11333, unit: 'mg', displayValue: '97', dailyValue: '97', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 0.3975069, unit: 'g', displayValue: '0.4', dailyValue: '0.4', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 28.0775, unit: 'kcal', displayValue: '28', dailyValue: '28', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 4.851666, unit: 'g', displayValue: '4.9', dailyValue: '4.9', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 6767, displayValue: '1/2 cup unpopped popcorn', grams: 102.5, displayType: 'Normal',
        },
        {
          ingredientID: 6305, displayValue: '1 teaspoon vegetable oil', grams: 4.5416665, displayType: 'Normal',
        },
        {
          ingredientID: 16421, displayValue: '1/2 teaspoon salt, or to taste', grams: 3.0, displayType: 'Normal',
        }],
        servings: 3,
        prepMinutes: 2,
        cookMinutes: 3,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/778755.jpg',
        id: 87305,
      },
      {
        title: 'Pico de Gallo',
        nutrition: {
          calories: {
            name: 'Calories', amount: 9.552813, unit: 'kcal', displayValue: '10', dailyValue: '10', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 0.0999625, unit: 'g', displayValue: '0.1', dailyValue: '0.1', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 0.0, unit: 'mg', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 15.24913, unit: 'mg', displayValue: '15', dailyValue: '15', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 2.178428, unit: 'g', displayValue: '2.2', dailyValue: '2.2', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 0.4106844, unit: 'g', displayValue: '0.4', dailyValue: '0.4', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 6.481459, unit: 'mcg', displayValue: '6', dailyValue: '6', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 4.749708, unit: 'mg', displayValue: '5', dailyValue: '5', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.04143469, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 0.265328, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.02183198, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.1888319, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 6.918313, unit: 'mg', displayValue: '7', dailyValue: '7', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 5.640438, unit: 'mg', displayValue: '6', dailyValue: '6', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 313.9604, unit: 'IU', displayValue: '314', dailyValue: '314', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 1.106713, unit: 'g', displayValue: '1.1', dailyValue: '1.1', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 91.42068, unit: 'mg', displayValue: '91', dailyValue: '91', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 0.01329562, unit: 'g', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 0.8996625, unit: 'kcal', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.5858524, unit: 'g', displayValue: '0.6', dailyValue: '0.6', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 20453, displayValue: '6 roma (plum) tomatoes, diced', grams: 372.0, displayType: 'Normal',
        },
        {
          ingredientID: 20269, displayValue: '1/2 red onion, minced', grams: 55.0, displayType: 'Normal',
        },
        {
          ingredientID: 3717, displayValue: '3 tablespoons chopped fresh cilantro', grams: 8.625, displayType: 'Normal',
        },
        {
          ingredientID: 3725, displayValue: '1/2 jalapeno pepper, seeded and minced', grams: 7.0, displayType: 'Normal',
        },
        {
          ingredientID: 5111, displayValue: '1/2 lime, juiced', grams: 33.5, displayType: 'Normal',
        },
        {
          ingredientID: 4342, displayValue: '1 clove garlic, minced', grams: 3.0, displayType: 'Normal',
        },
        {
          ingredientID: 16396, displayValue: '1 pinch garlic powder', grams: 1.0, displayType: 'Normal',
        },
        {
          ingredientID: 20551, displayValue: '1 pinch ground cumin, or to taste', grams: 1.0, displayType: 'Normal',
        },
        {
          ingredientID: 16421, displayValue: 'salt and ground black pepper to taste', grams: 0.4, displayType: 'HideAmounts',
        }],
        servings: 12,
        prepMinutes: 20,
        cookMinutes: 0,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/282674.jpg',
        id: 203800,
      },
      {
        title: 'Filipino Lumpia',
        nutrition: {
          calories: {
            name: 'Calories', amount: 167.6635, unit: 'kcal', displayValue: '168', dailyValue: '168', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 10.5284, unit: 'g', displayValue: '10.5', dailyValue: '10.5', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 23.232, unit: 'mg', displayValue: '23', dailyValue: '23', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 287.8307, unit: 'mg', displayValue: '288', dailyValue: '288', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 10.99449, unit: 'g', displayValue: '11', dailyValue: '11', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 6.971031, unit: 'g', displayValue: '7', dailyValue: '7', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 20.6311, unit: 'mcg', displayValue: '21', dailyValue: '21', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 11.67756, unit: 'mg', displayValue: '12', dailyValue: '12', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.1503905, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 3.396794, unit: 'mg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.316327, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.9526154, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 19.68089, unit: 'mg', displayValue: '20', dailyValue: '20', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 2.776013, unit: 'mg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 753.8547, unit: 'IU', displayValue: '754', dailyValue: '754', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.667034, unit: 'g', displayValue: '0.7', dailyValue: '0.7', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 142.2225, unit: 'mg', displayValue: '142', dailyValue: '142', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 2.946744, unit: 'g', displayValue: '2.9', dailyValue: '2.9', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 94.75559, unit: 'kcal', displayValue: '95', dailyValue: '95', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.7360994, unit: 'g', displayValue: '0.7', dailyValue: '0.7', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 6305, displayValue: '1 tablespoon vegetable oil', grams: 13.625, displayType: 'Normal',
        },
        {
          ingredientID: 4176, displayValue: '1 pound ground pork', grams: 454.0, displayType: 'Normal',
        },
        {
          ingredientID: 4342, displayValue: '2 cloves garlic, crushed', grams: 6.0, displayType: 'Normal',
        },
        {
          ingredientID: 4397, displayValue: '1/2 cup chopped onion', grams: 83.6, displayType: 'Normal',
        },
        {
          ingredientID: 4279, displayValue: '1/2 cup minced carrots', grams: 64.0, displayType: 'Normal',
        },
        {
          ingredientID: 4405, displayValue: '1/2 cup chopped green onions', grams: 50.0, displayType: 'Normal',
        },
        {
          ingredientID: 4267, displayValue: '1/2 cup thinly sliced green cabbage', grams: 44.5, displayType: 'Normal',
        },
        {
          ingredientID: 16406, displayValue: '1 teaspoon ground black pepper', grams: 2.1, displayType: 'Normal',
        },
        {
          ingredientID: 16421, displayValue: '1 teaspoon salt', grams: 6.0, displayType: 'Normal',
        },
        {
          ingredientID: 16396, displayValue: '1 teaspoon garlic powder', grams: 2.7766666, displayType: 'Normal',
        },
        {
          ingredientID: 2882, displayValue: '1 teaspoon soy sauce', grams: 5.3, displayType: 'Normal',
        },
        {
          ingredientID: 22077, displayValue: '30 lumpia wrappers', grams: 240.0, displayType: 'Normal',
        },
        {
          ingredientID: 20482, displayValue: '2 cups vegetable oil for frying', grams: 440.0, displayType: 'Normal',
        }],
        servings: 15,
        prepMinutes: 45,
        cookMinutes: 25,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/397715.jpg',
        id: 35151,
      },
      {
        title: "Carla's Fruit Dip",
        nutrition: {
          calories: {
            name: 'Calories', amount: 164.009, unit: 'kcal', displayValue: '164', dailyValue: '164', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 8.69219, unit: 'g', displayValue: '8.7', dailyValue: '8.7', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 9.35, unit: 'mg', displayValue: '9', dailyValue: '9', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 46.44, unit: 'mg', displayValue: '46', dailyValue: '46', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 20.8733, unit: 'g', displayValue: '20.9', dailyValue: '20.9', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 1.07855, unit: 'g', displayValue: '1.1', dailyValue: '1.1', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 1.301, unit: 'mcg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 1.35, unit: 'mg', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.004387, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 0.1712199, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.001641, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.172, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 8.732, unit: 'mg', displayValue: '9', dailyValue: '9', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 0.0, unit: 'mg', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 146.638, unit: 'IU', displayValue: '147', dailyValue: '147', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 14.353, unit: 'g', displayValue: '14.4', dailyValue: '14.4', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 15.127, unit: 'mg', displayValue: '15', dailyValue: '15', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 6.757478, unit: 'g', displayValue: '6.8', dailyValue: '6.8', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 78.22971, unit: 'kcal', displayValue: '78', dailyValue: '78', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.0196, unit: 'g', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 16272, displayValue: '1 (8 ounce) container frozen whipped topping, thawed', grams: 224.0, displayType: 'Normal',
        },
        {
          ingredientID: 1542, displayValue: '1 (7 ounce) jar marshmallow creme', grams: 196.0, displayType: 'Normal',
        },
        {
          ingredientID: 16223, displayValue: '1 (3 ounce) package cream cheese', grams: 85.0, displayType: 'Normal',
        }],
        servings: 10,
        prepMinutes: 10,
        cookMinutes: 0,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/3233502.jpg',
        id: 20657,
      },
      {
        title: "Heather's Cilantro, Black Bean, and Corn Salsa",
        nutrition: {
          calories: {
            name: 'Calories', amount: 29.96081, unit: 'kcal', displayValue: '30', dailyValue: '30', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 0.8942679, unit: 'g', displayValue: '0.9', dailyValue: '0.9', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 0.0, unit: 'mg', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 84.90405, unit: 'mg', displayValue: '85', dailyValue: '85', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 4.899328, unit: 'g', displayValue: '4.9', dailyValue: '4.9', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 1.131903, unit: 'g', displayValue: '1.1', dailyValue: '1.1', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 16.40599, unit: 'mcg', displayValue: '16', dailyValue: '16', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 7.74954, unit: 'mg', displayValue: '8', dailyValue: '8', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.02783677, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 0.4635225, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.02535757, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.3674834, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 8.761477, unit: 'mg', displayValue: '9', dailyValue: '9', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 4.5839, unit: 'mg', displayValue: '5', dailyValue: '5', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 147.085, unit: 'IU', displayValue: '147', dailyValue: '147', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.6857224, unit: 'g', displayValue: '0.7', dailyValue: '0.7', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 83.75055, unit: 'mg', displayValue: '84', dailyValue: '84', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 0.1311002, unit: 'g', displayValue: '0.1', dailyValue: '0.1', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 8.04841, unit: 'kcal', displayValue: '8', dailyValue: '8', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 1.36529, unit: 'g', displayValue: '1.4', dailyValue: '1.4', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 4313, displayValue: '1 (15 ounce) can yellow corn, drained', grams: 482.0, displayType: 'Normal',
        },
        {
          ingredientID: 3656, displayValue: '1 (15 ounce) can white corn, drained', grams: 420.0, displayType: 'Normal',
        },
        {
          ingredientID: 2779, displayValue: '2 (15 ounce) cans black beans, drained and rinsed', grams: 850.0, displayType: 'Normal',
        },
        {
          ingredientID: 12183, displayValue: '1 (14.5 ounce) can Italian-style diced tomatoes, drained', grams: 406.0, displayType: 'Normal',
        },
        {
          ingredientID: 3717, displayValue: '1 bunch finely chopped cilantro', grams: 56.0, displayType: 'Normal',
        },
        {
          ingredientID: 4405, displayValue: '5 green onions, finely sliced', grams: 75.0, displayType: 'Normal',
        },
        {
          ingredientID: 20269, displayValue: '1 small red onion, finely chopped', grams: 70.0, displayType: 'Normal',
        },
        {
          ingredientID: 4786, displayValue: '1 red bell pepper, seeded and chopped', grams: 119.0, displayType: 'Normal',
        },
        {
          ingredientID: 4342, displayValue: '1 tablespoon minced garlic', grams: 8.387665, displayType: 'Normal',
        },
        {
          ingredientID: 5112, displayValue: '1/4 cup lime juice', grams: 61.5, displayType: 'Normal',
        },
        {
          ingredientID: 5012, displayValue: '1 avocado - peeled, pitted, and diced', grams: 201.0, displayType: 'Normal',
        },
        {
          ingredientID: 6307, displayValue: '2 tablespoons olive oil, or to taste', grams: 27.0, displayType: 'Normal',
        }],
        servings: 72,
        prepMinutes: 25,
        cookMinutes: 0,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/675486.jpg',
        id: 143315,
      },
      {
        title: 'Mexican Cream Cheese Rollups',
        nutrition: {
          calories: {
            name: 'Calories', amount: 428.0318, unit: 'kcal', displayValue: '428', dailyValue: '428', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 19.4038, unit: 'g', displayValue: '19.4', dailyValue: '19.4', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 34.27985, unit: 'mg', displayValue: '34', dailyValue: '34', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 926.6636, unit: 'mg', displayValue: '927', dailyValue: '927', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 43.54992, unit: 'g', displayValue: '43.5', dailyValue: '43.5', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 9.145071, unit: 'g', displayValue: '9.1', dailyValue: '9.1', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 100.6071, unit: 'mcg', displayValue: '101', dailyValue: '101', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 28.0515, unit: 'mg', displayValue: '28', dailyValue: '28', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.1396482, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 3.068231, unit: 'mg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.3999788, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 3.41966, unit: 'mg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 139.5587, unit: 'mg', displayValue: '140', dailyValue: '140', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 2.493437, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 593.6873, unit: 'IU', displayValue: '594', dailyValue: '594', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.9473652, unit: 'g', displayValue: '0.9', dailyValue: '0.9', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 214.9244, unit: 'mg', displayValue: '215', dailyValue: '215', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 7.521792, unit: 'g', displayValue: '7.5', dailyValue: '7.5', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 174.6342, unit: 'kcal', displayValue: '175', dailyValue: '175', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 3.296173, unit: 'g', displayValue: '3.3', dailyValue: '3.3', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 16223, displayValue: '1 (8 ounce) package cream cheese, softened', grams: 224.0, displayType: 'Normal',
        },
        {
          ingredientID: 6294, displayValue: '1/3 cup mayonnaise', grams: 73.26, displayType: 'Normal',
        },
        {
          ingredientID: 7822, displayValue: '2/3 cup pitted green olives, chopped', grams: 93.338, displayType: 'Normal',
        },
        {
          ingredientID: 5133, displayValue: '1 (2.25 ounce) can black olives, chopped', grams: 63.0, displayType: 'Normal',
        },
        {
          ingredientID: 4405, displayValue: '6 green onions, chopped', grams: 90.0, displayType: 'Normal',
        },
        {
          ingredientID: 20466, displayValue: '8 (10 inch) flour tortillas', grams: 576.0, displayType: 'Normal',
        },
        {
          ingredientID: 5588, displayValue: '1/2 cup salsa', grams: 129.5, displayType: 'Normal',
        }],
        servings: 8,
        prepMinutes: 5,
        cookMinutes: 0,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/946739.jpg',
        id: 14922,
      },
      {
        title: 'Buffalo Chicken Wings I',
        nutrition: {
          calories: {
            name: 'Calories', amount: 255.7203, unit: 'kcal', displayValue: '256', dailyValue: '256', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 23.94269, unit: 'g', displayValue: '23.9', dailyValue: '23.9', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 46.135, unit: 'mg', displayValue: '46', dailyValue: '46', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 302.0044, unit: 'mg', displayValue: '302', dailyValue: '302', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 0.1571936, unit: 'g', displayValue: '0.2', dailyValue: '0.2', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 9.97597, unit: 'g', displayValue: '10', dailyValue: '10', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 1.839844, unit: 'mcg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 7.561453, unit: 'mg', displayValue: '8', dailyValue: '8', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.1682833, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 4.249951, unit: 'mg', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.01893606, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.5100925, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 7.915625, unit: 'mg', displayValue: '8', dailyValue: '8', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 6.536819, unit: 'mg', displayValue: '7', dailyValue: '7', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 249.6513, unit: 'IU', displayValue: '250', dailyValue: '250', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.1143722, unit: 'g', displayValue: '0.1', dailyValue: '0.1', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 81.90825, unit: 'mg', displayValue: '82', dailyValue: '82', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 7.051547, unit: 'g', displayValue: '7.1', dailyValue: '7.1', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 215.4842, unit: 'kcal', displayValue: '215', dailyValue: '215', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.02621719, unit: 'g', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 20482, displayValue: '1 quart vegetable oil for deep frying', grams: 880.0, displayType: 'Normal',
        },
        {
          ingredientID: 6531, displayValue: '24 chicken wings, tips removed and wings cut in half at joint', grams: 1176.0, displayType: 'Normal',
        },
        {
          ingredientID: 16157, displayValue: '4 tablespoons butter', grams: 56.8, displayType: 'Normal',
        },
        {
          ingredientID: 7842, displayValue: '1 tablespoon distilled white vinegar', grams: 14.801763, displayType: 'Normal',
        },
        {
          ingredientID: 5592, displayValue: '5 tablespoons hot pepper sauce', grams: 69.9125, displayType: 'Normal',
        },
        {
          ingredientID: 16421, displayValue: 'salt and pepper to taste', grams: 0.0, displayType: 'HideAmounts',
        }],
        servings: 8,
        prepMinutes: 10,
        cookMinutes: 15,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/1680821.jpg',
        id: 8947,
      },
      {
        title: 'Ranch Oyster Crackers',
        nutrition: {
          calories: {
            name: 'Calories', amount: 137.2687, unit: 'kcal', displayValue: '137', dailyValue: '137', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 7.026761, unit: 'g', displayValue: '7', dailyValue: '7', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 0.0, unit: 'mg', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 558.1705, unit: 'mg', displayValue: '558', dailyValue: '558', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 16.18187, unit: 'g', displayValue: '16.2', dailyValue: '16.2', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 1.911456, unit: 'g', displayValue: '1.9', dailyValue: '1.9', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 6.942168E-4, unit: 'mcg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 0.1434303, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.001447925, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 0.00256812, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 2.662409E-4, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.8931824, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 12.28766, unit: 'mg', displayValue: '12', dailyValue: '12', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 0.01920871, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 1.469099, unit: 'IU', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.9608374, unit: 'g', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 8.283519, unit: 'mg', displayValue: '8', dailyValue: '8', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 1.448734, unit: 'g', displayValue: '1.4', dailyValue: '1.4', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 63.24085, unit: 'kcal', displayValue: '63', dailyValue: '63', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.7205557, unit: 'g', displayValue: '0.7', dailyValue: '0.7', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 11444, displayValue: '1 (1 ounce) package Ranch-style dressing mix', grams: 28.0, displayType: 'Normal',
        },
        {
          ingredientID: 16393, displayValue: '1/2 teaspoon dried dill weed', grams: 0.5, displayType: 'Normal',
        },
        {
          ingredientID: 6379, displayValue: '1/4 cup vegetable oil', grams: 55.0, displayType: 'Normal',
        },
        {
          ingredientID: 18845, displayValue: '1/4 teaspoon lemon pepper (optional)', grams: 0.50104165, displayType: 'OptionalIngredient',
        },
        {
          ingredientID: 16396, displayValue: '1/4 teaspoon garlic powder (optional)', grams: 0.69416666, displayType: 'OptionalIngredient',
        },
        {
          ingredientID: 9612, displayValue: '5 cups oyster crackers', grams: 475.0, displayType: 'Normal',
        }],
        servings: 20,
        prepMinutes: 10,
        cookMinutes: 20,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/67903.jpg',
        id: 15956,
      },
      {
        title: 'Zesty Porcupine Meatballs',
        nutrition: {
          calories: {
            name: 'Calories', amount: 407.8887, unit: 'kcal', displayValue: '408', dailyValue: '408', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 21.64804, unit: 'g', displayValue: '21.6', dailyValue: '21.6', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 105.3, unit: 'mg', displayValue: '105', dailyValue: '105', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 1250.47, unit: 'mg', displayValue: '1250', dailyValue: '1250', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 32.44779, unit: 'g', displayValue: '32.4', dailyValue: '32.4', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 20.57981, unit: 'g', displayValue: '20.6', dailyValue: '20.6', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 52.9913, unit: 'mcg', displayValue: '53', dailyValue: '53', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 28.5167, unit: 'mg', displayValue: '29', dailyValue: '29', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.364273, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 9.965837, unit: 'mg', displayValue: '10', dailyValue: '10', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.1411195, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 5.073744, unit: 'mg', displayValue: '5', dailyValue: '5', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 44.88955, unit: 'mg', displayValue: '45', dailyValue: '45', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 68.06374, unit: 'mg', displayValue: '68', dailyValue: '68', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 800.198, unit: 'IU', displayValue: '800', dailyValue: '800', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 10.26633, unit: 'g', displayValue: '10.3', dailyValue: '10.3', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 634.1729, unit: 'mg', displayValue: '634', dailyValue: '634', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 8.21456, unit: 'g', displayValue: '8.2', dailyValue: '8.2', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 194.8323, unit: 'kcal', displayValue: '195', dailyValue: '195', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.895969, unit: 'g', displayValue: '0.9', dailyValue: '0.9', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 16317, displayValue: '1 egg', grams: 50.0, displayType: 'Normal',
        },
        {
          ingredientID: 5587, displayValue: '2 (10.75 ounce) cans condensed tomato soup', grams: 610.0, displayType: 'Normal',
        },
        {
          ingredientID: 15652, displayValue: '1/4 cup instant rice', grams: 22.0, displayType: 'Normal',
        },
        {
          ingredientID: 4397, displayValue: '1/4 cup chopped onion', grams: 40.0, displayType: 'Normal',
        },
        {
          ingredientID: 4409, displayValue: '1 tablespoon chopped fresh parsley', grams: 3.75, displayType: 'Normal',
        },
        {
          ingredientID: 18739, displayValue: '1 teaspoon onion salt', grams: 5.5, displayType: 'Normal',
        },
        {
          ingredientID: 16406, displayValue: '1/4 teaspoon ground black pepper', grams: 0.525, displayType: 'Normal',
        },
        {
          ingredientID: 4147, displayValue: '1 pound lean ground beef', grams: 454.0, displayType: 'Normal',
        },
        {
          ingredientID: 7428, displayValue: '1/4 cup Worcestershire sauce', grams: 68.0, displayType: 'Normal',
        }],
        servings: 5,
        prepMinutes: 20,
        cookMinutes: 20,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/709422.jpg',
        id: 14676,
      },
      {
        title: 'Chicago Dip',
        nutrition: {
          calories: {
            name: 'Calories', amount: 341.4717, unit: 'kcal', displayValue: '341', dailyValue: '341', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 24.06007, unit: 'g', displayValue: '24.1', dailyValue: '24.1', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 18.48, unit: 'mg', displayValue: '18', dailyValue: '18', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 470.8022, unit: 'mg', displayValue: '471', dailyValue: '471', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 26.26844, unit: 'g', displayValue: '26.3', dailyValue: '26.3', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 6.115789, unit: 'g', displayValue: '6.1', dailyValue: '6.1', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 136.5714, unit: 'mcg', displayValue: '137', dailyValue: '137', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 38.16438, unit: 'mg', displayValue: '38', dailyValue: '38', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.2082427, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 3.66597, unit: 'mg', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.2510921, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 2.141217, unit: 'mg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 108.0009, unit: 'mg', displayValue: '108', dailyValue: '108', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 3.553996, unit: 'mg', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 3637.173, unit: 'IU', displayValue: '3637', dailyValue: '3637', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 1.030141, unit: 'g', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 209.8446, unit: 'mg', displayValue: '210', dailyValue: '210', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 6.018323, unit: 'g', displayValue: '6', dailyValue: '6', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 216.5407, unit: 'kcal', displayValue: '217', dailyValue: '217', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 2.279491, unit: 'g', displayValue: '2.3', dailyValue: '2.3', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 4520, displayValue: '1 (10 ounce) package frozen chopped spinach, thawed and drained', grams: 284.0, displayType: 'Normal',
        },
        {
          ingredientID: 16261, displayValue: '1 cup sour cream', grams: 230.0, displayType: 'Normal',
        },
        {
          ingredientID: 6294, displayValue: '1 cup mayonnaise', grams: 220.0, displayType: 'Normal',
        },
        {
          ingredientID: 4405, displayValue: '3/4 cup chopped green onions', grams: 75.0, displayType: 'Normal',
        },
        {
          ingredientID: 16405, displayValue: '2 teaspoons dried parsley', grams: 0.917796, displayType: 'Normal',
        },
        {
          ingredientID: 5107, displayValue: '1 teaspoon lemon juice', grams: 5.3744493, displayType: 'Normal',
        },
        {
          ingredientID: 18741, displayValue: '1/2 teaspoon seasoned salt', grams: 2.0, displayType: 'Normal',
        },
        {
          ingredientID: 2077, displayValue: '1 (1 pound) loaf round, crusty Italian bread', grams: 454.0, displayType: 'Normal',
        }],
        servings: 10,
        prepMinutes: 15,
        cookMinutes: 0,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/105978.jpg',
        id: 14972,
      },
      {
        title: 'Perfect Sushi Rice',
        nutrition: {
          calories: {
            name: 'Calories', amount: 112.1963, unit: 'kcal', displayValue: '112', dailyValue: '112', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 1.044, unit: 'g', displayValue: '1', dailyValue: '1', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 0.0, unit: 'mg', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 158.1806, unit: 'mg', displayValue: '158', dailyValue: '158', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 23.4804, unit: 'g', displayValue: '23.5', dailyValue: '23.5', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 1.6798, unit: 'g', displayValue: '1.7', dailyValue: '1.7', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 1.726667, unit: 'mcg', displayValue: '2', dailyValue: '2', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 6.151333, unit: 'mg', displayValue: '6', dailyValue: '6', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.02639333, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 0.8536872, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.0444, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.3967742, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 4.264667, unit: 'mg', displayValue: '4', dailyValue: '4', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 0.0, unit: 'mg', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 0.0, unit: 'IU', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 3.330334, unit: 'g', displayValue: '3.3', dailyValue: '3.3', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 19.566, unit: 'mg', displayValue: '20', dailyValue: '20', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 0.1695342, unit: 'g', displayValue: '0.2', dailyValue: '0.2', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 9.396, unit: 'kcal', displayValue: '9', dailyValue: '9', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.6906667, unit: 'g', displayValue: '0.7', dailyValue: '0.7', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 1660, displayValue: '2 cups uncooked glutinous white rice (sushi rice)', grams: 370.0, displayType: 'Normal',
        },
        {
          ingredientID: 2496, displayValue: '3 cups water', grams: 711.0, displayType: 'Normal',
        },
        {
          ingredientID: 18868, displayValue: '1/2 cup rice vinegar', grams: 127.07947, displayType: 'Normal',
        },
        {
          ingredientID: 6305, displayValue: '1 tablespoon vegetable oil', grams: 13.625, displayType: 'Normal',
        },
        {
          ingredientID: 1526, displayValue: '1/4 cup white sugar', grams: 50.0, displayType: 'Normal',
        },
        {
          ingredientID: 16421, displayValue: '1 teaspoon salt', grams: 6.0, displayType: 'Normal',
        }],
        servings: 15,
        prepMinutes: 5,
        cookMinutes: 20,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/13465.jpg',
        id: 99211,
      },
      {
        title: 'Warm Crab Parmesan Dip',
        nutrition: {
          calories: {
            name: 'Calories', amount: 87.87348, unit: 'kcal', displayValue: '88', dailyValue: '88', isCompleteData: false,
          },
          fat: {
            name: 'Fat', amount: 8.423399, unit: 'g', displayValue: '8.4', dailyValue: '8.4', isCompleteData: false,
          },
          cholesterol: {
            name: 'Cholesterol', amount: 16.25854, unit: 'mg', displayValue: '16', dailyValue: '16', isCompleteData: false,
          },
          sodium: {
            name: 'Sodium', amount: 107.4051, unit: 'mg', displayValue: '107', dailyValue: '107', isCompleteData: false,
          },
          carbohydrates: {
            name: 'Carbohydrates', amount: 0.789265, unit: 'g', displayValue: '0.8', dailyValue: '0.8', isCompleteData: false,
          },
          protein: {
            name: 'Protein', amount: 2.48134, unit: 'g', displayValue: '2.5', dailyValue: '2.5', isCompleteData: false,
          },
          folate: {
            name: 'Folate', amount: 3.315931, unit: 'mcg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          magnesium: {
            name: 'Magnesium', amount: 3.482356, unit: 'mg', displayValue: '3', dailyValue: '3', isCompleteData: false,
          },
          vitaminB6: {
            name: 'Vitamin B6', amount: 0.04524606, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          niacin: {
            name: 'Niacin Equivalents', amount: 0.5656837, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          thiamin: {
            name: 'Thiamin', amount: 0.007466, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          iron: {
            name: 'Iron', amount: 0.1416408, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          calcium: {
            name: 'Calcium', amount: 48.56927, unit: 'mg', displayValue: '49', dailyValue: '49', isCompleteData: false,
          },
          vitaminC: {
            name: 'Vitamin C', amount: 0.2314631, unit: 'mg', displayValue: '< 1', dailyValue: '< 1', isCompleteData: false,
          },
          vitaminA: {
            name: 'Vitamin A - IU', amount: 141.4825, unit: 'IU', displayValue: '141', dailyValue: '141', isCompleteData: false,
          },
          sugars: {
            name: 'Sugars', amount: 0.1098, unit: 'g', displayValue: '0.1', dailyValue: '0.1', isCompleteData: false,
          },
          potassium: {
            name: 'Potassium', amount: 32.48526, unit: 'mg', displayValue: '32', dailyValue: '32', isCompleteData: false,
          },
          saturatedFat: {
            name: 'Saturated Fat', amount: 3.161308, unit: 'g', displayValue: '3.2', dailyValue: '3.2', isCompleteData: false,
          },
          caloriesFromFat: {
            name: 'Calories from Fat', amount: 75.81059, unit: 'kcal', displayValue: '76', dailyValue: '76', isCompleteData: false,
          },
          fiber: {
            name: 'Dietary Fiber', amount: 0.0063, unit: 'g', displayValue: '0', dailyValue: '0', isCompleteData: false,
          },
        },
        ingredients: [{
          ingredientID: 2656, displayValue: '1 (4.5 ounce) can crabmeat, drained', grams: 127.575, displayType: 'Normal',
        },
        {
          ingredientID: 16223, displayValue: '1 (8 ounce) package cream cheese, softened', grams: 224.0, displayType: 'Normal',
        },
        {
          ingredientID: 6294, displayValue: '1 cup mayonnaise', grams: 220.0, displayType: 'Normal',
        },
        {
          ingredientID: 16238, displayValue: '1 1/2 cups grated Parmesan cheese', grams: 120.0, displayType: 'Normal',
        },
        {
          ingredientID: 16261, displayValue: '1 cup sour cream', grams: 230.0, displayType: 'Normal',
        },
        {
          ingredientID: 4342, displayValue: '4 cloves garlic, peeled and crushed (or to taste)', grams: 12.0, displayType: 'Normal',
        }],
        servings: 40,
        prepMinutes: 10,
        cookMinutes: 45,
        readyMinutes: -1,
        imageUrl: 'https://images.media-allrecipes.com/userphotos/1093222.jpg',
        id: 25517,
      }],
      (err) => {
        client.close(() => next(err));
      });
    },
    connect,
    createSearchIndex,
  ],
  callback);
};
