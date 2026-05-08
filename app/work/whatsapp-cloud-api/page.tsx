import { CodeBlock } from "@/components/code-block"
import { ArticleContent } from "./article-content"

export default function WhatsAppCloudAPIPage() {
  return (
    <ArticleContent
      codeEndpoint={
        <CodeBlock
          lang="bash"
          code={`POST https://graph.facebook.com/v23.0/{PHONE_NUMBER_ID}/messages
Authorization: Bearer {ACCESS_TOKEN}
Content-Type: application/json`}
        />
      }
      codeButtons={
        <CodeBlock
          lang="json"
          code={`{
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
}`}
        />
      }
      codeIds={
        <CodeBlock
          lang="text"
          code={`restaurant:<uuid>    → selecionar restaurante
category:<uuid>      → filtrar cardápio
item:<uuid>          → adicionar ao carrinho
cart:view            → mostrar carrinho
cart:checkout        → iniciar checkout
cart:remove:<n>      → remover item n
confirm:yes          → confirmar ação
order:<uuid>         → status do pedido`}
        />
      }
    />
  )
}
