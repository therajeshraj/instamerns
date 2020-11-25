import React, {useContext, useEffect, useState} from 'react'
import {UserContext} from '../App'

const Profile = () => {

    const [pics, setPics] = useState([])
    const {state, dispatch} = useContext(UserContext)

    const [image, setImage] = useState("")

    useEffect(() => {
        
        fetch("/mypost", {
            headers: {
                "Authorization": localStorage.getItem("jwt")
            }
        }) 
        .then(res=> res.json())
        .then(result=> {
            console.log(state)
            setPics(result.mypost)
            //console.log("------------------------",localStorage.getItem("jwt"))
        })
        .catch(err=> {
            console.log(err)
        }) 
        
    },[])

    const sendPic = (url) => {
        console.log("---------------------------------",url)
        fetch("/updatepic", {
            method:'put',
            headers: {
                "Content-Type":"application/json",
                "Authorization": localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                pic:url
            })
        }) 
        .then(res=> res.json())
        .then(result=> {
            console.log(result)
            localStorage.setItem("user", JSON.stringify({...state, pic: result.pic}))
            dispatch({type:"UPDATEPIC", payload: result.pic})
        })
        .catch(err=> {
            console.log(err)
        }) 
    }

    useEffect(() => {
        if(image) {
            uploadPic()
        }
    },[image])

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
            console.log(data)
            
            sendPic(data.url)
        })
        .catch(err=> {
            console.log(err)
        })

    }

    const updatePic = (file) => {
        setImage(file)
    }

    return (
        <div>
            <div style = {{
                display: "flex",
                justifyContent:"space-around",
                margin: "18px 0px",
                borderBottom: "1px solid #ccc"
            }}>
                <div>
                    <div>
                        <img style={{width: "160px", height: "160px", borderRadius: "80px"}} 
                        src={state?state.pic:""}
                        />
                    </div>

                    <div className="file-field input-field">
                        <div className="btn">
                            <span>Upload Profile</span>
                            <input
                                type="file"
                                name="file"
                                onChange={(e)=> updatePic(e.target.files[0])}
                            />
                        </div>
                        <div className="file-path-wrapper">
                            <input
                                className="file-path validate"
                                type="text"
                            />
                        </div>
                    </div>

                </div>
                <div>
                    <h4>{state?state.name:"Loading..."}</h4>
                    <h5>{state?state.email:"Loading..."}</h5>

                    <div style = {{
                        display: "flex",
                        justifyContent:"space-between",
                        width: "108%",
                        
                    }}>
                        <h5> {pics?pics.length:"0"} posts </h5>
                        <h5> {state?state.followers.length:"0"} followers </h5>
                        <h5> {state?state.following.length:"0"} following </h5>

                    </div>

                    

                </div>
            
            </div>
            <div className="gallery">

                {
                    pics.map(items=> {
                        return (
                            <img key={items._id} className="item" src={items.picture} alt="AA"/> 
                        )
                    })
                }
                
            </div>
        </div>
    )

}

export default Profile