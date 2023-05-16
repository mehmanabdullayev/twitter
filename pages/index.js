import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Router from "next/router";
import 'bootstrap/dist/css/bootstrap.min.css';
import style from '../styles/Home.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faSearch, faImage, faAnchor} from "@fortawesome/free-solid-svg-icons";
import { getSession, useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";

export default function Index({initials}) {
	const { data: session, status } = useSession();
	const [tweets, setTweets] = useState(initials[0]);
	const [followers, setFollowers] = useState([]);
	const [following, setFollowing] = useState([]);
	const [users, setUsers] = useState([]);
	const [profileInfo, setProfileInfo] = useState([]);
	const [usersTypes, setUsersTypes] = useState('');
	const [whoToFollow, setWhoToFollow] = useState(initials[1]);
	const [title1, setTitle1] = useState('');
	
	console.log('Follow:', whoToFollow);
	
	useEffect(() => {
        const id = setInterval(async () => {
			let formData = new FormData(), e = document.getElementById('feed');	
			if (e.style.display !== 'none') {
				formData.append('username', session.user.username);
				
				const r = await fetch('https://www.techcentral.cloud/getTweets', {
					method: 'POST',
					body: formData
				});
		
				const response = await r.json();
				setTweets(response.tweets);
				if (document.getElementById('title1') === null || document.getElementById('title1').value !== 'Search results') {
					if (response.whoToFollow.length != 0) {
						setTitle1('Who to follow'); setWhoToFollow(response.whoToFollow);
					}
				}
			}       
		}, 10000);
        return () => clearInterval(id);
    }, [tweets])
	
	console.log('Tweets:', tweets);

	function openNav() {
		document.getElementById("panel").style.display = "block";
	}

	function closeNav() {
		document.getElementById("panel").style.display = "none";
	}
	
	const logout = (e) => {
		e.preventDefault()
		signOut();
	};
	
	const sendTweet = async (event) => {
		event.preventDefault();
		let i1 = document.getElementById('tweet-area'), formData = new FormData();
		
		formData.append('tweet', event.target.childNodes[0].value);
		formData.append('username', session.user.username);
		
		const r = await fetch('https://www.techcentral.cloud/tweet', {
			method: 'POST',
			body: formData
        });
		
		const response = await r.json();
		console.log('r is:', response.tweets);
		setTweets(response.tweets);
		setTitle1('Who to follow');
		Router.reload();
		
	};
	
	const addComment = async (event, id) => {
		event.preventDefault();
		let i1 = document.getElementById('tweet-area'), formData = new FormData();
		
		formData.append('id', id);
		formData.append('comment', event.target.childNodes[0].value);
		formData.append('username', session.user.username);
		
		const r = await fetch('https://www.techcentral.cloud/addComment', {
			method: 'POST',
			body: formData
        });
		
		const response = await r.json();
		Router.reload();
		
	};

	const displayProfile = async (event, username) => {
		event.preventDefault();
		let i1 = document.getElementById('profile'), formData = new FormData(), i2 = document.getElementById('feed');
		i1.style.display = 'block'; i2.style.display = 'none';
		let i3 = document.getElementById('user-tweets'), i4 = document.getElementById('users');
		i3.style.display = 'block'; i4.style.display = 'none';

		formData.append('username', username);
		formData.append('requestingUser', session.user.username);
		
		const r = await fetch('https://www.techcentral.cloud/profile_info', {
			method: 'POST',
			body: formData
        });
		
		const response = await r.json();
		
		setTweets(response.tweets);
		setFollowers(response.followers);
		setFollowing(response.following);
		setProfileInfo([response.fullname, username]);
		
	};
	
	const goFeed = async (event) => {
		event.preventDefault();
		setTitle1('Who to follow');
		Router.reload()
		
	};
	
	const likeTweet = async (event, id) => {
		event.preventDefault();
		let formData = new FormData();
		
		formData.append('id', id);
		formData.append('user', session.user.username);
				
		const r = await fetch('https://www.techcentral.cloud/likeTweet', {
			method: 'POST',
			body: formData
        });
		
		Router.reload();
		
	};

	const displayUsers = async (event, users, value) => {
		event.preventDefault();
		let i1 = document.getElementById('user-tweets'), i2 = document.getElementById('users');
		i1.style.display = 'none'; i2.style.display = 'block';
		setUsers(users);
		setUsersTypes(value);
		
	};

	const searchUsers = async (event) => {
		event.preventDefault();
		let i1 = document.getElementById('search-phrase'), formData = new FormData();

		formData.append('searchPhrase', i1.value);
		
		const r = await fetch('https://www.techcentral.cloud/searchUsers', {
			method: 'POST',
			body: formData
        });
		
		const response = await r.json();
		
		setWhoToFollow(response.results);	
		setTitle1('Search results');
	};
	
	const followUser = async (event, username) => {
		event.preventDefault();
		let formData = new FormData();

		formData.append('following', username);
		formData.append('follower', session.user.username);
		
		const r = await fetch('https://www.techcentral.cloud/followUser', {
			method: 'POST',
			body: formData
        });
		
		const response = await r.json();
		
		await displayProfile(event, username);	
	};
	
	const unfollowUser = async (event, username) => {
		event.preventDefault();
		let formData = new FormData();

		formData.append('following', username);
		formData.append('follower', session.user.username);
		
		const r = await fetch('https://www.techcentral.cloud/unfollowUser', {
			method: 'POST',
			body: formData
        });
		
		const response = await r.json();
		
		await displayProfile(event, username);	
	};
	
	return (
    <>
      <Head>
		<meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Twitter - Main</title>
        <link rel="icon" href="/favicon.ico" />
	  </Head>
	  
      <main>
			<Link href="/"><Image id = 'twitter-logo' src="/images/twitter_logo.png" height={30} width={30} alt = "twitter icon" /></Link>
			<span id = 'profileIcon' onClick = {openNav}><Image src="/images/profile_icon.png" height={15} width={15} alt = "Profil Icon" /> &nbsp; {session.user.fullname}</span>
			
			<div id = 'panel'>
				<div className = {style.sidepanel}>
					<Link href = '' className = {style.closebtn} onClick = {closeNav}>×</Link>
					<Link href="/"><Image src="/images/home_icon.png" height={15} width={15} alt = "home icon" /> &nbsp; Home</Link>
					<Link href = '' onClick={(e) => displayProfile(e, session.user.username)}><Image src="/images/profile_icon.png" height={15} width={15} alt = "profile icon" /> &nbsp; Profile</Link><br />
					<Link href = '' onClick={(e) => logout(e)}>Logout</Link>
				</div>
			</div>
			
			<div className = {style.row}>
				<div className = {style.column + ' ' + style.left}>
					<div className = {style.sidepanel}>
						<Link href="" onClick = {goFeed}><Image src="/images/home_icon.png" height={20} width={20} alt = "home icon" /> &nbsp; {session.photo} Home</Link>
						<Link href = '' onClick={(e) => displayProfile(e, session.user.username)}><Image src="/images/profile_icon.png" height={20} width={20} alt = "profile icon" /> &nbsp; Profile</Link><br />
						<Link href = '' onClick={(e) => logout(e)}>Logout</Link>
					</div>
				</div>
				
				<div className = {style.column + ' ' + style.middle + ' ' + 'pb-5 pt-5'}>
					<div id = 'feed'>
						<form className = {style.tweetForm} onSubmit={sendTweet}>
							<textarea name = 'tweet' className = {style.tweetArea} placeholder = 'What is happening?!' required></textarea><br /><br />
							<button type = 'submit' id = 'tweet-button'>Tweet</button>
						</form>
						<br /><br /><br />
							{tweets.map((tweet) => (
								<div class = 'row m-1 w-95 border-bottom'>
									<div class="col-12 p-5 pb-2 tweets">
										<p><b>{tweet[2]}</b> <Link href = '' onClick={(e) => displayProfile(e, tweet[3])}>@{tweet[3]}</Link> &nbsp; on {tweet[1].substring(0, 19)} <br />
										{tweet[0]}<br /><br /><Image src = '/images/comment_icon.png' height = {18} width = {20}/> &nbsp; {tweet[6].length} &nbsp; &nbsp; <Link onClick={(e) => likeTweet(e, tweet[5])} href = '' class = 'text-decoration-none'><Image src = '/images/like_icon.png' height = {17} width = {18} /> &nbsp; {tweet[4]}</Link></p>
										{tweet[6].map((comment) => (
										<p>{comment}</p>
										))}
										<form className = {style.commentForm + ' ' + 'p-3 pb-1'} onSubmit={(e) => addComment(e, tweet[5])}>
											<textarea name = 'tweet' className = {style.tweetArea} placeholder = 'Add comment ...' required></textarea><br /><br />
											<button type = 'submit' id = 'tweet-button'>Reply</button>
										</form>
										<br /><br />
									</div>
								</div>
							))}

					</div>

					<div id = 'profile'>
						<form className = {style.tweetForm} onSubmit={sendTweet}>
							<textarea name = 'tweet' className = {style.tweetArea} placeholder = 'What is happening?!' required></textarea><br /><br />
							<button type = 'submit' id = 'tweet-button'>Tweet</button>
						</form>
						<br /><br /><br /><br /><br /><br />
						<h3>{profileInfo[0]}</h3>
						<p>@{profileInfo[1]} &nbsp; &nbsp; {profileInfo[1] === session.user.username ? '' : followers.some(function(user) { return user.includes(session.user.username) }) ? <Link href = '' onClick={(e) => unfollowUser(e, profileInfo[1])}>Unfollow</Link> : <Link href = '' onClick={(e) => followUser(e, profileInfo[1])}>Follow</Link>}</p>
						<p><Link href = '' onClick={(e) => displayUsers(e, followers, 'Followers')}>Followers: {followers.length}</Link> &nbsp; &nbsp; &nbsp; <Link href = '' onClick={(e) => displayUsers(e, following, 'Following')}>Following: {following.length}</Link></p>
						
						<div id = 'user-tweets'>
							{tweets.map((tweet) => (
								<div class = 'row m-1 w-95 border-bottom'>
									<div class="col-12 p-5 pb-2 tweets">
										<p><b>{tweet[2]}</b> <Link href = '' onClick={(e) => displayProfile(e, tweet[3])}>@{tweet[3]}</Link> &nbsp; on {tweet[1].substring(0, 19)} <br />
										{tweet[0]}<br /><br /><Image src = '/images/comment_icon.png' height = {18} width = {20}/> &nbsp; {tweet[6].length} &nbsp; &nbsp; <Link onClick={(e) => likeTweet(e, tweet[5])} href = '' class = 'text-decoration-none'><Image src = '/images/like_icon.png' height = {17} width = {18} /> &nbsp; {tweet[4]}</Link></p>
										<br />
										{tweet[6].map((comment) => (
										<p>{comment}</p>
										))}
										<form className = {style.commentForm + ' ' + 'p-3 pb-1'} onSubmit={(e) => addComment(e, tweet[5])}>
											<textarea name = 'tweet' className = {style.tweetArea} placeholder = 'Add comment ...' required></textarea><br /><br />
											<button type = 'submit' id = 'tweet-button'>Reply</button>
										</form>
										<br /><br />
									</div>
								</div>
							))}
						</div>

						<div id = 'users'>
							<h5>{usersTypes}</h5><br />
							<ul>
							{users.map((user) => (
								<li>
									<p>{user[0]} <Link href = '' onClick={(e) => displayProfile(e, user[1])}>@{user[1]}</Link></p>
								</li>
							))}
							</ul>
						</div>
					</div>
				</div>
				
				<div className = {style.column + ' ' + style.right}>
					<div class="container">
						<div class="row height d-flex justify-content-center align-items-center">
							<div class="col-md-12">
								<div class="form">
									<form id = 'search-form' onSubmit = {searchUsers}>
										<input type="text" id = 'search-phrase' class="form-control form-input" placeholder="Search Twitter" />
										<input type="submit" hidden />
									</form>
								</div>  
							</div>
						</div>           
					</div>
					<br /><br />
					{title1 !== '' ?
						<div class="container p-4 my-4 trends rounded"> 
							<h1 id = 'title1' className = {style.title}>{title1}</h1>
							{whoToFollow.map((result) => (
								<div class = 'row m-1 w-95 border-bottom'>
									<div class="col-12 p-3 pt-4 tweets">
										<p><b>{result[0]}</b> <Link href = '' onClick={(e) => displayProfile(e, result[1])}>@{result[1]}</Link> {title1 === 'Who to follow' ? <Link href = '' onClick={(e) => followUser(e, result[1])}><b>Follow</b></Link> : ''}</p>
									</div>
								</div>
							))}  
						</div> 
						: ''
						}
				</div>
			</div>
      </main>
    </>  
	);
}

export const getServerSideProps = async (context) => {
	const session = await getSession(context);
	if(context.res && session === null) {
		return {
			redirect: {
				permanent: false,
				destination: '/auth/login'
			}
		}
	}
  
	let formData = new FormData();
		
	formData.append('username', session.user.username);
		
	const r = await fetch('https://www.techcentral.cloud/getTweets', {
		method: 'POST',
		body: formData
    });
		
	const response = await r.json();

	return {
		props: { session, initials: [response.tweets, response.whoToFollow] }
	}
}