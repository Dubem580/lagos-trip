const express = require('express')
const mongo = require('mongodb').MongoClient
const url = 'mongodb://localhost'

const app = express()
app.use(express.json())

let db, trips, expenses

mongo.connect(
  url, {
    	useNewUrlParser: true
    },
  (err, client) => {
    if(err) {
	console.error(err)
	return
    }
    db = client.db('tripcost')
    trips = db.collection('trips')
    expenses = db.collection('expenses')
    }
)

app.post('/trip', (req, res) => 
{
	const name = req.body.name
	trips.insertOne({ name: name}, (err, result) => {
			if (err) {
				console.error(err)
				res.status(500).json(
					{
						err: err
					}
				)
				return
			}
				res.status(200).json(
					{ 
						ok: true
					}
				)
	})
})

app.get('/trips', (req, res) => {
	trips.find({trip: req.body.name}).toArray((err, items) =>
	{
		if(err){
			console.error(err)
			res.status(500).json({
				err: err
			})
			return
		} 
		console.log(items)
		res.status(200).json({
			trips: items
		})

	})
})

app.post('/expense', (req, res) => {
	expenses.insertOne({
		trip: req.body.trip,
		date: req.body.date,
		amount: req.body.amount,
		category: req.body.category,
		description: req.body.description
	},
	(err, result) => {
		if(err){
			console.error(err)
			res.status(500).json({
				err: err
			})
			return
		}
		console.log(result)
		res.status(200).json({
			ok: true
		})
	}
	)
})

app.get('/expenses', (req, res) => {
	expenses.find({trip: req.body.trip}).toArray((err, items) =>{
		if(err) {
			console.error(err)
			res.status(500).json({
				err: err
			})
			return
		}
		res.status(200).json({
			trips: items
		})

	})

})

{ useNewUrlParser: true }

app.listen(3000, () => console.log('server ready'))
