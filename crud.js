/***
 * Query all records from the restaurants collection.
 */
db.restaurants.find({})

/***
 * Find American restaurants.  $in operator contains an array of values to be matched
 * against.  Using regex notation /String-To-Match/ contains the value(s) to match.
 * Here we are matching against the 'American' with the \s* to include any string that
 * has whitespace before or after it.
 */
    db.restaurants.find({'cuisine': {$in: [/s*American\s*/]}});

//Find Chinese restaurants and ignore case sensitivity and white spaces
    db.restaurants.findOne({'cuisine': /\s*Chinese\s*/i}, {'name': false});

//Find Chinese or American restaurants
    db.restaurants.find({
    $or: [
        {'cuisine': /\s*Chinese\s*/i},
        {'cuisine': /\s*American\s*/i}
    ]
    }, {'cuisine': 1, 'name': 1}).limit(20)

//Insert one document
    db.movies.insertOne({
    "title": "Justice League",
        "year": "2018",
        "imbdb": "tf22444"
    })

//Insert many documents. 
use video
db.movies.insertMany([
    {        "title": "Indiana Jones",
             "year": "1984", 
             "imbdb": "tf22444"
    },
    {        "title": "Back to the Future",
             "year": "1986",
             "imbdb": "tf22444"
    }])

//Find restaurants who have a grade of 8 in the restaurants collection of the scratch database
use scratch
db.restaurants.find({grades: {$elemMatch: {score: 8}}}).pretty()