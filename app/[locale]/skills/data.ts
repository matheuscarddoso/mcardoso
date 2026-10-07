import type { Language } from "@/lib/locale"

/*
 * Every skill in matheuscarddoso/skills, in the order a reader meets them:
 * the interface suite first, the one most people come for, then engineering.
 *
 * `prompt` is what you type; `output` is a short taste of what comes back,
 * for skills whose example is text rather than a visual. Interface skills
 * carry a before/after demo instead, keyed by name in `demos.tsx`.
 *
 * The descriptions follow the README of the repository, shortened. When a
 * skill changes there, change it here.
 */

export type L = Record<Language, string>

export type Skill = {
  name: string
  /** Typed by you, never fired by the agent on its own. */
  userInvoked: boolean
  description: L
  prompt: L
  output?: L
}

export type Group = { id: "interface" | "engineering"; title: L; intro: L; skills: Skill[] }

const t = (PT: string, EN: string, ES: string): L => ({ PT, EN, ES })

export const GROUPS: Group[] = [
  {
    id: "interface",
    title: t("Interface", "Interface", "Interfaz"),
    intro: t(
      "Seis especialistas, uma por disciplina, que o agente consulta enquanto constrói. Uma revisão que passa por todas. Cinco ferramentas que produzem em vez de julgar.",
      "Six specialists, one per discipline, that the agent reaches for while it builds. One review that runs through all of them. Five tools that produce rather than judge.",
      "Seis especialistas, una por disciplina, que el agente consulta mientras construye. Una revisión que pasa por todas. Cinco herramientas que producen en vez de juzgar."
    ),
    skills: [
      {
        name: "designer",
        userInvoked: true,
        description: t(
          "Revisa uma tela, um fluxo, uma branch ou um PR passando por todas as skills de interface, e devolve um veredito só, ranqueado, com arquivo e linha em cada achado.",
          "Reviews a screen, a flow, a branch or a pull request through every interface skill and returns one ranked verdict, with a file and line on every finding.",
          "Revisa una pantalla, un flujo, una rama o un PR pasando por todas las skills de interfaz, y devuelve un veredicto, ordenado, con archivo y línea en cada hallazgo."
        ),
        prompt: t(
          "/designer revisa o checkout, inclusive o estado vazio e o de erro",
          "/designer review the checkout, including the empty and error states",
          "/designer revisa el checkout, incluidos el estado vacío y el de error"
        ),
      },
      {
        name: "polish",
        userInvoked: false,
        description: t(
          "O acabamento com valores exatos: raio concêntrico, sombra no lugar de borda, contorno de imagem, alinhamento óptico, pressão em 0.96, troca de ícone, entrada, saída e gesto.",
          "Finish with exact values: concentric radius, shadows instead of borders, image outlines, optical alignment, a 0.96 press, icon swaps, enters, exits and gestures.",
          "El acabado con valores exactos: radio concéntrico, sombra en lugar de borde, contorno de imagen, alineación óptica, presión en 0.96, cambio de ícono, entradas, salidas y gestos."
        ),
        prompt: t(
          "Deixa esse card com acabamento: raio, sombra e a pressão do botão",
          "Polish this card: the radius, the shadow and the button press",
          "Dale acabado a esta tarjeta: el radio, la sombra y la presión del botón"
        ),
      },
      {
        name: "typography",
        userInvoked: false,
        description: t(
          "Como o texto renderiza: escolha e carregamento de fonte, escala, altura de linha, quebra com balance e pretty, números tabulares, truncamento e pontuação.",
          "How text renders: choosing and loading fonts, the type scale, line height, balance and pretty wrapping, tabular numbers, truncation and punctuation.",
          "Cómo se renderiza el texto: elegir y cargar fuentes, la escala, el interlineado, el ajuste con balance y pretty, números tabulares, truncado y puntuación."
        ),
        prompt: t(
          "O título quebra deixando uma palavra sozinha e o preço treme quando muda",
          "The heading leaves one word alone on the last line and the price jitters when it changes",
          "El título deja una palabra sola en la última línea y el precio tiembla cuando cambia"
        ),
      },
      {
        name: "color",
        userInvoked: false,
        description: t(
          "O sistema de cor: rampas em OKLCH, tokens por papel, conversão de formato, gamut, contraste medido no par que de fato renderiza e tema escuro.",
          "The color system: OKLCH ramps, role-based tokens, format conversion, gamut, contrast measured on the pair that actually renders, and dark mode.",
          "El sistema de color: rampas en OKLCH, tokens por función, conversión de formato, gamut, contraste medido en el par que realmente se renderiza y tema oscuro."
        ),
        prompt: t(
          "Gera a rampa da marca #0ea5e9 em OKLCH e os tokens pros dois temas",
          "Build the ramp for the brand color #0ea5e9 in OKLCH, with tokens for both themes",
          "Genera la rampa de la marca #0ea5e9 en OKLCH y los tokens para los dos temas"
        ),
      },
      {
        name: "a11y",
        userInvoked: false,
        description: t(
          "Teclado e foco, nome acessível, semântica, formulário, leitor de tela, área de toque e movimento reduzido, contra a WCAG 2.2.",
          "Keyboard and focus, accessible names, semantics, forms, screen readers, hit areas and reduced motion, against WCAG 2.2.",
          "Teclado y foco, nombre accesible, semántica, formularios, lector de pantalla, área táctil y movimiento reducido, según WCAG 2.2."
        ),
        prompt: t(
          "Esse formulário de cadastro funciona só com teclado e leitor de tela?",
          "Does this sign-up form work with only a keyboard and a screen reader?",
          "¿Este formulario de registro funciona solo con teclado y lector de pantalla?"
        ),
      },
      {
        name: "layout",
        userInvoked: false,
        description: t(
          "Agrupamento, alinhamento, ordem de leitura, breakpoint que vem do conteúdo e espaço pro texto traduzido, pra o layout aguentar ser redimensionado, traduzido ou espelhado.",
          "Grouping, alignment, reading order, breakpoints that come from the content and room for translated text, so a layout holds up when it is resized, translated or mirrored.",
          "Agrupación, alineación, orden de lectura, breakpoints que salen del contenido y espacio para el texto traducido, para que el layout aguante ser redimensionado, traducido o espejado."
        ),
        prompt: t(
          "As configurações estão com cara de lista de compras. Agrupa sem encher de divisor",
          "The settings read like a shopping list. Group them without dividers everywhere",
          "La configuración parece una lista de compras. Agrúpala sin llenarla de divisores"
        ),
      },
      {
        name: "microcopy",
        userInvoked: false,
        description: t(
          "O texto da interface: rótulo que diz a ação, erro que diz o que fazer, estado vazio que ensina e confirmação que nomeia a consequência.",
          "Interface copy: labels that name the action, errors that say what to do, empty states that teach and confirmations that name the consequence.",
          "El texto de la interfaz: etiquetas que nombran la acción, errores que dicen qué hacer, estados vacíos que enseñan y confirmaciones que nombran la consecuencia."
        ),
        prompt: t(
          "Reescreve o diálogo de excluir site e o estado vazio de projetos",
          "Rewrite the delete-site dialog and the empty projects state",
          "Reescribe el diálogo de eliminar sitio y el estado vacío de proyectos"
        ),
      },
      {
        name: "variant",
        userInvoked: true,
        description: t(
          "Três versões genuinamente diferentes de um componente, num eixo que você nomeia, atrás de um seletor na página real. Você alterna e promove a que ganhar.",
          "Three genuinely different versions of a component, on an axis you name, behind a switcher on the real page. You flip between them and promote the winner.",
          "Tres versiones realmente distintas de un componente, en un eje que tú nombras, detrás de un selector en la página real. Alternas y promueves la que gane."
        ),
        prompt: t(
          "/variant o card de plano, variando a densidade",
          "/variant the plan card, varying the density",
          "/variant la tarjeta de plan, variando la densidad"
        ),
      },
      {
        name: "teardown",
        userInvoked: true,
        description: t(
          "Explica como uma interface, um efeito ou uma animação de outro site foi feita, separando o que mediu do que deduziu, e fecha com a receita que transfere pro seu projeto.",
          "Explains how an interface, effect or animation on another site was built, separating what it measured from what it inferred, and ends with the recipe that carries over.",
          "Explica cómo se hizo una interfaz, un efecto o una animación de otro sitio, separando lo medido de lo deducido, y cierra con la receta que se lleva a tu proyecto."
        ),
        prompt: t(
          "/teardown como é feita a animação do botão de copiar do interfaces.dev?",
          "/teardown how is the copy button animation on interfaces.dev built?",
          "/teardown ¿cómo está hecha la animación del botón de copiar de interfaces.dev?"
        ),
      },
      {
        name: "break",
        userInvoked: true,
        description: t(
          "Renderiza um componente sob todo cenário que alcança ele em produção, texto enorme, zero item, 320px, RTL, numa página temporária, e marca o que quebrou.",
          "Renders a component under every scenario that can reach it in production, huge text, zero items, 320px, RTL, on a temporary page, and marks what broke.",
          "Renderiza un componente bajo todo escenario que lo alcanza en producción, texto enorme, cero elementos, 320px, RTL, en una página temporal, y marca lo que se rompió."
        ),
        prompt: t("/break o card de problema", "/break the problem card", "/break la tarjeta de problema"),
      },
      {
        name: "states",
        userInvoked: true,
        description: t(
          "Uma bancada com cada estado de um componente, carregando, vazio, erro, plano e permissão, com dado de mentira e um seletor por teclado, pra trabalhar um de cada vez.",
          "A workbench with every state of a component, loading, empty, error, plan and permission, with mock data and a keyboard switcher, to work on one at a time.",
          "Un banco de trabajo con cada estado de un componente, cargando, vacío, error, plan y permiso, con datos de prueba y un selector por teclado, para trabajar uno a la vez."
        ),
        prompt: t("/states a lista de problemas", "/states the problems list", "/states la lista de problemas"),
      },
      {
        name: "handoff",
        userInvoked: false,
        description: t(
          "Constrói a partir de um link do Figma ou de um print, com os tokens e componentes do projeto, e compara lado a lado antes de dizer que terminou.",
          "Builds from a Figma link or a screenshot, with the project's own tokens and components, and compares side by side before calling it done.",
          "Construye a partir de un enlace de Figma o una captura, con los tokens y componentes del proyecto, y compara lado a lado antes de darlo por terminado."
        ),
        prompt: t(
          "Implementa este frame: figma.com/design/…?node-id=12-345",
          "Build this frame: figma.com/design/…?node-id=12-345",
          "Implementa este frame: figma.com/design/…?node-id=12-345"
        ),
      },
    ],
  },
  {
    id: "engineering",
    title: t("Engenharia", "Engineering", "Ingeniería"),
    intro: t(
      "Alinhar antes de construir, construir com teste, diagnosticar, auditar e subir. Nenhuma assume linguagem: o específico de cada stack mora em referências.",
      "Align before building, build with tests, diagnose, audit and ship. None of them assumes a language: what is stack-specific lives in references.",
      "Alinear antes de construir, construir con tests, diagnosticar, auditar y desplegar. Ninguna asume un lenguaje: lo específico de cada stack vive en referencias."
    ),
    skills: [
      {
        name: "grill",
        userInvoked: true,
        description: t(
          "Uma entrevista dura antes de construir, uma pergunta por vez, até não sobrar decisão em aberto.",
          "A hard interview before building, one question at a time, until no decision is left open.",
          "Una entrevista dura antes de construir, una pregunta a la vez, hasta que no quede decisión abierta."
        ),
        prompt: t(
          "/grill quero adicionar assinatura com cobrança recorrente",
          "/grill I want to add subscriptions with recurring billing",
          "/grill quiero agregar suscripciones con cobro recurrente"
        ),
        output: t(
          "1. Quem pode cancelar: a pessoa, o suporte, ou os dois?\n   Recomendo os dois, com motivo obrigatório pro suporte.",
          "1. Who can cancel: the customer, support, or both?\n   I'd say both, with a required reason for support.",
          "1. ¿Quién puede cancelar: la persona, soporte, o los dos?\n   Recomiendo los dos, con motivo obligatorio para soporte."
        ),
      },
      {
        name: "kickoff",
        userInvoked: false,
        description: t(
          "Projeto novo: stack com justificativa escrita, segurança no dia um, infraestrutura reprodutível e o loop de feedback antes do primeiro commit.",
          "A new project: a stack with a written rationale, security from day one, reproducible infrastructure and the feedback loop before the first commit.",
          "Proyecto nuevo: stack con justificación escrita, seguridad desde el día uno, infraestructura reproducible y el ciclo de feedback antes del primer commit."
        ),
        prompt: t("Começa um painel de cobrança do zero", "Start a billing dashboard from scratch", "Empieza un panel de cobros desde cero"),
        output: t(
          "Stack       Next.js + Postgres, porque…\nSegurança   headers, secrets fora do repo, CI com auditoria\nLoop        lint + tipos + teste rodando antes do 1º commit",
          "Stack       Next.js + Postgres, because…\nSecurity    headers, secrets out of the repo, CI with audit\nLoop        lint + types + tests running before the 1st commit",
          "Stack       Next.js + Postgres, porque…\nSeguridad   headers, secrets fuera del repo, CI con auditoría\nCiclo       lint + tipos + tests antes del 1er commit"
        ),
      },
      {
        name: "tdd",
        userInvoked: false,
        description: t(
          "Vermelho, verde, refatora, uma fatia vertical por vez.",
          "Red, green, refactor, one vertical slice at a time.",
          "Rojo, verde, refactoriza, una porción vertical a la vez."
        ),
        prompt: t("Faz o cálculo de proração com TDD", "Build the proration math with TDD", "Haz el cálculo de prorrateo con TDD"),
        output: t(
          "✗ prorates a mid-cycle upgrade      vermelho, pelo motivo certo\n✓ prorates a mid-cycle upgrade      verde, o mínimo\n↺ extrai daysLeft()                 refatora, ainda verde",
          "✗ prorates a mid-cycle upgrade      red, for the right reason\n✓ prorates a mid-cycle upgrade      green, the minimum\n↺ extract daysLeft()                refactor, still green",
          "✗ prorates a mid-cycle upgrade      rojo, por la razón correcta\n✓ prorates a mid-cycle upgrade      verde, lo mínimo\n↺ extrae daysLeft()                 refactoriza, sigue verde"
        ),
      },
      {
        name: "investigate",
        userInvoked: false,
        description: t(
          "Bug difícil e regressão de performance, em seis fases com trava entre elas: reproduzir, isolar, minimizar, explicar, corrigir, travar.",
          "Hard bugs and performance regressions, in six phases with a gate between each: reproduce, isolate, minimize, explain, fix, lock.",
          "Bugs difíciles y regresiones de rendimiento, en seis fases con un control entre ellas: reproducir, aislar, minimizar, explicar, corregir, bloquear."
        ),
        prompt: t(
          "O webhook de pagamento às vezes processa duas vezes",
          "The payment webhook sometimes runs twice",
          "El webhook de pago a veces se procesa dos veces"
        ),
        output: t(
          "Fase 1  Reproduzido: 2 entregas com 40ms de intervalo\nFase 3  Mínimo: sem lock na chave de idempotência\nTrava   teste vermelho antes do fix, verde depois",
          "Phase 1  Reproduced: 2 deliveries 40ms apart\nPhase 3  Minimal: no lock on the idempotency key\nGate     a red test before the fix, green after",
          "Fase 1  Reproducido: 2 entregas con 40ms de diferencia\nFase 3  Mínimo: sin lock en la clave de idempotencia\nControl  test en rojo antes del fix, verde después"
        ),
      },
      {
        name: "review",
        userInvoked: false,
        description: t(
          "O diff em dois eixos que não se contaminam, padrão e spec, em subagentes paralelos.",
          "The diff on two axes that do not contaminate each other, standards and spec, in parallel subagents.",
          "El diff en dos ejes que no se contaminan, estándar y spec, en subagentes paralelos."
        ),
        prompt: t("Revisa o diff antes do PR", "Review the diff before the PR", "Revisa el diff antes del PR"),
        output: t(
          "Padrão  2 achados   catch genérico em billing.ts:88\nSpec    1 achado    o reembolso parcial da issue não foi feito",
          "Standards  2 findings   bare catch in billing.ts:88\nSpec       1 finding    the partial refund in the issue is missing",
          "Estándar  2 hallazgos   catch genérico en billing.ts:88\nSpec      1 hallazgo    falta el reembolso parcial del issue"
        ),
      },
      {
        name: "engineer",
        userInvoked: true,
        description: t(
          "Auditoria em todas as camadas, segurança primeiro, a partir de um mínimo inegociável de dez itens, com o fix específico em cada achado.",
          "An audit across every layer, security first, starting from a non-negotiable baseline of ten items, with the specific fix on every finding.",
          "Auditoría en todas las capas, seguridad primero, a partir de un mínimo innegociable de diez puntos, con el fix específico en cada hallazgo."
        ),
        prompt: t("/engineer o módulo de repasse", "/engineer the payouts module", "/engineer el módulo de repasses"),
        output: t(
          "[CRÍTICO] query sem limite em payouts.ts:41\n[ALTO]    retry sem backoff no gateway\nVeredito  corrige antes",
          "[CRITICAL] unbounded query in payouts.ts:41\n[HIGH]     retry without backoff on the gateway\nVerdict    fix first",
          "[CRÍTICO] query sin límite en payouts.ts:41\n[ALTO]    retry sin backoff en el gateway\nVeredicto corrige antes"
        ),
      },
      {
        name: "qa",
        userInvoked: true,
        description: t(
          "Cinco checks obrigatórios, fluxos de verdade de ponta a ponta, edge cases, e o que deveria estar testado e não está.",
          "Five required checks, real end-to-end flows, edge cases, and what should be tested and isn't.",
          "Cinco checks obligatorios, flujos reales de punta a punta, casos límite, y lo que debería estar testeado y no lo está."
        ),
        prompt: t("/qa o fluxo de checkout", "/qa the checkout flow", "/qa el flujo de checkout"),
        output: t(
          "✓ build, tipos, lint, testes, fluxo feliz\n✗ cupom expirado no meio do checkout: 500\nGap: nenhum teste cobre troca de moeda",
          "✓ build, types, lint, tests, happy path\n✗ coupon expiring mid-checkout: 500\nGap: no test covers currency changes",
          "✓ build, tipos, lint, tests, flujo feliz\n✗ cupón vencido en medio del checkout: 500\nGap: ningún test cubre cambio de moneda"
        ),
      },
      {
        name: "security",
        userInvoked: true,
        description: t(
          "Auditoria em três níveis, e o terceiro encadeia achados médios até virarem críticos.",
          "An audit in three levels, and the third chains medium findings until they become critical.",
          "Auditoría en tres niveles, y el tercero encadena hallazgos medios hasta volverlos críticos."
        ),
        prompt: t("/security antes de abrir a API pública", "/security before opening the public API", "/security antes de abrir la API pública"),
        output: t(
          "Cadeia: ID sequencial + rota sem dono checado + resposta com e-mail\n        = qualquer pessoa lista todos os clientes [CRÍTICO]",
          "Chain: sequential IDs + no ownership check + email in the response\n       = anyone can list every customer [CRITICAL]",
          "Cadena: ID secuencial + ruta sin chequeo de dueño + email en la respuesta\n        = cualquiera lista todos los clientes [CRÍTICO]"
        ),
      },
      {
        name: "deploy",
        userInvoked: true,
        description: t(
          "Trava de segurança, reprodutibilidade a partir de um clone limpo, e os checks de cada modelo de distribuição.",
          "A security gate, reproducibility from a clean clone, and the checks for each way of shipping.",
          "Un control de seguridad, reproducibilidad desde un clon limpio, y los checks de cada modelo de distribución."
        ),
        prompt: t("/deploy a primeira versão em produção", "/deploy the first production release", "/deploy la primera versión en producción"),
        output: t(
          "✓ clone limpo builda e sobe\n✗ .env.example sem STRIPE_WEBHOOK_SECRET\n✓ migrations reversíveis, healthcheck real",
          "✓ a clean clone builds and boots\n✗ .env.example is missing STRIPE_WEBHOOK_SECRET\n✓ reversible migrations, a real health check",
          "✓ un clon limpio compila y arranca\n✗ a .env.example le falta STRIPE_WEBHOOK_SECRET\n✓ migraciones reversibles, healthcheck real"
        ),
      },
      {
        name: "ask",
        userInvoked: true,
        description: t(
          "O roteador sobre todas as outras. Descreva a situação e ele diz qual skill resolve, e por quê.",
          "The router over all the others. Describe the situation and it tells you which skill solves it, and why.",
          "El enrutador sobre todas las demás. Describe la situación y te dice qué skill la resuelve, y por qué."
        ),
        prompt: t(
          "/ask o card quebra com nome grande e não sei por onde começar",
          "/ask the card breaks with a long name and I don't know where to start",
          "/ask la tarjeta se rompe con un nombre largo y no sé por dónde empezar"
        ),
        output: t(
          "/break: renderiza o card com o pior conteúdo numa página só\ne diz qual skill é dona de cada quebra.",
          "/break: renders the card with the worst content on one page\nand names the skill that owns each break.",
          "/break: renderiza la tarjeta con el peor contenido en una página\ny dice qué skill es dueña de cada rotura."
        ),
      },
    ],
  },
]

export const COPY = {
  intro: t(
    "Skills de agente que eu uso todo dia no Claude Code. Metade é interface, metade é engenharia, cada uma com o número exato e o critério de pronto que um prompt de memória não traz.",
    "Agent skills I use every day in Claude Code. Half interface, half engineering, each with the exact values and the definition of done that a prompt from memory never has.",
    "Skills de agente que uso todos los días en Claude Code. Mitad interfaz, mitad ingeniería, cada una con el valor exacto y el criterio de terminado que un prompt de memoria no trae."
  ),
  install: "/plugin marketplace add matheuscarddoso/skills",
  installTitle: t("Instalação", "Installation", "Instalación"),
  installP1: t(
    "Duas portas. O plugin instala o conjunto como pacote gerenciado que atualiza quando eu publico. O clone coloca os arquivos onde você pode editar. Escolha uma: instalar as duas te deixa com cada skill duas vezes.",
    "Two doors. The plugin installs the set as a managed bundle that updates when I ship. The clone puts the files where you can edit them. Pick one: installing both leaves you with every skill twice.",
    "Dos puertas. El plugin instala el conjunto como paquete gestionado que se actualiza cuando publico. El clon pone los archivos donde puedes editarlos. Elige una: instalar las dos te deja con cada skill dos veces."
  ),
  /** Split around the `/ask` chip. */
  installP2: {
    PT: ["Depois, ", " e uma frase descrevendo sua situação. Ele decide qual skill resolve e chama."],
    EN: ["Then ", " and one sentence describing your situation. It decides which skill fits and calls it."],
    ES: ["Después, ", " y una frase describiendo tu situación. Decide qué skill resuelve y la llama."],
  } as Record<Language, [string, string]>,
  /** Split around the three chips. */
  adoptThree: {
    PT: ["Se você só for adotar três, adote ", ", ", " e ", ". Uma evita construir errado, a outra evita entregar errado, e a terceira evita entregar feio."],
    EN: ["If you only adopt three, adopt ", ", ", " and ", ". One stops you building the wrong thing, one stops you shipping it wrong, and the third stops you shipping it ugly."],
    ES: ["Si solo vas a adoptar tres, adopta ", ", ", " y ", ". Una evita construir mal, otra evita entregar mal, y la tercera evita entregar feo."],
  } as Record<Language, [string, string, string, string]>,
  github: "https://github.com/matheuscarddoso/skills",
  course: "https://craft.ocardoso.com",
  copy: t("Copiar", "Copy", "Copiar"),
  copied: t("Copiado", "Copied", "Copiado"),
  youCall: t("você chama", "you call it", "la llamas tú"),
  agentCalls: t("o agente chama", "the agent calls it", "la llama el agente"),
  before: t("Antes", "Before", "Antes"),
  after: t("Depois", "After", "Después"),
  example: t("Exemplo", "Example", "Ejemplo"),
  back: t("Voltar", "Back", "Volver"),
  moreTitle: t("Mais", "More", "Más"),
  courseIntro: t(
    "Cada regra destas skills é uma aula, com demo e exercício, no",
    "Every rule in these skills is a lesson, with a demo and an exercise, in",
    "Cada regla de estas skills es una clase, con demo y ejercicio, en"
  ),
  more: t(
    "Tudo isso, com as referências de cada skill e o orçamento de tokens, está em",
    "All of it, with each skill's references and the token budget, is at",
    "Todo esto, con las referencias de cada skill y el presupuesto de tokens, está en"
  ),
  credits: t(
    "A suíte de interface parte das skills de Jakub Krehel e dos princípios de Emil Kowalski, ambos sob licença MIT.",
    "The interface suite builds on Jakub Krehel's skills and Emil Kowalski's principles, both MIT licensed.",
    "La suite de interfaz parte de las skills de Jakub Krehel y de los principios de Emil Kowalski, ambos con licencia MIT."
  ),
}
