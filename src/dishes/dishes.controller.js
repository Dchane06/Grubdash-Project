const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

//TODO: middleware
//dish exists
function dishExists(req, res, next) {
    const { dishId } = req.params;
    const foundDish = dishes.find((dish) => dish.id === dishId);
    if (foundDish !== undefined) {
        res.locals.dish = foundDish;
        return next();
    } else {
        return next({
            status: 404,
            message: `Dish id not found: ${dishId}`
        });
    }
};

//data id matches dish id
function dataIdMatchesDish(req, res, next) {
    const { dishId } = req.params;
    const { data: { id } } = req.body;
    if (id === dishId || !id) {
        return next();
        } else {
            return next({
                status: 400,
                message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`
         });
    };
};

//dish has name property
function hasValidName(req, res, next) {
    const { data: { name } = {} } = req.body;
    if (name) {
        return next();
    } else {
        return next({
            status: 400,
            message: "A 'name' property is required."
        });
    };
};

//dish has description property
function hasValidDescription(req, res, next) {
    const { data: { description } = {} } = req.body;
    if (description) {
        return next();
    } else {
        return next({
            status: 400,
            message: "A 'description' property is required."
        });
    };
}; 

//dish has valid price
function hasValidPrice(req, res, next) {
    const { data: { price } = {} } = req.body;
    if (price > 0 && typeof price === 'number' ) {
        return next();
    } else {
        return next({
            status: 400,
            message: "A 'price' property is required. It must be a number greater than 0."
        });
    };
};


//dish has valid imageurl
function hasValidImageUrl(req, res, next) {
    const { data: { image_url } = {} } = req.body;
    if(image_url) {
        return next();
    } else {
        return next({
            status: 400,
            message: "An 'image_url' property is required."
        });
    };
};

// TODO: Implement the /dishes handlers needed to make the tests pass



function list(req, res) {
    res.json({ data: dishes });
};


function read(req, res) {
    const dish = res.locals.dish;
    res.json({ data: dish });
};


function update(req, res) {
    let dish = res.locals.dish;
    const { data } = req.body;
        if (dish.id) { data.id = dish.id } 
    dish = {
        id: data.id,
        name: data.name,
        description: data.description,
        price: data.price,
        image_url: data.image_url
    }
    res.json({ data: dish });
};


function create(req, res) {
    const { data: { name, description, price, image_url } = {} } = req.body;
    const id = nextId();
    const newDish = {
        id,
        name,
        description,
        price,
        image_url
    };
    dishes.push(newDish);
    res.status(201).json({ data: newDish });
};


module.exports = {
    list,
    read: [
        dishExists, 
        read],
    create: [
        hasValidName, 
        hasValidDescription, 
        hasValidPrice, 
        hasValidImageUrl, 
        create],
    update: [
        dishExists, 
        hasValidName, 
        hasValidDescription, 
        hasValidPrice, 
        hasValidImageUrl, 
        dataIdMatchesDish, 
        update]
};
