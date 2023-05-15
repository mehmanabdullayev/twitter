import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";

export default NextAuth({
    providers: [
        CredentialProvider({
			name: 'credentials',
			credentials: {
				username: {label: 'Username', type: 'text', placeholder: 'Your username'},
				password: {label: 'Password', type: 'password'}
			},
			async authorize(credentials, req) {
				let formData = new FormData();
				formData.append('username', credentials.username);
				formData.append('password', credentials.password);
				
				const r = await fetch('https://www.techcentral.cloud/loginTwitterUser', {
					method: 'POST',
					body: formData
				});
				
				const user = await r.json();
				
                if (r.ok && user.r === 'login') {
                    return user;
                } else return null;
			}
		})
    ],
	callbacks: {
		jwt: ({token, user}) => {
			return { ...token, ...user };
		},
		session: ({session, token}) => {
			session.user = token;
            return session;
		}
	},
	secret: process.env.NextAuth_SECRET,
	jwt: {
		secret: process.env.NextAuth_SECRET,
		encryption: true
	}
});