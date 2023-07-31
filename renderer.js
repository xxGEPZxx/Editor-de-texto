const { ipcRenderer } = require("electron");
const path = require("path");

window.addEventListener("DOMContentLoaded", () => {
  const el = {
    documentName: document.getElementById("documentName"),
    createDocumentBtn: document.getElementById("createDocumentBtn"),
    openDocumentBtn: document.getElementById("openDocumentBtn"),
    fileTextarea: document.getElementById("fileTextarea")
  };

  const handleDocumentChange = (filePath, content = "") => {
    el.documentName.innerHTML = path.parse(filePath).base;
    el.fileTextarea.removeAttribute("disabled");    
    el.fileTextarea.value = content;  
    /*    let texto = content;
    let contEspacios = texto.split(/\s+/).length - 1;
    console.log(contEspacios);        
    document.getElementById("prueba").innerHTML = contEspacios */    
    setInterval(contarPalabras(content), 1000);
    setInterval(contarEspacios(content), 1000);
    el.fileTextarea.focus();
  };

  function contarPalabras(content) {
    el.fileTextarea.value = content;
    let texto = content;
    let contPalabras = texto.replace(/[ ]+/g," ").replace(/^ /,"").replace(/ $/,"").split(" ").length;
    document.getElementById("Palabras").innerHTML = 'Tiene: ' + contPalabras + ' palabras.';
  }
      
  function contarEspacios(content) {   
    el.fileTextarea.value = content; 
    let texto = content;
    let contEspacios = texto.split("")
    .filter(char => char == " ").length;
    document.getElementById("Espacios").innerHTML ='Tiene: ' + contEspacios + ' espacios.';
  }

  el.createDocumentBtn.addEventListener("click", () => {
    ipcRenderer.send("create-document-triggered");
  });

  el.openDocumentBtn.addEventListener("click", () => {
    ipcRenderer.send("open-document-triggered");
  });

  el.fileTextarea.addEventListener("input", (e) => {
    ipcRenderer.send("file-content-updated", e.target.value);
  });

  ipcRenderer.on("document-opened", (_, { filePath, content }) => {
    handleDocumentChange(filePath, content);
  });

  ipcRenderer.on("document-created", (_, filePath) => {
    handleDocumentChange(filePath);
  });
});
