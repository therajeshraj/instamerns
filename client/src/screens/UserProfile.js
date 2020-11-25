import React, {useContext, useEffect, useState} from 'react'
import {UserContext} from '../App'
import {useParams} from 'react-router-dom'

const Profile = () => {

    const {userid} = useParams()

    const [userProfile, setProfile] = useState(null)
    const {state, dispatch} = useContext(UserContext)

    const [showFollow, setShowFollow] = useState(state?!state.following.includes(userid):true)

    

    useEffect(() => {

        //console.log("---------------",userid)
        
        fetch(`/user/${userid}`, {
            headers: {
                "Authorization": localStorage.getItem("jwt")
            }
        }) 
        .then(res=> res.json())
        .then(result=> {
            console.log(result)
            // setPics(result.posts)
            // setUser(result.user)
            setProfile(result)

            
            //console.log("------------------------",localStorage.getItem("jwt"))
        })
        .catch(err=> {
            console.log(err)
        }) 
        
    },[])

    const followUser = (uid) => {
        fetch('/follow', {
            method: 'put',
            headers: {
                "Content-Type":"application/json",
                "Authorization": localStorage.getItem("jwt")
            },
            
            body: JSON.stringify({
                followId: uid
            })
        })
        .then(res => res.json())
        .then(result => {
            console.log(result)

            dispatch({action: "UPDATE", payload:{followers: result.followers, following: result.following}})
            localStorage.setItem("user", JSON.stringify(result))

            setProfile((prevState)=>{
                return {
                    ...prevState,
                    user: {
                        ...prevState.user,
                        followers: [...prevState.user.followers, result._id]
                    }
                }
            })
            setShowFollow(false)
        })
    }

    const unfollowUser = (uid) => {
        fetch('/unfollow', {
            method: 'put',
            headers: {
                "Content-Type":"application/json",
                "Authorization": localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                unfollowId: uid
            })
        })
        .then(res => res.json())
        .then(result => {
            console.log(result)

            dispatch({action: "UPDATE", payload:{followers: result.followers, following: result.following}})
            localStorage.setItem("user", JSON.stringify(result))

            setProfile((prevState)=>{

                const newFollower = prevState.user.followers.filter(item=>item != result._id)

                return {
                    
                    ...prevState,
                    user: {
                        ...prevState.user,
                        followers: newFollower
                    }
                }
            })
            setShowFollow(true)
        })
    }

    return (
        <>
        {userProfile ? 
        <div>
            <div style = {{
                display: "flex",
                justifyContent:"space-around",
                margin: "18px 0px",
                borderBottom: "1px solid #ccc"
            }}>
                <div>
                    <img style={{width: "160px", height: "160px", borderRadius: "80px"}} 
                    src={userProfile?userProfile.user.pic:""}
                    />
                </div>
                <div>
                    <h4>{userProfile?userProfile.user.name:"Loading..."}</h4>
                    <h5>{userProfile?userProfile.user.email:"Loading..."}</h5>

                    <div style = {{
                        display: "flex",
                        justifyContent:"space-between",
                        width: "108%",
                        
                    }}>
                        <h5> {userProfile.posts.length} posts </h5>
                        <h5>{userProfile?userProfile.user.followers.length:"Loading..."} followers </h5>
                        <h5> {userProfile?userProfile.user.following.length:"Loading..."} following </h5>

                    </div>

                    <div style = {{
                        display: "flex",
                        justifyContent:"space-between",
                        width: "108%",
                        
                    }}>

                        {showFollow? 
                            <button
                                className="btn  #c62828 red darken-3"
                                onClick={() => {
                                    followUser(userid)
                                }}

                            >Follow</button>
                        :
                            <button
                                className="btn  #c62828 red darken-3"
                                onClick={() => {
                                    unfollowUser(userid)
                                }}
                                
                            >Unfollow</button>
                        }
                        

                    </div>

                </div>

                
            
            </div>
            <div className="gallery">

                {
                    userProfile.posts.map(items=> {
                        return (
                            <img key={items._id} className="item" src={items.picture} alt="AA"/> 
                        )
                    })
                }
                
            </div>
        </div>
        :<h2>Loading</h2>}
        </>
    )

}

export default Profile