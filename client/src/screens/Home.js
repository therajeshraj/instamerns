import { useEffect, useState, useContext } from "react"
import { useHistory, Link } from "react-router-dom"
import {UserContext} from '../App'

const Home = () => {

    const [data, setData] = useState([])
    const {state, dispatch} = useContext(UserContext)

    const history = useHistory()

    useEffect(() => {
        
        fetch("/allpost", {
            headers: {
                "Authorization": localStorage.getItem("jwt")
            }
        }) 
        .then(res=> res.json())
        .then(result=> {
            console.log(result)
            setData(result.posts)
            //console.log("------------------------",localStorage.getItem("jwt"))
        })
        .catch(err=> {
            console.log(err)
        }) 
        
    },[])

    const likePost = (id) => {
        
        fetch('/like', {
            method: "put",
            headers: {
                "Content-Type":"application/json",
                "Authorization": localStorage.getItem("jwt")
            },

            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
        .then(result => {

            const newData = data.map(item => {
                if(item._id == result._id) {
                    return result
                } else {
                    return item
                }
            })

            setData(newData)

            //console.log(result)
        })
        .then(err => {
            console.log(err)
        })
    }

    const unlikePost = (id) => {
        
        fetch('/unlike', {
            method: "put",
            headers: {
                "Content-Type":"application/json",
                "Authorization": localStorage.getItem("jwt")
            },

            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
        .then(result => {

            const newData = data.map(item => {
                if(item._id == result._id) {
                    return result
                } else {
                    return item
                }
            })

            setData(newData)

            //console.log(result)
        })
        .then(err => {
            console.log(err)
        })
    }

    const makeComment = (text, postId) => {

        fetch('/comment', {
            method: 'put',
            headers: {
                "Content-Type":"application/json",
                "Authorization": localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId,
                text:text
            })
        }).then(res => res.json())
        .then(result => {
            console.log(result)
            const newData = data.map(item => {
                if(item._id == result._id) {
                    return result
                } else {
                    return item
                }
            })

            setData(newData)
        })

    }

    const deletePost = (postId) => {
        fetch(`/deletepost/${postId}`, {
            method: 'delete',
            headers: {
                "Content-Type":"application/json",
                "Authorization": localStorage.getItem("jwt")
            },
        })
        .then(res => res.json())
        .then(result => {
            console.log(result)
            const newData = data.filter(item => {
                return item._id !== result._id
            })

            setData(newData)
        })
    }

    return (
        <div className="home">

            {
                data.map(item=> {
                    return (
                        <div className="card home-card" key={item._id}>
                            <h5>
                                
                                <Link to={ item.postedBy._id != state._id ? "/profile/"+item.postedBy._id : "/profile"}>
                                {item.postedBy.name}
                                </Link>
                                
                            {
                                item.postedBy._id == state._id &&
                                <i style={{float: "right", position: "unset"}} className="material-icons"
                                onClick ={() => {
                                    deletePost(item._id)
                                }}
                                >delete</i>
                            }

                                
                            </h5>

                            <div className="card-image">
                                <img
                                    src={ item.picture }
                                />
                            </div>
                            <div className="card-content">

                                <i className="material-icons">favorite</i>
                                
                                {
                                    item.likes.includes(state._id)?
                                    <i className="material-icons"
                                    onClick ={() => {
                                        unlikePost(item._id)
                                    }}
                                    >thumb_down</i>
                                :
                                    <i className="material-icons" 
                                    onClick ={() => {
                                        likePost(item._id)
                                    }}
                                    >thumb_up</i>
                                }

                                <h5>{item.likes.length}</h5> likes
                                <h5>{item.title}</h5>
                                <p>{item.body}</p>

                                {
                                    item.comments.map(record => {
                                        return (
                                            <h6 key={item._id}><span style={{fontWeight: 600}}>{record.postedBy.name}</span> {record.text} </h6>
                                        )
                                    })
                                }

                                <form onSubmit={(e)=> {
                                    e.preventDefault()
                                    makeComment(e.target[0].value, item._id)
                                }}>
                                    <input type="text" placeholder="add a comment" />
                                </form>
                            </div>
                        </div>
                    )
                })
            }

            

        </div>
    )

}

export default Home