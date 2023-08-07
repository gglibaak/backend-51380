class customErrorMsg {
  generateMailErrorInfo = (name) => {
    return `
          Una o mas propiedades estan incompletas o invalidas!
          Propiedades obligatorias:
              ${name}
          `;
  };
}

module.exports = new customErrorMsg();
