<?php

namespace App;

enum UserRole: string
{
    case Admin = 'admin';
    case Operator = 'operator';
    case Courier = 'courier';
    case Washer = 'washer';
}
