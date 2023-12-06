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

//rutas de trabajo para tabla pacientes
app.post('/new_patient',(req,res)=>{
    let {Nombre, Apellidos, Email, Telefono,Edad, Cumple, Genero,Direccion,Tratamiento,TSangre}=req.body
    const generosPermitidos = ['male', 'female', 'other']
    if(!Nombre.length){
        res.json({
            'alert':'Falta de agregar Nombre'
        })
    }   else if(!Apellidos.length){
        res.json({
            'alert':'Falta de agregar el apellido paterno'
        })
    }   else if(!Email.length){
        res.json({
            'alert':'Falta de agregar el usuario'
        })
    }else if (!generosPermitidos.includes(Genero)){
        res.json({ error: 'Selecciona una de las opciones de genero'
    })
    }

    const pacientes = collection(db, 'pacientes')

    getDoc(doc(pacientes,Email)).then(patient =>{
        if(patient.exists()){
            res.json({
                'alert':'El usuario ya existe'
            })
        }else{
                    const data ={
                        Nombre,
                        Apellidos,
                        Email,
                        Telefono,
                        Edad,
                        Cumple,
                        Genero,
                        Direccion,
                        Tratamiento,
                        TSangre
                    }

                    setDoc(doc(pacientes,Email),data).then(data=>{
                        res.json({
                            'alert':'success',
                            data
                        })
                    })
        }
    }).catch(error=>{
        res.json({
            'alert':'Error de Conexion'
        })
    })
})
app.get('/get-patients', async(req ,res)=>{
    try {
        const pacientes =[];
        const data = await collection(db, 'pacientes')
        const docs = await getDocs(data)
        docs.forEach((doc)=>{
            pacientes.push(doc.data())
        })
            //console.log('@@@ pacientes =>',pacientes)
        res.json({
            'alert': 'success',
            pacientes
        })
        }catch(error){
        res.json({
            'alert':'error getting data',
            error
        })
    }
})

app.post('/delete-patient',(req, res)=>{
    const Email=req.body.Email
    deleteDoc(doc(collection(db,'pacientes'), Email))
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

app.post('/edit-patient', async (req,res) =>{
    const {Nombre, Apellidos, Email, Telefono,Edad, Cumple, Genero, Direccion, Tratamiento, TSangre} =req.body
    const edited = await updateDoc(doc(db, 'pacientes', Email),{
        Nombre,
        Apellidos,
        Telefono,
        Edad,
        Cumple,
        Genero,
        Direccion,
        Tratamiento,
        TSangre
    })

    res.json({
        'alert':'edited',
        edited
    })
    /*
    const data = await collection(db,'pacientes')
    const docs = await getDoc(doc(data, Email))
    console.log('@@ doc =>', usuario)
    */
})


//rutas de trabajo para tabla pacientes
app.post('/new_appointment',(req,res)=>{
    let {Nombre, Email, Telefono, Edad, Genero, Cita, Hora, TipoCita, Status}=req.body
    const generosPermitidos = ['male', 'female', 'other']
    const OpCitas = ['Checkup', 'Surgery']
    if(!Nombre.length){
        res.json({
            'alert':'Falta de agregar Nombre'
        })
    }else if(!Email.length){
        res.json({
            'alert':'Falta de agregar el usuario'
        })
    }else if (!generosPermitidos.includes(Genero)){
        res.json({ error: 'Escoge una de las opciones de genero'
    })
    }else if (!OpCitas.includes(TipoCita)){
        res.json({ error: 'Marca que tipo de cita requieres'
    })
}
    Status = 'upcoming'
    const citas = collection(db, 'citas')

    getDoc(doc(citas,Email)).then(appointment =>{
        if(appointment.exists()){
            res.json({
                'alert':'El usuario ya existe'
            })
        }else{
                    const data ={
                        Nombre, 
                        Email, 
                        Telefono, 
                        Edad, 
                        Genero, 
                        Cita, 
                        Hora, 
                        TipoCita, 
                        Status
                    }

                    setDoc(doc(citas,Email),data).then(data=>{
                        res.json({
                            'alert':'success',
                            data
                        })
                    })
        }
    }).catch(error=>{
        res.json({
            'alert':'Error de Conexion'
        })
    })
})
app.get('/get-appointment', async(req ,res)=>{
    try {
        const citas =[];
        const data = await collection(db, 'citas')
        const docs = await getDocs(data)
        docs.forEach((doc)=>{
            citas.push(doc.data())
        })
            //console.log('@@@ citas =>',citas)
        res.json({
            'alert': 'success',
            citas
        })
        }catch(error){
        res.json({
            'alert':'error getting data',
            error
        })
    }
})

/*app.post('/delete-patient',(req, res)=>{
    const Email=req.body.Email
    deleteDoc(doc(collection(db,'pacientes'), Email))
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
*/
app.post('/edit-appointment', async (req,res) =>{
    const {Nombre, Email, Telefono, Edad, Genero, Cita, Hora, TipoCita, Status} =req.body
    Status= 'Cancelled'
    const edited = await updateDoc(doc(db, 'citas', Email),{
        Nombre,
        Email,
        Telefono,
        Edad,
        Genero,
        Cita,
        Hora,
        TipoCita,
        Status
    })

    res.json({
        'alert':'edited',
        edited
    })
    /*
    const data = await collection(db,'pacientes')
    const docs = await getDoc(doc(data, Email))
    console.log('@@ doc =>', usuario)
    */
})


//encender el servidor en modo escucha
app.listen(5000,()=>{
    console.log('servidor trabajando: 5000')
})