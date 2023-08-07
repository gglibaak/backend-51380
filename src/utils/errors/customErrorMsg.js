class customErrorMsg {
  MailErrorInfo = (data) => {
    return `
          Una o mas propiedades estan incompletas o invalidas!
          Propiedades obligatorias:
              ${data}
          `;
  };

  MailGenErrorInfo = (data) => {
    return `
          * ${data}
          `;
  };
}

module.exports = new customErrorMsg();
