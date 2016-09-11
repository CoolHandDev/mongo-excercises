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

//Crunchbase database.  Count how many times a person appears in relationships in companies. 
//Note that they may appear multiple times in one company as they change titles.
//TODO: determine how to generate result where the count is based on how many companies a 
//person was involved in.  Only count 1 involvement from a company.
db.companies.aggregate(
    [
        { $match: { "relationships.person": { $ne: null}}},
        { $project: { relationships: 1, _id: 0}},
        { $unwind: "$relationships"},
        { $group: { 
            _id: "$relationships.person",
            count: { $sum: 1}
        }},
        { $sort: { count: -1 }}               
    ]
)

    //Find out how many times a person appeared in different positions in a company    
    db.companies.aggregate(
        [            
            { $project: { _id: 0, name: 1, relationships: 1}},
            { $unwind: "$relationships"},
            { $group: {"_id":  {
                        "companies": "$name",
                        "person": "$relationships.person.permalink"
                    },
                    "count": { $sum: 1 }
                }
            },
            { $match: { "count": { $gt: 1 }}},
            { $sort: {"count": -1 } }
        ]
    )

    //Examne Tim Hanlon
    db.companies.aggregate(
        [
            { $match: { "relationships.person": { $ne: null}}},
            { $project: { name: 1, relationships: 1, _id: 0}},
            { $unwind: "$relationships"},
            { $match: { "relationships.person.permalink": "tim-hanlon"}},
            { $sort: { name: 1 } }
        ]
    )

    //This query shows how many distinct companies a person has been 
    //associated with.
    db.companies.aggregate(
        [    
            { $match: { "relationships.person": { $ne: null}}},        
            { $project: { _id: 0, name: 1, relationships: 1}},
            { $unwind: "$relationships"},
            { $group: {"_id":  {
                                    "companies": "$name",
                                    "person": "$relationships.person.permalink"
                                },
                        "count": { $sum: 1 }
                }
            },                        
            { $project: { "identifier": "$_id", count: "$count", "_id": 0}},
            { $match: { "identifier.person": "eric-di-benedetto"}},
            { $group: {"_id": {
                                "person": "$identifier.person"                                
                              },
                         "num_of_companies": { $sum: 1}
                      }
            },
            { $sort: {"person": 1 } },
        ]
    )
    
/*
    Find class with highest student performance
    
*/

    //step 1: unwind the scores.
    db.grades.aggregate(
        [
            { $unwind: "$scores" }
        ]
    )
    
    //step 2: only match exam and homework
    db.grades.aggregate(
        [
            { $unwind: "$scores" },
            {
                $match: {
                    $or: [{"scores.type": "exam"}, {"scores.type": "homework"}]
                }
            }
        ]
    ) 
    
    //step 3: get average of grades per student   
    db.grades.aggregate(
        [
            { $unwind: "$scores" },
            {
                $match: {
                    $or: [{"scores.type": "exam"}, {"scores.type": "homework"}]
                }
            },
            {
                $group: {
                    "_id": {
                        "student_id": "$student_id",
                        "class_id": "$class_id"
                    },
                    "average_grade": {$avg: "$scores.score"}                    
                }
            },
            {
                $project: {
                    "student_performance": "$_id",
                    "average_grade": 1,
                    _id: 0
                }
            }
        ]
    )

    //step 4: get average per class
    db.grades.aggregate(
        [
            { $unwind: "$scores" },
            {
                $match: {
                    $or: [{"scores.type": "exam"}, {"scores.type": "homework"}]
                }
            },
            {
                $group: {
                    "_id": {
                        "student_id": "$student_id",
                        "class_id": "$class_id"
                    },
                    "average_grade": {$avg: "$scores.score"}                    
                }
            },
            {
                $project: {
                    "student_performance": "$_id",
                    "average_grade": 1,
                    _id: 0
                }
            },
            {
                $group: {
                    "_id": {
                        "class_id": "$student_performance.class_id"                        
                    },
                    "average_grade_for_class": {$avg: "$average_grade"}                    
                }
            },
            {
                $sort: { "average_grade_for_class": -1}
            }            
        ]
    )