"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Undo2, Check, LinkIcon } from "lucide-react"
import { Footer, type Language } from "@/components/footer"
import { LanguageToggle, ThemeToggle } from "@/components/toggles"
import { ArticleByline } from "@/components/article-byline"
import { ArticleNav } from "@/components/article-nav"
import { ArticleTimeline } from "@/components/article-timeline"
import { SectionDivider } from "@/components/section-divider"
import { localeToLanguage } from "@/lib/locale"
import { switchLocale } from "@/lib/switch-locale"

/** Same dotted rule the home page uses, at the spacing these essays had. */
function Divider() {
  return <SectionDivider className="my-16" />
}

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 className="mt-16 mb-2 scroll-mt-20 text-balance font-[550] article-heading" id={id}>
      {children}
    </h2>
  )
}

/**
 * Sub-points inside a section. `h3` deliberately — the gutter timeline reads
 * `h1, h2` only, so these carry the hierarchy without adding six more rows to
 * a table of contents that is meant to be glanceable.
 */
function SubHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-8 mb-2 text-balance font-medium text-foreground">{children}</h3>
}

function CopyLinkButton() {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = React.useCallback(() => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  return (
    <button
      onClick={handleCopy}
      className="group relative flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-secondary transition-[scale,background-color] duration-200 ease-out hover:bg-gray-300 active:scale-[0.96]"
      aria-label="Copy link"
    >
      <span className="relative grid size-4 place-items-center">
        <Check
          className="col-start-1 row-start-1 size-4 text-muted-foreground transition-[opacity,transform,filter] duration-300 group-hover:text-foreground"
          style={{
            transitionTimingFunction: "cubic-bezier(0.2, 0, 0, 1)",
            opacity: copied ? 1 : 0,
            transform: copied ? "scale(1)" : "scale(0.25)",
            filter: copied ? "blur(0px)" : "blur(4px)",
          }}
          strokeWidth={1.5}
        />
        <LinkIcon
          className="col-start-1 row-start-1 size-4 text-muted-foreground transition-[opacity,transform,filter] duration-300 group-hover:text-foreground"
          style={{
            transitionTimingFunction: "cubic-bezier(0.2, 0, 0, 1)",
            opacity: copied ? 0 : 1,
            transform: copied ? "scale(0.25)" : "scale(1)",
            filter: copied ? "blur(4px)" : "blur(0px)",
          }}
          strokeWidth={1.5}
        />
      </span>
    </button>
  )
}

const c = (text: string) => <code className="code-inline">{text}</code>

/**
 * The dispatch rounds for the plan in the `codePlan` listing. Node ids are code
 * identifiers, so they stay in English in all three languages — the same reason
 * the code blocks themselves aren't translated.
 */
const ROUNDS: readonly (readonly string[])[] = [
  ["search_auth", "search_utils"],
  ["read_auth", "read_utils"],
  ["analyze"],
  ["fix_a", "fix_b", "update_docs"],
  ["run_tests"],
  ["report"],
]

type Row = { label: string; desc: string }

/**
 * A short label and what it means — a description list, because that is what
 * this is. `dt`/`dd` pairs wrapped in a `div` is the structure HTML5 added
 * precisely so each pair can be styled as one row.
 */
function Rows({ items }: { items: readonly Row[] }) {
  return (
    <dl className="my-8 w-full overflow-hidden rounded-xl border">
      {items.map((item, i) => (
        <div
          key={item.label}
          className={`flex flex-col gap-1 px-4 py-3 ${i < items.length - 1 ? "border-b" : ""}`}
        >
          <dt className="text-sm font-medium text-foreground">{item.label}</dt>
          <dd className="text-sm text-pretty text-muted-foreground">{item.desc}</dd>
        </div>
      ))}
    </dl>
  )
}

/**
 * The same rows where the order carries meaning — the recovery ladder climbs,
 * and the options below it run cheapest first. An `ol` says that to anything
 * that isn't looking at the page; the printed number is `aria-hidden` so a
 * screen reader doesn't hear the position twice.
 */
function NumberedRows({ items }: { items: readonly Row[] }) {
  return (
    <ol className="my-8 w-full overflow-hidden rounded-xl border">
      {items.map((item, i) => (
        <li
          key={item.label}
          className={`flex gap-3 px-4 py-3 ${i < items.length - 1 ? "border-b" : ""}`}
        >
          <span
            aria-hidden
            className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-secondary font-mono text-[11px] text-muted-foreground tabular-nums"
          >
            {i + 1}
          </span>
          <span className="flex min-w-0 flex-col gap-1">
            <span className="text-sm font-medium text-foreground">{item.label}</span>
            <span className="text-sm text-pretty text-muted-foreground">{item.desc}</span>
          </span>
        </li>
      ))}
    </ol>
  )
}

/** One row per dispatch round, so what runs together is visible at a glance. */
function RoundsFigure({ caption }: { caption: string }) {
  return (
    <figure className="preview-card my-8 w-full p-5">
      <ol className="flex flex-col gap-2">
        {ROUNDS.map((round, index) => (
          <li key={index} className="flex flex-wrap items-center gap-2">
            <span
              aria-hidden
              className="w-4 shrink-0 font-mono text-[11px] text-muted-foreground/50 tabular-nums"
            >
              {index + 1}
            </span>
            {round.map((id) => (
              <span
                key={id}
                className="rounded-md bg-secondary px-2 py-1 font-mono text-[11px] text-muted-foreground"
              >
                {id}
              </span>
            ))}
          </li>
        ))}
      </ol>
      <figcaption className="mt-4 border-t pt-3 text-xs text-pretty text-muted-foreground">
        {caption}
      </figcaption>
    </figure>
  )
}

const translations = {
  PT: {
    title: "Loops, harness e grafos",
    intro: (
      <>
        Você já usou um agente: Claude Code, Cursor, Copilot em modo agent. Ele lê o seu pedido,
        faz uma coisa, olha o resultado e decide a próxima. Às vezes parece mágica. Às vezes ele
        tenta a mesma correção errada quatro vezes seguidas. Os dois comportamentos saem da mesma
        estrutura, e essa estrutura dá pra entender inteira sem uma linha de matemática.
      </>
    ),

    loop: "O loop: uma coisa por vez",
    loopP1: (
      <>
        Todo agente é um {c("while")}. Ele monta um contexto (o seu pedido, o que já aconteceu, a
        lista de ferramentas disponíveis), manda pro modelo, recebe de volta uma ação, executa
        essa ação, guarda o resultado no histórico e volta pro topo. Quando o modelo responde
        &ldquo;terminei&rdquo; em vez de pedir outra ação, o loop para.
      </>
    ),
    loopP2:
      "É isso. Todo agente de código que você já usou é uma variação de vinte linhas disso, e é justamente por ser tão pouco que ele funciona tão bem em tanta coisa.",
    loopP3: (
      <>
        Agora repare em duas propriedades desse código, porque tudo neste texto sai delas. A
        primeira: em cada volta existe exatamente <em>uma</em> coisa pra fazer. Não duas. O modelo
        devolve uma ação, você executa, volta pro topo. A segunda: quem escolhe essa ação é o
        modelo. Não existe nenhuma função no seu código dizendo &ldquo;agora é a vez do passo
        3&rdquo;. A decisão vem de dentro de uma inferência que você não consegue inspecionar nem
        repetir igual.
      </>
    ),
    loopP4:
      "Dessas duas propriedades saem os três problemas que você já viu na prática, mesmo sem ter nome pra eles:",
    loopProblems: [
      {
        label: "A ordem só existe na conversa",
        desc: "Você pediu “edita o arquivo, depois roda os testes”. Nada no sistema impede rodar os testes primeiro. A dependência é uma frase no contexto, não uma regra no executor. Com contexto curto ele acerta; com contexto longo, esquece.",
      },
      {
        label: "Ninguém definiu quantas tentativas",
        desc: "O teste falhou. Tenta de novo? Tenta outra abordagem? Refaz o plano? O modelo decide na hora, e não existe um número máximo escrito em lugar nenhum. É daí que vem o agente que insiste na mesma correção errada até você matar o processo.",
      },
      {
        label: "O plano é sobrescrito",
        desc: "Ele planejou A, no meio do caminho mudou pra B, e agora o plano A é uma mensagem antiga enterrada no histórico. Semanas depois, quando você quer saber qual plano gerou aquele commit estranho, não tem como responder.",
      },
    ],

    harness: "Harness: tudo que não é o modelo",
    harnessP1:
      "Harness, em inglês, é o cinto de segurança de quem faz algo arriscado. O nome cai bem. O modelo é o motor. O harness é o resto do carro: o loop, quais ferramentas você entrega pra ele, o que entra no contexto, quantas tentativas ele tem, quando desistir.",
    harnessP2:
      "A distinção importa por um motivo prático. Você não controla o modelo: ele é um serviço de terceiro que você chama por HTTP. O harness é 100% seu código. Quando um agente seu se comporta mal, a chance de o problema estar no harness é muito maior que a de estar no modelo. E quatro linhas de harness resolvem a maior parte da seção anterior:",
    harnessP3: (
      <>
        Nada aí é sofisticado, e é esse o ponto. {c("MAX_STEPS")} transforma &ldquo;loop
        infinito&rdquo; em &ldquo;loop que termina&rdquo;. Um teto de tentativas por passo
        transforma &ldquo;insiste pra sempre&rdquo; em &ldquo;insiste três vezes&rdquo;. O{" "}
        {c("slice(-HISTORY_TURNS)")} transforma &ldquo;a conversa cresce até estourar a janela de
        contexto&rdquo; em &ldquo;a conversa tem tamanho máximo&rdquo;. E {c("maxTokens")}{" "}
        transforma &ldquo;a fatura é uma surpresa no fim do mês&rdquo; em &ldquo;a fatura tem
        teto&rdquo;.
      </>
    ),
    harnessP4:
      "Se você levar uma única coisa deste texto, leve esta: quase todo agente amador não tem essas quatro linhas, e quase todo agente de produção tem. Antes de trocar de arquitetura, aperte o harness.",

    graph: "O grafo: escrever o plano antes de começar",
    graphP1:
      "O loop decide o próximo passo no meio do caminho. A alternativa é decidir todos os passos antes de começar, escrever essa decisão num formato que o código consegue ler, e depois só executar o que está escrito.",
    graphP2: (
      <>
        Esse formato é um grafo. Se a palavra assusta, troca por uma que você já usa toda semana: é
        um pipeline de CI. No GitHub Actions você escreve jobs e coloca {c("needs: build")} em um
        deles. Pronto, é um grafo: caixas, e setas dizendo &ldquo;esta só começa depois
        daquela&rdquo;. Um {c("Makefile")} é a mesma ideia. As dependências do seu{" "}
        {c("package.json")} também.
      </>
    ),
    graphP3: (
      <>
        O nome técnico é DAG, e vale traduzir os três pedaços porque cada um carrega uma garantia.{" "}
        <em>Grafo</em>: caixas ligadas por setas. <em>Dirigido</em>: as setas têm ponta, então{" "}
        {c("A → B")} é diferente de {c("B → A")}. <em>Acíclico</em>: nenhuma seta volta pra trás.
        Esse último não é detalhe de vocabulário: é a garantia estrutural de que a execução
        termina. Sem ciclo, não existe caminho que se repita pra sempre.
      </>
    ),
    graphP4: "Na prática, o plano é um array:",
    graphP5: (
      <>
        Repare no que mudou. {c("needs")} não é uma frase pedindo bom comportamento: é dado. O
        executor lê {c("needs")} e simplesmente não despacha {c("analyze")} antes de{" "}
        {c("read_auth")} e {c("read_utils")} terminarem. Não tem como &ldquo;esquecer&rdquo;: a
        dependência deixou de ser memória do modelo e virou uma condição num {c("if")}.
      </>
    ),
    graphP6:
      "E aparece um ganho que o loop não consegue ter de jeito nenhum. A cada rodada, o executor pega todos os passos cujas dependências já terminaram, não apenas um. Se dois passos não têm seta entre eles, eles rodam juntos:",
    graphP7: (
      <>
        São quatro linhas de {c("filter")} e um {c("Promise.all")}. A mesma tarefa que o loop faz em
        onze voltas em série sai em seis rodadas:
      </>
    ),
    roundsCaption:
      "Seis rodadas em vez de onze voltas. As duas buscas não têm dependência entre si, então rodam juntas. E isso não é o modelo tendo um bom dia, é o que o array diz.",

    joins: "Esperar todos, ou esperar um",
    joinsP1:
      "Quando um passo depende de dois outros, “depende” pode significar duas coisas bem diferentes. Confundir as duas é um bug caro, e o loop não tem como expressar a segunda.",
    joinsAll: (
      <>
        <em>Esperar todos.</em> {c("report")} precisa dos testes <em>e</em> da documentação. Só
        começa quando os dois terminarem. É o caso comum, e é o padrão.
      </>
    ),
    joinsAny: (
      <>
        <em>Esperar um.</em> {c("fix_a")} e {c("fix_b")} são duas correções alternativas pro mesmo
        bug. {c("run_tests")} precisa de <em>uma</em> delas. Se {c("fix_b")} funcionar,{" "}
        {c("fix_a")} deixou de importar, e a coisa certa é marcá-lo como dispensado, não ficar
        tentando de novo até gastar o orçamento de retentativas em um caminho que ninguém mais vai
        usar.
      </>
    ),
    joinsP2: (
      <>
        No loop, a segunda situação não tem como ser escrita. O modelo tenta A, falha, decide tentar
        B, e a desistência de A é uma frase no histórico. No grafo é um campo:{" "}
        {c('waitFor: "any"')}. É a diferença entre combinar uma coisa e esperar que alguém lembre
        dela.
      </>
    ),

    recovery: "Quando falha: uma escada de três degraus",
    recoveryP1:
      "O sintoma mais irritante de agente é o que gira em falso: falhou, replanejou, falhou, replanejou, e quarenta mil tokens depois está exatamente onde começou. Isso acontece porque “o que fazer quando falha” foi delegado ao modelo, que tem um viés forte para tentar outra coisa em vez de tentar de novo.",
    recoveryP2:
      "A correção é tirar essa decisão dele e transformar em uma escada com três degraus fixos:",
    recoverySteps: [
      {
        label: "Tenta de novo",
        desc: "Mesmo passo, mesma configuração. Serve pro que é transitório: rede caiu, rate limit, timeout. Barato.",
      },
      {
        label: "Ajusta o passo",
        desc: "Mesmo passo, configuração diferente: outro prompt, outro modelo, outra ferramenta. A estrutura do plano continua intacta.",
      },
      {
        label: "Refaz o plano",
        desc: "Gera um plano novo do zero. Caro, lento, e é o único degrau que consegue consertar um plano que estava errado desde o começo.",
      },
    ],
    recoveryP3: (
      <>
        E a regra que faz a escada funcionar: não pode pular degrau. O degrau 3 só depois de esgotar
        1 e 2. Isso é meia dúzia de linhas: um contador por passo, que só sobe de um em um:
      </>
    ),
    recoveryP4:
      "Não é elegante e não precisa ser. O ponto é que agora existe um lugar no código onde está escrito quantas vezes o agente pode tentar antes de escalar, e esse lugar não é um prompt.",

    version: "O plano não muda no meio",
    versionP1:
      "Um plano que pode ser editado durante a execução parece flexibilidade e é, na prática, um problema de depuração. Se o agente mudou o plano na metade e algo deu errado depois, você não sabe se a culpa foi do plano original, da mudança, ou da combinação dos dois, porque nenhum dos dois existe mais em forma inteira.",
    versionP2:
      "A convenção que resolve isso você já usa todo dia: commit. O plano tem uma versão. Durante a execução, ninguém edita. Se precisa mudar, gera a versão 2 e registra que a 1 foi abandonada e por quê. Cada linha do log de execução diz qual versão governava naquele momento.",
    versionP3:
      "O custo é real: você perde a capacidade de ajustar o plano com o que acabou de descobrir sem pagar o preço de um replanejamento inteiro. O ganho é conseguir responder “qual plano produziu isso?” semanas depois. Em tarefa exploratória, o custo é maior que o ganho. Em tarefa que mexe em produção, é o contrário.",

    cost: "Onde o grafo é pior",
    costP1:
      "Grafo não é o upgrade do loop. É outra escolha, com outras contas. Quatro situações em que ele perde, e vale conhecer as quatro antes de reescrever nada:",
    costA: "O plano depende de quem escreve o plano",
    costAP: (
      <>
        O paralelismo só existe se alguém desenhou as setas certas. Se o planejador escrever uma
        linha reta ({c("1 → 2 → 3 → 4")}), o grafo executa uma coisa por vez, igualzinho ao loop,
        só com muito mais código no caminho. E quem normalmente escreve o plano é um LLM, que erra.
        Todo o ganho de velocidade estava na estrutura, e a estrutura não é garantida.
      </>
    ),
    costB: "Erro em paralelo custa mais",
    costBP:
      "No loop, se o modelo erra na volta 4, muitas vezes ele percebe na volta 5 e corrige: desperdiçou um passo. No grafo, se o plano tem uma seta faltando, três ramos rodam ao mesmo tempo em cima da premissa errada. Você paralelizou o desperdício.",
    costC: "Tarefa exploratória não cabe num desenho",
    costCP:
      "“Investiga o outage e conserta o que estiver quebrado.” Você não consegue listar os passos antes, porque o passo 3 depende do que o passo 2 encontrar. Grafo estático não expressa isso. Loop expressa naturalmente: é literalmente o que ele faz.",
    costD: "O código é uma ordem de magnitude maior",
    costDP:
      "Um loop honesto com harness apertado cabe em algumas centenas de linhas. Um executor de grafo de verdade precisa validar o plano (tem ciclo? tem passo que nunca roda?), agendar em paralelo respeitando rate limit, persistir estado para auditoria, implementar a escada de recuperação e validar a saída de cada passo. São alguns milhares de linhas, e cada uma delas é sua para manter.",

    choose: "Como escolher",
    chooseP1: "Ordem prática, do mais barato para o mais caro:",
    chooseRows: [
      {
        label: "Loop com harness apertado",
        desc: "A resposta certa na maioria dos casos. Teto de passos, teto de tentativas por passo, janela no histórico, teto de tokens. Uma tarde de trabalho, e resolve a maior parte dos sintomas que fazem as pessoas quererem trocar de arquitetura.",
      },
      {
        label: "Loop com plano no prompt",
        desc: "O modelo escreve os passos antes e você mantém isso visível no contexto. Ajuda ele a não se perder em tarefa longa, mas continua uma coisa por vez: plano no prompt é sugestão, não regra, e não paraleliza nada.",
      },
      {
        label: "Grafo de verdade",
        desc: "Quando as três coisas forem verdade ao mesmo tempo: você conhece as dependências antes de começar, existe paralelismo real para ganhar, e alguém vai precisar auditar o que aconteceu depois. Se só duas forem verdade, provavelmente não vale o custo.",
      },
    ],
    chooseP2:
      "O ponto do meio é a armadilha mais comum. “Meu agente planeja antes de agir” soa como grafo e não é: se a execução continua pedindo uma ação por vez para o modelo, você melhorou a qualidade das decisões e não mudou nada na estrutura. Paralelismo e ordem garantida só aparecem quando o plano sai do prompt e vira dado que o executor lê.",

    takeaway: "O resumo",
    takeawayP1:
      "Loop é uma coisa por vez, escolhida pelo modelo. Grafo é várias coisas por vez, escolhidas pela estrutura. Harness é o seu código em volta dos dois, e é onde vive a maior parte da qualidade de um agente, independente de qual dos dois você escolher.",
    takeawayP2:
      "Se o seu agente está gastando demais ou girando em falso, o problema é harness, e a correção é de hoje. Se ele está lento porque faz em série coisas que não dependem uma da outra, aí sim vale olhar grafo.",
    takeawayP3: "Qualquer dúvida, me chama no",
  },

  EN: {
    title: "Loops, harnesses and graphs",
    intro: (
      <>
        You&apos;ve used an agent: Claude Code, Cursor, Copilot in agent mode. It reads your
        request, does one thing, looks at the result and decides the next one. Sometimes it feels
        like magic. Sometimes it tries the same wrong fix four times in a row. Both behaviours come
        out of the same structure, and you can understand that structure completely without a line
        of maths.
      </>
    ),

    loop: "The loop: one thing at a time",
    loopP1: (
      <>
        Every agent is a {c("while")}. It assembles a context (your request, what has happened so
        far, the list of available tools), sends it to the model, gets back one action, runs that
        action, appends the result to the history and goes back to the top. When the model answers
        &ldquo;done&rdquo; instead of asking for another action, the loop stops.
      </>
    ),
    loopP2:
      "That's it. Every coding agent you have ever used is a twenty-line variation on this, and it is precisely because it is so little that it works so well on so much.",
    loopP3: (
      <>
        Now notice two properties of that code, because everything else in this piece falls out of
        them. First: on each turn there is exactly <em>one</em> thing to do. Not two. The model
        returns one action, you run it, you go back to the top. Second: the thing choosing that
        action is the model. There is no function in your code saying &ldquo;step 3 is next&rdquo;.
        the decision comes from inside an inference you cannot inspect and cannot reproduce
        exactly.
      </>
    ),
    loopP4:
      "Those two properties produce the three problems you have already run into, even without having names for them:",
    loopProblems: [
      {
        label: "The order only exists in the conversation",
        desc: "You asked for “edit the file, then run the tests”. Nothing in the system stops it running the tests first. The dependency is a sentence in the context, not a rule in the runner. With a short context it gets it right; with a long one, it forgets.",
      },
      {
        label: "Nobody decided how many attempts",
        desc: "The test failed. Retry? Try a different approach? Replan? The model decides on the spot, and there is no maximum written down anywhere. This is where the agent that insists on the same wrong fix until you kill the process comes from.",
      },
      {
        label: "The plan gets overwritten",
        desc: "It planned A, switched to B halfway through, and plan A is now an old message buried in the history. Weeks later, when you want to know which plan produced that strange commit, there is no way to answer.",
      },
    ],

    harness: "Harness: everything that isn't the model",
    harnessP1:
      "A harness is the seatbelt for someone doing something risky. The name fits. The model is the engine. The harness is the rest of the car: the loop, which tools you hand it, what goes into the context, how many attempts it gets, when to give up.",
    harnessP2:
      "The distinction matters for a practical reason. You don't control the model: it is a third-party service you call over HTTP. The harness is entirely your code. When an agent of yours misbehaves, the odds of the problem living in the harness are far higher than the odds of it living in the model. And four lines of harness handle most of the previous section:",
    harnessP3: (
      <>
        None of that is clever, and that is the point. {c("MAX_STEPS")} turns &ldquo;infinite
        loop&rdquo; into &ldquo;loop that ends&rdquo;. A per-step attempt ceiling turns
        &ldquo;insists forever&rdquo; into &ldquo;insists three times&rdquo;. The{" "}
        {c("slice(-HISTORY_TURNS)")} turns &ldquo;the conversation grows until it blows the context
        window&rdquo; into &ldquo;the conversation has a maximum size&rdquo;. And {c("maxTokens")}{" "}
        turns &ldquo;the bill is a surprise at the end of the month&rdquo; into &ldquo;the bill has
        a ceiling&rdquo;.
      </>
    ),
    harnessP4:
      "If you take one thing from this piece, take this: almost every hobby agent is missing those four lines, and almost every production agent has them. Before you change architecture, tighten the harness.",

    graph: "The graph: writing the plan before you start",
    graphP1:
      "The loop decides the next step along the way. The alternative is to decide every step before starting, write that decision in a format your code can read, and then just run what is written.",
    graphP2: (
      <>
        That format is a graph. If the word puts you off, swap it for one you already use every
        week: it is a CI pipeline. In GitHub Actions you write jobs and put {c("needs: build")} on
        one of them. That is a graph: boxes, and arrows saying &ldquo;this one only starts after
        that one&rdquo;. A {c("Makefile")} is the same idea. So are your {c("package.json")}{" "}
        dependencies.
      </>
    ),
    graphP3: (
      <>
        The technical name is a DAG, and the three parts are worth unpacking because each one
        carries a guarantee. <em>Graph</em>: boxes joined by arrows. <em>Directed</em>: the arrows
        have a point, so {c("A → B")} is not {c("B → A")}. <em>Acyclic</em>: no arrow ever loops
        back. That last one isn&apos;t vocabulary trivia: it is the structural guarantee that
        execution terminates. With no cycle, there is no path that can repeat forever.
      </>
    ),
    graphP4: "In practice, the plan is an array:",
    graphP5: (
      <>
        Notice what changed. {c("needs")} is not a sentence asking for good behaviour: it is data.
        The runner reads {c("needs")} and simply does not dispatch {c("analyze")} before{" "}
        {c("read_auth")} and {c("read_utils")} have finished. There is nothing to
        &ldquo;forget&rdquo;: the dependency stopped being the model&apos;s memory and became a
        condition in an {c("if")}.
      </>
    ),
    graphP6:
      "And a win appears that the loop cannot have at all. On each round the runner takes every step whose dependencies are done, not just one. If two steps have no arrow between them, they run together:",
    graphP7: (
      <>
        That is four lines of {c("filter")} and one {c("Promise.all")}. The same task the loop does
        in eleven serial turns comes out in six rounds:
      </>
    ),
    roundsCaption:
      "Six rounds instead of eleven turns. The two searches have no dependency between them, so they run together. And that isn't the model having a good day, it's what the array says.",

    joins: "Wait for all, or wait for one",
    joinsP1:
      "When a step depends on two others, “depends” can mean two rather different things. Mixing them up is an expensive bug, and the loop has no way to express the second one.",
    joinsAll: (
      <>
        <em>Wait for all.</em> {c("report")} needs the tests <em>and</em> the docs. It only starts
        once both are done. This is the common case, and the default.
      </>
    ),
    joinsAny: (
      <>
        <em>Wait for one.</em> {c("fix_a")} and {c("fix_b")} are two alternative fixes for the same
        bug. {c("run_tests")} needs <em>one</em> of them. If {c("fix_b")} works, {c("fix_a")} has
        stopped mattering, and the right move is to mark it as skipped, not to keep retrying it
        until the retry budget is gone on a path nobody will use.
      </>
    ),
    joinsP2: (
      <>
        In the loop, that second situation cannot be written down. The model tries A, fails, decides
        to try B, and giving up on A is a sentence in the history. In the graph it is a field:{" "}
        {c('waitFor: "any"')}. That is the difference between agreeing something and hoping someone
        remembers it.
      </>
    ),

    recovery: "When it fails: a three-rung ladder",
    recoveryP1:
      "The most annoying agent symptom is the one that spins: failed, replanned, failed, replanned, and forty thousand tokens later it is exactly where it started. This happens because “what to do when it fails” was delegated to the model, which has a strong bias towards trying something else rather than trying again.",
    recoveryP2: "The fix is to take that decision away from it and turn it into three fixed rungs:",
    recoverySteps: [
      {
        label: "Try again",
        desc: "Same step, same configuration. This is for the transient stuff: network blip, rate limit, timeout. Cheap.",
      },
      {
        label: "Adjust the step",
        desc: "Same step, different configuration: another prompt, another model, another tool. The structure of the plan stays intact.",
      },
      {
        label: "Redo the plan",
        desc: "Generate a new plan from scratch. Expensive, slow, and the only rung that can fix a plan that was wrong from the start.",
      },
    ],
    recoveryP3: (
      <>
        And the rule that makes the ladder work: you cannot skip a rung. Rung 3 only after 1 and 2
        are exhausted. That is half a dozen lines: one counter per step, which only ever goes up by
        one:
      </>
    ),
    recoveryP4:
      "It isn't elegant and it doesn't need to be. The point is that there is now a place in your code that says how many times the agent may try before escalating, and that place is not a prompt.",

    version: "The plan doesn't change mid-flight",
    versionP1:
      "A plan that can be edited during execution looks like flexibility and is, in practice, a debugging problem. If the agent changed the plan halfway and something went wrong later, you cannot tell whether the original plan, the change, or the interaction between them is at fault, because neither one exists in one piece any more.",
    versionP2:
      "The convention that solves this is one you already use daily: a commit. The plan has a version. During execution, nobody edits it. If it has to change, you generate version 2 and record that version 1 was abandoned and why. Every line of the execution log says which version was governing at that moment.",
    versionP3:
      "The cost is real: you lose the ability to adjust the plan with what you just discovered without paying for a whole replan. The gain is being able to answer “which plan produced this?” weeks later. On an exploratory task the cost outweighs the gain. On anything that touches production, it is the other way round.",

    cost: "Where the graph is worse",
    costP1:
      "A graph is not the upgrade to a loop. It is a different choice with different arithmetic. Four situations where it loses, and all four are worth knowing before you rewrite anything:",
    costA: "The plan is only as good as whoever writes it",
    costAP: (
      <>
        The parallelism only exists if someone drew the right arrows. If the planner writes a
        straight line ({c("1 → 2 → 3 → 4")}), the graph runs one thing at a time, exactly like the
        loop, with far more code in the way. And the thing usually writing the plan is an LLM, which
        gets it wrong. The whole speed win lived in the structure, and the structure is not
        guaranteed.
      </>
    ),
    costB: "Errors in parallel cost more",
    costBP:
      "In the loop, if the model gets it wrong on turn 4 it often notices on turn 5 and corrects: one wasted step. In the graph, if the plan is missing an arrow, three branches run at once on top of the wrong premise. You parallelised the waste.",
    costC: "Exploratory work doesn't fit in a diagram",
    costCP:
      "“Investigate the outage and fix whatever is broken.” You cannot list the steps upfront, because step 3 depends on what step 2 finds. A static graph cannot express that. A loop expresses it naturally: it is literally what a loop does.",
    costD: "The code is an order of magnitude bigger",
    costDP:
      "An honest loop with a tight harness fits in a few hundred lines. A real graph runner has to validate the plan (any cycles? any step that never runs?), schedule in parallel while respecting rate limits, persist state for auditing, implement the recovery ladder and validate each step's output. That is a few thousand lines, and every one of them is yours to maintain.",

    choose: "How to choose",
    chooseP1: "Practical order, cheapest first:",
    chooseRows: [
      {
        label: "Loop with a tight harness",
        desc: "The right answer most of the time. Step ceiling, per-step attempt ceiling, a window on the history, a token ceiling. One afternoon of work, and it clears most of the symptoms that make people want to change architecture.",
      },
      {
        label: "Loop with a plan in the prompt",
        desc: "The model writes the steps first and you keep them visible in the context. It helps the model not get lost on long tasks, but it is still one thing at a time: a plan in a prompt is a suggestion, not a rule, and it parallelises nothing.",
      },
      {
        label: "An actual graph",
        desc: "When all three are true at once: you know the dependencies before starting, there is real parallelism to win, and someone will need to audit what happened afterwards. If only two are true, it probably isn't worth the cost.",
      },
    ],
    chooseP2:
      "The middle option is the most common trap. “My agent plans before it acts” sounds like a graph and isn't: if execution still asks the model for one action at a time, you improved the quality of the decisions and changed nothing structural. Parallelism and guaranteed ordering only show up once the plan leaves the prompt and becomes data the runner reads.",

    takeaway: "The short version",
    takeawayP1:
      "A loop is one thing at a time, chosen by the model. A graph is several things at a time, chosen by the structure. The harness is your code around both, and it is where most of an agent's quality lives, whichever of the two you pick.",
    takeawayP2:
      "If your agent is burning money or spinning in place, that's a harness problem and you can fix it today. If it's slow because it does unrelated things one after another, then it's worth looking at a graph.",
    takeawayP3: "As always, feel free to reach out if you have any questions on",
  },

  ES: {
    title: "Loops, harness y grafos",
    intro: (
      <>
        Ya usaste un agente: Claude Code, Cursor, Copilot en modo agent. Lee tu pedido, hace una
        cosa, mira el resultado y decide la siguiente. A veces parece magia. A veces intenta la
        misma corrección equivocada cuatro veces seguidas. Los dos comportamientos salen de la misma
        estructura, y esa estructura se entiende completa sin una línea de matemáticas.
      </>
    ),

    loop: "El loop: una cosa por vez",
    loopP1: (
      <>
        Todo agente es un {c("while")}. Arma un contexto (tu pedido, lo que ya pasó, la lista de
        herramientas disponibles), lo manda al modelo, recibe de vuelta una acción, ejecuta esa
        acción, guarda el resultado en el historial y vuelve al principio. Cuando el modelo responde
        &ldquo;terminé&rdquo; en lugar de pedir otra acción, el loop se detiene.
      </>
    ),
    loopP2:
      "Eso es todo. Todo agente de código que hayas usado es una variación de veinte líneas de esto, y es justamente por ser tan poco que funciona tan bien en tantas cosas.",
    loopP3: (
      <>
        Ahora fijate en dos propiedades de ese código, porque todo lo demás en este texto sale de
        ellas. La primera: en cada vuelta existe exactamente <em>una</em> cosa por hacer. No dos. El
        modelo devuelve una acción, la ejecutás, volvés al principio. La segunda: quien elige esa
        acción es el modelo. No hay ninguna función en tu código que diga &ldquo;ahora va el paso
        3&rdquo;. La decisión viene de dentro de una inferencia que no podés inspeccionar ni
        reproducir igual.
      </>
    ),
    loopP4:
      "De esas dos propiedades salen los tres problemas que ya viste en la práctica, incluso sin tener nombres para ellos:",
    loopProblems: [
      {
        label: "El orden solo existe en la conversación",
        desc: "Pediste “editá el archivo, después corré los tests”. Nada en el sistema impide correr los tests primero. La dependencia es una frase en el contexto, no una regla en el ejecutor. Con contexto corto acierta; con contexto largo, se olvida.",
      },
      {
        label: "Nadie definió cuántos intentos",
        desc: "El test falló. ¿Reintenta? ¿Prueba otro enfoque? ¿Replanifica? El modelo decide en el momento, y no hay un máximo escrito en ningún lado. De ahí viene el agente que insiste en la misma corrección equivocada hasta que matás el proceso.",
      },
      {
        label: "El plan se sobrescribe",
        desc: "Planificó A, a mitad de camino cambió a B, y ahora el plan A es un mensaje viejo enterrado en el historial. Semanas después, cuando querés saber qué plan generó ese commit raro, no hay forma de responder.",
      },
    ],

    harness: "Harness: todo lo que no es el modelo",
    harnessP1:
      "Harness, en inglés, es el cinturón de seguridad de quien hace algo riesgoso. El nombre cae bien. El modelo es el motor. El harness es el resto del auto: el loop, qué herramientas le entregás, qué entra en el contexto, cuántos intentos tiene, cuándo desistir.",
    harnessP2:
      "La distinción importa por un motivo práctico. No controlás el modelo: es un servicio de terceros que llamás por HTTP. El harness es 100% tu código. Cuando un agente tuyo se porta mal, la probabilidad de que el problema esté en el harness es mucho mayor que la de que esté en el modelo. Y cuatro líneas de harness resuelven la mayor parte de la sección anterior:",
    harnessP3: (
      <>
        Nada de eso es sofisticado, y ese es el punto. {c("MAX_STEPS")} convierte &ldquo;loop
        infinito&rdquo; en &ldquo;loop que termina&rdquo;. Un techo de intentos por paso convierte
        &ldquo;insiste para siempre&rdquo; en &ldquo;insiste tres veces&rdquo;. El{" "}
        {c("slice(-HISTORY_TURNS)")} convierte &ldquo;la conversación crece hasta reventar la
        ventana de contexto&rdquo; en &ldquo;la conversación tiene tamaño máximo&rdquo;. Y{" "}
        {c("maxTokens")} convierte &ldquo;la factura es una sorpresa a fin de mes&rdquo; en
        &ldquo;la factura tiene techo&rdquo;.
      </>
    ),
    harnessP4:
      "Si te llevás una sola cosa de este texto, llevate esta: a casi todo agente amateur le faltan esas cuatro líneas, y casi todo agente de producción las tiene. Antes de cambiar de arquitectura, ajustá el harness.",

    graph: "El grafo: escribir el plan antes de empezar",
    graphP1:
      "El loop decide el próximo paso en el camino. La alternativa es decidir todos los pasos antes de empezar, escribir esa decisión en un formato que el código pueda leer, y después solo ejecutar lo que está escrito.",
    graphP2: (
      <>
        Ese formato es un grafo. Si la palabra intimida, cambiala por una que ya usás toda la
        semana: es un pipeline de CI. En GitHub Actions escribís jobs y le ponés {c("needs: build")}{" "}
        a uno. Listo, es un grafo: cajas, y flechas que dicen &ldquo;esta solo empieza después de
        aquella&rdquo;. Un {c("Makefile")} es la misma idea. Las dependencias de tu{" "}
        {c("package.json")} también.
      </>
    ),
    graphP3: (
      <>
        El nombre técnico es DAG, y vale traducir las tres partes porque cada una trae una garantía.{" "}
        <em>Grafo</em>: cajas unidas por flechas. <em>Dirigido</em>: las flechas tienen punta, así
        que {c("A → B")} no es {c("B → A")}. <em>Acíclico</em>: ninguna flecha vuelve hacia atrás.
        Esa última no es trivia de vocabulario: es la garantía estructural de que la ejecución
        termina. Sin ciclo, no hay camino que pueda repetirse para siempre.
      </>
    ),
    graphP4: "En la práctica, el plan es un array:",
    graphP5: (
      <>
        Fijate en lo que cambió. {c("needs")} no es una frase pidiendo buen comportamiento: es
        dato. El ejecutor lee {c("needs")} y simplemente no despacha {c("analyze")} antes de que{" "}
        {c("read_auth")} y {c("read_utils")} hayan terminado. No hay nada que
        &ldquo;olvidar&rdquo;: la dependencia dejó de ser memoria del modelo y pasó a ser una
        condición en un {c("if")}.
      </>
    ),
    graphP6:
      "Y aparece una ventaja que el loop no puede tener de ninguna manera. En cada ronda el ejecutor toma todos los pasos cuyas dependencias ya terminaron, no solo uno. Si dos pasos no tienen flecha entre ellos, corren juntos:",
    graphP7: (
      <>
        Son cuatro líneas de {c("filter")} y un {c("Promise.all")}. La misma tarea que el loop hace
        en once vueltas en serie sale en seis rondas:
      </>
    ),
    roundsCaption:
      "Seis rondas en lugar de once vueltas. Las dos búsquedas no tienen dependencia entre sí, así que corren juntas. Y eso no es el modelo teniendo un buen día, es lo que dice el array.",

    joins: "Esperar a todos, o esperar a uno",
    joinsP1:
      "Cuando un paso depende de otros dos, “depende” puede significar dos cosas bastante distintas. Confundirlas es un bug caro, y el loop no tiene forma de expresar la segunda.",
    joinsAll: (
      <>
        <em>Esperar a todos.</em> {c("report")} necesita los tests <em>y</em> la documentación. Solo
        empieza cuando los dos terminaron. Es el caso común, y es el default.
      </>
    ),
    joinsAny: (
      <>
        <em>Esperar a uno.</em> {c("fix_a")} y {c("fix_b")} son dos correcciones alternativas para
        el mismo bug. {c("run_tests")} necesita <em>una</em> de ellas. Si {c("fix_b")} funciona,{" "}
        {c("fix_a")} dejó de importar, y lo correcto es marcarlo como descartado, no seguir
        reintentándolo hasta gastar el presupuesto de reintentos en un camino que nadie va a usar.
      </>
    ),
    joinsP2: (
      <>
        En el loop, esa segunda situación no se puede escribir. El modelo intenta A, falla, decide
        intentar B, y desistir de A es una frase en el historial. En el grafo es un campo:{" "}
        {c('waitFor: "any"')}. Es la diferencia entre acordar algo y esperar que alguien se acuerde.
      </>
    ),

    recovery: "Cuando falla: una escalera de tres peldaños",
    recoveryP1:
      "El síntoma más molesto de un agente es el que gira en falso: falló, replanificó, falló, replanificó, y cuarenta mil tokens después está exactamente donde empezó. Pasa porque “qué hacer cuando falla” se delegó al modelo, que tiene un sesgo fuerte a intentar otra cosa en lugar de intentar de nuevo.",
    recoveryP2:
      "La corrección es sacarle esa decisión y convertirla en tres peldaños fijos:",
    recoverySteps: [
      {
        label: "Intentá de nuevo",
        desc: "Mismo paso, misma configuración. Sirve para lo transitorio: se cayó la red, rate limit, timeout. Barato.",
      },
      {
        label: "Ajustá el paso",
        desc: "Mismo paso, configuración distinta: otro prompt, otro modelo, otra herramienta. La estructura del plan queda intacta.",
      },
      {
        label: "Rehacé el plan",
        desc: "Genera un plan nuevo desde cero. Caro, lento, y es el único peldaño que puede arreglar un plan que estaba mal desde el principio.",
      },
    ],
    recoveryP3: (
      <>
        Y la regla que hace funcionar la escalera: no se puede saltar un peldaño. El peldaño 3 solo
        después de agotar 1 y 2. Son media docena de líneas: un contador por paso, que solo sube de
        uno en uno:
      </>
    ),
    recoveryP4:
      "No es elegante y no necesita serlo. El punto es que ahora hay un lugar en el código donde está escrito cuántas veces puede intentar el agente antes de escalar, y ese lugar no es un prompt.",

    version: "El plan no cambia en el medio",
    versionP1:
      "Un plan que se puede editar durante la ejecución parece flexibilidad y es, en la práctica, un problema de depuración. Si el agente cambió el plan a mitad de camino y algo salió mal después, no sabés si la culpa es del plan original, del cambio, o de la combinación de los dos, porque ninguno de los dos existe más de una pieza.",
    versionP2:
      "La convención que resuelve esto ya la usás todos los días: un commit. El plan tiene una versión. Durante la ejecución, nadie la edita. Si tiene que cambiar, generás la versión 2 y registrás que la 1 fue abandonada y por qué. Cada línea del log de ejecución dice qué versión gobernaba en ese momento.",
    versionP3:
      "El costo es real: perdés la capacidad de ajustar el plan con lo que acabás de descubrir sin pagar el precio de una replanificación entera. La ganancia es poder responder “¿qué plan produjo esto?” semanas después. En tarea exploratoria el costo es mayor que la ganancia. En algo que toca producción, es al revés.",

    cost: "Dónde el grafo es peor",
    costP1:
      "El grafo no es el upgrade del loop. Es otra elección, con otras cuentas. Cuatro situaciones donde pierde, y vale conocer las cuatro antes de reescribir nada:",
    costA: "El plan vale lo que vale quien lo escribe",
    costAP: (
      <>
        El paralelismo solo existe si alguien dibujó las flechas correctas. Si el planificador
        escribe una línea recta ({c("1 → 2 → 3 → 4")}), el grafo ejecuta una cosa por vez, igual
        que el loop, con mucho más código en el camino. Y quien normalmente escribe el plan es un
        LLM, que se equivoca. Toda la ganancia de velocidad estaba en la estructura, y la estructura
        no está garantizada.
      </>
    ),
    costB: "El error en paralelo cuesta más",
    costBP:
      "En el loop, si el modelo se equivoca en la vuelta 4, muchas veces lo nota en la vuelta 5 y corrige: desperdició un paso. En el grafo, si al plan le falta una flecha, tres ramas corren al mismo tiempo sobre la premisa equivocada. Paralelizaste el desperdicio.",
    costC: "La tarea exploratoria no entra en un diagrama",
    costCP:
      "“Investigá el outage y arreglá lo que esté roto.” No podés listar los pasos antes, porque el paso 3 depende de lo que encuentre el paso 2. Un grafo estático no expresa eso. Un loop lo expresa naturalmente: es literalmente lo que hace.",
    costD: "El código es un orden de magnitud más grande",
    costDP:
      "Un loop honesto con harness ajustado entra en unos cientos de líneas. Un ejecutor de grafo de verdad tiene que validar el plan (¿hay ciclos? ¿hay pasos que nunca corren?), agendar en paralelo respetando rate limits, persistir estado para auditoría, implementar la escalera de recuperación y validar la salida de cada paso. Son unos miles de líneas, y cada una es tuya para mantener.",

    choose: "Cómo elegir",
    chooseP1: "Orden práctico, de lo más barato a lo más caro:",
    chooseRows: [
      {
        label: "Loop con harness ajustado",
        desc: "La respuesta correcta la mayoría de las veces. Techo de pasos, techo de intentos por paso, ventana en el historial, techo de tokens. Una tarde de trabajo, y resuelve la mayor parte de los síntomas que hacen que la gente quiera cambiar de arquitectura.",
      },
      {
        label: "Loop con plan en el prompt",
        desc: "El modelo escribe los pasos antes y vos los mantenés visibles en el contexto. Ayuda a que no se pierda en tareas largas, pero sigue siendo una cosa por vez: un plan en un prompt es una sugerencia, no una regla, y no paraleliza nada.",
      },
      {
        label: "Un grafo de verdad",
        desc: "Cuando las tres cosas sean verdad al mismo tiempo: conocés las dependencias antes de empezar, hay paralelismo real para ganar, y alguien va a necesitar auditar lo que pasó después. Si solo dos son verdad, probablemente no vale el costo.",
      },
    ],
    chooseP2:
      "La opción del medio es la trampa más común. “Mi agente planifica antes de actuar” suena a grafo y no lo es: si la ejecución sigue pidiéndole una acción por vez al modelo, mejoraste la calidad de las decisiones y no cambiaste nada estructural. El paralelismo y el orden garantizado solo aparecen cuando el plan sale del prompt y se vuelve dato que el ejecutor lee.",

    takeaway: "El resumen",
    takeawayP1:
      "El loop es una cosa por vez, elegida por el modelo. El grafo es varias cosas por vez, elegidas por la estructura. El harness es tu código alrededor de los dos, y es donde vive la mayor parte de la calidad de un agente, cualquiera de los dos que elijas.",
    takeawayP2:
      "Si tu agente está gastando de más o girando en falso, es un problema de harness y lo arreglás hoy. Si está lento porque hace en serie cosas que no dependen una de la otra, ahí sí vale mirar grafos.",
    takeawayP3: "Como siempre, escribime si tenés cualquier duda en",
  },
}

type ArticleContentProps = {
  codeLoop: React.ReactNode
  codeHarness: React.ReactNode
  codePlan: React.ReactNode
  codeReady: React.ReactNode
  codeLadder: React.ReactNode
}

export function ArticleContent({
  codeLoop,
  codeHarness,
  codePlan,
  codeReady,
  codeLadder,
}: ArticleContentProps) {
  const params = useParams()
  const locale = (params.locale as string) ?? "en"
  const language: Language = localeToLanguage(locale)
  const t = translations[language]

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col overflow-x-hidden">
      <ArticleTimeline language={language} />
      <main className="mx-auto w-full max-w-(--breakpoint-sm) flex-1 px-4 py-12 leading-relaxed sm:py-20">
        <header>
          <div className="mb-24 flex min-h-9 w-full select-none items-center justify-between gap-2">
            <Link
              href={`/${locale}`}
              className="group flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-secondary transition-[scale,background-color] duration-200 ease-out hover:bg-gray-300 active:scale-[0.96]"
              aria-label="Home"
            >
              <Undo2
                className="mr-0.5 size-4 text-muted-foreground transition-colors duration-200 ease-out group-hover:text-foreground"
                strokeWidth={1.5}
              />
            </Link>
            <div className="flex items-center gap-2">
              <LanguageToggle language={language} onLanguageChange={switchLocale} />
              <ThemeToggle language={language} />
              <CopyLinkButton />
            </div>
          </div>
        </header>

        <article>
          <h1
            className="mb-2 w-fit scroll-mt-20 text-balance font-[550] article-heading"
            id="agent-loops-harness-graphs"
          >
            {t.title}
          </h1>

          <ArticleByline slug="agent-loops-harness-graphs" language={language} />

          <p className="w-full text-pretty text-muted-foreground">{t.intro}</p>

          <Divider />

          <SectionHeading id="loop">{t.loop}</SectionHeading>

          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.loopP1}</p>

          {codeLoop}

          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.loopP2}</p>
          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.loopP3}</p>
          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.loopP4}</p>

          <Rows items={t.loopProblems} />

          <Divider />

          <SectionHeading id="harness">{t.harness}</SectionHeading>

          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.harnessP1}</p>
          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.harnessP2}</p>

          {codeHarness}

          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.harnessP3}</p>
          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.harnessP4}</p>

          <Divider />

          <SectionHeading id="graph">{t.graph}</SectionHeading>

          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.graphP1}</p>
          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.graphP2}</p>
          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.graphP3}</p>
          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.graphP4}</p>

          {codePlan}

          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.graphP5}</p>
          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.graphP6}</p>

          {codeReady}

          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.graphP7}</p>

          <RoundsFigure caption={t.roundsCaption} />

          <Divider />

          <SectionHeading id="joins">{t.joins}</SectionHeading>

          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.joinsP1}</p>
          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.joinsAll}</p>
          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.joinsAny}</p>
          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.joinsP2}</p>

          <Divider />

          <SectionHeading id="recovery">{t.recovery}</SectionHeading>

          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.recoveryP1}</p>
          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.recoveryP2}</p>

          <NumberedRows items={t.recoverySteps} />

          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.recoveryP3}</p>

          {codeLadder}

          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.recoveryP4}</p>

          <Divider />

          <SectionHeading id="plan-version">{t.version}</SectionHeading>

          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.versionP1}</p>
          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.versionP2}</p>
          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.versionP3}</p>

          <Divider />

          <SectionHeading id="cost">{t.cost}</SectionHeading>

          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.costP1}</p>

          <SubHeading>{t.costA}</SubHeading>
          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.costAP}</p>

          <SubHeading>{t.costB}</SubHeading>
          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.costBP}</p>

          <SubHeading>{t.costC}</SubHeading>
          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.costCP}</p>

          <SubHeading>{t.costD}</SubHeading>
          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.costDP}</p>

          <Divider />

          <SectionHeading id="choosing">{t.choose}</SectionHeading>

          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.chooseP1}</p>

          <NumberedRows items={t.chooseRows} />

          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.chooseP2}</p>

          <Divider />

          <SectionHeading id="takeaway">{t.takeaway}</SectionHeading>

          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.takeawayP1}</p>
          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.takeawayP2}</p>

          <p className="mb-6 w-full text-pretty text-muted-foreground">
            {t.takeawayP3}{" "}
            <a
              className="article-underline"
              href="https://x.com/mattcrdoso"
              target="_blank"
              rel="noopener noreferrer"
            >
              X
            </a>
            .
          </p>

          <ArticleNav slug="agent-loops-harness-graphs" language={language} locale={locale} />
        </article>
      </main>
      {/* Both toggles live in the article header, beside copy-link. */}
      <Footer language={language} showLanguageToggle={false} showThemeToggle={false} />
    </div>
  )
}
