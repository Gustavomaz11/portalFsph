process.env.TZ = 'America/Bahia';

function DataHora() {
    const datetime = new Date();
    const ano = datetime.getFullYear();

    let mes = datetime.getMonth() + 1;
    let dia = datetime.getDate();
    let hor = datetime.getHours();
    let min = datetime.getMinutes();
    let seg = datetime.getSeconds();

    mes = mes.toString().length == 1 ?  '0' + mes : mes;
    dia = dia.toString().length == 1 ? '0' + dia : dia;
    hor = hor.toString().length == 1 ? '0' + hor : hor;
    min = min.toString().length == 1 ? '0' + min : min;
    seg = seg.toString().length == 1 ? '0' + seg : seg;

    return dia + '-' + mes + '-' + ano  + ' ' + hor + ':' + min + ':' + seg
}

function DataHoraUS() {
    const datetime = new Date();
    const ano = datetime.getFullYear();

    let mes = datetime.getMonth() + 1;
    let dia = datetime.getDate();
    let hor = datetime.getHours();
    let min = datetime.getMinutes();
    let seg = datetime.getSeconds();

    mes = mes.toString().length == 1 ?  '0' + mes : mes;
    dia = dia.toString().length == 1 ? '0' + dia : dia;
    hor = hor.toString().length == 1 ? '0' + hor : hor;
    min = min.toString().length == 1 ? '0' + min : min;
    seg = seg.toString().length == 1 ? '0' + seg : seg;

    return ano + '-' + mes + '-' + dia  + ' ' + hor + ':' + min + ':' + seg
}

function Data() {
    const datetime = new Date();

    const ano = datetime.getFullYear();
    let mes = datetime.getMonth() + 1;
    let dia = datetime.getDate();

    mes = mes.toString().length == 1 ?  '0' + mes : mes;
    dia = dia.toString().length == 1 ? '0' + dia : dia;
   
    return dia + '-' + mes + '-' + ano
}

function Hora() {
    const datetime = new Date();

    let hor = datetime.getHours();
    let min = datetime.getMinutes();
    let seg = datetime.getSeconds();

    return hor + ':' + min + ':' + seg
}

export { DataHora, DataHoraUS, Data, Hora }