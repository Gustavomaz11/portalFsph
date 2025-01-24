import crypto from 'crypto';

const dados_criptografia = {
    digest: 'sha512',
    salt: "Fsph9875321%$#@!",
    codificacao: "utf8",
    tipo: "base64",
    interacao:(512 * 512),
    keylen: 0
};

export default function criptografar(senha) {

    dados_criptografia.keylen = (senha.length * 11);

    const hash = crypto.pbkdf2Sync(senha, 
        dados_criptografia.salt, 
        dados_criptografia.interacao, 
        dados_criptografia.keylen, 
        dados_criptografia.digest
    );

    return hash.toString(dados_criptografia.tipo);
};
