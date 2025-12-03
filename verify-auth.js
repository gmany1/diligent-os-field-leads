// Native fetch in Node 18+
async function verifyAuth() {
    try {
        console.log('Checking redirection from / ...');
        const res = await fetch('http://localhost:3000', { redirect: 'manual' });
        console.log('Status:', res.status);
        console.log('Location:', res.headers.get('location'));

        if (res.status === 307 && res.headers.get('location').includes('/login')) {
            console.log('Middleware redirection SUCCESS!');
        } else {
            console.error('Middleware redirection FAILED');
        }

        console.log('Checking /login page...');
        const loginRes = await fetch('http://localhost:3000/login');
        console.log('Login Page Status:', loginRes.status);

        if (loginRes.status === 200) {
            console.log('Login page access SUCCESS!');
        } else {
            console.error('Login page access FAILED');
        }

        console.log('Attempting Login...');
        const authRes = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@diligentos.com', password: 'admin123' })
        });

        console.log('Auth Status:', authRes.status);
        const cookie = authRes.headers.get('set-cookie');
        console.log('Cookie:', cookie);

        if (authRes.ok && cookie && cookie.includes('session=')) {
            console.log('Login SUCCESS!');

            console.log('Accessing protected Dashboard with cookie...');
            const dashRes = await fetch('http://localhost:3000', {
                headers: { 'Cookie': cookie }
            });
            console.log('Dashboard Status:', dashRes.status);

            if (dashRes.status === 200) {
                console.log('Dashboard access SUCCESS!');
            } else {
                console.error('Dashboard access FAILED');
            }

        } else {
            console.error('Login FAILED');
        }

    } catch (error) {
        console.error('Auth Verification ERROR:', error);
    }
}

verifyAuth();
