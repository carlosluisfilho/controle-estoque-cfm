# 📸 Como Capturar Screenshots do Sistema

## 🎯 Objetivo
Este guia ensina como capturar screenshots das principais telas do sistema para documentação.

## 🚀 Preparação

### 1. Iniciar o Sistema
```bash
# No diretório do projeto
npm start
```

### 2. Acessar o Sistema
- Abra o navegador em: `http://localhost:3001`
- Use as credenciais: `admin` / `123456`

### 3. Preparar Dados de Exemplo
Execute o script para popular o banco com dados de exemplo:
```bash
node scripts/seed_db.js
```

## 📷 Screenshots Necessários

### 1. 🔐 Tela de Login
**URL**: `http://localhost:3001/login`

**Passos:**
1. Acesse a URL
2. NÃO preencha os campos ainda
3. Capture a tela limpa
4. **Salvar como**: `docs/images/01-login-screen.png`

**Elementos importantes:**
- Formulário de login centralizado
- Campos de usuário e senha
- Botão "Entrar"
- Logo/título do sistema

---

### 2. 🏠 Dashboard Principal
**URL**: `http://localhost:3001/` (após login)

**Passos:**
1. Faça login com admin/123456
2. Aguarde carregar completamente
3. Capture a tela inteira
4. **Salvar como**: `docs/images/02-dashboard-main.png`

**Elementos importantes:**
- Cards com totais (estoque, doações, distribuições)
- Tabelas com últimas movimentações
- Botões de navegação
- Header com logout

---

### 3. 📦 Gerenciar Itens
**URL**: `http://localhost:3001/food.html`

**Passos:**
1. No dashboard, clique em "Gerenciar Itens"
2. Aguarde carregar a tabela
3. Role para mostrar tanto a tabela quanto o formulário
4. **Salvar como**: `docs/images/03-food-management.png`

**Elementos importantes:**
- Tabela completa de itens
- Formulário de adição
- Botões de ação (editar/excluir)
- Seção de relatórios

---

### 4. 🎁 Registrar Doações
**URL**: `http://localhost:3001/donation.html`

**Passos:**
1. Acesse a página de doações
2. No campo "Buscar Item", digite "Arroz" e clique em "Buscar"
3. Preencha alguns campos do formulário (não submeta)
4. **Salvar como**: `docs/images/04-donation-form.png`

**Elementos importantes:**
- Campo de busca com resultado
- Formulário preenchido parcialmente
- Histórico de doações
- Filtros na parte inferior

---

### 5. 📤 Registrar Distribuições
**URL**: `http://localhost:3001/distribution.html`

**Passos:**
1. Acesse a página de distribuições
2. Busque um alimento existente
3. Preencha o formulário (sem submeter)
4. **Salvar como**: `docs/images/05-distribution-form.png`

**Elementos importantes:**
- Busca de alimento com validação
- Quantidade em estoque visível
- Formulário com validação
- Histórico de distribuições

---

### 6. 📊 Exemplo de Relatório
**Passos:**
1. Em qualquer seção, clique em "PDF" para gerar relatório
2. Abra o PDF gerado
3. Capture a primeira página
4. **Salvar como**: `docs/images/06-report-example.png`

---

### 7. 📱 Versão Mobile

**Passos:**
1. Abra as ferramentas de desenvolvedor (F12)
2. Ative o modo responsivo (Ctrl+Shift+M)
3. Selecione um dispositivo móvel (ex: iPhone 12)
4. Navegue pelo dashboard
5. **Salvar como**: `docs/images/07-mobile-dashboard.png`

**Elementos importantes:**
- Layout adaptado para mobile
- Botões otimizados para toque
- Navegação mobile-friendly

---

## 🛠️ Configurações de Captura

### Resolução Recomendada
- **Desktop**: 1920x1080 ou 1366x768
- **Mobile**: 375x812 (iPhone 12) ou 360x640 (Android)

### Navegador
- **Recomendado**: Chrome ou Edge
- **Zoom**: 100% (padrão)
- **Modo**: Tela cheia para melhor visualização

### Qualidade
- **Formato**: PNG (melhor qualidade)
- **Compressão**: Mínima
- **DPI**: 96 (padrão web)

## 📝 Dicas para Boas Screenshots

### ✅ Fazer
- Aguardar carregamento completo
- Mostrar dados realistas
- Capturar elementos importantes
- Usar resolução adequada
- Manter consistência visual

### ❌ Evitar
- Dados pessoais reais
- Telas com erros (a menos que seja o objetivo)
- Cortes que omitam informações importantes
- Qualidade baixa ou pixelizada
- Elementos de debug visíveis

## 🔧 Ferramentas Úteis

### Windows
- **Print Screen**: Captura tela inteira
- **Alt + Print Screen**: Captura janela ativa
- **Windows + Shift + S**: Ferramenta de recorte
- **Snipping Tool**: Ferramenta nativa

### Extensões do Chrome
- **Awesome Screenshot**: Captura página inteira
- **Full Page Screen Capture**: Screenshots completas
- **Nimbus Screenshot**: Edição básica

### Editores de Imagem
- **Paint.NET**: Gratuito, simples
- **GIMP**: Gratuito, avançado
- **Photoshop**: Pago, profissional

## 📋 Checklist Final

Antes de finalizar, verifique se tem:

- [ ] 01-login-screen.png
- [ ] 02-dashboard-main.png
- [ ] 03-food-management.png
- [ ] 04-donation-form.png
- [ ] 05-distribution-form.png
- [ ] 06-report-example.png
- [ ] 07-mobile-dashboard.png

### Organização dos Arquivos
```
docs/
├── images/
│   ├── 01-login-screen.png
│   ├── 02-dashboard-main.png
│   ├── 03-food-management.png
│   ├── 04-donation-form.png
│   ├── 05-distribution-form.png
│   ├── 06-report-example.png
│   └── 07-mobile-dashboard.png
├── SCREENSHOTS.md
└── COMO_CAPTURAR_SCREENSHOTS.md
```

## 🔄 Atualizando Screenshots

### Quando Atualizar
- Mudanças significativas na interface
- Novas funcionalidades adicionadas
- Correções de bugs visuais
- Atualizações de design

### Processo de Atualização
1. Faça backup das imagens antigas
2. Capture novas screenshots seguindo este guia
3. Substitua as imagens antigas
4. Atualize a documentação se necessário
5. Teste se as imagens aparecem corretamente

---

**💡 Dica**: Mantenha este guia atualizado sempre que houver mudanças na interface do sistema!