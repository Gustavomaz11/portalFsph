import Imap from 'imap';
import {simpleParser} from 'mailparser';

// Configuração do IMAP
const imapConfig = {
    user: 'ovidio.neto',
    password: 'S3cr3t@1968',
    host: 'abais.se.gov.br',
    port: 143,
    tls: false,
    tlsOptions: { rejectUnauthorized: false }
};

const imap = new Imap(imapConfig);

// Array para armazenar as mensagens
let messages = [];
 
// Criar tabela
let table = [];

function processMessage(msg, seqno) {
    
    // Corrigido: Acessar a parte correta da mensagem
    msg.on('body', function(stream, info) {
        let buffer = '';
        let uid = 0;
        
        stream.on('data', function(chunk) {
            buffer += chunk.toString('utf8');
        });

        // Captura o UID através do evento attributes
        msg.once('attributes', function(attrs) {
          uid = attrs.uid;  // O UID estará disponível aqui
        });
        
        stream.on('end', function() {

            simpleParser(buffer, (err, mail) => {
                if (err) {
                    console.error('Erro ao analisar email:', err);
                    return;
                }

                messages.push({ 
                    uid: uid,                   
                    from: mail.from ? (mail.from.text.substring(0, 28) + (mail.from.text.length > 28 ? '...' : '')) : 'Desconhecido',
                    subject: mail.subject ? (mail.subject.substring(0, 38) + (mail.subject.length > 38 ? '...' : '')) : '(sem assunto)',
                    date: mail.date ? new Date(mail.date).toLocaleDateString() : 'Data desconhecida',
                    status: msg.flags && msg.flags.includes('\\Seen') ? 'Lido' : 'Não lido'
                });
            });
        });

    });
    
    msg.once('attributes', function(attrs) {
        // Podemos usar attrs.uid para identificar a mensagem unicamente
        // attrs.flags para status da mensagem

    });
    
    msg.once('end', function() {
        // Mensagem processada completament
    });
}

function checkEmails(req,res) {
    
    imap.once('ready', () => {
    
        imap.openBox('INBOX', false, (err, box) => {
    
            if (err) {
                console.error('Erro ao abrir inbox:', err);
                return;
            }
            
            // Buscar os últimos 10 emails
            const searchCriteria = ['ALL'];
            const fetchOptions = {
                bodies:['HEADER.FIELDS (FROM SUBJECT DATE)', 'TEXT'],
                struct: false,
                uid: true
            };
            
            imap.search(searchCriteria, (err, results) => {
    
                if (err) {
                    console.error('Erro na busca:', err);
                    return;
                }
                
                if (!results.length) {
                    console.log('Nenhum email encontrado.');
                    imap.end();
                    return;
                }
                
                // Pegar apenas os últimos 10 emails
                const recent = results.slice(Math.max(results.length - 10, 0));
               
                const fetch = imap.fetch(recent, fetchOptions);
                
                fetch.on('message', processMessage);
                
                fetch.once('error', err => {
                    console.error('Erro ao buscar emails:', err);
                });
                                
                fetch.once('end', () => {

                    table = [];

                    // Aguardar um pouco para ter certeza que todas as mensagens foram processadas
                    setTimeout(() => {
                        // Ordenar mensagens por data
                        messages.sort((a, b) => new Date(b.date) - new Date(a.date));
                        
                        // Adicionar mensagens na tabela
                        messages.forEach(msg => {
                            msg.from != 'Desconhecido' && table.push({uid:msg.uid,de:msg.from,assunto: msg.subject,data: msg.date, situacao: msg.status});
                        });
                        
                        imap.end();
                    }, 1000);
                });

            });

        });
    });
    
    imap.once('error', err => {
        console.error('Erro de conexão:', err);
    });
    
    imap.once('end', () => {

        messages = []

        res.status(200).json(table)

        console.log('Conexão finalizada');
    });
    
    imap.connect();
}
export default checkEmails