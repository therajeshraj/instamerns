import React, {useState, useEffect} from 'react'
import {Link, useHistory, BrowserRouter} from 'react-router-dom'
import M from 'materialize-css'

const Signup = () => {

    const history = useHistory()
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")

    const [image, setImage] = useState("")
    const [url, setURL] = useState(undefined)


    const uploadPic = () => {

        const data = new FormData()
        data.append("file", image)
        data.append("upload_preset", "ins_clone")
        data.append("cloud_name", "rajeshlearnmern")

        fetch("https://api.cloudinary.com/v1_1/rajeshlearnmern/image/upload", {
            method: 'post',
            body: data
        }) 
        .then(res => res.json())
        .then(data => {
            console.log(data.url);
            setURL(data.url)
        })
        .catch(err=> {
            console.log(err)
        })

    }

    useEffect(()=> {

        if(url) {
            uploadFields()
        }

    }, [url])


    const uploadFields = () => {
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            return M.toast({html: "Invalid Email", classes:"#c62828 red darken-3"})
        }

        fetch("/signup", {
            method: 'post',
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password,
                pic: url
            })
        }) 
        .then(res=> res.json())
        .then(data=> {
            if(!data.status) {
                M.toast({html: data.message, classes:"#c62828 red darken-3"})
            } else {
                M.toast({html: data.message, classes:"#43a047 green darken-3"})
                history.push("/signin")
            }
            console.log(data)
        })
        .catch(err=> {
            console.log(err)
        })
    }


    const PostData = () => {

        if(image) {
            uploadPic()
        } else {
            uploadFields()
        }
    }

    return (
        <div className="mycard">
            
            <div className="card auth-card input-field">
            <h2>Instamerns</h2>
                <input
                    type="text"
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                    placeholder="Name"
                />
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

                <div className="file-field input-field">
                    <div className="btn">
                        <span>Upload Image</span>
                        <input
                            type="file"
                            name="file"
                            onChange={(e)=> setImage(e.target.files[0])}
                        />
                    </div>
                    <div className="file-path-wrapper">
                        <input
                            className="file-path validate"
                            type="text"
                        />
                    </div>
                </div>

                <button className="btn waves-effect waves-light #64b5f6 blue lighten-2"
                    onClick={()=> PostData()}
                >Sign Up</button>
                <h6>
                    <Link to="/signin">Already have an account ?</Link>
                </h6>
            </div>
        </div>
    )

}

export default Signup