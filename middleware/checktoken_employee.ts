import tokenService from "../services/tokenservices";

var checkToken_Employee =  async (req, res, next) => {
    let token = req.headers['authorization']
    if (token === undefined) {
        res.status(400).json({
            statusName: 'none token'
        })
    }
    if (await tokenService.checkExprire_Employee(token) === false){
        res.status(400).json({
            statusName: 'Expired Token'
        })
    }
    else {
        next()
    }
}
export default checkToken_Employee