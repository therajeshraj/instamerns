import React, {useState, useContext} from 'react'
import {Link, useHistory, useParams} from 'react-router-dom'
import M from 'materialize-css'
import {UserContext} from '../App'

const NewPassword = () => {

    const history = useHistory()
    const [password, setPassword] = useState("")
    
    const {token} = useParams()

    const PostData = () => {

        fetch("/new-password", {
            method: 'post',
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                password,
                token
            })
        }) 
        .then(res=> res.json())
        .then(data=> {

            // if(!data.status) {
            //     M.toast({html: data.message, classes:"#c62828 red darken-3"})
            // } else {

                M.toast({html: "Password Changed Successfully", classes:"#43a047 green darken-3"})
                history.push("/signin")

            //}

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
                    type="password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    placeholder="Enter New Password"
                />

                <button className="btn waves-effect waves-light #64b5f6 blue lighten-2" onClick={()=> PostData()}>Update Password</button>
            </div>
        </div>
    )

}

export default NewPassword