import React, {useEffect, createContext, useReducer, useContext} from 'react'
import NavBar from './components/Navbar'
import './App.css'

import {BrowserRouter, Route, Switch, useHistory} from 'react-router-dom'

import Home from './screens/Home'
import Signin from './screens/SignIn'
import Profile from './screens/Profile'
import Signup from './screens/Signup'
import Createpost from './screens/Createpost'
import UserProfile from './screens/UserProfile'
import SubscribedPosts from './screens/SubscribedPosts'
import Reset from './screens/Reset'
import NewPassword from './screens/NewPassword'

import {reducer, initialState} from './reducers/userReducer'
export const UserContext = createContext()

//rajesh86552

//5j6vwJQrHF99GFQ$

const Routing = () => {

  const history = useHistory()
  const {state, dispatch} = useContext(UserContext)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    //console.log("-----------------------------------",user)

    if(user) {
      dispatch({type: "USER", payload: user})
      //history.push('/')
    } else {
      if (!history.location.pathname.startsWith('/reset')) {
        history.push('/signin')
      }
      
    }
  }, [])  

  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/signin">
        <Signin />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route exact path="/reset">
        <Reset />
      </Route>
      <Route path="/reset/:token">
        <NewPassword />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route path="/create">
        <Createpost />
      </Route>
      <Route path="/profile/:userid">
        <UserProfile />
      </Route>
      <Route path="/subposts">
        <SubscribedPosts />
      </Route>
    </Switch>
  )
}


function App() {

  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    // <UserContext.Provider value={{state, dispatch}}>
      // <NavBar />
      <BrowserRouter>
        <UserContext.Provider value={{state, dispatch}}>

          <NavBar />
          <Routing />

        </UserContext.Provider>
      </BrowserRouter>
    //  </UserContext.Provider>
  );
}

export default App;
