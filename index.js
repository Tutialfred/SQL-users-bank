const { db, Op, Account, Bank } = require("./db")
const express = require("express");

const server = express()
server.use(express.json())

// TRABAJANDO CON EL MODELO 'ACCOUNT'

// Crear informacion en el modelo 
server.post("/account", async (req, res) => {

    const { users, password, product, season, age } = req.body
    // Recibir informacion por body ↑ Informacion que quiero meter dentro de la base de datos 'account'

    try {
        const newAccount = await Account.create({
            users,
            password,
            product,
            season,
            age,
        });
        console.log(newAccount.toJSON());
        res.json(newAccount)

    } catch (error) {
        res.send(error)
    }
});

// Obtener toda la informacion dependiendo de la busqueda con el 'query'
server.get("/account", async (req, res) => {

    const { usuario } = req.query;

    if (usuario) { // Si llega el nombre por query
        // SELECT * FROM "Account" WHERE users = users
        try {
            const user = await Account.findAll({
                where: { //findAll devuelve un arreglo
                    users: usuario
                }
            });


            if (user.length > 0) {
                res.status("201").json(user)
            } else {
                res.status("404").send(`<h1 style=color:#111faf>El usuario → ${usuario} = No fue encontrado</h1>`)
            }

        } catch (error) {
            res.send(error)
        }


        // ↓ SI no le llega el 'query' ↓

    } else {
        try {
            // Si ya tenia elementos que los muestre y si no tiene nada manda un mensaje
            // SELECT * FROM "Account"
            const all = await Account.findAll()

            if (all.length > 0) {
                res.json(all) //all = un array de objetos
            } else {
                res.status("404").send(`<h1 style="background-color:#e60000">NOT found account created, ok?</h1>`)
            }

        } catch (error) {
            res.send(error)
        }
    }
})

// Obteniendo solamente el atributo de "product" del modelo 
server.get("/account/product", async (req, res) => {
    // SELECT "product" FROM Account;

    try {
        res.json(await Account.findAll({
            attributes: ["users", "product"] //Trayendo que atributos quiero que me de, de la tabla(modelo)
        }))
    } catch (error) {
        res.send(error)
    }
})

// Obtiendo informacion con cumpla con 2 condiciones, usando el 'Op' operador
server.get("/account/and", async (req, res) => {
    // SELECT * FROM Account WHERE users="Alfredo" AND product="speak english"
    try {
        let findOperator = await Account.findAll({
            where: {
                [Op.and]: [ //Op → operador (and OR or)
                    { users: "Alfredo" }, { product: "speak english" } //(and) === busqueda con dos condiciones obligados  
                    // (or) === una de dos
                ]
            }
        })
        res.json(findOperator.length > 0 ? findOperator : "Error en la busqueda")
    } catch (error) {
        res.send(error)
    }
})

// Obteniendo informacion con el 'findByPk' y req.params
server.get("/account/:id", async (req, res) => {

    try {
        let { id } = req.params
        const msg = await Account.findByPk(id)
        res.json(msg ? msg : "No pudimos encontrar esta ruta")
    } catch (error) {
        res.send(error)
    }
})

// Obteniendo un valor si existe, si no existe lo creamos con 'findOrCreate'
server.post("/account/findOrCreate", async (req, res) => {

    // Devuelve un arreglo, en donde la primer posicion → arreglo[0] es la informacion encontrada o creada y en el segundo lugar → arreglo[1] booleano, que determine si se creo o no la informacion (true si lo crea, false si lo encuentra)

    const { users, password, product, season, number } = req.body

    try {
        const [info, created] = await Account.findOrCreate({
            where: {
                // Valores que busca ↓
                users, password, product, season, number
            }, defaults: {
                // Valores si no lo encuentra ↓ 
                users, password, product, season, number
            }
        })
        res.json({ info, created })
    } catch (error) {
        res.send(error)
    }
})

// Actualizar una informacion 
server.put("/account", async (req, res) => {

    // UPDATE account SET users="ALFREDO" WHERE season="winter" 

    try {                //Primer objeto datos a actulizar
        const updating = await Account.update({ users: "ALFREDO" }, { where: { season: "winter" } }) //Segundo objeto es donde actualizar
        res.send(`Elementos modificados ${updating}`)
    } catch (error) {
        res.send(error)
    }
    // updating = devuelve la cantidad de elementos modificados
})

// Eliminando cierta informacion

server.delete("/account", async (req, res) => {

    // DELETE FROM account WHERE season="summer"
    try {
        const deleting = await Account.destroy({
            where: {
                season: "summer"
            }
        })
        res.send(`Se eliminaron ${deleting} objetos`)
    } catch (error) {
        res.send(error)
    }
    // deleting = devuelve la cantidad de elementos eliminados
})

// Eliminando cierta informacion con 'query'
server.delete("/account/:id", async (req, res) => {

    const { id } = req.params
    const eliminar = await Account.destroy({ where: { id } })
    res.send(`Elementos eliminados ${eliminar}`)

})

// BANK → Creando informacion en el modulo 'Bank'
server.post("/bank", async (req, res) => {

    const { name, money, card, clase } = req.body

    try {
        const created = await Bank.create({
            name, money, card, clase
        })
        res.json(created)
    }
    catch (error) {
        res.send(error)
    }
})


// Despues de crear la tabla intermedia, necesito que me guarde esa informacion
server.put("/transfer/:id", async (req, res) => {
    
    // Poder trabajar con la tabla intermedia
    // add + NOMBRE DE LA RELACION = agrega sobre lo que tiene
    // set + NOMBRE DE LA RELACION = borra y pisa OJO!

    // Crear un usuarios que se asocie a muchos bancos 
    // o un banco que se asocie a muchos usuarios
    const { id } = req.params

    let user = await Account.findByPk(id); //Encuentra el usuario
    
    //add y set → Siempre reciben ID's
    res.json(await user.addBank([1,3,4])) // Agregale estos bancos
     
})







// Levantamos el servidor y hacemos que se creen las tablas (sync)
server.listen(3000, async () => {
    console.log("Server on port", 3000);
    await db.sync({ force: false }) //En este caso cada vez que levantemos el servidor se conecta con la base de datos
})






// 🌌 02:30:00
// 🧳 Martina 3HRS

// sync() = Sincrozinar el modelo con todos los atributos que le creamos si no existe en la base de datos
// bulkCreate = Por ejemplo que manden un json repleto de informacion (arreglo de objetos)por el body y quieren que se agregen muchos elementos juntos  → → → → → Account.bulkCreate(req.body)
