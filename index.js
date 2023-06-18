// const express = require('express');
import express from 'express';
import dotenv from 'dotenv'
import conectarDB from './config/db.js';
import usuarioRouter from './routes/usuarioRouter.js'
import proyectoRouter from './routes/proyectoRouter.js'
import tareaRouter from './routes/tareaRouter.js'
import cors from 'cors'

dotenv.config(); // Load environment variables

const app = express();

app.use(cors());

app.use(express.json());

conectarDB();

///Configurar Cors
const whitelist = [process.env.FRONTEND_URL];

const corsOption = {
    origin: function(origin, callback){
        if(whitelist.includes(origin)){
        //Puede consultar API
        callback(null, true)
        }
        else {
        //No esta permitido
        callback(new Error('Error de Cors'))
        }
    }
}

//Routing
app.use('/api/usuarios', usuarioRouter)
app.use('/api/proyectos', proyectoRouter)
app.use('/api/tareas', tareaRouter)

const PORT = process.env.PORT || 3000

const servidor = app.listen(PORT, ()=> {
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})

//Socket.io

import { Server, Socket } from 'socket.io'

const io = new Server(servidor, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.FRONTEND_URL,   
    },
});

io.on('connection', (socket) => {
    console.log('Conectado a socket.io');

    //Definir los eventos de socket io
    socket.on('abrir proyecto', (proyecto)=> {
        socket.join(proyecto);
    })

    socket.on('nueva tarea', (tarea)=> {
        const proyecto = tarea.proyecto
        socket.to(proyecto).emit('tarea agregada', tarea)
    })

    socket.on('eliminar tarea', (tarea)=> {
        const proyecto = tarea.proyecto
        socket.to(proyecto).emit('tarea eliminada', tarea)
    })

    socket.on('actualizar tarea', tarea=> {
        const proyecto = tarea.proyecto._id;
        socket.to(proyecto).emit('tarea actualizada', tarea);

    })

    socket.on('cambiar estado', tarea => {
        const proyecto = tarea.proyecto._id
        socket.to(proyecto).emit('nuevo estado', tarea)
    })

})