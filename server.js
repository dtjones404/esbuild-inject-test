const { readFileSync } = require("fs");
const Express = require("express");
const Esbuild = require("esbuild");

const app = Express();

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

function injectRuntimeGlobals(script, runtimeGlobals) {
  const params = Object.keys(runtimeGlobals).toString();
  const args = JSON.stringify(runtimeGlobals);

  return `(function({${params}}){
    ${script}
  })(${args});`;
}

app.get("/js", async (req, res) => {
  await Esbuild.build({
    entryPoints: ["src/index.js"],
    bundle: true,
    outdir: "dist",
  });

  const animalSounds = { chicken: "cluck", cow: "moo" };

  const script = readFileSync("./dist/index.js").toString();
  const injectedScript = injectRuntimeGlobals(script, {
    __ANIMAL_SOUNDS__: animalSounds,
  });

  res.contentType = "text/javascript";
  res.send(injectedScript);
});

const PORT = 3007;
app.listen(PORT, () => console.log("listening at http://localhost:3007"));
