//import the array object data from data.js
import { tweetsData } from './data.js'
//import the csdn's uuid
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

//to tracking the click (like,retweet,reply,post)
document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
})
 
//handle the like
function handleLikeClick(tweetId){ 
    //to filter which post're clicked , and match which post , then assign to targetTweetObj array object
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]//make it only object not array 
    //if the post's isLiked is true , it will decrease the like
    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    //if the post's isLiked is false , it will increase the like
    else{
        targetTweetObj.likes++ 
    }
    //filp the isLiked true and false
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    //refresh the page
    render()
}

//handle the retweet
function handleRetweetClick(tweetId){
     //to filter which post're clicked , and match which post , then assign to targetTweetObj array object
     const reTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]//make it only object not array 
    
    //if the post's isRetweeted is true , it will decrease the retweet
    if(reTweetObj.isRetweeted){
        reTweetObj.retweets--
    }
    //if the post's isRetweeted is false , it will increase the retweet
    else{
        reTweetObj.retweets++
    }
    //filp the isRetweeted true and false
    reTweetObj.isRetweeted = !reTweetObj.isRetweeted
    //refresh the page
    render() 
}

//To showing the replies , if click the comment icon
function handleReplyClick(replyId){
    //remove or add the hidden class
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

//handle with post 
function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')
    //if textarea is not empty
    if(tweetInput.value){
        //add the post in the front
        tweetsData.unshift({
            handle: `@Gary Fung`,
            profilePic: `images/profile.jpg`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
        //refresh the page
    render()
    //to clear the textarea , when posted
    tweetInput.value = ''
    }

}

//To generate the page
function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        //set like's variable class default is empty
        let likeIconClass = ''
        //set like's variable class to liked (it will turn red)
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        //set retweet's variable class default is empty
        let retweetIconClass = ''
        //set retweet's variable class to liked (it will turn green)
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        //define a variable to store the comments
        let repliesHtml = ''
        //check if reply is exist , that means > 0
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }
        
          //define a variable to store the post
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>   
</div>
`
   })
   //passing back to render function
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

