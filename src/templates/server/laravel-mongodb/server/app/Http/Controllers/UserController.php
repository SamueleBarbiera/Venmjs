<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Users;

class UserController extends Controller
{
    public function create()
    {
        return view('usercreate');
    }
    public function index()
    {
        $users=Users::all();
        return view('userindex',compact('user'));
    }
    public function store(Request $request)
    {
        $users=new Users();
        $users->name = $request->get('name');
        $users->age = $request->get('age');
        $users->description = $request->get('description');
        $users->save();
        return redirect('user')->with('success', 'user has been successfully added');
    }
    public function edit($id)
    {
        $users = Users::find($id);
        return view('useredit',compact('user','id'));
    }
    public function update(Request $request, $id)
    {
        $users= USers::find($id);
        $users->name = $request->get('name');
        $users->age = $request->get('age');
        $users->description = $request->get('description');
        $users->save();
        return redirect('user')->with('success', 'user has been successfully update');
    }
    public function delete($id)
    {
        $users = Users::find($id);
        $users->delete();
        return redirect('user')->with('success','user has been  deleted');
    }
}

