import ldap from 'ldapjs';

// Configurações do servidor LDAP
const server = {
    url: 'ldap://servidor.exemplo.com',
    bindDN: 'cn=admin,dc=exemplo,dc=com',
    bindCredentials: 'senha_admin',
    searchBase: 'dc=exemplo,dc=com'
};

// Criar cliente LDAP
const client = ldap.createClient({
    url: server.url
});

// Função para autenticar usuário
function authenticateUser(username, password) {
    return new Promise((resolve, reject) => {
        // Realizar bind com credenciais do usuário
        client.bind(`uid=${username},${server.searchBase}`, password, (err) => {
            if (err) {
                reject(new Error('Falha na autenticação'));
            } else {
                resolve('Usuário autenticado com sucesso');
            }
        });
    });
}

// Função para buscar usuário
function searchUser(username) {
    return new Promise((resolve, reject) => {
        // Primeiro, fazer bind como admin
        client.bind(server.bindDN, server.bindCredentials, (bindErr) => {
            if (bindErr) {
                return reject(bindErr);
            }

            // Configurar opções de busca
            const searchOptions = {
                filter: `(uid=${username})`,
                scope: 'sub',
                attributes: ['cn', 'mail', 'department']
            };

            // Realizar busca
            client.search(server.searchBase, searchOptions, (err, searchResult) => {
                const entries = [];

                searchResult.on('searchEntry', (entry) => {
                    entries.push(entry.object);
                });

                searchResult.on('error', (searchErr) => {
                    reject(searchErr);
                });

                searchResult.on('end', () => {
                    resolve(entries);
                });
            });
        });
    });
}

// Função para adicionar novo usuário
function addUser(userData) {
    return new Promise((resolve, reject) => {
        // Bind como admin
        client.bind(server.bindDN, server.bindCredentials, (bindErr) => {
            if (bindErr) {
                return reject(bindErr);
            }

            // Preparar entrada do novo usuário
            const entry = {
                cn: userData.name,
                sn: userData.surname,
                uid: userData.username,
                mail: userData.email,
                objectClass: ['inetOrgPerson', 'posixAccount', 'top']
            };

            // Adicionar entrada
            client.add(`uid=${userData.username},${server.searchBase}`, entry, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve('Usuário adicionado com sucesso');
                }
            });
        });
    });
}

// Exemplo de uso
async function main() {
    try {
        // Autenticar usuário
        await authenticateUser('joao.silva', 'senha123');

        // Buscar usuário
        const users = await searchUser('joao.silva');
        console.log('Usuários encontrados:', users);

        // Adicionar novo usuário
        await addUser({
            name: 'Maria',
            surname: 'Souza',
            username: 'maria.souza',
            email: 'maria@exemplo.com'
        });

    } catch (error) {
        console.error('Erro:', error);
    } finally {
        // Fechar conexão
        client.unbind();
    }
}

// Executar exemplo
main();