import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGetToken, useValidate } from '../../hooks';

const UserValidation = () => {
	const navigate = useNavigate();

	useEffect(() => {
		navigate('/Home');
	}, []);

	// useGetToken();
	// useValidate(validationStatus, setValidationStatus);

	return null;
};

export default UserValidation;
