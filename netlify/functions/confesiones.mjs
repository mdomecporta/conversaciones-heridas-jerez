// API de «Confesiones de una úlcera» (/confesiones/): las mismas notas y cambios de texto que la presentación
// principal, en almacenes propios para que no se mezclen. Todo pide la contraseña del sitio.
import {getStore} from '@netlify/blobs';
import {handle} from '../lib/notas.mjs';
import {secretOf} from '../lib/acceso.mjs';

export default async req=>handle(req,{
 notes:getStore({name:'confesiones-notas',consistency:'strong'}),
 files:getStore({name:'confesiones-adjuntos',consistency:'strong'}),
 texts:getStore({name:'confesiones-textos',consistency:'strong'}),
 secret:secretOf(k=>process.env[k])
});

export const config={path:['/api/confesiones/notas','/api/confesiones/textos']};
