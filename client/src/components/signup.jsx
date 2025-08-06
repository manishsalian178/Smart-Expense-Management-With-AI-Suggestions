import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/Register', {name, email, password })
            .then(result => {
                console.log("Success:", result);
                navigate('/');
            })
            .catch(err => console.log("Error:", err));
    };

    return (
        <div>
            <section className="vh-100 gradient-custom">
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                            <div className="card bg-dark text-white" style={{ borderRadius: "1rem" }}>
                                <div className="card-body p-5 text-center">
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-md-5 mt-md-4 pb-5">
                                            <h2 className="fw-bold mb-2 text-uppercase">Signup</h2>
                                            <p className="text-white-50 mb-5">Please enter your email and password!</p>

                                            <div className="form-outline form-white mb-4">
                                                <input
                                                    type="text"
                                                    id="typeEmailX"
                                                    className="form-control form-control-lg"
                                                    placeholder='ENTER THE NAME'
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    required
                                                />
                                                <label className="form-label" htmlFor="typeEmailX">Name</label>
                                            </div>

                                            <div className="form-outline form-white mb-4">
                                                <input
                                                    type="email"
                                                    id="typeEmailX"
                                                    className="form-control form-control-lg"
                                                    placeholder='ENTER THE MAIL ID'
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                />
                                                <label className="form-label" htmlFor="typeEmailX">Email</label>
                                            </div>

                                            <div className="form-outline form-white mb-4">
                                                <input
                                                    type="password"
                                                    id="typePasswordX"
                                                    className="form-control form-control-lg"
                                                    placeholder='ENTER THE NAME'
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                />
                                                <label className="form-label" htmlFor="typePasswordX">Password</label>
                                            </div>

                                            <button className="btn btn-outline-light btn-lg px-5" type="submit">
                                                Signup
                                            </button>

                                            
                                        </div>

                                        <div>
                                            <p className="mb-0">
                                                Already have an account?{" "}
                                                <Link to="/" className="text-white-50 fw-bold">
                                                    Login
                                                </Link>
                                            </p>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Signup;
