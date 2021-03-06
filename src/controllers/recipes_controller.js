const { spawn } = require('child_process');
const fs = require('fs');
const async = require('async');
const recipesModel = require('../models/recipes_model');
const usersModel = require('../models/users_model');

const PYTHON_MODES = {
  PROCESS: 'PROCESS',
  RECOMMEND: 'RECOMMEND',
};

const processRecipesJson = (recipes, callback) => {
  const ingredientsList = recipes.map(({ id, ingredients }) => ({
    id,
    ingredients: ingredients.map(ingredient => ingredient.ingredientID),
  }));


  const pythonProcess = spawn('python', ['recommender.py', PYTHON_MODES.PROCESS]);

  pythonProcess.stdin.write(JSON.stringify(ingredientsList));
  pythonProcess.stdin.end();

  let processError = null;
  pythonProcess.stderr.on('data', (error) => {
    processError = error;
    console.error(error.toString());
  });

  pythonProcess.stdout.on('end', () => {
    callback(processError);
  });
};

module.exports.setup = (data, callback) => {
  processRecipesJson(
    data,
    () => recipesModel.setup(data, callback),
  );
};

module.exports.clean = (callback) => {
  recipesModel.clean(callback);
};

module.exports.processRecipesJson = (req, res) => {
  const rawRecipeData = fs.readFileSync('data/recipes/recipes.json');
  const data = JSON.parse(rawRecipeData);

  processRecipesJson(data, (err) => {
    res.status(err ? 500 : 200).json(null);
  });
};
const verifyToken = (token, res, callback) => {
  usersModel.verifyToken(token, (tokenErr, decodedToken) => {
    if (tokenErr) {
      return res.status(401).json({
        error: 'Invalid or Missing Token, please include a valid token in the header',
      });
    }

    return callback(null, decodedToken);
  });
};

const populateUserSpecificInfoOnRecipes = (token, recipes, res, callback) => {
  async.auto({
    verifyToken: autoCallback => verifyToken(token, res, autoCallback),
    getUserInfo: ['verifyToken', ({ verifyToken: { email } }, autoCallback) => {
      usersModel.getUserInfo(email, autoCallback);
    }],
    populateUserInfoOnRecipe: ['getUserInfo', ({ getUserInfo: { mealPlan, likedRecipes } }, autoCallback) => {
      const recipesWithUserInfo = recipes.map((recipe) => {
        let userMealPlan = [];
        if (mealPlan && mealPlan.length !== 0) {
          userMealPlan = Object.keys(mealPlan).reduce((accumulator, meal) => {
            if (new Set(mealPlan[meal]).has(recipe.id)) {
              return [...accumulator, meal];
            }
            return accumulator;
          }, []);
        }
        const userSpecificInformation = {
          mealPlan: userMealPlan,
          likedRecipes: new Set(likedRecipes).has(recipe.id),
        };
        return { ...recipe, userSpecificInformation };
      });
      autoCallback(null, recipesWithUserInfo);
    }],
  }, (err, { populateUserInfoOnRecipe }) => {
    callback(err, populateUserInfoOnRecipe);
  });
};

module.exports.selectRecipeById = ({ params: { recipeId = null }, headers: { token } }, res) => {
  if (recipeId === null) {
    return res.status(400).json('Please enter the recipe Id');
  }
  return recipesModel.selectRecipeById(recipeId, (err, recipe) => {
    if (token && !err && recipe != null) {
      populateUserSpecificInfoOnRecipes(
        token,
        [recipe],
        res,
        (userSpecificInfoErr, recipesWithUserSpecificInfo) => {
          res.status(userSpecificInfoErr ? 500 : 200)
            .json(userSpecificInfoErr ? null : recipesWithUserSpecificInfo[0]);
        },
      );
    } else {
      res.status(err ? 500 : 200).json(err ? null : recipe);
    }
  });
};

const selectRecipesByIds = (ids, token, res, callback) => {
  recipesModel.selectRecipesByIds(ids, (err, recipes) => {
    if (token && !err) {
      populateUserSpecificInfoOnRecipes(
        token,
        recipes,
        res,
        callback,
      );
    } else {
      callback(err, recipes);
    }
  });
};

const getRandomRecipes = (numberOfRecipes, token, res, callback) => {
  recipesModel.getRandomRecipes(numberOfRecipes, (getRandomRecipesErr, randomRecipes) => {
    if (token && !getRandomRecipesErr) {
      populateUserSpecificInfoOnRecipes(
        token,
        randomRecipes,
        res,
        callback,
      );
    } else {
      callback(getRandomRecipesErr, randomRecipes);
    }
  });
};

const selectAllRecipes = (token, res, callback) => {
  recipesModel.selectAllRecipes((selectAllRecipesErr, recipes) => {
    if (token && !selectAllRecipesErr) {
      populateUserSpecificInfoOnRecipes(
        token,
        recipes,
        res,
        callback,
      );
    } else {
      callback(selectAllRecipesErr, recipes);
    }
  });
};

module.exports.selectRecipesByIds = ({ query: { ids = null }, headers: { token } }, res) => {
  let idsList = ids ? ids.split(',') : [];
  idsList = idsList.map(id => parseInt(id, 10));
  if (idsList.length === 0) {
    selectAllRecipes(token, res, (err, recipes) => {
      res.status(err ? 500 : 200).json(err ? null : recipes);
    });
  } else {
    selectRecipesByIds(idsList, token, res, (err, recipes) => {
      res.status(err ? 500 : 200).json(err ? null : recipes);
    });
  }
};

module.exports.searchRecipes = ({ body: { query = null } }, res) => {
  recipesModel.search(query, (err, result) => {
    res.status(err ? 500 : 200).json(err ? undefined : result);
  });
};

module.exports.getTopRecipes = ({ headers: { token } }, res) => {
  const numberOfRecipes = 8;
  usersModel.countLikedRecipes((err, recipes) => {
    if (!err && Object.keys(recipes).length >= numberOfRecipes) {
      const keysSorted = Object.keys(recipes).sort(
        (recipe1, recipe2) => recipes[recipe2] - recipes[recipe1],
      );
      let topRecipesIds = keysSorted.slice(0, numberOfRecipes);
      topRecipesIds = topRecipesIds.map(recipeId => parseInt(recipeId, 10));
      selectRecipesByIds(topRecipesIds, token, res, (topRecipeErr, topRecipes) => {
        res.status(topRecipeErr ? 500 : 200).json(topRecipeErr ? null : topRecipes);
      });
    } else {
      getRandomRecipes(numberOfRecipes, token, res, (getRandomRecipesErr, randomRecipes) => {
        res.status(getRandomRecipesErr ? 500 : 200)
          .json(getRandomRecipesErr ? null : randomRecipes);
      });
    }
  });
};

module.exports.getRandomRecipes = ({ query: { recipes }, headers: { token } }, res) => {
  const numberOfRecipes = parseInt(recipes, 10);
  getRandomRecipes(numberOfRecipes, token, res, (err, randomRecipes) => {
    res.status(err ? 500 : 200).json(err ? null : randomRecipes);
  });
};


module.exports.recommendRecipe = ({ params: { recipeId = null } }, res) => {
  if (recipeId === null) {
    return res.status(400).json('Please enter the recipe Id');
  }

  return async.auto({
    recommendRecipes: autoCallback => recipesModel.recommendRecipes([recipeId], (err, recipes) => {
      autoCallback(err, recipes[recipeId]);
    }),
    generateRecipeDetails: ['recommendRecipes', ({ recommendRecipes }, autoCallback) => {
      recipesModel.selectRecipesByIds(recommendRecipes, autoCallback);
    }],
  }, (err, { generateRecipeDetails }) => {
    res.status(err ? 500 : 200).json(generateRecipeDetails);
  });
};
