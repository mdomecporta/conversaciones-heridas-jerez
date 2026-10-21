import {readFile,writeFile,mkdir} from 'node:fs/promises';
const root = new URL('../',import.meta.url);
const read = name => readFile(new URL(name,root),'utf8');
const [template,css,data,app] = await Promise.all(['template.html','styles.css','content.js','app.js'].map(read));
const institutional = await Promise.all(['institutional-open','institutional-close'].map(async name=>'data:image/jpeg;base64,'+(await readFile(new URL('assets/'+name+'.jpg',root))).toString('base64')));
const frames = `\nINITIAL_DECK.slides.unshift({...slide('institucional-apertura','Institucional','¿Es posible cicatrizar todas las heridas?','principal','Qué no hacer en heridas crónicas','institutional',[],[],null),institutional:${JSON.stringify(institutional[0])},institutionalKind:'open'});\nINITIAL_DECK.slides.push({...slide('institucional-cierre','Institucional','Gracias por compartir el criterio.','principal','Cinco preguntas para revisar nuestras decisiones.','institutional',[],[],null),institutional:${JSON.stringify(institutional[1])},institutionalKind:'close'});`;
await mkdir(new URL('dist/',root),{recursive:true});
await writeFile(new URL('dist/index.html',root),template.replace('/* STYLES */',css).replace('/* CONTENT */',data+frames).replace('/* APP */',app));
console.log('Presentación generada en dist/index.html');
