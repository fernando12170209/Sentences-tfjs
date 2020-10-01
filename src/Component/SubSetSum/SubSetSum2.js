    //W lista de valores que conforman un conjunto [array]
    //X array de solucion donde (1) es valor considerado en el contunto y (0) es el valor no tomado en el conjunto
    //m valor de la funcion objetivo a la que la suma de los valores seleccionedos(X) en el conjunto(W) es igual a 'm'

    const  SubSetSum2= async(InputByUser,ArrayFlag,ProposedSum)=>{
        //const input = {...W}
        //const arrayFlag = {...X}
        //const proposedSum= M
        //const inputByUser=[{id:2,valor:10},{id:15,valor:11},{id:7,valor:5},{id:9,valor:13},{id:8,valor:20}]
        const inputByUser=InputByUser
        //const arrayFlag=[0,0,0,0,0,0,0,0,0,0]
        
        var arrayFlag=[...ArrayFlag]
        //const proposedSum=20
        const proposedSum=ProposedSum

        var ArrayResult=[]
    
        const isValidSubset=( index)=>{
            //console.log(index*1)
            //console.log('inputByUser=>',inputByUser)
            let sum=0
            let remainingWeigths=0
            for(let i=0;i<=index;i++ ){
                sum+=arrayFlag[i]*inputByUser[i].valor
            }
            //console.log('inputByUser.length',inputByUser.length,'index',index,'inputByUser[0]',inputByUser[0].valor)   
            for(let j=index*1+1;j<inputByUser.length;j++ ){
                //console.log(j)
                remainingWeigths+=inputByUser[j].valor
            }
    
            if(sum*1===proposedSum*1){
                //console.log(':D encontre una solución m')                
                printSolution(arrayFlag)
                return false
            }
            if(sum*1+remainingWeigths*1<proposedSum*1){
                //console.log('no llego a la suma')
                return false
            }
            if(sum*1>proposedSum*1){
                //console.log('me pase de la suma')
                return false
            }
            //go
            //sigo adelante buscando
            return true
        }
        const subSet=(index)=>{
            //taking value in array for this index
            if(index < inputByUser.length){
                arrayFlag[index]=1
                if(isValidSubset(index)){
                    subSet(index+1)
                }
                arrayFlag[index]=0
                //Cambiar de nodo de 1->0 (nodo anulado)
                //not taking value for this index
                if(isValidSubset(index)){
                    subSet(index+1)
                }
            }
        }
        const printSolution=(arrayFlag)=>{
            //Function for save wich index in array X are 1 (selected)
            //console.log(arrayFlag)
            const arraytemp=[...arrayFlag]//{...arrayFlag}
                
            ArrayResult.push(arraytemp)
            //console.log(ArrayResult)
            
        }
        const main=()=>{
            //console.log('Data ingresada',InputByUser)
            
            subSet(0)
            
        
        }
        //Ejecucion de funcion
        main()

        //console.log('ArrayResult',ArrayResult)
        return await ArrayResult

        
    
        
    
    
    }
    
    export default SubSetSum2;
    