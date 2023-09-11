export class CartsManager{
    constructor(path) {
        this.pathFile = path;
      }
      fileExist() {
        return fs.existsSync(this.pathFile);
      }
    
      //metodo para buscar todos los carritos
      async getCarts() {
        try {
          if (this.fileExist()) {
            const dataCarts = await fs.promises.readFile(this.pathFile, "utf-8");
            return JSON.parse(dataCarts);
          } else {
            throw new Error("No es posible obtener los carritos");
          }
        } catch (error) {
          console.log(error.message);
          throw error;
        }
      }
       
}

