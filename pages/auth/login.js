import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import 'bootstrap/dist/css/bootstrap.min.css';
import style from '../../styles/Home.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faSearch, faImage, faAnchor} from "@fortawesome/free-solid-svg-icons";
import { getProviders, getSession, useSession, signIn, signOut } from "next-auth/react";
import { useRef } from "react";

export default function Login() {
	const { data: session, status } = useSession()
	const username = useRef("");
    const password = useRef("");
	
	console.log('Session is: ', session);
	
	return (
		<>
		<Head>
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<title>Twitter / Login</title>
			<link rel="icon" href="/favicon.ico" />
		</Head>
	  
		<main>
			<Link href="/"><Image id = 'twitter-logo' src="/images/twitter_logo1.png" height={68} width={83.5} alt = "twitter icon" /></Link><br /><br />
			<form id = 'login-form'>
				<p id = 'login-heading'>Login</p><br />
				<div class = "input-group mb-2">
					<input onChange={(e) => (username.current = e.target.value)} type="text" class="form-control rounded" placeholder="Username" aria-label="username" aria-describedby="basic-addon2" /><br />
				</div>
				<br />
				<div class = "input-group mb-2">
					<input onChange={(e) => (password.current = e.target.value)} type="password" class="form-control rounded" placeholder="Password" aria-label="password" aria-describedby="basic-addon2" /><br />
				</div>
				<br />
				<button 
					type = 'button' 
					onClick={() => signIn("credentials", {username: username.current, password: password.current})} 
					className = {style.whiteButton}>Continue</button>
				<br /><br /><br />
				
				<a id = 'link' href = '/signup'>Sign up</a>
			</form>
		</main>
		<style jsx global>
			{`body { background: #008FE7; }`}
		</style>
		</>  
	);
}

export async function getServerSideProps(context) {
    const { req } = context;
    const session = await getSession({ req });
    const providers = await getProviders()
	
    if (session !== null) {
        return {
            redirect: { destination: "/" },
        };
    }
    return {
        props: {
            providers,
        },
    }
}