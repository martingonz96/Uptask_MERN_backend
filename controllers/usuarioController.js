import { emailRegistro, emailOlvidePassword } from '../helpers/emails.js';
import generarId from '../helpers/generarID.js';
import generarJWT from '../helpers/generarJWT.js';
import Usuario from '../models/Usuario.js'


const registrar = async (req, res)=> {

    ///Evitar Registros duplicados
    const { email } = req.body;
    const existeUusario = await Usuario.findOne({ email })

    if(existeUusario) {
        const error = new Error('Usuario ya registrado')
        return res.status(400).json({ msg: error.message})
    }

    try {
        const usuario = new Usuario(req.body)
        usuario.token = generarId()
        await usuario.save()

        //Enviar email de confirmacion
        emailRegistro({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario. token
        })

        res.json({msg: 'Usuario creado correctamente, Revisa tu Email para confirmar tu cuenta'});
    } catch (error) {
        console.log(error)
    }

};

const autenticar = async (req, res)=> {

    const { email , password } = req.body

    // comprobar si usuario existe
    const usuario = await Usuario.findOne({email})
    if(!usuario){
        const error = new Error("El usuario no existe")
        return res.status(404).json({msg: error.message})
    }

    //comprobar que usuario este confirmado
    if(!usuario.confirmado){
        const error = new Error("Cuenta no confirmada")
        return res.status(403).json({msg: error.message})
    }

    //comprobar password
    if(await usuario.comprobarPassword(password)) {
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id)
        })
    } else {
        const error = new Error("Contrasena incorrecta")
        return res.status(402).json({msg: error.message})
    }
    
}

const confirmar = async (req, res)=> {

  const { token } = req.params

  const usuarioConfirmar = await Usuario.findOne({token})
  if(!usuarioConfirmar) {
    const error = new Error("Token no valido")
    return res.status(401).json({msg: error.message})
  }

  try {
    
    usuarioConfirmar.confirmado = true
    usuarioConfirmar.token = '';
    await usuarioConfirmar.save();
    res.json({msg: 'Usuario Confirmado correctamente'})
    console.log(usuarioConfirmar);

  } catch (error) {
    console.log(error)
  }

}

const olvidePassword= async (req, res)=>{

    const { email } = req.body

    // comprobar si usuario existe
    const usuario = await Usuario.findOne({email})
    if(!usuario){
        const error = new Error("El usuario no existe")
        return res.status(404).json({msg: error.message})
    }

    try {
        usuario.token = generarId()
        await usuario.save()
        //Enviar Email
        emailOlvidePassword({
            email: usuario.email,
            token: usuario.token,
            nombre: usuario.nombre
        })
        res.json({msg: "Hemos enviado un email con instrucciones"})
    } catch (error) {
        console.log(error)
    }

}


const comprobarToken = async (req, res)=>{

    const { token } = req.params


    const tokenValido = await Usuario.findOne({ token })

    if(tokenValido){
        res.json({msg: "Token Valido"})
    }
    else{
        const error = new Error("Token no valido")
        return res.status(404).json({msg: error.message})
    }

}


const nuevoPassword = async (req, res) => {

    const { token } = req.params
    const { password } = req.body

    const usuario = await Usuario.findOne({token})

    if(usuario) {
        usuario.password = password
        usuario.token = ""
        try {
            await usuario.save()
            res.json({msg: "password modificado correctamente"})
        } catch (error) {
            console.log(error)
        }
        
    }
    else {
        const error = new Error("Token no valido")
        return res.status(404).json({msg: error.message})
    }
}

const perfil = async (req, res)=>{
    const { usuario } = req

    res.json(usuario)
}

export {
    registrar,
    autenticar,
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil
}