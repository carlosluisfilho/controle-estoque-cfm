# 📸 Capturas de Tela - Sistema CFM

## 🔐 Tela de Login
```
┌─────────────────────────────────────────┐
│              🔐 Acesso ao Sistema        │
├─────────────────────────────────────────┤
│                                         │
│  👤 Usuário: [admin____________]        │
│                                         │
│  🔒 Senha:   [••••••____________]       │
│                                         │
│           [    Entrar    ]              │
│                                         │
│  ⚠️ Mensagem de erro (se houver)        │
└─────────────────────────────────────────┘
```

**Funcionalidades:**
- Validação em tempo real
- Proteção contra força bruta
- Redirecionamento automático após login
- Mensagens de erro claras

---

## 🏠 Dashboard Principal
```
┌─────────────────────────────────────────────────────────────────┐
│  Painel de Controle                              [Logout] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ Estoque     │  │ Doações     │  │ Distribuições│             │
│  │ Total       │  │ Total       │  │ Total        │             │
│  │    150      │  │     45      │  │     32       │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                 │
│  [📦 Gerenciar] [🎁 Doação] [📤 Distribuição]                  │
│                                                                 │
│  🧺 Últimos Itens    🎁 Últimas Doações   📦 Últimas Distrib.  │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐   │
│  │Arroz      50kg  │ │Feijão    10kg   │ │Macarrão   5kg   │   │
│  │Feijão     30kg  │ │Arroz     20kg   │ │Arroz     15kg   │   │
│  │Macarrão   25kg  │ │Óleo       5L    │ │Feijão    10kg   │   │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

**Elementos principais:**
- Cards com totais em tempo real
- Botões de acesso rápido
- Tabelas com últimas movimentações
- Design responsivo

---

## 📦 Gerenciar Itens
```
┌─────────────────────────────────────────────────────────────────┐
│  Gerenciar Itens                                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ✅ Item adicionado com sucesso!                                │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ ID │ Nome     │ Qtd │ Data       │ Ref  │ Valor │ Validade │ │
│  ├────┼──────────┼─────┼────────────┼──────┼───────┼──────────┤ │
│  │ 1  │ Arroz    │ 50  │ 15/01/2024 │ A001 │ 5.50  │ 15/06/24 │ │
│  │ 2  │ Feijão   │ 30  │ 15/01/2024 │ F001 │ 8.00  │ 20/08/24 │ │
│  │ 3  │ Macarrão │ 25  │ 16/01/2024 │ M001 │ 3.20  │ 10/12/24 │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ➕ Adicionar Novo Item                                         │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Nome: [Açúcar_________________] Qtd: [10_____]              │ │
│  │ Data: [17/01/2024] Ref: [AC001] Valor: [4.50] Validade: [] │ │
│  │                    [  Adicionar  ]                         │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  [Voltar] [Logout]     📄 Relatórios: [PDF] [Excel]           │
└─────────────────────────────────────────────────────────────────┘
```

**Funcionalidades:**
- Tabela completa do estoque
- Formulário de adição inline
- Validação de campos obrigatórios
- Geração de relatórios

---

## 🎁 Registrar Doações
```
┌─────────────────────────────────────────────────────────────────┐
│  Registrar Doações                                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🔍 Buscar Item                                                 │
│  [Arroz_______________] [Buscar]                                │
│  ✅ Item encontrado: Arroz (ID: 1) - Estoque atual: 50kg       │
│                                                                 │
│  📋 Dados da Doação                                             │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ ID do Item: [1] (preenchido automaticamente)               │ │
│  │ Quantidade: [20_____] kg                                    │ │
│  │ Referência: [DOA001_____________]                           │ │
│  │ Doador:     [João Silva_________]                           │ │
│  │ Data:       [17/01/2024]                                    │ │
│  │ Validade:   [15/06/2024]                                    │ │
│  │                                                             │ │
│  │              [  Registrar Doação  ]                        │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  📜 Histórico de Doações                                        │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Item    │ Qtd │ Doador      │ Data       │ Validade         │ │
│  ├─────────┼─────┼─────────────┼────────────┼──────────────────┤ │
│  │ Feijão  │ 10  │ Maria Silva │ 16/01/2024 │ 20/08/2024      │ │
│  │ Óleo    │ 5   │ João Santos │ 15/01/2024 │ 30/12/2024      │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  🔍 Filtros: Data[_______] Doador[_______] Item[_______]        │
│                                                                 │
│  [Voltar] [Logout]     📊 Relatórios: [PDF] [Excel]           │
└─────────────────────────────────────────────────────────────────┘
```

**Processo:**
1. Busca do item existente
2. Preenchimento automático do ID
3. Inserção dos dados da doação
4. Atualização automática do estoque

---

## 📤 Registrar Distribuições
```
┌─────────────────────────────────────────────────────────────────┐
│  Registrar Distribuições                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🔍 Buscar Alimento                                             │
│  [Arroz_______________] [Buscar]                                │
│  ✅ Encontrado: Arroz - Disponível: 70kg                       │
│                                                                 │
│  📋 Dados da Distribuição                                       │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ ID do Alimento:      [1] (automático)                      │ │
│  │ Qtd em Estoque:      [70] kg (somente leitura)             │ │
│  │ Qtd a Distribuir:    [15_____] kg                          │ │
│  │ Nome da Casa:        [Casa São José_______]                │ │
│  │                                                             │ │
│  │ ⚠️ Validação: Quantidade OK ✅                              │ │
│  │                                                             │ │
│  │              [  Registrar Distribuição  ] ✅               │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  📜 Histórico de Distribuições                                  │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Alimento │ Qtd │ Casa           │ Data                      │ │
│  ├──────────┼─────┼────────────────┼───────────────────────────┤ │
│  │ Macarrão │ 5   │ Casa da Paz    │ 16/01/2024 14:30         │ │
│  │ Feijão   │ 10  │ Lar Esperança  │ 15/01/2024 16:45         │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  [Voltar] [Logout]     📊 Relatórios: [PDF] [Excel]           │
└─────────────────────────────────────────────────────────────────┘
```

**Validações:**
- Verificação de estoque disponível
- Botão habilitado apenas com quantidade válida
- Atualização automática do estoque após distribuição

---

## 📊 Exemplo de Relatório PDF
```
┌─────────────────────────────────────────────────────────────────┐
│                    RELATÓRIO DE ESTOQUE                        │
│                   Sistema CFM - 17/01/2024                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  RESUMO GERAL                                                   │
│  • Total de Itens: 15                                          │
│  • Valor Total: R$ 1.250,00                                    │
│  • Itens próximos ao vencimento: 3                             │
│                                                                 │
│  DETALHAMENTO POR ITEM                                          │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Item     │ Qtd │ Valor Unit │ Total   │ Validade            │ │
│  ├──────────┼─────┼────────────┼─────────┼─────────────────────┤ │
│  │ Arroz    │ 70  │ R$ 5,50    │ R$ 385  │ 15/06/2024         │ │
│  │ Feijão   │ 40  │ R$ 8,00    │ R$ 320  │ 20/08/2024         │ │
│  │ Macarrão │ 20  │ R$ 3,20    │ R$ 64   │ 10/12/2024         │ │
│  │ Óleo     │ 15  │ R$ 12,00   │ R$ 180  │ 30/12/2024         │ │
│  │ Açúcar   │ 25  │ R$ 4,50    │ R$ 112  │ 25/11/2024         │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ALERTAS                                                        │
│  ⚠️ Itens com estoque baixo (< 10 unidades): Nenhum            │
│  ⚠️ Itens vencendo em 30 dias: Nenhum                          │
│                                                                 │
│  Relatório gerado em: 17/01/2024 às 15:30                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📱 Versão Mobile

### Dashboard Mobile
```
┌─────────────────────┐
│ CFM - Painel   [≡]  │
├─────────────────────┤
│                     │
│ ┌─────────────────┐ │
│ │ Estoque: 150    │ │
│ └─────────────────┘ │
│ ┌─────────────────┐ │
│ │ Doações: 45     │ │
│ └─────────────────┘ │
│ ┌─────────────────┐ │
│ │ Distrib.: 32    │ │
│ └─────────────────┘ │
│                     │
│ [📦 Gerenciar]      │
│ [🎁 Doações]        │
│ [📤 Distribuições]  │
│                     │
│ 🧺 Últimos Itens    │
│ Arroz      50kg     │
│ Feijão     30kg     │
│ Macarrão   25kg     │
│                     │
│ [Logout]            │
└─────────────────────┘
```

### Formulário Mobile
```
┌─────────────────────┐
│ Adicionar Item [×]  │
├─────────────────────┤
│                     │
│ Nome do Alimento:   │
│ [Açúcar_________]   │
│                     │
│ Quantidade:         │
│ [10_____________]   │
│                     │
│ Data:               │
│ [17/01/2024_____]   │
│                     │
│ Referência:         │
│ [AC001__________]   │
│                     │
│ Valor:              │
│ [4.50___________]   │
│                     │
│ Validade:           │
│ [_______________]   │
│                     │
│ [    Adicionar    ] │
│ [    Cancelar     ] │
└─────────────────────┘
```

---

## 🎨 Elementos Visuais

### Cores do Sistema
- **Primária**: Azul (#007bff) - Botões principais
- **Sucesso**: Verde (#28a745) - Confirmações e estoque
- **Aviso**: Amarelo (#ffc107) - Distribuições e alertas
- **Perigo**: Vermelho (#dc3545) - Exclusões e erros
- **Info**: Azul claro (#17a2b8) - Informações gerais

### Ícones Utilizados
- 🔐 Login e segurança
- 🏠 Dashboard/início
- 📦 Estoque e itens
- 🎁 Doações
- 📤 Distribuições
- 📊 Relatórios
- 🔍 Busca
- ⚠️ Alertas
- ✅ Confirmações
- ❌ Erros

### Feedback Visual
- **Loading**: Spinners durante carregamento
- **Sucesso**: Alertas verdes com ícone ✅
- **Erro**: Alertas vermelhos com ícone ❌
- **Validação**: Campos com bordas coloridas
- **Hover**: Efeitos em botões e links

---

**📝 Nota**: Estas são representações textuais das telas. Para capturas reais, execute o sistema e navegue pelas funcionalidades.