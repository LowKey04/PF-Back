import express from 'express'
import bcrypt from 'bcrypt'
import cors from 'cors'
import {initializeApp} from 'firebase/app'
import {collection, getDoc,doc,setDoc,getFirestore, updateDoc, getDocs} from 'firebase/firestore'

//credenciales de firebase
const firebaseConfig = {
    apiKey: "AIzaSyCH8SshrcxBz9KDQ06mSkstcWSvAtxho8E",
    authDomain: "proyectofinallmalv.firebaseapp.com",
    projectId: "proyectofinallmalv",
    storageBucket: "proyectofinallmalv.appspot.com",
    messagingSenderId: "790860952980",
    appId: "1:790860952980:web:36157a20827fd0fda74b81"
}

//inicializar firebase
const firebase = initializeApp(firebaseConfig)
const db = getFirestore()

//inicializar el server
const app = express()

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
}

//Midleware
app.use(cors(corsOptions))
app.use(express.json())

//rutas de trabajo
app.post('/new-user',(req,res)=>{
    let {nombre, apaterno, amaterno, email, telefono, password}=req.body

    if(!nombre.length){
        res.json({
            'alert':'Falta de agregar nombre'
        })
    }   else if(!apaterno.length){
        res.json({
            'alert':'Falta de agregar el apellido paterno'
        })
    }   else if(!email.length){
        res.json({
            'alert':'Falta de agregar el usuario'
        })
    }   else if(!password.length){
        res.json({
            'alert':'Falta de agregar password'
        })
    }

    const usuarios = collection(db, 'usuarios')

    getDoc(doc(usuarios,email)).then(user =>{
        if(user.exists()){
            res.json({
                'alert':'El usuario ya existe'
            })
        }else{
            //encriptar la contraseña
            bcrypt.genSalt(10, (err,salt)=>{
                bcrypt.hash(password, salt, (err, hash)=>{
                    const data ={
                        nombre,
                        apaterno,
                        amaterno,
                        email,
                        telefono,
                        password: hash
                    }

                    setDoc(doc(usuarios,email),data).then(data=>{
                        res.json({
                            'alert':'success',
                            data
                        })
                    })
                })
            })
        }
    }).catch(error=>{
        res.json({
            'alert':'Error de Conexion'
        })
    })
})
app.get('/get-users', async(req ,res)=>{
    try {
        const usuarios =[];
        const data = await collection(db, 'usuarios')
        const docs = await getDocs(data)
        docs.forEach((doc)=>{
            usuarios.push(doc.data())
        })
            //console.log('@@@ usuarios =>',usuarios)
        res.json({
            'alert': 'success',
            usuarios
        })
        }catch(error){
        res.json({
            'alert':'error getting data',
            error
        })
    }
})

app.post('/delete-user',(req, res)=>{
    const email=req.body.email
    deleteDoc(doc(collection(db,'usuarios'), email))
    .then(data=>{
        res.json({
            'alert':'success'
        })
    })
    .catch(err =>{
        res.json({
            'alert':'error',
            err
        })
    })
})

app.post('/edit-user', async (req,res) =>{
    const {nombre,apaterno,amaterno,telefono,password,email} =req.body
    const edited = await updateDoc(doc(db, 'usuarios', email),{
        nombre,
        apaterno,
        amaterno,
        telefono
    })

    res.json({
        'alert':'edited',
        edited
    })
    /*
    const data = await collection(db,'usuarios')
    const docs = await getDoc(doc(data, email))
    console.log('@@ doc =>', usuario)
    */
})
//encender el servidor en modo escucha
app.listen(5000,()=>{
    console.log('servidor trabajando: 5000')
})