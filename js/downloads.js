
const SUPABASE_URL = 'https://kskyajmoakajvukznymz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtza3lham1vYWthanZ1a3pueW16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0MTAwNjksImV4cCI6MjA5MTk4NjA2OX0.kIOmwxf1xpbMjUVuzfr_woevvf6xxeQTnlnvuSmGzXM';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const ADMIN_HASH = "7bfda6dafc67eeefd0477db473d0673b117b293026f5808a778aafabc3ae2e54";
let clienteAdmin = null;
let categoriaAtual = 'todos';
let idEdicao = null;

async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verificarSenha() {
    const inputPass = document.getElementById('adminPass').value;
    const inputHash = await sha256(inputPass);

    if (inputHash === ADMIN_HASH) {
        clienteAdmin = supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
            global: { headers: { 'admin-secret': ADMIN_HASH } }
        });
        document.getElementById('loginArea').style.display = "none";
        document.getElementById('adminForm').style.display = "block";
        carregarDownloads(true);
    } else {
        alert("ACESSO NEGADO.");
    }
}

function filtrarCategoria(categoria) {
    categoriaAtual = categoria.toLowerCase();
    const botoes = document.querySelectorAll('.btn-filter');
    botoes.forEach(btn => {
        btn.classList.remove('active');
        if (btn.innerText.toLowerCase() === categoriaAtual) btn.classList.add('active');
    });
    executarFiltroGeral();
}

function filtrarArquivos() {
    executarFiltroGeral();
}

function executarFiltroGeral() {
    let input = document.getElementById('filterFiles').value.toLowerCase();
    let items = document.getElementsByClassName('download-item');

    for (let i = 0; i < items.length; i++) {
        let titulo = items[i].querySelector('h3').innerText.toLowerCase();
        let categoriaDoItem = items[i].querySelector('p').innerText.toLowerCase();
        let matchTexto = titulo.includes(input);
        let matchCategoria = (categoriaAtual === 'todos' || categoriaDoItem.includes(categoriaAtual));

        items[i].style.display = (matchTexto && matchCategoria) ? "" : "none";
    }
}

async function carregarDownloads(isAdmin = false) {
const { data, error } = await _supabase.from('downloads').select('*');

if (error) {
    console.error("Erro na leitura:", error);
    return;
}

const lista = document.getElementById('listaArquivos');
    lista.innerHTML = data.map(item => {
        const itemSeguro = btoa(unescape(encodeURIComponent(JSON.stringify(item))));

        return `
        <div class="download-item">
            <div class="file-info">
                <span class="file-icon">${item.icone || '📁'}</span>
                <div>
                    <h3>${item.nome}</h3>
                    <p>Categoria: ${item.categoria} | Tamanho: ${item.tamanho}</p>
                </div>
            </div>
            <div class="actions">
                <a href="${item.link}" target="_blank" class="btn-dl">BAIXAR</a>
                ${isAdmin ? `
                    <button onclick="prepararEdicao('${itemSeguro}')" class="btn-edit">✏️</button>
                    <button onclick="deletarArquivo(${item.id})" class="btn-delete">❌</button>
                ` : ''}
            </div>
        </div>
    `;
    }).join('');

executarFiltroGeral();
}

function prepararEdicao(itemCodificado) {
    try {
        const item = JSON.parse(decodeURIComponent(escape(atob(itemCodificado))));

        idEdicao = item.id;

        document.getElementById('nomeArq').value = item.nome;
        document.getElementById('catArq').value = item.categoria;
        document.getElementById('tamArq').value = item.tamanho;
        document.getElementById('linkArq').value = item.link;

        document.getElementById('adminModal').style.display = "block";
        document.getElementById('loginArea').style.display = "none";
        document.getElementById('adminForm').style.display = "block";

        const btnPostar = document.querySelector('#adminForm .btn-dl');
        btnPostar.innerText = "SALVAR ALTERAÇÕES";
        btnPostar.style.background = "#ffcc00";

    } catch (e) {
        console.error("Erro ao decodificar item:", e);
        alert("Erro ao carregar dados para edição.");
    }
}

async function salvarNoBanco() {
    if (!clienteAdmin) return alert("Logue primeiro!");

    const nome = document.getElementById('nomeArq').value;
    const categoria = document.getElementById('catArq').value;
    const tamanho = document.getElementById('tamArq').value;
    let link = document.getElementById('linkArq').value;
    const arquivoInput = document.getElementById('fileInput');
    const arquivo = arquivoInput.files[0];

    if (arquivo) {
        const extensao = arquivo.name.split('.').pop();
        const nomeArquivoSeguro = `file_${Date.now()}_${Math.random().toString(36).substring(7)}.${extensao}`;
        const caminhoNoStorage = `uploads/${nomeArquivoSeguro}`;

        console.log("Tentando upload em: arquivos/", caminhoNoStorage);

        const { data: uploadData, error: uploadError } = await clienteAdmin
            .storage
            .from('arquivos')
            .upload(caminhoNoStorage, arquivo);

        if (uploadError) {
            console.error("Erro detalhado:", uploadError);
            return alert("ERRO NO UPLOAD: " + uploadError.message);
        }

        const { data: urlData } = clienteAdmin
            .storage
            .from('arquivos')
            .getPublicUrl(caminhoNoStorage);

        link = urlData.publicUrl;
    }

    if (!link || link === "") {
        return alert("ERRO: Você precisa colocar um link ou selecionar um arquivo!");
    }

    const dados = {
        nome: nome,
        categoria: categoria,
        tamanho: tamanho,
        link: link,
        icone: '📁'
    };

    console.log("Salvando no banco:", dados);

    let resposta;
    if (idEdicao) {
        resposta = await clienteAdmin.from('downloads').update(dados).eq('id', idEdicao);
    } else {
        resposta = await clienteAdmin.from('downloads').insert([dados]);
    }

    if (resposta.error) {
        alert("Erro ao salvar no banco: " + resposta.error.message);
    } else {
        alert("HSSLabs: ARQUIVO POSTADO COM SUCESSO!");
        location.reload();
    }
}

async function deletarArquivo(id) {
    if (!clienteAdmin) return alert("Sem permissão!");
    if (confirm("TEM CERTEZA QUE DESEJA APAGAR? ISSO É IRREVERSÍVEL!")) {
        const { error } = await clienteAdmin.from('downloads').delete().eq('id', id);
        if (error) alert("Erro ao deletar!");
        else carregarDownloads(true);
    }
}

let contadorCliques = 0;
document.querySelector('.logo').addEventListener('click', (e) => {
    e.preventDefault();
    contadorCliques++;
    if (contadorCliques === 5) {
        document.getElementById('adminModal').style.display = "block";
        contadorCliques = 0;
    }
    setTimeout(() => { contadorCliques = 0; }, 2000);
});

document.querySelector('.close-modal').onclick = () => document.getElementById('adminModal').style.display = "none";
document.addEventListener('DOMContentLoaded', () => carregarDownloads(false));