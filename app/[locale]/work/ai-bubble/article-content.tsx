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

const translations = {
  PT: {
    title: "A IA está perto de quebrar. Eis o motivo.",
    intro: <>Tenho 23 anos, estou na área de tecnologia há cinco, sou formado em Ciência da Computação e fiz meu TCC justamente sobre IA generativa. Será que sou só eu, ou essa bolha está ficando cada vez mais inflada? Essas empresas continuam queimando caminhões de dinheiro todo mês — e, de repente, o tom dos executivos mudou.</>,

    tone: "O tom mudou",
    toneP1: "Agora eles empurram IPOs com valuations maiores do que qualquer coisa já vista, e ao mesmo tempo gente como Sam Altman pede ajuda do governo para sustentar financeiramente as próprias empresas. Isso é comportamento clássico de bolha no auge — exatamente o tipo de coisa que se vê pouco antes de estourar. Todo mundo correndo atrás do próximo investidor disposto a ficar com o abacaxi antes que a música pare.",
    toneP2: "Mas por que agora? Houve uma série de mudanças recentes que expõem a fragilidade estrutural dessa bolha. Vale dar um passo atrás.",

    agi: "Não temos AGI",
    agiP1: "Sei que isso incomoda quem está convicto de que a AGI está logo ali. Mas não temos AGI. Surgiram loops de agentes bem elaborados e integrações de ferramentas boas, sim. No fundo, porém, o estado atual da IA ainda é um papagaio probabilístico prevendo a palavra mais provável a partir de dados de treinamento passados. Um modelo assim não é capaz de raciocínio ou lógica de verdade.",
    agiP2: "E por conta dessa natureza derivativa, a IA não é capaz de inovações originais que aumentem a produtividade econômica de forma fundamental. Ela não vai inventar o motor de dobra tão cedo. O que a tecnologia atual consegue fazer, de forma plausível, é substituir trabalho cognitivo humano repetitivo.",

    debt: "A conta da dívida",
    debtP1: "Minha convicção é que o boom da IA é uma aposta gigantesca e altamente alavancada em que a IA vai conseguir substituir esse trabalho humano de forma lucrativa. Por que a substituição de mão de obra é o uso mais lógico? Pelos números.",
    debtP2: "Entre três e quatro trilhões de dólares já foram investidos na indústria americana de IA. Parte vem de capital de investidores, mas a maior parte está na forma de dívida corporativa. E dívida precisa ser paga.",
    debtP3: "A uma taxa normal para títulos corporativos, entre 3% e 4%, dois a três trilhões em dívida geram cerca de cem bilhões de dólares em juros por ano. A indústria precisa gerar pelo menos isso em lucro só para empatar.",
    debtP4: "Suponha uma margem de 10% — que eles não têm, mas suponha. Para gerar esse lucro, a indústria precisaria substituir uma fatia da economia americana equivalente a mais ou menos um trilhão de dólares por ano. E a única fatia grande o suficiente é o mercado de trabalho de colarinho branco, avaliado em dez trilhões.",
    debtP5: "Um trilhão em empregos de colarinho branco é o mesmo que dizer dez milhões de trabalhadores americanos por ano. É esse plano que explica por que Sam Altman e Dario Amodei vêm profetizando há anos um apocalipse do emprego.",

    china: "Os modelos abertos chineses",
    chinaP1: "Só que o plano não está saindo como esperado. Modelos de fronteira americanos, como ChatGPT e Claude, são fechados: as empresas controlam algoritmos, dados e infraestrutura, e vendem acesso por assinatura. O problema é que treinar e operar esses modelos é absurdamente caro. A operação inteira é deficitária — elas perdem dinheiro em cada chamada de API.",
    chinaP2: "Isso, sozinho, não seria novidade. Empresas de tecnologia há muito subsidiam serviço abaixo do custo, ganham participação, viram monopólio e só então aumentam preços. O problema é que dessa vez os concorrentes não morreram.",
    chinaP3: "Com uma fração dos recursos computacionais dos Estados Unidos, empresas chinesas criaram modelos de código aberto competitivos — pela maioria das métricas um pouco atrás, empatados ou até à frente dos melhores modelos americanos. Sendo abertos, podem ser baixados de graça e executados na infraestrutura do próprio cliente, por uma fração minúscula do custo.",
    chinaP4: "Venho usando o Kimi3, da Moonshot, há alguns dias, e o desempenho é comparável ao da versão mais limitada do Claude Fable 5 para os meus casos de uso. E não sou o único a perceber: segundo a OpenRouter, modelos chineses de código aberto já representam mais de 60% de todos os tokens usados por empresas americanas.",
    chinaP5: "Ou seja: a ideia de criar um monopólio, aumentar os preços e faturar alto já não está na mesa.",

    local: "E os modelos locais",
    localP1: "Dá para pegar um modelo de fronteira aberto e, com quantização e destilação, comprimir esse modelo enorme em um modelo local muito menor. Em vez de um data center gigantesco, ele roda no seu computador de casa, num servidor doméstico ou até num notebook decente.",
    localP2: "São duas vantagens. Rodando localmente, você não paga assinatura nenhuma para as grandes empresas de tecnologia. E funcionam totalmente offline, o que garante privacidade sobre os próprios dados.",
    localP3: "Nos últimos meses esses modelos ficaram surpreendentemente capazes. Um bom modelo local, como o Qwen 3.5, é mais ou menos equivalente ao Claude Sonnet 4 na maioria das tarefas. À medida que tarefas básicas passam a ser resolvidas assim, a disposição de pagar por IA premium cai drasticamente.",

    productivity: "A produtividade não chegou",
    productivityP1: "E aqui está o motivo mais importante: os ganhos de produtividade estão acontecendo muito mais devagar do que o esperado. Não estamos vendo nem de longe dez milhões de trabalhadores de colarinho branco sendo demitidos por IA este ano.",
    productivityP2a: "Já escrevi sobre minha experiência com IA agêntica como engenheiro de software",
    productivityP2b: " e sobre o trabalho que dá extrair um resultado de qualidade: gerenciar contexto, contornar lacunas nos dados de treinamento, criar fluxos consistentes, evitar alucinações. Esses desafios são reais. Exige muito trabalho e muita inteligência humana usar IA de forma produtiva.",
    productivityP3: "E isso não acontece só na engenharia. Atendimento ao cliente foi por muito tempo considerado alvo fácil para automação. Um estudo recente que li entrevistou milhares de empresas e apontou que mais de 70% dos agentes de atendimento que entraram em produção tiveram que ser desativados ou revertidos por erros e falhas de comunicação. O mesmo estudo mostrou empresas que se precipitaram, demitiram os atendentes humanos e tiveram que contratá-los de volta às pressas.",
    productivityP4: "O resumo é que estamos longe de substituir dez milhões de trabalhadores por ano. As estimativas mais otimistas apontam para menos de cem mil — o que explica por que tanto Altman quanto Amodei vêm recuando das profecias de apocalipse do emprego.",

    closing: "O que eu faria",
    closingP1: "A indústria americana de IA pegou emprestado e gastou somas enormes partindo da premissa de que a IA vai substituir trabalho cognitivo em escala e gerar lucros imensos. Não me entenda mal: acredito que a IA vai ter um efeito transformador na economia no longo prazo, do mesmo jeito que as ferrovias ou a internet tiveram. Mas, como essas tecnologias do passado, ela ainda não é produtiva ou confiável o suficiente para fazer isso hoje. E essas empresas precisam gerar esses lucros agora, para pagar a montanha de dívida. A conta não fecha.",
    closingP2: "Por isso acredito que a bolha da IA, assim como as das ferrovias e da internet, vai estourar — e provavelmente em breve. Fica meu único conselho: essas empresas vão ficar desesperadas para levantar dinheiro e manter o show rodando, e espero que digam ou façam praticamente qualquer coisa para isso. Uma das formas será por IPOs extremamente supervalorizados, na esperança de que o investidor de varejo entre de cabeça e compre o sonho. Não seja esse investidor. Quando a música parar, quem estava no topo já terá vendido tudo — e alguém vai ficar com o abacaxi na mão. Não deixe que seja você.",
    outro: "É isso que eu tinha a dizer. Se quiser continuar a conversa, me acha no",
  },

  EN: {
    title: "AI is close to breaking. Here's why.",
    intro: <>I&apos;m 23, five years into tech, with a computer science degree and a thesis on generative AI. Is it just me, or is this bubble getting more inflated by the day? These companies keep burning truckloads of money every month — and all of a sudden, the tone from the executives has changed.</>,

    tone: "The tone changed",
    toneP1: "They're now pushing IPOs at valuations larger than anything on record, and at the same time people like Sam Altman are asking the government for help propping up their own companies. That's textbook late-stage bubble behaviour — exactly the sort of thing you see shortly before one bursts. Everyone racing to find the next investor willing to hold the bag before the music stops.",
    toneP2: "But why now? A series of recent shifts have exposed the structural fragility of this bubble. It's worth stepping back.",

    agi: "We don't have AGI",
    agiP1: "I know this bothers anyone convinced AGI is right around the corner. But we don't have AGI. Yes, some well-built agent loops and good tool integrations have shown up. Underneath, though, the current state of AI is still a probabilistic parrot predicting the most likely next word from past training data. A model like that isn't capable of real reasoning or logic.",
    agiP2: "And because of that derivative nature, AI isn't capable of the original innovation that would fundamentally raise economic productivity. It isn't inventing the warp drive any time soon. What today's technology can plausibly do is replace repetitive human cognitive work.",

    debt: "The debt math",
    debtP1: "My conviction is that the AI boom is a giant, heavily leveraged bet that AI will manage to replace that human work profitably. Why is labour replacement the most logical use? The numbers.",
    debtP2: "Somewhere between three and four trillion dollars has already gone into the American AI industry. Some of it is investor capital, but most of it is corporate debt. And debt has to be paid.",
    debtP3: "At a normal corporate bond rate, somewhere between 3% and 4%, two to three trillion in debt generates roughly a hundred billion dollars in interest every year. The industry has to produce at least that much profit just to break even.",
    debtP4: "Now assume a healthy 10% margin — which they don't have, but assume it. To produce that profit, the industry would have to displace a slice of the American economy worth roughly a trillion dollars a year. And the only slice big enough to absorb that is the white-collar labour market, valued at ten trillion.",
    debtP5: "A trillion dollars of white-collar jobs is another way of saying ten million American workers a year. That plan is what explains why Sam Altman and Dario Amodei have spent years prophesying a jobs apocalypse.",

    china: "The Chinese open models",
    chinaP1: "Except the plan isn't going as expected. American frontier models like ChatGPT and Claude are closed: the companies control the algorithms, the data and the infrastructure, and sell access by subscription. The problem is that training and running those models is absurdly expensive. The whole operation runs at a loss — they lose money on every API call.",
    chinaP2: "On its own that wouldn't be news. Tech companies have long subsidised a service below cost, taken share, become a monopoly, and only then raised prices. The problem is that this time the competitors didn't die.",
    chinaP3: "With a fraction of the compute available in the United States, Chinese companies built competitive open-source models — by most metrics slightly behind, level with, or even slightly ahead of the best American frontier models. Being open, they can be downloaded for free and run on the customer's own infrastructure, at a tiny fraction of the cost.",
    chinaP4: "I've been using Moonshot's Kimi3 for a few days, and for my use cases the performance is comparable to the more limited tier of Claude Fable 5. I'm not the only one noticing: according to OpenRouter, Chinese open-source models already account for more than 60% of all tokens used by American companies.",
    chinaP5: "So the idea that American AI companies could build a monopoly, raise prices and cash in — that idea is off the table.",

    local: "And local models",
    localP1: "You can take an open frontier model and, with quantisation and distillation, compress that enormous thing into a far smaller local one. Instead of a giant data centre, it runs on your home computer, a home server, or even a decent laptop.",
    localP2: "There are two advantages. Running locally, you pay no subscription to any big tech company. And they work fully offline, which guarantees privacy over your own data.",
    localP3: "Over the past few months these models have become surprisingly capable. A good local model like Qwen 3.5 is roughly equivalent to Claude Sonnet 4 on most tasks. As basic work becomes easy to solve that way, willingness to pay for premium AI drops sharply.",

    productivity: "The productivity never arrived",
    productivityP1: "And here is the most important reason: the productivity gains are arriving far more slowly than expected. We are nowhere near ten million white-collar workers being laid off by AI this year.",
    productivityP2a: "I've written about my own experience with agentic AI as a software engineer",
    productivityP2b: " and about how much work it takes to get a quality result: managing context, working around gaps in the training data, building consistent workflows, avoiding hallucinations. Those challenges are real. Using AI productively takes a lot of effort and a lot of human intelligence.",
    productivityP3: "And this isn't limited to engineering. Customer support was long considered an easy target for automation. A recent study I read surveyed thousands of companies and found that more than 70% of support agents that reached production had to be switched off or rolled back because of errors and miscommunication. The same study showed companies that jumped the gun, laid off their human agents, and had to hire them back in a hurry.",
    productivityP4: "The summary is that we are far from replacing ten million workers a year. The most optimistic estimates point to fewer than a hundred thousand — which explains why both Altman and Amodei have been walking back the jobs-apocalypse prophecies.",

    closing: "What I'd do",
    closingP1: "The American AI industry borrowed and spent enormous sums on the premise that AI will replace cognitive work at scale and generate immense profits. Don't get me wrong: I do believe AI will have a transformative effect on the economy over the long run, the same way railways or the internet did. But like those earlier technologies, it simply isn't productive or reliable enough to do that today. And these companies need those profits now, to service a mountain of debt. The math doesn't work.",
    closingP2: "That's why I believe the AI bubble, like the railway and internet bubbles before it, is going to burst — and probably soon. So here's my only advice: these companies are going to get desperate to raise money and keep the show running, and I expect them to say or do almost anything to keep it going. One of those ways will be wildly overvalued IPOs, hoping retail investors pile in and buy the dream. Don't be that investor. When the music stops, the people at the top will already have sold — and someone is going to be left holding the bag. Don't let it be you.",
    outro: "That's what I had to say. If you'd like to keep the conversation going, find me on",
  },

  ES: {
    title: "La IA está cerca de quebrar. Este es el motivo.",
    intro: <>Tengo 23 años, llevo cinco en tecnología, soy graduado en Ciencias de la Computación e hice mi tesis justamente sobre IA generativa. ¿Seré solo yo, o esta burbuja está cada vez más inflada? Estas empresas siguen quemando camiones de dinero todos los meses — y, de repente, el tono de los ejecutivos cambió.</>,

    tone: "El tono cambió",
    toneP1: "Ahora empujan IPOs con valuaciones mayores que cualquier cosa vista antes, y al mismo tiempo gente como Sam Altman pide ayuda al gobierno para sostener financieramente sus propias empresas. Eso es comportamiento clásico de burbuja en su punto máximo — exactamente el tipo de cosa que se ve poco antes de que estalle. Todos corriendo detrás del próximo inversor dispuesto a quedarse con el muerto antes de que pare la música.",
    toneP2: "¿Pero por qué ahora? Hubo una serie de cambios recientes que exponen la fragilidad estructural de esta burbuja. Vale la pena dar un paso atrás.",

    agi: "No tenemos AGI",
    agiP1: "Sé que esto molesta a quien está convencido de que la AGI está a la vuelta de la esquina. Pero no tenemos AGI. Aparecieron loops de agentes bien elaborados e integraciones de herramientas buenas, sí. En el fondo, sin embargo, el estado actual de la IA sigue siendo un loro probabilístico prediciendo la palabra más probable a partir de datos de entrenamiento pasados. Un modelo así no es capaz de razonamiento ni lógica de verdad.",
    agiP2: "Y por esa naturaleza derivativa, la IA no es capaz de innovaciones originales que aumenten la productividad económica de forma fundamental. No va a inventar el motor de curvatura pronto. Lo que la tecnología actual puede hacer, de forma plausible, es sustituir trabajo cognitivo humano repetitivo.",

    debt: "La cuenta de la deuda",
    debtP1: "Mi convicción es que el boom de la IA es una apuesta gigantesca y altamente apalancada a que la IA logrará sustituir ese trabajo humano de forma rentable. ¿Por qué la sustitución de mano de obra es el uso más lógico? Por los números.",
    debtP2: "Entre tres y cuatro billones de dólares ya se invirtieron en la industria estadounidense de IA. Parte viene de capital de inversores, pero la mayor parte está en forma de deuda corporativa. Y la deuda hay que pagarla.",
    debtP3: "A una tasa normal para bonos corporativos, entre 3% y 4%, dos o tres billones en deuda generan cerca de cien mil millones de dólares en intereses por año. La industria necesita generar al menos eso en ganancias solo para empatar.",
    debtP4: "Ahora supongamos un margen del 10% — que no tienen, pero supongamos. Para generar esa ganancia, la industria tendría que sustituir una porción de la economía estadounidense equivalente a más o menos un billón de dólares por año. Y la única porción lo bastante grande es el mercado laboral de cuello blanco, valuado en diez billones.",
    debtP5: "Un billón en empleos de cuello blanco es lo mismo que decir diez millones de trabajadores estadounidenses por año. Ese plan es lo que explica por qué Sam Altman y Dario Amodei llevan años profetizando un apocalipsis del empleo.",

    china: "Los modelos abiertos chinos",
    chinaP1: "Solo que el plan no está saliendo como se esperaba. Los modelos de frontera estadounidenses, como ChatGPT y Claude, son cerrados: las empresas controlan los algoritmos, los datos y la infraestructura, y venden el acceso por suscripción. El problema es que entrenar y operar esos modelos es absurdamente caro. Toda la operación es deficitaria — pierden dinero en cada llamada de API.",
    chinaP2: "Eso solo no sería novedad. Las empresas de tecnología llevan mucho tiempo subsidiando un servicio por debajo del costo, ganando participación, volviéndose monopolio y solo entonces subiendo precios. El problema es que esta vez los competidores no murieron.",
    chinaP3: "Con una fracción de los recursos de cómputo de Estados Unidos, empresas chinas crearon modelos de código abierto competitivos — por la mayoría de las métricas un poco atrás, empatados o incluso un poco adelante de los mejores modelos estadounidenses. Al ser abiertos, pueden descargarse gratis y ejecutarse en la infraestructura del propio cliente, por una fracción mínima del costo.",
    chinaP4: "Vengo usando Kimi3, de Moonshot, hace algunos días, y el desempeño es comparable al de la versión más limitada de Claude Fable 5 para mis casos de uso. Y no soy el único en notarlo: según OpenRouter, los modelos chinos de código abierto ya representan más del 60% de todos los tokens usados por empresas estadounidenses.",
    chinaP5: "O sea: la idea de crear un monopolio, subir los precios y facturar alto ya no está sobre la mesa.",

    local: "Y los modelos locales",
    localP1: "Se puede tomar un modelo de frontera abierto y, con cuantización y destilación, comprimir ese modelo enorme en uno local mucho más pequeño. En vez de un centro de datos gigantesco, corre en tu computadora de casa, en un servidor doméstico o incluso en un portátil decente.",
    localP2: "Hay dos ventajas. Corriendo localmente, no pagas ninguna suscripción a las grandes tecnológicas. Y funcionan totalmente offline, lo que garantiza privacidad sobre los propios datos.",
    localP3: "En los últimos meses estos modelos se volvieron sorprendentemente capaces. Un buen modelo local, como Qwen 3.5, es más o menos equivalente a Claude Sonnet 4 en la mayoría de las tareas. A medida que las tareas básicas se resuelven así, la disposición a pagar por IA premium cae drásticamente.",

    productivity: "La productividad no llegó",
    productivityP1: "Y aquí está el motivo más importante: las ganancias de productividad están llegando mucho más lento de lo esperado. No estamos viendo ni de cerca diez millones de trabajadores de cuello blanco despedidos por IA este año.",
    productivityP2a: "Ya escribí sobre mi propia experiencia con IA agéntica como ingeniero de software",
    productivityP2b: " y sobre el trabajo que cuesta obtener un resultado de calidad: gestionar contexto, sortear lagunas en los datos de entrenamiento, crear flujos consistentes, evitar alucinaciones. Esos desafíos son reales. Usar IA de forma productiva exige mucho trabajo y mucha inteligencia humana.",
    productivityP3: "Y esto no pasa solo en ingeniería. La atención al cliente fue durante mucho tiempo considerada un blanco fácil para la automatización. Un estudio reciente que leí entrevistó a miles de empresas y encontró que más del 70% de los agentes de atención que llegaron a producción tuvieron que ser desactivados o revertidos por errores y fallas de comunicación. El mismo estudio mostró empresas que se precipitaron, despidieron a los agentes humanos y tuvieron que recontratarlos a las apuradas.",
    productivityP4: "El resumen es que estamos lejos de sustituir diez millones de trabajadores por año. Las estimaciones más optimistas apuntan a menos de cien mil — lo que explica por qué tanto Altman como Amodei vienen retrocediendo de las profecías de apocalipsis del empleo.",

    closing: "Lo que yo haría",
    closingP1: "La industria estadounidense de IA pidió prestado y gastó sumas enormes partiendo de la premisa de que la IA va a sustituir trabajo cognitivo a escala y generar ganancias inmensas. No me malinterpreten: creo que la IA va a tener un efecto transformador en la economía a largo plazo, del mismo modo que lo tuvieron los ferrocarriles o internet. Pero, como esas tecnologías del pasado, todavía no es lo bastante productiva ni confiable para hacerlo hoy. Y estas empresas necesitan generar esas ganancias ahora, para pagar su montaña de deuda. La cuenta no cierra.",
    closingP2: "Por eso creo que la burbuja de la IA, igual que las de los ferrocarriles e internet, va a estallar — y probablemente pronto. Va mi único consejo: estas empresas van a estar desesperadas por levantar dinero y mantener el show andando, y espero que digan o hagan prácticamente cualquier cosa para lograrlo. Una de esas formas serán IPOs enormemente sobrevaluados, esperando que los inversores minoristas entren de cabeza y compren el sueño. No seas ese inversor. Cuando pare la música, los que estaban arriba ya habrán vendido todo — y alguien se va a quedar con el muerto. No dejes que seas vos.",
    outro: "Eso es lo que tenía para decir. Si querés seguir la conversación, me encontrás en",
  },
}

const figures = {
  PT: [
    { value: "US$ 3–4 tri", note: "investidos até agora" },
    { value: "US$ 100 bi", note: "em juros por ano" },
    { value: "US$ 1 tri", note: "de receita anual necessária" },
    { value: "US$ 10 tri", note: "mercado de colarinho branco" },
  ],
  EN: [
    { value: "$3–4T", note: "invested so far" },
    { value: "$100B", note: "in interest a year" },
    { value: "$1T", note: "annual revenue needed" },
    { value: "$10T", note: "white-collar market" },
  ],
  ES: [
    { value: "US$ 3–4 bi", note: "invertidos hasta ahora" },
    { value: "US$ 100 mil mi", note: "en intereses por año" },
    { value: "US$ 1 bi", note: "de ingresos anuales necesarios" },
    { value: "US$ 10 bi", note: "mercado de cuello blanco" },
  ],
}

export function ArticleContent() {
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
              <Undo2 className="mr-0.5 size-4 text-muted-foreground transition-colors duration-200 ease-out group-hover:text-foreground" strokeWidth={1.5} />
            </Link>
            <div className="flex items-center gap-2">
              <LanguageToggle language={language} onLanguageChange={switchLocale} />
              <ThemeToggle language={language} />
              <CopyLinkButton />
            </div>
          </div>
        </header>

        <article>
          <h1 className="mb-2 w-fit scroll-mt-20 text-balance font-[550] article-heading" id="ai-bubble">
            {t.title}
          </h1>

          <ArticleByline slug="ai-bubble" language={language} />

          <p className="w-full text-pretty text-muted-foreground">{t.intro}</p>

          <Divider />

          <SectionHeading id="tone">{t.tone}</SectionHeading>
          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.toneP1}</p>
          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.toneP2}</p>

          <SectionHeading id="agi">{t.agi}</SectionHeading>
          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.agiP1}</p>
          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.agiP2}</p>

          <Divider />

          <SectionHeading id="debt">{t.debt}</SectionHeading>
          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.debtP1}</p>
          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.debtP2}</p>

          <div className="my-8 w-full overflow-hidden rounded-xl border">
            <div className="grid w-full grid-cols-1 sm:grid-cols-2">
              {figures[language].map((item, i) => (
                <div
                  key={item.note}
                  className={`flex flex-col gap-1 px-4 py-3 ${i < 3 ? "border-b" : ""} ${i % 2 === 0 ? "sm:border-r" : ""} ${i === 2 ? "sm:border-b-0" : ""}`}
                >
                  <span className="font-mono text-sm font-medium text-foreground">{item.value}</span>
                  <span className="text-sm text-muted-foreground">{item.note}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.debtP3}</p>
          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.debtP4}</p>
          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.debtP5}</p>

          <Divider />

          <SectionHeading id="china">{t.china}</SectionHeading>
          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.chinaP1}</p>
          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.chinaP2}</p>
          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.chinaP3}</p>
          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.chinaP4}</p>
          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.chinaP5}</p>

          <SectionHeading id="local">{t.local}</SectionHeading>
          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.localP1}</p>
          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.localP2}</p>
          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.localP3}</p>

          <Divider />

          <SectionHeading id="productivity">{t.productivity}</SectionHeading>
          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.productivityP1}</p>
          <p className="mb-4 w-full text-pretty text-muted-foreground">
            <Link className="article-underline" href={`/${locale}/work/saving-claude-tokens`}>
              {t.productivityP2a}
            </Link>
            {t.productivityP2b}
          </p>
          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.productivityP3}</p>
          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.productivityP4}</p>

          <Divider />

          <SectionHeading id="closing">{t.closing}</SectionHeading>
          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.closingP1}</p>
          <p className="mb-4 w-full text-pretty text-muted-foreground">{t.closingP2}</p>

          <p className="mb-6 w-full text-pretty text-muted-foreground">
            {t.outro}{" "}
            <a className="article-underline" href="https://x.com/mattcrdoso" target="_blank" rel="noopener noreferrer">X</a>.
          </p>

          <ArticleNav slug="ai-bubble" language={language} locale={locale} />
        </article>
      </main>
      {/* Language moved up beside the copy-link button; theme stays here. */}
      {/* Both toggles live in the article header, beside copy-link. */}
      <Footer language={language} showLanguageToggle={false} showThemeToggle={false} />
    </div>
  )
}
