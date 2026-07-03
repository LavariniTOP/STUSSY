# Stussy — Loja Virtual

Projeto de e-commerce fictício desenvolvido como trabalho final do curso técnico de Front-End. Replica a estética neobrutalist/Y2K da marca Stussy.

## Tecnologias

- HTML5 + CSS3 + JavaScript vanilla (sem frameworks)
- CSS View Transitions API (navegação animada entre páginas)
- `localStorage` para persistência do carrinho

## Páginas

| Arquivo | Descrição |
|---|---|
| `index.html` | Home — hero, categorias, destaques |
| `roupas.html` | Listagem de roupas com filtros |
| `acessorios.html` | Listagem de acessórios com filtros |
| `clothes.html` | Moletom Stussy Global Apparel |
| `tshirt.html` | Camiseta Stussy World Tour |
| `pants.html` | Calça Cargo Stussy Work |
| `jacket.html` | Jaqueta Stussy Global Apparel |
| `shorts.html` | Bermuda Stussy Cargo Work |
| `accessories.html` | Boné Stussy Global Apparel Preto |
| `bone-bege.html` | Boné Stussy Classic Bege |
| `bag.html` | Shoulder Bag Stussy |
| `checkout.html` | Finalizar compra (cartão / PIX) |
| `404.html` | Página não encontrada |

## Funcionalidades

- Carrinho lateral com persistência via `localStorage`
- Badge de quantidade no ícone do carrinho
- Barra de progresso para frete grátis (acima de US$ 150)
- Feedback visual ao adicionar produto ("✓ ADICIONADO!")
- Menu hamburger responsivo (mobile)
- Filtros de ordenação nas listagens (preço, A-Z)
- Produtos relacionados nas páginas de produto
- Tooltips de medidas nos botões de tamanho
- Newsletter antes do rodapé
- Transições animadas entre páginas (View Transitions API)
- Formulário de checkout com máscaras de input
- Resumo do pedido lendo o carrinho em tempo real

## Como rodar

Abra `index.html` diretamente no Chrome ou Edge (necessário para View Transitions API).

Sem dependências externas, sem build step.

## Paleta

| Cor | Hex |
|---|---|
| Roxo | `#8F28AC` |
| Rosa | `#F2137B` |
| Ciano | `#4DEEEA` |
| Preto | `#0c080d` |
| Fundo | `#F0EFE9` |
