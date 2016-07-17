
var f1 = {
     $group: {'_id': '$name', average_grade: {$avg: '$grades.score'}}
}


db.restaurants.aggregate([
     {$unwind: '$grades'},
     f1,
     {$out: 'restaurant_grades'}
])