# Maria Eduarda Benedito · Psicóloga — Landing Page

Landing page com estética aquarela suave, andorinha como detalhe dinâmico, nuvens
e animações de scroll. Foco em **conversão** com linguagem acolhedora. Site estático,
sem build (HTML, CSS e JavaScript puro).

## Estrutura

```
index.html      → conteúdo e seções (raiz)
styles.css      → design system, cores da identidade, nuvens, animações
script.js       → loader, andorinha que serpenteia no scroll, parallax, reveals, menu
assets/
  bird.png      → andorinha recortada (loader + detalhes flutuantes)
  logo-icon.png → andorinha + rastro de pontos (seção "A andorinha")
  logo-text.png → logo só texto (cabeçalho e rodapé)
  logo-full.png → logo completa
  about.jpg     → foto da psicóloga (seção "Sobre mim")
tools/          → utilitários de dev (recorte da imagem + servidor local)
```

> Os arquivos `.ai`, PNGs soltos e a pasta `jpg/` são os fontes da identidade visual.

## ✏️ O que VOCÊ precisa atualizar antes de divulgar

Abra o `index.html` e troque os **placeholders de contato** (na seção `#contato`):

1. **WhatsApp** — procure por `wa.me/5500000000000` e coloque o número real
   no formato internacional (ex.: `5541999999999`).
2. **E-mail** — procure por `contato@mariaeduardabenedito.com.br` e troque pelo e-mail real.

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
