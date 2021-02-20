const { response } = require("express");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Menu = require("../models/menu-model");
const Menus = require("../models/menu-model");

//Route to retrieve all items
router.get('/', (req, res) => {
  console.log('loggeduser', req.user);
  Menus.find()
    .then((menusFromDB) => {
      res.json(menusFromDB);
    });
});

//Route to add a new item
router.post('/', (req, res) => {
  const { name, description, price, day, type, image } = req.body;
  Menus.findOne({ name }, (err, foundMenu) => {
    if (err) {
      res.status(500).json({ message: ups });
      return;
    }
    if (foundMenu) {
      res.status(400).json({
        message: "Duplicated name, choose other"
      });
      return;
    }
  })
  Menus.create({
    name,
    description,
    price,
    day,
    type,
    image,
  }).then((response) => {
    res.json(response)
  });
});

router.get("/allmenus", (req, res) => {
	Menu.find().then((menusFromDb) => {
		console.log(menusFromDb);
		res.json(menusFromDb);
	});
});

//Route to find item by id
router.get('/menu/:id', (req, res) => {
  Menus.findById(req.params.id)
    .then((menusFromDB) => {
      res.json(menusFromDB);
    })
});

//Route to update a item
router.put('/menu/:id', (req, res) => {
  const MenuId = req.params.id;
  const MenuWithNewDetails = req.body;

  Menus.findByIdAndUpdate(MenuId, MenuWithNewDetails)
    .then(() => {
      res.json({ message: `Menu with ${req.params.id} is updated` });
    })
});

//Route to delete a specific item by ID
router.delete('/menu/:id', (req, res) => {
  Menus.findByIdAndRemove(req.params.id)
    .then(() => {
      res.json({ message: `Menu with id ${req.params.id} was deleted`})
    })
})


router.post("/menu/associate", (req, res) => {
	const loggedUserId = req.user._id;
	const { name, description, price, day, type, image } = req.body;
	console.log("looggedUSerId", loggedUserId);

	Menu.create({
		name: name,
		price: price,
		decription: description,
		image: image,
	}).then((response) => {
		User.findByIdAndUpdate(loggedUserId, {
			$push: { menus: response._id },
		}).then(() => {
			res.json({
				message: `Menu with id ${response._id} was added to user ${loggedUserId}`,
			});
		});
	});
});


module.exports = router;
