import React, {useState, useContext} from 'react'
import {Link, useHistory} from 'react-router-dom'
import M from 'materialize-css'
import {UserContext} from '../App'

const Reset = () => {

    const history = useHistory()
    const [email, setEmail] = useState("")
    

    const PostData = () => {

        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            return M.toast({html: "Invalid Email", classes:"#c62828 red darken-3"})
        }

        fetch("/reset-password", {
            method: 'post',
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                email
            })
        }) 

        .then(res=> res.json())
        .then(data=> {
            // if(!data.status) {
            //     M.toast({html: data.error, classes:"#c62828 red darken-3"})
            // } else {
                M.toast({html: data.message, classes:"#43a047 green darken-3"})
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
                    type="text"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    placeholder="Email"
                />

                <button className="btn waves-effect waves-light #64b5f6 blue lighten-2" onClick={()=> PostData()}>Reset Password</button>
                
            </div>
        </div>
    )

}

export default Reset