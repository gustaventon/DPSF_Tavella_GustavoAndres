module.exports = function(sequelize, dataTypes){
    let alias = 'Producto' //el nombre con el cual sequelize identifica al modelo cuando necesite invocar

    let cols = {

        id:{
            autoIncrement: true,
            primaryKey: true,
            type: dataTypes.INTERGER,
        }

        



    }


   const Producto = sequelize.define(alias, cols, config)
   return Producto;
}