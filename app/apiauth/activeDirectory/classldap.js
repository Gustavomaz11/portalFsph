import ActiveDirectory from 'activedirectory2';

export default class {

    #ad = null

    constructor(username,password,url,basedn,port) {

        this.#ad = new ActiveDirectory({
            url: 'ldap://' + url + ':' + port,
            baseDN: basedn,
            username: username,
            password: password,
            timeout: 5000,
            connectTimeout: 8000
        });
    }

    Autenticate(username,password) {

        return new Promise((resolve,reject) => {

            this.#ad.authenticate(username,password, function(err,auth)  {

                if (err) {
                    reject(err)
                }
                
                if (auth) {
                    resolve(true);
                }
                else {
                    reject(false);
                }
    
            });

        });

    }

    FindUser(username) {

        return new Promise((resolve,reject) => {

            this.#ad.findUser(username, function(err, user) {

                if (err) {
                    reject(err)
                }

                resolve({
                    user: user.sAMAccountName.toLowerCase(),
                    email: user.mail,
                    fullname: user.cn,
                    sector: user.dn.split(',')[1].split('=')[1],
                });


            });

        });

    }

}
