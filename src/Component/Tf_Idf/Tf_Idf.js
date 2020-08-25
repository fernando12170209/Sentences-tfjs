import React, { Component } from 'react';
//https://www.youtube.com/watch?v=RPMYV-eb6lI
class Tf_Idf extends Component{
    state={
        txt:[]
    }
    
    Tf_Idf_function(){
        var txt = [];
        var counts = {};
        var keys = [];
        var allwords = [];

        //var files = ['eclipse.txt', 'fish.txt','phadke.txt'];
        var files = ['buenos dias su señoria matatirutirulai','The Eclipse Award Trophy is presented annually to recognize those horses and individuals whose outstanding achievements have earned them the title of Champion in their respective categories. Presently there are twenty categories that include American Horse of the Year, eleven Division Champions, five connection Champions and three miscellaneous awards.The Eclipse Awards are co-sponsored by the National Thoroughbred Racing Association, the Daily Racing Form and the National Turf Writers Association. Prior to the start of the Eclipse Awards in 1971, the TRA and the Daily Racing Form separately honored racings annual champions.[1]',
        'A king was going blind. A traveller said that if a golden-headed fish, found in the Great Sea, was brought to him within a hundred days, he would prepare an ointment from its blood to save the kings sight, but he had to leave in a hundred days. The prince took men and fished for it. He finally caught it, too late to bring it back. He intended to bring it back to show his father what he had done, and decided not to, because the doctors would try to make the ointment and so kill the fish uselessly.',
        'Vasudeo Balwant Phadke (About this sound pronunciation (help·info)) (4 November 1845 – 17 February 1883) was an Indian revolutionary who sought Indias independence from Britain. Phadke was moved by the plight of the farmer community during British Raj. Phadke believed that ‘Swaraj’ was the only remedy for their ills. With the help of Kolis, Bhils and Dhangars communities in Maharastra, Vasudev formed a revolutionary group called as Ramoshi. The group started an armed struggle to overthrow the British Raj. The group launched raids on rich English businessmen to obtain funds for their liberation struggle. Phadke came into limelight when he got control of the city of Pune for a few days when he caught the British soldiers off guard during one of his surprise attacks.']
        
        //Asignar el contenido de files en un array txt
        for (var i = 0; i < files.length; i++) {
            txt[i] = files[i];
        }
        //Se asigna todo el contenido en allwords
        for (i = 0; i < txt.length; i++) {
            //allwords[i] = (txt[i].join('/n'))
            allwords[i] = (txt[i])
        }


        //Define Term frecuency
        //Tokens
        //https://stackoverflow.com/questions/3559883/javascript-split-regex-question
        var tokens = allwords[0].split(/\W+/);
        console.log('tokens',tokens)
        for (i = 0; i < tokens.length; i++) {
            var word = tokens[i].toLowerCase();
            //Si la palabra no esta en el objeto counts crear objeto
            if (counts[word] === undefined) {
            //Create an object 
            counts[word] = {
                tf: 1,
                df: 1
            };
            keys.push(word);
            } else {
            //Sino aumentar el numero de veces que aparece la palabra(term frecuency)
            counts[word].tf = counts[word].tf + 1;
            }
        }

        //Counts es la lista objetos que tiene como indice [word] y propiedades tf(term frec) df(doc frec)
        console.log('counts',counts)
        //la variable key contiene una lista de palabra unicas(sin repetir)
        console.log('keys',keys)
        
        //Look up for every word each appear in docs
        //Define in how many docs  appear a word
        var othercounts = [];
        for (var j = 1; j < allwords.length; j++) {
          var tempcounts = {};
          var tokens_ = allwords[j].split(/\W+/);
          for (var k = 0; k < tokens_.length; k++) {
            var w = tokens_[k].toLowerCase();
            if (tempcounts[w] === undefined) {
              tempcounts[w] = true;
            }
          }
          othercounts.push(tempcounts);
        }
        //othercounts contiene una lista de palabra unicas(sin repetir) como indice con la propiedad true
        console.log('othercounts',othercounts)
        

        for ( i = 0; i < keys.length; i++) {
            var word_ = keys[i];
            for ( j = 0; j < othercounts.length; j++) {
              var tempcounts_ = othercounts[j];
              //Buscar la palabra
              if (tempcounts_[word]) {
                //Document frecuency
                counts[word_].df++;
              }
            }
        }

        for ( i = 0; i < keys.length; i++) {
        var word_2 = keys[i];
        var wordobj = counts[word_2];
        //In order to wikipedia files.length / (wordobj.df +1) to avoid divide by 0 'zero'
        //wordobj.tfidf = wordobj.tf * Math.log(files.length / wordobj.df);
        wordobj.tfidf = wordobj.tf * Math.log(files.length / (wordobj.df+1));
        }
        //Ordena de mayor a menor segun la propiedad tfidf
        keys.sort(compare);
        
        function compare(a, b) {
        var countA = counts[a].tfidf;
        var countB = counts[b].tfidf;
        return countB - countA;
        }
        

        console.log('counts',counts)
        console.log('keys.sort',keys.sort(compare))
        /*
        for ( i = 0; i < keys.length; i++) {
        var key_2 = keys[i];
        console.log(key_2 + ' ' + counts[key_2].tfidf)
        //createDiv(key + ' ' + counts[key_2].tfidf);
        }
        */
        

          

    }
    componentDidMount(){
        this.Tf_Idf_function()
    }

    render(){
        
        return(
            <React.Fragment>

            </React.Fragment>
        );
    }

}
export default Tf_Idf;