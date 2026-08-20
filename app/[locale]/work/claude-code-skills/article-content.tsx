"use client";

import * as React from "react";
import { HomeLink } from "@/components/home-link";
import { useParams } from "next/navigation";
import { Undo2, Check } from "lucide-react";
import { Footer, type Language } from "@/components/footer";
import { LanguageToggle, ThemeToggle } from "@/components/toggles";
import { ArticleByline } from "@/components/article-byline";
import { ArticleNav } from "@/components/article-nav";
import { ArticleTimeline } from "@/components/article-timeline";
import { ArticleNextSection } from "@/components/article-next-section";
import { SectionDivider } from "@/components/section-divider";
import { localeToLanguage } from "@/lib/locale";
import { switchLocale } from "@/lib/switch-locale";

/** Same dotted rule the home page uses, at the spacing these essays had. */
function Divider() {
  return <SectionDivider className="my-16" />;
}

function SectionHeading({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <h2
      className="mt-16 mb-2 scroll-mt-20 text-balance font-medium article-heading"
      id={id}
    >
      {children}
    </h2>
  );
}

function CopyLinkButton() {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = React.useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

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
          }}
        />
      </span>
    </button>
  );
}

const c = (text: string) => <code className="code-inline">{text}</code>;

const REPO = "https://github.com/matheuscarddoso/skills";

/**
 * The eleven skills, grouped the way the repository groups them. Held here
 * rather than in `translations` because the shape repeats: eleven names that
 * never translate, each with a one-liner that does.
 */
const GROUPS: {
  id: string;
  label: Record<Language, string>;
  skills: { name: string; line: Record<Language, string> }[];
}[] = [
  {
    id: "interface",
    label: { PT: "Interface", EN: "Interface", ES: "Interfaz" },
    skills: [
      { name: "designer", line: {
        PT: "Coordena as oito abaixo e devolve um veredito só, ranqueado.",
        EN: "Coordinates the eight below and returns one ranked verdict.",
        ES: "Coordina las ocho de abajo y devuelve un veredicto único." } },
      { name: "layout", line: {
        PT: "Estrutura, agrupamento, ordem de leitura, breakpoint que vem do conteúdo.",
        EN: "Structure, grouping, reading order, breakpoints that come from content.",
        ES: "Estructura, agrupación, orden de lectura, breakpoints del contenido." } },
      { name: "typography", line: {
        PT: "Escolha de fonte, escala, medida, altura de linha, truncamento.",
        EN: "Choosing type, scale, measure, line height, truncation.",
        ES: "Elección de fuente, escala, medida, altura de línea, truncamiento." } },
      { name: "color", line: {
        PT: "Paleta em oklch, cor semântica, contraste, token, tema.",
        EN: "Palettes in oklch, semantic color, contrast, tokens, theming.",
        ES: "Paleta en oklch, color semántico, contraste, token, tema." } },
      { name: "a11y", line: {
        PT: "Semântica, foco, teclado, ARIA, formulário, área de toque.",
        EN: "Semantics, focus, keyboard, ARIA, forms, hit areas.",
        ES: "Semántica, foco, teclado, ARIA, formulario, área de toque." } },
      { name: "polish", line: {
        PT: "O acabamento: raio, sombra, superfície, ícone, movimento.",
        EN: "The finish: radius, shadow, surface, icons, motion.",
        ES: "El acabado: radio, sombra, superficie, icono, movimiento." } },
      { name: "microcopy", line: {
        PT: "Texto de interface, de rótulo de botão a erro e estado vazio.",
        EN: "Interface copy, from button labels to errors and empty states.",
        ES: "Texto de interfaz, del rótulo de botón al error y estado vacío." } },
      { name: "variant", line: {
        PT: "Três versões diferentes atrás de um seletor na página real.",
        EN: "Three different versions behind a picker in the real page.",
        ES: "Tres versiones distintas detrás de un selector en la página real." } },
      { name: "teardown", line: {
        PT: "Desmonta interface de terceiro e explica o mecanismo.",
        EN: "Takes someone else's interface apart and explains the mechanism.",
        ES: "Desarma interfaz de terceros y explica el mecanismo." } },
    ],
  },
  {
    id: "engenharia",
    label: { PT: "Engenharia", EN: "Engineering", ES: "Ingeniería" },
    skills: [
      { name: "grill", line: {
        PT: "Entrevista dura antes de construir, uma pergunta por vez.",
        EN: "A hard interview before building, one question at a time.",
        ES: "Entrevista dura antes de construir, una pregunta a la vez." } },
      { name: "kickoff", line: {
        PT: "Projeto novo: stack com justificativa, segurança no dia um.",
        EN: "New project: stack with a written reason, security on day one.",
        ES: "Proyecto nuevo: stack justificado, seguridad el día uno." } },
      { name: "tdd", line: {
        PT: "Vermelho, verde, refatora, uma fatia vertical por vez.",
        EN: "Red, green, refactor, one vertical slice at a time.",
        ES: "Rojo, verde, refactoriza, una porción vertical a la vez." } },
      { name: "investigate", line: {
        PT: "Bug difícil em seis fases, com trava entre elas.",
        EN: "Hard bugs in six phases, with a gate between each.",
        ES: "Bug difícil en seis fases, con traba entre ellas." } },
      { name: "review", line: {
        PT: "Diff em dois eixos que não se contaminam: padrão e spec.",
        EN: "The diff on two axes that never pollute each other.",
        ES: "Diff en dos ejes que no se contaminan: estándar y spec." } },
      { name: "engineer", line: {
        PT: "Auditoria em todas as camadas, a partir de um mínimo inegociável.",
        EN: "Every layer audited, from a non-negotiable minimum.",
        ES: "Auditoría en todas las capas, desde un mínimo no negociable." } },
      { name: "qa", line: {
        PT: "Cinco checks, fluxos de verdade, e o que deveria estar testado.",
        EN: "Five checks, real flows, and what should have been tested.",
        ES: "Cinco checks, flujos reales, y lo que debería estar probado." } },
      { name: "security", line: {
        PT: "Três níveis, e o terceiro encadeia achados até virarem críticos.",
        EN: "Three levels, and the third chains findings until they turn critical.",
        ES: "Tres niveles, y el tercero encadena hallazgos hasta volverlos críticos." } },
      { name: "deploy", line: {
        PT: "Trava de segurança, e reprodutibilidade a partir de clone limpo.",
        EN: "A security gate, and reproducibility from a clean clone.",
        ES: "Traba de seguridad, y reproducibilidad desde un clon limpio." } },
      { name: "ask", line: {
        PT: "Roteador sobre todas. Descreva a situação e ele diz qual resolve.",
        EN: "A router over all of them. Describe the situation, it picks one.",
        ES: "Enrutador sobre todas. Describe la situación y dice cuál resuelve." } },
    ],
  },
];

const translations = {
  PT: {
    title: "As skills que eu uso todos os dias",
    intro: (
      <>
        Dezenove skills pro Claude Code, num repositório público. Metade é
        engenharia e metade é interface. Cada uma é um modo de trabalho: coloca
        o agente num papel específico, com um trabalho específico e um critério
        de pronto que ele não pode fingir que cumpriu.
      </>
    ),

    problem: "O problema",
    problemP1: (
      <>
        Toda vez que você abre o Claude Code, você começa do zero. O agente não
        sabe qual é a sua barra. Não sabe que &quot;funciona na minha
        máquina&quot; não basta, que segurança não é a última etapa, que
        interface de template reprova.
      </>
    ),
    problemP2: (
      <>
        Então você se repete. &quot;Checa segurança em todas as camadas.&quot;
        &quot;Roda os testes antes de dizer que terminou.&quot; Você diz as
        mesmas coisas com palavras diferentes toda sessão, e o resultado depende
        de quão bem você traduziu o seu padrão naquele momento. Isso é
        variância, e variância em processo é bug.
      </>
    ),
    problemP3: (
      <>
        Uma skill é o padrão escrito uma vez. Um arquivo markdown com
        frontmatter, sem build, sem runtime, sem dependência.
      </>
    ),

    install: "Instalação",
    installP1: (
      <>
        Duas portas. O plugin instala o conjunto como pacote gerenciado que
        atualiza quando eu publico. O clone coloca os arquivos onde você pode
        editar. Escolha uma: instalar as duas te deixa com cada skill duas
        vezes.
      </>
    ),
    installP2: (
      <>
        Depois, {c("/ask")} e uma frase descrevendo sua situação. Ele decide
        qual skill resolve e chama.
      </>
    ),

    theSkills: "As dezenove",
    theSkillsP1: (
      <>
        Se você só for adotar três, adote {c("/grill")}, {c("/review")} e{" "}
        {c("/designer")}. Uma evita construir errado, a outra evita entregar
        errado, e a terceira evita entregar feio.
      </>
    ),

    anatomy: "Como uma skill é feita",
    anatomyP1: (
      <>
        A descrição não é enfeite: é ela que decide se o agente alcança a skill.
        Ela precisa dizer o que a skill é e listar os gatilhos, inclusive as
        frases que a pessoa realmente digita quando tem o problema.
      </>
    ),
    anatomyP2: (
      <>
        O resto é passo com critério de pronto verificável. &quot;Até estar
        alinhado&quot; convida o agente a declarar vitória cedo. &quot;Nada mais
        pode ser removido sem o vermelho virar verde&quot; não convida.
      </>
    ),

    whoCalls: "Quem chama",
    whoCallsP1: (
      <>
        As dezenove dividem num eixo só: quem pode chamar. Dez só respondem
        quando você digita, porque auditoria completa que o agente dispara
        sozinho sai caro e no meio do seu caminho.
      </>
    ),
    whoCallsP2: (
      <>
        As outras nove respondem ao agente também, e é onde está a diferença
        que eu mais sinto no dia. Quando alguém diz &quot;tá lento e não sei por
        quê&quot;, ele vai pro diagnóstico em fases em vez de dar palpite. E
        quando ele está escrevendo um componente, ele alcança {c("a11y")} e{" "}
        {c("polish")} enquanto escreve, em vez de eu descobrir o problema na
        revisão.
      </>
    ),

    tokens: "O custo em tokens",
    tokensP1: (
      <>
        Skill é contexto, e contexto é dinheiro e atenção. Suíte que cobra caro
        por chamada vira suíte que você deixa de usar, e a melhor skill do
        mundo, não usada, não faz nada. Então custo aqui é restrição de projeto,
        não otimização depois.
      </>
    ),
    tokensP2: (
      <>
        A descrição de toda skill instalada fica no contexto em toda sessão,
        tenha ela sido usada ou não. É o único custo que você paga sempre, e por
        isso tem o orçamento mais duro. O corpo carrega só o que toda execução
        precisa; o que só algumas alcançam vive em {c("references/")}, atrás de
        um link com a condição escrita.
      </>
    ),
    tokensP3: (
      <>
        Na prática: a suíte inteira soma 42 mil tokens e nenhuma sessão paga
        isso. {c("/security")} numa passada rápida custa mil, e a auditoria
        completa com os catorze domínios custa quase quatro mil. Você paga pelo
        que usa.
      </>
    ),
    tokensP4: (
      <>
        E o orçamento quebra o build. Dobrar a suíte de onze pra dezenove skills
        levou o sempre-carregado de 899 pra 1.550 tokens, e o teto de 1.600 não
        subiu: o que pagou a conta foi cortar as listas de gatilho pros termos
        que de fato distinguem uma skill da vizinha. A próxima entra apertando
        outra descrição. Orçamento que não quebra o build não é orçamento, é
        intenção.
      </>
    ),

    stack: "Nenhuma assume linguagem",
    stackP1: (
      <>
        O corpo de cada skill fala em capacidade, não em ferramenta: &quot;o
        analisador estático do projeto, no nível que ele mantém&quot;, e não
        &quot;PHPStan no nível 6&quot;. Isso não é diplomacia. É o que faz a
        skill continuar valendo quando você troca de stack no meio de um
        projeto.
      </>
    ),
    stackP2: (
      <>
        O específico vive em {c("references/stacks/")}, e a skill lê só o
        arquivo da stack que ela detectou. Acrescentar Python e TypeScript ao{" "}
        {c("/engineer")} subiu o custo profundo dele, e a chamada quase não
        mexeu, porque um projeto Python não paga pelos outros dois.
      </>
    ),

    more: "Mais",
    moreP: (
      <>
        O repositório é MIT e as skills são markdown que você pode ler em uma
        sentada. Três repositórios moldaram ele, e vale ler os três: as skills
        do Rodrigo deram a substância, as do Matt Pocock a arquitetura, e a
        gstack do Garry Tan o rigor de suíte. Código em
      </>
    ),
  },

  EN: {
    title: "The skills I use every day",
    intro: (
      <>
        Nineteen skills for Claude Code, in a public repository. Half of them
        are engineering, half are interface. Each one is a mode of work: it puts
        the agent in a specific role, with a specific job and a definition of
        done it cannot pretend to have met.
      </>
    ),

    problem: "The problem",
    problemP1: (
      <>
        Every time you open Claude Code, you start from zero. The agent does not
        know where your bar is. It does not know that &quot;works on my
        machine&quot; is not enough, that security is not the last step, that a
        templated interface fails.
      </>
    ),
    problemP2: (
      <>
        So you repeat yourself. &quot;Check security on every layer.&quot;
        &quot;Run the tests before telling me you are done.&quot; You say the
        same things with different words every session, and the result depends
        on how well you translated your standard in that particular moment. That
        is variance, and variance in a process is a bug.
      </>
    ),
    problemP3: (
      <>
        A skill is that standard written once. A markdown file with frontmatter.
        No build, no runtime, no dependency.
      </>
    ),

    install: "Installation",
    installP1: (
      <>
        Two doors. The plugin installs the set as a managed bundle that updates
        when I ship. The clone puts the files where you can edit them. Pick one:
        installing both leaves you with every skill twice.
      </>
    ),
    installP2: (
      <>
        Then {c("/ask")} and one sentence describing your situation. It decides
        which skill fits and calls it.
      </>
    ),

    theSkills: "The nineteen",
    theSkillsP1: (
      <>
        If you only adopt three, adopt {c("/grill")}, {c("/review")} and{" "}
        {c("/designer")}. One stops you building the wrong thing, one stops you
        shipping it, and one stops you shipping it ugly.
      </>
    ),

    anatomy: "How a skill is built",
    anatomyP1: (
      <>
        The description is not decoration: it is what decides whether the agent
        ever reaches the skill. It has to say what the skill is and list the
        triggers, including the phrases a person actually types when they have
        the problem.
      </>
    ),
    anatomyP2: (
      <>
        The rest is steps with a checkable definition of done. &quot;Until you
        are aligned&quot; invites the agent to declare victory early.
        &quot;Nothing more can be removed without the red turning green&quot;
        does not.
      </>
    ),

    whoCalls: "Who calls it",
    whoCallsP1: (
      <>
        The nineteen split on one axis: who can call them. Ten only answer when
        you type, because a full audit the agent fires on its own is expensive
        and lands in the middle of your work.
      </>
    ),
    whoCallsP2: (
      <>
        The other nine answer the agent too, and that is where I feel the
        difference most. When someone says &quot;it is slow and I do not know
        why&quot;, it takes the phased diagnosis instead of guessing. And while
        it writes a component it reaches {c("a11y")} and {c("polish")} as it
        goes, rather than me finding the problem at review.
      </>
    ),

    tokens: "What it costs in tokens",
    tokensP1: (
      <>
        A skill is context, and context is money and attention. A suite that
        charges a lot per call becomes a suite you stop using, and the best
        skill in the world, unused, does nothing. So cost here is a design
        constraint, not an optimisation for later.
      </>
    ),
    tokensP2: (
      <>
        The description of every installed skill sits in context every session,
        whether it was used or not. It is the only cost you always pay, which is
        why it has the hardest budget. The body carries only what every run
        needs; what only some runs reach lives in {c("references/")}, behind a
        link with the condition written out.
      </>
    ),
    tokensP3: (
      <>
        In practice: the whole suite adds up to 42 thousand tokens and no
        session pays that. {c("/security")} on a quick pass costs a thousand,
        and the full audit across fourteen domains costs almost four thousand.
        You pay for what you use.
      </>
    ),
    tokensP4: (
      <>
        And the budget breaks the build. Doubling the suite from eleven to
        nineteen skills took the always-loaded cost from 899 to 1,550 tokens,
        and the 1,600 ceiling did not move: what paid for it was cutting the
        trigger lists down to the terms that actually tell one skill from its
        neighbour. The next one arrives by tightening another description. A
        budget that does not break the build is not a budget, it is an
        intention.
      </>
    ),

    stack: "None of them assume a language",
    stackP1: (
      <>
        Each body speaks in capability, not tooling: &quot;the project&apos;s
        static analyser, at the level it maintains&quot;, not &quot;PHPStan at
        level 6&quot;. That is not diplomacy. It is what keeps the skill useful
        when you change stack halfway through a project.
      </>
    ),
    stackP2: (
      <>
        The specifics live in {c("references/stacks/")}, and the skill reads
        only the file for the stack it detected. Adding Python and TypeScript to{" "}
        {c("/engineer")} raised its deep cost and barely moved its call cost,
        because a Python project does not pay for the other two.
      </>
    ),

    more: "More",
    moreP: (
      <>
        The repository is MIT and the skills are markdown you can read in one
        sitting. Three repositories shaped it, and all three are worth reading:
        Rodrigo&apos;s skills gave the substance, Matt Pocock&apos;s the
        architecture, and Garry Tan&apos;s gstack the rigour of a suite. Code at
      </>
    ),
  },

  ES: {
    title: "Las skills que uso todos los días",
    intro: (
      <>
        Diecinueve skills para Claude Code, en un repositorio público. La mitad
        es ingeniería y la mitad es interfaz. Cada una es un modo de trabajo:
        pone al agente en un rol específico, con un trabajo específico y un
        criterio de listo que no puede fingir haber cumplido.
      </>
    ),

    problem: "El problema",
    problemP1: (
      <>
        Cada vez que abres Claude Code, empiezas de cero. El agente no sabe
        dónde está tu barra. No sabe que &quot;funciona en mi máquina&quot; no
        alcanza, que la seguridad no es la última etapa, que una interfaz de
        plantilla no pasa.
      </>
    ),
    problemP2: (
      <>
        Entonces te repites. &quot;Revisa seguridad en todas las capas.&quot;
        &quot;Corre los tests antes de decir que terminaste.&quot; Dices las
        mismas cosas con palabras distintas cada sesión, y el resultado depende
        de qué tan bien tradujiste tu estándar en ese momento. Eso es varianza,
        y varianza en un proceso es un bug.
      </>
    ),
    problemP3: (
      <>
        Una skill es ese estándar escrito una sola vez. Un archivo markdown con
        frontmatter. Sin build, sin runtime, sin dependencias.
      </>
    ),

    install: "Instalación",
    installP1: (
      <>
        Dos puertas. El plugin instala el conjunto como paquete gestionado que
        se actualiza cuando publico. El clon pone los archivos donde puedes
        editarlos. Elige una: instalar las dos te deja con cada skill dos veces.
      </>
    ),
    installP2: (
      <>
        Después, {c("/ask")} y una frase describiendo tu situación. Decide qué
        skill resuelve y la llama.
      </>
    ),

    theSkills: "Las diecinueve",
    theSkillsP1: (
      <>
        Si solo vas a adoptar tres, adopta {c("/grill")}, {c("/review")} y{" "}
        {c("/designer")}. Una evita construir lo equivocado, la otra evita
        entregarlo, y la tercera evita entregarlo feo.
      </>
    ),

    anatomy: "Cómo está hecha una skill",
    anatomyP1: (
      <>
        La descripción no es adorno: es lo que decide si el agente llega a la
        skill. Tiene que decir qué es la skill y listar los disparadores,
        incluidas las frases que la persona realmente escribe cuando tiene el
        problema.
      </>
    ),
    anatomyP2: (
      <>
        El resto son pasos con criterio de listo verificable. &quot;Hasta estar
        alineado&quot; invita al agente a declarar victoria temprano. &quot;Nada
        más puede quitarse sin que el rojo se vuelva verde&quot; no invita.
      </>
    ),

    whoCalls: "Quién la llama",
    whoCallsP1: (
      <>
        Las diecinueve se dividen en un solo eje: quién puede llamarlas. Diez
        solo responden cuando escribes, porque una auditoría completa que el
        agente dispara solo sale cara y cae en medio de tu trabajo.
      </>
    ),
    whoCallsP2: (
      <>
        Las otras nueve responden al agente también, y ahí está la diferencia
        que más noto. Cuando alguien dice &quot;está lento y no sé por qué&quot;,
        va al diagnóstico por fases en vez de adivinar. Y mientras escribe un
        componente alcanza {c("a11y")} y {c("polish")} sobre la marcha, en vez
        de que yo encuentre el problema en la revisión.
      </>
    ),

    tokens: "Lo que cuesta en tokens",
    tokensP1: (
      <>
        Una skill es contexto, y el contexto es dinero y atención. Una suite que
        cobra caro por llamada se vuelve una suite que dejas de usar, y la mejor
        skill del mundo, sin usar, no hace nada. Así que el costo acá es
        restricción de diseño, no optimización para después.
      </>
    ),
    tokensP2: (
      <>
        La descripción de toda skill instalada está en el contexto en cada
        sesión, se haya usado o no. Es el único costo que pagas siempre, y por
        eso tiene el presupuesto más duro. El cuerpo carga solo lo que toda
        ejecución necesita; lo que solo algunas alcanzan vive en{" "}
        {c("references/")}, detrás de un link con la condición escrita.
      </>
    ),
    tokensP3: (
      <>
        En la práctica: la suite entera suma 42 mil tokens y ninguna sesión paga
        eso. {c("/security")} en una pasada rápida cuesta mil, y la auditoría
        completa con los catorce dominios cuesta casi cuatro mil. Pagas por lo
        que usas.
      </>
    ),
    tokensP4: (
      <>
        Y el presupuesto rompe el build. Duplicar la suite de once a diecinueve
        skills llevó el siempre-cargado de 899 a 1.550 tokens, y el techo de
        1.600 no subió: lo que pagó la cuenta fue recortar las listas de
        disparadores a los términos que de verdad distinguen una skill de su
        vecina. Un presupuesto que no rompe el build no es un presupuesto, es
        una intención.
      </>
    ),

    stack: "Ninguna asume un lenguaje",
    stackP1: (
      <>
        El cuerpo de cada skill habla en capacidad, no en herramienta: &quot;el
        analizador estático del proyecto, en el nivel que mantiene&quot;, y no
        &quot;PHPStan en nivel 6&quot;. Eso no es diplomacia. Es lo que hace que
        la skill siga valiendo cuando cambias de stack a mitad de un proyecto.
      </>
    ),
    stackP2: (
      <>
        Lo específico vive en {c("references/stacks/")}, y la skill lee solo el
        archivo del stack que detectó. Agregar Python y TypeScript a{" "}
        {c("/engineer")} subió su costo profundo y casi no movió el de la
        llamada, porque un proyecto Python no paga por los otros dos.
      </>
    ),

    more: "Más",
    moreP: (
      <>
        El repositorio es MIT y las skills son markdown que puedes leer de una
        sentada. Tres repositorios lo moldearon, y vale leer los tres: las
        skills de Rodrigo dieron la sustancia, las de Matt Pocock la
        arquitectura, y la gstack de Garry Tan el rigor de suite. Código en
      </>
    ),
  },
} as const;

type ArticleContentProps = {
  codeInstall: React.ReactNode;
  codeSkill: React.ReactNode;
  codeBill: React.ReactNode;
};

export function ArticleContent({
  codeInstall,
  codeSkill,
  codeBill,
}: ArticleContentProps) {
  const params = useParams();
  const locale = (params.locale as string) ?? "en";
  const language: Language = localeToLanguage(locale);
  const t = translations[language];

  const budget = [
    {
      value: "1.550",
      label: {
        PT: "sempre carregado",
        EN: "always loaded",
        ES: "siempre cargado",
      }[language],
    },
    {
      value: "1.378",
      label: {
        PT: "chamada mais cara",
        EN: "priciest call",
        ES: "llamada más cara",
      }[language],
    },
    {
      value: "42.276",
      label: {
        PT: "tudo de uma vez",
        EN: "everything at once",
        ES: "todo de una vez",
      }[language],
    },
  ];

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col overflow-x-hidden">
      <ArticleTimeline language={language} />
      <ArticleNextSection language={language} />
      <main className="mx-auto w-full max-w-(--breakpoint-sm) flex-1 px-4 py-12 leading-relaxed sm:py-20">
        <header>
          <div className="mb-24 flex min-h-9 w-full select-none items-center justify-between gap-2">
            <HomeLink
              locale={locale}
              className="group flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-secondary transition-[scale,background-color] duration-200 ease-out hover:bg-gray-300 active:scale-[0.96]"
              aria-label="Home"
            >
              <Undo2
                className="mr-0.5 size-4 text-muted-foreground transition-colors duration-200 ease-out group-hover:text-foreground"
                strokeWidth={1.5}
              />
            </HomeLink>
            <div className="flex items-center gap-2">
              <LanguageToggle
                language={language}
                onLanguageChange={switchLocale}
              />
              <ThemeToggle language={language} />
              <CopyLinkButton />
            </div>
          </div>
        </header>

        <article>
          <h1
            className="mb-2 w-fit scroll-mt-20 text-balance font-medium article-heading"
            id="claude-code-skills"
          >
            {t.title}
          </h1>

          <ArticleByline slug="claude-code-skills" language={language} />

          <p className="w-full text-pretty text-muted-foreground">{t.intro}</p>

          <Divider />

          <SectionHeading id="problem">{t.problem}</SectionHeading>

          <p className="mb-4 w-full text-pretty text-muted-foreground">
            {t.problemP1}
          </p>
          <p className="mb-4 w-full text-pretty text-muted-foreground">
            {t.problemP2}
          </p>
          <p className="mb-4 w-full text-pretty text-muted-foreground">
            {t.problemP3}
          </p>

          <Divider />

          <SectionHeading id="install">{t.install}</SectionHeading>

          <p className="mb-4 w-full text-pretty text-muted-foreground">
            {t.installP1}
          </p>

          {codeInstall}

          <p className="mb-4 w-full text-pretty text-muted-foreground">
            {t.installP2}
          </p>

          <Divider />

          <SectionHeading id="the-skills">{t.theSkills}</SectionHeading>

          <div className="my-8 w-full overflow-hidden rounded-xl border">
            {GROUPS.map((group, gi) => (
              <div key={group.id} className={gi > 0 ? "border-t" : ""}>
                <p className="bg-secondary/40 px-4 py-2 text-xs text-muted-foreground/80">
                  {group.label[language]}
                </p>
                {group.skills.map((skill, si) => (
                  <div
                    key={skill.name}
                    className={`flex flex-col gap-0.5 px-4 py-3 sm:flex-row sm:items-baseline sm:gap-4 ${
                      si > 0 ? "border-t" : ""
                    }`}
                  >
                    <span className="font-mono text-sm font-medium text-foreground sm:w-28 sm:shrink-0">
                      /{skill.name}
                    </span>
                    <span className="text-sm text-pretty text-muted-foreground">
                      {skill.line[language]}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <p className="mb-4 w-full text-pretty text-muted-foreground">
            {t.theSkillsP1}
          </p>

          <Divider />

          <SectionHeading id="anatomy">{t.anatomy}</SectionHeading>

          <p className="mb-4 w-full text-pretty text-muted-foreground">
            {t.anatomyP1}
          </p>

          {codeSkill}

          <p className="mb-4 w-full text-pretty text-muted-foreground">
            {t.anatomyP2}
          </p>

          <Divider />

          <SectionHeading id="who-calls">{t.whoCalls}</SectionHeading>

          <p className="mb-4 w-full text-pretty text-muted-foreground">
            {t.whoCallsP1}
          </p>
          <p className="mb-4 w-full text-pretty text-muted-foreground">
            {t.whoCallsP2}
          </p>

          <Divider />

          <SectionHeading id="tokens">{t.tokens}</SectionHeading>

          <p className="mb-4 w-full text-pretty text-muted-foreground">
            {t.tokensP1}
          </p>
          <p className="mb-4 w-full text-pretty text-muted-foreground">
            {t.tokensP2}
          </p>

          <div className="my-8 w-full overflow-hidden rounded-xl border">
            <div className="grid w-full grid-cols-1 sm:grid-cols-3">
              {budget.map((item, i) => (
                <div
                  key={item.label}
                  className={`flex flex-col gap-1 px-4 py-3 ${
                    i < 2 ? "border-b sm:border-b-0 sm:border-r" : ""
                  }`}
                >
                  <span className="font-mono text-sm font-medium text-foreground">
                    {item.value} tokens
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p className="mb-4 w-full text-pretty text-muted-foreground">
            {t.tokensP3}
          </p>

          {codeBill}

          <p className="mb-4 w-full text-pretty text-muted-foreground">
            {t.tokensP4}
          </p>

          <Divider />

          <SectionHeading id="stack">{t.stack}</SectionHeading>

          <p className="mb-4 w-full text-pretty text-muted-foreground">
            {t.stackP1}
          </p>
          <p className="mb-4 w-full text-pretty text-muted-foreground">
            {t.stackP2}
          </p>

          <Divider />

          <SectionHeading id="more">{t.more}</SectionHeading>

          <p className="mb-6 w-full text-pretty text-muted-foreground">
            {t.moreP}{" "}
            <a
              href={REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="article-underline"
            >
              matheuscarddoso/skills
            </a>
            .
          </p>

          <ArticleNav
            slug="claude-code-skills"
            language={language}
            locale={locale}
          />
        </article>
      </main>
      <Footer language={language} />
    </div>
  );
}
