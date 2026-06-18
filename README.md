# Maria Eduarda Benedito · Psicóloga — Landing Page

Landing page com estética aquarela suave, andorinha como detalhe dinâmico, nuvens
e animações de scroll. Foco em **conversão** com linguagem acolhedora. Site estático,
sem build (HTML, CSS e JavaScript puro).

## Estrutura

```
index.html      → conteúdo, metadados SEO/AEO e dados estruturados (JSON-LD)
styles.css      → design system, cores da identidade, nuvens, animações
script.js       → loader, andorinha que serpenteia no scroll, parallax, reveals, menu
robots.txt      → libera indexação + aponta o sitemap
sitemap.xml     → mapa do site para os buscadores
vercel.json     → cleanUrls, headers de segurança e cache (deploy na Vercel)
assets/
  bird.png      → andorinha recortada (loader + detalhes flutuantes)
  logo-icon.png → andorinha + rastro de pontos (seção "A andorinha")
  logo-text.png → logo só texto (cabeçalho e rodapé)
  logo-full.png → logo completa
  about.jpg     → foto da psicóloga (seção "Sobre mim")
  og-cover.png  → imagem 1200x630 de compartilhamento (Open Graph/Twitter)
tools/          → utilitários de dev (recorte da imagem, gerador do OG, servidor local)
```

## Domínio e SEO/AEO

- Domínio: **https://mariaeduardabenedito.com.br** (hospedado na Vercel).
- Title, meta description, canonical, Open Graph e Twitter Card completos.
- Dados estruturados Schema.org (`ProfessionalService`, `Person` com CRP, `WebSite` e
  `FAQPage`) — favorecem rich results e motores de resposta (AEO).
- Seção de **FAQ** visível (em sincronia com o JSON-LD) e `robots.txt` + `sitemap.xml`.
- Imagens abaixo da dobra com `loading="lazy"`; fontes com `display=swap` e `preconnect`.

> Se o domínio mudar, atualize as URLs absolutas no `<head>` do `index.html`
> (canonical, og:url, og:image), no `robots.txt` e no `sitemap.xml`.

> Os arquivos `.ai`, PNGs soltos e a pasta `jpg/` são os fontes da identidade visual.

## Contato

Todo o contato é feito pelo **WhatsApp** `+55 (32) 9935-8700` (atendimento
exclusivamente online). O link `https://wa.me/553299358700` está em todos os CTAs,
no cabeçalho e no botão flutuante. Para trocar o número, faça um find-and-replace
de `553299358700` no `index.html`.

## Rodar localmente

Qualquer servidor estático serve. Por exemplo:

```bash
node tools/server.js     # http://localhost:8124
```

Ou abra o `index.html` no navegador (precisa de internet para o Google Fonts).

## Publicar

### GitHub Pages
1. **Settings → Pages**
2. **Source:** Deploy from a branch
3. **Branch:** `main` · pasta `/ (root)` → **Save**

O arquivo `.nojekyll` na raiz garante que todos os arquivos sejam servidos como estão.

### Vercel
1. **Add New… → Project** e importe este repositório
2. Framework Preset: **Other** (estático, sem build)
3. **Deploy** — a Vercel serve o `index.html` da raiz automaticamente.

## Paleta da identidade

| Cor | Hex | Uso |
|-----|-----|-----|
| Creme | `#F8EDE1` | Fundo |
| Roxo | `#80688F` / `#5D4870` | Títulos e marca |
| Azul andorinha | `#1F5F84` / `#4F80A0` | Destaques |
| Nuvem | `#D6DDE2` | Detalhes de aquarela |
| Rosa | `#F6C9C4` | Acentos delicados |

## Detalhes de experiência

- **Loader**: a andorinha cruza a tela deixando o rastro de pontos e revela o conteúdo.
- **Andorinha no scroll**: serpenteia a página passando entre as seções, planando com
  suavidade (inclusive no celular, com opacidade reduzida para não atrapalhar a leitura).
- **Nuvens** brancas e azuis flutuam com parallax suave em todas as seções.
- **Hovers delicados** nos botões e cards; navegação fluida; logo do rodapé volta ao topo.
- Respeita `prefers-reduced-motion` (acessibilidade).
