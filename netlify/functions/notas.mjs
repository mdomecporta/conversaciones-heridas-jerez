// API de notas: /api/notas (listar, crear, borrar) y /api/adjuntos (subir y ver imágenes).
import {getStore} from '@netlify/blobs';
import {handle} from '../lib/notas.mjs';
import {secretOf} from '../lib/acceso.mjs';

export default async req=>handle(req,{
 notes:getStore({name:'notas',consistency:'strong'}),
 files:getStore({name:'adjuntos',consistency:'strong'}),
 secret:secretOf(k=>process.env[k])
});

export const config={path:['/api/notas','/api/adjuntos']};
