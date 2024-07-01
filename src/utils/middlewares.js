export const resolveUserByID = (request, response, next) => {
    const {
        params: {id}
    } = request;

    const parsedId = parseInt(id);
    if(isNaN(parsedId)) return response.status(400);
    const findUserIndex = mockUsers.findIndex(
        (user) => user.id == parsedId
    )
    if(findUserIndex === -1) return response.sendStatus(404);
    request.findUserIndex = findUserIndex;//modifying request on the go
    next();
}

export const validateUser = (body) => {
    const { username, displayName } = body;

    if (!username || typeof username !== 'string' || !displayName || typeof displayName !== 'string') {
        return false;
    }

    return true;
};