import React, {useState, useContext} from 'react'
import {Link, useHistory} from 'react-router-dom'
import M from 'materialize-css'
import {UserContext} from '../App'

const SignIn = () => {

    const {state, dispatch} = useContext(UserContext)

    const history = useHistory()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    

    const PostData = () => {

        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            return M.toast({html: "Invalid Email", classes:"#c62828 red darken-3"})
        }

        fetch("/signin", {
            method: 'post',
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        }) 
        .then(res=> res.json())
        .then(data=> {
            if(!data.status) {
                M.toast({html: data.message, classes:"#c62828 red darken-3"})
            } else {
                localStorage.setItem("jwt", data.token)
                localStorage.setItem("user",JSON.stringify(data.user))
                dispatch({type: "USER", payload: data.user})
                M.toast({html: "SignedIn Successfully", classes:"#43a047 green darken-3"})
                history.push("/")
            }
            console.log(data)
        })
        .catch(err=> {
            console.log(err)
        })

    }

    return (
        <div className="mycard">
            
            <div className="card auth-card input-field">
            <h2>Instamerns</h2>
                <input
                    type="text"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    placeholder="Email"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    placeholder="Password"
                />

                <button className="btn waves-effect waves-light #64b5f6 blue lighten-2" onClick={()=> PostData()}>Login</button>
                <h6>
                    <Link to="/signup">Don't have an account ?</Link>
                </h6>
                <h6>
                    <Link to="/reset">Forgot Password ?</Link>
                </h6>
            </div>
        </div>
    )

}

export default SignIn