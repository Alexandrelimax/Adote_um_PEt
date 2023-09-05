const getToken = (token) => {

    const formattedtoken = token.split(' ')[1]

    return formattedtoken;


}
module.exports = getToken;