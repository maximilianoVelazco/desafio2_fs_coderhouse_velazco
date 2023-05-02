import fs from 'fs';

class ProductManager {
    constructor() {
        this.path = 'products.json';
    };

    //agrego un nuevo producto
    async addProduct(title, description, price, thumbnail, code, stock) {
        let products = await this.getProducts();

        const newProduct = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            id: products.length + 1
        };
        //valido que no exista el codigo que se ingresara
        let searchCode = products.find(searchCode => searchCode.code === code);
        //mensaje si el codigo ya esta en uso
        if (searchCode) {
            console.log(`El codigo ${code} ya esta siendo utilizado en otro producto.
            Por favor elija uno distinto`)

            //valido que el precio sea un numero o mayor que cero    
        } else if (typeof price !== 'number' || price <= 0) {
            console.log('El precio debe ser un número o un número mayor que cero')
        }
        else {
            products.push(newProduct)
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'))
        }
    };

    //metodo para ver todos los productos
    async getProducts() {
        //leo el archivo donde estan guardados los productos
        let dbProducts = await fs.promises.readFile(this.path);
        //parseo dbProducts
        let products = JSON.parse(dbProducts);
        //muestro todos los productos
        return products;
    };

    //metodo para buscar un producto de acuerdo a su ID
    async getProductsByID(el) {
        let products = await this.getProducts();

        //busco si existe el valor proporcionado en el parametro
        const searchId = await products.find(product => product.id == el);
        if (searchId) {
            //si hay coincidencia muestro seachId
            return searchId
        }
        //mensaje si no hay coincidencia
        console.log('El ID consutado no corresponde con ningun producto en la base de datos')
    };

    //metodo para actualizar alguna clave del poducto seleccionado por su id
    async updateProduct(id, keyToChange, newValue) {
        let products = await this.getProducts();
        //busco si existe el id y guardo su indice si existe
        let searchIndex = await products.findIndex(product => product.id === id);
        //mensaje si el id no existe
        if (searchIndex == -1) {
            console.log("El id no corresponde a ninguno de la base")
            //accion si existe el id    
        } else {
            //busco en los productos el indice y su clave y le asigno un valor nuevo
            products[searchIndex][keyToChange] = newValue
            //reescribo el archivo
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
            return `El producto ${products[searchIndex].title} a cambiado el valor de su ${keyToChange} por el de ${newValue}`
        }
    };

    //metodo para eliminar un producto a partir de su id
    async deletePoduct(id) {
        let products = await this.getProducts();
        let searchIndex = await products.findIndex(product => product.id === id);
        if (searchIndex !== -1) {
            products.splice(searchIndex, 1);
            //reiniciar el valor de los id de cada producto despues de eliminar uno
            for (let i = 0; i < products.length; i++) {
                products[i].id = i + 1;
            }
        } else { console.log("El id no corresponde a ninguno de la base") };

        await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
    };
};

let producto = new ProductManager;

//AGREGA UN NUEVO PRODUCTO
producto.addProduct("Manzana", "Esta es la descripcion de una manzana", 400, "Foto de una manzana", 4263, 83)
//producto.addProduct("Sandia", "Esta es la descripcion de una sandida", '450', "Foto de una sandia", 4454, 150);//--> este no va a agregar el producto porque el price no tiene el formato correcto
//producto.addProduct("Manzana", "Esta es la descripcion de una manzana", 500, "Foto de una manzana", 4263, 21); //--> este addProduct dara error por repetir el codigo
producto.addProduct("Mandarina", "Esta es la descripcion de una mandarina", 255, "Foto de una mandarina", 2059, 100);

//MUESTRA TODA LA LISTA DE PRODUCTOS
//console.table(await producto.getProducts());

//BUSCA UN PRODUCTO MEDIANTE SU ID
//console.log( await producto.getProductsByID(2))

//CAMBIA EL VALOR DE UN PRODUCTO MEDIANTE SU ID, SU CLAVE Y EL VALOR NUEVO DE LA CLAVE A CAMBIAR
//let cambiar = await producto.updateProduct(4, "title", "Durazno")
//console.log(cambiar)

//ELIMINA UN PRODUCTO DE LA LISTA A PARTIR DE SU ID
//console.log(await producto.deletePoduct(1));