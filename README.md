# Bolso

App simples para controlar entradas e saídas da **conta**, do **ticket alimentação** e do **cartão de crédito** (com parcelas). Funciona no celular e no computador, sem instalar nada.

Os seus dados ficam no seu aparelho e, se você quiser, também no **seu** Google Planilhas, sincronizados automaticamente.

## Usar

Abra a página do projeto no navegador. Tudo funciona sem conta. Para usar a planilha, siga a seção abaixo.

## Sincronizar com o Google Planilhas

Você cria a sua própria planilha e o seu próprio "robô" (Apps Script). O app só conversa com a sua planilha.

### 1. Criar a planilha e o robô

1. Abra uma **planilha nova** em [sheets.google.com](https://sheets.google.com).
2. No menu, vá em **Extensões > Apps Script**.
3. Apague o conteúdo que aparecer e cole o conteúdo do arquivo [`apps-script/Code.gs`](apps-script/Code.gs).
4. Clique na **engrenagem** (Configurações do projeto) e, em **Propriedades do script**, adicione:
   - **Propriedade:** `TOKEN`
   - **Valor:** uma senha longa só sua (ex.: 20 letras e números). Guarde-a.
5. Clique em **Implantar > Nova implantação**.
   - Tipo: **Aplicativo da Web**
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
6. Clique em **Implantar**, autorize o acesso quando pedido e copie o **link do aplicativo da Web** (termina em `/exec`).

### 2. Ligar o app

1. No app, toque na **engrenagem** (Ajustes) e vá até **Google Planilhas**.
2. Cole o **link** (termina em `/exec`) e a **senha** (o TOKEN).
3. Toque em **Conectar**.

Pronto. Cada lançamento, edição ou exclusão é enviado para a planilha. Ao abrir o app, ao voltar para ele ou a cada minuto, ele busca as mudanças feitas em outros aparelhos.

A aba **Lançamentos** da planilha fica com estas colunas: `data`, `carteira`, `tipo`, `categoria`, `valor`, `parcela`, `id`, `grupo`, `atualizado`. Você pode consultar, filtrar e fazer gráficos lá. Não apague a coluna `id`.

### Como funciona quando não há internet

As alterações ficam guardadas no aparelho e são enviadas quando a conexão voltar.

### Vários aparelhos

Use o mesmo link e a mesma senha em todos. Se a mesma linha for editada nos dois lugares ao mesmo tempo, vale a alteração mais recente que chegou ao servidor.

### Trocar a senha ou o robô

Mude o valor de `TOKEN` nas propriedades do script (ou crie uma nova implantação) e reconecte o app com os novos dados. Para desligar, use **Desligar** nos Ajustes. Seus dados continuam no aparelho.

## Privacidade

- O app não tem servidor próprio. Quem guarda os dados é você: o navegador do seu aparelho e a sua planilha.
- A senha (TOKEN) fica salva apenas no seu navegador e no Apps Script da sua planilha.
- Não há anúncios, cadastros nem coleta de dados.

## Desenvolvimento

É uma página única, sem build: `index.html` com CSS e JavaScript embutidos. Ícones pelo [Lucide](https://lucide.dev) e fontes do Google Fonts.
