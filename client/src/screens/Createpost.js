import React, {useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import M from 'materialize-css'

const Createpost = () => {

    const history = useHistory()

    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [image, setImage] = useState("")
    const [url, setURL] = useState("")

    useEffect(() => {

        if(url) {

            fetch("/createPost", {
                method: 'post',
                headers: {
                    "Content-Type":"application/json",
                    "Authorization": localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    title,
                    body,
                    pic: url
                })
            }) 
            .then(res=> res.json())
            .then(data=> {
                if(!data.status) {
                    M.toast({html: "Post Not Created", classes:"#c62828 red darken-3"})
                    history.push("/")
                } else {
                    M.toast({html: "Post Created Successfully", classes:"#43a047 green darken-3"})
                    history.push("/")
                }
                console.log(data)

                //console.log("------------------------",localStorage.getItem("jwt"))
            })
            .catch(err=> {
                console.log(err)
            })
            
        } else {
            console.log("No Effect")
        }
    }, [url])

    const postDetails = () => {

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

    return (
        <div className="mycard">
            
            <div className="card auth-card input-field">
            <h2>Instamerns</h2>
                <input
                    type="text"
                    value={title}
                    onChange={(e)=>setTitle(e.target.value)}
                    placeholder="Title"
                />

                <input
                    type="text"
                    value={body}
                    onChange={(e)=>setBody(e.target.value)}
                    placeholder="Body"
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

                <br/>
                <button className="btn waves-effect waves-light #64b5f6 blue lighten-2"
                    onClick={ ()=>postDetails() }
                >
                    Add Post
                </button>
                
            </div>
        </div>
    )

}

export default Createpost