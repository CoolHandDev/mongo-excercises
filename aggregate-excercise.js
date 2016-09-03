/**
 * Aggregation using unwind.  Restaurant collection has an nested array.
 * Unwind will place contents of array at 1st level and create a document
 * for each value in array.  This makes aggreation using those array values
 * possible.
 *
 */
    var f1 = {
         $group: {'_id': '$name', average_grade: {$avg: '$grades.score'}}
    }

    db.restaurants.aggregate([
         {$unwind: '$grades'},
         f1,
         {$out: 'restaurant_grades'}
    ])

/***
 * Projection using #project. Similar to projection in find()
 */
    db.restaurants.aggregate([
        {$unwind: '$grades'},
        f1,
        {$out: 'restaurant_grades'}
    ])

/***
 * String operators.
 */
    db.restaurants.aggregate( {
        $project: {
            _id: 0,
            test: '$name',
            'concatenated': { $concat: ['$name', '-', 'blah']}
        }
    })

    db.restaurants.aggregate( {
        $project: {
            _id: 0,
            test: '$name',
            'substring': { $substr: ['$name', 0, 5]},
            'substring-offset': { $substr: ['$name', 5, 5]}
        }
    })

 
/***
 * Date operators
 */
    db.restaurants.aggregate(
        {$unwind: '$grades'},
        {
        $project: {
            _id: 0,
            test: '$name',
            'month': { $month: '$grades.date'},
            'day-of-week': { $dayOfWeek: '$grades.date'},
            'year': { $year: '$grades.date'},
            'full-date': '$grades.date'
        }
    })

/***
 * County how many instances of each cuisine in each borough
 */
db.restaurants.aggregate({
    $group: {
        '_id': {'cuisine': '$cuisine',
            'borough': '$borough'
        },
        'count': {$sum: 1}
    }
})

/***
 * Distinct list of restaurants
 */
db.restaurants.aggregate([
    { $group: {'_id': '$cuisine'}},
    {$out: 'distinct_cuisines'}
])

/***
 * find sepecific movie using $match
 */
use movie
db.movieDetails.aggregate([
    { 
        $match: { _id: ObjectId("569190ca24de1e0ce2dfcd4f") } 
    }
]).pretty()


/***
 * find sepecific movie rating using $match and direct results to 
 * new collection
 */
use movie
db.movieDetails.aggregate([
    { 
        $match: { rated: "PG-13", year: 1968 } 
    }
]).pretty()

/**
 *   output results to another collection
 */
db.movieDetails.aggregate([
    { 
        $match: { rated: "PG-13", year: 1968 } 
    },
    {
        $out: "tempcoll"
    }
]).pretty()


//find movies that have more than 2 artists
db.movieDetails.aggregate(
    [
        {$project: {
            "_id": 1, 
            "title": 1,
            "artists": {$size: "$actors"}

        }},
        {$match: {"artists": {$gt:5}}}
    ]
)

