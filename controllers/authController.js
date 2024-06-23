const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
require('dotenv').config();

const registerUser = async(req, res) =>{

}

const loginUser = async(req, res) => {

}

const forgotPassword = async(req, res) => {

}

const getUserById = (req, res) => {

}

module.exports = {
    registerUser,
    loginUser,
    forgotPassword,
    getUserById
}