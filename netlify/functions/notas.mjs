// API de preparación: /api/notas (listar, crear, borrar), /api/adjuntos (subir y ver imágenes)
// y /api/textos (cambios puntuales de texto; se leen sin contraseña).
import {getStore} from '@netlify/blobs';
import {handle} from '../lib/notas.mjs';
import {secretOf} from '../lib/acceso.mjs';

export default async req=>handle(req,{
 notes:getStore({name:'notas',consistency:'strong'}),
 files:getStore({name:'adjuntos',consistency:'strong'}),
 texts:getStore({name:'textos',consistency:'strong'}),
 secret:secretOf(k=>process.env[k])
});

export const config={path:['/api/notas','/api/adjuntos','/api/textos']};
