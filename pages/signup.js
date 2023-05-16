import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import 'bootstrap/dist/css/bootstrap.min.css';
import style from '../styles/Home.module.css';
import FormData from "form-data";
import { redirect } from 'next/navigation';
import { getSession, getProviders, signIn } from "next-auth/react";

export default function Signup() {
	const submitForm = async (event) => {
		event.preventDefault();
		let i1 = document.getElementById('fullname'), i2 = document.getElementById('username'), i3 = document.getElementById('password');

		let formData = new FormData();
		formData.append('fullname', i1.value);
		formData.append('username', i2.value);
		formData.append('password', i3.value);
		
		const r = await fetch('https://www.techcentral.cloud/registerTwitterUser', {
			method: 'POST',
			body: formData
        });
		
		console.log('Response is: ', r.r);
		const response = await r.json();
		
		if (response.r === 'no') alert('The username already exits!');
		else await signIn("credentials", {username: i2.value, password: i3.value});
		
	};
	
	return (
		<>
		<Head>
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<title>Twitter / Signup</title>
			<link rel="icon" href="/favicon.ico" />
		</Head>
	  
		<main>
			<Link href="/"><Image id = 'twitter-logo' src="/images/twitter_logo1.png" height={68} width={83.5} alt = "twitter icon" /></Link><br /><br />
			<form onSubmit={submitForm} id = 'login-form'>
				<p id = 'login-heading'>Sign up</p><br />
				<div class = "input-group mb-2">
					<input id = 'fullname' type="text" class="form-control rounded" placeholder="Fullname" aria-label="fullname" aria-describedby="basic-addon2" required/><br />
				</div>
				<br />
				<div class = "input-group mb-2">
					<input id = 'username' type="text" class="form-control rounded" placeholder="Username" aria-label="username" aria-describedby="basic-addon2" required/><br />
				</div>
				<br />
				<div class = "input-group mb-2">
					<input id = 'password' type="password" class="form-control rounded" placeholder="Password" aria-label="password" aria-describedby="basic-addon2" required/><br />
				</div>
				<br /><br />
				<button type = 'submit' className = {style.whiteButton}>Continue</button>
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