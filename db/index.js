// Crear la base de datos 

const { Sequelize, Op } = require("sequelize");
// DataTypes = tipos de datos que se le puede aplicar a un atributo

const sequelize = new Sequelize("postgres://postgres:5432@localhost:5432/October",
{logging:false}  // Generar una nueva instancia de sequelize
);



// Ejecutando los modulos

const Bank = require("./models/banks")(sequelize)
const Account = require("./models/Account")(sequelize); //Traemos el modelo 'Accounts's
                                            // ↑ Instanciar sequelize con el modulo



module.exports = {db: sequelize, Op, Account, Bank} // 🚕 dps hacer copia ...sequelize.moduls 🚕





// Relaciones 

// Sequelize se encarga de las relaciones 

// MUCHOS A MUCHOS → JUGADOR - EQUIPO

// 1 Jugador → puede pertenecer a muchos equipos 
// 1 Equipo → puede tener muchos jugadores

// En mi ejemplo
// MUCHOS A MUCHOS
// 1 usuario → puede pertenecer a muchos bancos 
// 1 banco → puede tener muchos usuarios

// Establecer que existe una relacion entre esta dos elementos
Account.belongsToMany(Bank, {through: "BANCO_USUARIO"})
Bank.belongsToMany(Account, {through: "BANCO_USUARIO"})

// Ahora sequelize genera la tabla intermedia llamada 'BANCO_USUARIO'
// acount_id bank_id