import React from 'react'
import axios from 'axios';
const RegisterForm = () => {
    const [user, setUser] = React.useState({
        id: null,
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        authenticationType: 'EMAIL'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { firstName, lastName, email, password, authenticationType } = user;
        if (!firstName || !lastName || !email || !password || !authenticationType) {
            alert('Please fill in all fields');
            return;
        }
        const registeredUser = await axios.post('http://localhost:8080/api/auth/register', user)

        console.log('User registered:', registeredUser.data);
    }
    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="firstName" placeholder="First Name" value={user.firstName} onChange={handleChange} />
            <input type="text" name="lastName" placeholder="Last Name" value={user.lastName} onChange={handleChange} />
            <input type="email" name="email" placeholder="Email" value={user.email} onChange={handleChange} />
            <input type="password" name="password" placeholder="Password" value={user.password} onChange={handleChange} />
            
            <button type="submit">Register</button>
        </form>
    )
}

export default RegisterForm;