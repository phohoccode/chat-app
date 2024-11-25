const userModel = require('../Models/userModel')
const bcrypt = require("bcrypt")
const validator = require("validator")
const jwt = require("jsonwebtoken")

const createToken = (_id) => {
    const jwtKey = process.env.JWT_SECRET_KEY

    return jwt.sign({ _id }, jwtKey, {
        expiresIn: '3d'
    })
}

const registerUser = async (req, res) => {
    try {
        console.log(req.body)
        const { name, email, password } = req.body

        let user = await userModel.findOne({ email })

        if (user) {
            return res.status(400).json("Email đã được đăng ký bởi tài khoản khác!")
        }

        if (!name || !email || !password) {
            return res.status(400).json("Tất cả trường name, email, password là bắt buộc!")
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json("Email phải là email hợp lệ!")
        }

        if (!validator.isStrongPassword(password)) {
            return res.status(400).json("Mật khẩu phải chứa chữ cái in hoa hoặc kí tự đặc biệt!")
        }

        user = new userModel({ name, email, password })

        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)

        await user.save()

        const token = createToken(user._id)

        return res.status(200).json({
            _id: user._id, name, email, token
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }

}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        let user = await userModel.findOne({ email })

        if (!user) {
            return res.status(400).json("Thông tin đăng nhập không chính xác!")
        }

        const isValidPassword = await bcrypt.compare(password, user.password)

        if (!isValidPassword) {
            return res.status(400).json("Mật khẩu không đúng!")
        }


        const token = createToken(user._id)

        return res.status(200).json({
            _id: user._id, name: user.name, email: user.email, token
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

const findUser = async (req, res) => {
    try {
        const userId = req.params.userId

        const user = await userModel.findById(userId)

        res.status(200).json(user)
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}

const getUsers = async (req, res) => {
    try {
        const userId = req.params.userId

        const users = await userModel.find()

        res.status(200).json(users)
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}


module.exports = {
    registerUser,
    loginUser,
    findUser,
    getUsers
}