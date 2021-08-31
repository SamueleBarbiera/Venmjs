<?php

namespace App\GraphQL\Types;

use App\User;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Type as GraphQLType;

class UserType extends GraphQLType
{
    protected $attributes = [
        'name' => 'User',
        'description' => 'Collection of users',
        'model' => User::class
    ];


    public function fields(): array
    {
        return [
            'id' => [
                'type' => Type::nonNull(Type::int()),
                'description' => 'Id of a particular book',
            ],
            'name' => [
                'type' => Type::nonNull(Type::string()),
                'description' => 'name of the user',
            ],
            'age' => [
                'type' => Type::nonNull(Type::string()),
                'description' => 'age of the user',
            ],
            'description' => [
                'type' => Type::nonNull(Type::string()),
                'description' => 'description of the user',
            ]
        ];
    }
}
