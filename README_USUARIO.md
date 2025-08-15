# 🍽️ Sistema de Controle de Estoque CFM - Guia Rápido

## 🚀 Início Rápido

### 1. Instalação
```bash
npm install
npm run migrate
npm start
```

### 2. Primeiro Acesso
- **URL**: http://localhost:3001/login
- **Usuário**: `admin`
- **Senha**: `123456`

## 📱 Como Usar

### 🏠 Dashboard Principal
![Dashboard](docs/images/dashboard-preview.png)

**O que você vê:**
- 📊 Totais de estoque, doações e distribuições
- 📋 Últimas movimentações
- 🔗 Links rápidos para todas as funcionalidades

### 📦 Gerenciar Itens
**Para adicionar um novo alimento:**
1. Clique em "Gerenciar Itens"
2. Preencha o formulário na parte inferior
3. Clique em "Adicionar"

**Campos obrigatórios:**
- Nome do Alimento
- Quantidade
- Data

### 🎁 Registrar Doações
**Para registrar uma doação:**
1. Clique em "Registrar Doação"
2. Busque o alimento existente ou use o ID
3. Preencha quantidade e dados do doador
4. Clique em "Registrar Doação"

**O estoque é atualizado automaticamente!**

### 📤 Registrar Distribuições
**Para registrar uma saída:**
1. Clique em "Registrar Distribuição"
2. Busque o alimento
3. Digite a quantidade (sistema valida se há estoque)
4. Informe o nome da casa/beneficiário
5. Clique em "Registrar Distribuição"

### 📊 Relatórios
**Em qualquer seção, você pode:**
- Gerar relatório em PDF (botão vermelho)
- Gerar relatório em Excel (botão amarelo)
- Os arquivos são baixados automaticamente

## 🔧 Funcionalidades Especiais

### 🔍 Busca Inteligente
- Digite parte do nome do alimento
- Resultados aparecem instantaneamente
- Funciona em doações e distribuições

### 📱 Mobile Friendly
- Interface adaptada para celular
- Tabelas com scroll horizontal
- Botões otimizados para toque

### 🔐 Segurança
- Login obrigatório para todas as operações
- Sessão expira em 1 hora
- Dados validados automaticamente

## ⚡ Dicas Rápidas

### ✅ Boas Práticas
- Sempre preencha a data corretamente
- Use referências para facilitar controle
- Registre validades quando possível
- Faça backup regular do banco de dados

### 🚨 Atenção
- **Distribuições**: Só é possível distribuir o que há em estoque
- **Exclusões**: Cuidado ao excluir itens (ação irreversível)
- **Logout**: Sempre faça logout ao terminar

### 🔄 Fluxo Típico de Uso
1. **Login** → Acesse o sistema
2. **Dashboard** → Veja o resumo geral
3. **Cadastrar Itens** → Adicione novos alimentos
4. **Registrar Doações** → Aumente o estoque
5. **Registrar Distribuições** → Controle as saídas
6. **Gerar Relatórios** → Acompanhe os resultados

## 🆘 Problemas Comuns

| Problema | Solução |
|----------|---------|
| Não consigo fazer login | Verifique usuário: `admin`, senha: `123456` |
| Erro ao adicionar item | Verifique se todos os campos obrigatórios estão preenchidos |
| Não consigo distribuir | Verifique se há quantidade suficiente em estoque |
| Relatório não gera | Verifique se há dados para o período selecionado |
| Página não carrega | Verifique se o servidor está rodando na porta 3001 |

## 📞 Precisa de Ajuda?

### 🔧 Comandos Úteis
```bash
# Verificar se está funcionando
npm test

# Resetar banco de dados (CUIDADO!)
node scripts/resetDB.js

# Ver logs de erro
type logs\\error.log
```

### 📋 Informações do Sistema
- **Porta padrão**: 3001
- **Banco de dados**: SQLite (arquivo local)
- **Sessão**: Expira em 1 hora
- **Backup**: Arquivo `database/food_stock.db`

---

## 🎯 Resumo das Telas

### 1. 🔐 Login
- Tela simples com usuário e senha
- Validação em tempo real
- Redirecionamento automático

### 2. 🏠 Dashboard
- Visão geral dos números
- Tabelas com últimas movimentações
- Navegação para todas as funcionalidades

### 3. 📦 Gerenciar Itens
- Tabela completa do estoque
- Formulário para novos itens
- Ações de editar/excluir
- Geração de relatórios

### 4. 🎁 Registrar Doações
- Busca de alimentos existentes
- Formulário de doação
- Histórico de doações
- Filtros por data/doador/item

### 5. 📤 Registrar Distribuições
- Busca com validação de estoque
- Controle de quantidade disponível
- Histórico de distribuições
- Relatórios de saída

---

**🎉 Pronto! Agora você já sabe usar o sistema completo!**

Para o guia detalhado, consulte: [GUIA_USUARIO.md](GUIA_USUARIO.md)