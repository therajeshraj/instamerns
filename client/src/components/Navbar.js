import React, {useContext, useRef, useEffect, useState} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {UserContext} from '../App'
import M from 'materialize-css'

const NavBar = () => {

    const searchModal = useRef(null)
    const history = useHistory()
    const {state, dispatch} = useContext(UserContext)
    const [search, setSearch] = useState("")
    const [userDetails, setUserDetails] = useState([])

    useEffect(() => {
        M.Modal.init(searchModal.current)
    },[])

    const fetchUser = (query) => {
        setSearch(query)

        fetch('/search-users', {
            method: 'post',
            headers: {
                "Content-Type":"application/json",
                "Authorization": localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                query
            })
        }).then(res => res.json())
        .then(result => {
            setUserDetails(result.user)
            console.log(result)
        })
        .catch(err => {
            console.log(err)
        })
    }

    const renderList = () => {
        if(state) {
            return [
                <li><i data-target="modal1" className="material-icons modal-trigger" style={{color: "black"}}>search</i></li>,
                <li><Link to="/profile">Profile</Link></li>,
                <li><Link to="/subposts">Subscribed Post</Link></li>,
                <li><Link to="/create">Create Post</Link></li>,
                // <li><Link to="/signin">Logout</Link></li>
                <button className="btn  #c62828 red darken-3"
                    onClick={ ()=>{
                        localStorage.clear()
                        dispatch({type: "CLEAR"})
                        history.push('signin')
                    } }
                >
                    Logout
                </button>
            ]
        } else {
            return [
                <li><Link to="/signin">Login</Link></li>,
                <li><Link to="/signup">Signup</Link></li>
            ] 
        }
    }

    return (
        
        <nav>
            <div class="nav-wrapper white">
                <div class="container">
                <Link to={state?"/":"/signin"} class="brand-logo left">Instamerns</Link>
                <ul id="nav-mobile" class="right hide-on-med-and-down">
                    {renderList()}
                </ul>
                </div>
            </div>

            <div id="modal1" className="modal" ref={searchModal} style={{color:"black"}}>
                <div class="modal-content">
                    <input 
                        type="text"
                        placeholder="search users"
                        value={search}
                        onChange={(e) => fetchUser(e.target.value)}
                    />
                    <ul class="collection">

                        {userDetails.map(item=>{
                            return (
                            <Link to={ item._id != state._id ? "/profile/"+item._id : "/profile"} onClick={() => {
                                M.Modal.getInstance(searchModal.current).close()
                            }}>
                                <li className="collection-item" style={{width: "100%", color:"black"}}>{item.email}</li>
                            </Link>
                            )
                        })}
                    
                    </ul>
                </div>
                
                <div className="modal-footer">
                <a href="#!" className="modal-close waves-effect waves-green btn-flat" onClick={() => setSearch('')}>Close</a>
                </div>
            </div>
        </nav>
      
    )

}

export default NavBar