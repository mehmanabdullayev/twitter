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

export default function Index() {
	const { data: session, status } = useSession();
	const [tweets, setTweets] = useState([]);
	const [followers, setFollowers] = useState([]);
	const [following, setFollowing] = useState([]);
	const [users, setUsers] = useState([]);
	const [searchResults, setSearchResults] = useState([]);
	const [profileInfo, setProfileInfo] = useState([]);

	useEffect(()=>{
		setTweets(session.user.tweets);
	}, [])
	
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
		
		formData.append('tweet', i1.value);
		formData.append('username', session.user.username);
		
		const r = await fetch('https://www.techcentral.cloud/tweet', {
			method: 'POST',
			body: formData
        });
		
		const response = await r.json();
		console.log('r is:', response.tweets);
		setTweets(response.tweets);
		
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
	
	const goFeed = async (event, username) => {
		event.preventDefault();
		Router.reload()
		
	};

	const displayUsers = async (event, users) => {
		event.preventDefault();
		let i1 = document.getElementById('user-tweets'), i2 = document.getElementById('users');
		i1.style.display = 'none'; i2.style.display = 'block';
		setUsers(followers);
		
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
		
		setSearchResults(response.results);		
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
	
	return (
    <>
      <Head>
		<meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Twitter - Main</title>
        <link rel="icon" href="/favicon.ico" />
	  </Head>
	  
      <main>
			<Link href="/"><Image id = 'twitter-logo' src="/images/twitter_logo.png" height={30} width={30} alt = "twitter icon" /></Link><br /><br /><br />
			<span id = 'profileIcon' onClick = {openNav}><Image src="/images/profile_icon.png" height={15} width={15} alt = "Profil Icon" /> &nbsp; {session.user.fullname}</span>
			
			<div id = 'panel'>
				<div className = {style.sidepanel}>
					<Link href = '' className = {style.closebtn} onClick = {closeNav}>×</Link>
					<Link href="/"><Image src="/images/home_icon.png" height={15} width={15} alt = "home icon" /> &nbsp; Home</Link>
					<Link href="/notifications"><Image src="/images/bell_icon.png" height={15} width={15} alt = "notification icon" /> &nbsp; Notifications</Link>
					<Link href="/messages"><Image src="/images/message_icon.png" height={15} width={15} alt = "messages icon" /> &nbsp; Messages</Link>
					<Link href="/profile"><Image src="/images/profile_icon.png" height={15} width={15} alt = "profile icon" /> &nbsp; Profile</Link>
				</div>
			</div>
			
			<div className = {style.row}>
				<div className = {style.column + ' ' + style.left}>
					<div className = {style.sidepanel}>
						<Link href="" onClick = {goFeed}><Image src="/images/home_icon.png" height={20} width={20} alt = "home icon" /> &nbsp; {session.photo} Home</Link>
						<Link href="/notifications"><Image src="/images/bell_icon.png" height={20} width={20} alt = "notification icon" /> &nbsp; Notifications</Link>
						<Link href="/messages"><Image src="/images/message_icon.png" height={20} width={20} alt = "messages icon" /> &nbsp; Messages</Link>
						<Link href="/profile"><Image src="/images/profile_icon.png" height={20} width={20} alt = "profile icon" /> &nbsp; Profile</Link><br />
						<Link href = '' onClick={(e) => logout(e)}>Logout</Link>
					</div>
				</div>
				
				<div className = {style.column + ' ' + style.middle}>
					<div id = 'feed'>
						<form id = 'tweet-form' onSubmit={sendTweet}>
							<textarea name = 'tweet' id = 'tweet-area' placeholder = 'What is happening?!' required></textarea><br /><br />
							<button type = 'submit' id = 'tweet-button'>Tweet</button>
						</form>
						<br /><br /><br />
							{tweets.map((tweet) => (
								<div class = 'row m-1 w-95 border-bottom'>
									<div class="col-12 p-5 tweets">
										<p><b>{tweet[2]}</b> <Link href = '' onClick={(e) => displayProfile(e, tweet[3])}>@{tweet[3]}</Link> &nbsp; on {tweet[1].substring(0, 19)} <br />
										{tweet[0]}</p>
									</div>
								</div>
							))}

					</div>

					<div id = 'profile'>
						<form id = 'tweet-form' onSubmit={sendTweet}>
							<textarea name = 'tweet' id = 'tweet-area' placeholder = 'What is happening?!' required></textarea><br /><br />
							<button type = 'submit' id = 'tweet-button'>Tweet</button>
						</form>
						<br /><br /><br /><br /><br /><br />
						<h3>{profileInfo[0]}</h3>
						<p>@{profileInfo[1]} &nbsp; &nbsp; {profileInfo[1] === session.user.username ? '' : <Link href = '' onClick={(e) => followUser(e, profileInfo[1])}>Follow</Link>}</p>
						<p><Link href = '' onClick={(e) => displayUsers(e, {followers})}>Followers: {followers.length}</Link> &nbsp; &nbsp; &nbsp; <Link href = '' onClick={(e) => displayUsers(e, {following})}>Following: {following.length}</Link></p>
						
						<div id = 'user-tweets'>
							{tweets.map((tweet) => (
								<div class = 'row m-1 w-95 border-bottom'>
									<div class="col-12 p-5 tweets">
										<p><b>{tweet[2]}</b> <Link href = '' onClick={(e) => displayProfile(e, tweet[3])}>@{tweet[3]}</Link> &nbsp; on {tweet[1].substring(0, 19)} <br />
										{tweet[0]}</p>
									</div>
								</div>
							))}
						</div>

						<div id = 'users'>
							<ul>
							{users.map((user) => (
								<li>
									<p>{user[0]}</p>
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
					<div class="container p-4 my-4 trends rounded">
						<h1 className = {style.title}>Who to follow</h1>
						{searchResults.map((result) => (
							<div class = 'row m-1 w-95 border-bottom'>
								<div class="col-12 p-5 tweets">
									<p><b>{result[0]}</b> <Link href = '' onClick={(e) => displayProfile(e, result[1])}>@{result[1]}</Link> <Link href = '' onClick={(e) => followUser(e, result[1])}><b>Follow</b></Link></p>
								</div>
							</div>
						))}
					</div>
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

  return {
    props: { session }
  }
}
