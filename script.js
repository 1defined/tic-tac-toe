//todo jogo tem 3 etapas pelo menos
// 1 - Dados iniciais, propriedades que o jogo precisa ter para começar 
// 2 - Eventos, click no botão, em área etc
// 3 - funções que auxiliarão os eventos acontecerem

///////////////INITIAL DATA

//Criar um objeto que possui cada uma das casas com seus valores respectivos. No começo = nada
let square = {
    a1: '', a2: '', a3: '',
    b1: '', b2: '', b3: '',
    c1: '', c2: '', c3: ''
    
}

//Criar uma variável para saber de quem é a vez de jogar (tem que ser aleatório)
let player = '';

//Preciso de uma variável para armazenar a mensagem de vencedor
let warning = '';

//Preciso saber se o jogo está ainda rodando/funcionando (em caso de haver vencedor/empate, o jogo precisa parar).
let playing = true; //padrão: n está rodando

reset();
///////////////EVENTS
//2 eventos = um para monitorar o click na área do jogo e outro para monitorar click no botão de restar

//montitorar o click no botão de resetar        //não faço a função aqui pois usarei a função reset em vários locais
document.querySelector('.reset').addEventListener('click', reset);


//Agora precisamos percorrer todas as divs de área e monitorar o click em cima delas (isto aqui é meu eventHandler)
document.querySelectorAll('.item').forEach(e => {
    e.addEventListener('click', itemClick)
});


///////////////FUNCTIONS

function reset () {

    //limpar os avisos
    warning = '';

    //escolher aleatoriamente um player
    let random = Math.floor(Math.random()*2); //math.random gera um número aleatório entre 0 e 1, multiplicando ele por dois poderei usar o math.floor para arredonda-lo tornando-o efetivamente 0 ou 1
   player = (random === 0) ? player = 'X' : player = 'O'; //se random = o então player é x se n é O
   
    //Zerar quadro
    //precisarei usar um laço de repetição para percorrer cada uma das divs do quadro do jogo dentro do meu objeto e setar os valores como ''
    //ERRO QUE COMETI: document.querySelectorAll('.item').forEach((item) => {item.innerHTML = '';}); Desta forma, eu percorri o HTML e setei os campos dentro da div. Mas em termos lógicos, meu objeto (que armazena os valores colocados pelos usuarios) não foi alterado

    //percorrendo todo objeto e setando '' em todos itens.
    for(let i in square){
        square[i] = '';
    }

    //após resetar, ele deixa jogável
    playing = true;
    
    //tranfomar os dados do square para visual (preencher o que foi feito na tela efetivamente)
    renderSquare();
    renderInfo();

}

function renderSquare(){
    //percorre o meu objeto square e verifica o que tem dentro de cada item

    for(let i in square){

        //selecionar a div respectiva ao meu quadro e preenche-la

        let item = document.querySelector(`div[data-item=${i}]`);
        //prenche o item com o que tiver salvo dentro do item do objeto. Em caso de item vazio ele preenche '' 
        item.innerHTML = square[i];
    }
}

function renderInfo(){
    //toda vez que a variável square é modificada, isto é, busca um valor novo ao clique do usuário, deve-se verificar o status do jogo (nada,ganhou X,empate, ganhou O)
    checkGame(); //roda primeiro para não depender do próximo click do usuário para validar o vencedor
    //escrevedo de quem é a vez
    document.querySelector('.vez').innerHTML = player;

    //escrevendo o resultado atual
    document.querySelector('.resultado').innerHTML = warning; 
    
   

}

function itemClick(e){
    

    //buscar a identificação de quem foi clicado  
    let item = e.target.getAttribute('data-item'); //retorna o nome da célula Ex: a1,  b2 etc... 
    
    //testar se o campo a ser preenchido está vazio ou n
    if(square[item] === '' && playing){
        square[item] = player; //estou preenchendo o item do meu objeto com o que está salvo em player (x ou O)

        renderSquare(); //insere o que foi preenchido

        //mudar o player
        togglePlayer();
       

    }


};

function togglePlayer() {

    //testa se jogar é X, se for, torna-se O (após o click) e se for O torna-se X
    player = (player === 'X') ? player = 'O' : player = 'X';
    
    //exibe alteração de jogadores na tela
    renderInfo();

}

function checkGame(){


    //Checa se o vencedor foi o X
    if(checkWinnerFor('X')){
        warning = 'O "X" ganhou';
        playing = false;
    }
    //checa se o vencedor foi o O
    else if (checkWinnerFor('O')){
        warning = 'O "O" ganhou';
        playing = false;

    }
    //Checa se todos os campos foram preenchidos e deu empate
    else if(isFull()) {
        warning = 'Deu empate';
        playing = false;
    }
   



};

function checkWinnerFor(player){
 //mapear opções de vitória: No jogo da velha pode-se vencer nas 3 horizontais (linha) nas três verticais (colunas) e nas duas diagonais = 8 opções de vitória

 //como verificar vencedor? Criar um array com todas as possibilidades de vitória (8)
    let pos = [
        'a1,a2,a3', //opções horizontais
        'b1,b2,b3',
        'c1,c2,c3',

        'a1,b1,c1', //opções verticais
        'a2,b2,c2',
        'a3,b3,c3',

        'a3,b2,c1', //opções diagonais
        'a1,b2,c3'
    ];

    //Agora precisamos dar um loop nas possibilidades e verificar se o player está com estas posições preenchidas
    for(let w in pos){
        //como estamos separando por vírgula, damos um split (separação) na virgula para gerar um dado como ex: a1, a2, a3 pois atualmente estes 3 itens são 1 só
        let pArray = pos[w].split(','); 
        
        //preciso loopar meu pArray verificando se cada um dos itens do array vai retornar true. Se apenas 1 não retornar true, ele já retorna como false p mim
        //Em outras palavras, crio uma condição que será aplicada a todos os itens do array. Se satisfeita, retorna true se não false
       //se meu item square (a1, b2, b3 etc. ele verificará com todos) está preenchido com player (x ou o)
     let  winner =  pArray.every( option =>  square[option]===player); 
     if (winner){
         return true;
     }
           
     
    }

    //caso ele passe pelo FOR inteiro e não ache nenhum vencedor então retorna falso
   
    return false; //volta para o if de teste de jogador

    
}


function isFull(){
    //tenho que loopar meu square e verificar se todos estão preenchidos
    for(let i in square){
        if(square[i]===''){
            return false;
        }
    }

//se passou por todo for e ainda não retornou false. Então quer dizer que empatou. 
return true;

}