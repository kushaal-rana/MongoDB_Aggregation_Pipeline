// 1. How many users are active?
  [
    {
      $match: {
        isActive: true,
      },
    },
    {
      $count: "activeUsers",
    },
  ]

// 2. What is the average age of all users 
    [
    {
        $group: {
        _id: null, //just group them since there is no specific operation so perform with all users
        averageAge: {
            $avg: "$age", //then find the average age
        }
        }
    }
    ]

// 3. List the top 5 most common favorite fruits amoung users 
    [
    {
        $group:{
        _id: "$favoriteFruit", //Step1: Group them on this field
        count: {
            $sum: 1 //get the counting by summing it with 1 increment
        }
        }
    }, //another stage because we want to sort them by count field
    {
        $sort: {
        count: -1 //-1decending, 1 ascending
        }
    },
    {
        $limit: 5 //top 5
    }
    ]

// 4. Find the total number of males and female
    [
    {
        $group: {
        _id: "$gender",
        genderCount:{
            $sum: 1 //every unique value add 1
        }
        }
    }
    ]

// 5. Which country has the highest number of registered users?  
    [
      {
        $group: {
          _id: "$company.location.country",
          userCount: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          userCount: -1
        }
      },
      {
        $limit: 2
      }
    ]

// 6. List all unique eye colors present in the collection.
    [
      {
        $group: {
          _id: "$eyeColor",
          count:{
            $sum: 1
          }
        }
      }
    ]

  // 7. What is the average number of tags per user?
      [
        {
        $unwind: "$tags", //breaks the array into multiple documents
        },
        {
            $group: {
            _id: "$_id", //since it is unique 
            numberOfTags: {
                $sum: 1
            }
            }
        },
      {
          $group: { //grouping for avg 
          _id: null,
          averageNumberOfTags: {
              $avg: "$numberOfTags"
          }
          }
      }
    ]
    // OR 
    [
      {
          $addFields: { //adds the new field
          numberOfTags: {
              $size: {$ifNull: ["$tags", []]}
          }
          }
      },
      {$group: {
          _id: null,
          averageNumberOfTags: {
          $avg: "$numberOfTags"
          }
      }}
    ]

// 8. How many users have enim as one of their tag
    [
      {
          $match: {
          tags: "enim"
          }
      },
      {
          $count: 'userWithEnimTag'
      }
    ]

// 9. What are the names and age of users who are inactive and have "velit" as a tag 
  [
    {
      $match: {
        isActive: false, tags: "velit"
      }
    },
    {
      $project: {
        name: 1,
        age: 1
      }
    }
  ]
// 10. How many users have a phone number starting with '+1 (940)'
  [
    {
      $match: {
        "company.phone": /^\+1 \(940\)/
      }
    },
    {
      $count: 'usersWithPhoneNumber'
    }
  ]

// 11. Who has registered the most recently
  [
    {
      $sort: {
        registered: -1
      }
    },
    {
      $limit: 4
    },
    {
      $project: {
        name: 1,
        registered: 1,
        favoriteFruit: 1
      }
    }
  ]

// 12. Categorize users by their favorite Fruit
  [
    {
      $group: {
        _id: "$favoriteFruit",
        users: {
          $push: "$name",
        },
      },
    }
  ]
  // OR 
  [
    {
      $group: {
        _id: "$favoriteFruit",
        users:{
          $sum: 1
        }
      }
    }
  ]

  // 13. How many users have 'ad' as the second tag in their list of tags?
    [
      {
        $match: {
          "tags.1": "ad"
        }
      },
      {
        $count: 'secondTagAd'
      }
    ]

// 14. Find users who have both 'enim' and 'id' as their tags. 
    [
      {
        $match: {
          tags: {
            $all: ["enim", "id"],
          },
        },
      }
    ]

//15. List all the companies located in the USA with their corresponding user Count.
  [
    {
      $match: {
        "company.location.country": "USA"
      }
    },
    {
      $group: {
        _id: "$company.title", //we want company title not all count in USA(null)
        userCount:{
          $sum: 1
        }
      }
    }
  ]

// 16. LOOKUP from books to authors
[
  {
    $lookup: {
      from: "authors",
      localField: "author_id",
      foreignField: "_id",
      as: "author_details"
    }
  },
  {
    $addFields: {
      author_details: {
        $first: "$author_details"
      }
    }
  }
]

// OR both first and arrayElement at will do the same job

[
  {
    $lookup: {
      from: "authors",
      localField: "author_id",
      foreignField: "_id",
      as: "author_details"
    }
  },
  {
    $addFields: {
      author_details: {
        $arrayElemAt: ["$author_details",0]
      }
    }
  }
]