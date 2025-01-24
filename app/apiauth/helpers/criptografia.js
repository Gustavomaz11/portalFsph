import crypto from 'crypto-js';

const dados_criptografia = {
    digest: process.env.DIGEST,
    salt: process.env.SALT,
    codificacao: process.env.CODIFICACAO,
    tipo: process.env.TIPO,
    interacao: process.env.INTERACAO,
    keylen: 0
};

export function criptografar_pbkdf2(senha) {

    dados_criptografia.keylen = (senha.length * 11);
    
    const hash = crypto.pbkdf2Sync(senha, 
        dados_criptografia.salt, 
        dados_criptografia.interacao, 
        dados_criptografia.keylen, 
        dados_criptografia.digest
    );

    return hash.toString(dados_criptografia.tipo);
};

export function encrypt_AES(senha,salt) {

    return crypto.AES.encrypt(senha,salt).toString();

}

export function decrypt(senha,salt) {

    const bytes = crypto.AES.decrypt(senha,salt);

    return bytes.toString(crypto.enc.Utf8)

}
