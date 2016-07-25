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