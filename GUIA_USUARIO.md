# 📋 Guia do Usuário - Sistema de Controle de Estoque CFM

## 📖 Índice
1. [Visão Geral](#visão-geral)
2. [Requisitos do Sistema](#requisitos-do-sistema)
3. [Instalação e Configuração](#instalação-e-configuração)
4. [Primeiro Acesso](#primeiro-acesso)
5. [Funcionalidades Principais](#funcionalidades-principais)
6. [Passo a Passo de Uso](#passo-a-passo-de-uso)
7. [Relatórios](#relatórios)
8. [Solução de Problemas](#solução-de-problemas)
9. [Suporte Técnico](#suporte-técnico)

---

## 🎯 Visão Geral

O **Sistema de Controle de Estoque CFM** é uma aplicação web desenvolvida para gerenciar o estoque de alimentos de organizações beneficentes. O sistema permite:

- ✅ Controle completo de estoque de alimentos
- ✅ Registro de doações recebidas
- ✅ Controle de distribuições realizadas
- ✅ Geração de relatórios em PDF e Excel
- ✅ Dashboard com visão geral dos dados
- ✅ Sistema de autenticação seguro
- ✅ Interface responsiva para dispositivos móveis

### 🏗️ Arquitetura do Sistema
- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap 5
- **Backend**: Node.js, Express.js
- **Banco de Dados**: SQLite
- **Autenticação**: JWT (JSON Web Tokens)
- **Relatórios**: PDFKit, ExcelJS

---

## 💻 Requisitos do Sistema

### Requisitos Mínimos
- **Sistema Operacional**: Windows 10/11, macOS 10.14+, Linux Ubuntu 18.04+
- **Node.js**: Versão 16.0 ou superior
- **NPM**: Versão 8.0 ou superior
- **Navegador**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **RAM**: 4GB mínimo (8GB recomendado)
- **Espaço em Disco**: 500MB livres

### Portas Utilizadas
- **Aplicação**: 3001 (padrão)
- **Monitoramento**: 9200 (Elasticsearch - opcional)
- **Kibana**: 5601 (opcional)

---

## 🚀 Instalação e Configuração

### 1. Preparação do Ambiente

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/controle-estoque-cfm.git
cd controle-estoque-cfm

# Instale as dependências
npm install
```

### 2. Configuração das Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e configure as variáveis:

```bash
cp .env.example .env
```

Edite o arquivo `.env`:
```env
# Configurações do Servidor
PORT=3001
NODE_ENV=production

# Configurações JWT
JWT_SECRET=sua_chave_secreta_super_segura_aqui

# Configurações do Banco de Dados
DB_PATH=./database/food_stock.db

# Configurações de Email (opcional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_app
```

### 3. Inicialização do Banco de Dados

```bash
# Execute as migrações
npm run migrate

# Popule com dados iniciais (opcional)
node scripts/seed_db.js
```

### 4. Geração da Chave JWT

```bash
npm run generate-secret
```

### 5. Inicialização do Sistema

```bash
# Modo produção
npm start

# Modo desenvolvimento
npm run dev
```

O sistema estará disponível em: `http://localhost:3001`

---

## 🔐 Primeiro Acesso

### Credenciais Padrão
- **Usuário**: `admin`
- **Senha**: `123456`

> ⚠️ **IMPORTANTE**: Altere a senha padrão imediatamente após o primeiro acesso!

### Tela de Login
![Tela de Login](docs/images/login-screen.png)

1. Acesse `http://localhost:3001/login`
2. Digite suas credenciais
3. Clique em "Entrar"
4. Você será redirecionado para o dashboard principal

---

## 🎛️ Funcionalidades Principais

### 1. Dashboard Principal
- Visão geral dos totais (estoque, doações, distribuições)
- Últimas movimentações em tempo real
- Acesso rápido às funcionalidades principais

### 2. Gerenciamento de Itens
- Cadastro de novos alimentos
- Edição de informações existentes
- Controle de validade
- Histórico completo de movimentações

### 3. Registro de Doações
- Cadastro de doações recebidas
- Vinculação com itens do estoque
- Controle de doadores
- Atualização automática do estoque

### 4. Controle de Distribuições
- Registro de saídas do estoque
- Controle de casas/beneficiários
- Validação de quantidade disponível
- Atualização automática do estoque

### 5. Sistema de Relatórios
- Relatórios em PDF e Excel
- Filtros por data, doador, item
- Exportação de dados completos

---

## 📝 Passo a Passo de Uso

### 🏠 1. Navegando pelo Dashboard

![Dashboard Principal](docs/images/dashboard.png)

**Ao fazer login, você verá:**
1. **Cartões de Resumo**: Totais de estoque, doações e distribuições
2. **Tabelas de Movimentações**: Últimos itens, doações e distribuições
3. **Menu de Navegação**: Botões para acessar cada funcionalidade

**Ações disponíveis:**
- Clique em "Gerenciar Itens" para acessar o controle de estoque
- Clique em "Registrar Doação" para cadastrar novas doações
- Clique em "Registrar Distribuição" para registrar saídas
- Use o botão "Logout" para sair do sistema

---

### 📦 2. Gerenciando Itens do Estoque

![Gerenciar Itens](docs/images/food-management.png)

#### Visualizando o Estoque
1. No dashboard, clique em **"Gerenciar Itens"**
2. Você verá uma tabela com todos os itens cadastrados
3. As colunas mostram: ID, Nome, Quantidade, Data, Referência, Valor, Total, Mês, Validade

#### Adicionando Novo Item
1. Role até a seção **"Adicionar Novo Item"**
2. Preencha os campos obrigatórios:
   - **Nome do Alimento**: Digite o nome do produto
   - **Quantidade**: Informe a quantidade inicial
   - **Data**: Selecione a data de cadastro
3. Campos opcionais:
   - **Referência**: Código ou referência interna
   - **Valor da Compra**: Preço unitário do item
   - **Validade**: Data de vencimento do produto
4. Clique em **"Adicionar"**

#### Editando um Item
1. Na tabela de itens, clique no botão **"Editar"** da linha desejada
2. Modifique os campos necessários
3. Clique em **"Salvar"** para confirmar as alterações

#### Excluindo um Item
1. Na tabela de itens, clique no botão **"Excluir"** da linha desejada
2. Confirme a exclusão na janela de confirmação
3. O item será removido permanentemente

---

### 🎁 3. Registrando Doações

![Registrar Doações](docs/images/donation-management.png)

#### Processo de Registro de Doação
1. No dashboard, clique em **"Registrar Doação"**
2. **Buscar Item Existente**:
   - Digite o nome do alimento no campo "Buscar Item"
   - Clique em **"Buscar"**
   - O sistema mostrará se o item existe e preencherá automaticamente o ID

3. **Preencher Formulário**:
   - **ID do Item**: Preenchido automaticamente após a busca
   - **Quantidade**: Digite a quantidade doada
   - **Referência**: Código ou nota fiscal (opcional)
   - **Nome do Doador**: Identifique quem fez a doação
   - **Data da Doação**: Selecione a data
   - **Validade do Item Doado**: Data de vencimento (se aplicável)

4. Clique em **"Registrar Doação"**

#### Visualizando Histórico de Doações
- A tabela **"Histórico de Doações"** mostra todas as doações registradas
- Use os filtros por data, doador ou item para encontrar registros específicos

---

### 📤 4. Registrando Distribuições

![Registrar Distribuições](docs/images/distribution-management.png)

#### Processo de Registro de Distribuição
1. No dashboard, clique em **"Registrar Distribuição"**
2. **Buscar Alimento**:
   - Digite o nome do alimento no campo "Buscar Alimento"
   - Clique em **"Buscar"**
   - O sistema mostrará a quantidade disponível em estoque

3. **Preencher Formulário**:
   - **ID do Alimento**: Preenchido automaticamente
   - **Quantidade em Estoque**: Mostra o disponível (somente leitura)
   - **Quantidade a Distribuir**: Digite a quantidade desejada
   - **Nome da Casa**: Identifique o beneficiário

4. **Validações Automáticas**:
   - O sistema verifica se há quantidade suficiente em estoque
   - O botão só é habilitado se a quantidade for válida

5. Clique em **"Registrar Distribuição"**

#### Visualizando Histórico de Distribuições
- A tabela **"Histórico de Distribuições"** mostra todas as saídas registradas
- Acompanhe para onde foram os alimentos e em que quantidades

---

### 📊 5. Gerando Relatórios

![Relatórios](docs/images/reports.png)

#### Tipos de Relatórios Disponíveis

**1. Relatório de Alimentos**
- Lista completa do estoque atual
- Informações de validade e valores
- Disponível em PDF e Excel

**2. Relatório de Doações**
- Histórico completo de doações recebidas
- Filtros por período e doador
- Totalizadores por categoria

**3. Relatório de Distribuições**
- Registro de todas as saídas
- Controle de beneficiários
- Análise de distribuição por período

#### Como Gerar Relatórios

**Em cada seção (Itens, Doações, Distribuições):**
1. Role até a seção **"Gerar Relatórios"**
2. Escolha o formato desejado:
   - **PDF**: Clique no botão vermelho "PDF"
   - **Excel**: Clique no botão amarelo "Excel"
3. O arquivo será gerado e baixado automaticamente

**Localização dos Arquivos:**
- Os relatórios são salvos na pasta `public/` do sistema
- Também são disponibilizados para download direto

---

## 🔧 Funcionalidades Avançadas

### 🔍 Sistema de Busca
- **Busca Inteligente**: Digite parte do nome para encontrar itens
- **Filtros Múltiplos**: Combine data, doador e item nos filtros
- **Resultados em Tempo Real**: Busca instantânea conforme você digita

### 📱 Interface Responsiva
- **Design Mobile-First**: Otimizado para smartphones e tablets
- **Navegação Touch**: Botões e formulários adaptados para toque
- **Tabelas Responsivas**: Scroll horizontal automático em telas pequenas

### 🔐 Segurança
- **Autenticação JWT**: Tokens seguros com expiração
- **Rate Limiting**: Proteção contra ataques de força bruta
- **Validação de Dados**: Sanitização automática de entradas
- **Logs de Auditoria**: Registro de todas as operações

### 📈 Monitoramento
- **Health Check**: Endpoint para verificar status do sistema
- **Logs Estruturados**: Sistema de logging com Winston
- **Métricas de Performance**: Monitoramento de tempo de resposta

---

## 🚨 Solução de Problemas

### Problemas Comuns

#### 1. Erro de Login
**Sintoma**: "Usuário ou senha incorretos"
**Soluções**:
- Verifique se as credenciais estão corretas
- Certifique-se de que o banco de dados foi inicializado
- Execute: `node scripts/seed_db.js` para criar usuário padrão

#### 2. Erro de Conexão com Banco
**Sintoma**: "Erro no servidor" ao fazer operações
**Soluções**:
- Verifique se o arquivo `database/food_stock.db` existe
- Execute: `npm run migrate` para criar as tabelas
- Verifique permissões de escrita na pasta `database/`

#### 3. Porta em Uso
**Sintoma**: "EADDRINUSE: address already in use"
**Soluções**:
- Altere a porta no arquivo `.env`
- Ou finalize o processo que está usando a porta:
  ```bash
  # Windows
  netstat -ano | findstr :3001
  taskkill /PID [PID_NUMBER] /F
  
  # Linux/Mac
  lsof -ti :3001 | xargs kill -9
  ```

#### 4. Relatórios Não Geram
**Sintoma**: Erro ao gerar PDF ou Excel
**Soluções**:
- Verifique se a pasta `public/` tem permissões de escrita
- Reinstale as dependências: `npm install`
- Verifique se há espaço em disco suficiente

#### 5. Interface Não Carrega
**Sintoma**: Página em branco ou erro 404
**Soluções**:
- Verifique se o servidor está rodando
- Limpe o cache do navegador (Ctrl+F5)
- Verifique se os arquivos estáticos estão na pasta `public/`

### 🔧 Comandos de Diagnóstico

```bash
# Verificar status do banco de dados
node check-db.js

# Executar testes do sistema
npm test

# Verificar logs de erro
cat logs/error.log

# Resetar banco de dados (CUIDADO: apaga todos os dados)
node scripts/resetDB.js
```

### 📞 Logs e Debugging

#### Localização dos Logs
- **Logs Gerais**: `logs/combined.log`
- **Logs de Erro**: `logs/error.log`
- **Console**: Saída padrão durante execução

#### Habilitando Debug
```bash
# Modo desenvolvimento com logs detalhados
NODE_ENV=development npm run dev

# Executar com debug específico
DEBUG=app:* npm start
```

---

## 🛠️ Manutenção e Backup

### Backup do Banco de Dados
```bash
# Criar backup
cp database/food_stock.db backup/food_stock_$(date +%Y%m%d).db

# Restaurar backup
cp backup/food_stock_YYYYMMDD.db database/food_stock.db
```

### Limpeza de Logs
```bash
# Limpar logs antigos (manter últimos 30 dias)
find logs/ -name "*.log" -mtime +30 -delete
```

### Atualização do Sistema
```bash
# Fazer backup antes de atualizar
npm run backup

# Atualizar dependências
npm update

# Executar migrações se necessário
npm run migrate
```

---

## 📞 Suporte Técnico

### Informações de Contato
- **Email**: suporte@cfm-sistema.com
- **Telefone**: (11) 9999-9999
- **Horário**: Segunda a Sexta, 8h às 18h

### Antes de Entrar em Contato
1. ✅ Verifique se seguiu todos os passos de instalação
2. ✅ Consulte a seção de solução de problemas
3. ✅ Tenha em mãos os logs de erro
4. ✅ Anote a versão do sistema e do Node.js

### Informações Úteis para Suporte
```bash
# Versão do Node.js
node --version

# Versão do NPM
npm --version

# Versão do sistema
cat package.json | grep version

# Sistema operacional
uname -a  # Linux/Mac
systeminfo | findstr /B /C:"OS Name" /C:"OS Version"  # Windows
```

---

## 📚 Recursos Adicionais

### Documentação Técnica
- **API Documentation**: `/docs/api.md`
- **Database Schema**: `/docs/database.md`
- **Deployment Guide**: `/docs/deployment.md`

### Tutoriais em Vídeo
- [Instalação e Configuração](https://youtube.com/watch?v=exemplo1)
- [Primeiros Passos](https://youtube.com/watch?v=exemplo2)
- [Gerando Relatórios](https://youtube.com/watch?v=exemplo3)

### Comunidade
- **GitHub**: [Issues e Discussões](https://github.com/seu-usuario/controle-estoque-cfm/issues)
- **Discord**: [Servidor da Comunidade](https://discord.gg/exemplo)
- **Fórum**: [Fórum de Usuários](https://forum.cfm-sistema.com)

---

## 📄 Licença e Termos de Uso

Este sistema é distribuído sob a licença ISC. Consulte o arquivo `LICENSE` para mais detalhes.

### Limitações de Responsabilidade
- O sistema é fornecido "como está", sem garantias
- Os desenvolvedores não se responsabilizam por perda de dados
- Recomenda-se fazer backups regulares

### Política de Privacidade
- Os dados são armazenados localmente no servidor
- Não há coleta de dados pessoais além do necessário para funcionamento
- Logs podem conter informações de acesso para fins de segurança

---

## 🔄 Histórico de Versões

### v1.0.0 (Atual)
- ✅ Sistema completo de controle de estoque
- ✅ Autenticação JWT
- ✅ Relatórios PDF e Excel
- ✅ Interface responsiva
- ✅ Sistema de logs

### Próximas Versões
- 🔄 v1.1.0: Sistema de notificações por email
- 🔄 v1.2.0: Dashboard com gráficos
- 🔄 v1.3.0: API REST completa
- 🔄 v2.0.0: Interface multi-idioma

---

**📞 Precisa de ajuda?** Entre em contato conosco através dos canais de suporte listados acima.

**🎯 Sistema desenvolvido com ❤️ para organizações que fazem a diferença!**