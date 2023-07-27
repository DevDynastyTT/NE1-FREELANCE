const authUser = async (request, response, next) => {
    console.log('Checking session')
    console.log('Session', request.session?.user)

    if(!request.session || !request.session.authenticated)
        return response.status(401).json({ error: "Unauthorized" });
    console.log('Authorized')
    return next()
}   

module.exports = authUser