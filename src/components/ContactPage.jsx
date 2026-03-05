import React, { useState } from 'react';
import Navbar from './Navbar';

function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Transmission Sent!\n\nName: ${formData.name}\nMessage: ${formData.message}`);
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <>
            <Navbar />
            <div className="contact-container">
                <h1 className="section-title">ESTABLISH CONTACT</h1>

                <form className="contact-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>IDENTITY (NAME)</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="input-field"
                        />
                    </div>

                    <div className="form-group">
                        <label>FREQUENCY (EMAIL)</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="input-field"
                        />
                    </div>

                    <div className="form-group">
                        <label>TRANSMISSION (MESSAGE)</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows="5"
                            className="input-field"
                        ></textarea>
                    </div>

                    <button type="submit" className="submit-btn">SEND TRANSMISSION</button>
                </form>
            </div>
        </>
    );
}

export default ContactPage;
