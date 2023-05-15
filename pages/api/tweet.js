import {File} from '@web-std/file';
import FormData from "form-data";
import { getSession, useSession, signIn, signOut } from "next-auth/react";

export default function handler(req, res) {
	if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only POST requests allowed' })
        return
    }
	
    const { data: session, status } = useSession();
	
	const body = JSON.parse(JSON.stringify(req.body));
	
	let formData = new FormData();
	formData.append('username', session.user.username);
	formData.append('tweet', credentials.password);
				
	const r = await fetch('https://www.techcentral.cloud/loginTwitterUser', {
		method: 'POST',
		body: formData
	});
	
	
};