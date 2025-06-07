# Otimização da Sequência de Pallets em Operações de Dobra

Este projeto implementa algoritmos heurísticos avançados, especificamente um **Algoritmo Genético (AG)** e um **Algoritmo de Otimização por Colônia de Formigas (ACO)**, para otimizar a sequência de pallets em operações de dobra. O principal objetivo é minimizar o tempo total de produção, considerando fatores cruciais como tempos de setup, transições entre diferentes tipos de dobras e a alocação eficiente em máquinas paralelas.

A solução foi desenvolvida em **TypeScript** utilizando o runtime **Bun**, e oferece uma interface web intuitiva para visualização dos resultados.

## 🚀 Tecnologias Utilizadas

* **TypeScript:** Linguagem de programação para o desenvolvimento dos algoritmos e da aplicação.
* **Bun:** Runtime JavaScript rápido e eficiente, utilizado para a execução do projeto.
* **Serviço REST:** Para comunicação entre a interface web e a lógica de otimização.

## 💡 Como Funciona

O problema de otimização é modelado através de um conjunto de classes inter-relacionadas que representam os componentes do domínio fabril:

* **`Machine` e `BendMachine`**: Representam as máquinas de dobra, com suas características e possíveis *boosts* de desempenho.
* **`Tool` e `Setup`**: Modelam as ferramentas e os procedimentos de setup necessários para cada operação.
* **`Item`**: Representa os tipos de peças a serem produzidos, associados aos setups e operações.
* **`Pallet` e `ManagerPallets`**: Agrupam os itens em pallets e detalham a quantidade de cada item por pallet, permitindo o cálculo preciso do tempo de produção.

Com base nessa modelagem, os algoritmos (AG e ACO) são aplicados para encontrar a sequência ideal de pallets.

### Algoritmos de Otimização

#### Algoritmo Genético (AG)
* **Representação:** Cada solução (indivíduo) é um array que representa a sequência dos pallets.
* **Operadores:** Utiliza operadores de seleção, crossover e mutação para evoluir a população de soluções. No caso específico deste projeto, a mutação envolve a troca aleatória na sequência dos pallets.
* **Função de Aptidão:** Avalia a qualidade de cada sequência com base no tempo total de produção, penalizando setups entre peças diferentes e considerando a produção paralela em máquinas com desempenhos distintos.

#### Algoritmo de Otimização por Colônia de Formigas (ACO)
* **Representação:** Baseia-se em trilhas de feromônio depositadas nos "caminhos" que conectam os pallets, guiando a construção das soluções pelas formigas.
* **Operadores:** Inclui uma regra de transição probabilística para a construção do caminho pelas formigas e uma estratégia de atualização das trilhas de feromônio (evaporação e depósito).
* **Função de Aptidão:** Similar ao AG, avalia a sequência gerada para determinar a qualidade e, consequentemente, a intensidade do feromônio depositado.

## ⚙️ Configuração e Execução

Para rodar a aplicação, siga os passos abaixo:

1.  **Pré-requisitos:** Certifique-se de ter o [Bun](https://bun.sh/) instalado em sua máquina.

2.  **Clonar o Repositório:**
    ```bash
    git clone https://github.com/marcosfavoretti/AlgoritmoGeneticoCargaDobra.git
    cd AlgoritmoGeneticoCargaDobra
    ```

3.  **Instalar Dependências:**
    ```bash
    bun install
    ```

# 4. **Iniciar o Serviço**

## 👉 API REST

Para iniciar o serviço que expõe a interface web e executa os algoritmos, utilize o seguinte comando na raiz do projeto:

```bash
bun src/server.ts
```

Isso iniciará um servidor REST local na porta \`3002\` por padrão. Você poderá acessar a interface em:  
[http://localhost:3002](http://localhost:3002)

>  **Acessar a Interface Web:**
    Abra seu navegador e acesse `http://localhost:3002`. Ao acessar essa URL, os algoritmos serão executados internamente com os dados de teste pré-configurados, e a solução otimizada será exibida na interface.
---

## 👉 CLI

Como alternativa, você pode executar o serviço via linha de comando. As respostas serão exibidas diretamente no terminal:

```bash
npm run server
```


### Parâmetros dos Algoritmos

Os parâmetros dos algoritmos podem ser ajustados para experimentações futuras. Você pode modificá-los diretamente nas instâncias das classes `GeneticAlgorithmicService` e `AntColonyService` localizadas no arquivo `src/application/FindBestCombination.usecase.ts`.

Os parâmetros utilizados na validação deste trabalho foram:

* **Algoritmo Genético (AG):**
    * Número Máximo de Iterações: 400
    * Tamanho da População: 100 indivíduos
    * Taxa de Mutação: 30%
* **Algoritmo de Otimização por Colônia de Formigas (ACO):**
    * Número Máximo de Iterações: 400
    * Número de Formigas: 100
    * Taxa de Evaporação do Feromônio: 10%

## 📊 Resultados e Desempenho

Os algoritmos foram testados em cenários simulados de operações de dobra, e demonstraram a capacidade de reduzir significativamente o tempo total de processamento. A implementação em TypeScript com Bun apresentou desempenho satisfatório, com tempos de execução adequados para aplicações práticas.

Para mais detalhes sobre os resultados e a análise comparativa entre o Algoritmo Genético e o Algoritmo de Otimização por Colônia de Formigas, por favor, consulte a seção "4. Resultados e Discussões" no artigo completo.


