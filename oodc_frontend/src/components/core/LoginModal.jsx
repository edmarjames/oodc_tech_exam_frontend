// react imports
import React, { useState, useContext } from 'react'

// external imports
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from 'axios';

// internal imports
import AppContext from '../../utils/AppContext';


export default function LoginModal() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useContext(AppContext);

  function resetStates() {
    setUsername('');
    setPassword('');
  };
  async function handleSubmit() {
    try {
      const res = await axios.post('http://127.0.0.1:8000/login/', {
        username,
        password,
      });
      const data = res.data;
      if (data?.message == 'Login successful') {
        setUser({
          username: username,
          isAdmin: true
        });
        localStorage.setItem('username', username);
        localStorage.setItem('isAdmin', true);
      } else if (data?.error) {
        setError(data?.error);
      };
    } catch (error) {
      console.error('Login failed', error);
      setError(error?.response?.data?.error);
    } finally {
      resetStates();
    }
  };

  return (
    <Dialog onOpenChange={(open) => !open && setError('')}>
      <DialogTrigger asChild>
        <Button className='mt-5 mr-7'>Login as admin</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
          <DialogDescription className={error ? 'text-red-500' : ''}>
            {error ? error : 'Enter your username and password.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" className="col-span-3" onChange={(e) => setUsername(e.target.value)} value={username}/>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <Input id="password" type='password' className="col-span-3" onChange={(e) => setPassword(e.target.value)} value={password}/>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Login</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
