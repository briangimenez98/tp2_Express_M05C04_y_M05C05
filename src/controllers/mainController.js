const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
const toThousand = require('../utils/toThousand');
const finalPrice = require('../utils/finalPrice');

const controller = {
	index: (req, res) => {
		const productInSale = products.filter(p => {
			return p.category === "in-sale";
		})
		const productVisited = products.filter(p => {
			return p.category == "visited"
		})

		return res.render('index.ejs', {
			products,
			productInSale,
			productVisited,
			finalPrice,
			toThousand
		})
	},
	search: (req, res) => {
		if(req.query.keywords.trim() =! ""){
			const result = products.filter(p => {
				return p.name.toLowerCase().includes(req.query.keywords.toLowerCase().trim())
			});
	
			const search = req.query.keywords;
	
			return res.render('results.ejs', {
				result,
				search
			})
		} else {
			return res.redirect('/');
		}
	},
};

module.exports = controller;
