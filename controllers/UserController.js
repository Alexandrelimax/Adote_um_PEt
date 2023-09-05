const User = require('../models/User');
const bcrypt = require('bcrypt');
const { validFields } = require('../helpers/validateFields')
const createToken = require('../helpers/createUserToken')
const getToken = require('../helpers/getToken')
const getUserByToken = require('../helpers/getUserByToken')
const jwt = require('jsonwebtoken');
require('dotenv').config()



module.exports = class UserController {


    static async register(req, res) {

        const { name, email, phone, password, confirm_password } = req.body

        const fields = {name, email, phone, password, confirm_password}
        const errors = validFields(fields)

        if (errors.length > 0) {
            return res.status(422).json({ message: errors })
        }

        if (password !== confirm_password) {
            return res.status(422).json({ message: 'A senha e a confirmaçao de senha são diferentes' })
        }

        try {
            const userExist = await User.findOne({ email })

            if (userExist) {
                return res.status(422).json({ message: 'Este usuário já existe. Por favor, utilize outro email.' })

            }

            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);

            const user = new User({ name, email, phone, password: hashPassword })

            const newUser = await user.save();

            await createToken(newUser, req, res);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Ocorreu um erro no servidor' })
        }

    }


    static async login(req, res) {

        
        const { email, password } = req.body;
        
        const fields = { email, password }
        const errors = validFields(fields)

        if (errors.length > 0) {
            return res.status(422).json({ message: errors });
        }

        try {
            const user = await User.findOne({ email })

            if (!user) {
                return res.status(404).json({ message: 'Este usuário não existe' });
            }

            const passwordMatch = await bcrypt.compare(password, user.password)

            if (!passwordMatch) {
                return res.status(401).json({ message: 'Senha incorreta' });
            }

            await createToken(user, req, res);

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro no servidor' })
        }



    }


    static async checkUser(req, res) {

        let currentUser;

        if (req.headers.authorization) {

            const token = getToken(req.headers.authorization)

            const decoded = jwt.verify(token, process.env.SECRET);

            currentUser = await User.findById(decoded.id)

            currentUser.password = undefined;

        } else {
            currentUser = null
        }
        res.status(200).send(currentUser)
    }

    
    static async getUserbyId(req, res) {

        const { id } = req.params

        const user = await User.findById(id).select('-password');

        if (!user) {
            return res.status(404).json('Não encontrado');
        }

        return res.status(200).json({ user })

    }



    static async editUser(req, res) {
        const { id } = req.params;
        const { name, email, phone, password, confirm_password } = req.body

        const fields = {name, email, phone}
        const errors = validFields(fields)

        if (errors.length > 0) {
            return res.status(422).json({ message: errors })
        }
        
        const token = getToken(req.headers.authorization)
        const user = await getUserByToken(token)

        
        let image = '';
        if(req.file){
            user.image = req.file.filename 
        }
        const userExist = await User.findOne({ email });

        if (user.email !== email && userExist) {
            return res.status(404).json('Este email já existe no sistema');

        }
        if (password !== confirm_password) {
            return res.status(422).json({ message: 'A senha e a confirmaçao de senha são diferentes' })

        }else if(password != null){
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            
            user.password = hashPassword
        }


        user.name = name;
        user.email = email;
        user.phone = phone;

        try {
            await User.findOneAndUpdate(
                { _id: user._id },
                { $set: user },
                { new: true })

            res.status(200).json({ message: 'usuário atualizado com sucesso' })

        } catch (error) {
            return res.status(500).json('Erro no servidor')
        }


    }

























}