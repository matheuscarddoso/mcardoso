# WhatsApp Cloud API — Mensagens Interativas e Carrosséis

> **Objetivo:** guia de implementação completo para mensagens interativas via WhatsApp Cloud API (Graph API v23.0), incluindo botões, listas e carrosséis de cards com imagens. Escrito para ser seguido por um LLM ou engenheiro sem contexto prévio.

---

## Pré-requisitos

| Recurso | Como obter |
|---|---|
| `WHATSAPP_ACCESS_TOKEN` | Meta Business Manager → WhatsApp → Configuração da API |
| `WHATSAPP_PHONE_NUMBER_ID` | Mesmo painel, campo "Phone Number ID" (não é o número em si) |
| Conta Business verificada | Necessária para enviar templates fora da janela de 24 h |
| Número de telefone associado | Um número por Phone Number ID |

---

## Base da API

```
POST https://graph.facebook.com/v23.0/{PHONE_NUMBER_ID}/messages
Authorization: Bearer {ACCESS_TOKEN}
Content-Type: application/json
```

Todos os payloads têm o campo obrigatório:

```json
{
  "messaging_product": "whatsapp",
  "to": "5511999999999"
}
```

O campo `to` é E.164 **sem o `+`** (ex: `5511999999999`, não `+5511999999999`).

---

## Tipos de mensagem

### 1. Texto simples

```json
{
  "messaging_product": "whatsapp",
  "to": "5511999999999",
  "type": "text",
  "text": { "body": "Olá! Como posso ajudar?" }
}
```

Suporta formatação WhatsApp: `*negrito*`, `_itálico_`, `~tachado~`, `` `código` ``.

---

### 2. Botões interativos (`type: button`)

Máximo de **3 botões**. Usado para perguntas de múltipla escolha com poucas opções.

```json
{
  "messaging_product": "whatsapp",
  "to": "5511999999999",
  "type": "interactive",
  "interactive": {
    "type": "button",
    "body": { "text": "Como prefere receber o pedido?" },
    "action": {
      "buttons": [
        { "type": "reply", "reply": { "id": "delivery", "title": "🛵 Entrega" } },
        { "type": "reply", "reply": { "id": "pickup",   "title": "🏠 Retirada" } }
      ]
    }
  }
}
```

**Limites:**
- `body.text`: máx 1024 chars
- `reply.title`: máx 20 chars
- `reply.id`: máx 256 chars, retornado no webhook exatamente como enviado
- Máximo 3 botões por mensagem

---

### 3. Lista interativa (`type: list`)

Útil para 4–10 opções. Apresenta um botão que abre um modal com seções.

```json
{
  "messaging_product": "whatsapp",
  "to": "5511999999999",
  "type": "interactive",
  "interactive": {
    "type": "list",
    "header": { "type": "text", "text": "Escolha um restaurante" },
    "body":   { "text": "Selecione onde você quer pedir:" },
    "action": {
      "button": "Ver opções",
      "sections": [
        {
          "title": "Disponíveis",
          "rows": [
            { "id": "restaurant:uuid-1", "title": "Burger Palace",   "description": "Hambúrgueres artesanais" },
            { "id": "restaurant:uuid-2", "title": "Pizza Napoletana", "description": "Forno a lenha" }
          ]
        }
      ]
    }
  }
}
```

**Limites:**
- `header.text`: máx 60 chars
- `body.text`: máx 1024 chars
- `action.button` (label): máx 20 chars
- `section.title`: máx 24 chars
- `row.title`: máx 24 chars
- `row.description`: máx 72 chars
- Máximo 10 seções, 10 rows por seção
- `row.id`: retornado no webhook como `button_reply.id`

---

### 4. Carrossel interativo (`type: carousel`)

Cards horizontais com imagem, texto e botão de ação. Requer a **janela de 24 horas** (conversa iniciada pelo usuário ou mensagem recente). Não funciona com templates.

```json
{
  "messaging_product": "whatsapp",
  "recipient_type": "individual",
  "to": "5511999999999",
  "type": "interactive",
  "interactive": {
    "type": "carousel",
    "body": { "text": "🍔 Hambúrgueres" },
    "action": {
      "cards": [
        {
          "card_index": 0,
          "type": "button",
          "header": {
            "type": "image",
            "image": { "link": "https://example.com/burger.jpg" }
          },
          "body": { "text": "Burger Clássico\nR$25,00\nCarne, queijo e alface" },
          "action": {
            "buttons": [
              {
                "type": "quick_reply",
                "quick_reply": { "id": "item:uuid-do-item", "title": "Pedir" }
              }
            ]
          }
        },
        {
          "card_index": 1,
          "type": "button",
          "header": {
            "type": "image",
            "image": { "link": "https://example.com/double.jpg" }
          },
          "body": { "text": "Double Smash\nR$34,00\nDuplo blend com cheddar" },
          "action": {
            "buttons": [
              {
                "type": "quick_reply",
                "quick_reply": { "id": "item:uuid-outro-item", "title": "Pedir" }
              }
            ]
          }
        }
      ]
    }
  }
}
```

**Limites e regras:**
- Mínimo **2 cards**, máximo **10 cards** por carrossel
- `body.text` (intro): máx 1024 chars
- `card.body.text`: máx 160 chars, máximo **2 quebras de linha** (`\n`)
- `quick_reply.title`: máx 20 chars
- `quick_reply.id`: máx 256 chars
- Todos os cards devem ter o **mesmo número de botões** (1 botão por card é o mais comum)
- `card_index` começa em 0 e deve ser sequencial
- Imagens: JPEG recomendado, URL pública acessível pelo servidor da Meta, razão de aspecto **1:1** (quadrado) renderiza melhor; retangulares são cortadas
- Não funciona fora da janela de 24 horas (use template de carousel para isso)

---

## Como o webhook retorna as respostas

Quando o usuário toca um botão (reply-button, list-row, carousel quick_reply), a Meta envia um POST para o seu webhook:

```json
{
  "object": "whatsapp_business_account",
  "entry": [{
    "changes": [{
      "value": {
        "messages": [{
          "from": "5511999999999",
          "type": "interactive",
          "interactive": {
            "type": "button_reply",
            "button_reply": {
              "id": "item:uuid-do-item",
              "title": "Pedir"
            }
          }
        }]
      }
    }]
  }]
}
```

Para listas, `type` é `"list_reply"` e o campo é `"list_reply"` em vez de `"button_reply"`.

Para carousel `quick_reply`, o webhook retorna `type: "button"` com:
```json
{
  "type": "button",
  "button": {
    "payload": "item:uuid-do-item",
    "text": "Pedir"
  }
}
```

> **Importante:** o campo retornado pelo carousel quick_reply é `button.payload`, não `button_reply.id`. É um campo diferente dos botões interativos normais. Trate os dois no mesmo parser.

---

## Padrão de IDs como máquina de estado

A forma mais limpa de gerenciar o fluxo de conversa é codificar a ação direto no `id` do botão usando prefixos:

```
restaurant:<uuid>    → selecionar restaurante
category:<uuid>      → filtrar cardápio por categoria
item:<uuid>          → adicionar item ao carrinho
addon:<uuid>         → selecionar adicional
cart:view            → mostrar carrinho
cart:checkout        → iniciar checkout
cart:clear           → limpar carrinho
cart:edit            → editar itens
cart:remove:<n>      → remover item no índice n
confirm:yes          → confirmar ação
confirm:no           → cancelar ação
order:<uuid>         → status do pedido
```

No webhook, parse o `id`/`payload` recebido com um switch por prefixo e execute a ação correspondente. Isso mantém o estado fora do servidor — o próprio botão carrega a intenção.

---

## Estratégia de fallback

As mensagens interativas (botões, listas, carrosséis) podem falhar se:
- O usuário está em uma versão antiga do WhatsApp
- O número é de uma API Business de terceiro que não suporta interactivos
- A Meta retorna erro de conteúdo (imagem inacessível, texto excede limite)

**Padrão recomendado:** envolva toda chamada interativa em `try/catch`. No `catch`, envie uma mensagem de texto equivalente como fallback:

```typescript
try {
  await sendCarousel({ to, body, cards })
} catch {
  // fallback: lista em texto simples
  const lines = cards.map(c => `• *${c.name}* — R$${c.price}`)
  await sendText({ to, text: `${body}\n\n${lines.join('\n')}\n\nDigite o nome do item.` })
}
```

Para o carrossel especificamente: se tiver menos de 2 cards válidos, vá direto para o fallback — a API rejeita carrosséis com 1 card.

---

## Imagens para carrossel

- Use URLs permanentes e publicamente acessíveis (sem auth, sem redirect)
- JPEG tem menor chance de erro de processamento do que PNG ou WebP
- Resolução recomendada: 800×800px ou maior
- A Meta faz cache da imagem após o primeiro envio — alterações na URL (query string com timestamp) forçam novo fetch
- Se a URL for inválida, a API retorna 200 mas não entrega o card — monitore pelo webhook de status

---

## Limites de rate e janela de atendimento

| Tipo | Janela necessária |
|---|---|
| Texto | 24 h desde última msg do usuário |
| Botões interativos | 24 h desde última msg do usuário |
| Lista interativa | 24 h desde última msg do usuário |
| Carrossel não-template | 24 h desde última msg do usuário |
| Template de marketing | Qualquer hora (cobrado) |
| Template utilitário | Qualquer hora (cobrado) |

Rate limit padrão: **80 mensagens por segundo** por número de telefone (pode ser aumentado via suporte Meta).

---

## Checklist de implementação

- [ ] `WHATSAPP_ACCESS_TOKEN` e `WHATSAPP_PHONE_NUMBER_ID` em variáveis de ambiente, nunca no código
- [ ] Todos os sends interativos envolvidos em try/catch com fallback para texto
- [ ] Parser de webhook unificado que trata `button_reply.id`, `list_reply.id` e `button.payload` (carousel)
- [ ] Verificação de `messaging_product === 'whatsapp'` antes de processar
- [ ] Responder ao webhook com HTTP 200 imediatamente (antes de processar) — a Meta retenta se não receber 200 em 20 s
- [ ] Deduplicação por `message.id` no webhook — a Meta pode entregar a mesma mensagem mais de uma vez
- [ ] Imagens em JPEG, URLs públicas, razão 1:1 para carrossel
- [ ] Mínimo 2 cards por carrossel — guardar antes de chamar a API
- [ ] Todos os cards com o mesmo número de botões no carrossel

---

## Referências oficiais

- [WhatsApp Cloud API — Send Messages](https://developers.facebook.com/docs/whatsapp/cloud-api/messages)
- [Interactive Messages](https://developers.facebook.com/docs/whatsapp/cloud-api/messages/interactive-messages)
- [Carousel Messages](https://developers.facebook.com/docs/whatsapp/cloud-api/messages/carousel-messages)
- [Webhooks — Message Object](https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/components)
