const {chromium}=require("playwright");
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROME});const p=await b.newPage();
p.on("response",r=>{if(r.status()>=400)console.log(r.status(),r.url())});
p.on("console",m=>{if(m.type()==="error")console.log("ERR",m.text())});
for(const u of ["/","/explore/","/compare/","/how/","/print/"]){await p.goto("http://localhost:4173"+u);await p.waitForTimeout(2500);}
await b.close();})();
