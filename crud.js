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
