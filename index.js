import express, { urlencoded } from "express";
import mysql from "mysql2";
import session from "express-session";
import crypto from "crypto";
import cors from "cors";

function gerarhash(text) {
    return crypto.createHash('sha256').update(text).digest('hex');
}

const corsoption = ({
    origin: '*',
    methods: "GET,POST",
    allowedHeaders: 'Content-Type,Authorization'
});


const app = express();
app.use(cors(corsoption))
app.use(express.json());
app.use(express.static('views'));
app.use(express.static('resources'));
app.use(express.static('vue'));
app.use(urlencoded({ extended: true }))
app.set('trust proxy', 1) 
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}))
const mysqli = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "bd_gerenciador",
    connectionLimit : 10
});

app.post('/cadastro', (req, res) => {
    const { nome ,email, senha, cargo } = req.body;
    const sql = "SELECT email FROM usuario WHERE email = ?";
    mysqli.query(sql, [ email ], (err, results) => {
        if(err){
            console.log("deu erro ao fazer a pesquisa", err);
        }
        
        if(results.length > 0){
            console.log("ja existe um usuario");
        }
        else{
            const hashed = gerarhash(senha);
            const insert = "INSERT INTO usuario( nome, email, senha, cargo) VALUES(?, ?, ?, ?)";
            mysqli.query(insert, [ nome ,email, hashed, cargo ], (err, result) => {
                if(err){
                    console.log("erro ao tentar cadastrar usuario", err);
                }
                res.status(200).redirect('/login.html');
            });
        };
    });
});

app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    const hashed = gerarhash(senha)
    const sql = "SELECT * FROM usuario WHERE email = ? AND senha = ?";
    mysqli.query(sql, [email, hashed], (err, result) => {
        if(err){
            console.log("erro ao fazer login erro", err)
        };
        
        if(result.length > 0){
            req.session.user = result[0];
            res.status(200).redirect('/gerenciador.html')
        }
        else{
            console.log('erro ao eo tentar fazer login', err)
        }
    })
});

app.get('/users', (req ,res) => {
    const sql = "SELECT * FROM usuario";    
    mysqli.query(sql, (err, result) => {
        if(err){
            console.log(err, "na linha 59");
        }
        if(result){
            res.json(result);
        }

    })
});

app.get('/user-info', (req, res) => {
    if (req.session.user) {
        res.json(req.session.user); 
    } else {
        res.status(401).json({ message: 'Usuário não autenticado' });
    }
});

app.delete('/deletar-usuario/:name', (req, res) => {
    const userName = req.params.name;
    const sql = "DELETE FROM usuario WHERE nome = ?";

    mysqli.query(sql, [userName], (err, result) => {
        if (err) {
            console.log("Erro ao tentar deletar o usuário:", err);
            return res.status(500).json({ message: "Erro ao tentar deletar o usuário" });
        }

        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Usuário deletado com sucesso" });
        } else {
            res.status(404).json({ message: "Usuário não encontrado" });
        }
    });
});

app.put('/usuarios/:id_usuario', (req, res) => {
    const id_usuario = req.params.id_usuario;
    const { nome, email, cargo } = req.body; 

    if (!nome || !email || !cargo) {
        return res.status(400).json({ message: "Nome, email e cargo são obrigatórios." });
    }

    const sql = "UPDATE usuario SET nome = ?, email = ?, cargo = ? WHERE id_usuario = ?";
    mysqli.query(sql, [nome, email, cargo, id_usuario], (err, result) => {
        if (err) {
            console.log("Erro ao atualizar usuário:", err);
            return res.status(500).json({ message: "Erro ao atualizar usuário" });
        }
        if (result.affectedRows > 0) {
            res.json({ message: "Usuário atualizado com sucesso!" });
        } else {
            res.status(404).json({ message: "Usuário não encontrado" });
        }
    });
});


app.put('/produtos/:id', (req, res) => {
    const id = req.params.id;
    const { nome, preco } = req.body;

    if (!nome || !preco) {
        return res.status(400).json({ message: "Nome e preço são obrigatórios." });
    }

    const sql = "UPDATE produto SET nome = ?, preco = ? WHERE id_produto = ?";
    mysqli.query(sql, [nome, preco, id], (err, result) => {
        if (err) {
            console.log("Erro ao atualizar produto:", err);
            return res.status(500).json({ message: "Erro ao atualizar produto" });
        }
        if (result.affectedRows > 0) {
            res.json({ message: "Produto atualizado com sucesso!" });
        } else {
            res.status(404).json({ message: "Produto não encontrado" });
        }
    });
});


app.get('/produtos', (req, res) => {
    const sql = "SELECT * FROM produto";
    mysqli.query(sql, (err, result) => {
        if (err) {
            console.log("Erro ao listar produtos:", err);
            return res.status(500).json({ message: "Erro ao listar produtos" });
        }
        res.json(result); 
    });
});

app.post('/produtos', (req, res) => {
    const { nome, preco } = req.body;

    if (!nome || !preco) {
        return res.status(400).json({ message: "Nome e preço são obrigatórios." });
    }

    const sql = "INSERT INTO produto (nome, preco) VALUES (?, ?)";
    mysqli.query(sql, [nome, preco], (err, result) => {
        if (err) {
            console.log("Erro ao criar produto:", err);
            return res.status(500).json({ message: "Erro ao criar produto" });
        }
        res.status(201).json({ message: "Produto criado com sucesso!" });
    });
});

app.put('/produtos/:id', (req, res) => {
    const id = req.params.id;
    const { nome, preco } = req.body;

    if (!nome || !preco) {
        return res.status(400).json({ message: "Nome e preço são obrigatórios." });
    }

    const sql = "UPDATE produto SET nome = ?, preco = ? WHERE id_produto = ?";
    mysqli.query(sql, [nome, preco, id], (err, result) => {
        if (err) {
            console.log("Erro ao atualizar produto:", err);
            return res.status(500).json({ message: "Erro ao atualizar produto" });
        }
        if (result.affectedRows > 0) {
            res.json({ message: "Produto atualizado com sucesso!" });
        } else {
            res.status(404).json({ message: "Produto não encontrado" });
        }
    });
});

app.delete('/deletar-produto/:id', (req, res) => {
    const id = req.params.id;

    const sql = "DELETE FROM produto WHERE id_produto = ?";
    mysqli.query(sql, [id], (err, result) => {
        if (err) {
            console.log("Erro ao deletar produto:", err);
            return res.status(500).json({ message: "Erro ao deletar produto" });
        }
        if (result.affectedRows > 0) {
            res.json({ message: "Produto deletado com sucesso!" });
        } else {
            res.status(404).json({ message: "Produto não encontrado" });
        }
    });
});


app.listen(3000, () => {
    console.log("servidor rodando na porta 3000");
})