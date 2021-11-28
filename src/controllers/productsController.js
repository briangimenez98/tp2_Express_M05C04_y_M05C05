const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
const toThousand = require('../utils/toThousand');
const finalPrice = require('../utils/finalPrice');

const controller = {
	// Root - Show all products
	index: (req, res) => {
		return res.render('products.ejs', {
			products,
			finalPrice,
			toThousand
		});
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		let productDetail = products.find(p => {
			return p.id === +req.params.id;
		});
		return res.render('detail.ejs', {
			productDetail,
			products,
			finalPrice
		});
	},

	// Create - Form to create
	create: (req, res) => {
		return res.render('product-create-form.ejs');
	},
	
	// Create -  Method to store
	store: (req, res) => {
		const {name,price,discount,category,description} = req.body;

		let newProduct = {
			id: (products[products.length-1].id+1),
			name,
			price: +price,
			discount: +discount,
			category,
			description,
			image: req.file ? req.file.filename : 'default-image.png'
		};
		products.push(newProduct);
		fs.writeFileSync(productsFilePath,JSON.stringify(products, null, 2), 'utf-8');
		return res.redirect('/products/');
	},

	// Update - Form to edit
	edit: (req, res) => {
		let productEdit = products.find(p => p.id === +req.params.id);
		return res.render('product-edit-form.ejs', {
			productEdit
		})
	},
	// Update - Method to update
	update: (req, res) => {
		const {name,price,description,discount,category} = req.body
		products.forEach(p => {
			if(p.id === +req.params.id){
				p.id = +req.params.id,
				p.name = name;
				p.price = price;
				p.discount = discount;
				p.category = category;
				p.description = description;
			}
		})
		fs.writeFileSync(productsFilePath,JSON.stringify(products, null, 2), 'utf-8');
		return res.redirect('/products/detail/' + req.params.id)
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		products.forEach(p => {
			if(p.id === +req.params.id){
				let pDelete = products.indexOf(p)
				products.splice(pDelete, 1)
			}
		})
		fs.writeFileSync(productsFilePath,JSON.stringify(products, null, 2), 'utf-8');
		return res.redirect('/products')
	}
};

module.exports = controller;