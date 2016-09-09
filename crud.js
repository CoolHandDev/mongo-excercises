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
db.restaurants.find(
    {
        grades: 
            {
                $elemMatch: {score: 8}
            }
    }).pretty()


//add an array field
use scratch
db.movies.updateOne({
    "title": "Indiana Jones"},
    {$push: 
        {
            "reviews": {"rating": "4.2"}
        }        
    }
)

//m101js week 2
db.movieDetails.find(
    {
        year: 2013, rated: "PG-13"
        , "awards.wins": 0
    }, 
    {
        title:1
    }
    ).pretty()

//
db.movieDetails.find(
    {
        genres: {
                    $all: ["Comedy", "Crime"]
                }
    }).pretty()

//
db.movieDetails.find({genres: ["Comedy", "Crime"]}).count()

db.tempcoll.update(
    {},
    {$set: {"awards": "shit"}}
)


db.tempcoll.update(
    {},
    {
        $set: {
                "awards": {"oscars": [
                                        "test", "test2"                                        
                ]}
        }
    }
)


db.tempcoll.update(
    {},
    {
        $set: {
                "awards" : {
                "oscars" : [
                    {"award": "bestAnimatedFeature", "result": "won"},
                    {"award": "bestMusic", "result": "won"},
                    {"award": "bestPicture", "result": "nominated"},
                    {"award": "bestSoundEditing", "result": "nominated"},
                    {"award": "bestScreenplay", "result": "nominated"}
                ],
                "wins" : 56,
                "nominations" : 86,
                "text" : "Won 2 Oscars. Another 56 wins and 86 nominations."
            }        
        }
    }
)

//determine if movie has gotten an award
db.tempcoll.find({
    "awards.oscars.0": {$exists: true},
    "awards.oscars.1": {$exists: true}     
})

//Insert a million records. 
var insertMillion = function() {
    var start = Date();
    for ( var i = 0; i < 1000000; i++) {
        db.million_coll.insert({"sequence_num": i});
        print("sequence number: " + i);
    };
    var end = Date();
    print(`start date: ${start}.  end: ${end}`);
}
