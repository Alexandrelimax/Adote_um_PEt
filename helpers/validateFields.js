const errorsMessages = {
    name: 'O campo nome é obrigatório',
    email: 'O campo email é obrigatório',
    phone: 'O campo telefone é obrigatorio',
    password: 'O campo senha é obrigatório',
    confirm_password: 'A confirmação de senha é diferente da senha',

    age: 'O campo idade é obrigatório',
    weight:'O campo peso é obrigatório',
    color: 'O campo cor é obrigatório',
    images: 'A imagem é obrigatória',
    available: 'O campo disponivel é obrigatório'



}


const validFields = (fields) => {
    const collectionErros = []
    for (const key in fields) {
        if (!fields[key]) {
            collectionErros.push(errorsMessages[key])
        }
    }
    return collectionErros;

}

module.exports = { validFields }
































