import { useState, useEffect } from "react";
import { db } from "./firebase";
import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";

// ─── GRUPOS OFICIALES FIFA MUNDIAL 2026 ───────────────────────────────────────
const FLAGS = {
  "México":"🇲🇽","Sudáfrica":"🇿🇦","Corea del Sur":"🇰🇷","Chequia":"🇨🇿",
  "Canadá":"🇨🇦","Bosnia":"🇧🇦","Qatar":"🇶🇦","Suiza":"🇨🇭",
  "Brasil":"🇧🇷","Marruecos":"🇲🇦","Haití":"🇭🇹","Escocia":"🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  "USA":"🇺🇸","Paraguay":"🇵🇾","Australia":"🇦🇺","Turquía":"🇹🇷",
  "Alemania":"🇩🇪","Curazao":"🇨🇼","Costa de Marfil":"🇨🇮","Ecuador":"🇪🇨",
  "Países Bajos":"🇳🇱","Japón":"🇯🇵","Túnez":"🇹🇳","Suecia":"🇸🇪",
  "Bélgica":"🇧🇪","Egipto":"🇪🇬","Irán":"🇮🇷","Nueva Zelanda":"🇳🇿",
  "España":"🇪🇸","Cabo Verde":"🇨🇻","Arabia Saudita":"🇸🇦","Uruguay":"🇺🇾",
  "Francia":"🇫🇷","Senegal":"🇸🇳","Noruega":"🇳🇴",
  "Argentina":"🇦🇷","Argelia":"🇩🇿","Austria":"🇦🇹","Jordania":"🇯🇴",
  "Portugal":"🇵🇹","Colombia":"🇨🇴","Uzbekistán":"🇺🇿",
  "Irak":"🇮🇶","RD Congo":"🇨🇩","Inglaterra":"🏴󠁧󠁢󠁥󠁮󠁧󠁿","Croacia":"🇭🇷","Ghana":"🇬🇭","Panamá":"🇵🇦",
};
const F = (n) => FLAGS[n] || "🏳️";

const GRUPOS_OFICIALES = {
  A:{ partidos:[
    {a:"México",b:"Sudáfrica",fecha:"11 jun"},{a:"Corea del Sur",b:"Chequia",fecha:"11 jun"},
    {a:"Chequia",b:"Sudáfrica",fecha:"18 jun"},{a:"México",b:"Corea del Sur",fecha:"18 jun"},
    {a:"Chequia",b:"México",fecha:"24 jun"},{a:"Sudáfrica",b:"Corea del Sur",fecha:"24 jun"},
  ]},
  B:{ partidos:[
    {a:"Canadá",b:"Bosnia",fecha:"12 jun"},{a:"Qatar",b:"Suiza",fecha:"13 jun"},
    {a:"Suiza",b:"Bosnia",fecha:"18 jun"},{a:"Canadá",b:"Qatar",fecha:"18 jun"},
    {a:"Suiza",b:"Canadá",fecha:"24 jun"},{a:"Bosnia",b:"Qatar",fecha:"24 jun"},
  ]},
  C:{ partidos:[
    {a:"Haití",b:"Escocia",fecha:"13 jun"},{a:"Brasil",b:"Marruecos",fecha:"13 jun"},
    {a:"Brasil",b:"Haití",fecha:"19 jun"},{a:"Escocia",b:"Marruecos",fecha:"19 jun"},
    {a:"Escocia",b:"Brasil",fecha:"24 jun"},{a:"Marruecos",b:"Haití",fecha:"24 jun"},
  ]},
  D:{ partidos:[
    {a:"USA",b:"Paraguay",fecha:"12 jun"},{a:"Australia",b:"Turquía",fecha:"14 jun"},
    {a:"Turquía",b:"Paraguay",fecha:"19 jun"},{a:"USA",b:"Australia",fecha:"19 jun"},
    {a:"Turquía",b:"USA",fecha:"25 jun"},{a:"Paraguay",b:"Australia",fecha:"25 jun"},
  ]},
  E:{ partidos:[
    {a:"Costa de Marfil",b:"Ecuador",fecha:"14 jun"},{a:"Alemania",b:"Curazao",fecha:"14 jun"},
    {a:"Alemania",b:"Costa de Marfil",fecha:"20 jun"},{a:"Ecuador",b:"Curazao",fecha:"20 jun"},
    {a:"Curazao",b:"Costa de Marfil",fecha:"25 jun"},{a:"Ecuador",b:"Alemania",fecha:"25 jun"},
  ]},
  F:{ partidos:[
    {a:"Países Bajos",b:"Japón",fecha:"14 jun"},{a:"Suecia",b:"Túnez",fecha:"12 jun"},
    {a:"Países Bajos",b:"Suecia",fecha:"20 jun"},{a:"Túnez",b:"Japón",fecha:"21 jun"},
    {a:"Japón",b:"Suecia",fecha:"25 jun"},{a:"Túnez",b:"Países Bajos",fecha:"25 jun"},
  ]},
  G:{ partidos:[
    {a:"Bélgica",b:"Egipto",fecha:"15 jun"},{a:"Irán",b:"Nueva Zelanda",fecha:"15 jun"},
    {a:"Bélgica",b:"Irán",fecha:"21 jun"},{a:"Nueva Zelanda",b:"Egipto",fecha:"20 jun"},
    {a:"Egipto",b:"Irán",fecha:"26 jun"},{a:"Nueva Zelanda",b:"Bélgica",fecha:"26 jun"},
  ]},
  H:{ partidos:[
    {a:"Arabia Saudita",b:"Uruguay",fecha:"15 jun"},{a:"España",b:"Cabo Verde",fecha:"15 jun"},
    {a:"España",b:"Uruguay",fecha:"20 jun"},{a:"Cabo Verde",b:"Arabia Saudita",fecha:"21 jun"},
    {a:"España",b:"Arabia Saudita",fecha:"25 jun"},{a:"Uruguay",b:"Cabo Verde",fecha:"25 jun"},
  ]},
  I:{ partidos:[
    {a:"Francia",b:"Senegal",fecha:"16 jun"},{a:"Irak",b:"Noruega",fecha:"16 jun"},
    {a:"Francia",b:"Irak",fecha:"21 jun"},{a:"Noruega",b:"Senegal",fecha:"22 jun"},
    {a:"Senegal",b:"Irak",fecha:"26 jun"},{a:"Noruega",b:"Francia",fecha:"26 jun"},
  ]},
  J:{ partidos:[
    {a:"Argentina",b:"Argelia",fecha:"16 jun"},{a:"Austria",b:"Jordania",fecha:"17 jun"},
    {a:"Argentina",b:"Jordania",fecha:"22 jun"},{a:"Argelia",b:"Austria",fecha:"22 jun"},
    {a:"Argelia",b:"Jordania",fecha:"26 jun"},{a:"Austria",b:"Argentina",fecha:"26 jun"},
  ]},
  K:{ partidos:[
    {a:"Portugal",b:"RD Congo",fecha:"17 jun"},{a:"Colombia",b:"Uzbekistán",fecha:"17 jun"},
    {a:"Portugal",b:"Uzbekistán",fecha:"22 jun"},{a:"RD Congo",b:"Colombia",fecha:"22 jun"},
    {a:"Uzbekistán",b:"RD Congo",fecha:"27 jun"},{a:"Colombia",b:"Portugal",fecha:"27 jun"},
  ]},
  L:{ partidos:[
    {a:"Inglaterra",b:"Croacia",fecha:"15 jun"},{a:"Ghana",b:"Panamá",fecha:"16 jun"},
    {a:"Inglaterra",b:"Ghana",fecha:"20 jun"},{a:"Croacia",b:"Panamá",fecha:"21 jun"},
    {a:"Croacia",b:"Ghana",fecha:"26 jun"},{a:"Panamá",b:"Inglaterra",fecha:"26 jun"},
  ]},
};

const jornadaDeIdx = (i) => i < 2 ? 1 : i < 4 ? 2 : 3;
let _id = 1;
const PARTIDOS = [];
Object.entries(GRUPOS_OFICIALES).forEach(([grupo,{partidos}]) => {
  partidos.forEach((p,idx) => {
    PARTIDOS.push({id:_id++,fase:"grupos",grupo,jornada:jornadaDeIdx(idx),equipoA:p.a,equipoB:p.b,fecha:p.fecha,empateValido:true});
  });
});
for(let i=1;i<=16;i++) PARTIDOS.push({id:_id++,fase:"octavos",jornada:4,label:`16avos ${i}`,equipoA:`Clasificado ${i*2-1}`,equipoB:`Clasificado ${i*2}`,empateValido:false});
for(let i=1;i<=8;i++) PARTIDOS.push({id:_id++,fase:"cuartos",jornada:5,label:`Cuartos ${i}`,equipoA:`Gan. 16avos ${i*2-1}`,equipoB:`Gan. 16avos ${i*2}`,empateValido:false});
for(let i=1;i<=4;i++) PARTIDOS.push({id:_id++,fase:"semis",jornada:6,label:`Semifinal ${i}`,equipoA:`Gan. Cuartos ${i*2-1}`,equipoB:`Gan. Cuartos ${i*2}`,empateValido:false});
PARTIDOS.push({id:_id++,fase:"tercero",jornada:7,label:"3er y 4to Lugar",equipoA:"Perdedor Semi 1",equipoB:"Perdedor Semi 2",empateValido:false});
PARTIDOS.push({id:_id++,fase:"final",jornada:7,label:"🏆 GRAN FINAL",equipoA:"Ganador Semi 1",equipoB:"Ganador Semi 2",empateValido:false});

const JORNADAS=[1,2,3,4,5,6,7];
const JORNADA_LABELS={1:"J1 · Grupos",2:"J2 · Grupos",3:"J3 · Grupos",4:"J4 · 16avos",5:"J5 · Cuartos",6:"J6 · Semis",7:"J7 · Final"};
const JORNADA_LABELS_FULL={1:"Jornada 1 — Fase de Grupos",2:"Jornada 2 — Fase de Grupos",3:"Jornada 3 — Fase de Grupos",4:"Jornada 4 — 16avos de Final",5:"Jornada 5 — Cuartos de Final",6:"Jornada 6 — Semifinales",7:"Jornada 7 — Final"};
const PUNTOS_POR_FASE={grupos:1,octavos:2,cuartos:3,semis:4,tercero:2,final:5};
const QUINIELA_REF = doc(db,"quiniela","datos");

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [cargando, setCargando] = useState(true);
  const [pantalla, setPantalla] = useState("inicio");
  const [participantes, setParticipantes] = useState([]);
  const [resultados, setResultados] = useState({});
  // jornadasCerradas: { 1: true/false, 2: true/false, ... }
  // true = cerrada (no se pueden hacer predicciones, pero sí ver las de todos)
  const [jornadasCerradas, setJornadasCerradas] = useState({});
  const [jornadaActiva, setJornadaActiva] = useState(1);
  const [participanteActivo, setParticipanteActivo] = useState(null);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [adminOk, setAdminOk] = useState(false);
  const [notification, setNotification] = useState(null);
  const [grupoFiltro, setGrupoFiltro] = useState("TODOS");
  const [syncStatus, setSyncStatus] = useState("idle");
  // Vista de predicciones de otros (solo cuando jornada cerrada)
  const [viendoParticipante, setViendoParticipante] = useState(null);
  const [passInput, setPassInput] = useState("");
  const [passError, setPassError] = useState(false);
  const [participanteSeleccionado, setParticipanteSeleccionado] = useState(null);
  const [creandoPass, setCreandoPass] = useState(false);
  const [passNueva, setPassNueva] = useState("");
  const [passNuevaConfirm, setPassNuevaConfirm] = useState("");

  const notify = (msg, tipo="ok") => {
    setNotification({msg,tipo});
    setTimeout(()=>setNotification(null),2500);
  };

  // ── Suscripción Firestore ─────────────────────────────────────────────────
  useEffect(() => {
    const unsub = onSnapshot(QUINIELA_REF,(snap)=>{
      if(snap.exists()){
        const d=snap.data();
        setParticipantes(d.participantes||[]);
        setResultados(d.resultados||{});
        setJornadasCerradas(d.jornadasCerradas||{});
      } else {
        setDoc(QUINIELA_REF,{participantes:[],resultados:{},jornadasCerradas:{}});
      }
      setCargando(false);
    },(err)=>{ console.error(err); setCargando(false); });
    return ()=>unsub();
  },[]);

  // ── Guardar helpers ───────────────────────────────────────────────────────
  const guardar = async (campo, valor) => {
    setSyncStatus("saving");
    try {
      await updateDoc(QUINIELA_REF,{[campo]:valor});
    } catch {
      const base={participantes,resultados,jornadasCerradas};
      await setDoc(QUINIELA_REF,{...base,[campo]:valor});
    }
    setSyncStatus("saved");
    setTimeout(()=>setSyncStatus("idle"),2000);
  };

  // ── Toggle candado de jornada ─────────────────────────────────────────────
  const toggleCandado = async (jornada) => {
    const nuevas={...jornadasCerradas,[jornada]:!jornadasCerradas[jornada]};
    setJornadasCerradas(nuevas);
    await guardar("jornadasCerradas",nuevas);
    notify(nuevas[jornada]
      ? `🔒 Jornada ${jornada} cerrada — predicciones bloqueadas`
      : `🔓 Jornada ${jornada} abierta — predicciones permitidas`);
  };

  // ── Helpers de puntos ─────────────────────────────────────────────────────
  const calcularPuntos = (predicciones) =>
    Object.entries(resultados).reduce((acc,[idStr,res])=>{
      const id=parseInt(idStr);
      if(predicciones[id]&&predicciones[id]===res){
        const p=PARTIDOS.find((x)=>x.id===id);
        return acc+PUNTOS_POR_FASE[p?.fase||"grupos"];
      }
      return acc;
    },0);

  const calcularPuntosJornada = (predicciones,jornada) =>
    PARTIDOS.filter((p)=>p.jornada===jornada).reduce((acc,p)=>{
      if(predicciones[p.id]&&predicciones[p.id]===resultados[p.id])
        return acc+PUNTOS_POR_FASE[p.fase];
      return acc;
    },0);

  const ganadorJornada = (jornada) => {
    const rank=participantes
      .map((p)=>({nombre:p.nombre,pts:calcularPuntosJornada(p.predicciones,jornada)}))
      .sort((a,b)=>b.pts-a.pts);
    if(!rank.length||rank[0].pts===0) return null;
    const max=rank[0].pts;
    return {ganadores:rank.filter((r)=>r.pts===max),pts:max};
  };

  const tabla=[...participantes]
    .map((p)=>({...p,puntosCalc:calcularPuntos(p.predicciones)}))
    .sort((a,b)=>b.puntosCalc-a.puntosCalc);

  // ── Acciones ──────────────────────────────────────────────────────────────
  const agregarParticipante = async () => {
    if(!nuevoNombre.trim()) return;
    if(participantes.find((p)=>p.nombre.toLowerCase()===nuevoNombre.toLowerCase())){
      notify("Ese nombre ya existe","error"); return;
    }
    const nuevos=[...participantes,{id:Date.now(),nombre:nuevoNombre.trim(),predicciones:{},pass:""}];
    setNuevoNombre("");
    notify(`¡${nuevoNombre} agregado!`);
    await guardar("participantes",nuevos);
  };

  // Seleccionar participante → verificar si tiene pass
  const seleccionarParticipante = (p) => {
    setParticipanteSeleccionado(p.id);
    setPassInput("");
    setPassError(false);
    if(!p.pass){
      setCreandoPass(true); // sin contraseña → crear una
    } else {
      setCreandoPass(false); // tiene contraseña → pedir
    }
  };

  // Verificar contraseña ingresada
  const verificarPass = () => {
    const p = participantes.find((x)=>x.id===participanteSeleccionado);
    if(passInput === p.pass){
      setParticipanteActivo(participanteSeleccionado);
      setParticipanteSeleccionado(null);
      setPassInput("");
      setPassError(false);
    } else {
      setPassError(true);
      setTimeout(()=>setPassError(false), 2000);
    }
  };

  // Crear contraseña nueva
  const crearPass = async () => {
    if(!passNueva.trim()){ notify("Escribe una contraseña","error"); return; }
    if(passNueva !== passNuevaConfirm){ notify("Las contraseñas no coinciden","error"); return; }
    if(passNueva.length < 4){ notify("Mínimo 4 caracteres","error"); return; }
    const nuevos = participantes.map((p)=>
      p.id===participanteSeleccionado ? {...p, pass:passNueva} : p
    );
    await guardar("participantes", nuevos);
    setParticipanteActivo(participanteSeleccionado);
    setParticipanteSeleccionado(null);
    setPassNueva("");
    setPassNuevaConfirm("");
    setCreandoPass(false);
    notify("✓ Contraseña creada");
  };

  const setPrediccion = async (pId,matchId,val) => {
    // Verificar que la jornada no esté cerrada
    const partido=PARTIDOS.find((x)=>x.id===matchId);
    if(jornadasCerradas[partido?.jornada]){
      notify("🔒 Esta jornada está cerrada","error"); return;
    }
    const nuevos=participantes.map((p)=>
      p.id===pId?{...p,predicciones:{...p.predicciones,[matchId]:val}}:p
    );
    await guardar("participantes",nuevos);
    notify("✓ Guardado");
  };

  const setResultado = async (partidoId,val) => {
    const nuevosRes={...resultados,[partidoId]:val};
    await guardar("resultados",nuevosRes);
    notify("✓ Resultado guardado");
  };

  const borrarResultado = async (partidoId) => {
    const nuevosRes={...resultados};
    delete nuevosRes[partidoId];
    await guardar("resultados",nuevosRes);
    notify("🗑️ Resultado eliminado");
  };

  const borrarResultadosJornada = async (jornada) => {
    const ids=PARTIDOS.filter((p)=>p.jornada===jornada).map((p)=>p.id);
    const nuevosRes={...resultados};
    ids.forEach((id)=>delete nuevosRes[id]);
    await guardar("resultados",nuevosRes);
    notify(`🗑️ Resultados de J${jornada} eliminados`);
  };

  const partidosFiltrados=PARTIDOS.filter((p)=>{
    if(p.jornada!==jornadaActiva) return false;
    if(jornadaActiva<=3&&grupoFiltro!=="TODOS"&&p.grupo!==grupoFiltro) return false;
    return true;
  });

  const participanteData=participantes.find((p)=>p.id===participanteActivo);
  const gruposKeys=Object.keys(GRUPOS_OFICIALES);

  // ── Pantalla carga ────────────────────────────────────────────────────────
  if(cargando) return(
    <div style={{...s.root,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16}}>
      <div style={{fontSize:60}}>🏆</div>
      <div style={{color:"#FFD700",fontWeight:700,fontSize:18}}>Cargando quiniela...</div>
      <div style={s.spinner}/>
    </div>
  );

  // ── INICIO ─────────────────────────────────────────────────────────────────
  if(pantalla==="inicio") return(
    <div style={s.root}>
      <div style={s.hero}>
        <div style={s.heroGlow}/>
        <div style={s.trophyBig}>🏆</div>
        <h1 style={s.heroTitle}>QUINIELA</h1>
        <h2 style={s.heroSub}>MUNDIAL 2026</h2>
        <p style={s.heroDesc}>USA · CANADÁ · MÉXICO</p>
        <div style={s.syncBadge}><span style={{color:"#4CAF50"}}>●</span> En vivo · datos compartidos</div>
        <div style={s.btnRow}>
          <button style={{...s.btn,...s.btnGold}} onClick={()=>setPantalla("participante")}>🎯 Mis Predicciones</button>
          <button style={{...s.btn,...s.btnGreen}} onClick={()=>setPantalla("tabla")}>🏅 Tabla General</button>
          <button style={{...s.btn,...s.btnPurple}} onClick={()=>setPantalla("jornadas")}>📅 Por Jornada</button>
          <button style={{...s.btn,...s.btnGray}} onClick={()=>setPantalla("admin")}>⚙️ Admin</button>
        </div>
        {/* Estado de jornadas */}
        <div style={{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"center",marginTop:8}}>
          {JORNADAS.map((j)=>(
            <span key={j} style={{
              ...s.chip,
              borderColor:jornadasCerradas[j]?"#e74c3c":"#2ecc71",
              color:jornadasCerradas[j]?"#e74c3c":"#2ecc71",
              fontSize:11,
            }}>
              {jornadasCerradas[j]?"🔒":"🔓"} J{j}
            </span>
          ))}
        </div>
        <div style={{...s.participantesChips,marginTop:12}}>
          {participantes.map((p)=><span key={p.id} style={s.chip}>{p.nombre}</span>)}
        </div>
      </div>
      {notification&&<Notif data={notification}/>}
    </div>
  );

  // ── ADMIN ──────────────────────────────────────────────────────────────────
  if(pantalla==="admin") return(
    <div style={s.root}>
      <TopBar titulo="⚙️ Panel Admin" syncStatus={syncStatus} onBack={()=>{setPantalla("inicio");setAdminOk(false);}}/>
      <div style={s.content}>
        {!adminOk?(
          <div style={s.card}>
            <h3 style={s.cardTitle}>🔐 Acceso Admin</h3>
            <p style={{color:"#aaa",fontSize:13,marginBottom:12}}>Ingresa la contraseña de administrador</p>
            <input style={s.input} type="password" placeholder="Contraseña..." value={adminPass}
              onChange={(e)=>setAdminPass(e.target.value)}
              onKeyDown={(e)=>e.key==="Enter"&&adminPass==="Starlord#2026"&&setAdminOk(true)}/>
            <button style={{...s.btn,...s.btnGold,width:"100%",marginTop:10,justifyContent:"center"}}
              onClick={()=>adminPass==="Starlord#2026"?setAdminOk(true):notify("Contraseña incorrecta","error")}>
              Entrar
            </button>
          </div>
        ):(
          <>
            {/* Participantes */}
            <div style={s.card}>
              <h3 style={s.cardTitle}>👥 Participantes</h3>
              <div style={{display:"flex",gap:8,marginBottom:10}}>
                <input style={{...s.input,flex:1}} placeholder="Nombre..." value={nuevoNombre}
                  onChange={(e)=>setNuevoNombre(e.target.value)}
                  onKeyDown={(e)=>e.key==="Enter"&&agregarParticipante()}/>
                <button style={{...s.btn,...s.btnGold}} onClick={agregarParticipante}>+ Agregar</button>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {participantes.map((p)=>(
                  <div key={p.id} style={{...s.chipDel,borderRadius:10,padding:"8px 12px",justifyContent:"space-between"}}>
                    <span style={{fontWeight:600}}>{p.nombre}</span>
                    <div style={{display:"flex",gap:6,alignItems:"center"}}>
                      <span style={{fontSize:11,color:p.pass?"#4CAF50":"#e74c3c"}}>
                        {p.pass?"🔐 con pass":"⚪ sin pass"}
                      </span>
                      {p.pass&&(
                        <button style={{background:"rgba(255,165,0,0.15)",border:"1px solid #FFA500",color:"#FFA500",borderRadius:6,padding:"2px 8px",fontSize:10,cursor:"pointer",fontWeight:700}}
                          onClick={async()=>{
                            if(window.confirm(`¿Resetear contraseña de ${p.nombre}? La próxima vez que entre deberá crear una nueva.`)){
                              const nuevos=participantes.map((x)=>x.id===p.id?{...x,pass:""}:x);
                              await guardar("participantes",nuevos);
                              notify(`🔓 Contraseña de ${p.nombre} reseteada`);
                            }
                          }}>
                          Reset pass
                        </button>
                      )}
                      {participantes.length>1&&(
                        <button style={s.delBtn} onClick={async()=>{
                          const nuevos=participantes.filter((x)=>x.id!==p.id);
                          await guardar("participantes",nuevos);
                        }}>×</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── CANDADOS DE JORNADA ── */}
            <div style={s.card}>
              <h3 style={s.cardTitle}>🔒 Control de Jornadas</h3>
              <p style={{color:"#aaa",fontSize:12,marginBottom:12,lineHeight:1.5}}>
                <b style={{color:"#FFD700"}}>Cierra</b> una jornada cuando empiecen los partidos para que nadie pueda modificar predicciones.<br/>
                <b style={{color:"#2ecc71"}}>Ábrela</b> antes de que empiece para que los participantes puedan predecir.<br/>
                Cuando está <b style={{color:"#e74c3c"}}>cerrada</b>, todos pueden ver las predicciones de los demás.
              </p>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {JORNADAS.map((j)=>{
                  const cerrada=!!jornadasCerradas[j];
                  const totalJ=PARTIDOS.filter((p)=>p.jornada===j).length;
                  const conPred=participantes.reduce((acc,p)=>{
                    const tieneAlgo=PARTIDOS.filter((x)=>x.jornada===j).some((x)=>p.predicciones[x.id]);
                    return acc+(tieneAlgo?1:0);
                  },0);
                  return(
                    <div key={j} style={{
                      ...s.candadoRow,
                      borderColor:cerrada?"#e74c3c":"#2ecc71",
                      background:cerrada?"rgba(231,76,60,0.07)":"rgba(46,204,113,0.05)",
                    }}>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:700,color:"#fff",fontSize:13}}>
                          {cerrada?"🔒":"🔓"} {JORNADA_LABELS_FULL[j]}
                        </div>
                        <div style={{fontSize:11,color:"#555",marginTop:2}}>
                          {totalJ} partidos · {conPred}/{participantes.length} participantes con predicciones
                        </div>
                      </div>
                      <button
                        style={{
                          ...s.btn,
                          ...(cerrada?s.btnRed:s.btnGreen),
                          padding:"6px 14px",fontSize:12,
                        }}
                        onClick={()=>toggleCandado(j)}>
                        {cerrada?"🔓 Abrir":"🔒 Cerrar"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Resultados reales */}
            <div style={s.card}>
              <h3 style={s.cardTitle}>📋 Capturar Resultados Reales</h3>
              <div style={s.jornadaTabs}>
                {JORNADAS.map((j)=>{
                  const tot=PARTIDOS.filter((p)=>p.jornada===j).length;
                  const cap=PARTIDOS.filter((p)=>p.jornada===j&&resultados[p.id]).length;
                  return(
                    <button key={j} style={{...s.jornadaTab,...(jornadaActiva===j?s.jornadaTabActive:{})}}
                      onClick={()=>{setJornadaActiva(j);setGrupoFiltro("TODOS");}}>
                      {JORNADA_LABELS[j]}
                      <span style={{fontSize:9,display:"block",color:cap===tot?"#4CAF50":"#666"}}>{cap}/{tot}</span>
                    </button>
                  );
                })}
              </div>
              {jornadaActiva<=3&&(
                <div style={{...s.jornadaTabs,marginTop:8}}>
                  <button style={{...s.grupoTab,...(grupoFiltro==="TODOS"?s.grupoTabActive:{})}} onClick={()=>setGrupoFiltro("TODOS")}>Todos</button>
                  {gruposKeys.map((g)=><button key={g} style={{...s.grupoTab,...(grupoFiltro===g?s.grupoTabActive:{})}} onClick={()=>setGrupoFiltro(g)}>Gpo {g}</button>)}
                </div>
              )}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",margin:"10px 0 6px"}}>
                <h4 style={{color:"#FFD700",fontSize:13,margin:0}}>
                  {JORNADA_LABELS_FULL[jornadaActiva]}{grupoFiltro!=="TODOS"?` · Grupo ${grupoFiltro}`:""}
                  <span style={{color:"#555",fontWeight:400}}> ({partidosFiltrados.length} partidos)</span>
                </h4>
                {PARTIDOS.filter((p)=>p.jornada===jornadaActiva&&resultados[p.id]).length>0&&(
                  <button
                    style={{...s.btn,background:"rgba(231,76,60,0.15)",border:"1px solid #e74c3c",color:"#e74c3c",padding:"5px 10px",fontSize:11,borderRadius:8}}
                    onClick={()=>{
                      if(window.confirm(`¿Borrar TODOS los resultados de la Jornada ${jornadaActiva}?`))
                        borrarResultadosJornada(jornadaActiva);
                    }}>
                    🗑️ Borrar J{jornadaActiva}
                  </button>
                )}
              </div>
              <div style={s.partidosList}>
                {partidosFiltrados.map((partido)=>(
                  <PartidoAdmin key={partido.id} partido={partido}
                    resultado={resultados[partido.id]}
                    onResultado={(v)=>setResultado(partido.id,v)}
                    onBorrar={()=>borrarResultado(partido.id)}/>
                ))}
              </div>
            </div>

            {/* Vista de predicciones de todos (admin siempre puede ver) */}
            <div style={s.card}>
              <h3 style={s.cardTitle}>👁️ Ver Predicciones de Participantes</h3>
              <p style={{color:"#aaa",fontSize:12,marginBottom:10}}>Como admin puedes ver las predicciones de cualquier participante en cualquier momento.</p>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {participantes.map((p)=>(
                  <button key={p.id}
                    style={{...s.btn,...s.btnOutline,...(viendoParticipante===p.id?{borderColor:"#FFD700",color:"#FFD700"}:{})}}
                    onClick={()=>setViendoParticipante(viendoParticipante===p.id?null:p.id)}>
                    👤 {p.nombre}
                    <span style={{marginLeft:"auto",fontSize:12,color:"#aaa"}}>
                      {Object.keys(p.predicciones).length}/{PARTIDOS.length} pred
                    </span>
                  </button>
                ))}
              </div>
              {viendoParticipante&&(()=>{
                const p=participantes.find((x)=>x.id===viendoParticipante);
                if(!p) return null;
                return(
                  <div style={{marginTop:12}}>
                    <div style={s.jornadaTabs}>
                      {JORNADAS.map((j)=>(
                        <button key={j} style={{...s.jornadaTab,...(jornadaActiva===j?s.jornadaTabActive:{})}}
                          onClick={()=>{setJornadaActiva(j);setGrupoFiltro("TODOS");}}>
                          {JORNADA_LABELS[j]}
                        </button>
                      ))}
                    </div>
                    {jornadaActiva<=3&&(
                      <div style={{...s.jornadaTabs,marginTop:8}}>
                        <button style={{...s.grupoTab,...(grupoFiltro==="TODOS"?s.grupoTabActive:{})}} onClick={()=>setGrupoFiltro("TODOS")}>Todos</button>
                        {gruposKeys.map((g)=><button key={g} style={{...s.grupoTab,...(grupoFiltro===g?s.grupoTabActive:{})}} onClick={()=>setGrupoFiltro(g)}>Gpo {g}</button>)}
                      </div>
                    )}
                    <h4 style={{color:"#FFD700",margin:"10px 0 6px",fontSize:12}}>Predicciones de {p.nombre} — {JORNADA_LABELS_FULL[jornadaActiva]}</h4>
                    <div style={s.partidosList}>
                      {partidosFiltrados.map((partido)=>(
                        <PartidoPrediccion key={partido.id} partido={partido}
                          prediccion={p.predicciones[partido.id]}
                          resultado={resultados[partido.id]}
                          bloqueado={true}
                          onPrediccion={()=>{}}/>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          </>
        )}
      </div>
      {notification&&<Notif data={notification}/>}
    </div>
  );

  // ── PREDICCIONES ───────────────────────────────────────────────────────────
  if(pantalla==="participante") return(
    <div style={s.root}>
      <TopBar titulo="🎯 Predicciones" syncStatus={syncStatus} onBack={()=>{setPantalla("inicio");setParticipanteActivo(null);setViendoParticipante(null);setParticipanteSeleccionado(null);}}/>
      <div style={s.content}>
        {!participanteActivo?(
          <div style={s.card}>
            {/* Paso 1: elegir nombre */}
            {!participanteSeleccionado?(
              <>
                <h3 style={s.cardTitle}>¿Quién eres?</h3>
                {participantes.length===0?(
                  <p style={{color:"#555",fontSize:13,textAlign:"center",padding:"16px 0"}}>El admin aún no ha agregado participantes.</p>
                ):(
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {participantes.map((p)=>(
                      <button key={p.id} style={{...s.btn,...s.btnOutline}} onClick={()=>seleccionarParticipante(p)}>
                        👤 {p.nombre}
                        <span style={{marginLeft:"auto",color:"#aaa",fontSize:12}}>
                          {p.pass ? "🔐" : "⚪ sin contraseña"} · <b style={{color:"#FFD700"}}>{calcularPuntos(p.predicciones)}pts</b>
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : creandoPass ? (
              /* Paso 2a: crear contraseña nueva */
              <>
                <h3 style={s.cardTitle}>🔐 Crea tu contraseña</h3>
                <p style={{color:"#aaa",fontSize:13,marginBottom:14,lineHeight:1.5}}>
                  Es la primera vez que entras. Crea una contraseña personal para proteger tus predicciones.
                </p>
                <input style={{...s.input,marginBottom:10}} type="password"
                  placeholder="Nueva contraseña (mín. 4 caracteres)"
                  value={passNueva} onChange={(e)=>setPassNueva(e.target.value)}/>
                <input style={{...s.input,marginBottom:14}} type="password"
                  placeholder="Confirma tu contraseña"
                  value={passNuevaConfirm} onChange={(e)=>setPassNuevaConfirm(e.target.value)}
                  onKeyDown={(e)=>e.key==="Enter"&&crearPass()}/>
                <div style={{display:"flex",gap:8}}>
                  <button style={{...s.btn,...s.btnGray,flex:1,justifyContent:"center"}}
                    onClick={()=>{setParticipanteSeleccionado(null);setPassNueva("");setPassNuevaConfirm("");}}>
                    ← Volver
                  </button>
                  <button style={{...s.btn,...s.btnGold,flex:2,justifyContent:"center"}} onClick={crearPass}>
                    Crear contraseña ✓
                  </button>
                </div>
                <p style={{color:"#555",fontSize:11,marginTop:10,textAlign:"center"}}>
                  ⚠️ Guarda tu contraseña — no se puede recuperar
                </p>
              </>
            ) : (
              /* Paso 2b: ingresar contraseña existente */
              <>
                <h3 style={s.cardTitle}>🔐 Ingresa tu contraseña</h3>
                <p style={{color:"#FFD700",fontWeight:700,fontSize:15,marginBottom:12}}>
                  👤 {participantes.find((x)=>x.id===participanteSeleccionado)?.nombre}
                </p>
                <input
                  style={{...s.input,marginBottom:10,borderColor:passError?"#e74c3c":"#2a3f55"}}
                  type="password" placeholder="Tu contraseña..."
                  value={passInput} onChange={(e)=>{setPassInput(e.target.value);setPassError(false);}}
                  onKeyDown={(e)=>e.key==="Enter"&&verificarPass()}
                  autoFocus/>
                {passError&&(
                  <p style={{color:"#e74c3c",fontSize:12,marginBottom:8}}>❌ Contraseña incorrecta</p>
                )}
                <div style={{display:"flex",gap:8}}>
                  <button style={{...s.btn,...s.btnGray,flex:1,justifyContent:"center"}}
                    onClick={()=>{setParticipanteSeleccionado(null);setPassInput("");}}>
                    ← Volver
                  </button>
                  <button style={{...s.btn,...s.btnGold,flex:2,justifyContent:"center"}} onClick={verificarPass}>
                    Entrar →
                  </button>
                </div>
              </>
            )}
          </div>
        ):(
          <>
            <div style={{...s.card,padding:"10px 14px",display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
              <span style={{fontSize:18}}>👤</span>
              <span style={{color:"#FFD700",fontWeight:700}}>{participanteData?.nombre}</span>
              <span style={{marginLeft:"auto",color:"#aaa",fontSize:12}}>
                {Object.keys(participanteData?.predicciones||{}).length}/{PARTIDOS.length}
              </span>
              <button style={{...s.btn,...s.btnGray,padding:"4px 10px",fontSize:12}} onClick={()=>setParticipanteActivo(null)}>Cambiar</button>
            </div>

            <div style={s.jornadaTabs}>
              {JORNADAS.map((j)=>{
                const tot=PARTIDOS.filter((p)=>p.jornada===j).length;
                const hec=PARTIDOS.filter((p)=>p.jornada===j&&participanteData?.predicciones[p.id]).length;
                const cerrada=!!jornadasCerradas[j];
                const gj=ganadorJornada(j);
                const esGan=gj?.ganadores.some((g)=>g.nombre===participanteData?.nombre);
                return(
                  <button key={j} style={{...s.jornadaTab,...(jornadaActiva===j?s.jornadaTabActive:{})}}
                    onClick={()=>{setJornadaActiva(j);setGrupoFiltro("TODOS");}}>
                    {cerrada?"🔒 ":"🔓 "}{JORNADA_LABELS[j].replace("J"+j+" · ","")}
                    {esGan
                      ?<span style={{fontSize:8,display:"block",color:"#FFD700"}}>🏆 ganaste</span>
                      :<span style={{fontSize:9,display:"block",color:hec===tot?"#4CAF50":cerrada?"#e74c3c":"#aaa"}}>
                        {cerrada?"cerrada":hec+"/"+tot}
                      </span>
                    }
                  </button>
                );
              })}
            </div>

            {jornadaActiva<=3&&(
              <div style={{...s.jornadaTabs,marginTop:8}}>
                <button style={{...s.grupoTab,...(grupoFiltro==="TODOS"?s.grupoTabActive:{})}} onClick={()=>setGrupoFiltro("TODOS")}>Todos</button>
                {gruposKeys.map((g)=>{
                  const tot=PARTIDOS.filter((p)=>p.jornada===jornadaActiva&&p.grupo===g).length;
                  const hec=PARTIDOS.filter((p)=>p.jornada===jornadaActiva&&p.grupo===g&&participanteData?.predicciones[p.id]).length;
                  return(<button key={g} style={{...s.grupoTab,...(grupoFiltro===g?s.grupoTabActive:{})}} onClick={()=>setGrupoFiltro(g)}>Gpo {g}{hec===tot&&tot>0?" ✓":""}</button>);
                })}
              </div>
            )}

            {/* Banner jornada cerrada */}
            {jornadasCerradas[jornadaActiva]&&(
              <div style={s.cerradaBanner}>
                🔒 Esta jornada está cerrada — ya no se pueden modificar predicciones
              </div>
            )}

            {/* Banner ganador */}
            {(()=>{const gj=ganadorJornada(jornadaActiva);if(!gj||!jornadasCerradas[jornadaActiva]) return null;
              return <div style={s.ganadorBanner}>🏆 Ganador J{jornadaActiva}: <b>{gj.ganadores.map((g)=>g.nombre).join(" & ")}</b> · {gj.pts}pts</div>;
            })()}

            <h4 style={{color:"#FFD700",margin:"8px 0 6px",paddingLeft:2,fontSize:13}}>
              {JORNADA_LABELS_FULL[jornadaActiva]}{grupoFiltro!=="TODOS"?` · Grupo ${grupoFiltro}`:""}
              <span style={{color:"#555",fontWeight:400}}> ({partidosFiltrados.length} partidos)</span>
            </h4>

            {/* Si jornada cerrada: mostrar selector para ver predicciones de otros */}
            {jornadasCerradas[jornadaActiva]&&(
              <div style={{...s.card,padding:"10px 14px",marginBottom:8}}>
                <div style={{fontSize:12,color:"#aaa",marginBottom:8}}>👁️ Ver predicciones de:</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  <button
                    style={{...s.grupoTab,...(viendoParticipante===null?s.grupoTabActive:{})}}
                    onClick={()=>setViendoParticipante(null)}>
                    Mis predicciones
                  </button>
                  {participantes.filter((p)=>p.id!==participanteActivo).map((p)=>(
                    <button key={p.id}
                      style={{...s.grupoTab,...(viendoParticipante===p.id?s.grupoTabActive:{})}}
                      onClick={()=>setViendoParticipante(viendoParticipante===p.id?null:p.id)}>
                      {p.nombre}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Partidos */}
            <div style={s.partidosList}>
              {partidosFiltrados.map((partido)=>{
                // Si jornada abierta: solo ves tus propias predicciones
                // Si jornada cerrada: puedes ver las tuyas o las de otros
                const pidMostrar = jornadasCerradas[jornadaActiva]&&viendoParticipante
                  ? viendoParticipante
                  : participanteActivo;
                const pMostrar = participantes.find((x)=>x.id===pidMostrar)||participanteData;
                return(
                  <PartidoPrediccion key={partido.id} partido={partido}
                    prediccion={pMostrar?.predicciones[partido.id]}
                    resultado={resultados[partido.id]}
                    bloqueado={!!jornadasCerradas[jornadaActiva]||(viendoParticipante!==null&&viendoParticipante!==participanteActivo)}
                    onPrediccion={(v)=>setPrediccion(participanteActivo,partido.id,v)}/>
                );
              })}
            </div>
          </>
        )}
      </div>
      {notification&&<Notif data={notification}/>}
    </div>
  );

  // ── JORNADAS ───────────────────────────────────────────────────────────────
  if(pantalla==="jornadas") return(
    <div style={s.root}>
      <TopBar titulo="📅 Ganadores por Jornada" syncStatus={syncStatus} onBack={()=>setPantalla("inicio")}/>
      <div style={s.content}>
        {JORNADAS.map((j)=>{
          const partidosJ=PARTIDOS.filter((p)=>p.jornada===j);
          const jugados=partidosJ.filter((p)=>resultados[p.id]).length;
          const cerrada=!!jornadasCerradas[j];
          const gj=ganadorJornada(j);
          const rankJ=[...participantes]
            .map((p)=>({nombre:p.nombre,pts:calcularPuntosJornada(p.predicciones,j),preds:partidosJ.filter((x)=>p.predicciones[x.id]).length}))
            .sort((a,b)=>b.pts-a.pts);
          return(
            <div key={j} style={{...s.card,...(gj?s.jornadaCardActiva:{})}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                <h3 style={{margin:0,fontSize:14,color:gj?"#FFD700":"#aaa"}}>
                  {cerrada?"🔒":"🔓"} {JORNADA_LABELS_FULL[j]}
                </h3>
                <span style={{fontSize:11,color:"#555"}}>{jugados}/{partidosJ.length}</span>
              </div>
              {gj?(
                <>
                  <div style={s.ganadorBig}>🏆 {gj.ganadores.map((g)=>g.nombre).join(" & ")} <span style={{fontSize:13,fontWeight:400,color:"#aaa",marginLeft:6}}>{gj.pts}pts</span></div>
                  <div style={{display:"flex",flexDirection:"column",gap:5,marginTop:8}}>
                    {rankJ.map((r,i)=>{
                      const esGan=gj.ganadores.some((g)=>g.nombre===r.nombre);
                      return(
                        <div key={r.nombre} style={{display:"flex",alignItems:"center",gap:8}}>
                          <span style={{width:20,textAlign:"center",fontSize:13}}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":`${i+1}°`}</span>
                          <span style={{flex:1,fontSize:13,color:esGan?"#FFD700":"#ccc",fontWeight:esGan?700:400}}>{r.nombre}</span>
                          <span style={{fontSize:13,fontWeight:700,color:r.pts>0?"#fff":"#444"}}>{r.pts}pts</span>
                          <span style={{fontSize:11,color:"#555"}}>{r.preds}/{partidosJ.length}</span>
                        </div>
                      );
                    })}
                  </div>
                </>
              ):(
                <div style={{color:"#555",fontSize:13,textAlign:"center",padding:"8px 0"}}>
                  {!cerrada?"🔓 Jornada abierta — aceptando predicciones":jugados===0?"Sin partidos jugados aún":"Sin resultados suficientes"}
                </div>
              )}
            </div>
          );
        })}
        <div style={s.card}>
          <h3 style={s.cardTitle}>🏅 Jornadas Ganadas</h3>
          {participantes.map((p)=>{
            const jg=JORNADAS.filter((j)=>{const gj=ganadorJornada(j);return gj?.ganadores.some((g)=>g.nombre===p.nombre);});
            return(
              <div key={p.id} style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                <span style={{flex:1,fontWeight:700,color:"#ddd"}}>{p.nombre}</span>
                <div style={{display:"flex",gap:4}}>
                  {jg.length===0?<span style={{color:"#444",fontSize:12}}>Sin jornadas ganadas</span>:jg.map((j)=><span key={j} style={s.jornadaBadge}>J{j}</span>)}
                </div>
                {jg.length>0&&<span style={{color:"#FFD700",fontWeight:700,fontSize:14}}>×{jg.length}</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // ── TABLA ──────────────────────────────────────────────────────────────────
  if(pantalla==="tabla"){
    const totalJugados=Object.keys(resultados).length;
    const exportar=(detallado)=>{
      const med=["🥇","🥈","🥉"];
      const lineas=[
        "🏆 *QUINIELA MUNDIAL 2026* 🏆",
        `📊 Partidos jugados: ${totalJugados}/${PARTIDOS.length}`,
        "─────────────────────",
        ...tabla.map((p,i)=>{
          const ac=Object.entries(resultados).filter(([id,r])=>p.predicciones[parseInt(id)]===r).length;
          const pct=totalJugados>0?Math.round((ac/totalJugados)*100):0;
          const jg=JORNADAS.filter((j)=>{const gj=ganadorJornada(j);return gj?.ganadores.some((g)=>g.nombre===p.nombre);});
          return `${med[i]||`${i+1}°`} *${p.nombre}* — ${p.puntosCalc}pts | ${pct}%${jg.length>0?` | 🏆×${jg.length}`:""}`;
        }),
        ...(detallado?["","*JORNADAS:*",...JORNADAS.map((j)=>{const gj=ganadorJornada(j);return `J${j} ${jornadasCerradas[j]?"🔒":"🔓"}: ${gj?`${gj.ganadores.map((g)=>g.nombre).join(" & ")} (${gj.pts}pts)`:"Pendiente"}`;})]: []),
        "─────────────────────","🌐 USA · Canadá · México 2026",
      ];
      const texto=lineas.join("\n");
      if(navigator.share){navigator.share({text:texto}).catch(()=>{});}
      else{navigator.clipboard.writeText(texto).then(()=>notify("📋 ¡Copiado!"));}
    };
    return(
      <div style={s.root}>
        <TopBar titulo="🏅 Tabla General" syncStatus={syncStatus} onBack={()=>setPantalla("inicio")}/>
        <div style={s.content}>
          <div style={{...s.card,display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
            <span style={{color:"#aaa",fontSize:13}}>Jugados: <b style={{color:"#FFD700"}}>{totalJugados}</b>/{PARTIDOS.length}</span>
            <div style={{display:"flex",gap:6}}>
              <button style={{...s.btn,...s.btnWA,fontSize:12,padding:"7px 12px"}} onClick={()=>exportar(false)}>📤 Compartir</button>
              <button style={{...s.btn,...s.btnGray,fontSize:12,padding:"7px 12px"}} onClick={()=>exportar(true)}>📋 Detallado</button>
            </div>
          </div>
          {tabla.map((p,i)=>{
            const ac=Object.entries(resultados).filter(([id,r])=>p.predicciones[parseInt(id)]===r).length;
            const pct=totalJugados>0?Math.round((ac/totalJugados)*100):0;
            const jg=JORNADAS.filter((j)=>{const gj=ganadorJornada(j);return gj?.ganadores.some((g)=>g.nombre===p.nombre);});
            return(
              <div key={p.id} style={{...s.card,...s.tablaRow,...(i===0?s.tablaFirst:{})}}>
                <div style={s.posNum}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":`${i+1}°`}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,color:i===0?"#FFD700":"#fff",fontSize:15}}>{p.nombre}</div>
                  <div style={{fontSize:11,color:"#aaa",marginTop:2}}>{ac}/{totalJugados} aciertos · {pct}% efectividad</div>
                  {jg.length>0&&<div style={{display:"flex",gap:4,marginTop:4}}>{jg.map((j)=><span key={j} style={s.jornadaBadge}>🏆 J{j}</span>)}</div>}
                  <div style={s.barWrap}><div style={{...s.barFill,width:`${Math.min(pct,100)}%`,background:i===0?"#FFD700":"#4CAF50"}}/></div>
                </div>
                <div style={{...s.puntosTag,...(i===0?{background:"#FFD70022",color:"#FFD700",borderColor:"#FFD700"}:{})}}>{p.puntosCalc}<span style={{fontSize:10}}> pts</span></div>
              </div>
            );
          })}
          <div style={s.card}>
            <h3 style={s.cardTitle}>📊 Puntos por Jornada</h3>
            {tabla.map((p)=>(
              <div key={p.id} style={{marginBottom:14}}>
                <div style={{color:"#FFD700",fontWeight:700,marginBottom:4,fontSize:13}}>{p.nombre}</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  {JORNADAS.map((j)=>{
                    const pts=calcularPuntosJornada(p.predicciones,j);
                    const gj=ganadorJornada(j);
                    const esGan=gj?.ganadores.some((g)=>g.nombre===p.nombre);
                    return(
                      <div key={j} style={{...s.faseBadge,...(esGan?s.faseBadgeGold:{})}}>
                        <div style={{fontSize:9,color:esGan?"#FFD700":"#aaa"}}>J{j}{esGan?" 🏆":""}</div>
                        <div style={{fontWeight:700,color:"#fff",fontSize:14}}>{pts}</div>
                        <div style={{fontSize:9,color:"#555"}}>pts</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:10,marginBottom:20}}>
            <button style={{...s.btn,...s.btnWA,flex:1,justifyContent:"center"}} onClick={()=>exportar(false)}>📤 Compartir en WhatsApp</button>
            <button style={{...s.btn,...s.btnGray,flex:1,justifyContent:"center"}} onClick={()=>exportar(true)}>📋 Exportar detallado</button>
          </div>
        </div>
        {notification&&<Notif data={notification}/>}
      </div>
    );
  }

  return null;
}

// ─── SUB-COMPONENTES ──────────────────────────────────────────────────────────

function TopBar({titulo,onBack,syncStatus}){
  const dot=syncStatus==="saving"?{color:"#FFA500",label:"guardando..."}
           :syncStatus==="saved"?{color:"#4CAF50",label:"guardado ✓"}
           :{color:"#334",label:""};
  return(
    <div style={s.topBar}>
      <button style={s.backBtn} onClick={onBack}>← Inicio</button>
      <span style={s.topTitle}>{titulo}</span>
      <span style={{fontSize:10,color:dot.color,minWidth:70,textAlign:"right"}}>{dot.label}</span>
    </div>
  );
}

function PartidoAdmin({partido,resultado,onResultado,onBorrar}){
  return(
    <div style={{...s.partidoCard,...(resultado?s.partidoCardDone:{})}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
        <span style={{...s.grupoTag,marginBottom:0}}>
          {partido.grupo?`Grupo ${partido.grupo} · `:""}
          {partido.label||""}
          {partido.fecha?` · ${partido.fecha}`:""}
          {partido.empateValido?"":" · Sin empate"}
        </span>
        {resultado&&(
          <button
            onClick={onBorrar}
            style={{background:"rgba(231,76,60,0.15)",border:"1px solid #e74c3c",color:"#e74c3c",borderRadius:6,padding:"2px 8px",fontSize:10,cursor:"pointer",fontWeight:700,flexShrink:0}}>
            🗑️ Quitar
          </button>
        )}
      </div>
      <div style={s.vsRow}>
        <span style={s.teamName}>{F(partido.equipoA)} {partido.equipoA}</span>
        <span style={s.vsText}>VS</span>
        <span style={{...s.teamName,textAlign:"right"}}>{partido.equipoB} {F(partido.equipoB)}</span>
      </div>
      <div style={s.btnResultRow}>
        <button style={{...s.opcion,...(resultado==="A"?s.opcionSelA:{})}} onClick={()=>onResultado("A")}>✓ {partido.equipoA.split(" ")[0]}</button>
        {partido.empateValido&&<button style={{...s.opcion,...(resultado==="E"?s.opcionSelE:{})}} onClick={()=>onResultado("E")}>🤝 Empate</button>}
        <button style={{...s.opcion,...(resultado==="B"?s.opcionSelB:{})}} onClick={()=>onResultado("B")}>✓ {partido.equipoB.split(" ")[0]}</button>
      </div>
    </div>
  );
}

function PartidoPrediccion({partido,prediccion,resultado,onPrediccion,bloqueado}){
  const acertado=resultado&&prediccion===resultado;
  const fallado=resultado&&prediccion&&prediccion!==resultado;
  return(
    <div style={{...s.partidoCard,...(acertado?s.partidoAcertado:{}),...(fallado?s.partidoFallado:{}),...(prediccion&&!resultado?s.partidoCardDone:{})}}>
      <span style={s.grupoTag}>
        {partido.grupo?`Grupo ${partido.grupo} · `:""}
        {partido.label||""}
        {partido.fecha?` · ${partido.fecha}`:""}
        <span style={{color:"#FFD70066"}}> · {PUNTOS_POR_FASE[partido.fase]}pt{PUNTOS_POR_FASE[partido.fase]>1?"s":""}</span>
        {bloqueado&&<span style={{color:"#e74c3c"}}> · 🔒</span>}
      </span>
      {acertado&&<span style={s.aciertoBadge}>✓ +{PUNTOS_POR_FASE[partido.fase]}pts</span>}
      {fallado&&<span style={s.fallidoBadge}>✗ 0pts</span>}
      <div style={s.vsRow}>
        <span style={s.teamName}>{F(partido.equipoA)} {partido.equipoA}</span>
        <span style={s.vsText}>VS</span>
        <span style={{...s.teamName,textAlign:"right"}}>{partido.equipoB} {F(partido.equipoB)}</span>
      </div>
      {resultado&&(
        <div style={{textAlign:"center",fontSize:11,color:"#aaa",marginBottom:6}}>
          Resultado: <b style={{color:"#FFD700"}}>{resultado==="A"?`Ganó ${partido.equipoA}`:resultado==="B"?`Ganó ${partido.equipoB}`:"Empate"}</b>
        </div>
      )}
      <div style={s.btnResultRow}>
        <button style={{...s.opcion,...(prediccion==="A"?s.opcionSelA:{}),...(bloqueado?s.opcionBloqueada:{})}}
          onClick={()=>!bloqueado&&onPrediccion("A")} disabled={bloqueado}>
          🏆 {partido.equipoA.split(" ")[0]}
        </button>
        {partido.empateValido&&(
          <button style={{...s.opcion,...(prediccion==="E"?s.opcionSelE:{}),...(bloqueado?s.opcionBloqueada:{})}}
            onClick={()=>!bloqueado&&onPrediccion("E")} disabled={bloqueado}>
            🤝 Empate
          </button>
        )}
        <button style={{...s.opcion,...(prediccion==="B"?s.opcionSelB:{}),...(bloqueado?s.opcionBloqueada:{})}}
          onClick={()=>!bloqueado&&onPrediccion("B")} disabled={bloqueado}>
          🏆 {partido.equipoB.split(" ")[0]}
        </button>
      </div>
    </div>
  );
}

function Notif({data}){
  return <div style={{...s.notif,...(data.tipo==="error"?s.notifError:{})}}>{data.msg}</div>;
}

// ─── ESTILOS ──────────────────────────────────────────────────────────────────
const s={
  root:{minHeight:"100vh",background:"linear-gradient(160deg,#0a0f1e 0%,#0d1a2e 50%,#0a1520 100%)",color:"#fff",fontFamily:"'Segoe UI',system-ui,sans-serif",position:"relative",overflowX:"hidden"},
  hero:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:"40px 20px",position:"relative",textAlign:"center"},
  heroGlow:{position:"absolute",top:"20%",left:"50%",transform:"translateX(-50%)",width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(255,215,0,0.12) 0%,transparent 70%)",pointerEvents:"none"},
  trophyBig:{fontSize:80,marginBottom:10,filter:"drop-shadow(0 0 30px #FFD70088)"},
  heroTitle:{fontSize:"clamp(42px,10vw,72px)",fontWeight:900,letterSpacing:8,margin:0,background:"linear-gradient(135deg,#FFD700,#FFA500)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"},
  heroSub:{fontSize:"clamp(20px,5vw,32px)",fontWeight:700,margin:"4px 0",color:"#fff",letterSpacing:4},
  heroDesc:{color:"#8899aa",letterSpacing:3,fontSize:13,marginBottom:8},
  syncBadge:{background:"rgba(76,175,80,0.1)",border:"1px solid rgba(76,175,80,0.3)",borderRadius:20,padding:"4px 14px",fontSize:11,color:"#4CAF50",marginBottom:12,display:"inline-flex",alignItems:"center",gap:6},
  btnRow:{display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center",marginBottom:16},
  btn:{padding:"11px 18px",borderRadius:10,border:"none",cursor:"pointer",fontWeight:700,fontSize:13,display:"flex",alignItems:"center",gap:6,transition:"all 0.15s"},
  btnGold:{background:"linear-gradient(135deg,#FFD700,#FFA500)",color:"#000"},
  btnGreen:{background:"linear-gradient(135deg,#2ecc71,#27ae60)",color:"#fff"},
  btnRed:{background:"linear-gradient(135deg,#e74c3c,#c0392b)",color:"#fff"},
  btnGray:{background:"#1e2d3d",color:"#ccc",border:"1px solid #2a3f55"},
  btnPurple:{background:"linear-gradient(135deg,#8e44ad,#6c3483)",color:"#fff"},
  btnWA:{background:"linear-gradient(135deg,#25D366,#128C7E)",color:"#fff"},
  btnOutline:{background:"#111d2a",color:"#fff",border:"1px solid #2a3f55",padding:"12px 16px",borderRadius:10,cursor:"pointer",width:"100%",display:"flex",alignItems:"center",fontSize:14,fontWeight:600},
  participantesChips:{display:"flex",gap:8,flexWrap:"wrap",justifyContent:"center"},
  chip:{background:"#1e2d3d",border:"1px solid #2a3f55",borderRadius:20,padding:"4px 14px",fontSize:13,color:"#aaa"},
  chipRow:{display:"flex",flexWrap:"wrap",gap:8},
  chipDel:{background:"#1e2d3d",border:"1px solid #2a3f55",borderRadius:20,padding:"4px 10px 4px 14px",fontSize:13,color:"#ccc",display:"flex",alignItems:"center",gap:6},
  delBtn:{background:"none",border:"none",color:"#f66",cursor:"pointer",fontSize:16,padding:0,lineHeight:1},
  topBar:{position:"sticky",top:0,zIndex:100,background:"rgba(10,15,30,0.96)",backdropFilter:"blur(10px)",borderBottom:"1px solid #1e2d3d",padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"},
  backBtn:{background:"none",border:"none",color:"#FFD700",cursor:"pointer",fontWeight:700,fontSize:14},
  topTitle:{fontWeight:800,fontSize:15},
  content:{padding:"14px",maxWidth:620,margin:"0 auto"},
  card:{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:16,marginBottom:12},
  cardTitle:{color:"#FFD700",margin:"0 0 12px",fontSize:15,fontWeight:800},
  input:{background:"#0d1a2e",border:"1px solid #2a3f55",borderRadius:8,padding:"10px 14px",color:"#fff",fontSize:14,outline:"none",width:"100%",boxSizing:"border-box"},
  jornadaTabs:{display:"flex",gap:6,overflowX:"auto",paddingBottom:4,scrollbarWidth:"none"},
  jornadaTab:{background:"#111d2a",border:"1px solid #2a3f55",borderRadius:8,padding:"6px 10px",color:"#aaa",cursor:"pointer",fontSize:11,fontWeight:700,whiteSpace:"nowrap",flexShrink:0,textAlign:"center",minWidth:72},
  jornadaTabActive:{background:"rgba(255,215,0,0.15)",borderColor:"#FFD700",color:"#FFD700"},
  grupoTab:{background:"#0d1a2e",border:"1px solid #1e2d3d",borderRadius:6,padding:"4px 10px",color:"#666",cursor:"pointer",fontSize:11,fontWeight:700,whiteSpace:"nowrap",flexShrink:0},
  grupoTabActive:{background:"rgba(142,68,173,0.2)",borderColor:"#8e44ad",color:"#c39bd3"},
  candadoRow:{display:"flex",alignItems:"center",gap:12,border:"1px solid",borderRadius:12,padding:"10px 14px"},
  cerradaBanner:{background:"rgba(231,76,60,0.12)",border:"1px solid rgba(231,76,60,0.4)",borderRadius:10,padding:"8px 14px",fontSize:13,color:"#e74c3c",marginBottom:8,textAlign:"center"},
  partidosList:{display:"flex",flexDirection:"column",gap:10},
  partidoCard:{background:"#0d1a2e",border:"1px solid #1e2d3d",borderRadius:12,padding:12,position:"relative"},
  partidoCardDone:{borderColor:"#2a3f55"},
  partidoAcertado:{borderColor:"#2ecc71",background:"rgba(46,204,113,0.07)"},
  partidoFallado:{borderColor:"#e74c3c",background:"rgba(231,76,60,0.07)"},
  grupoTag:{fontSize:10,color:"#555",fontWeight:600,letterSpacing:0.5,display:"block",marginBottom:6},
  vsRow:{display:"flex",alignItems:"center",gap:8,marginBottom:8},
  teamName:{flex:1,fontSize:13,fontWeight:700,color:"#ddd",lineHeight:1.3},
  vsText:{color:"#444",fontWeight:900,fontSize:10,flexShrink:0},
  btnResultRow:{display:"flex",gap:5},
  opcion:{flex:1,padding:"7px 4px",borderRadius:8,border:"1px solid #2a3f55",background:"#111d2a",color:"#777",cursor:"pointer",fontSize:11,fontWeight:700,transition:"all 0.12s"},
  opcionSelA:{background:"rgba(52,152,219,0.25)",borderColor:"#3498db",color:"#5dade2"},
  opcionSelE:{background:"rgba(155,89,182,0.25)",borderColor:"#9b59b6",color:"#c39bd3"},
  opcionSelB:{background:"rgba(231,76,60,0.25)",borderColor:"#e74c3c",color:"#e98e86"},
  opcionBloqueada:{opacity:0.5,cursor:"not-allowed"},
  aciertoBadge:{position:"absolute",top:8,right:8,background:"rgba(46,204,113,0.2)",border:"1px solid #2ecc71",borderRadius:6,padding:"2px 8px",fontSize:10,color:"#2ecc71",fontWeight:700},
  fallidoBadge:{position:"absolute",top:8,right:8,background:"rgba(231,76,60,0.2)",border:"1px solid #e74c3c",borderRadius:6,padding:"2px 8px",fontSize:10,color:"#e74c3c",fontWeight:700},
  tablaRow:{display:"flex",alignItems:"center",gap:12,padding:"12px 14px"},
  tablaFirst:{border:"1px solid rgba(255,215,0,0.3)",background:"rgba(255,215,0,0.05)"},
  posNum:{fontSize:20,width:34,textAlign:"center",flexShrink:0},
  puntosTag:{background:"#1e2d3d",border:"1px solid #2a3f55",borderRadius:10,padding:"8px 12px",fontWeight:900,fontSize:20,color:"#fff",textAlign:"center",flexShrink:0,minWidth:50},
  barWrap:{background:"#111d2a",borderRadius:4,height:4,marginTop:5,overflow:"hidden"},
  barFill:{height:"100%",borderRadius:4,transition:"width 0.5s"},
  faseBadge:{background:"#0d1a2e",border:"1px solid #1e2d3d",borderRadius:8,padding:"5px 8px",textAlign:"center",minWidth:44},
  faseBadgeGold:{border:"1px solid rgba(255,215,0,0.4)",background:"rgba(255,215,0,0.07)"},
  ganadorBanner:{background:"rgba(255,215,0,0.1)",border:"1px solid rgba(255,215,0,0.3)",borderRadius:10,padding:"8px 14px",fontSize:13,color:"#FFD700",marginBottom:8,textAlign:"center"},
  ganadorBig:{fontSize:16,fontWeight:800,color:"#FFD700",display:"flex",alignItems:"center",gap:6},
  jornadaBadge:{background:"rgba(255,215,0,0.15)",border:"1px solid rgba(255,215,0,0.3)",borderRadius:6,padding:"2px 7px",fontSize:10,color:"#FFD700",fontWeight:700},
  jornadaCardActiva:{border:"1px solid rgba(255,215,0,0.25)",background:"rgba(255,215,0,0.03)"},
  notif:{position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",background:"#2ecc71",color:"#000",fontWeight:700,borderRadius:10,padding:"10px 24px",fontSize:14,boxShadow:"0 4px 20px rgba(0,0,0,0.5)",zIndex:999,whiteSpace:"nowrap"},
  notifError:{background:"#e74c3c",color:"#fff"},
  spinner:{width:32,height:32,border:"3px solid #1e2d3d",borderTop:"3px solid #FFD700",borderRadius:"50%",animation:"spin 0.8s linear infinite"},
};
if(typeof document!=="undefined"){const st=document.createElement("style");st.textContent="@keyframes spin{to{transform:rotate(360deg)}}";document.head.appendChild(st);}
