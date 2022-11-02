// CREANDO UNA MODELO, tabla
// tablas === modelos → crear tablas desde sequelize

const { Model, DataTypes } = require("sequelize"); //Importamos

class Accounts extends Model {}

module.exports = (sequelize) =>{

return Accounts.init({
          // con Sequelize se agrega automaticamente el → ID, createdAt, updateAt 

        users : { type: DataTypes.STRING, unique: true,

        set(value){ //Me va a permitir configurar como quiero que se guarde el dato en la base de datos
            this.setDataValue("users", value.toLowerCase())
        }},

        password: { type: DataTypes.STRING},
        product : {type: DataTypes.TEXT, allowNull: false},

        season : {type: DataTypes.ENUM("summer", "winter", "spring", "autum")},
        
        birthday : {type: DataTypes.DATEONLY, // Si no me pasas un valor, te pongo el dia de hoy (NOW) === defaultValue
                    defaultValue: DataTypes.NOW}, // valor por defecto si no llegan a pasarle alguno

        age : { type: DataTypes.INTEGER, 
                    validate: {
                        min: 1,
                        max: 100,
                        // Se puede validar todo lo que quieras, se puede tambien crear una funciona personalizada
                    }, 
                get(){
                    // Va a describir como quiero que se devuelvan la informacion , solo modifica cuando los pido pero en la base de datos NO se modifica nada ni le afecta.
                    return this.getDataValue("age") + " years old"
                }},
                    
    }, 

    {
        // Configuraciones del modelo ↓

        sequelize, //instanciar sequelize con este modelo
        tableName: "account",
        timestamps: true, createdAt: false, updatedAt: "ACTUALIZACION"

        })
    }



// sincronizar = Que impacte en la base de datos, Sincronizar los modelos en la base de datos





// 💨 Tipos de datos 
// ENUM = Listado de posibles valores que vos podes ingresar, no podes ingresar otro dato que no sean estos: → Summer, winter, spring, autum
// DATE = Fecha con hora
// DATEONLY = Solamente fecha
// NOW = el dia de hoy
// validate = Validar el dato antes de que se guarde en la base de datos