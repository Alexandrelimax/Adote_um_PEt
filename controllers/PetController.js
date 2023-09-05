const getToken = require('../helpers/getToken');
const getUserByToken = require('../helpers/getUserByToken');
const { validFields } = require('../helpers/validateFields');
const Pet = require('../models/Pet');
const ObjectId = require('mongoose')



module.exports = class PetController {
    static async create(req, res) {

        const { name, age, weight, color } = req.body
        const images = req.files

        if (images.length == 0) {
            return res.status(422).json({ message: 'A imagem é obrigatória' })
        }

        const obj = { name, age, weight, color }
        const errors = validFields(obj)

        if (errors.length > 0) {
            return res.status(422).json({ message: errors })
        }

        const available = true

        const token = getToken(req.headers.authorization)
        const user = await getUserByToken(token)


        const pet = new Pet({
            name,
            age,
            weight,
            color,
            available,
            images: [],
            user: {
                _id: user._id,
                name: user.name,
                image: user.image,
                phone: user.phone
            },
        })

        images.map(image => {
            pet.images.push(image.filename)
        })

        try {
            await pet.save()
            return res.status(201).json({ message: 'Pet criado' })
        } catch (error) {
            return res.status(500).json({ message: 'Erro no servidor' })
        }

    }


    static async getAll(req, res) {

        const pets = await Pet.find().sort('-createdAt');

        return res.status(200).json(pets)
    }


    static async getAllUserPets(req, res) {

        const token = getToken(req.headers.authorization);

        const user = await getUserByToken(token);

        const pets = await Pet.find({ 'user._id': user._id }).sort('-createdAt')

        return res.status(200).json(pets)

    }


    static async getAllUserAdoptions(req, res) {

        const token = getToken(req.headers.authorization);

        const user = await getUserByToken(token);

        const pets = await Pet.find({ 'adopter._id': user._id }).sort('-createdAt')

        return res.status(200).json(pets)
    }


    static async getPetById(req, res) {

        const { id } = req.params

        if (!ObjectId.isValidObjectId(id)) {
            return res.status(422).json({ message: 'id inválido' })
        }

        const pet = await Pet.findById(id)

        if (!pet) {
            return res.status(404).json('Este pet não foi encontrado')
        }

        return res.status(200).json(pet)

    }

    static async removePetById(req, res) {

        const { id } = req.params

        if (!ObjectId.isValidObjectId(id)) {
            return res.status(422).json({ message: 'id inválido' })
        }

        const pet = await Pet.findById(id)

        if (!pet) {
            return res.status(404).json('Este pet não foi encontrado')
        }

        const token = getToken(req.headers.authorization);

        const user = await getUserByToken(token)

        if (pet.user._id.toString() !== user._id.toString()) {
            return res.status(403).json({ message: 'Não autorizado, você não pode remover o pet de outra pessoa' })

        }

        await Pet.findByIdAndRemove(id)

        return res.status(200).json({ message: 'Pet removido com sucesso' })


    }

    static async updatePetById(req, res) {

        const { id } = req.params

        let updatedData = {}

        const { name, age, weight, color } = req.body

        const fields = { name, age, weight, color }
        const errors = validFields(fields)

        if (errors.length > 0) {
            return res.status(422).json({ message: errors })
        } else {
            updatedData = { ...fields }
        }
        console.log(updatedData);

        const images = req.files

        if (images.length == 0) {
            return res.status(422).json({ message: 'A imagem é obrigatória' })
        } else {
            updatedData.images = []
            images.map(image => {
                updatedData.images.push(image.filename)
            })
        }
        console.log(updatedData);

        await Pet.findByIdAndUpdate(id, updatedData)

        return res.status(200).json({ message: 'Pet Atualizado com sucesso' })


    }

    static async schedule(req, res) {

        const { id } = req.params

        const pet = await Pet.findById(id)

        if (!pet) {
            return res.status(404).json({ message: 'Este pet não foi encontrado' })
        }

        const token = getToken(req.headers.authorization);

        const user = await getUserByToken(token);

        if (pet.user._id.equals(user._id)) {
            return res.status(403).json({ message: 'Este pet pertence a você' })
        }

        if (pet.adopter) {
            if (pet.adopter._id.equals(user._id)) {
                return res.status(402).json({ message: 'Você ja agendou uma visita com este pet' })
            }
        }

        pet.adopter = {
            _id: user._id,
            name: user.name,
            image: user.image
        }

        await Pet.findByIdAndUpdate(id, pet)

        return res.status(200).json({ message: `A visita foi agendada com sucesso entre em contato com ${pet.user.name} pelo telefone ${pet.user.phone}` })

    }

    static async concludeAdoption(req, res) {

        const { id } = req.params;

        const pet = await Pet.findById(id)

        if (!pet) {
            return res.status(404).json({ message: 'Este pet não foi encontrado' })
        }

        const token = getToken(req.headers.authorization);

        const user = await getUserByToken(token);

        if (!pet.user._id.equals(user._id)) {
            return res.status(403).json({ message: 'Somente o dono do pet pode finalizar o processo de adoção' })
        }

        pet.available = true;


        await Pet.findByIdAndUpdate(id, pet);

        return res.status(200).json({ message: 'Processo de adoção concluído.' })






    }
}



