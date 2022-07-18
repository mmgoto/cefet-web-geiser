// importação de dependência(s)
import express from "express";
import fs from "fs";
import hbs from "express-handlebars";
import _ from "underscore";

const jogadores = JSON.parse(
    fs.readFileSync("./server/data/jogadores.json", "utf8")
);

const jogos = JSON.parse(
    fs.readFileSync("./server/data/jogosPorJogador.json", "utf8")
);

const PORT = 3000;
const db = { jogadores, jogos };
const app = express();
app.engine("hbs", hbs.engine({ extname: "hbs", defaultLayout: "main" }));
app.set("view engine", "hbs");
app.set("views", "server/views");

app.use(express.static("client"));
app.listen(PORT, () => {
    console.log("Escutando em: http://localhost:3000");
});

app.get("/", (request, response) => {
    response.render("index", { db }); // desenha a view 'index'
});

app.get("/jogador/:id/", (request, response) => {
    const res = db.jogadores.players.find((player) => {
        if (player.steamid == request.params.id) {
            return player;
        }
    });

    const res2 = db.jogos[request.params.id];

    response.render("jogador", { res, res2 });
});

// EXERCÍCIO 3
// definir rota para página de detalhes de um jogador --> renderizar a view
// jogador, usando os dados do banco de dados "data/jogadores.json" e
// "data/jogosPorJogador.json", assim como alguns campos calculados
// dica: o handler desta função pode chegar a ter ~15 linhas de código
