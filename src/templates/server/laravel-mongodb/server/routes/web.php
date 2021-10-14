<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('add','UserController@create');
Route::post('add','UserController@store');
Route::get('car','UserController@index');
Route::get('edit/{id}','UserController@edit');
Route::post('edit/{id}','UserController@update');
Route::delete('{id}','UserController@delete');
