const agg = [
    {
        '$match': {
            'product': new ObjectId('65d1e49aa548800df85abc9a')
        }
    }, {
        '$group': {
            '_id': '$product',
            'averageRating': {
                '$avg': '$rating'
            },
            'numOfReviews': {
                '$sum': 1
            }
        }
    }
];