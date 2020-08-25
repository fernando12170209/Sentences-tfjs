    //W lista de valores que conforman un conjunto [array]
    //X array de solucion donde (1) es valor considerado en el contunto y (0) es el valor no tomado en el conjunto
    //m valor de la funcion objetivo a la que la suma de los valores seleccionedos(X) en el conjunto(W) es igual a 'm'

    const  SubsetSum= async(InputByUser,ArrayFlag,ProposedSum)=>{
        //const input = {...W}
        //const arrayFlag = {...X}
        //const proposedSum= M
        //const inputByUser=[2,10,15,11,7,5,9,13,8,20]
        const inputByUser=InputByUser
        //const arrayFlag=[0,0,0,0,0,0,0,0,0,0]
        
        var arrayFlag=[...ArrayFlag]
        //const proposedSum=20
        const proposedSum=ProposedSum

        var ArrayResult=[]
    
        const isValidSubset=( index)=>{
            //console.log(index*1)
            let sum=0
            let remainingWeigths=0
            for(let i=0;i<=index;i++ ){
                sum+=arrayFlag[i]*inputByUser[i]
            }
    
            for(let j=index*1+1;j<=inputByUser.length;j++ ){
                remainingWeigths+=inputByUser[j]
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
    
    export default SubsetSum;
    
    //javascript
    /*
    
    function  SubsetSum(){
      
        //const input = {...W}
        //const arrayFlag = {...X}
        //const proposedSum= M
        const inputByUser=[2,10,15,11,7,5,9,13,8,20]
        var arrayFlag=[0,0,0,0,0,0,0,0,0,0]
        const proposedSum=20
    
        function isValidSubset( index){
            //console.log(index*1)
            var sum=0
            var remainingWeigths=0
            for(var i=0;i<=index;i++ ){
                sum+=arrayFlag[i]*inputByUser[i]
                
            }
    
            for(var j=index+1;j<=inputByUser.length ;j++ ){
                remainingWeigths+=inputByUser[j]
            }
            //console.log('suma',sum)
            if(sum*1===proposedSum*1){
                //console.log(':D encontre una solución m')
                printSolution()
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
        function subSet(index){
          //console.log('index',index*1)
          
            //taking value in array for this index
            if(index < inputByUser.length){
              //console.log('oli')
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
        function printSolution(){
            //Function for save wich index in array X are 1 (selected)
            console.log(arrayFlag)
        }
        function main(){
            //console.log('length',inputByUser.length)
            subSet(0)
            
        
        }
        //Ejecucion de funcion
        console.log(inputByUser)
        main();
        
    
    }
    SubsetSum()
    
    
    
    
    
    
    
    
    */