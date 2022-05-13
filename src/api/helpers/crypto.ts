import crypto from 'crypto';

const algorithm = 'aes-256-ctr';
const iv = crypto.randomBytes(16);

const genRandomString = (length:number) => {
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
};

const sha512 = (password:string, salt:string) => {
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        hash:value
    };
};

const sha_encrypt = (auth:string, salt:string) => {
    try{
    var data = sha512(auth, salt);
    return {
        iv: data.salt,
        content: data.hash
    }
    } catch(e) {
        return({
            msg:'encryption error',
            error: Error(e) 
        })
    }
}

const generate_salt = () => {
    return genRandomString(16); /** Gives us salt of length 16 */
}

const encrypt = (text:string) => {
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };
};

interface IHash {
    iv:string
    content:string
}

const decrypt = (hash:IHash) => {
    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));
    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);
    return decrpyted.toString();
};


module.exports = { sha_encrypt, generate_salt, encrypt, decrypt }