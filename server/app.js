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

app.get("/jogador/:id", (req, res) => {
    const id = req.params.id;
    const jogador = db.jogadores.players.find((j) => j.steamid === id);
    const jogos = db.jogos[id].games;

    jogador.quantidadeJogos = db.jogos[id].game_count;
    jogador.quantidadeNaoJogados = jogos.filter(
        (j) => !j.playtime_forever
    ).length;

    jogador.jogos = jogos
        .sort((j1, j2) => (j1.playtime_forever < j2.playtime_forever ? 1 : -1))
        .slice(0, 5);

    jogador.jogos.forEach(
        (j) => (j.tempo_hora = Math.round(j.playtime_forever / 60))
    );
    jogador.jogoPreferido = jogador.jogos[0];

    res.render("jogador", jogador);
});
