const { Model, DataTypes } = require("sequelize");

class bank extends Model {}

module.exports = (sequelize) =>{

   return bank.init({
        name: {type: DataTypes.STRING, unique: true},
        money: {type: DataTypes.STRING,
        set(value){
            return this.setDataValue("money", `$${value}`)
        }},
        card: {type: DataTypes.BOOLEAN},
        clase: {type: DataTypes.ENUM("normal", "vip", "high class")}
   }, 
   {
    sequelize, tableName: "banks", timestamps: false
   })
}

// Plantilla de modulo para poder copiar y pegar
// QUE HERMOSO MODULO ME ACABO DE CREAR 💘