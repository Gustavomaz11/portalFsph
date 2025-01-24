import imap from 'imap';
import {simpleParser} from 'mailparser';
import fs from 'fs/promises';
import path from 'path';

// Configuração do IMAP
const imapConfig = {
  user: 'ovidio.neto',
  password: 'S3cr3t@1967',
  host: 'abais.se.gov.br',
  port: 143,
  tls: false,
  tlsOptions: { rejectUnauthorized: false }
};

// Função para buscar uma mensagem específica por UID
function getFullMessage(uid) {
    
    return new Promise((resolve, reject) => {
    
        imap.once('ready', () => {
    
            imap.openBox('INBOX', false, (err, box) => {
                if (err) {
                    reject(err);
                    return;
                }

                const fetchOptions = {
                    bodies: '',
                    struct: true,
                    uid: true
                };

                const fetch = imap.fetch(uid, fetchOptions);
                let messageData = null;

                fetch.on('message', (msg, seqno) => {
                    msg.on('body', function(stream, info) {
                        let buffer = '';

                        stream.on('data', function(chunk) {
                            buffer += chunk.toString('utf8');
                        });

                        stream.on('end', function() {
                            simpleParser(buffer, async (err, mail) => {
                                if (err) {
                                    reject(err);
                                    return;
                                }

                                messageData = {
                                    uid: uid,
                                    from: mail.from ? mail.from.text : 'Desconhecido',
                                    to: mail.to ? mail.to.text : '',
                                    subject: mail.subject || '(sem assunto)',
                                    date: mail.date,
                                    text: mail.text,
                                    html: mail.html,
                                    attachments: mail.attachments || []
                                };

                                resolve(messageData);
                            });
                        });
                    });
                });

                fetch.once('error', err => {
                    reject(err);
                });

                fetch.once('end', () => {
                    imap.end();
                });
            });
        });

        imap.once('error', err => {
            reject(err);
        });

        imap.connect();
    });
}

// Função para salvar anexos
async function saveAttachment(attachment, downloadDir = './downloads') {
    try {
        // Criar diretório se não existir
        await fs.mkdir(downloadDir, { recursive: true });
        
        const filePath = path.join(downloadDir, attachment.filename);
        await fs.writeFile(filePath, attachment.content);
        
        return filePath;
    } catch (error) {
        throw new Error(`Erro ao salvar anexo: ${error.message}`);
    }
}

// Função para buscar mensagem e seus anexos
async function getMessageWithAttachments(req, res) {
    
    try {
    
        const { uid } = req.params; // Assume que o UID vem como parâmetro da URL
        
        const message = await getFullMessage(uid);
        
        // Se quiser salvar os anexos automaticamente
        if (message.attachments && message.attachments.length > 0) {
            const savedAttachments = await Promise.all(
                message.attachments.map(async (attachment) => {
                    const filePath = await saveAttachment(attachment);
                    return {
                        filename: attachment.filename,
                        size: attachment.size,
                        contentType: attachment.contentType,
                        savedPath: filePath
                    };
                })
            );
            message.attachments = savedAttachments;
        }

        res.status(200).json(message);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Modificar a rota no seu Express para incluir a nova função
// app.get('/emails/:uid', getMessageWithAttachments);

export {getMessageWithAttachments };