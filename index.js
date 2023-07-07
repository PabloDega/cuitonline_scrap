const puppeteer = require("puppeteer");
const fs = require("fs");

let cuils = [];
let cuilsI = 0;
let cuil;

function loopear() {
  if (cuilsI < cuils.length) {
    cuil = cuils[cuilsI];
    scrap(cuil);
  }
}
async function scrap(cuil) {
  let url = `https://www.cuitonline.com/detalle/${cuil}/`;
  await buscar(url, cuil);
  cuilsI++;
  loopear();
}

async function buscar(url, cuil) {
  const navegador = await puppeteer.launch({ headless: false });
  const pagina = await navegador.newPage();
  try {
    await pagina.goto(url, { waitUntil: "domcontentloaded" });
    let info = await pagina.evaluate(() => {
      let h2 = document.querySelectorAll(".impuestos_activos");
      let i = h2.length;
      i--;
      let datos = [];
      document.querySelectorAll(".impuestos_activos~div>span").forEach((x) => {
        let y = x.innerText;
        y = y.replace(/[\r\n]/gm, "");
        datos.push(y);
      });
      return datos;
    });
    fs.appendFile("datos.txt", `${cuil}; ${info} \n`, (e) => {
      console.log(e);
    });
  } catch (error) {
    fs.appendFile("datos.txt", `${cuil}; Error \n`, (error) => {
      console.log(error);
    });
  } finally {
    await navegador.close();
    console.log("fin I:" + cuilsI);
  }
}

scrap(cuils[cuilsI]);
